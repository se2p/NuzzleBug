import ScratchBlocks from 'scratch-blocks';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {injectIntl, FormattedMessage, FormattedHTMLMessage} from 'react-intl';

import cardStyles from '../../../cards/card.css';
import styles from './ir-header.css';

import shrinkIcon from '../../../cards/icon--shrink.svg';
import expandIcon from '../../../cards/icon--expand.svg';
import closeIcon from '../../../cards/icon--close.svg';
import refreshIcon from '../icons/icon--refresh.svg';
import iconArrowLeft from '../icons/icon--arrow-left.svg';
import iconArrowDown from '../icons/icon--arrow-down.svg';

class IRHeader extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            showTargetOptions: false
        };

        this.svgBlock = React.createRef();

        bindAll(this, [
            'handleDropdownButtonClick',
            'handleTargetClick'
        ]);
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

        const block = ScratchBlocks.getMainWorkspace().getBlockById(this.props.blockId);
        const blockWidth = block.width * scaleFactor;
        let blockHeight = Math.min(block.height * scaleFactor, 40);

        const svgGroup = block.getSvgRoot().cloneNode(true);
        svgGroup.setAttribute('transform', `translate(0,0) scale(${scaleFactor})`);
        for (const childNode of svgGroup.childNodes) {
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

        const canvas = document.createElementNS(NS, 'g');
        canvas.setAttribute('class', 'blocklyBlockCanvas');
        canvas.setAttribute('transform', 'translate(0,0)');
        canvas.appendChild(svgGroup);

        const svgBlock = document.createElementNS(NS, 'svg');
        svgBlock.setAttribute('style', `width: ${blockWidth}px; height: ${blockHeight}px;`);
        svgBlock.appendChild(canvas);
        
        return svgBlock;
    }

    handleDropdownButtonClick () {
        this.setState({
            showTargetOptions: !this.state.showTargetOptions
        });
    }

    handleTargetClick (event) {
        const {
            target,
            targetOptions,
            onTargetChange,
            onRefresh
        } = this.props;

        const newTarget = targetOptions.find(option => option.id === event.target.id);
        if (target.id !== newTarget.id) {
            onTargetChange(newTarget);
            onRefresh();
        }
        this.setState({
            showTargetOptions: false
        });
    }

    render () {
        const {
            target,
            blockId,
            expanded,
            onRefresh,
            targetOptions,
            onShrinkExpand,
            onClose
        } = this.props;

        return (
            <div
                className={expanded ?
                    classNames(cardStyles.headerButtons, styles.header) :
                    classNames(cardStyles.headerButtons, cardStyles.headerButtonsHidden, styles.header)}
            >
                <div className={styles.leftHeader}>
                    <div className={styles.headerItem}>
                        {blockId ? (
                            <FormattedHTMLMessage
                                tagName="div"
                                defaultMessage="Interrogative Debugger"
                                description="Title of the interrogative debugger"
                                id="gui.ir-debugger.header.title-block"
                            />
                        ) : (target.isStage ?
                            <FormattedHTMLMessage
                                tagName="div"
                                defaultMessage="Interrogative Debugger"
                                description="Title of the interrogative debugger"
                                id="gui.ir-debugger.header.title-stage"
                            /> :
                            <FormattedHTMLMessage
                                tagName="div"
                                defaultMessage="Interrogative Debugger"
                                description="Title of the interrogative debugger"
                                id="gui.ir-debugger.header.title-sprite"
                                values={{sprite: target.sprite.name}}
                            />
                        )}
                    </div>
                    {blockId ? (
                        <div className={styles.headerItem}>
                            <div
                                ref={this.svgBlock}
                                className={styles.svgBlock}
                            />
                        </div>
                    ) : null}
                    {targetOptions.length > 1 ? (
                        <div className={styles.headerItem}>
                            <div className={styles.dropdown}>
                                <div
                                    className={styles.dropdownButton}
                                    onClick={this.handleDropdownButtonClick}
                                >
                                    <div className={styles.selectedTarget}>
                                        <span>{target.optionName}</span>
                                    </div>
                                    <img
                                        src={this.state.showTargetOptions ? iconArrowDown : iconArrowLeft}
                                        className={styles.icon}
                                    />
                                </div>
                                {this.state.showTargetOptions ? (
                                    <div className={styles.dropdownContent}>
                                        {targetOptions.map(targetOption => (
                                            <a
                                                className={target.id === targetOption.id ?
                                                    classNames(styles.targetOption, styles.selectedTargetOption) :
                                                    styles.targetOption
                                                }
                                                id={targetOption.id}
                                                key={targetOption.id}
                                                onClick={this.handleTargetClick}
                                            >
                                                {targetOption.optionName}
                                            </a>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    ) : null}
                </div>
                <div className={styles.rightHeader}>
                    {expanded ? (
                        <div className={styles.headerItem}>
                            <div
                                className={styles.headerButton}
                                onClick={onRefresh}
                            >
                                <img
                                    className={styles.icon}
                                    src={refreshIcon}
                                />
                                <FormattedMessage
                                    defaultMessage="Refresh"
                                    description="Title for button to refresh the interrogative debugger"
                                    id="gui.ir-debugger.header.refresh"
                                />
                            </div>
                        </div>
                    ) : null}
                    <div className={styles.headerItem}>
                        <div
                            className={styles.headerButton}
                            onClick={onShrinkExpand}
                        >
                            <img
                                className={styles.icon}
                                draggable={false}
                                src={expanded ? shrinkIcon : expandIcon}
                            />
                            {expanded ?
                                <FormattedMessage
                                    defaultMessage="Shrink"
                                    description="Title for button to shrink the interrogative debugger"
                                    id="gui.ir-debugger.header.shrink"
                                /> :
                                <FormattedMessage
                                    defaultMessage="Expand"
                                    description="Title for button to expand the interrogative debugger"
                                    id="gui.ir-debugger.header.expand"
                                />
                            }
                        </div>
                    </div>
                    <div className={styles.headerItem}>
                        <div
                            className={styles.headerButton}
                            onClick={onClose}
                        >
                            <img
                                className={styles.icon}
                                src={closeIcon}
                            />
                            <FormattedMessage
                                defaultMessage="Close"
                                description="Title for button to close the interrogative debugger"
                                id="gui.ir-debugger.header.close"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

IRHeader.propTypes = {
    target: PropTypes.shape({
        id: PropTypes.string.isRequired,
        optionName: PropTypes.string.isRequired,
        sprite: PropTypes.shape({
            name: PropTypes.string.isRequired
        }),
        isStage: PropTypes.bool.isRequired
    }).isRequired,
    targetOptions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        optionName: PropTypes.string.isRequired
    })).isRequired,
    blockId: PropTypes.string,
    expanded: PropTypes.bool.isRequired,
    onTargetChange: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onShrinkExpand: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default injectIntl(IRHeader);
