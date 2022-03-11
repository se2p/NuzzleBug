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
    EventFilter,
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
            'handleTargetChange',
            'handleSelectedBlockExecutionChange',
            'handleQuestionClick',
            'handleGraphNodeClick',
            'handleBackButtonClick',
            'rerender',
            'translate'
        ]);
        this.init();
    }

    init () {
        this.initProperties();

        if (!this.props.visible) {
            this.cancel = true;
            return;
        }

        if (this.props.vm.runtime.traceInfo.isEmpty()) {
            this.closeAndDisable();
            return;
        }
        
        try {
            this.cfg = generateCFG(this.props.vm);
            this.cdg = generateCDG(this.cfg);
        } catch (e) {
            this.crashed = true;
            return;
        }

        this.updateAbstractWorkspace();
        this.initTraces();
        this.update();
    }

    initProperties () {
        this.cancel = false;
        this.crashed = false;
        this.target = null;
        this.currentBlockId = this.props.initialBlockId;
        this.previousBlocks = [];
        this.selectedQuestion = null;
        this.answer = null;
        this.answerLoading = false;
        this.selectedBlockExecution = null;
    }

    closeAndDisable () {
        this.props.onClose();
        this.props.onDisable();
        this.cancel = true;
    }

    initTraces () {
        this.allTraces = this.props.vm.runtime.traceInfo.tracer.traces;
        this.allObservedTraces = this.calculateAllObservedTraces();
        this.relevantObservedTraces = this.allObservedTraces;
    }

    update () {
        this.isBlockDebugger = typeof this.currentBlockId !== 'undefined';
        this.isTargetDebugger = this.props.targetOriginId && !this.isBlockDebugger;
        if (this.isTargetDebugger || this.isBlockDebugger) {

            this.targetOrigin = this.getTargetOrigin();
            this.targetOptions = this.calculateTargetOptions(this.allObservedTraces);
            if (!this.target || this.target.origin.id !== this.targetOrigin.id) {
                this.setTargetOption(this.targetOptions[0]);
            }

            this.block = this.isBlockDebugger ?
                Object.values(this.targetOrigin.blocks._blocks).find(b => b.id === this.currentBlockId) :
                null;

            this.calculateBlockExecutionOptions();
            if (this.isBlockDebugger && !this.selectedBlockExecution && this.blockExecutionOptions.length > 0) {
                this.selectedBlockExecution = this.blockExecutionOptions[0];
            }

            this.updateRelevantObservedTraces();
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

    updateRelevantObservedTraces () {
        if (this.isTargetDebugger) {
            this.relevantObservedTraces = this.filterTracesForTargetOption(this.allObservedTraces);
        } else {
            this.relevantObservedTraces = this.filterTracesForBlock(this.relevantObservedTraces, this.block);
        }
    }

    calculateQuestionHierarchy () {
        try {
            this.crashed = false;
            const questionProvider = new QuestionProvider(
                this.props.vm,
                this.allTraces,
                this.relevantObservedTraces,
                this.target,
                this.block,
                this.translate
            );
            this.questionHierarchy = questionProvider.generateQuestionHierarchy();
        } catch {
            this.crashed = true;
        }
    }

    initAnswerProvider () {
        this.answerProvider = new AnswerProvider(
            this.props.vm,
            this.cdg,
            this.cfg,
            this.allTraces,
            this.relevantObservedTraces,
            this.target,
            this.currentBlockId,
            this.translate
        );
    }

    updateAnswerProvider () {
        this.answerProvider.setRelevantTraces(this.relevantObservedTraces);
        this.answerProvider.target = this.target;
        this.answerProvider.blockId = this.currentBlockId;
    }

    translate (id, values) {
        return this.props.intl.formatMessage({id: `gui.ir-debugger.${id}`}, values);
    }

    calculateAllObservedTraces () {
        const vm = this.props.vm;
        let traces = this.allTraces;
        if (vm.runtime.questionGeneration.active) {
            traces = traces.slice(vm.runtime.questionGeneration.traceStart);
        } else {
            traces = traces.slice(vm.runtime.questionGeneration.traceStart, vm.runtime.questionGeneration.traceEnd);
        }
        return traces;
    }

    filterTracesForTargetOption (traces) {
        const blocks = this.targetOrigin.blocks._blocks;

        if (!this.target.isOriginal) {
            // Remove traces where the clone did not exist.
            traces = traces.filter((t, index) =>
                t.targetsInfo[this.target.id] ||
                (EventFilter.cloneStart(t) && traces[index + 1].targetsInfo[this.target.id])
            );

            // Overwrite the targetsInfo of the 'control_start_as_clone' trace
            // with the targetsInfo of the 'control_create_clone_of' trace.
            const startAsCloneTrace = traces[0];
            const createCloneTrace = traces[1];
            startAsCloneTrace.targetsInfo = createCloneTrace.targetsInfo;

            // Remove the 'control_create_clone_of' trace.
            traces.splice(1, 1);
        }

        // Remove all traces of blocks attached to irrelevant events.
        const eventToRemove = this.target.isOriginal ? 'control_start_as_clone' : 'event_whenflagclicked';
        traces = traces.filter(t => {
            const block = blocks[t.id];
            if (block) {
                const hatBlock = this.getHatBlockOfBlock(block, blocks);
                return hatBlock.opcode !== eventToRemove;
            }
            return true;
        });

        return traces;
    }

    getHatBlockOfBlock (block, blocks) {
        let hatBlock = block;
        while (hatBlock.parent) {
            hatBlock = blocks[hatBlock.parent];
        }
        return hatBlock;
    }

    filterTracesForBlock (traces, block) {
        const blockTraces = traces.filter(t => t.id === block.id);
        if (blockTraces.length) {
            const lastBlockTrace = blockTraces[blockTraces.length - 1];
            const endIndex = traces.lastIndexOf(lastBlockTrace) + 1;
            return traces.slice(0, endIndex);
        }
        return traces;
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

    calculateTargetOptions (traces) {
        const targetOptions = [{
            id: this.targetOrigin.id,
            optionName: this.translate('target.original', {}),
            isOriginal: true
        }];
        if (this.isTargetDebugger) {
            let cloneIndex = 1;
            for (const trace of traces) {
                const cloneIds = trace.targetsInfo[this.targetOrigin.id].cloneIds;
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

    handleTargetChange (targetOption) {
        if (this.target.id !== targetOption.id) {
            this.setTargetOption(targetOption);
            this.selectedQuestion = null;
            this.answer = null;
            this.update();
            this.forceUpdate();
        }
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

    handleSelectedBlockExecutionChange (blockExecution) {
        this.selectedBlockExecution = blockExecution;
        const traceIndex = this.allObservedTraces.indexOf(blockExecution);
        this.relevantObservedTraces = this.allObservedTraces.slice(0, traceIndex + 1);
        this.answer = null;
        this.update();
        if (this.selectedQuestion && this.categoriesContainQuestion(this.selectedQuestion, this.questionHierarchy)) {
            this.answerLoading = true;
            this.answerQuestion();
        } else {
            this.selectedQuestion = null;
        }
        this.forceUpdate();
    }

    categoriesContainQuestion (selectedQuestion, questionCategories) {
        for (const questionCategory of questionCategories) {
            if (questionCategory.questionCategories) {
                if (this.categoriesContainQuestion(selectedQuestion, questionCategory.questionCategories)) {
                    return true;
                }
            }
            if (questionCategory.questions) {
                for (const question of questionCategory.questions) {
                    if (question.id === selectedQuestion.id) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    calculateBlockExecutionOptions () {
        this.blockExecutionOptions = [];
        if (this.currentBlockId) {
            this.blockExecutionOptions = this.allObservedTraces.filter(t => t.id === this.currentBlockId);
            for (let i = 0; i < this.blockExecutionOptions.length; i++) {
                this.blockExecutionOptions[i].optionName = `${i + 1}. ${this.translate('execution')}`;
            }
            this.blockExecutionOptions.reverse();
        }
    }

    handleQuestionClick (question) {
        this.selectedQuestion = question;
        this.answer = null;
        this.answerLoading = true;
        this.forceUpdate();
        setTimeout(() => {
            this.answerQuestion();
        }, 200);
    }

    answerQuestion () {
        try {
            this.crashed = false;
            this.updateAnswerProvider();
            this.answer = this.answerProvider.generateAnswer(this.selectedQuestion);
        } catch {
            this.crashed = true;
        }
        this.answerLoading = false;
        this.forceUpdate();
    }

    handleGraphNodeClick (graphNode) {
        if (this.currentBlockId !== graphNode.block.id) {
            this.previousBlocks.push({
                id: this.currentBlockId,
                selectedQuestion: this.selectedQuestion,
                traceCount: this.relevantObservedTraces.length,
                selectedBlockExecution: this.selectedBlockExecution,
                target: this.target
            });
            this.currentBlockId = graphNode.block.id;
            this.selectedQuestion = null;
            this.selectedBlockExecution = null;
            this.answer = null;
            this.update();
            if (graphNode.trace) {
                const blockExecution = this.blockExecutionOptions.find(o => o.uniqueId === graphNode.trace.uniqueId);
                this.handleSelectedBlockExecutionChange(blockExecution);
            }
            this.forceUpdate();
        }
    }

    handleBackButtonClick () {
        if (this.previousBlocks.length > 0) {
            const previousBlock = this.previousBlocks.pop();
            this.currentBlockId = previousBlock.id;
            this.selectedBlockExecution = previousBlock.selectedBlockExecution;
            this.target = previousBlock.target;
            this.relevantObservedTraces = this.allObservedTraces.slice(0, previousBlock.traceCount);
            this.update();
            this.handleQuestionClick(previousBlock.selectedQuestion);
            this.forceUpdate();
        }
    }

    rerender () {
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
                selectedBlockExecution={this.selectedBlockExecution}
                blockExecutionOptions={this.blockExecutionOptions}
                questionHierarchy={this.questionHierarchy}
                selectedQuestion={this.selectedQuestion}
                answer={this.answer}
                answerLoading={this.answerLoading}
                onTargetChange={this.handleTargetChange}
                onBlockExecutionChange={this.handleSelectedBlockExecutionChange}
                onQuestionClick={this.handleQuestionClick}
                onGraphNodeClick={this.handleGraphNodeClick}
                handleRefresh={this.rerender}
                onBack={this.previousBlocks.length ? this.handleBackButtonClick : null}
                crashed={this.crashed}
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
