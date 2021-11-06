import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';

import cardStyles from '../../../cards/card.css';
import styles from './ir-header.css';

import shrinkIcon from '../../../cards/icon--shrink.svg';
import expandIcon from '../../../cards/icon--expand.svg';
import closeIcon from '../../../cards/icon--close.svg';
import refreshIcon from '../icons/icon--refresh.svg';

class IRHeader extends React.Component {

    constructor (props) {
        super(props);
        this.state = {};
    }

    render () {
        const {
            title,
            expanded,
            onRefresh,
            onShrinkExpand,
            onClose
        } = this.props;

        return (
            <div
                className={expanded ?
                    classNames(cardStyles.headerButtons, styles.header) :
                    classNames(cardStyles.headerButtons, cardStyles.headerButtonsHidden, styles.header)}
            >
                <div className={styles.title}>
                    <span>{title}</span>
                </div>
                <div className={cardStyles.headerButtonsRight}>
                    {expanded ? (
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
                                id="gui.ir.debugger.refresh"
                            />
                        </div>
                    ) : null}
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
                                id="gui.ir.debugger.shrink"
                            /> :
                            <FormattedMessage
                                defaultMessage="Expand"
                                description="Title for button to expand interrogative debugger"
                                id="gui.ir.debugger.expand"
                            />
                        }
                    </div>
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
                            id="gui.ir.debugger.close"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

IRHeader.propTypes = {
    title: PropTypes.string.isRequired,
    expanded: PropTypes.bool.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onShrinkExpand: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default injectIntl(IRHeader);
