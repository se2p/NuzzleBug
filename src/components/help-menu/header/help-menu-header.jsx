import ScratchBlocks from 'scratch-blocks';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {injectIntl, FormattedMessage, FormattedHTMLMessage} from 'react-intl';

import cardStyles from '../../cards/card.css';
import styles from './help-menu-header.css';

import shrinkIcon from '../../cards/icon--shrink.svg';
import expandIcon from '../../cards/icon--expand.svg';
import closeIcon from '../../cards/icon--close.svg';
import backIcon from '../../cards/icon--prev.svg';

class HelpMenuHeader extends React.Component {

    constructor (props) {
        super(props);
    }

    componentDidMount () {
        this.forceUpdate();
    }


    render () {
        const {
            expanded,
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
                        <FormattedHTMLMessage
                            tagName="div"
                            defaultMessage="Help Menu"
                            description="Title of the help menu"
                            id="gui.help-menu.header.title"
                        />
                    </div>
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
                                    id="gui.help-menu.header.back"
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
                                    id="gui.help-menu.header.shrink"
                                /> :
                                <FormattedMessage
                                    defaultMessage="Expand"
                                    description="Title for button to expand the interrogative debugger"
                                    id="gui.help-menu.header.expand"
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
                                id="gui.help-menu.header.close"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

HelpMenuHeader.propTypes = {
    expanded: PropTypes.bool.isRequired,
    onShrinkExpand: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onBack: PropTypes.func,
};

export default injectIntl(HelpMenuHeader);
