import PropTypes from 'prop-types';
import React from 'react';
import Draggable from 'react-draggable';

import styles from './hints-explanation-card.css';
import classNames from 'classnames';
import helpIcon from '../../lib/assets/icon--tutorials.svg';
import {FormattedMessage} from 'react-intl';
import shrinkIcon from '../cards/icon--shrink.svg';
import expandIcon from '../cards/icon--expand.svg';
import closeIcon from '../cards/icon--close.svg';
import {ActorHints} from './hints-explanation-card-content.jsx';

const HintsExplanationCardHeader = ({onCloseCards, onShrinkExpandCards, expanded}) => (
    <div className={expanded ? styles.headerButtons : classNames(styles.headerButtons, styles.headerButtonsHidden)}>
        <div
            className={styles.allButton}
        >
            <img
                className={styles.helpIcon}
                src={helpIcon}
            />
            <FormattedMessage
                defaultMessage="Hinweise"
                description="Title for button to return to tutorials library"
                id="gui.hintsExplanationCard.title"
            />
        </div>
        <div className={styles.headerButtonsRight}>
            <div
                className={styles.shrinkExpandButton}
                onClick={onShrinkExpandCards}
            >
                <img
                    draggable={false}
                    src={expanded ? shrinkIcon : expandIcon}
                />
                {expanded ?
                    <FormattedMessage
                        defaultMessage="Einklappen"
                        description="Title for button to shrink how-to card"
                        id="gui.cards.shrink"
                    /> :
                    <FormattedMessage
                        defaultMessage="Aufklappen"
                        description="Title for button to expand how-to card"
                        id="gui.cards.expand"
                    />
                }
            </div>
            <div
                className={styles.removeButton}
                onClick={onCloseCards}
            >
                <img
                    className={styles.closeIcon}
                    src={closeIcon}
                />
                <FormattedMessage
                    defaultMessage="Schließen"
                    description="Title for button to close how-to card"
                    id="gui.cards.close"
                />
            </div>
        </div>
    </div>
);

const HintsExplanationCardComponent = props => {
    const {
        content,
        dragging,
        expanded,
        locale,
        onCloseCards,
        onShrinkExpandCards,
        onDrag,
        onStartDrag,
        onEndDrag,
        ...posProps
    } = props;
    let {x, y} = posProps;

    const cardHorizontalDragOffset = 400; // ~80% of card width
    const cardVerticalDragOffset = expanded ? 257 : 0; // ~80% of card height, if expanded
    const menuBarHeight = 48;

    if (x === 0 && y === 0) {
        // initialize positions
        x = 292;
        x += cardHorizontalDragOffset;
        // The tallest cards are about 320px high, and the default position is pinned
        // to near the bottom of the blocks palette to allow room to work above.
        const tallCardHeight = 320;
        const bottomMargin = 60; // To avoid overlapping the backpack region
        y = window.innerHeight - tallCardHeight - bottomMargin - menuBarHeight;
    }

    let boxContent;
    if (content.hints) {
        boxContent = content.hints.map(actor => (
            <ActorHints
                key={actor.actorName.name}
                actorName={actor.actorName}
                explanations={actor.explanations}
            />
        ));
    } else {
        // all tests passed -> show message directly
        boxContent = (<div>{content}</div>);
    }

    return (
        <div
            className={styles.cardContainerOverlay}
            style={{
                width: `${window.innerWidth + (2 * cardHorizontalDragOffset)}px`,
                height: `${window.innerHeight - menuBarHeight + cardVerticalDragOffset}px`,
                top: `${menuBarHeight}px`,
                left: `${-cardHorizontalDragOffset}px`
            }}
        >
            <Draggable
                bounds="parent"
                position={{x: x, y: y}}
                onDrag={onDrag}
                onStart={onStartDrag}
                onStop={onEndDrag}
            >
                <div className={styles.cardContainer}>
                    <div className={styles.card}>
                        <HintsExplanationCardHeader
                            dragging={dragging}
                            expanded={expanded}
                            isRtl={false}
                            locale={locale}
                            onCloseCards={onCloseCards}
                            onShrinkExpandCards={onShrinkExpandCards}
                            step={1}
                        />
                        <div className={expanded ? styles.cardBody : styles.hidden}>
                            {boxContent}
                        </div>
                    </div>
                </div>
            </Draggable>
        </div>
    );
};

HintsExplanationCardHeader.propTypes = {
    expanded: PropTypes.bool.isRequired,
    onCloseCards: PropTypes.func.isRequired,
    onShrinkExpandCards: PropTypes.func.isRequired
};

HintsExplanationCardComponent.propTypes = {
    onCloseCards: PropTypes.func.isRequired,
    onDrag: PropTypes.func,
    onEndDrag: PropTypes.func,
    onShrinkExpandCards: PropTypes.func.isRequired,
    onStartDrag: PropTypes.func,
    /*
    content: PropTypes.shape({
        hints: PropTypes.arrayOf(PropTypes.object)
    }),*/
    content: PropTypes.any,
    dragging: PropTypes.bool.isRequired,
    expanded: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
    x: PropTypes.number,
    y: PropTypes.number
};

export {
    HintsExplanationCardComponent as default
};
