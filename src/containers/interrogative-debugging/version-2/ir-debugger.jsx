import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import {intlShape} from 'react-intl';

import VirtualMachine from 'scratch-vm';
import {QuestionProvider} from 'scratch-ir';

import IRDebuggerComponent from '../../../components/interrogative-debugging/version-2/ir-debugger/ir-debugger.jsx';
import {
    disableDebugger,
    closeDebugger,
    shrinkExpandDebugger,
    startDragDebugger,
    dragDebugger,
    endDragDebugger
} from '../../../reducers/interrogative-debugging/version-2/ir-debugger';

class IRDebugger extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'calculateQuestionHierarchy',
            'setTargetOption',
            'rerender'
        ]);
        this.cancel = false;
        this.calculateQuestionHierarchy();
    }

    calculateQuestionHierarchy () {
        if (!this.props.visible) {
            this.cancel = true;
            return;
        }

        const vm = this.props.vm;
        if (this.props.vm.runtime.traceInfo.isEmpty()) {
            this.props.onClose();
            this.props.onDisable();
            this.cancel = true;
            return;
        }

        this.targetOrigin = vm.runtime.targets.find(target => target.id === this.props.targetOriginId);
        let trace = vm.runtime.traceInfo.tracer.traces;
        if (vm.runtime.questionGeneration.active) {
            trace = trace.slice(vm.runtime.questionGeneration.traceStart);
        } else {
            trace = trace.slice(vm.runtime.questionGeneration.traceStart, vm.runtime.questionGeneration.traceEnd);
        }

        this.targetOptions = this.calculateTargetOptions(trace);
        if (!this.target) {
            this.setTargetOption(this.targetOptions[0]);
        }
        if (!this.target.isOriginal) {
            trace = trace.filter(t => t.targetsInfo[this.target.id]);
        }

        const translate = (id, values) => this.props.intl.formatMessage({id: `gui.ir-debugger.${id}`}, values);
        const questionProvider = new QuestionProvider(vm, trace, this.target, translate);
        this.questionHierarchy = questionProvider.generateQuestionHierarchy();
    }

    calculateTargetOptions (trace) {
        const targetOptions = [{
            id: this.targetOrigin.id,
            optionName: this.props.intl.formatMessage({id: 'gui.ir-debugger.target.original'}),
            isOriginal: true
        }];
        let cloneIndex = 1;
        for (const traceInfo of trace) {
            const cloneIds = traceInfo.targetsInfo[this.targetOrigin.id].cloneIds;
            if (cloneIds) {
                for (const cloneId of cloneIds) {
                    if (!targetOptions.some(option => option.id === cloneId)) {
                        targetOptions.push({
                            id: cloneId,
                            optionName: this.props.intl.formatMessage(
                                {id: 'gui.ir-debugger.target.clone'},
                                {index: cloneIndex}
                            ),
                            isOriginal: false
                        });
                        cloneIndex++;
                    }
                }
            }
        }
        return targetOptions;
    }

    setTargetOption (targetOption) {
        this.target = {
            id: targetOption.id,
            optionName: targetOption.optionName,
            name: targetOption.isOriginal ?
                this.targetOrigin.getName() :
                `${this.targetOrigin.getName()} - ${targetOption.optionName}`,
            isOriginal: targetOption.isOriginal,
            isStage: this.targetOrigin.isStage,
            blocks: this.targetOrigin.blocks,
            sprite: this.targetOrigin.sprite
        };
    }

    rerender () {
        this.calculateQuestionHierarchy();
        this.forceUpdate();
    }

    render () {
        if (this.cancel) {
            return null;
        }

        return (
            <IRDebuggerComponent
                target={this.target}
                targetOptions={this.targetOptions}
                questionHierarchy={this.questionHierarchy}
                handleTargetChange={this.setTargetOption}
                handleRefresh={this.rerender}
                {...this.props}
            />
        );
    }
}

IRDebugger.propTypes = {
    intl: intlShape.isRequired,
    vm: PropTypes.instanceOf(VirtualMachine).isRequired,
    targetOriginId: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    expanded: PropTypes.bool.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    onDisable: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onShrinkExpand: PropTypes.func.isRequired,
    onStartDrag: PropTypes.func.isRequired,
    onDrag: PropTypes.func.isRequired,
    onEndDrag: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    targetOriginId: state.scratchGui.irDebugger.targetId,
    visible: state.scratchGui.irDebugger.visible,
    expanded: state.scratchGui.irDebugger.expanded,
    x: state.scratchGui.irDebugger.x,
    y: state.scratchGui.irDebugger.y
});

const mapDispatchToProps = dispatch => ({
    onDisable: () => dispatch(disableDebugger()),
    onClose: () => dispatch(closeDebugger()),
    onShrinkExpand: () => dispatch(shrinkExpandDebugger()),
    onStartDrag: () => dispatch(startDragDebugger()),
    onDrag: (e_, data) => dispatch(dragDebugger(data.x, data.y)),
    onEndDrag: () => dispatch(endDragDebugger())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IRDebugger);
