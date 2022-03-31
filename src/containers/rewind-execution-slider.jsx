import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';

import RewindExecutionSliderComponent from '../components/rewind-execution-slider/rewind-execution-slider.jsx';

class RewindExecutionSlider extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'handleSliderUpdate'
        ]);

        this.min = 0;
        this.max = 0;
        this.value = 0;
    }

    componentDidUpdate (prevProps) {
        if ((!prevProps.paused && this.props.paused) || (prevProps.active !== this.props.active)) {
            this.updateRange();
            this.updateValue();
            this.forceUpdate();
        }
        const newLastTrace = this.props.vm.runtime.newLastTrace;
        if (newLastTrace) {
            const traces = this.props.vm.runtime.traceInfo.tracer.traces;
            const newLastTraceIndex = traces.indexOf(newLastTrace);
            if (this.value !== newLastTraceIndex) {
                this.value = newLastTraceIndex;
                this.forceUpdate();
            }
        }
    }

    updateRange () {
        const traces = this.props.vm.runtime.traceInfo.tracer.traces;
        if (traces.length) {
            this.min = 0;
            this.max = traces.length - 1;
        } else {
            this.min = 0;
            this.max = 0;
        }
    }

    updateValue () {
        if (this.props.vm.runtime.newLastTrace) {
            const traces = this.props.vm.runtime.traceInfo.tracer.traces;
            this.value = traces.indexOf(this.props.vm.runtime.newLastTrace);
        } else {
            this.value = this.max;
        }
    }

    handleSliderUpdate (e) {
        this.value = Number(e.target.value);
        this.props.vm.rewindExecution(this.value);
    }

    render () {
        return (
            <RewindExecutionSliderComponent
                active={this.props.active}
                paused={this.props.paused}
                min={this.min}
                max={this.max}
                value={this.value}
                onSliderUpdate={this.handleSliderUpdate}
            />
        );
    }
}

RewindExecutionSlider.propTypes = {
    active: PropTypes.bool,
    paused: PropTypes.bool,
    vm: PropTypes.instanceOf(VM)
};

const mapStateToProps = state => ({
    active: state.scratchGui.vmStatus.running,
    paused: state.scratchGui.vmStatus.paused,
    vm: state.scratchGui.vm
});

export default connect(mapStateToProps)(RewindExecutionSlider);
