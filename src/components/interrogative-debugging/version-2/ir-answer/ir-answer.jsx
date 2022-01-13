import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl} from 'react-intl';

import styles from './ir-answer.css';
import cat from './cat.png';

class IRAnswer extends React.Component {

    constructor (props) {
        super(props);
        this.state = {};
        this.blockArea = React.createRef();
    }

    componentDidMount () {
        if (this.blockArea.current) {
            const blocks = this.props.answer.blocks;
            for (let i = 0; i < blocks.length; i++) {
                const block = blocks[i];
                const svgBlock = this.props.createSvgBlock(block);
                const svgStyle = svgBlock.getAttribute('style');
                svgBlock.setAttribute('style', `${svgStyle} margin: 10px auto; display: block;`);
                const blockDiv = document.createElement('div');
                blockDiv.setAttribute('style', 'width: 100%');
                blockDiv.appendChild(svgBlock);
                this.blockArea.current.appendChild(blockDiv);
                if (i < (blocks.length - 1)) {
                    const arrow = this.createArrow();
                    this.blockArea.current.appendChild(arrow);
                }
            }
            this.forceUpdate();
        }
    }

    createArrow () {
        const div = document.createElement('div');
        div.innerHTML = '<div>&#8595;</div>';
        const arrow = div.childNodes[0];
        arrow.setAttribute('style',
            'font-size: 20px; width: 100%; text-align: center; margin: -20px 0 -10px 0;');
        return arrow;
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
                <div
                    ref={this.blockArea}
                    className={styles.blockArea}
                />
            </div>
        );
    }
}

IRAnswer.propTypes = {
    answer: PropTypes.shape({
        text: PropTypes.string,
        blocks: PropTypes.arrayOf(PropTypes.object)
    }),
    createSvgBlock: PropTypes.func.isRequired
};

export default injectIntl(IRAnswer);
