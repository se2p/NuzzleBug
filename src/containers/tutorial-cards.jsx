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
    startDrag
} from '../reducers/tutorial-cards';
import TutorialCardsComponent from '../components/tutorial/tutorial-cards.jsx';
import {tutorialMessages} from '../lib/libraries/tutorial-messages';

class TutorialCards extends React.Component {
    constructor (props) {
        super(props);
        this.cancel = false;
    }

    render () {
        const title = {msg: tutorialMessages.header};

        return (
            <TutorialCardsComponent
                title={title}
                totalSteps={2} // TODO calculate total steps
                {...this.props}
            />
        );
    }
}

TutorialCards.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCloseCards: PropTypes.func.isRequired,
    onEnableCards: PropTypes.func.isRequired,
    onDisableCards: PropTypes.func.isRequired,
    onResetStep: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    step: PropTypes.number.isRequired,
    vm: PropTypes.instanceOf(VirtualMachine).isRequired
};

const mapStateToProps = state => ({
    visible: state.scratchGui.tutorialCards.visible,
    step: state.scratchGui.tutorialCards.step,
    expanded: state.scratchGui.tutorialCards.expanded,
    x: state.scratchGui.tutorialCards.x,
    y: state.scratchGui.tutorialCards.y,
    isRtl: state.locales.isRtl,
    locale: state.locales.locale,
    dragging: state.scratchGui.tutorialCards.dragging,
    saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm)
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
    onEndDrag: () => dispatch(endDrag())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TutorialCards);
