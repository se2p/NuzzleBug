import React from 'react';
import PropTypes from 'prop-types';
import Step from '../components/tutorial/tutorial-step.jsx';
import Success from '../components/tutorial/tutorial-success.jsx';
import Intro from '../components/tutorial/tutorial-intro.jsx';
import {connect} from 'react-redux';
import VirtualMachine from 'scratch-vm';
import downloadBlob from '../lib/download-blob';

import {homeMenu} from '../reducers/tutorial-cards';
import {
    expandSolution,
    fail,
    nextTutorialStep,
    reset,
    success,
    testNextStep,
    testStarted,
    testStopped
} from '../reducers/tutorial-step';
import {lock, unlock} from '../reducers/vm-status';

import {runTest} from 'tutorial-tests';
import * as tutorials from 'tutorial-tests/src/tutorials';

import successImageEN from '../components/tutorial/greatDoneEN.png';
import successImageDE from '../components/tutorial/greatDoneDE.png';
import styles from '../components/tutorial/tutorial-cards.css';

class TutorialStep extends React.Component {
    constructor (props) {
        super(props);
        this.handleHome = this.handleHome.bind(this);
        this.test = this.test.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
        this.next = this.next.bind(this);
        //this.requestHints = this.requestHints.bind(this);
    }

    /**
     * Contacts the server to fetch new hints for the current program.
     *
     * Also deletes old block comments beforehand.
     * @return {*} the hints object fetched from the server.
     */
    // requestHints () {
    //     const program = this.props.toJson();
    //     const url = 'http://localhost:8080/tutorial-system/checker/generate-feedback';
    //     const jsonBody = JSON.stringify({
    //         language: 'GERMAN',
    //         detectors: 'default',
    //         program: JSON.parse(program)
    //     });
    //     fetch(url, {
    //         method: 'POST',
    //         headers: new Headers({'content-type': 'application/json'}),
    //         referrerPolicy: 'origin-when-cross-origin',
    //         body: jsonBody
    //     }).then(
    //         value => console.log(value.text()),
    //         error => {
    //             console.log(error);
    //         }
    //     );
    // }

    sendHttpRequest (url, method, headers, jsonBody) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, false);
        xhr.setRequestHeader('Content-Type', 'application/json');

        for (const header in headers) {
            if (headers.hasOwnProperty(header)) {
                xhr.setRequestHeader(header, headers[header]);
            }
        }

        xhr.send(jsonBody);

        if (xhr.status === 200) {
            return JSON.parse(xhr.responseText);
        }
        throw new Error('Network response was not ok.');

    }

    requestHints () {
        const program = this.props.toJson();
        const url = 'http://localhost:8080/tutorial-system/checker/generate-feedback';
        const jsonBody = JSON.stringify({
            language: 'GERMAN',
            detectors: 'default',
            program: JSON.parse(program)
        });
        try {
            const response = this.sendHttpRequest(url, 'POST', {}, jsonBody);
            console.log(response);
            return response;
        } catch (error) {
            console.error('Error:', error);
        }
        // return fetch(url, {
        //     method: 'POST',
        //     headers: new Headers({'content-type': 'application/json'}),
        //     referrerPolicy: 'origin-when-cross-origin',
        //     body: jsonBody
        // })
        //     .then(
        //         response => {
        //             if (response.ok) {
        //                 return response.json();
        //             }
        //             throw new Error('Network response was not ok.');
        //         }
        //     )
        //     .catch(
        //         error => {
        //             console.log('Error:', error);
        //         }
        //     );
    }

    onCodeQualityHintGeneration () {
        this.hints = this.requestHints();
    }

    processSteps () {
        const steps = [];
        const tutorial = tutorials[`${this.props.tutorial}`];
        const messages = this.props.tutorialMessages;
        for (let i = 1; i <= tutorial.totalSteps - 1; i++) {
            let image = tutorial[`imageSolution${this.props.locale.toUpperCase()}${i}`];
            if (typeof image === 'undefined') {
                image = tutorial[`imageSolutionEN${i}`];
            }
            steps.push({
                title: messages[`titleStep${i}`],
                message1: messages[`messageStep${i}`],
                img: tutorial[`imageStep${i}`],
                message2: messages[`message2Step${i}`],
                solution: {
                    message: messages[`solutionStep${i}`],
                    img: image
                }
            });

        }
        return steps;
    }

    processDownloads () {
        const downloads = [];
        const tutorial = tutorials[`${this.props.tutorial}`];
        const messages = this.props.tutorialMessages;
        for (let i = 1; i <= tutorial.totalDownloads; i++) {
            downloads.push({
                title: messages[`download${i}`],
                content: tutorial[`downloadContent${i}`]
            });
        }
        return {
            title: messages.title,
            message: messages.downloadMessage,
            download: downloads
        };
    }

    setFailureMessages (step, messageID) {
        const messages = this.props.tutorialMessages;
        let hint = '';
        if (step <= this.props.step) {
            hint = messages.stepBefore1.concat(step)
                .concat(messages.stepBefore2);
        }
        hint = hint.concat(messages.hintMessage)
            .concat(messages[messageID]);
        this.props.failed(hint);
    }

    test () {
        if (this.props.step > this.props.testedSteps) {
            this.props.incTest();
        }
        this.props.testStarted();
        this.props.lockVM();
        const summary = runTest(this.props.vm, this.props.tutorial, this.props.step);
        summary.then(result => {
            this.props.unlockVM();
            this.props.testStopped();
            if (result.passed) {
                //this.hints = this.requestHints();
                this.props.succeeded();
            } else {
                //this.hints = this.requestHints();
                console.log(`Failed test: ${result.messageId}`);
                this.setFailureMessages(result.step, result.messageId);
            }
        })
            .catch(error => {
                console.log(`Test execution crashed: ${error}`);
                this.props.unlockVM();
                this.props.testStopped();
            });
    }

    handleDownload (name, content) {
        const img = new Image();
        img.src = content;
        const c = document.createElement('canvas');
        const ctx = c.getContext('2d');

        img.onload = function () {
            c.width = this.naturalWidth;
            c.height = this.naturalHeight;
            ctx.drawImage(this, 0, 0);
            c.toBlob(blob => {
                downloadBlob(name.concat('.png'), blob);
            }, 'image/png', 1);
        };
    }

    next () {
        this.props.nextTutorialStep();
        this.props.nextStep();
    }

    handleHome () {
        this.props.onReset();
        this.props.onHome();
    }

    render () {
        // true, if this content was tested at least one time.
        const tested = this.props.step <= this.props.testedSteps;

        // true, if the shown content is the current content of the tutorial.
        const isCurrentStep = this.props.currentTutorialStep <= this.props.step;

        // true, if the test(s) was/were successful or the content already has been finished.
        const stepSucceeded = isCurrentStep ? this.props.stepSucceeded : true;

        const steps = this.processSteps();

        const downloads = this.processDownloads();

        const guiMessages = this.props.guiMessages;

        return (
            <>
                <div
                    onClick={this.next}
                    className={styles.skipLink}
                >
                    skip
                </div>
                {this.props.step === 0 ?
                    <Intro
                        content={downloads}
                        onDownload={this.handleDownload}
                        downloadButtonTitle={guiMessages.downloadButtonTitle}
                    /> : null}
                <Step
                    content={steps[this.props.step]}
                    tested={tested}
                    currentlyTesting={this.props.currentlyTesting}
                    success={stepSucceeded}
                    testButtonVisible={isCurrentStep}
                    testButtonTitle={this.props.stepSucceeded ? guiMessages.continueButtonTitle :
                        guiMessages.testButtonTitle}
                    codeQualityButtonTitle={'Codequalität prüfen'} // TODO in dictionary auslagern
                    onCodeQualityHintGeneration={this.onCodeQualityHintGeneration()}
                    onTest={this.props.stepSucceeded ? this.next : this.test}
                    solutionVisible={!isCurrentStep || this.props.failedTimes >= 3}
                    generatedHints={JSON.stringify(this.hints)}
                    {...this.props}
                />
                {this.props.step + 1 === this.props.totalSteps &&
                    <Success
                        content={{
                            title: this.props.tutorialMessages.successTitle,
                            message: this.props.tutorialMessages.successMsg,
                            img: this.props.locale === 'de' ? successImageDE : successImageEN
                        }}
                        onHome={this.handleHome}
                        homeButtonTitle={guiMessages.homeButtonTitle}
                    />
                }
            </>
        );
    }
}

TutorialStep.propTypes = {
    guiMessages: PropTypes.objectOf(PropTypes.string),
    tutorial: PropTypes.string.isRequired,
    totalSteps: PropTypes.number.isRequired,
    tutorialMessages: PropTypes.objectOf(PropTypes.string),
    step: PropTypes.number.isRequired,
    testedSteps: PropTypes.number.isRequired,
    currentTutorialStep: PropTypes.number.isRequired,
    currentlyTesting: PropTypes.bool.isRequired,
    stepSucceeded: PropTypes.bool.isRequired,
    failedTimes: PropTypes.number.isRequired,
    onHome: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    incTest: PropTypes.func.isRequired,
    testStarted: PropTypes.func.isRequired,
    testStopped: PropTypes.func.isRequired,
    nextTutorialStep: PropTypes.func.isRequired,
    nextStep: PropTypes.func.isRequired,
    failed: PropTypes.func.isRequired,
    succeeded: PropTypes.func.isRequired,
    lockVM: PropTypes.func,
    unlockVM: PropTypes.func,
    locale: PropTypes.string.isRequired,
    toJson: PropTypes.func,
    vm: PropTypes.instanceOf(VirtualMachine).isRequired
};

const mapStateToProps = state => ({
    tutorial: state.scratchGui.tutorialCards.tutorial,
    totalSteps: state.scratchGui.tutorialCards.totalSteps,
    stepSucceeded: state.scratchGui.tutorialStep.success,
    testedSteps: state.scratchGui.tutorialStep.testedStep,
    currentTutorialStep: state.scratchGui.tutorialStep.currentStep,
    currentlyTesting: state.scratchGui.tutorialStep.currentlyTesting,
    failureMessage: state.scratchGui.tutorialStep.failureMessage,
    failedTimes: state.scratchGui.tutorialStep.failedTimes,
    solutionExpanded: state.scratchGui.tutorialStep.solutionExpanded,
    locale: state.locales.locale,
    toJson: state.scratchGui.vm.toJSON.bind(state.scratchGui.vm)
});

const mapDispatchToProps = dispatch => ({
    onHome: () => dispatch(homeMenu()),
    onReset: () => dispatch(reset()),
    incTest: () => dispatch(testNextStep()),
    testStarted: () => dispatch(testStarted()),
    testStopped: () => dispatch(testStopped()),
    nextTutorialStep: () => dispatch(nextTutorialStep()),
    succeeded: () => dispatch(success()),
    failed: failureMessage => dispatch(fail(failureMessage)),
    onSolution: () => dispatch(expandSolution()),
    lockVM: () => dispatch(lock()),
    unlockVM: () => dispatch(unlock())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TutorialStep);
