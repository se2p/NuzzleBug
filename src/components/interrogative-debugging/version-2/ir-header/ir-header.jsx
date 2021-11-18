import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl, FormattedMessage, FormattedHTMLMessage} from 'react-intl';

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
            target,
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
                    {target.isStage ?
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
                            values={{sprite: target.getName()}}
                        />
                    }
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
                                id="gui.ir-debugger.header.refresh"
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
                                id="gui.ir-debugger.header.shrink"
                            /> :
                            <FormattedMessage
                                defaultMessage="Expand"
                                description="Title for button to expand the interrogative debugger"
                                id="gui.ir-debugger.header.expand"
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
                            id="gui.ir-debugger.header.close"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

IRHeader.propTypes = {
    target: PropTypes.shape({
        getName: PropTypes.func.isRequired,
        isStage: PropTypes.bool.isRequired
    }).isRequired,
    expanded: PropTypes.bool.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onShrinkExpand: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default injectIntl(IRHeader);
