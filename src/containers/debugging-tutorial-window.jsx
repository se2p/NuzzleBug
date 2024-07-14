import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import DebuggingTutorialCardsComponent from '../components/debuggingTutorial/debuggingTutorialWindow.jsx';
import {dragCard, endDrag, startDrag, close, checkAnswer} from "../reducers/debugging-tutorial";







class DebuggingTutorialCards extends React.Component {

    loadTutorial() {

    }



    backStep() {

    }

    render () {
        return (
            <DebuggingTutorialCardsComponent
                isVisible={this.props.visible}

                {...this.props}
            />
        );
    }
}

DebuggingTutorialCards.propTypes = {
    visible: PropTypes.bool.isRequired,
    isRtl: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    visible: state.scratchGui.debuggingTutorial.visible,
    x: state.scratchGui.debuggingTutorial.x,
    y: state.scratchGui.debuggingTutorial.y,
    dragging: state.scratchGui.debuggingTutorial.dragging,
    isRtl: state.locales.isRtl,
    step: state.scratchGui.debuggingTutorial.step,
    tutorial: state.scratchGui.debuggingTutorial.tutorial,

});

const mapDispatchToProps = dispatch => ({
    onDrag: (e_, data) => dispatch(dragCard(data.x, data.y)),
    onStartDrag: () => dispatch(startDrag()),
    onEndDrag: () => dispatch(endDrag()),
    onClose: () => dispatch(close()),
    onEnterAnswer: () => dispatch(checkAnswer()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DebuggingTutorialCards);
