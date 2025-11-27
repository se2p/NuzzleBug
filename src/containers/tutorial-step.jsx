import React from 'react';
import PropTypes from 'prop-types';
import Step from '../components/tutorial/tutorial-card-step/step.jsx';
import {connect} from 'react-redux';
import VirtualMachine from 'scratch-vm';
import downloadBlob from '../lib/download-blob';
import {homeMenu} from '../reducers/tutorial-cards';
import {
    expandSolution, fail, nextTutorialStep, reset, success, testNextStep, testStarted, testStopped
} from '../reducers/tutorial-step';
import {lock, unlock} from '../reducers/vm-status';
import {runTest} from 'tutorial-tests';
import * as tutorials from 'tutorial-tests/src/tutorials';
import {runLitterBoxAnalysis} from './litterbox-web-api.ts';

import successImageEN from '../components/tutorial/images/greatDoneEN.png';
import successImageDE from '../components/tutorial/images/greatDoneDE.png';

import logging from 'scratch-vm/src/util/logging.js';
import JSZip from 'jszip';

class TutorialStep extends React.Component {
    constructor (props) {
        super(props);
        this.handleHome = this.handleHome.bind(this);
        this.test = this.test.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
        this.next = this.next.bind(this);
        this.onCodeQualityHintGeneration = this.onCodeQualityHintGeneration.bind(this);
        this.state = {
            hints: [],
            details: [],
            isAutoSaving: false
        };
        const experimentId = new URL(window.location.href).searchParams.get('expid');
        const userId = new URL(window.location.href).searchParams.get('uid');
        const secret = new URL(window.location.href).searchParams.get('secret');
        logging._experimentId = experimentId;
        logging._userId = userId;
        logging._secret = secret;
        this.autoSave = this.autoSave.bind(this);
    }

    componentDidMount () {
        this.requestHints();
        // activate auto save when logging is enabled
        if (logging.isActive()) {
            setInterval(this.autoSave, 30000);
        }
    }

    onCodeQualityHintGeneration () {
        // first log the click with scratchlog
        if (logging.isActive()) {
            logging.logClickEvent('BUTTON', new Date(), 'CHECK_CODE_QUALITY', null);
        }
        // then start processing the request
        this.requestHints();
    }

    requestHints () {
        const program = this.props.vm.toJSON();
        let detectors = 'default';
        if (this.props.detectors) {
            detectors = this.props.detectors;
        }
        const language = this.props.locale === 'de' ? 'de' : 'en';

        runLitterBoxAnalysis(program, language, detectors)
            .then(hints => hints
                .filter(hint => hint.type !== 'QUESTION')
                .map(hint => ({
                    title: hint.translatedFinderName,
                    description: hint.hint,
                    sprite: hint.sprite,
                    costume: hint.costume,
                    type: hint.type,
                    codeSnippet: hint.scratchBlocksCode
                }))
            )
            .then(hints => {
                this.setState(prev => ({
                    ...prev,
                    hints
                }));
            })
            // eslint-disable-next-line no-unused-vars
            .catch(_ => {});
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
                    message: messages[`solutionStep${i}`], img: image
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
                title: messages[`download${i}`], content: tutorial[`downloadContent${i}`]
            });
        }
        return {
            title: messages.title, img: tutorial.img, message: messages.downloadMessage, download: downloads
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
            .concat(messages[messageID].failureMessage);
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
                this.props.succeeded();
            } else {
                console.log(`Failed test: ${result.messageId}`);
                const details = [];
                const messages = this.props.tutorialMessages;
                for (const element in result.details) {
                    details.push({
                        test: messages[result.details[element].testId].name,
                        result: result.details[element].result,
                        description: messages[result.details[element].testId].description
                    });
                }
                this.setState({
                    hints: this.state.hints,
                    details: details,
                    isAutoSaving: this.state.isAutoSaving
                });
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

    autoSave () {
        // if last save was one min ago, auto save project
        const currentTime = new Date();
        const timeDifference = (currentTime - logging.last_time_saved) / (1000 * 60);
        if (timeDifference >= 1) {
            const projectJson = this.props.toJson();
            const zip = new JSZip();
            zip.file('project.json', projectJson);
            zip.generateAsync({
                type: 'blob',
                mimeType: 'application/x.scratch.sb3',
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 6
                }
            })
                .then(output => {
                    logging.logProject(logging._userId, logging._experimentId, logging._secret, output, currentTime);
                    logging.last_time_saved = currentTime;
                })
                .catch(error => {
                    console.log(error);
                });
        }
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

        const content = steps[this.props.step];

        // const's for props of Step component
        const descriptionProps = {
            intro: {
                content: downloads,
                onDownload: this.handleDownload,
                downloadButtonTitle: guiMessages.downloadButtonTitle
            }
        };
        const currentStepProps = {
            instruction: content ? {
                title: content.title,
                message1: content.message1,
                img: content.img,
                message2: content.message2
            } : undefined,
            isSuccessVisible: this.props.step + 1 === this.props.totalSteps,
            success: {
                content: {
                    title: this.props.tutorialMessages.successTitle,
                    message: this.props.tutorialMessages.successMsg,
                    img: this.props.locale === 'de' ? successImageDE : successImageEN
                },
                onHome: this.handleHome,
                homeButtonTitle: guiMessages.homeButtonTitle
            }
        };
        const testingProps = {
            visible: !!content,
            finishedMessage: (this.props.locale === 'de' ? 'Es gibt nichts mehr zum Testen, du hast das Tutorial schon erfolgreich abgeschlossen. Du kann noch weiter experimentieren und deine Codequalität verbessern.' : 'There is nothing more to test, you have already successfully completed the tutorial. You can continue to experiment and improve your code quality.'),
            isSolutionVisible: !isCurrentStep || this.props.failedTimes >= 3,
            isFailureMessageVisible: tested && !stepSucceeded,
            failureMessage: this.props.failureMessage,
            testing: {
                tested: tested,
                currentlyTesting: this.props.currentlyTesting,
                success: stepSucceeded,
                testButtonVisible: isCurrentStep,
                onTest: this.props.stepSucceeded ? this.next : this.test,
                testButtonTitle: this.props.stepSucceeded ? (this.props.locale === 'de' ? 'Weiter' : 'Next') : (this.props.locale === 'de' ? 'Überprüfen' : 'Check'),
                successMsg: this.props.guiMessages.successMessage,
                failMsg: this.props.guiMessages.failMessage,
                loadingMsg: this.props.guiMessages.loadingMessage
            },
            details: this.state.details,
            isStepPassed: this.props.stepSucceeded
        };
        if (content && content.solution && content.solution.message && content.solution.img) {
            testingProps.solution = {
                title: guiMessages.solutionHeader,
                content: content.solution,
                onSolution: this.props.onSolution,
                solutionExpanded: this.props.solutionExpanded
            };
        }
        const codeQuality = {
            codeQuality: {
                hints: this.state.hints,
                onCodeQualityHintGeneration: this.onCodeQualityHintGeneration,
                codeQualityButtonTitle: this.props.locale === 'de' ? 'Codequalität prüfen' : 'Check Code Quality'
            }
        };

        return (<Step
            description={descriptionProps}
            currentStep={currentStepProps}
            testing={testingProps}
            codeQuality={codeQuality}
            locale={this.props.locale}
        />);
    }
}

TutorialStep.propTypes = {
    guiMessages: PropTypes.objectOf(PropTypes.string),
    tutorial: PropTypes.string.isRequired,
    totalSteps: PropTypes.number.isRequired,
    tutorialMessages: PropTypes.shape({
        failureMessage: PropTypes.string,
        description: PropTypes.string
    }) || PropTypes.objectOf(PropTypes.string),
    step: PropTypes.number.isRequired,
    testedSteps: PropTypes.number.isRequired,
    detectors: PropTypes.string,
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
    solutionExpanded: PropTypes.bool,
    onSolution: PropTypes.func,
    failureMessage: PropTypes.string,
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
    toJson: state.scratchGui.vm.toJSON.bind(state.scratchGui.vm),
    getCostume: state.scratchGui.vm.getCostume.bind(state.scratchGui.vm)
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

export default connect(mapStateToProps, mapDispatchToProps)(TutorialStep);
