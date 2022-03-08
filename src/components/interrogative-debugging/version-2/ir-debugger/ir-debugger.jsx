import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Draggable from 'react-draggable';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import bindAll from 'lodash.bindall';
import VirtualMachine from 'scratch-vm';

import {
    QuestionCategory,
    QuestionV2 as Question,
    AnswerV2 as Answer
} from 'scratch-ir';

import IRHeader from '../ir-header/ir-header.jsx';
import IRQuestionHierarchy from '../ir-question-hierarchy/ir-question-hierarchy.jsx';
import IRSelectedQuestion from '../ir-selected-question/ir-selected-question.jsx';
import IRAnswer from '../ir-answer/ir-answer.jsx';
import cardStyles from '../../../cards/card.css';
import styles from './ir-debugger.css';

class IRDebugger extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'createSvgBlock',
            'setCursorOfBlock'
        ]);
        this.header = React.createRef();
        this.body = React.createRef();
    }

    componentDidMount () {
        this._updateWidth();
    }

    componentDidUpdate (prevProps) {
        if (prevProps.blockId !== this.props.blockId) {
            this._updateWidth();
        }
    }

    _updateWidth () {
        const headerWidth = this.header.current.clientWidth;
        this.body.current.setAttribute('style', `width: ${headerWidth}px`);
    }

    createSvgBlock (block, scaleFactor, executionInfo, background) {
        const NS = 'http://www.w3.org/2000/svg';
        const blockStrokeWidth = 1;
        const svgBlock = document.createElementNS(NS, 'svg');

        let blockHeight = block.startHat_ ?
            (block.height + 19) * scaleFactor :
            Math.min(block.height * scaleFactor, 40);

        const svgGroup = block.getSvgRoot().cloneNode(true);
        svgGroup.setAttribute('transform',
            `translate(${blockStrokeWidth},${blockStrokeWidth + (block.startHat_ ? 11 : 0)}) scale(${scaleFactor})`);
        this.setCursorOfBlock(svgGroup, 'default');
        if (executionInfo) {
            svgGroup.setAttribute('opacity', `${executionInfo.executed ? '1' : '0.5'}`);
            if (executionInfo.executed) {
                this._addTooltipValues(svgGroup, executionInfo);
            }
        }
        for (const childNode of Array.from(svgGroup.childNodes)) {
            if (childNode.getAttribute('class')?.includes('breakpointGroup')) {
                svgGroup.removeChild(childNode);
                continue;
            }
            const childId = childNode.getAttribute('data-id');
            const childBlock = block.childBlocks_.find(b => b.id === childId);
            if (childBlock) {
                if (!childBlock.outputConnection && childBlock.previousConnection) {
                    svgGroup.removeChild(childNode);
                } else {
                    const childHeight = childBlock.height * scaleFactor;
                    blockHeight = Math.max(blockHeight, childHeight + 12);
                }
            }
        }

        let blockWidth;
        if (svgGroup.getAttribute('data-shapes') === 'reporter round') {
            this._addGreenFlag(svgGroup);
            blockWidth = (block.width * scaleFactor) + 25;
            svgBlock.setAttribute('y', '5');
        } else {
            const backgroundPath = Array.from(svgGroup.childNodes)
                .find(n => n.getAttribute('class')?.includes('blocklyBlockBackground'));
            const pathData = backgroundPath.getAttribute('d');
            const relevantPathData = pathData.split('H')[block.startHat_ ? 1 : 2].split('v')[0].split('a');
            const horizontalLineEnd = Number(relevantPathData[0]);
            const arcWidth = Number(relevantPathData[1].split(' ')[4].split(',')[0]);
            const maximalXCoordinate = horizontalLineEnd + arcWidth;
            blockWidth = maximalXCoordinate * scaleFactor;
        }

        blockHeight += 2 * blockStrokeWidth;
        blockWidth += 2 * blockStrokeWidth;

        const blockBorder = {width: 2, radius: 5};
        const blockMargin = blockBorder.width + blockBorder.radius;
        svgBlock.setAttribute('height', `${blockHeight + (2 * blockMargin)}px`);
        svgBlock.setAttribute('width', `${blockWidth + (2 * blockMargin)}px`);

        if (background) {
            const rect = document.createElementNS(NS, 'rect');
            rect.setAttribute('fill', `${background.color}`);
            rect.setAttribute('fill-opacity', executionInfo && !executionInfo.executed ? '0.2' : '0.5');
            rect.setAttribute('stroke', `${background.color}`);
            rect.setAttribute('stroke-width', `${blockBorder.width}`);
            rect.setAttribute('stroke-linecap', `round`);
            rect.setAttribute('stroke-opacity', executionInfo && !executionInfo.executed ? '0.5' : '1');
            rect.setAttribute('height', `${blockHeight + (2 * blockBorder.radius)}px`);
            rect.setAttribute('width', `${blockWidth + (2 * blockBorder.radius)}px`);
            rect.setAttribute('x', `${blockBorder.width}`);
            rect.setAttribute('y', `${blockBorder.width}`);
            rect.setAttribute('rx', `${blockBorder.radius}`);
            rect.setAttribute('ry', `${blockBorder.radius}`);
            rect.innerHTML += `<title>${background.title}</title>`;
            svgBlock.appendChild(rect);
        }

        const canvas = document.createElementNS(NS, 'g');
        canvas.setAttribute('class', 'blocklyBlockCanvas');
        canvas.appendChild(svgGroup);
        
        const svgCanvas = document.createElementNS(NS, 'svg');
        svgCanvas.setAttribute('x', `${blockMargin}`);
        svgCanvas.setAttribute('y', `${blockMargin}`);
        svgCanvas.setAttribute('height', `${blockHeight}px`);
        svgCanvas.setAttribute('width', `${blockWidth}px`);
        svgCanvas.appendChild(canvas);
        svgBlock.appendChild(svgCanvas);

        return svgBlock;
    }

    setCursorOfBlock (node, value) {
        node.setAttribute('style', `cursor: ${value}`);
        for (const child of node.children) {
            this.setCursorOfBlock(child, value);
        }
    }

    _addTooltipValues (node, executionInfo) {
        const dataShapes = node.getAttribute('data-shapes');
        const isStackBlock = dataShapes === 'stack';
        const isValueInput = dataShapes === 'reporter round';
        const isBooleanInput = dataShapes === 'reporter boolean';
        if (isStackBlock || isValueInput || isBooleanInput) {
            const blockId = node.getAttribute('data-id');
            let value = executionInfo.tooltips[blockId];
            if (typeof value !== 'undefined') {
                if (isBooleanInput) {
                    value = this.props.intl.formatMessage({id: `gui.ir-debugger.condition.${value}`});
                }
                node.innerHTML += `<title>${value}</title>`;
            }
        }
        for (const child of node.children) {
            this._addTooltipValues(child, executionInfo);
        }
    }

    _addGreenFlag (svgGroup) {
        const greenFlag = document.createElement('g');
        greenFlag.setAttribute('transform', 'translate(16, 6)');
        const greenFlagImage = document.createElement('image');
        greenFlagImage.setAttribute('xlink:href', './static/blocks-media/green-flag.svg');
        greenFlagImage.setAttribute('width', '26px');
        greenFlagImage.setAttribute('height', '26px');
        greenFlag.appendChild(greenFlagImage);
        svgGroup.innerHTML += greenFlag.outerHTML;

        const greenFlagOffset = 35;
        this._addOffsetToBackground(svgGroup, greenFlagOffset);
        this._addOffsetToTextNodes(svgGroup, greenFlagOffset);
        Array.from(svgGroup.childNodes).forEach(childNode => {
            if (childNode.getAttribute('data-argument-type') !== 'dropdown') {
                this._addOffsetToTextNodes(childNode, greenFlagOffset);
            }
        });
        this._addOffsetToDropDownNodes(svgGroup, greenFlagOffset);
    }

    _addOffsetToBackground (svgGroup, offset) {
        const backgroundPath = Array.from(svgGroup.childNodes)
            .find(n => n.getAttribute('class')?.includes('blocklyBlockBackground'));
        const pathData = backgroundPath.getAttribute('d');
        const pathDataA = pathData.split('a');
        let pathWidth = Number(pathDataA[0].split('H')[1]);
        pathWidth += offset;
        const newPathData = `${pathData.split('H')[0]} H ${pathWidth} a ${pathDataA[1]} a ${pathDataA[2]}`;
        backgroundPath.setAttribute('d', newPathData);
    }

    _addOffsetToTextNodes (svgGroup, offset) {
        const textNodes = Array.from(svgGroup.childNodes).filter(node => node.nodeName === 'text');
        for (const text of textNodes) {
            const x = Number(text.getAttribute('x'));
            text.setAttribute('x', x + offset);
        }
    }

    _addOffsetToDropDownNodes (svgGroup, offset) {
        const dropDownNodes = Array.from(svgGroup.childNodes)
            .filter(node => node.getAttribute('data-argument-type') === 'dropdown');
        for (const dropDownNode of dropDownNodes) {
            const transform = dropDownNode.getAttribute('transform');
            const x = Number(transform.split('(')[1].split(',')[0]);
            const y = Number(transform.split(')')[0].split(',')[1]);
            const newTransform = `translate(${x + offset},${y})`;
            dropDownNode.setAttribute('transform', newTransform);
        }
    }

    render () {
        const {
            vm,
            target,
            targetOptions,
            selectedBlockExecution,
            blockExecutionOptions,
            blockId,
            questionHierarchy,
            selectedQuestion,
            answer,
            answerLoading,
            expanded,
            handleRefresh,
            onTargetChange,
            onBlockExecutionChange,
            onQuestionClick,
            onGraphNodeClick,
            onClose,
            onBack,
            onShrinkExpand,
            onDrag,
            onStartDrag,
            onEndDrag,
            crashed,
            ...posProps
        } = this.props;
    
        let {x, y} = posProps;
        const cardHorizontalDragOffset = 800; // ~80% of card width
        const cardVerticalDragOffset = expanded ? 432 : 0; // ~80% of card height
        const menuBarHeight = 48;
        if (x === 0 && y === 0) {
            x = 280 + cardHorizontalDragOffset;
            y = 36;
        }
    
        return (
            <div>
                {expanded ? (
                    <div
                        className={styles.overlay}
                        style={{
                            width: `${window.innerWidth + (2 * cardHorizontalDragOffset)}px`,
                            height: `${window.innerHeight - menuBarHeight + cardVerticalDragOffset}px`,
                            top: 0,
                            left: 0
                        }}
                    />
                ) : null}
                <div
                    className={cardStyles.cardContainerOverlay}
                    style={{
                        width: `${window.innerWidth + (2 * cardHorizontalDragOffset)}px`,
                        height: `${window.innerHeight - menuBarHeight + cardVerticalDragOffset}px`,
                        top: `${menuBarHeight}px`,
                        left: `${-cardHorizontalDragOffset}px`
                    }}
                >
                    <Draggable
                        bounds="parent"
                        position={{x: x, y: y}}
                        onDrag={onDrag}
                        onStart={onStartDrag}
                        onStop={onEndDrag}
                    >
                        <div className={cardStyles.cardContainer}>
                            <div className={classNames(cardStyles.card, styles.card)}>
                                <div
                                    ref={this.header}
                                    className={styles.header}
                                >
                                    <IRHeader
                                        target={target}
                                        blockId={blockId}
                                        selectedBlockExecution={selectedBlockExecution}
                                        targetOptions={targetOptions}
                                        blockExecutionOptions={blockExecutionOptions}
                                        expanded={expanded}
                                        onRefresh={handleRefresh}
                                        onTargetChange={onTargetChange}
                                        onBlockExecutionChange={onBlockExecutionChange}
                                        onClose={onClose}
                                        onBack={onBack}
                                        onShrinkExpand={onShrinkExpand}
                                        createSvgBlock={this.createSvgBlock}
                                    />
                                </div>
                                <div
                                    className={expanded ? styles.body : cardStyles.hidden}
                                    ref={this.body}
                                >
                                    {questionHierarchy ? (
                                        <div className={styles.questionHierarchy}>
                                            <IRQuestionHierarchy
                                                questionHierarchy={questionHierarchy}
                                                selectedQuestion={selectedQuestion}
                                                onQuestionClick={onQuestionClick}
                                            />
                                        </div>
                                    ) : (crashed ? (
                                        <div className={styles.debuggerCrashMessage}>
                                            <FormattedMessage
                                                defaultMessage="Oops! Something went wrong."
                                                description="Crash Message title"
                                                id="gui.crashMessage.label"
                                            />
                                        </div>
                                    ) : null)}
                                    <div className={styles.answerArea}>
                                        {selectedQuestion ? (
                                            <div>
                                                <div className={styles.selectedQuestion}>
                                                    <IRSelectedQuestion
                                                        selectedQuestion={selectedQuestion}
                                                    />
                                                </div>
                                                <div className={styles.answer}>
                                                    {answer ? (
                                                        <IRAnswer
                                                            answer={answer}
                                                            selectedQuestion={selectedQuestion}
                                                            vm={vm}
                                                            target={target}
                                                            createSvgBlock={this.createSvgBlock}
                                                            onGraphNodeClick={onGraphNodeClick}
                                                            setCursorOfBlock={this.setCursorOfBlock}
                                                        />
                                                    ) : (answerLoading ? (
                                                        <div className={styles.loaderDiv}>
                                                            <div
                                                                className={styles.loader}
                                                                style={{
                                                                    borderTop: `8px solid ${selectedQuestion.color}`
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (crashed ? (
                                                        <div className={styles.answerCrashMessage}>
                                                            <FormattedMessage
                                                                defaultMessage="Oops! Something went wrong."
                                                                description="Crash Message title"
                                                                id="gui.crashMessage.label"
                                                            />
                                                        </div>
                                                    ) : null))}
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Draggable>
                </div>
            </div>
        );
    }
}

IRDebugger.propTypes = {
    intl: intlShape.isRequired,
    vm: PropTypes.instanceOf(VirtualMachine).isRequired,
    target: PropTypes.shape({
        id: PropTypes.string.isRequired,
        optionName: PropTypes.string.isRequired,
        sprite: PropTypes.shape({
            name: PropTypes.string.isRequired
        }),
        isStage: PropTypes.bool.isRequired,
        origin: PropTypes.shape({
            id: PropTypes.string.isRequired
        }),
        costumeUrl: PropTypes.string
    }),
    targetOptions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        optionName: PropTypes.string.isRequired
    })),
    selectedBlockExecution: PropTypes.shape({
        uniqueId: PropTypes.string.isRequired,
        optionName: PropTypes.string.isRequired
    }),
    blockExecutionOptions: PropTypes.arrayOf(PropTypes.shape({
        uniqueId: PropTypes.string.isRequired,
        optionName: PropTypes.string.isRequired
    })),
    blockId: PropTypes.string,
    questionHierarchy: PropTypes.arrayOf(PropTypes.instanceOf(QuestionCategory)),
    selectedQuestion: PropTypes.instanceOf(Question),
    answerLoading: PropTypes.bool.isRequired,
    answer: PropTypes.instanceOf(Answer),
    expanded: PropTypes.bool.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    onTargetChange: PropTypes.func.isRequired,
    onBlockExecutionChange: PropTypes.func.isRequired,
    handleRefresh: PropTypes.func.isRequired,
    onQuestionClick: PropTypes.func.isRequired,
    onGraphNodeClick: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onBack: PropTypes.func,
    onShrinkExpand: PropTypes.func.isRequired,
    onStartDrag: PropTypes.func,
    onDrag: PropTypes.func,
    onEndDrag: PropTypes.func,
    crashed: PropTypes.bool.isRequired
};

export default injectIntl(IRDebugger);
