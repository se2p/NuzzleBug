import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import Draggable from 'react-draggable';

import {FormattedMessage} from 'react-intl';

import styles from '../cards/card.css';
import irStyles from './ir-cards.css';

import shrinkIcon from '../cards/icon--shrink.svg';
import expandIcon from '../cards/icon--expand.svg';
import closeIcon from '../cards/icon--close.svg';
import leftArrow from '../cards/icon--prev.svg';
import rightArrow from '../cards/icon--next.svg';
import {Question} from 'scratch-ir';

import QuestionCategory from './ir-category.jsx';

const NextPrevButtons = ({isRtl, onNextStep, onPrevStep, expanded}) => (
    <Fragment>
        {onNextStep ? (
            <div>
                <div
                    className={expanded ? (isRtl ? classNames(styles.leftCard, irStyles.leftCard) :
                        classNames(styles.rightCard, irStyles.rightCard)) :
                        styles.hidden}
                />
                <div
                    className={expanded ? (isRtl ? classNames(styles.leftButton, irStyles.leftButton) :
                        classNames(styles.rightButton, irStyles.rightButton)) :
                        styles.hidden}
                    onClick={onNextStep}
                >
                    <img
                        draggable={false}
                        src={isRtl ? leftArrow : rightArrow}
                    />
                </div>
            </div>
        ) : null}
        {onPrevStep ? (
            <div>
                <div
                    className={expanded ? (isRtl ? classNames(styles.rightCard, irStyles.rightCard) :
                        classNames(styles.leftCard, irStyles.leftCard)) :
                        styles.hidden}
                />
                <div
                    className={expanded ? (isRtl ? classNames(styles.rightButton, irStyles.rightButton) :
                        classNames(styles.leftButton, irStyles.leftButton)) :
                        styles.hidden}
                    onClick={onPrevStep}
                >
                    <img
                        draggable={false}
                        src={isRtl ? rightArrow : leftArrow}
                    />
                </div>
            </div>
        ) : null}
    </Fragment>
);
NextPrevButtons.propTypes = {
    expanded: PropTypes.bool.isRequired,
    isRtl: PropTypes.bool,
    onNextStep: PropTypes.func,
    onPrevStep: PropTypes.func
};

const QuestionsCardHeader = ({title, onCloseCards, onShrinkExpandCards, totalSteps, step, expanded}) => (
    <div
        className={expanded ?
            classNames(styles.headerButtons, irStyles.headerButtons) :
            classNames(styles.headerButtons, irStyles.headerButtons, styles.headerButtonsHidden)}
    >
        {totalSteps > 1 ? (
            <div className={styles.stepsList}>
                {Array(totalSteps).fill(0)
                    .map((_, i) => (
                        <div
                            className={i === step ? styles.activeStepPip : styles.inactiveStepPip}
                            key={`pip-step-${i}`}
                        />
                    ))}
            </div>
        ) : null}
        <div className={irStyles.cardTitleHeader}>
            <span> {title} </span>
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
                        defaultMessage="Shrink"
                        description="Title for button to shrink question category"
                        id="gui.ircards.shrink"
                    /> :
                    <FormattedMessage
                        defaultMessage="Expand"
                        description="Title for button to expand question category"
                        id="gui.ircards.expand"
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
                    defaultMessage="Close"
                    description="Title for button to close question category"
                    id="gui.ircards.close"
                />
            </div>
        </div>
    </div>
);
QuestionsCardHeader.propTypes = {
    title: PropTypes.string.isRequired,
    expanded: PropTypes.bool.isRequired,
    onCloseCards: PropTypes.func.isRequired,
    onShrinkExpandCards: PropTypes.func.isRequired,
    step: PropTypes.number,
    totalSteps: PropTypes.number
};

const QuestionsCards = props => {
    const {
        categories,
        computeAnswer,
        isRtl,
        glowBlock,
        onCloseCards,
        onShrinkExpandCards,
        onDrag,
        onStartDrag,
        onEndDrag,
        onNextStep,
        onPrevStep,
        step,
        expanded,
        ...posProps
    } = props;
    let {x, y} = posProps;

    if (categories[step] === null) return;

    // Tutorial cards need to calculate their own dragging bounds
    // to allow for dragging the cards off the left, right and bottom
    // edges of the workspace.
    const wideCardWidth = 700;
    const cardHorizontalDragOffset = 560; // ~80% of card width
    const cardVerticalDragOffset = expanded ? 400 : 0; // ~80% of card height, if expanded
    const menuBarHeight = 48; // TODO: get pre-calculated from elsewhere?

    if (x === 0 && y === 0) {
        // initialize positions
        x = isRtl ? (-190 - wideCardWidth - cardHorizontalDragOffset) : 500;
        x += cardHorizontalDragOffset;
        // The tallest cards are about 320px high, and the default position is pinned
        // to near the bottom of the blocks palette to allow room to work above.
        const tallCardHeight = 500;
        const bottomMargin = 60; // To avoid overlapping the backpack region
        y = window.innerHeight - tallCardHeight - bottomMargin - menuBarHeight;
    }

    return (
        // Custom overlay to act as the bounding parent for the draggable, using values from above
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
                        <QuestionsCardHeader
                            title={categories[step].info.name}
                            expanded={expanded}
                            step={step}
                            totalSteps={categories.length}
                            onCloseCards={onCloseCards}
                            onShrinkExpandCards={onShrinkExpandCards}
                        />
                        <div className={expanded ? styles.stepBody : styles.hidden}>
                            <QuestionCategory
                                category={categories[step]}
                                computeAnswer={computeAnswer}
                                glowBlock={glowBlock}
                            />
                        </div>
                        <NextPrevButtons
                            expanded={expanded}
                            isRtl={isRtl}
                            onNextStep={step < categories.length - 1 ? onNextStep : null}
                            onPrevStep={step > 0 ? onPrevStep : null}
                        />
                    </div>
                </div>
            </Draggable>
        </div>
    );
};
QuestionsCards.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.shape({
        info: PropTypes.shape({
            name: PropTypes.string.isRequired,
            id: PropTypes.string,
            currentCostume: PropTypes.number,
            direction: PropTypes.number,
            isStage: PropTypes.bool,
            isOriginal: PropTypes.bool,
            visible: PropTypes.bool,
            xPosition: PropTypes.number,
            yPosition: PropTypes.number
        }).isRequired,
        questions: PropTypes.arrayOf(PropTypes.instanceOf(Question)).isRequired
    })).isRequired,
    computeAnswer: PropTypes.func.isRequired,
    dragging: PropTypes.bool.isRequired,
    expanded: PropTypes.bool.isRequired,
    isRtl: PropTypes.bool.isRequired,
    glowBlock: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    onCloseCards: PropTypes.func.isRequired,
    onDrag: PropTypes.func,
    onEndDrag: PropTypes.func,
    onNextStep: PropTypes.func.isRequired,
    onPrevStep: PropTypes.func.isRequired,
    onShrinkExpandCards: PropTypes.func.isRequired,
    onStartDrag: PropTypes.func,
    step: PropTypes.number.isRequired,
    x: PropTypes.number,
    y: PropTypes.number
};

export default QuestionsCards;
