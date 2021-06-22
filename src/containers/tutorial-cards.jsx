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
    homeMenu
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
        this.myRef = null;
    }

    processTutorials () {
        const rows = [];
        for (let i = 0; i < Object.values(tutorials).length; i++) {
            const element = Object.values(tutorials)[i];

            let messages = element[`messages${this.props.locale.toUpperCase()}`];
            if (typeof messages === 'undefined') {
                messages = element.messagesEN;
            }
            const tutorialMsg = messages.default;
            rows.push({
                id: element.id,
                title: tutorialMsg.title,
                img: element.img,
                difficulty: element.difficulty,
                difficultyMsg: tutorialMsg.difficulty,
                totalSteps: element.totalSteps
            }
            );
        }
        return rows;
    }

    handleHome () {
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

    render () {
        const tutorialsData = this.processTutorials();

        let tutorialMessages;

        if (this.props.selectedTutorial !== '') {
            const tutorial = tutorials[`${this.props.selectedTutorial}`];
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
            guiMessagesContainer = messagesEN;
        }
        const guiMessages = guiMessagesContainer.default;

        const title = this.props.isMenuVisible ? guiMessages.headerTitle : tutorialMessages.title;
        const homeButtonTitle = guiMessages.homeButtonTitle;

        return (
            <TutorialCardsComponent
                /* eslint-disable-next-line react/jsx-no-bind */
                cardRef={ref => (this.myRef = ref)}
                tutorials={tutorialsData}
                guiMessages={guiMessages}
                tutorialMessages={tutorialMessages}
                title={title}
                homeButtonTitle={homeButtonTitle}
                onHomeMenu={this.handleHome}
                onNextStep={this.handleNext}
                onPrevStep={this.handlePrev}
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
    vm: PropTypes.instanceOf(VirtualMachine).isRequired
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
    dragging: state.scratchGui.tutorialCards.dragging
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
    onReset: () => dispatch(reset())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TutorialCards);
