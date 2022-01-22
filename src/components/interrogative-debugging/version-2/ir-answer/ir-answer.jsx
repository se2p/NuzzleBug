import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl, intlShape} from 'react-intl';
import Viz from 'viz.js';
import bindAll from 'lodash.bindall';

import ScratchBlocks from 'scratch-blocks';
import {AnswerV2 as Answer} from 'scratch-ir';

import styles from './ir-answer.css';
import cat from './cat.png';
import zoomInIcon from '../icons/icon--plus.svg'
import zoomOutIcon from '../icons/icon--minus.svg'

class IRAnswer extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'zoomGraphIn',
            'zoomGraphOut'
        ]);
    
        this.graphDiv = React.createRef();
        this.zoomFactor = 1;
        this.zoomStepSize = 0.1;
        this.gray = '#575E75';
        this.lightGray = '#ABAEBA';
    }

    componentDidMount () {
        if (this.graphDiv.current) {
            this._drawGraph();
            this._initGraphSize();
        }
    }

    _drawGraph () {
        const graph = this.props.answer.graph;
        const graphNodes = graph.getAllNodes();

        this.graphDiv.current.innerHTML = this._createGraphSvg(graph);
        const svgGraphNode = this.graphDiv.current.children[0];
        const svgGraphChildren = Array.from(svgGraphNode.children[0].children);

        this._removeGraphTitle(svgGraphChildren);
        this._adaptGraphNodes(svgGraphChildren, graphNodes);
        this._adaptGraphEdges(svgGraphChildren);
        
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
        const height =  Number(svgNode.getAttribute('height').split('pt')[0]);
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
            
            const executionInfo = this._getNodeExecutionInfo(graphNode);
            if (executionInfo.condition) {
                const actualValue = executionInfo.condition.actualValue;
                const requiredValue = executionInfo.condition.requiredValue;
                if (actualValue !== requiredValue) {
                    this._addEdgeForActualConditionValue(svgGraphNode, actualValue, block, scaleFactor);
                }
            }
        }
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
        const block = ScratchBlocks.getAbstractWorkspace().getBlockById(blockId);
        const executionInfo = this._getNodeExecutionInfo(graphNode);
        const svgBlock = this.props.createSvgBlock(block, scaleFactor, executionInfo);
        const width = Number(svgBlock.getAttribute('width').split('px')[0]);
        const height = Number(svgBlock.getAttribute('height').split('px')[0]);
        svgGraphNode.appendChild(svgBlock);
        return {width, height};
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
        const x = ellipse.center.x - width / 2;                        
        const y = ellipse.center.y - height / 2;
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
        const fontSize = 10 / scaleFactor;
        const textPosition = {x: block.width + 10, y: fontSize};
        svgGraphNode.innerHTML += this._createHtmlText(text, textPosition, fontSize, this.gray);
    }

    _adaptGraphEdges (svgGraphChildren) {
        const edgeFilter = node => node.getAttribute('class') === 'edge';
        const svgGraphEdges = svgGraphChildren.filter(edgeFilter);
        for (const svgGraphEdge of svgGraphEdges) {
            
            const {pathNode, polygonNode, titleNode} = this._getEdgeChildren(svgGraphEdge);
            svgGraphEdge.removeChild(titleNode);
            
            const executionInfo = this._getEdgeExecutionInfo(titleNode);
            
            this._updateEdgeColor(pathNode, polygonNode, executionInfo);
            
            if (executionInfo.condition) {
                const edgeLine = this._extractLineAttributes(pathNode);
                if (!executionInfo.executed) {
                    this._dashPath(pathNode);
                    this._addCrossOutLine(svgGraphEdge, edgeLine);
                }
                this._addConditionLabel(svgGraphEdge, edgeLine, executionInfo);
            }
        }
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
        const edgeColor = executionInfo.executed ? this.gray : this.lightGray;
        pathNode.setAttribute('stroke', edgeColor);
        polygonNode.setAttribute('stroke', edgeColor);
        polygonNode.setAttribute('fill', edgeColor);
    }

    _extractLineAttributes (pathNode) {
        const path = pathNode.getAttribute('d');
        const startValues = path.split('M')[1].split('C')[0].split(',');
        const start = {x: Number(startValues[0]), y: Number(startValues[1])};
        const endValues = path.split(' ')[path.split(' ').length - 1].split(',');
        const end = {x: Number(endValues[0]), y: Number(endValues[1])};
        return {start, end};
    }

    _addConditionLabel (svgGraphEdge, edgeLine, executionInfo) {
        const text = this._translate(`condition.${executionInfo.condition.requiredValue}`);
        const edgeWidth = edgeLine.end.x - edgeLine.start.x + 7;
        const x = edgeLine.start.x + edgeWidth / 2 + 5;
        const edgeHeight = edgeLine.end.y - edgeLine.start.y + 10;
        const y = edgeLine.start.y + edgeHeight / 2;
        const edgeColor = executionInfo.executed ? this.gray : this.lightGray;
        svgGraphEdge.innerHTML += this._createHtmlText(text, {x, y}, 10, edgeColor);
    }

    _dashPath (pathNode) {
        pathNode.setAttribute('stroke-dasharray', '3,3');
    }

    _addCrossOutLine (svgGraphEdge, edgeLine) {
        const lineStart = {x: edgeLine.start.x + 15, y: edgeLine.start.y};
        const lineEnd = {x: edgeLine.end.x - 15, y: edgeLine.end.y};
        svgGraphEdge.innerHTML += this._createHtmlLine(lineStart, lineEnd, 'red');
    }

    _createHtmlText (text, position, size, color) {
        const html =
            `<text
                text-anchor="start" 
                x="${position.x}"
                y="${position.y}"
                font-family=""Helvetica Neue", Helvetica, sans-serif;"
                font-size="${size}" 
                fill="${color}"
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
            </g>`
        return html;
    }

    _translate (key) {
        return this.props.intl.formatMessage({id: `gui.ir-debugger.${key}`});
    }

    zoomGraphIn () {
        const zoomFactor = this.zoomFactor + this.zoomStepSize;
        this._zoomGraph(zoomFactor);
    }

    zoomGraphOut () {
        const zoomFactor = this.zoomFactor - this.zoomStepSize;
        this._zoomGraph(zoomFactor);
    }

    _zoomGraph (zoomFactor) {
        this._setZoomFactor(zoomFactor);
        const svgGraphNode = this.graphDiv.current.children[0];
        this._updateGraphSize(svgGraphNode);
        this.forceUpdate();
    }

    render () {
        return (
            <div>
                <div className={styles.textArea}>
                    <div className={classNames(styles.speechBubbleBox, styles.speechBubbleTriangle)}>
                        {this.props.answer.text}
                    </div>
                    <img
                        className={styles.cat}
                        src={cat}
                    />
                </div>
                <div className={styles.blockArea}>
                    <div 
                        id="graph"
                        ref={this.graphDiv}
                    />
                    <img
                        className={classNames(styles.zoomButton, styles.zoomInButton)}
                        onClick={this.zoomGraphIn}
                        src={zoomInIcon}
                    />
                    <img
                        className={classNames(styles.zoomButton, styles.zoomOutButton)}
                        onClick={this.zoomGraphOut}
                        src={zoomOutIcon}
                    />
                </div>
            </div>
        );
    }
}

IRAnswer.propTypes = {
    intl: intlShape.isRequired,
    answer: PropTypes.instanceOf(Answer),
    createSvgBlock: PropTypes.func.isRequired
};

export default injectIntl(IRAnswer);
