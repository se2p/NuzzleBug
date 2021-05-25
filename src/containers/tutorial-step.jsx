import React from 'react';
import PropTypes from 'prop-types';
import Step from '../components/tutorial/tutorial-step.jsx';
import Success from '../components/tutorial/tutorial-success.jsx';
import {connect} from 'react-redux';
import VirtualMachine from 'scratch-vm';

import {
    homeMenu,
    testNextStep,
    nextTutorialStep
} from '../reducers/tutorial-cards';

import {runTest} from 'tutorial-tests';

class TutorialStep extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            success: false,
            failed: 0,
            failureMessage: '',
            solutionExpanded: false,
            finished: false
        };
    }

    setFailureMessages = () => {
        this.setState({failureMessage: 'Hi! Watermelonsuger High!', failed: this.state.failed + 1});
    }

    onExpand = () => {
        this.setState({
            solutionExpanded: !this.state.solutionExpanded
        });
    }

    test = () => {
        if (this.props.index > this.props.testedStep) {
            this.props.handleTest();
        }
        const summary = runTest(this.props.vm, 'boatRace', this.props.index);
        summary.then(result => {
            if (result.passed) {
                this.setState({success: true, failed: 0});
            } else {
                this.setFailureMessages();
            }
        });
    }

    next = () => {
        this.setState({success: false});
        this.props.nextStep();
    }

    render () {
        console.log(this.state.success);
        return (
            this.props.index + 1 === this.props.totalSteps ?
                <Success onHomeMenu={this.props.onHomeMenu} /> :
                <Step
                    tested={this.props.index <= this.props.testedStep}
                    success={this.props.currentTutorialStep > this.props.index ? true : this.state.success}
                    testButtonVisible={this.props.currentTutorialStep <= this.props.index}
                    onTest={this.state.success ? this.next : this.test}
                    failureMessage={this.state.failureMessage}
                    solutionVisible={this.props.currentTutorialStep <= this.props.index && this.state.failed >= 3}
                    solutionExpanded={this.state.solutionExpanded}
                    onSolution={this.onExpand}
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
    nextStep: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VirtualMachine).isRequired
};

const mapStateToProps = state => ({
    totalSteps: state.scratchGui.tutorialCards.totalSteps,
    testedStep: state.scratchGui.tutorialCards.testedStep,
    currentTutorialStep: state.scratchGui.tutorialCards.currentTutorialStep
});


const mapDispatchToProps = dispatch => ({
    onHomeMenu: () => dispatch(homeMenu()),
    handleTest: () => dispatch(testNextStep()),
    nextStep: () => dispatch(nextTutorialStep())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TutorialStep);
