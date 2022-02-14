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
import backIcon from '../icons/icon--back.svg';
import iconArrowLeft from '../icons/icon--arrow-left.svg';
import iconArrowDown from '../icons/icon--arrow-down.svg';

class IRHeader extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            showTargetOptions: false,
            showBlockExecutionOptions: false
        };

        this.svgBlock = React.createRef();

        bindAll(this, [
            'handleTargetDropdownButtonClick',
            'handleCloseTargetDropdown',
            'handleTargetClick',
            'handleBlockExecutionDropdownButtonClick',
            'handleCloseBlockExecutionDropdown',
            'handleBlockExecutionClick'
        ]);
    }

    componentDidMount () {
        this._appendSvgBlock();
        this.forceUpdate();
    }

    componentDidUpdate (prevProps) {
        if (prevProps.blockId !== this.props.blockId) {
            this._removeSvgBlock();
            this._appendSvgBlock();
            this.forceUpdate();
        }
    }

    _appendSvgBlock () {
        if (this.svgBlock.current) {
            const block = ScratchBlocks.getAbstractWorkspace().getBlockById(this.props.blockId);
            const scaleFactor = 0.7;
            let svgBlock = this.props.createSvgBlock(block, scaleFactor);
            const blockWidth = Number(svgBlock.getAttribute('width').split('px')[0]);
            if (blockWidth > 600) {
                svgBlock = this.props.createSvgBlock(block, scaleFactor * 600 / blockWidth);
            }
            this.svgBlock.current.appendChild(svgBlock);
        }
    }

    _removeSvgBlock () {
        if (this.svgBlock.current) {
            for (const child of this.svgBlock.current.childNodes) {
                this.svgBlock.current.removeChild(child);
            }
        }
    }

    handleTargetDropdownButtonClick () {
        this.setState({
            showTargetOptions: !this.state.showTargetOptions
        });
    }

    handleCloseTargetDropdown () {
        this.setState({
            showTargetOptions: false
        });
    }

    handleBlockExecutionDropdownButtonClick () {
        this.setState({
            showBlockExecutionOptions: !this.state.showBlockExecutionOptions
        });
    }

    handleCloseBlockExecutionDropdown () {
        this.setState({
            showBlockExecutionOptions: false
        });
    }

    handleTargetClick (event) {
        const {
            target,
            targetOptions,
            onTargetChange
        } = this.props;

        const newTarget = targetOptions.find(option => option.id === event.target.id);
        if (target.id !== newTarget.id) {
            onTargetChange(newTarget);
        }
        this.setState({
            showTargetOptions: false
        });
    }

    handleBlockExecutionClick (event) {
        const {
            selectedBlockExecution,
            blockExecutionOptions,
            onBlockExecutionChange
        } = this.props;

        const blockExecution = blockExecutionOptions.find(option => option.uniqueId === event.target.id);
        if (selectedBlockExecution.uniqueId !== blockExecution.uniqueId) {
            onBlockExecutionChange(blockExecution);
        }
        this.setState({
            showBlockExecutionOptions: false
        });
    }

    render () {
        const {
            target,
            blockId,
            selectedBlockExecution,
            expanded,
            onRefresh,
            targetOptions,
            blockExecutionOptions,
            onShrinkExpand,
            onClose,
            onBack
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
                    ) : (
                        target.costumeUrl ? (
                            <div className={styles.headerItem}>
                                <img
                                    className={styles.targetImage}
                                    draggable={false}
                                    src={target.costumeUrl}
                                />
                            </div>
                        ) : null
                    )}
                    {targetOptions.length > 1 ? (
                        <div
                            className={styles.headerItem}
                            onMouseLeave={this.handleCloseTargetDropdown}
                        >
                            <div className={styles.dropdown}>
                                <div
                                    className={styles.dropdownButton}
                                    onClick={this.handleTargetDropdownButtonClick}
                                >
                                    <div className={styles.selectedOption}>
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
                                                    classNames(styles.dropdownOption, styles.selectedDropdownOption) :
                                                    styles.dropdownOption
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
                    {blockExecutionOptions.length > 1 ? (
                        <div
                            className={styles.headerItem}
                            onMouseLeave={this.handleCloseBlockExecutionDropdown}
                        >
                            <div className={styles.dropdown}>
                                <div
                                    className={styles.dropdownButton}
                                    onClick={this.handleBlockExecutionDropdownButtonClick}
                                >
                                    <div className={styles.selectedOption}>
                                        <span>{selectedBlockExecution.optionName}</span>
                                    </div>
                                    <img
                                        src={this.state.showBlockExecutionOptions ? iconArrowDown : iconArrowLeft}
                                        className={styles.icon}
                                    />
                                </div>
                                {this.state.showBlockExecutionOptions ? (
                                    <div className={styles.dropdownContent}>
                                        {blockExecutionOptions.map(blockExecution => (
                                            <a
                                                className={blockExecution.uniqueId === selectedBlockExecution.uniqueId ?
                                                    classNames(styles.dropdownOption, styles.selectedDropdownOption) :
                                                    styles.dropdownOption
                                                }
                                                id={blockExecution.uniqueId}
                                                key={blockExecution.uniqueId}
                                                onClick={this.handleBlockExecutionClick}
                                            >
                                                {blockExecution.optionName}
                                            </a>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    ) : null}
                </div>
                <div className={styles.rightHeader}>
                    {expanded && onBack ? (
                        <div className={styles.headerItem}>
                            <div
                                className={styles.headerButton}
                                onClick={onBack}
                            >
                                <img
                                    className={styles.icon}
                                    src={backIcon}
                                />
                                <FormattedMessage
                                    defaultMessage="Back"
                                    description="Title for button to go back"
                                    id="gui.ir-debugger.header.back"
                                />
                            </div>
                        </div>
                    ) : null}
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
        isStage: PropTypes.bool.isRequired,
        costumeUrl: PropTypes.string
    }).isRequired,
    targetOptions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        optionName: PropTypes.string.isRequired
    })).isRequired,
    selectedBlockExecution: PropTypes.shape({
        uniqueId: PropTypes.string.isRequired,
        optionName: PropTypes.string.isRequired
    }),
    blockExecutionOptions: PropTypes.arrayOf(PropTypes.shape({
        uniqueId: PropTypes.string.isRequired,
        optionName: PropTypes.string.isRequired
    })).isRequired,
    blockId: PropTypes.string,
    expanded: PropTypes.bool.isRequired,
    onTargetChange: PropTypes.func.isRequired,
    onBlockExecutionChange: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onShrinkExpand: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onBack: PropTypes.func,
    createSvgBlock: PropTypes.func.isRequired
};

export default injectIntl(IRHeader);
