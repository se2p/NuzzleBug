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
} from '../reducers/tutorial-cards';
import {reset} from '../reducers/tutorial-step';

import * as messagesEN from '../lib/libraries/tutorial-messages-en.js';

import TutorialCardsComponent from '../components/tutorial/tutorial-cards.jsx';
import * as tutorials from 'tutorial-tests/src/tutorials';

class TutorialCards extends React.Component {
    constructor (props) {
        super(props);
        this.handleHome = this.handleHome.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.handleStartTutorial = this.handleStartTutorial.bind(this);
        this.myRef = null;
    }

    processTutorials () {
        const rows = [];
        const values = Object.values(tutorials);
        for (let i = 0; i < values.length; i++) {
            const tutorial = values[i];

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

    handleHome () {
        // Go to the tutorialOverview (Home) if the button was clocked in the DebuggingOverview or
        // the tutorialStep, otherwise go to the DebuggingOverview.
        if (this.props.contentType === "DEBUGGING_STEP") {
            this.props.onSetContentType("TUTORIAL_SELECTED");
        } else if (this.props.contentType === "DEBUGGING_HELP") {
            this.props.onSetContentType("DEBUGGING_STEP");
        } else {
            this.props.onReset();
            this.props.onHome();
        }
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
        console.log("starting tutorial")
        this.props.startTutorial();
    }

    scrollToBottom() {
        this.myRef.scrollTop = this.myRef.scrollHeight; //TODO NUTZEN!!!!!!!!!!
    }

    render () {
        const tutorialsData = this.processTutorials();

        let tutorialMessages;
        let tutorial;

        if (this.props.selectedTutorial !== '') {
            tutorial = tutorials[`${this.props.selectedTutorial}`];
            let messages = tutorial[`messages${this.props.locale.toUpperCase()}`];
            if (typeof messages === 'undefined') {
                messages = tutorial.messagesEN;
            }
            tutorialMessages = messages.default;
        }
        console.log("selected: " + this.props.selectedTutorial + "  /  " + JSON.stringify(tutorial))

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
                onNextStep={this.handleNext}
                onPrevStep={this.handlePrev}
                tutorialIndexData={tutorial}
                onStartTutorial={this.handleStartTutorial}
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
    onHome: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    isRtl: PropTypes.bool.isRequired,
    step: PropTypes.number.isRequired,
    contentType: PropTypes.string,
    vm: PropTypes.instanceOf(VirtualMachine).isRequired,
    startTutorial: PropTypes.func,
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
    contentType: state.scratchGui.tutorialCards.contentType,
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
    onSetContentType: (contentType) => dispatch(setContentType(contentType)),
    startTutorial: () => dispatch(onStartTutorial()),
    onOpenHelp: () => dispatch(onOpenHelp()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TutorialCards);
