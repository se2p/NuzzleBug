import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import logging from 'scratch-vm/src/util/logging.js';
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
        if ((!prevProps.paused && this.props.paused) || (prevProps.active !== this.props.active) ||
            (!prevProps.enabled && this.props.enabled) || prevProps.projectChanged !== this.props.projectChanged) {
            this.updateRange();
            this.updateValue();
            this.forceUpdate();
        }
        const newLastTrace = this.props.vm.runtime.newLastTrace;
        const traces = this.props.vm.runtime.traceInfo.tracer.traces;
        const newLastTraceIndex = newLastTrace ? traces.indexOf(newLastTrace) : traces.length - 1;
        if (this.value !== newLastTraceIndex) {
            this.value = newLastTraceIndex;
            this.forceUpdate();
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
        if (logging.isActive()) {
            logging.logClickEvent('BUTTON', new Date(), 'REWIND_EXECUTION_SLIDER_CHANGE', null);
        }
    }

    render () {
        return (
            <div>
                {this.props.enabled ?
                    <RewindExecutionSliderComponent
                        active={this.props.active}
                        paused={this.props.paused}
                        min={this.min}
                        max={this.max}
                        value={this.value}
                        onSliderUpdate={this.handleSliderUpdate}
                    /> : null
                }
            </div>
        );
    }
}

RewindExecutionSlider.propTypes = {
    active: PropTypes.bool,
    paused: PropTypes.bool,
    enabled: PropTypes.bool,
    projectChanged: PropTypes.bool,
    vm: PropTypes.instanceOf(VM)
};

const mapStateToProps = state => ({
    active: state.scratchGui.vmStatus.running,
    paused: state.scratchGui.vmStatus.paused,
    enabled: state.scratchGui.irDebugger.enabled && state.scratchGui.irDebugger.supported,
    vm: state.scratchGui.vm,
    projectChanged: state.scratchGui.projectChanged
});

export default connect(mapStateToProps)(RewindExecutionSlider);
