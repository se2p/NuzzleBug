import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import {intlShape} from 'react-intl';
import ScratchBlocks from 'scratch-blocks';
import VirtualMachine from 'scratch-vm';
import logging from 'scratch-vm/src/util/logging.js';

import {
    QuestionHierarchyProvider,
    AnswerProviderV2 as AnswerProvider,
    QuestionCategoryType, QuestionCategory
} from 'scratch-ir';

import {
    EventFilter,
    generateCDG,
    generateCFG
} from 'scratch-analysis';

import IRDebuggerComponent from '../../../components/interrogative-debugging/version-2/ir-debugger/ir-debugger.jsx';
import {
    closeDebugger,
    shrinkExpandDebugger,
    startDragDebugger,
    dragDebugger,
    endDragDebugger
} from '../../../reducers/interrogative-debugging/version-2/ir-debugger';

import {
    QuestionContent,
    getContentMessageKey
} from 'scratch-ir/src/version-2/questions/question';
import {closeHelpMenu, startChooseQuestionType, startFinished} from '../../../reducers/help-menu';

class IRDebugger extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'handleTargetChange',
            'handleSelectedBlockExecutionChange',
            'handleQuestionClick',
            'handleGraphNodeClick',
            'handleBackButtonClick',
            'handleCategoryClick',
            'handleClose',
            'rerender',
            'translate'
        ]);
        if (!props.vm.runtime.paused && props.vm.runtime.active) {
            props.vm.haltExecution();
        }
        props.vm.storeLastTrace();
        props.vm.storeEditingTarget();
        this.init();

        if (logging.isActive()) {
            if (this.block) {
                logging.logDebuggerEvent(
                    'BLOCK',
                    new Date(),
                    'OPEN_BLOCK',
                    this.block.id,
                    this.block.opcode,
                    null,
                    null
                );
            } else {
                logging.logDebuggerEvent(
                    'TARGET',
                    new Date(),
                    'OPEN_DEBUGGER',
                    this.targetOrigin.id,
                    this.targetOrigin.getName(),
                    null,
                    null
                );
            }
        }
    }

    componentDidMount () {
        this.mounted = true;
    }

    componentWillUnmount () {
        this.mounted = false;
    }

    forceUpdateIfMounted () {
        if (this.mounted) {
            this.forceUpdate();
        }
    }

    init () {
        this.initProperties();

        if (!this.props.visible) {
            this.cancel = true;
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

    handleClose () {
        this.props.vm.resetLastTrace();
        this.props.vm.resetEditingTarget();
        this.props.onCloseDebugger();
        if (this.props.helpMenuInjected){
            this.props.onCloseHelpMenu();
        }

        if (logging.isActive()) {
            logging.logClickEvent('BUTTON', new Date(), 'CLOSE_DEBUGGER', null);
        }
    }

    initTraces () {
        this.allTraces = this.calculateAllTraces();
        this.relevantTraces = this.allTraces;
    }

    update () {
        this.isBlockDebugger = typeof this.currentBlockId !== 'undefined';
        this.isTargetDebugger = this.props.targetOriginId && !this.isBlockDebugger;
        if (this.isTargetDebugger || this.isBlockDebugger) {

            this.targetOrigin = this.getTargetOrigin();
            this.targetOptions = this.calculateTargetOptions(this.allTraces);
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
            if (this.selectedBlockExecution) {
                this.setTargetOptionOfBlockExecutionOption(this.selectedBlockExecution);
            }

            this.updateRelevantTraces();
            // Todo: add specific cases
            this.calculateQuestionHierarchy();
            this.calculateAbstractCategories();
            if (this.questionHierarchy.length) {
                this.initAnswerProvider();
                if (this.isBlockDebugger && !this.selectedQuestion) {
                    this.selectBlockExecutionQuestion();
                }
            }
        } else {
            this.handleClose();
            this.cancel = true;
        }
    }

    updateAbstractWorkspace () {
        const targets = this.props.vm.runtime.targets;
        let xmlBlocks = targets.map(target => target.blocks.toXML()).join('');
        // Add blocks to the workspace, that are needed for some answers although they are not used in the project.
        xmlBlocks += `,
            <block type="event_whenflagclicked" id="abstract_flag_clicked"></block>,
            <block type="control_start_as_clone" id="abstract_clone_start"></block>,
            <block type="event_whenthisspriteclicked" id="abstract_sprite_clicked"></block>,
            <block type="looks_backdropnumbername" id="abstract_backdrop_input">
                <field name="NUMBER_NAME">number</field>
            </block>
            <block type="event_broadcast" id="abstract_send_block"></block>,`;
        const xmlWorkspace = `<xml xmlns="http://www.w3.org/1999/xhtml">${xmlBlocks}</xml>`;
        const dom = ScratchBlocks.Xml.textToDom(xmlWorkspace);
        ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(dom, ScratchBlocks.getAbstractWorkspace());
    }

    updateRelevantTraces () {
        if (this.isTargetDebugger) {
            this.relevantTraces = this.filterTracesForTargetOption(this.allTraces);
        } else {
            this.relevantTraces = this.filterTracesForBlock(this.relevantTraces);
        }
    }

    calculateQuestionHierarchy () {
        try {
            this.crashed = false;
            const questionHierarchyProvider = new QuestionHierarchyProvider(
                this.props.vm,
                this.allTraces,
                this.relevantTraces,
                this.target,
                this.block,
                this.translate
            );
            this.questionHierarchy = questionHierarchyProvider.generateQuestionHierarchy();
        } catch {
            this.crashed = true;
        }
    }

    calculateAbstractCategories () {
        // Todo: calculate all specific category forms
        try {
            this.crashed = false;
            const questionHierarchyProvider = new QuestionHierarchyProvider(
                this.props.vm,
                this.allTraces,
                this.relevantTraces,
                this.target,
                this.block,
                this.translate
            );
            this.abstractCategories = questionHierarchyProvider.generateAbstractQuestionCategories();
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
            this.relevantTraces,
            this.target,
            this.currentBlockId,
            this.translate
        );
    }

    translate (id, values) {
        return this.props.intl.formatMessage({id}, values);
    }

    calculateAllTraces () {
        const vm = this.props.vm;
        let traces = vm.runtime.traceInfo.tracer.traces;
        const newLastTrace = vm.runtime.newLastTrace;
        if (newLastTrace) {
            const newLastTraceIndex = traces.indexOf(newLastTrace);
            traces = traces.slice(0, newLastTraceIndex + 1);
        }
        return traces;
    }

    filterTracesForTargetOption (traces) {
        const blocks = this.targetOrigin.blocks._blocks;

        if (!this.target.isOriginal) {
            let firstCloneTraceIndex = 0;
            const createCloneTrace = traces.find(trace =>
                EventFilter.cloneCreate(trace) && trace.targetsInfo[this.target.id]);
            if (createCloneTrace) {
                firstCloneTraceIndex = traces.indexOf(createCloneTrace);
                const startAsCloneTrace = traces.find((trace, index) => EventFilter.cloneStart(trace) &&
                    index > 0 && traces[index - 1].uniqueId === createCloneTrace.uniqueId);
                if (startAsCloneTrace) {
                    // Overwrite the targetsInfo of the 'control_start_as_clone' trace
                    // with the targetsInfo of the 'control_create_clone_of' trace,
                    // because it is empty otherwise.
                    startAsCloneTrace.targetsInfo = createCloneTrace.targetsInfo;

                    firstCloneTraceIndex = traces.indexOf(startAsCloneTrace);
                }
            }

            // Remove traces where the clone did not exist.
            traces = traces.filter((trace, index) =>
                index >= firstCloneTraceIndex && trace.targetsInfo[this.target.id]);

            // Remove the 'control_create_clone_of' trace.
            if (createCloneTrace) {
                traces = traces.filter(trace => trace.uniqueId !== createCloneTrace.uniqueId);
            }
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

    filterTracesForBlock (traces) {
        if (this.selectedBlockExecution) {
            const endIndex = traces.indexOf(this.selectedBlockExecution.lastTrace) + 1;
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
            optionName: this.translate('gui.ir-debugger.target.original', {}),
            isOriginal: true
        }];
        let cloneIndex = 1;
        for (const trace of traces) {
            const cloneIds = trace.targetsInfo[this.targetOrigin.id].cloneIds;
            if (cloneIds) {
                for (const cloneId of cloneIds) {
                    if (!targetOptions.some(option => option.id === cloneId)) {
                        targetOptions.push({
                            id: cloneId,
                            optionName: this.translate('gui.ir-debugger.target.clone', {index: cloneIndex}),
                            isOriginal: false
                        });
                        cloneIndex++;
                    }
                }
            }
        }
        return targetOptions;
    }

    udpateTargetOptions () {
        this.targetOptions = this.calculateTargetOptions(this.allTraces);
        if (this.selectedBlockExecution) {
            this.setTargetOptionOfBlockExecutionOption(this.selectedBlockExecution);
        }
        if (!this.target || !this.targetOptions.some(o => o.id === this.target.id)) {
            this.setTargetOption(this.targetOptions[0]);
        }
    }

    handleTargetChange (targetOption) {
        if (this.target.id !== targetOption.id) {
            this.setTargetOption(targetOption);
            this.selectedQuestion = null;
            this.answer = null;
            this.update();
            this.forceUpdate();

            if (logging.isActive()) {
                logging.logDebuggerEvent(
                    'SPRITE',
                    new Date(),
                    'SELECT_SPRITE',
                    targetOption.id,
                    this.targetOrigin.getName(),
                    targetOption.isOriginal ? '1' : '0',
                    null
                );
            }
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

    setSelectedBlockExecution (blockExecution) {
        this.selectedBlockExecution = blockExecution;
        const traceIndex = this.allTraces.indexOf(blockExecution.lastTrace);
        this.relevantTraces = this.allTraces.slice(0, traceIndex + 1);
        this.answer = null;
        this.update();
        if (this.selectedQuestion && this.categoriesContainQuestion(this.selectedQuestion, this.questionHierarchy)) {
            this.answerLoading = true;
            setTimeout(() => {
                this.answerQuestion();
            }, 200);
        } else {
            this.selectBlockExecutionQuestion();
        }
        this.forceUpdate();
    }

    handleSelectedBlockExecutionChange (blockExecution) {
        this.setSelectedBlockExecution(blockExecution);

        if (logging.isActive()) {
            logging.logDebuggerEvent(
                'BLOCK',
                new Date(),
                'SELECT_BLOCK_EXECUTION',
                blockExecution.blockTrace.id,
                blockExecution.blockTrace.opcode,
                null,
                blockExecution.execution
            );
        }
    }

    setTargetOptionOfBlockExecutionOption (blockExecutionOption) {
        const targetOption = this.targetOptions.find(o => o.id === blockExecutionOption.blockTrace.targetId);
        this.setTargetOption(targetOption);
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
            const blockTraces = this.allTraces.filter(t => t.id === this.currentBlockId);
            if (blockTraces.length) {
                this.blockExecutionOptions = [];
                for (const [index, blockTrace] of blockTraces.entries()) {
                    const blockExecutionOption = {
                        uniqueId: blockTrace.uniqueId,
                        lastTrace: blockTrace,
                        blockTrace: blockTrace
                    };
                    if (blockTrace.argValues.INITIAL_EXECUTION && !blockTrace.argValues.DONE) {
                        const isLastBlockTraceForTarget =
                            !blockTraces.some((t, i) => i > index && t.targetId === blockTrace.targetId);
                        if (isLastBlockTraceForTarget) {
                            if (this.block.opcode === 'control_wait_until') {
                                const blockTraceIndex = this.allTraces.indexOf(blockTrace);
                                // Find the last trace with 'waitUntilOps' for the wait block execution.
                                const lastTrace = this.allTraces
                                    .slice(blockTraceIndex, this.allTraces.length)
                                    .reverse()
                                    .find(trace =>
                                        trace.waitUntilOps &&
                                        trace.waitUntilOps[blockTrace.targetId] &&
                                        trace.waitUntilOps[blockTrace.targetId][this.currentBlockId]
                                    );
                                if (lastTrace) {
                                    blockExecutionOption.lastTrace = lastTrace;
                                }
                                this.blockExecutionOptions.push(blockExecutionOption);
                            } else {
                                this.blockExecutionOptions.push(blockExecutionOption);
                            }
                        }
                    } else {
                        this.blockExecutionOptions.push(blockExecutionOption);
                    }
                }
                const maxIndex = `${this.blockExecutionOptions.length}`;
                for (let i = 0; i < this.blockExecutionOptions.length; i++) {
                    let index = `${i + 1}`;
                    while (index.length < maxIndex.length) {
                        index = `0${index}`;
                    }
                    this.blockExecutionOptions[i].execution = i + 1;
                    this.blockExecutionOptions[i].optionName =
                        `${index}. ${this.translate('gui.ir-debugger.execution')}`;
                }
                this.blockExecutionOptions.reverse();
            }
        }
    }

    handleCategoryClick (selectedCategory) {
        if (this.questionHierarchy && selectedCategory) {
            if (this.props.helpMenuChooseCategories) {
                for (const category of this.questionHierarchy) {
                    if (category.type === selectedCategory.type) {
                        this.selectedCategory = category;
                        this.selectedAbstractCategory = selectedCategory;
                    }
                }
                this.props.onSelectQuestionType();
                this.forceUpdate();
            } else if (this.props.helpMenuChooseQuestionType){
                for (const category of this.questionHierarchy) {
                    if (category.type === selectedCategory.type && category.questionCategories) {
                        for (const subcategory of category.questionCategories) {
                            if (subcategory.form === selectedCategory.form) {
                                this.selectedCategory = subcategory;
                                this.selectedAbstractCategory = selectedCategory;
                            }
                        }
                    }
                }
                this.props.onFinishHelp();
                this.forceUpdate();
            }
        }
    }

    setSelectedQuestion (question) {
        this.selectedQuestion = question;
        this.answer = null;
        this.answerLoading = true;
        this.forceUpdateIfMounted();
        setTimeout(() => {
            this.answerQuestion();
        }, 200);
    }

    handleQuestionClick (question) {
        if (this.props.helpMenuInjected){
            this.props.onCloseHelpMenu();
            this.forceUpdate();
        }
        this.setSelectedQuestion(question);


        if (logging.isActive()) {
            logging.logQuestionEvent(
                'QUESTION',
                new Date(),
                'SELECT',
                this.block ? this.block.id : null,
                null,
                getContentMessageKey(question.content, question.values),
                Object.values(question.values).join(', '),
                question.category,
                question.form,
                this.block ? this.block.opcode : null
            );
        }
    }

    selectBlockExecutionQuestion () {
        const executionCategory = this.questionHierarchy
            .find(category => category.type === QuestionCategoryType.EXECUTION);
        if (executionCategory) {
            const executionQuestion = executionCategory.questionCategories[0].questions[0];
            this.setSelectedQuestion(executionQuestion);
        }
    }

    answerQuestion () {
        try {
            this.crashed = false;
            const newLastTrace = this.isBlockDebugger &&
                (this.selectedQuestion.category === QuestionCategoryType.SENSING ||
                    this.selectedQuestion.content === QuestionContent.BLOCK_EXECUTION_TIME) ?
                this.selectedBlockExecution.lastTrace : this.props.vm.storedLastTrace;
            const traces = this.props.vm.runtime.traceInfo.tracer.traces;
            const lastTrace = this.props.vm.runtime.newLastTrace ?
                this.props.vm.runtime.newLastTrace : traces[traces.length - 1];
            if (newLastTrace.uniqueId !== lastTrace.uniqueId ||
                this.selectedQuestion.content === QuestionContent.BLOCK_EXECUTION_TIME) {
                this.props.vm.rewindToTrace(newLastTrace, false);
                this.udpateTargetOptions();
                this.initAnswerProvider();
            }
            this.answer = this.answerProvider.generateAnswer(this.selectedQuestion);
        } catch {
            this.crashed = true;
        }
        this.answerLoading = false;
        this.forceUpdateIfMounted();
    }

    handleGraphNodeClick (graphNode) {
        if (this.currentBlockId !== graphNode.block.id) {
            this.previousBlocks.push({
                id: this.currentBlockId,
                selectedQuestion: this.selectedQuestion,
                traceCount: this.relevantTraces.length,
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
                this.setSelectedBlockExecution(blockExecution);
            }
            this.forceUpdate();

            if (logging.isActive()) {
                logging.logDebuggerEvent(
                    'BLOCK',
                    new Date(),
                    'ROUTE_TO_BLOCK',
                    graphNode.block.id,
                    graphNode.block.opcode,
                    null,
                    this.selectedBlockExecution.execution
                );
            }
        }
    }

    handleBackButtonClick () {
        if (this.previousBlocks.length > 0) {
            const previousBlock = this.previousBlocks.pop();
            this.currentBlockId = previousBlock.id;
            this.selectedBlockExecution = previousBlock.selectedBlockExecution;
            this.target = previousBlock.target;
            this.relevantTraces = this.allTraces.slice(0, previousBlock.traceCount);
            this.update();
            this.setSelectedQuestion(previousBlock.selectedQuestion);
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
                targetOptions={this.isTargetDebugger ? this.targetOptions : []}
                block={this.block}
                selectedBlockExecution={this.selectedBlockExecution}
                blockExecutionOptions={this.blockExecutionOptions}
                questionHierarchy={this.questionHierarchy}
                abstractCategories={this.abstractCategories}
                selectedQuestion={this.selectedQuestion}
                selectedCategory={this.selectedCategory}
                selectedAbstractCategory={this.selectedAbstractCategory}
                helpMenuInjected={this.helpMenuInjected}
                helpMenuChooseCategories={this.helpMenuChooseCategories}
                helpMenuChooseQuestionType={this.helpMenuChooseQuestionType}
                helpMenuFinished={this.helpMenuFinished}
                answer={this.answer}
                answerLoading={this.answerLoading}
                onTargetChange={this.handleTargetChange}
                onBlockExecutionChange={this.handleSelectedBlockExecutionChange}
                onQuestionClick={this.handleQuestionClick}
                onGraphNodeClick={this.handleGraphNodeClick}
                onAbstractCategorySelected={this.handleCategoryClick}
                handleRefresh={this.rerender}
                onBack={this.previousBlocks.length ? this.handleBackButtonClick : null}
                crashed={this.crashed}
                onClose={this.handleClose}
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
    abstractCategories: PropTypes.arrayOf(PropTypes.instanceOf(QuestionCategory)),
    helpMenuInjected: PropTypes.bool.isRequired,
    helpMenuChooseCategories: PropTypes.bool.isRequired,
    helpMenuChooseQuestionType: PropTypes.bool.isRequired,
    helpMenuFinished: PropTypes.bool.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    onCloseDebugger: PropTypes.func.isRequired,
    onCloseHelpMenu: PropTypes.func.isRequired,
    onShrinkExpand: PropTypes.func.isRequired,
    onStartDrag: PropTypes.func.isRequired,
    onDrag: PropTypes.func.isRequired,
    onEndDrag: PropTypes.func.isRequired,
    onSelectQuestionType: PropTypes.func.isRequired,
    onFinishHelp: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    helpMenuInjected: state.scratchGui.helpMenu.injected,
    helpMenuChooseCategories: state.scratchGui.helpMenu.chooseCategory,
    helpMenuChooseQuestionType: state.scratchGui.helpMenu.chooseQuestionType,
    helpMenuFinished: state.scratchGui.helpMenu.finished,
    targetOriginId: state.scratchGui.irDebugger.targetId,
    costumeUrl: state.scratchGui.irDebugger.costumeUrl,
    initialBlockId: state.scratchGui.irDebugger.blockId,
    visible: state.scratchGui.irDebugger.visible,
    expanded: state.scratchGui.irDebugger.expanded,
    x: state.scratchGui.irDebugger.x,
    y: state.scratchGui.irDebugger.y
});

const mapDispatchToProps = dispatch => ({
    onCloseDebugger: () => dispatch(closeDebugger()),
    onShrinkExpand: () => dispatch(shrinkExpandDebugger()),
    onStartDrag: () => dispatch(startDragDebugger()),
    onDrag: (e_, data) => dispatch(dragDebugger(data.x, data.y)),
    onEndDrag: () => dispatch(endDragDebugger()),
    onCloseHelpMenu: () => dispatch(closeHelpMenu()),
    onSelectQuestionType: () => dispatch(startChooseQuestionType()),
    onFinishHelp: () => dispatch(startFinished())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IRDebugger);
