import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl, intlShape} from 'react-intl';

import ScratchBlocks from 'scratch-blocks';

import styles from './ir-block-question.css';

class IRBlockQuestion extends React.Component {

    constructor (props) {
        super(props);
        this.state = {};

        this.blockQuestion = React.createRef();
        this.svgBlock = React.createRef();
    }

    componentDidMount () {
        if (this.svgBlock.current) {
            const svgBlock = this.createSvgBlock();
            this.svgBlock.current.appendChild(svgBlock);
            this.forceUpdate();
        }
    }

    createSvgBlock () {
        const NS = 'http://www.w3.org/2000/svg';
        const scaleFactor = 0.7;

        const block = ScratchBlocks.getMainWorkspace().getBlockById(this.props.block.id);
        const blockWidth = block.width * scaleFactor;
        const blockHeight = Math.min(block.height * scaleFactor, 40);
        this.blockQuestion.current.setAttribute('style', `height: ${blockHeight}px;`);

        const svgGroup = block.getSvgRoot().cloneNode(true);
        svgGroup.setAttribute('transform', `translate(0,0) scale(${scaleFactor})`);
        for (const childNode of svgGroup.childNodes) {
            const childId = childNode.getAttribute('data-id');
            const childBlock = block.childBlocks_.find(b => b.id === childId);
            if (childBlock && !childBlock.outputConnection && childBlock.previousConnection) {
                svgGroup.removeChild(childNode);
            }
        }

        const canvas = document.createElementNS(NS, 'g');
        canvas.setAttribute('class', 'blocklyBlockCanvas');
        canvas.setAttribute('transform', 'translate(0,0)');
        canvas.appendChild(svgGroup);

        const svgBlock = document.createElementNS(NS, 'svg');
        svgBlock.setAttribute('style', `width: ${blockWidth}px; height: ${blockHeight}px;`);
        svgBlock.appendChild(canvas);
        
        return svgBlock;
    }

    render () {
        const {
            intl,
            block
        } = this.props;

        return (
            <div ref={this.blockQuestion}>
                <div className={styles.question}>
                    {intl.formatMessage({
                        id: `gui.ir-debugger.question.block.${block.executed ? 'why-did' : 'why-did-not'}`
                    })}
                </div>
                <div
                    ref={this.svgBlock}
                    className={styles.svgBlock}
                />
                <div className={styles.question}>
                    {intl.formatMessage({
                        id: `gui.ir-debugger.question.block.${block.executed ? '' : 'not-'}execute`
                    })}
                </div>
            </div>
        );
    }
}

IRBlockQuestion.propTypes = {
    intl: intlShape.isRequired,
    block: PropTypes.shape({
        id: PropTypes.string.isRequired,
        executed: PropTypes.bool.isRequired
    }).isRequired
};

export default injectIntl(IRBlockQuestion);
