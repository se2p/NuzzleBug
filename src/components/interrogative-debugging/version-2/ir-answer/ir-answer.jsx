import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl, intlShape, FormattedHTMLMessage} from 'react-intl';
import Viz from 'viz.js';
import bindAll from 'lodash.bindall';

import VirtualMachine from 'scratch-vm';
import ScratchBlocks from 'scratch-blocks';
import {AnswerV2 as Answer, QuestionV2 as Question, targetForBlockId} from 'scratch-ir';

import getCostumeUrl from '../../../../lib/get-costume-url';

import styles from './ir-answer.css';
import irStyles from '../ir-styles.css';
import cat from './cat.png';
import mousePointer from '../icons/icon--mouse.svg';
import zoomInIcon from '../icons/icon--plus.svg';
import zoomOutIcon from '../icons/icon--minus.svg';

class IRAnswer extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'handleZoomGraphIn',
            'handleZoomGraphOut',
            'handleSelectedBlockChange'
        ]);
    
        this.graphDiv = React.createRef();
        this.targetsDiv = React.createRef();
        this.stage = React.createRef();
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
    }

    componentDidMount () {
        if (this.graphDiv.current) {
            this._addResponsibleTargetImages();
            this._drawGraph();
        }
        if (this.stage.current) {
            this._drawStage();
        }
    }

    componentDidUpdate (prevProps) {
        if (prevProps.answer !== this.props.answer && this.graphDiv.current) {
            this.graphSize = null;
            this._addResponsibleTargetImages();
            this._drawGraph();
        }
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
        const color = this.targetColors[targetForBlock.id];
        const title = targetForBlock.isStage ?
            this._translate('block.from.stage') :
            this._translate('block.from.sprite', {sprite: targetForBlock.getName()});
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
        ellipse.width = Number(ellipseNode.getAttribute('rx')) * 2;
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
        return this.props.answer.executionInfo.blocks[graphNode.id];
    }
    
    _addEdgeForActualConditionValue (svgGraphNode, value, block, scaleFactor) {
        const arrowPosition = {x: block.width + 10, y: block.height / 2};
        const arrowLength = 40;
        svgGraphNode.innerHTML += this._createHtmlArrow(arrowPosition, arrowLength, 1 / scaleFactor, this.gray);

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
                const color = this._hexToRgba(executionInfo.relevantValue.color, 0.5);
                svgGraphNode.innerHTML += this._createHtmlText(text, position, labelSize, color, 'start');
            }
            if (typeof executionInfo.relevantValue.after !== 'undefined') {
                const text = executionInfo.relevantValue.after;
                const position = {x: block.width - 3, y: block.height + labelSize};
                const color = executionInfo.relevantValue.color;
                svgGraphNode.innerHTML += this._createHtmlText(text, position, labelSize, color, 'end');
            }
            const maxTextLength = (block.width / 2) - 5;
            const textBackgrounds = [];
            svgGraphNode.childNodes.forEach(node => {
                if (node.nodeName === 'text') {
                    const initialTextLength = node.textLength.baseVal.value;
                    const textLength = initialTextLength > maxTextLength ? maxTextLength : initialTextLength;
                    node.setAttribute('textLength', `${textLength}`);
                    node.setAttribute('font-weight', 'bold');

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
            for (const textBackground of textBackgrounds) {
                svgGraphNode.innerHTML = textBackground.outerHTML + svgGraphNode.innerHTML;
            }
        }
    }

    _addRedBorderToBlock (block, svgGraphNode) {
        const rect = document.createElement('rect');
        rect.setAttribute('id', 'red-block-border');
        rect.setAttribute('stroke', 'red');
        rect.setAttribute('stroke-width', '4');
        rect.setAttribute('stroke-linecap', `round`);
        rect.setAttribute('fill-opacity', '0');
        rect.setAttribute('height', `${block.height - 4}px`);
        rect.setAttribute('width', `${block.width - 4}px`);
        rect.setAttribute('x', '2');
        rect.setAttribute('y', '2');
        rect.setAttribute('rx', '5');
        rect.setAttribute('ry', '5');
        svgGraphNode.innerHTML += rect.outerHTML;
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
                if (!executionInfo.executed) {
                    this._dashPath(pathNode);
                    this._addCrossOutLine(svgGraphEdge, edge.line);
                }
                const text = this._translate(`condition.${executionInfo.condition.requiredValue}`);
                this._addEdgeLabel(svgGraphEdge, edge, text, executionInfo, true);
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
        return this.props.answer.executionInfo.edges[edgeTitle];
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

    _createHtmlText (text, position, size, color, textAnchor) {
        const html =
            `<text
                text-anchor="${textAnchor}"
                x="${position.x}"
                y="${position.y}"
                font-family=""Helvetica Neue", Helvetica, sans-serif;"
                font-size="${size}" 
                fill="${color}"
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

    _createHtmlArrow (position, length, scale, color) {
        const html =
            `<g transform="translate(${position.x},${position.y}) scale(${scale})">
                <path
                    fill="none"
                    stroke="${color}"
                    d="M0,0 H ${length}"
                />
                <polygon
                    fill="${color}"
                    stroke="${color}"
                    points="${length},-3.5 ${length + 10},0 ${length},3.5 ${length},-3.5"
                />
            </g>`;
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

    _addResponsibleTargetImages () {
        this.targetsDiv.current.innerHTML = '';
        const targets = [this.target].concat(this.otherTargets);
        this.targetColors = {};
        let colorIndex = 0;
        for (const target of targets) {
            if (this.props.answer.responsibleTargetIds.has(target.id)) {
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
        const drawable = target.renderer.extractDrawable(target.drawableID, 0, 0);
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
            background-color: ${this._hexToRgba(color, 0.5)};`
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
                messages: this.props.answer.blockMessages[blockId],
                selectedBlockId: blockId
            });
        }
        const scrollLeft = this.graphDiv.current.parentElement.scrollLeft;
        const scrollTop = this.graphDiv.current.parentElement.scrollTop;
        this._drawGraph();
        this.graphDiv.current.parentElement.scrollTo(scrollLeft, scrollTop);
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
                    >
                        <div className={styles.answerMessages}>
                            {this.state.messages.map((message, index) => (
                                <FormattedHTMLMessage
                                    key={index}
                                    tagName="span"
                                    {...message}
                                />
                            ))}
                        </div>
                    </div>
                    <img
                        className={styles.cat}
                        src={cat}
                    />
                </div>
                {answer.graph && answer.graph.getAllNodes().length > 0 ? (
                    <div className={styles.blockArea}>
                        <div
                            id="graph"
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
