import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import {intlShape} from 'react-intl';
import ScratchBlocks from 'scratch-blocks';
import VirtualMachine from 'scratch-vm';

import {
    QuestionProvider,
    AnswerProviderV2 as AnswerProvider
} from 'scratch-ir';

import {
    generateCDG,
    generateCFG
} from 'scratch-analysis';

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
            'setTargetOption',
            'handleQuestionClick',
            'handleGraphNodeClick',
            'handleBackButtonClick',
            'rerender',
            'translate'
        ]);
        this.cancel = false;
        this.previousBlocks = [];
        this.currentBlockId = props.initialBlockId;
        this.init();
    }

    init () {
        const {
            visible,
            vm,
            onClose,
            onDisable
        } = this.props;

        if (!visible) {
            this.cancel = true;
            return;
        }

        if (vm.runtime.traceInfo.isEmpty()) {
            onClose();
            onDisable();
            this.cancel = true;
            return;
        }
        
        try {
            this.cfg = generateCFG(vm);
            this.cdg = generateCDG(this.cfg);
        } catch (e) {
            onClose();
            onDisable();
            this.cancel = true;
            return;
        }

        this.updateAbstractWorkspace();
        this.update();
    }

    update () {
        this.isBlockDebugger = typeof this.currentBlockId !== 'undefined';
        this.isTargetDebugger = this.props.targetOriginId && !this.isBlockDebugger;
        if (this.isTargetDebugger || this.isBlockDebugger) {
            this.targetOrigin = this.getTargetOrigin();
            this.trace = this.calculateTrace();
            this.targetOptions = this.calculateTargetOptions(this.trace);
            if (!this.target) {
                this.setTargetOption(this.targetOptions[0]);
            }
            if (this.isTargetDebugger) {
                this.trace = this.filterTraceForTargetOption(this.trace);
            }
            this.block = null;
            if (this.isBlockDebugger) {
                this.block = Object.values(this.targetOrigin.blocks._blocks)
                    .find(b => b.id === this.currentBlockId);
            }
            this.currentTrace = this.trace;
            this.updateCurrentTrace();
            this.calculateQuestionHierarchy();
            this.initAnswerProvider();
        } else {
            this.props.onClose();
            this.cancel = true;
        }
    }

    updateAbstractWorkspace () {
        const targets = this.props.vm.runtime.targets;
        const xmlBlocks = targets.map(target => target.blocks.toXML()).join('');
        const xmlWorkspace = `<xml xmlns="http://www.w3.org/1999/xhtml">${xmlBlocks}</xml>`;
        const dom = ScratchBlocks.Xml.textToDom(xmlWorkspace);
        ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(dom, ScratchBlocks.getAbstractWorkspace());
    }

    calculateQuestionHierarchy () {
        const questionProvider = new QuestionProvider(this.props.vm, this.currentTrace, this.target,
            this.block, this.translate);
        this.questionHierarchy = questionProvider.generateQuestionHierarchy();
    }

    initAnswerProvider () {
        this.answerProvider = new AnswerProvider(
            this.props.vm,
            this.cdg,
            this.cfg,
            this.currentTrace,
            this.target,
            this.currentBlockId
        );
    }

    updateAnswerProvider () {
        this.answerProvider.setTrace(this.currentTrace);
        this.answerProvider.target = this.target;
        this.answerProvider.blockId = this.currentBlockId;
    }

    translate (id, values) {
        return this.props.intl.formatMessage({id: `gui.ir-debugger.${id}`}, values);
    }

    calculateTrace () {
        const vm = this.props.vm;
        let trace = vm.runtime.traceInfo.tracer.traces;
        if (vm.runtime.questionGeneration.active) {
            trace = trace.slice(vm.runtime.questionGeneration.traceStart);
        } else {
            trace = trace.slice(vm.runtime.questionGeneration.traceStart, vm.runtime.questionGeneration.traceEnd);
        }
        return trace;
    }

    filterTraceForTargetOption (trace) {
        const blocks = this.targetOrigin.blocks._blocks;
        let eventToRemove = 'control_start_as_clone';
        if (!this.target.isOriginal) {
            trace = trace.filter(t => t.targetsInfo[this.target.id]);
            eventToRemove = 'event_whenflagclicked';
        }
        trace = trace.filter(t => {
            const block = blocks[t.id];
            if (block) {
                let hatBlock = block;
                while (hatBlock.parent) {
                    hatBlock = blocks[hatBlock.parent];
                }
                return hatBlock.opcode !== eventToRemove;
            }
            return true;
        });
        return trace;
    }

    getTargetOrigin () {
        const {
            vm,
            targetOriginId
        } = this.props;

        if (this.isBlockDebugger) {
            return vm.runtime.targets.find(target =>
                Object.values(target.blocks._blocks).some(block => block.id === this.currentBlockId));
        }
        return vm.runtime.targets.find(target => target.id === targetOriginId);
    }

    calculateTargetOptions (trace) {
        const targetOptions = [{
            id: this.targetOrigin.id,
            optionName: this.translate('target.original', {}),
            isOriginal: true
        }];
        if (this.isTargetDebugger) {
            let cloneIndex = 1;
            for (const traceInfo of trace) {
                const cloneIds = traceInfo.targetsInfo[this.targetOrigin.id].cloneIds;
                if (cloneIds) {
                    for (const cloneId of cloneIds) {
                        if (!targetOptions.some(option => option.id === cloneId)) {
                            targetOptions.push({
                                id: cloneId,
                                optionName: this.translate('target.clone', {index: cloneIndex}),
                                isOriginal: false
                            });
                            cloneIndex++;
                        }
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
            origin: this.targetOrigin,
            isStage: this.targetOrigin.isStage,
            blocks: this.targetOrigin.blocks,
            sprite: this.targetOrigin.sprite,
            costumeUrl: this.props.costumeUrl
        };
    }

    handleQuestionClick (question) {
        this.selectedQuestion = question;
        this.updateAnswerProvider();
        this.answer = this.answerProvider.generateAnswer(this.selectedQuestion);
        this.forceUpdate();
    }

    updateCurrentTrace (endIndex) {
        if (endIndex === null) {
            const blockTraces = this.currentTrace.filter(trace => trace.id === this.currentBlockId);
            if (blockTraces.length) {
                const lastBlockTrace = blockTraces[blockTraces.length - 1];
                endIndex = this.currentTrace.lastIndexOf(lastBlockTrace) + 1;
            }
        }
        if (endIndex) {
            this.currentTrace = this.trace.slice(0, endIndex);
        }
    }

    handleGraphNodeClick (blockId) {
        if (this.currentBlockId !== blockId) {
            this.previousBlocks.push({
                id: this.currentBlockId,
                selectedQuestion: this.selectedQuestion,
                traceLength: this.currentTrace.length
            });
            this.currentBlockId = blockId;
            this.selectedQuestion = null;
            this.update();
            this.forceUpdate();
        }
    }

    handleBackButtonClick () {
        if (this.previousBlocks.length > 0) {
            const previousBlock = this.previousBlocks.pop();
            this.currentBlockId = previousBlock.id;
            this.updateCurrentTrace(previousBlock.traceLength);
            this.update();
            this.handleQuestionClick(previousBlock.selectedQuestion);
            this.forceUpdate();
        }
    }

    rerender () {
        this.selectedQuestion = null;
        this.init();
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
                blockId={this.currentBlockId}
                questionHierarchy={this.questionHierarchy}
                selectedQuestion={this.selectedQuestion}
                answer={this.answer}
                handleTargetChange={this.setTargetOption}
                onQuestionClick={this.handleQuestionClick}
                onGraphNodeClick={this.handleGraphNodeClick}
                handleRefresh={this.rerender}
                onBack={this.previousBlocks.length ? this.handleBackButtonClick : null}
                {...this.props}
            />
        );
    }
}

IRDebugger.propTypes = {
    intl: intlShape.isRequired,
    vm: PropTypes.instanceOf(VirtualMachine).isRequired,
    targetOriginId: PropTypes.string,
    costumeUrl: PropTypes.string,
    initialBlockId: PropTypes.string,
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
    costumeUrl: state.scratchGui.irDebugger.costumeUrl,
    initialBlockId: state.scratchGui.irDebugger.blockId,
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
