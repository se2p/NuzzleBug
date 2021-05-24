import React from 'react';
import PropTypes from 'prop-types';
import Step from '../components/tutorial/tutorial-step.jsx';
import {connect} from 'react-redux';

import {
    testNextStep,
    nextTutorialStep
} from '../reducers/tutorial-cards';

class TutorialStep extends React.Component {
    constructor (props) {
        super(props);
        this.success = false;
    }

    test = () => {
        this.props.handleTest();
        this.success = true;
    }

    next = () => {
        this.props.nextStep();
        this.success = false;
    }

    render () {
        return (
            <Step
                tested={this.props.index <= this.props.testedStep}
                success={this.props.currentTutorialStep > this.props.index ? true : this.success}
                testButtonVisible={this.props.currentTutorialStep <= this.props.index}
                onTest={this.success ? this.next : this.test}
                {...this.props}
            />
        );
    }
}
TutorialStep.propTypes = {
    step: PropTypes.shape({
        title: PropTypes.string.isRequired,
        message1: PropTypes.string.isRequired,
        img: PropTypes.node.isRequired,
        message2: PropTypes.string.isRequired
    }),
    index: PropTypes.number.isRequired,
    handleTest: PropTypes.func.isRequired,
    nextStep: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    testedStep: state.scratchGui.tutorialCards.testedStep,
    currentTutorialStep: state.scratchGui.tutorialCards.currentTutorialStep
});


const mapDispatchToProps = dispatch => ({
    handleTest: () => dispatch(testNextStep()),
    nextStep: () => dispatch(nextTutorialStep())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TutorialStep);
