import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Draggable from 'react-draggable';
import {injectIntl, intlShape} from 'react-intl';
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
        this.questionHierarchy = React.createRef();
    }

    componentDidMount () {
        const questionHierarchyWidth = this.questionHierarchy.current.clientWidth;
        this.questionHierarchy.current.setAttribute('style', `width: ${questionHierarchyWidth}px`);
    }

    createSvgBlock (block, scaleFactor, executionInfo, background) {
        const NS = 'http://www.w3.org/2000/svg';
        const blockStrokeWidth = 1;

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
                this._addInputTooltips(svgGroup, executionInfo);
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

        const backgroundPath = Array.from(svgGroup.childNodes)
            .find(n => n.getAttribute('class')?.includes('blocklyBlockBackground'));
        const pathData = backgroundPath.getAttribute('d');
        const relevantPathData = pathData.split('H')[block.startHat_ ? 1 : 2].split('v')[0].split('a');
        const horizontalLineEnd = Number(relevantPathData[0]);
        const arcWidth = Number(relevantPathData[1].split(' ')[4].split(',')[0]);
        const maximalXCoordinate = horizontalLineEnd + arcWidth;
        let blockWidth = maximalXCoordinate * scaleFactor;

        blockHeight += 2 * blockStrokeWidth;
        blockWidth += 2 * blockStrokeWidth;

        const svgBlock = document.createElementNS(NS, 'svg');
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
            rect.setAttribute('height', `${blockHeight + (2 * blockBorder.radius)}px`);
            rect.setAttribute('width', `${blockWidth + (2 * blockBorder.radius)}px`);
            rect.setAttribute('x', `${blockBorder.width}`);
            rect.setAttribute('y', `${blockBorder.width}`);
            rect.setAttribute('rx', `${blockBorder.radius}`);
            rect.setAttribute('ry', `${blockBorder.radius}`);
            rect.innerHTML += `<title>${background.title}</title>`;
            backgroundPath.innerHTML += `<title>${background.title}</title>`;
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

    _addInputTooltips (node, executionInfo) {
        const isValueInput = node.getAttribute('data-shapes') === 'reporter round';
        const isBooleanInput = node.getAttribute('data-shapes') === 'reporter boolean';
        if (isValueInput || isBooleanInput) {
            const blockId = node.getAttribute('data-id');
            let value = executionInfo.inputValues[blockId];
            if (typeof value !== 'undefined') {
                if (isBooleanInput) {
                    value = this.props.intl.formatMessage({id: `gui.ir-debugger.condition.${value}`});
                }
                node.innerHTML += `<title>${value}</title>`;
            }
        }
        for (const child of node.children) {
            this._addInputTooltips(child, executionInfo);
        }
    }

    render () {
        const {
            vm,
            target,
            targetOptions,
            blockId,
            questionHierarchy,
            selectedQuestion,
            answer,
            expanded,
            handleRefresh,
            onTargetChange,
            onQuestionClick,
            onGraphNodeClick,
            onClose,
            onBack,
            onShrinkExpand,
            onDrag,
            onStartDrag,
            onEndDrag,
            ...posProps
        } = this.props;
    
        let {x, y} = posProps;
        const cardHorizontalDragOffset = 800; // ~80% of card width
        const cardVerticalDragOffset = expanded ? 400 : 0; // ~80% of card height
        const menuBarHeight = 48;
        if (x === 0 && y === 0) {
            x = 292 + cardHorizontalDragOffset;
            y = 50;
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
                                <IRHeader
                                    target={target}
                                    blockId={blockId}
                                    targetOptions={targetOptions}
                                    expanded={expanded}
                                    onRefresh={handleRefresh}
                                    onTargetChange={onTargetChange}
                                    onClose={onClose}
                                    onBack={onBack}
                                    onShrinkExpand={onShrinkExpand}
                                    createSvgBlock={this.createSvgBlock}
                                />
                                <div className={expanded ? styles.body : cardStyles.hidden}>
                                    <div
                                        ref={this.questionHierarchy}
                                        className={styles.questionHierarchy}
                                    >
                                        <IRQuestionHierarchy
                                            questionHierarchy={questionHierarchy}
                                            selectedQuestion={selectedQuestion}
                                            onQuestionClick={onQuestionClick}
                                        />
                                    </div>
                                    <div className={styles.answerArea}>
                                        {selectedQuestion ? (
                                            <div>
                                                <div className={styles.selectedQuestion}>
                                                    <IRSelectedQuestion
                                                        selectedQuestion={selectedQuestion}
                                                    />
                                                </div>
                                                <div className={styles.answer}>
                                                    <IRAnswer
                                                        answer={answer}
                                                        vm={vm}
                                                        createSvgBlock={this.createSvgBlock}
                                                        onGraphNodeClick={onGraphNodeClick}
                                                        setCursorOfBlock={this.setCursorOfBlock}
                                                    />
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
        costumeUrl: PropTypes.string
    }).isRequired,
    targetOptions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        optionName: PropTypes.string.isRequired
    })).isRequired,
    blockId: PropTypes.string,
    questionHierarchy: PropTypes.arrayOf(PropTypes.instanceOf(QuestionCategory)).isRequired,
    selectedQuestion: PropTypes.instanceOf(Question),
    answer: PropTypes.instanceOf(Answer),
    expanded: PropTypes.bool.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    onTargetChange: PropTypes.func.isRequired,
    handleRefresh: PropTypes.func.isRequired,
    onQuestionClick: PropTypes.func.isRequired,
    onGraphNodeClick: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onBack: PropTypes.func,
    onShrinkExpand: PropTypes.func.isRequired,
    onStartDrag: PropTypes.func,
    onDrag: PropTypes.func,
    onEndDrag: PropTypes.func
};

export default injectIntl(IRDebugger);
