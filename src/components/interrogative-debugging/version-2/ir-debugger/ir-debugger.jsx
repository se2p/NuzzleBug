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
            blockWidth = (block.width * scaleFactor) + 25;
            if (svgGroup.getAttribute('id') === 'visibility') {
                this._addOffsetToBackground(svgGroup, 35);
                this._addOffsetToTextNodes(svgGroup, 17.5);
                blockWidth += 25;
            }
            this._addStartValueIcon(svgGroup, executionInfo);
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

    _getGreenFlagIcon () {
        const greenFlagImage = document.createElement('image');
        greenFlagImage.setAttribute('xlink:href', './static/blocks-media/green-flag.svg');
        return greenFlagImage;
    }

    _getEyeIcon () {
        const svg = document.createElement('svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('viewBox', '0 0 1000 1000');
        const path = document.createElement('path');
        path.setAttribute('d',
            `M500,163.1c-183.8,0-398.1,122.5-490,367.5c91.9,183.8,275.6,306.3,490,306.3s398.1-122.5,490-306.3
            C898.1,285.6,683.8,163.1,500,163.1z M500,775.6c-183.8,0-336.9-122.5-367.5-245c30.6-122.5,183.8-245,
            367.5-245s336.9,122.5,367.5,245C836.9,653.1,683.8,775.6,500,775.6z M500,346.9c-19.1,0-36.4,3.8-53.6,
            8.6c31.6,14.4,53.6,45.9,53.6,83.3c0,50.7-41.2,91.9-91.9,91.9c-37.3,0-68.9-22-83.3-53.6c-4.8,17.2-8.6,
            34.5-8.6,53.6c0,101.4,82.3,183.8,183.8,183.8s183.8-82.3,183.8-183.8S601.4,346.9,500,346.9z`);
        svg.appendChild(path);
        return svg;
    }

    _getCloneIcon () {
        const svg = document.createElement('svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('viewBox', '0 0 20 20');
        const sprite = document.createElement('path');
        sprite.setAttribute('fill', '#FFAB19');
        sprite.setAttribute('transform', 'translate(-1,0)');
        sprite.setAttribute('d',
            `M 12.2753 11.6677 C 12.2753 14.7585 9.7593 16.05 6.6685 16.05 C 3.5789 16.05 1.0758 14.7585 1.0758 11.6677 
            C 1.0758 10.9039 1.2039 10.2575 1.4519 9.7169 L 1.3578 5.2512 C 1.3461 4.7576 1.8984 4.4756 2.298 4.7693 
            L 4.6836 6.5674 C 5.2359 6.2735 5.9175 6.1443 6.6685 6.1443 C 7.4218 6.1443 8.1152 6.2735 8.6675 6.5674 
            L 11.0532 4.7693 C 11.4409 4.4756 11.9933 4.7576 11.9933 5.2512 L 11.8993 9.7169 C 12.1461 10.2575 12.2753 
            10.9039 12.2753 11.6677 Z M 9.0309 13.5946 C 9.1966 13.4195 9.1719 13.1364 8.9851 12.9718 C 8.8088 12.819 
            8.5256 12.8425 8.3622 13.0318 C 8.2317 13.1834 8.0437 13.2656 7.844 13.2656 C 7.4679 13.2656 7.1506 12.96 
            7.1506 12.5722 L 7.1506 11.9259 C 7.8322 11.7379 8.3493 11.1632 8.3493 10.786 C 8.3493 10.3159 7.6089 
            10.3159 6.7157 10.3159 C 5.812 10.3159 5.0835 10.3159 5.0835 10.786 C 5.0835 11.1632 5.577 11.7379 6.2692 
            11.9142 L 6.2692 12.5722 C 6.2692 12.96 5.9649 13.2656 5.5876 13.2656 C 5.3772 13.2656 5.188 13.1834 5.0587 
            13.0318 C 4.906 12.8425 4.6239 12.819 4.4359 12.9718 C 4.2491 13.1364 4.2361 13.4195 4.39 13.5946 C 4.6839 
            13.9473 5.1176 14.1471 5.5876 14.1471 C 6.0224 14.1471 6.422 13.9602 6.7157 13.6664 C 6.999 13.9602 7.3974 
            14.1471 7.844 14.1471 C 8.3035 14.1471 8.7371 13.9473 9.0309 13.5946 Z`);
        svg.appendChild(sprite);
        const plusSign = document.createElement('path');
        plusSign.setAttribute('fill', '#FFAB19');
        plusSign.setAttribute('transform', 'translate(-2,-3)');
        plusSign.setAttribute('d',
            `M 18.8 9.2 L 20.9 9.2 C 20.9 9.2 21.95 9.2 21.95 10.25 C 21.95 11.3 20.9 11.3 20.9 11.3 L 18.8 11.3 
            L 18.8 13.4 C 18.8 13.4 18.8 14.45 17.75 14.45 C 16.7 14.45 16.7 13.4 16.7 13.4 L 16.7 11.3 L 14.6 11.3 
            C 14.6 11.3 13.55 11.3 13.55 10.25 C 13.55 9.2 14.6 9.2 14.6 9.2 L 16.7 9.2 L 16.7 7.1 C 16.7 7.1 16.7 
            6.05 17.75 6.05 C 18.8 6.05 18.8 7.1 18.8 7.1 L 18.8 9.2 Z`);
        svg.appendChild(plusSign);
        return svg;
    }

    _addStartValueIcon (svgGroup, executionInfo) {
        const startValueIconGroup = document.createElement('g');
        startValueIconGroup.setAttribute('transform', 'translate(16, 6)');
        let startValueIcon;
        if (executionInfo.isCloneStartValue) {
            startValueIcon = this._getCloneIcon();
        } else if (executionInfo.isObservationStartValue) {
            startValueIcon = this._getEyeIcon();
        } else {
            startValueIcon = this._getGreenFlagIcon();
        }
        startValueIcon.setAttribute('height', '26px');
        startValueIcon.setAttribute('width', '26px');
        startValueIconGroup.appendChild(startValueIcon);
        svgGroup.innerHTML += startValueIconGroup.outerHTML;

        const offset = 35;
        this._addOffsetToBackground(svgGroup, offset);
        this._addOffsetToTextNodes(svgGroup, offset);
        Array.from(svgGroup.childNodes).forEach(childNode => {
            if (childNode.getAttribute('data-argument-type') !== 'dropdown') {
                this._addOffsetToTextNodes(childNode, offset);
            }
        });
        this._addOffsetToDropDownNodes(svgGroup, offset);
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
