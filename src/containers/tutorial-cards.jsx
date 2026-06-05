import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import VirtualMachine from 'scratch-vm';

import {
    closeCards,
    dragCard,
    endDrag,
    nextStep,
    prevStep,
    shrinkExpandCards,
    startDrag,
    selectTutorial,
    homeMenu,
    setContentType,
    onStartTutorial,
    onOpenHelp,
    setTutorialPoints,
} from '../reducers/tutorial-cards';
import {reset} from '../reducers/tutorial-step';

import * as messagesEN from '../lib/libraries/tutorial-messages-en.js';

import TutorialCardsComponent from '../components/tutorial/tutorial-cards.jsx';
import * as tutorials from 'tutorial-tests/src/tutorials';

import {
    openTutorialCreation
} from '../reducers/modals';

class TutorialCards extends React.Component {
    constructor (props) {
        super(props);
        this.handleHome = this.handleHome.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.tutorialParsed = this.tutorialParsed.bind(this);
        this.handleStartTutorial = this.handleStartTutorial.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.onBackToTutorialSelection = this.onBackToTutorialSelection.bind(this);
        this.myRef = null;
        this.tutorials = tutorials;
    }

    processTutorials () {
        const rows = [];
        for (let i = 0; i < Object.values(this.tutorials).length; i++) {
            const tutorial = Object.values(this.tutorials)[i];
            let messages = tutorial[`messages${this.props.locale.toUpperCase()}`];
            if (typeof messages === 'undefined') {
                messages = tutorial.messagesDE;
            }

            const tutorialMsg = messages.default;
            rows.push({
                id: tutorial.id,
                title: tutorialMsg.title,
                img: tutorial.img,
                difficulty: tutorial.difficulty,
                difficultyMsg: tutorialMsg.difficulty,
                totalSteps: tutorial.totalSteps,
                detectors: tutorial.detectors,
                isDebuggingTutorial: tutorial.isDebuggingTutorial,
            }
            );
        }
        return rows;
    }

    onUpload (event){
        const JSZip = require('jszip');
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                const arrayBuffer = e.target.result;
                JSZip.loadAsync(arrayBuffer).then(zip => {
                    let id = null;
                    const images = {};
                    const sprites = {};
                    const languages = {};
                    const tutorial = {};
                    let index = 0;
                    // ignore folders for content looping
                    const size = Object.values(zip.files).filter(value => !value.dir).length;
                    zip.forEach((relativePath, zipEntry) => {
                        if (!zipEntry.dir) {
                            if (relativePath.split('/')[2] === 'images'){
                                // read images as blobs
                                zipEntry.async('blob').then(content => {
                                    index++;
                                    const pathParts = relativePath.split('/');
                                    const filename = pathParts[pathParts.length - 1];
                                    images[filename] = content;
                                    // create tutorial if everything is read
                                    if (index === size){
                                        tutorial.images = images;
                                        tutorial.messages = languages;
                                        tutorial.sprites = sprites;
                                        this.tutorialParsed(tutorial);
                                    }
                                });
                            } else {
                                // read everything else as string
                                zipEntry.async('string').then(content => {
                                    index++;
                                    const pathParts = relativePath.split('/');
                                    const filename = pathParts[pathParts.length - 1];
                                    if (id === null){
                                        id = pathParts[1];
                                        // eslint-disable-next-line brace-style
                                    }
                                    // index.js
                                    if (filename === 'index.js'){
                                    // global
                                        if (pathParts[0] === 'tutorials'){
                                            tutorial.indexJsGlobal = content;
                                        } else {
                                            tutorial.indexJsTestcases = content;
                                        }
                                    // eslint-disable-next-line brace-style
                                    }
                                    // Messages or Sprites
                                    else if (pathParts.length === 3){
                                    // messages
                                        if (pathParts[0] === 'tutorials'){
                                            languages[filename] = content;
                                        } else {
                                            // sprites
                                            sprites[filename] = content;
                                        }
                                    }
                                    // create tutorial if everything is read
                                    if (index === size){
                                        tutorial.images = images;
                                        tutorial.messages = languages;
                                        tutorial.sprites = sprites;
                                        this.tutorialParsed(tutorial);
                                    }
                                });
                            }
                        }
                    });

                });
            };
            reader.readAsArrayBuffer(file);
        }
    }

    tutorialParsed (tutorial){
        // init tutorial object
        const tutorialObject = {};
        const images = {};


        // parse images
        for (const key of Object.keys(tutorial.images)){
            const url = URL.createObjectURL(tutorial.images[key], {type: 'image/png'});
            if (key.includes('thumbnail')){
                tutorialObject.img = url;
            } else {
                images[key] = url;
            }
        }


        // parse language files
        for (const key of Object.keys(tutorial.messages)){
            let messages = tutorial.messages[key];
            // refine and execute messages object to get the desired information
            messages = messages.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();
            messages = messages.replace('export default', 'const messageObject =');
            const messageFunc = new Function(`${messages}; return messageObject;`);
            // save with key without ".js"
            tutorialObject[key.split('.')[0]] = {default: messageFunc(), _esModule: true};
        }

        // parse indexJs global
        let indexJs = tutorial.indexJsGlobal.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();
        indexJs = indexJs.replace(/require\((.*?)\);/g, '$1');
        indexJs = `
             const exports = {};
             ${indexJs}
             return exports;`;
        const indexJsFunc = new Function(indexJs);
        // Execute the function to get the desired stuff
        const indexJsObject = indexJsFunc();
        tutorialObject.id = indexJsObject.id;
        tutorialObject.difficulty = indexJsObject.difficulty;
        tutorialObject.totalSteps = indexJsObject.totalSteps;
        // downloads are no longer required for new tutorials
        tutorialObject.totalDownloads = 0;
        tutorialObject.uploaded = true;

        // Parse IndexJs for Tests
        let indexJsTest = tutorial.indexJsTestcases.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();
        indexJsTest = indexJsTest.replace('export default', 'exports.default =');
        // remove sprites (not needed)
        const spriteIndex = indexJsTest.indexOf('sprites');
        const closingSprite = indexJsTest.indexOf(']', spriteIndex);
        indexJsTest = indexJsTest.slice(0, spriteIndex - 1) + indexJsTest.slice(closingSprite + 1);
        // wrap in callable object
        indexJsTest = `
             const exports = {};
             ${indexJsTest}
             return exports;`;
        const indexJsTestFunc = new Function(indexJsTest);
        // Execute the function to get the desired stuff
        const indexJsTestObject = indexJsTestFunc();
        // set steps and sprites
        tutorialObject.steps = indexJsTestObject.default.steps;
        tutorialObject.sprites = tutorial.sprites;

        // set all other images
        for (const key in indexJsObject){
            if (key.includes('image')){
                const keyParts = indexJsObject[key].split('/');
                tutorialObject[key] = images[keyParts[keyParts.length - 1]];
            }
        }

        // push created tutorial
        this.tutorials[tutorialObject.id] = tutorialObject;
        this.setState({});
    }

    handleHome () {
        if (this.props.contentType === "DEBUGGING_STEP") {
            this.props.onSetContentType("TUTORIAL_SELECTED");
        } else if (this.props.contentType === "DEBUGGING_HELP") {
            this.props.onSetContentType("DEBUGGING_STEP");
        } else {
            this.props.onReset();
            this.props.onHome();
        }
    }

    onBackToTutorialSelection() {
        this.props.onReset();
        this.props.onHome();
    }

    handlePrev () {
        this.props.prevStep();
        this.myRef.scrollTop = 0;
    }

    handleNext () {
        this.props.nextStep();
        this.myRef.scrollTop = 0;
    }

    handleStartTutorial() {
        this.props.startTutorial();
    }

    scrollToBottom = () => {
        requestAnimationFrame(() => {
            if (this.myRef) {
                this.myRef.scrollTop = this.myRef.scrollHeight;
            }
        });
    }

    render () {
        const tutorialsData = this.processTutorials();

        let tutorialMessages;
        let tutorial;

        if (this.props.selectedTutorial !== '') {
            tutorial = this.tutorials[`${this.props.selectedTutorial}`];
            let messages = tutorial[`messages${this.props.locale.toUpperCase()}`];
            if (typeof messages === 'undefined') {
                messages = tutorial.messagesEN;
            }
            tutorialMessages = messages.default;
        }

        let guiMessagesContainer;
        try {
            guiMessagesContainer =
                require(`../lib/libraries/tutorial-messages-${this.props.locale}.js`);
        } catch (e) {
            console.error(e);
            guiMessagesContainer = messagesEN;
        }
        const guiMessages = guiMessagesContainer.default;

        const title = this.props.isMenuVisible ? guiMessages.headerTitle : tutorialMessages.title;
        const homeButtonTitle = guiMessages.homeButtonTitle;
        const backButtonTitle = guiMessages.backButtonTitle;

        return (
            <TutorialCardsComponent
                /* eslint-disable-next-line react/jsx-no-bind */
                cardRef={ref => (this.myRef = ref)}
                tutorials={tutorialsData}
                selectedTutorial={this.props.selectedTutorial}
                guiMessages={guiMessages}
                tutorialMessages={tutorialMessages}
                title={title}
                homeButtonTitle={homeButtonTitle}
                backButtonTitle={backButtonTitle}
                onHomeMenu={this.handleHome}
                onUpload={this.onUpload}
                onCreateTutorial={this.props.handleCreationClick}
                onNextStep={this.handleNext}
                onPrevStep={this.handlePrev}
                tutorialIndexData={tutorial}
                onStartTutorial={this.handleStartTutorial}
                onScrollBottom={this.scrollToBottom}
                onBackToTutorialSelection={this.onBackToTutorialSelection}
                setTutorialPoints={setTutorialPoints}
                {...this.props}
            />
        );
    }
}

TutorialCards.propTypes = {
    visible: PropTypes.bool.isRequired,
    isMenuVisible: PropTypes.bool.isRequired,
    selectedTutorial: PropTypes.string.isRequired,
    prevStep: PropTypes.func.isRequired,
    nextStep: PropTypes.func.isRequired,
    onCloseCards: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onSelectTutorial: PropTypes.func.isRequired,
    handleCreationClick: PropTypes.func,
    onHome: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    isRtl: PropTypes.bool.isRequired,
    step: PropTypes.number.isRequired,
    contentType: PropTypes.string,
    vm: PropTypes.instanceOf(VirtualMachine).isRequired,
    startTutorial: PropTypes.func,
    onBackToTutorialSelection: PropTypes.func,
    setMouseEnabled: PropTypes.func,
    tutorialPoints: PropTypes.number,
    setTutorialPoints: PropTypes.func,
};

const mapStateToProps = state => ({
    visible: state.scratchGui.tutorialCards.visible,
    isMenuVisible: state.scratchGui.tutorialCards.menu,
    selectedTutorial: state.scratchGui.tutorialCards.tutorial,
    totalSteps: state.scratchGui.tutorialCards.totalSteps,
    step: state.scratchGui.tutorialCards.step,
    currentTutorialStep: state.scratchGui.tutorialStep.currentStep,
    expanded: state.scratchGui.tutorialCards.expanded,
    x: state.scratchGui.tutorialCards.x,
    y: state.scratchGui.tutorialCards.y,
    locale: state.locales.locale,
    isRtl: state.locales.isRtl,
    dragging: state.scratchGui.tutorialCards.dragging,
    uploadedTutorial: state.uploadedTutorial,
    contentType: state.scratchGui.tutorialCards.contentType,
    tutorialPoints: state.scratchGui.tutorialCards.tutorialPoints,
});

const mapDispatchToProps = dispatch => ({
    onCloseCards: () => dispatch(closeCards()),
    onShrinkExpandCards: () => dispatch(shrinkExpandCards()),
    nextStep: () => dispatch(nextStep()),
    prevStep: () => dispatch(prevStep()),
    onDrag: (e_, data) => dispatch(dragCard(data.x, data.y)),
    onStartDrag: () => dispatch(startDrag()),
    onEndDrag: () => dispatch(endDrag()),
    onSelectTutorial: (tutorial, totalSteps) => dispatch(selectTutorial(tutorial, totalSteps)),
    onHome: () => dispatch(homeMenu()),
    onReset: () => dispatch(reset()),
    handleCreationClick: () => dispatch(openTutorialCreation()),
    onSetContentType: (contentType) => dispatch(setContentType(contentType)),
    startTutorial: () => dispatch(onStartTutorial()),
    onOpenHelp: () => dispatch(onOpenHelp()),
    setTutorialPoints: (points) => dispatch(setTutorialPoints(points)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TutorialCards);
