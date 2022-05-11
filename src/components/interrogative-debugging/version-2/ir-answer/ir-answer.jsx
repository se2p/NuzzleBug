import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl, intlShape, FormattedHTMLMessage} from 'react-intl';
import Viz from 'viz.js';
import bindAll from 'lodash.bindall';

import VirtualMachine from 'scratch-vm';
import ScratchBlocks from 'scratch-blocks';
import {AnswerV2 as Answer, QuestionV2 as Question, targetForBlockId, QuestionCategoryType} from 'scratch-ir';

import scratchblocks from 'scratchblocks';

import getCostumeUrl from '../../../../lib/get-costume-url';

import styles from './ir-answer.css';
import irStyles from '../ir-styles.css';
import cat from './cat.png';
import unicorn from './unicorn.gif';
import mousePointer from '../icons/icon--mouse.svg';
import zoomInIcon from '../icons/icon--plus.svg';
import zoomOutIcon from '../icons/icon--minus.svg';

import positiveFeedback from '../icons/icon--positive-feedback.svg';
import neutralFeedback from '../icons/icon--neutral-feedback.svg';
import negativeFeedback from '../icons/icon--negative-feedback.svg';

const Feedback = Object.freeze({
    POSITIVE: 1,
    NEUTRAL: 0,
    NEGATIVE: -1
});

let initCount = 0;

class IRAnswer extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'handleZoomGraphIn',
            'handleZoomGraphOut',
            'handleSelectedBlockChange',
            'handleFeedback',
            'handlePositiveFeedback',
            'handleNeutralFeedback',
            'handleNegativeFeedback'
        ]);
    
        this.graphDiv = React.createRef();
        this.targetsDiv = React.createRef();
        this.stage = React.createRef();
        this.slider = React.createRef();
        this.sliderValueLabel = React.createRef();
        this.zoomFactor = 1;
        this.zoomStepSize = 0.1;
        this.gray = '#575E75';
        this.lightGray = '#ABAEBA';
        this.labelSize = 8;
        this.targets = props.vm.runtime.targets;
        this.target = this.targets.find(t => t.id === this.props.target.origin.id);
        this.otherTargets = this.targets.filter(t => t.id !== this.props.target.origin.id);
        this.targetColor = '#96EBD3';
        this.otherTargetColors = ['#EDB7E8', '#9BE0F1', '#C3B5F5', '#C6F79E', '#F2B2A7'];
        this.eventColor = '#FFDE7A';
        this.targetColors = {};
        this.state = {
            messages: props.answer.messages,
            selectedBlockId: null,
            distancePath: null,
            mousePosition: null,
            edgePositions: []
        };
        initCount += 1;
    }

    componentDidMount () {
        if (this.graphDiv.current) {
            this._addResponsibleTargetImages();
            this._drawGraph();
        }
        if (this.stage.current) {
            this._drawStage();
        }
        if (this.slider.current && this.sliderValueLabel.current) {
            this.updateSliderValueLabel();
        }
        this._renderScratchBlocks();
    }

    componentDidUpdate (prevProps) {
        if (prevProps.answer !== this.props.answer && this.graphDiv.current) {
            this.graphSize = null;
            this._addResponsibleTargetImages();
            this._drawGraph();
        }
    }

    _renderScratchBlocks () {
        const scale = this.props.selectedQuestion.category === QuestionCategoryType.OPERATORS ? 0.6 : 0.5;
        scratchblocks.renderMatching('#answerMessages code.scratchBlock', {
            inline: true,
            style: 'scratch3',
            languages: ['en', 'de'],
            scale: scale
        });
    }

    _drawStage () {
        const answer = this.props.answer;
        const runtime = this.props.vm.runtime;
        const renderer = this.props.vm.renderer;
        renderer.draw();
        const stageCanvas = this.stage.current;
        stageCanvas.width = runtime.constructor.STAGE_WIDTH;
        stageCanvas.height = runtime.constructor.STAGE_HEIGHT;
        const scaleFactor = 1 / 0.5;
        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = stageCanvas.width * scaleFactor;
        tmpCanvas.height = stageCanvas.height * scaleFactor;
        const tmpContext = tmpCanvas.getContext('2d');
        tmpContext.drawImage(renderer.canvas, 0, 0, tmpCanvas.width, tmpCanvas.height);
        const stageContext = stageCanvas.getContext('2d');
        stageContext.drawImage(tmpCanvas, 0, 0, stageCanvas.width, stageCanvas.height);
        if (answer.stage.distance && answer.stage.distance.path) {
            const path = answer.stage.distance.path;
            const start = this._transformScratchPositionToCanvasPosition(path.start, stageCanvas);
            const end = this._transformScratchPositionToCanvasPosition(path.end, stageCanvas);
            const distancePath = `M${start.x},${start.y} L${end.x},${end.y}`;
            this.setState({distancePath});
        }
        if (answer.stage.mousePosition) {
            const mousePosition = this._transformScratchPositionToCanvasPosition(
                answer.stage.mousePosition, stageCanvas);
            mousePosition.x -= 6;
            mousePosition.y -= 3;
            this.setState({mousePosition});
        }
        if (answer.stage.edgePositions) {
            const edgePositions = [];
            for (const scratchPosition of answer.stage.edgePositions) {
                const position = this._transformScratchPositionToCanvasPosition(scratchPosition, stageCanvas);
                edgePositions.push(position);
            }
            this.setState({edgePositions});
        }
        if (answer.stage.relevantPositions) {
            this._highlightRelevantPositions(answer.stage.relevantPositions, stageCanvas, tmpCanvas,
                stageContext, tmpContext, scaleFactor);
        }
    }

    _transformScratchPositionToCanvasPosition (position, stage) {
        return {
            x: (stage.width / 2) + position.x,
            y: (stage.height / 2) - position.y
        };
    }

    _highlightRelevantPositions (relevantScratchPositions, stageCanvas, tmpCanvas,
        stageContext, tmpContext, scaleFactor) {
        const imageData = tmpContext.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height);
        for (let x = 0; x < tmpCanvas.width; x++) {
            for (let y = 0; y < tmpCanvas.height; y++) {
                const colorIndices = this._getColorIndicesForPosition(x, y, tmpCanvas.width);
                const alphaIndex = colorIndices[3];
                imageData.data[alphaIndex] = imageData.data[alphaIndex] * 0.1;
            }
        }
        for (const scratchPosition of relevantScratchPositions) {
            const position = this._transformScratchPositionToCanvasPosition(scratchPosition, stageCanvas);
            if (position.x < 0 || position.x > stageCanvas.width || position.y < 0 || position.y > stageCanvas.height) {
                continue;
            }
            position.x = Math.round(position.x * scaleFactor);
            position.y = Math.round(position.y * scaleFactor);
            const colorIndices = this._getColorIndicesForPosition(position.x, position.y, tmpCanvas.width);
            const alphaIndex = colorIndices[3];
            imageData.data[alphaIndex] = 255;
        }
        tmpContext.putImageData(imageData, 0, 0);
        stageContext.clearRect(0, 0, stageCanvas.width, stageCanvas.height);
        stageContext.drawImage(tmpCanvas, 0, 0, stageCanvas.width, stageCanvas.height);
    }

    _getColorIndicesForPosition (x, y, width) {
        const red = (y * (width * 4)) + (x * 4);
        return [red, red + 1, red + 2, red + 3];
    }

    _drawGraph () {
        const graph = this.props.answer.graph;
        const graphNodes = graph.getAllNodes();

        this.graphDiv.current.innerHTML = this._createGraphSvg(graph);
        const svgGraphNode = this.graphDiv.current.children[0].children[0];
        const svgGraphChildren = Array.from(svgGraphNode.children);
        
        const svgGraphEdges = this._adaptGraphEdges(svgGraphChildren);
        const svgGraphNodes = this._adaptGraphNodes(svgGraphChildren, graphNodes);
        svgGraphNode.innerHTML = '';
        for (const node of svgGraphEdges) {
            svgGraphNode.appendChild(node);
        }
        for (const node of svgGraphNodes) {
            svgGraphNode.appendChild(node);
        }
        
        if (this.graphSize) {
            this._updateGraphSize(this.graphDiv.current.children[0]);
        } else {
            this._initGraphSize();
        }
        
        this.forceUpdate();
    }

    _createGraphSvg (graph) {
        const graphString = graph.toDot(n => n.id);
        const graphViz = Viz(graphString, {format: 'svg'});
        const graphSvg = `<svg${graphViz.split('<svg')[1]}`;
        return graphSvg;
    }

    _initGraphSize () {
        const svgNode = this.graphDiv.current.children[0];
        const height = Number(svgNode.getAttribute('height').split('pt')[0]) + 20;
        const width = Number(svgNode.getAttribute('width').split('pt')[0]);
        this.graphSize = {height, width};
        let zoomFactor = 1;
        if (width > 600) {
            zoomFactor = 600 / width;
        }
        if (width < 400) {
            zoomFactor = 400 / width;
        }
        this._setZoomFactor(zoomFactor);
        this._updateGraphSize(svgNode);
    }

    _setZoomFactor (zoomFactor) {
        zoomFactor -= (zoomFactor * 100) % (this.zoomStepSize * 100) / 100;
        zoomFactor = Math.max(zoomFactor, this.zoomStepSize);
        this.zoomFactor = Number(zoomFactor.toFixed(2));
    }

    _updateGraphSize (svgNode) {
        svgNode.setAttribute('height', `${this.graphSize.height * this.zoomFactor}px`);
        svgNode.setAttribute('width', `${this.graphSize.width * this.zoomFactor}px`);
    }

    _removeGraphTitle (svgGraphChildren) {
        const titleNode = svgGraphChildren.find(n => n.nodeName === 'title');
        titleNode.parentNode.removeChild(titleNode);
    }

    _adaptGraphNodes (svgGraphChildren, graphNodes) {
        const nodeFilter = node => node.getAttribute('class') === 'node';
        const svgGraphNodes = svgGraphChildren.filter(nodeFilter);
        for (const svgGraphNode of svgGraphNodes) {

            const children = this._getAndRemoveAllNodeChildren(svgGraphNode);

            let scaleFactor = 0.7;
            const graphNode = graphNodes.find(n => n.id === children.title.innerHTML);
            const block = this._appendSvgBlock(svgGraphNode, graphNode, scaleFactor);
            const ellipse = this._extractEllipseAttributes(children.ellipse);

            scaleFactor = this._transformNode(svgGraphNode, block, ellipse, scaleFactor);

            if (this.props.answer.blockMessages[block.id]) {
                if (this.state.selectedBlockId === block.id) {
                    this._addRedBorderToBlock(block, svgGraphNode);
                    this._addQuestionButtonToBlock(block, svgGraphNode, scaleFactor, 'red');
                } else {
                    this._addQuestionButtonToBlock(block, svgGraphNode, scaleFactor, this.lightGray);
                }
            }

            this._addRelevantValueBeforeAndAfterExecution(graphNode, svgGraphNode, block, scaleFactor);
            
            const svgGraphNodeChildren = Array.from(svgGraphNode.children);
            if (block.isStackBlock) {
                const svgBlock = svgGraphNodeChildren.find(n => n.nodeName === 'svg');
                svgBlock.addEventListener('click', () => this.props.onGraphNodeClick(graphNode));
                this.props.setCursorOfBlock(svgBlock, 'pointer');
                const redBlockBorder = svgGraphNodeChildren.find(n => n.id === 'red-block-border');
                if (redBlockBorder) {
                    redBlockBorder.addEventListener('click', () => this.props.onGraphNodeClick(graphNode));
                    this.props.setCursorOfBlock(redBlockBorder, 'pointer');
                }
            }
            const questionButton = svgGraphNodeChildren.find(n => n.getAttribute('id') === 'question-button');
            if (questionButton) {
                questionButton.addEventListener('click', () => this.handleSelectedBlockChange(block.id));
                this.props.setCursorOfBlock(questionButton, 'pointer');
            }
        }
        return svgGraphNodes;
    }

    _getAndRemoveAllNodeChildren (svgGraphNode) {
        const children = Array.from(svgGraphNode.children);
        const title = children.find(n => n.nodeName === 'title');
        const text = children.find(c => c.nodeName === 'text');
        const ellipse = children.find(c => c.nodeName === 'ellipse');
        svgGraphNode.removeChild(title);
        svgGraphNode.removeChild(text);
        svgGraphNode.removeChild(ellipse);
        return {title, text, ellipse};
    }

    _appendSvgBlock (svgGraphNode, graphNode, scaleFactor) {
        const blockId = graphNode.block.id;
        const block = this._getScratchBlock(blockId);
        const executionInfo = this._getNodeExecutionInfo(graphNode);
        let targetForBlock = targetForBlockId(this.targets, blockId);
        if (!targetForBlock) {
            targetForBlock = this.target;
        }
        let color = 'transparent';
        let title = '';
        if (targetForBlock) {
            color = this.targetColors[targetForBlock.id] ? this.targetColors[targetForBlock.id] : 'transparent';
            title = targetForBlock.isStage ?
                this._translate('block.from.stage') :
                this._translate('block.from.sprite', {sprite: targetForBlock.getName()});
        }
        const background = {color, title};
        const svgBlock = this.props.createSvgBlock(block, scaleFactor, executionInfo, background);
        const width = Number(svgBlock.getAttribute('width').split('px')[0]);
        const height = Number(svgBlock.getAttribute('height').split('px')[0]);
        svgGraphNode.appendChild(svgBlock);
        return {id: blockId, width, height, isStackBlock: !block.outputConnection && block.previousConnection};
    }

    _getScratchBlock (blockId) {
        let block = ScratchBlocks.getAbstractWorkspace().getBlockById(blockId);
        if (block) {
            return block;
        }
        const workspaces = Object.values(ScratchBlocks.Workspace.WorkspaceDB_);
        for (const workspace of workspaces) {
            block = workspace.getBlockById(blockId);
            if (block) {
                return block;
            }
        }
        return null;
    }

    _extractEllipseAttributes (ellipseNode) {
        const ellipse = {};
        // actual width - diameter for circles on both sides of the block (e.g. for move direction)
        ellipse.width = (Number(ellipseNode.getAttribute('rx')) * 2) - (16 * 2);
        ellipse.height = Number(ellipseNode.getAttribute('ry')) * 2;
        ellipse.center = {
            x: Number(ellipseNode.getAttribute('cx')),
            y: Number(ellipseNode.getAttribute('cy'))
        };
        return ellipse;
    }

    _transformNode (svgGraphNode, block, ellipse, scaleFactor) {
        const transform = this._calculateBlockTransformation(ellipse, block, scaleFactor);
        svgGraphNode.setAttribute('transform',
            `translate(${transform.x},${transform.y}) scale(${transform.scaleFactor})`);
        return transform.scaleFactor;
    }

    _calculateBlockTransformation (ellipse, block, scaleFactor) {
        if (ellipse.width < block.width * scaleFactor) {
            scaleFactor = ellipse.width / block.width;
        }
        if (ellipse.height < block.height * scaleFactor) {
            scaleFactor = ellipse.height / block.height;
        }
        const width = block.width * scaleFactor;
        const height = block.height * scaleFactor;
        const x = ellipse.center.x - (width / 2);
        const y = ellipse.center.y - (height / 2);
        return {x, y, scaleFactor};
    }

    _getNodeExecutionInfo (graphNode) {
        return this.props.answer.graph.executionInfo.blocks[graphNode.id];
    }
    
    _addEdgeForActualConditionValue (svgGraphNode, value, block, scaleFactor) {
        const arrowPosition = {x: block.width + 10, y: block.height / 2};
        const arrowLength = 40;
        const triangleLength = 10;
        svgGraphNode.innerHTML +=
            this._createHtmlArrow(arrowPosition, arrowLength, triangleLength, 1 / scaleFactor, 0, this.gray);

        const text = this._translate(`condition.${value}`);
        const fontSize = this.labelSize / scaleFactor;
        const textPosition = {x: block.width + 10, y: fontSize};
        svgGraphNode.innerHTML += this._createHtmlText(text, textPosition, fontSize, this.gray, 'start');
    }

    _addRelevantValueBeforeAndAfterExecution (graphNode, svgGraphNode, block, scaleFactor) {
        const executionInfo = this._getNodeExecutionInfo(graphNode);
        if (executionInfo.relevantValue) {
            const labelSize = this.labelSize / scaleFactor;
            if (typeof executionInfo.relevantValue.before !== 'undefined') {
                const text = executionInfo.relevantValue.before;
                const position = {x: 3, y: block.height + labelSize};
                if (executionInfo.relevantValue.rotationStyle?.before) {
                    position.x += 15;
                }
                const color = this._hexToRgba(executionInfo.relevantValue.color, 0.5);
                svgGraphNode.innerHTML += this._createHtmlText(text, position, labelSize, color,
                    'start', 'before-value');
            }
            if (typeof executionInfo.relevantValue.after !== 'undefined') {
                const text = executionInfo.relevantValue.after;
                const position = {x: block.width - 3, y: block.height + labelSize};
                const color = executionInfo.relevantValue.color;
                svgGraphNode.innerHTML += this._createHtmlText(text, position, labelSize, color, 'end', 'after-value');
            }
            if (typeof executionInfo.relevantValue.direction !== 'undefined') {
                const direction = executionInfo.relevantValue.direction;
                const color = executionInfo.relevantValue.color;
                const text = `${direction}°`;
                const textPosition = {x: -5, y: labelSize + 5};
                svgGraphNode.innerHTML += this._createHtmlText(text, textPosition, labelSize, color, 'end');

                const arrowLineLength = 12;
                const arrowTriangleLength = 7;
                const arrowLength = (arrowLineLength + arrowTriangleLength) * scaleFactor;
                const arrowPosition = {x: textPosition.x - arrowLength, y: textPosition.y + arrowLength + 5};
                const circleColor = this._hexToRgba(color, 0.2);
                svgGraphNode.innerHTML += this._createHtmlCircle(arrowPosition, arrowLength + 1,
                    circleColor, circleColor);
                svgGraphNode.innerHTML += this._createHtmlArrow(arrowPosition, arrowLineLength,
                    arrowTriangleLength, scaleFactor, direction - 90, color);
            }
            const maxTextLength = (block.width / 2) - 5;
            const textBackgrounds = [];
            let afterValueTextLength;
            svgGraphNode.childNodes.forEach(node => {
                if (node.nodeName === 'text') {
                    let initialTextLength = node.textLength.baseVal.value;
                    if (initialTextLength === 0) {
                        initialTextLength = node.getBoundingClientRect().width;
                    }
                    let textLength = initialTextLength > maxTextLength ? maxTextLength : initialTextLength;
                    node.setAttribute('textLength', `${textLength}`);
                    node.setAttribute('font-weight', 'bold');

                    if (node.getAttribute('class') === 'after-value') {
                        afterValueTextLength = textLength;
                    }
                    if (executionInfo.relevantValue.rotationStyle) {
                        textLength += 15;
                    }

                    const textBackground = document.createElement('rect');
                    let x = node.getAttribute('x');
                    if (node.getAttribute('text-anchor') === 'end') {
                        x -= textLength;
                    }
                    const fontSize = +node.getAttribute('font-size');
                    const y = node.getAttribute('y') - fontSize + 1;
                    textBackground.setAttribute('transform', `translate(${x}, ${y})`);
                    textBackground.setAttribute('height', `${fontSize + 3}px`);
                    textBackground.setAttribute('width', `${textLength}px`);
                    textBackground.setAttribute('fill', 'white');
                    textBackgrounds.push(textBackground);
                }
            });
            if (executionInfo.relevantValue.rotationStyle?.before) {
                const rotationStyle = executionInfo.relevantValue.rotationStyle.before;
                const position = {x: 3, y: block.height};
                svgGraphNode.innerHTML += this._createRotationStyleIcon(rotationStyle, position, 0.75, 0.5);
            }
            if (executionInfo.relevantValue.rotationStyle?.after) {
                const rotationStyle = executionInfo.relevantValue.rotationStyle.after;
                const position = {x: block.width - 3 - 15 - afterValueTextLength, y: block.height};
                svgGraphNode.innerHTML += this._createRotationStyleIcon(rotationStyle, position, 0.75, 1);
            }
            for (const textBackground of textBackgrounds) {
                svgGraphNode.innerHTML = textBackground.outerHTML + svgGraphNode.innerHTML;
            }
        }
    }

    _addRedBorderToBlock (block, svgGraphNode) {
        const path = document.createElement('path');
        path.setAttribute('id', 'red-block-border');
        path.setAttribute('stroke', 'red');
        path.setAttribute('stroke-width', '4');
        path.setAttribute('fill', 'none');
        const width = block.width - 12;
        const height = block.height - 12;
        path.setAttribute('d', `
            M 6,2
            h ${width}
            a 4,4 0 0,1 4,4
            v ${height}
            a 4,4 0 0,1 -4,4 
            h ${-width}
            a 4,4 0 0,1 -4,-4 
            v ${-height}
            a 4,4 0 0,1 4,-4 
            Z`);
        svgGraphNode.innerHTML += path.outerHTML;
    }

    _addQuestionButtonToBlock (block, svgGraphNode, scaleFactor, color) {
        const labelSize = this.labelSize / scaleFactor;
        const radius = 8 / scaleFactor;
        const questionMarkPosition = {
            x: block.width + radius - 0.2,
            y: (block.height / 2) + (labelSize * 0.38)
        };
        const questionMark = this._createHtmlText('?', questionMarkPosition, labelSize, color, 'start');
        svgGraphNode.innerHTML += questionMark;

        const circle = document.createElement('rect');
        circle.setAttribute('id', 'question-button');
        circle.setAttribute('fill', `${color}`);
        circle.setAttribute('stroke', `${color}`);
        circle.setAttribute('fill-opacity', '0.2');
        circle.setAttribute('stroke-width', '2');
        circle.setAttribute('stroke-linecap', `round`);
        circle.setAttribute('height', `${radius * 2}px`);
        circle.setAttribute('width', `${radius * 2}px`);
        circle.setAttribute('x', `${block.width + 3}`);
        circle.setAttribute('y', `${(block.height / 2) - radius}`);
        circle.setAttribute('rx', `${radius}`);
        circle.setAttribute('ry', `${radius}`);
        svgGraphNode.innerHTML += circle.outerHTML;
    }

    _adaptGraphEdges (svgGraphChildren) {
        const edgeFilter = node => node.getAttribute('class') === 'edge';
        const svgGraphEdges = svgGraphChildren.filter(edgeFilter);
        for (const svgGraphEdge of svgGraphEdges) {
            
            const {pathNode, polygonNode, titleNode} = this._getEdgeChildren(svgGraphEdge);
            svgGraphEdge.removeChild(titleNode);
            
            const executionInfo = this._getEdgeExecutionInfo(titleNode);
            
            this._updateEdgeColor(pathNode, polygonNode, executionInfo);
            
            const edge = this._extractEdgeAttributes(pathNode, polygonNode);
            if (executionInfo.condition) {
                const fromNodeId = titleNode.innerHTML.split('-&gt;')[0];
                const fromNodeExecuted = this.props.answer.graph.executionInfo.blocks[fromNodeId].executed;
                if (fromNodeExecuted && !executionInfo.executed) {
                    this._dashPath(pathNode);
                    this._addCrossOutLine(svgGraphEdge, edge.line);
                }
                if (typeof executionInfo.condition.requiredValue !== 'undefined') {
                    const text = this._translate(`condition.${executionInfo.condition.requiredValue}`);
                    this._addEdgeLabel(svgGraphEdge, edge, text, executionInfo, true);
                }
            }
            if (executionInfo.times > 1) {
                const text = `${executionInfo.times}x`;
                this._addEdgeLabel(svgGraphEdge, edge, text, executionInfo, false);
            }

            if (executionInfo.stopped || executionInfo.paused || executionInfo.observationStopped) {
                this._dashPath(pathNode);
                this._addCrossOutLine(svgGraphEdge, edge.line);
                if (executionInfo.stopped) {
                    this._addExecutionStoppedLabel(svgGraphEdge, edge);
                }
                if (executionInfo.paused) {
                    this._addExecutionPausedLabel(svgGraphEdge, edge);
                }
                if (executionInfo.observationStopped) {
                    this._addOberservationStoppedLabel(svgGraphEdge, edge);
                }
            }
        }
        return svgGraphEdges;
    }

    _getEdgeChildren (svgGraphEdge) {
        const children = Array.from(svgGraphEdge.children);
        const pathNode = children.find(n => n.nodeName === 'path');
        const polygonNode = children.find(n => n.nodeName === 'polygon');
        const titleNode = children.find(n => n.nodeName === 'title');
        return {pathNode, polygonNode, titleNode};
    }

    _getEdgeExecutionInfo (titleNode) {
        const edgeTitle = titleNode.innerHTML;
        return this.props.answer.graph.executionInfo.edges[edgeTitle];
    }

    _updateEdgeColor (pathNode, polygonNode, executionInfo) {
        let edgeColor;
        if (executionInfo.color) {
            edgeColor = executionInfo.color;
        } else {
            edgeColor = executionInfo.executed ? this.gray : this.lightGray;
        }
        pathNode.setAttribute('stroke', edgeColor);
        polygonNode.setAttribute('stroke', edgeColor);
        polygonNode.setAttribute('fill', edgeColor);
    }

    _extractEdgeAttributes (pathNode, polygonNode) {
        const path = pathNode.getAttribute('d');
        const pathStartValues = path.split('M')[1].split('C')[0].split(',');
        const pathStart = {x: Number(pathStartValues[0]), y: Number(pathStartValues[1])};
        const pathEndValues = path.split(' ')[path.split(' ').length - 1].split(',');
        const pathEnd = {x: Number(pathEndValues[0]), y: Number(pathEndValues[1])};
        const line = {start: pathStart, end: pathEnd};
        
        const polygonPoints = polygonNode.getAttribute('points');
        const arrowTipValues = polygonPoints.split(' ')[1].split(',');
        const arrowTip = {x: Number(arrowTipValues[0]), y: Number(arrowTipValues[1])};
        
        const start = pathStart;
        const end = arrowTip;
        const center = {
            x: start.x + ((end.x - start.x) / 2),
            y: start.y + ((end.y - start.y) / 2)
        };
        return {start, end, center, line};
    }

    _addEdgeLabel (svgGraphEdge, edge, text, executionInfo, isRightLabel) {
        const position = this._calculateEdgeLabelPosition(edge, 5, isRightLabel);
        const edgeColor = executionInfo.executed ? this.gray : this.lightGray;
        const textAnchor = isRightLabel ? 'start' : 'end';
        svgGraphEdge.innerHTML += this._createHtmlText(text, position, this.labelSize, edgeColor, textAnchor);
    }

    _calculateEdgeLabelPosition (edge, edgeDistance, isRightLabel) {
        const xVariance = edge.end.x - edge.start.x;
        if (!xVariance) {
            const x = edge.center.x + (isRightLabel ? edgeDistance : edgeDistance * -1);
            const y = edge.center.y;
            return {x, y};
        }
        const yVariance = edge.end.y - edge.start.y;
        const edgeGradient = yVariance / xVariance;
        const gradient = -1 / edgeGradient;
        const yIntercept = (-1 * edge.center.x * gradient) + edge.center.y;
        const orthogonalLine = x => (gradient * x) + yIntercept;
        const xDistance = Math.sqrt(Math.pow(edgeDistance, 2) / (1 + Math.pow(gradient, 2)));
        const x = edge.center.x + (isRightLabel ? xDistance : xDistance * -1);
        let y = orthogonalLine(x);
        if ((gradient > 0 && isRightLabel) || (gradient < 0 && !isRightLabel)) {
            y += this.labelSize / 2;
        }
        return {x, y};
    }

    _dashPath (pathNode) {
        pathNode.setAttribute('stroke-dasharray', '3,3');
    }

    _addCrossOutLine (svgGraphEdge, edgeLine) {
        const lineStart = {x: edgeLine.start.x + 15, y: edgeLine.start.y + 3};
        const lineEnd = {x: edgeLine.end.x - 15, y: edgeLine.end.y};
        svgGraphEdge.innerHTML += this._createHtmlLine(lineStart, lineEnd, 'red');
    }

    _createHtmlText (text, position, size, color, textAnchor, className) {
        const html =
            `<text
                text-anchor="${textAnchor}"
                x="${position.x}"
                y="${position.y}"
                font-family=""Helvetica Neue", Helvetica, sans-serif;"
                font-size="${size}" 
                fill="${color}"
                ${className ? `class="${className}"` : ''}
                lengthAdjust="spacingAndGlyphs"
            >
                ${text}
            </text>`;
        return html;
    }

    _createHtmlLine (start, end, color) {
        const d = `M${start.x},${start.y} ${end.x},${end.y}`;
        return `<path stroke="${color}" d="${d}" />`;
    }

    _createHtmlArrow (position, lineLength, triangleLength, scale, rotate, color) {
        const html =
            `<g transform="translate(${position.x},${position.y}) scale(${scale}) rotate(${rotate})">
                <path
                    fill="none"
                    stroke="${color}"
                    d="M0,0 H ${lineLength}"
                />
                <polygon
                    fill="${color}"
                    stroke="${color}"
                    points="${lineLength},-3.5 ${lineLength + triangleLength},0 ${lineLength},3.5 ${lineLength},-3.5"
                />
            </g>`;
        return html;
    }

    _createHtmlCircle (position, radius, fillColor, strokeColor) {
        const html =
            `<circle
                cx="${position.x}"
                cy="${position.y}"
                r="${radius}"
                fill="${fillColor}"
                stroke="${strokeColor}"
            />`;
        return html;
    }

    _addExecutionStoppedLabel (svgGraphEdge, edge) {
        const position = this._calculateEdgeLabelPosition(edge, 5, false);
        const text = this._translate('execution-stopped');
        const textPosition = {x: position.x - 25, y: position.y};
        svgGraphEdge.innerHTML += this._createHtmlText(text, textPosition, this.labelSize, 'red', 'end');

        const iconScaleFactor = 18 / 18.17;
        const iconPosition = {x: position.x - 20, y: position.y - 10};
        svgGraphEdge.innerHTML += this._createStopIcon(iconPosition, iconScaleFactor);
    }

    _addExecutionPausedLabel (svgGraphEdge, edge) {
        const position = this._calculateEdgeLabelPosition(edge, 5, false);
        const text = this._translate('execution-paused');
        const textPosition = {x: position.x - 20, y: position.y};
        svgGraphEdge.innerHTML += this._createHtmlText(text, textPosition, this.labelSize, 'red', 'end');

        const iconScaleFactor = 18 / 19.56;
        const iconPosition = {x: position.x - 20, y: position.y - 14};
        svgGraphEdge.innerHTML += this._createPauseIcon(iconPosition, iconScaleFactor);
    }

    _addOberservationStoppedLabel (svgGraphEdge, edge) {
        const position = this._calculateEdgeLabelPosition(edge, 5, false);
        const text = this._translate('observation-stopped');
        const textPosition = {x: position.x - 25, y: position.y};
        svgGraphEdge.innerHTML += this._createHtmlText(text, textPosition, this.labelSize, 'red', 'end');

        const iconScaleFactor = 18 / 1155.57;
        const iconPosition = {x: position.x - 20, y: position.y - 11};
        svgGraphEdge.innerHTML += this._createEyeIcon(iconPosition, iconScaleFactor);
    }

    _createStopIcon (position, scale) {
        return `<g transform="translate(${position.x},${position.y}) scale(${scale})">
                    <polygon
                        fill="red"
                        stroke="#cc0000"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-miterlimit="10"
                        points="4.3,0.5 9.7,0.5 13.5,4.3 13.5,9.7 9.7,13.5 4.3,13.5 0.5,9.7 0.5,4.3"
                    />
                </g>`;
    }
    
    _createPauseIcon (position, scale) {
        return `<g transform="translate(${position.x},${position.y}) scale(${scale})">
                    <path
                        fill="red"
                        stroke="#cc0000"
                        d="M8 5v14l11-7z"
                    />
                    <path
                        fill="none"
                        d="M0 0h24v24H0z"
                    />
                </g>`;
    }

    _createEyeIcon (position, scale) {
        return `<g transform="translate(${position.x},${position.y}) scale(${scale})">
                    <path 
                        fill="red"
                        stroke="#cc0000"
                        d="M500,163.1c-183.8,0-398.1,122.5-490,367.5c91.9,183.8,275.6,306.3,490,306.3
                        s398.1-122.5,490-306.3C898.1,285.6,683.8,163.1,500,163.1z M500,775.6c-183.8,0
                        -336.9-122.5-367.5-245c30.6-122.5,183.8-245,367.5-245s336.9,122.5,367.5,245
                        C836.9,653.1,683.8,775.6,500,775.6z M500,346.9c-19.1,0-36.4,3.8-53.6,8.6c31.6,
                        14.4,53.6,45.9,53.6,83.3c0,50.7-41.2,91.9-91.9,91.9c-37.3,0-68.9-22-83.3-53.6
                        c-4.8,17.2-8.6,34.5-8.6,53.6c0,101.4,82.3,183.8,183.8,183.8s183.8-82.3,183.8
                        -183.8S601.4,346.9,500,346.9z"
                    />
                </g>`;
    }

    _createRotationStyleIcon (rotationStyle, position, scale, fillOpacity) {
        if (rotationStyle === 'all around') {
            return this._createRotateAllAroundIcon(position, scale, fillOpacity);
        }
        if (rotationStyle === 'left-right') {
            return this._createRotateLeftRightIcon(position, scale, fillOpacity);
        }
        if (rotationStyle === 'don\'t rotate') {
            return this._createDontRotateIcon(position, scale, fillOpacity);
        }
    }

    _createRotateAllAroundIcon (position, scale, fillOpacity) {
        return `
            <g id="all-around-active"
                transform="translate(${position.x},${position.y}) scale(${scale})"
                fill-opacity="${fillOpacity}">
                <path fill="#4C97FF"
                    d="M16.8786199,10.6231329 L14.6209769,14.1433441 C14.3320842,14.6034325 13.6687009,14.6034325 
                    13.3691085,14.1433441 L11.1221651,10.6231329 C10.8011732,10.1309454 11.1542643,9.47826182 
                    11.7427495,9.47826182 L13.0267171,9.47826182 C12.7806233,7.4453131 11.0579667,5.87245277 
                    8.9704494,5.87245277 C6.71387632,5.87245277 4.87245277,7.71280635 4.87245277,9.9704494 
                    C4.87245277,12.2280925 6.71387632,14.068446 8.9704494,14.068446 C9.48510642,14.068446 
                    9.90132592,14.4846655 9.90132592,14.9993226 C9.90132592,15.5236093 9.48510642,15.9408988 
                    8.9704494,15.9408988 C5.67493253,15.9408988 3,13.2659663 3,9.9704494 C3,6.68563226 
                    5.67493253,4 8.9704494,4 C12.0947706,4 14.6637758,6.41813901 14.9098696,9.47826182 
                    L16.2580356,9.47826182 C16.8465207,9.47826182 17.1996118,10.1309454 16.8786199,10.6231329"
                />
            </g>`;
    }

    _createRotateLeftRightIcon (position, scale, fillOpacity) {
        return `
            <g id="left-right-active"
                transform="translate(${position.x},${position.y}) scale(${scale})"
                fill-opacity="${fillOpacity}">
                <g transform="translate(2.000000, 4.000000)">
                    <path
                        fill="#4D97FF"
                        transform="translate(2.332533, 6.010929) scale(-1, 1) translate(-2.332533, -6.010929)" 
                        d="M4.66453333,2.41690667 L4.66453333,9.60624 C4.66453333,10.08224 4.08853333,10.3209067
                            3.7512,9.98357333 L0.156533333,6.38890667 C-0.0514666667,6.17957333 -0.0514666667,5.84090667
                            0.156533333,5.63290667 L3.7512,2.03824 C4.08853333,1.70090667 4.66453333,1.93957333
                            4.66453333,2.41690667"
                    />
                    <path
                        fill-opacity="0.25"
                        fill="#575E75"
                        d="M7.87546667,11.7567733 C7.70213333,11.7567733 7.54213333,11.6901067 7.4088,11.5581067
                            C7.35546667,11.5047733 7.30213333,11.42344 7.26213333,11.34344 C7.2368,11.2647733 
                            7.2088,11.183447.2088,11.0901067 C7.2088,11.0101067 7.2368,10.9167733 7.26213333,10.8381067 
                            C7.30213333,10.7567733 7.35546667,10.6767733 7.4088,10.62344 C7.59546667,10.4381067 
                            7.89013333,10.3701067 8.14213333,10.4767733 C8.22346667,10.5167733 8.29013333,10.5581067 
                            8.35546667,10.62344 C8.4088,10.6767733 8.46213333,10.7567733 8.50346667,10.8381067 
                            C8.5288,10.9167733 8.5568,11.0101067 8.5568,11.0901067 C8.5568,11.18344 8.5288,11.2647733 
                            8.50346667,11.34344 C8.46213333,11.42344 8.42213333,11.5047733 8.35546667,11.5581067 
                            C8.2368,11.6901067 8.06346667,11.7567733 7.87546667,11.7567733 Z M7.22306667,3.27757333 
                            C7.22306667,2.90424 7.5164,2.61090667 7.88973333,2.61090667 C8.24973333,2.61090667 
                            8.5564,2.90424 8.5564,3.27757333 C8.5564,3.63757333 8.24973333,3.94424 7.88973333,3.94424 
                            C7.5164,3.94424 7.22306667,3.63757333 7.22306667,3.27757333 Z M7.22306667,5.87757333 
                            C7.22306667,5.50424 7.5164,5.21090667 7.88973333,5.21090667 C8.24973333,5.21090667 
                            8.5564,5.50424 8.5564,5.87757333 C8.5564,6.24957333 8.24973333,6.54424 7.88973333,6.54424 
                            C7.5164,6.54424 7.22306667,6.24957333 7.22306667,5.87757333 Z M7.22306667,8.49090667 
                            C7.22306667,8.11757333 7.5164,7.82424 7.88973333,7.82424 C8.24973333,7.82424 
                            8.5564,8.11757333 8.5564,8.49090667 C8.5564,8.85090667 8.24973333,9.15757333 
                            7.88973333,9.15757333 C7.5164,9.15757333 7.22306667,8.85090667 7.22306667,8.49090667 
                            Z M7.87546667,1.33104 C7.79546667,1.33104 7.70213333,1.31770667 7.62346667,1.29104 
                            C7.54213333,1.24970667 7.47546667,1.19637333 7.4088,1.14304 C7.35546667,1.07770667 
                            7.30213333,0.997706667 7.26213333,0.916373333 C7.2368,0.837706667 7.2088,0.756373333 
                            7.2088,0.664373333 C7.2088,0.58304 7.2368,0.49104 7.26213333,0.41104 C7.30213333,0.33104 
                            7.35546667,0.249706667 7.4088,0.196373333 C7.59546667,0.01104 7.89013333,-0.0556266667
                            8.14213333,0.05104 C8.22346667,0.0897066667 8.29013333,0.13104 8.35546667,0.196373333
                            C8.47546667,0.317706667 8.5568,0.49104 8.5568,0.664373333 C8.5568,0.756373333 
                            8.5288,0.837706667 8.50346667,0.916373333 C8.46213333,0.997706667 8.42213333,1.07770667 
                            8.35546667,1.14304 C8.22346667,1.26437333 8.06346667,1.33104 7.87546667,1.33104 Z" 
                    />
                    <path
                        fill="#4D97FF"
                        transform="translate(13.434500, 6.010396) scale(-1, 1) translate(-13.434500, -6.010396) "
                            d="M11.102,9.60570667 L11.102,2.41637333 C11.102,1.93904 11.6793333,1.70037333
                            12.0166667,2.03770667 L15.61,5.63370667 C15.8193333,5.84170667 15.8193333,6.18037333 
                            15.61,6.38970667 L12.0166667,9.98304 C11.6793333,10.3203733 11.102,10.0817067 
                            11.102,9.60570667"
                    />
                </g>
            </g>`;
    }

    _createDontRotateIcon (position, scale, fillOpacity) {
        return `
            <g id="dont-rotate-active" 
                transform="translate(${position.x},${position.y}) scale(${scale})"
                fill-opacity="${fillOpacity}">
                <path fill="#4D97FF"
                    d="M12.5888771,8.06902644 L13.86349,6.56266574 C14.4487406,7.40331746 14.8232375,8.40101099 
                        14.9098696,9.47826182 L16.2580356,9.47826182 C16.8465207,9.47826182 17.1996118,10.1309454 
                        16.8786199,10.6231329 L14.6209769,14.1433441 C14.3320842,14.6034325 13.6687009,14.6034325 
                        13.3691085,14.1433441 L11.1221651,10.6231329 C10.8011732,10.1309454 11.1542643,9.47826182 
                        11.7427495,9.47826182 L13.0267171,9.47826182 C12.9657526,8.97464215 12.8141722,8.49925787 
                        12.5888771,8.06902644 Z M14.9322936,3.75140819 L4.41830686,16.1770289 C4.39906741,16.1997664 
                        4.38220902,16.2237219 4.3677064,16.2485918 L3.88169314,16.8229711 C3.70332112,17.0337744 
                        3.38783218,17.0600652 3.17702888,16.8816931 C2.96622558,16.7033211 2.93993483,16.3878322 
                        3.11830686,16.1770289 L4.77600701,14.2179287 C3.67971789,13.1352279 3,11.6316859 3,9.9704494 
                        C3,6.68563226 5.67493253,4 8.9704494,4 C10.2739544,4 11.4807977,4.42091588
                        12.4626123,5.13375885 L14.1183069,3.17702888 C14.2966789,2.96622558 14.6121678,2.93993483
                        14.8229711,3.11830686 C15.0110369,3.27743943 15.052247,3.54570491 14.9322936,3.75140819 
                        Z M6.41391759,15.3667059 L7.68705488,13.8620891 C8.09106584,13.9959518 8.52258095,14.068446 
                        8.9704494,14.068446 C9.48510642,14.068446 9.90132592,14.4846655 9.90132592,14.9993226 
                        C9.90132592,15.5236093 9.48510642,15.9408988 8.9704494,15.9408988 C8.05583315,15.9408988 
                        7.1890173,15.7348626 6.41391759,15.3667059 Z M11.2481962,6.56897787 C10.5973184,6.12907251 
                        9.81364832,5.87245277 8.9704494,5.87245277 C6.71387632,5.87245277 4.87245277,7.71280635 
                        4.87245277,9.9704494 C4.87245277,11.0565658 5.29863553,12.0461039 5.99219528,12.7806153 
                        L11.2481962,6.56897787 Z"
                />
            </g>`;
    }

    _addResponsibleTargetImages () {
        this.targetsDiv.current.innerHTML = '';
        const targets = [this.target].concat(this.otherTargets);
        this.targetColors = {};
        let colorIndex = 0;
        for (const target of targets) {
            if (this.props.answer.graph.responsibleTargetIds.has(target.id)) {
                let color;
                if (target.id === this.target.id) {
                    color = this.targetColor;
                } else {
                    color = this.otherTargetColors[colorIndex % this.otherTargetColors.length];
                    colorIndex++;
                }
                this.targetColors[target.id] = color;
                this._addTargetImage(target, 34, 2, 2, color);
            }
        }
    }

    _addTargetImage (target, sideLength, padding, border, color) {
        const drawable = target.renderer.extractDrawableScreenSpace(target.drawableID);
        const costume = target.sprite.costumes_[target.currentCostume];
        const image = document.createElement('img');
        const src = costume.asset ? getCostumeUrl(costume.asset) : null;
        image.setAttribute('src', src);
        let imageWidth = sideLength - (2 * (padding + border));
        let imageHeight = imageWidth;
        if (drawable.width < drawable.height) {
            imageWidth *= drawable.width / drawable.height;
        }
        if (drawable.width > drawable.height) {
            imageHeight *= drawable.height / drawable.width;
        }
        const marginTopBottom = (Math.max(imageHeight, imageWidth) - imageHeight) / 2;
        const marginLeftRight = (Math.max(imageHeight, imageWidth) - imageWidth) / 2;
        image.setAttribute('style', `width: ${imageWidth}px; height: ${imageHeight}px;
            margin: ${marginTopBottom}px ${marginLeftRight}px;`);

        const imageDiv = document.createElement('div');
        const targetName = target.isStage ? this._translate('target.stage') : target.getName();
        imageDiv.setAttribute('title', targetName);
        imageDiv.setAttribute('style', `height: ${sideLength}px; width: ${sideLength}px; 
            padding: ${padding}px; margin-bottom: 5px; 
            border-radius: 4px; border: ${border}px solid ${color}; 
            background-color: ${this._hexToRgb(color, 0.5)};`
        );
        imageDiv.appendChild(image);
        this.targetsDiv.current.appendChild(imageDiv);
    }

    _hexToRgba (hex, a) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            const r = parseInt(result[1], 16);
            const g = parseInt(result[2], 16);
            const b = parseInt(result[3], 16);
            return `rgb(${r}, ${g}, ${b}, ${a})`;
        }
        return null;
    }

    _hexToRgb (hex, alpha) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            const r = ((1 - alpha) * 255) + (alpha * parseInt(result[1], 16));
            const g = ((1 - alpha) * 255) + (alpha * parseInt(result[2], 16));
            const b = ((1 - alpha) * 255) + (alpha * parseInt(result[3], 16));
            return `rgb(${r}, ${g}, ${b})`;
        }
        return null;
    }

    _translate (key, values) {
        return this.props.intl.formatMessage({id: `gui.ir-debugger.${key}`}, values);
    }

    handleZoomGraphIn () {
        const zoomFactor = this.zoomFactor + this.zoomStepSize;
        this._zoomGraph(zoomFactor);
    }

    handleZoomGraphOut () {
        const zoomFactor = this.zoomFactor - this.zoomStepSize;
        this._zoomGraph(zoomFactor);
    }

    _zoomGraph (zoomFactor) {
        this._setZoomFactor(zoomFactor);
        const svgGraphNode = this.graphDiv.current.children[0];
        this._updateGraphSize(svgGraphNode);
    }

    handleSelectedBlockChange (blockId) {
        if (this.state.selectedBlockId === blockId) {
            this.setState({
                messages: this.props.answer.messages,
                selectedBlockId: null
            });
        } else {
            this.setState({
                messages: this.props.answer.messages,
                selectedBlockId: null
            });
            this.setState({
                messages: this.props.answer.blockMessages[blockId],
                selectedBlockId: blockId
            });
        }
        const scrollLeft = this.graphDiv.current.parentElement.scrollLeft;
        const scrollTop = this.graphDiv.current.parentElement.scrollTop;
        this._drawGraph();
        this.graphDiv.current.parentElement.scrollTo(scrollLeft, scrollTop);
        this._renderScratchBlocks();
    }

    updateSliderValueLabel () {
        const slider = this.props.answer.stage.slider;
        this.sliderValueLabel.current.innerHTML = slider.value.label;
        const percentage = ((slider.value.index - slider.min) * 100) / (slider.max - slider.min);
        this.sliderValueLabel.current.style.left = `calc(${percentage}% + (${9.5 - (percentage * 0.2)}px))`;
    }
   
    handleFeedback (value) {
        if (this.props.selectedQuestion.feedback === value) {
            this.props.selectedQuestion.feedback = null;
        } else {
            this.props.selectedQuestion.feedback = value;
        }
        this.forceUpdate();
    }

    getFeedbackIcon (feedback) {
        if (feedback === Feedback.POSITIVE) {
            return positiveFeedback;
        }
        if (feedback === Feedback.NEUTRAL) {
            return neutralFeedback;
        }
        if (feedback === Feedback.NEGATIVE) {
            return negativeFeedback;
        }
    }

    handlePositiveFeedback () {
        this.handleFeedback(Feedback.POSITIVE);
    }

    handleNeutralFeedback () {
        this.handleFeedback(Feedback.NEUTRAL);
    }

    handleNegativeFeedback () {
        this.handleFeedback(Feedback.NEGATIVE);
    }

    render () {
        const {
            answer,
            selectedQuestion
        } = this.props;

        return (
            <div>
                <div>
                    <div
                        className={classNames(styles.speechBubbleBox, styles.speechBubbleTriangle,
                            irStyles[`color-${selectedQuestion.color.replace('#', '')}`])}
                        style={(!answer.graph || !answer.graph.getAllNodes().length) && !answer.stage ? {maxHeight: '465px'} : {}}
                    >
                        <div
                            id="answerMessages"
                            className={styles.answerMessages}
                            style={(!answer.graph || !answer.graph.getAllNodes().length) && !answer.stage ? {maxHeight: '465px'} : {}}
                        >
                            <div className={initCount % 10 === 0 ? classNames(styles.rainbowText) : classNames()}>
                                {this.state.messages.map((message, index) => (
                                    message.scratchBlock ?
                                        <code
                                            key={index}
                                            className="scratchBlock"
                                        >
                                            {message.scratchBlock}
                                        </code> :
                                        <FormattedHTMLMessage
                                            key={index}
                                            tagName="span"
                                            {...message}
                                        />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={styles.feedback}>
                        <img
                            className={selectedQuestion.feedback === Feedback.POSITIVE ?
                                classNames(styles.selectedFeedbackButton, styles.feedbackButton) :
                                classNames(styles.feedbackButton)}
                            onClick={this.handlePositiveFeedback}
                            src={positiveFeedback}
                        />
                        <img
                            className={selectedQuestion.feedback === Feedback.NEUTRAL ?
                                classNames(styles.selectedFeedbackButton, styles.feedbackButton) :
                                classNames(styles.feedbackButton)}
                            onClick={this.handleNeutralFeedback}
                            src={neutralFeedback}
                        />
                        <img
                            className={selectedQuestion.feedback === Feedback.NEGATIVE ?
                                classNames(styles.selectedFeedbackButton, styles.feedbackButton) :
                                classNames(styles.feedbackButton)}
                            onClick={this.handleNegativeFeedback}
                            src={negativeFeedback}
                        />
                    </div>
                    {initCount % 10 === 0 ?
                        <img
                            className={styles.unicorn}
                            src={unicorn}
                        /> :
                        <img
                            className={styles.cat}
                            src={cat}
                        />
                    }
                </div>
                {answer.graph && answer.graph.getAllNodes().length > 0 ? (
                    <div>
                        <div
                            id="graph"
                            className={styles.blockArea}
                            ref={this.graphDiv}
                        />
                        <div
                            id="targets"
                            className={styles.responsibleTargets}
                            ref={this.targetsDiv}
                        />
                        <img
                            className={classNames(styles.zoomButton, styles.zoomInButton)}
                            onClick={this.handleZoomGraphIn}
                            src={zoomInIcon}
                        />
                        <img
                            className={classNames(styles.zoomButton, styles.zoomOutButton)}
                            onClick={this.handleZoomGraphOut}
                            src={zoomOutIcon}
                        />
                    </div>
                ) : null}
                {answer.stage ? (
                    <div>
                        <canvas
                            ref={this.stage}
                            className={styles.stage}
                        />
                        {this.stage.current ? (
                            <svg
                                className={styles.distancePath}
                                width={this.stage.current.width}
                                height={this.stage.current.height}
                            >
                                {this.state.distancePath ? (
                                    <path
                                        fill="none"
                                        stroke="red"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        d={this.state.distancePath}
                                    />
                                ) : null}
                                {this.state.edgePositions.length ? (
                                    <g>
                                        {this.state.edgePositions.map(position => (
                                            <circle
                                                key={`C(${position.x},${position.y})`}
                                                fill="red"
                                                stroke="red"
                                                cx={position.x}
                                                cy={position.y}
                                                r={4}
                                            />
                                        ))}
                                    </g>
                                ) : null}
                            </svg>
                        ) : null}
                        {this.state.mousePosition ? (
                            <div
                                className={styles.mousePointer}
                                style={{
                                    width: `${this.stage.current.width}px`,
                                    height: `${this.stage.current.height}px`
                                }}
                            >
                                <img
                                    src={mousePointer}
                                    width="24"
                                    height="24"
                                    style={{
                                        marginLeft: `${this.state.mousePosition.x}px`,
                                        marginTop: `${this.state.mousePosition.y}px`
                                    }}
                                />
                            </div>
                        ) : null}
                        {answer.stage.slider ? (
                            <div className={styles.sliderContainer}>
                                <input
                                    readOnly
                                    ref={this.slider}
                                    className={styles.slider}
                                    type="range"
                                    min={answer.stage.slider.min}
                                    max={answer.stage.slider.max}
                                    value={answer.stage.slider.value.index}
                                />
                                <output
                                    ref={this.sliderValueLabel}
                                    className={styles.sliderValueLabel}
                                />
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </div>
        );
    }
}

IRAnswer.propTypes = {
    intl: intlShape.isRequired,
    answer: PropTypes.instanceOf(Answer),
    selectedQuestion: PropTypes.instanceOf(Question),
    vm: PropTypes.instanceOf(VirtualMachine).isRequired,
    target: PropTypes.shape({
        origin: PropTypes.shape({
            id: PropTypes.string.isRequired
        })
    }).isRequired,
    createSvgBlock: PropTypes.func.isRequired,
    onGraphNodeClick: PropTypes.func.isRequired,
    setCursorOfBlock: PropTypes.func.isRequired
};

export default injectIntl(IRAnswer);
