import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import VirtualMachine from 'scratch-vm';

import {
    closeCards,
    disableCards,
    dragCard,
    enableCards,
    endDrag,
    nextStep,
    prevStep,
    resetStep,
    shrinkExpandCards,
    startDrag,
    selectTutorial,
    homeMenu
} from '../reducers/tutorial-cards';
import TutorialCardsComponent from '../components/tutorial/tutorial-cards.jsx';
import * as tutorials from 'tutorial-tests/src/tutorials';

class TutorialCards extends React.Component {
    constructor (props) {
        super(props);
        this.cancel = false;
    }

    processTutorials () {
        const rows = [];
        for (let i = 0; i < Object.values(tutorials).length; i++) {
            const element = Object.values(tutorials)[i];
            const messages = this.props.locale === 'de' ? element.messagesDE : element.messagesEN;
            const tutorialTitle = Object.values(messages)[0].title;
            rows.push({
                id: element.id,
                title: tutorialTitle,
                img: element.img,
                difficulty: element.difficulty,
                totalSteps: element.totalSteps
            }
            );
        }
        return rows;
    }

    processSteps () {
        const steps = [];
        if (this.props.selectedTutorial !== '') {
            // eslint-disable-next-line react/prop-types,import/namespace
            const tutorial = tutorials[`${this.props.selectedTutorial}`];

            for (let i = 1; i <= tutorial.totalSteps; i++) {
                const messagesContainer = this.props.locale === 'de' ? tutorial.messagesDE : tutorial.messagesEN;
                const messages = Object.values(messagesContainer)[0];
                steps.push({
                    title: messages[`titleStep${i}`],
                    message1: messages[`messageStep${i}`],
                    img: tutorial[`imageStep${i}`],
                    message2: messages[`message2Step${i}`]
                });
            }
        }
        return steps;
    }

    render () {
        const testTutorials = this.processTutorials();
        const steps = this.processSteps();
        const title = 'Tutorial';

        let tutorialMessages;

        if (this.props.selectedTutorial !== '') {
            // eslint-disable-next-line react/prop-types,import/namespace
            const messages = this.props.locale === 'de' ? tutorials[`${this.props.selectedTutorial}`].messagesDE :
            // eslint-disable-next-line import/namespace,react/prop-types
                tutorials[`${this.props.selectedTutorial}`].messagesEN;
            tutorialMessages = Object.values(messages)[0];
        }

        return (
            <TutorialCardsComponent
                tutorials={testTutorials}
                tutorialMessagesTest={tutorialMessages}
                title={title}
                steps={steps}
                {...this.props}
            />
        );
    }
}

TutorialCards.propTypes = {
    visible: PropTypes.bool.isRequired,
    selectedTutorial: PropTypes.string.isRequired,
    onCloseCards: PropTypes.func.isRequired,
    onEnableCards: PropTypes.func.isRequired,
    onDisableCards: PropTypes.func.isRequired,
    onResetStep: PropTypes.func.isRequired,
    onSelectTutorial: PropTypes.func.isRequired,
    onHomeMenu: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    step: PropTypes.number.isRequired,
    vm: PropTypes.instanceOf(VirtualMachine).isRequired
};

const mapStateToProps = state => ({
    visible: state.scratchGui.tutorialCards.visible,
    isMenuVisible: state.scratchGui.tutorialCards.menu,
    selectedTutorial: state.scratchGui.tutorialCards.tutorial,
    tutorial: state.scratchGui.tutorialCards.tutorial,
    step: state.scratchGui.tutorialCards.step,
    currentTutorialStep: state.scratchGui.tutorialCards.currentTutorialStep,
    totalSteps: state.scratchGui.tutorialCards.totalSteps,
    expanded: state.scratchGui.tutorialCards.expanded,
    x: state.scratchGui.tutorialCards.x,
    y: state.scratchGui.tutorialCards.y,
    locale: state.locales.locale,
    dragging: state.scratchGui.tutorialCards.dragging
});

const mapDispatchToProps = dispatch => ({
    onCloseCards: () => dispatch(closeCards()),
    onEnableCards: () => dispatch(enableCards()),
    onDisableCards: () => dispatch(disableCards()),
    onShrinkExpandCards: () => dispatch(shrinkExpandCards()),
    onNextStep: () => dispatch(nextStep()),
    onPrevStep: () => dispatch(prevStep()),
    onResetStep: step => dispatch(resetStep(step)),
    onDrag: (e_, data) => dispatch(dragCard(data.x, data.y)),
    onStartDrag: () => dispatch(startDrag()),
    onEndDrag: () => dispatch(endDrag()),
    onSelectTutorial: (tutorial, totalSteps) => dispatch(selectTutorial(tutorial, totalSteps)),
    onHomeMenu: () => dispatch(homeMenu())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TutorialCards);
