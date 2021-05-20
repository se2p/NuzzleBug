import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import Draggable from 'react-draggable';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';

import styles from '../cards/card.css';
import tutorialStyles from './tutorial-cards.css';

import shrinkIcon from '../cards/icon--shrink.svg';
import expandIcon from '../cards/icon--expand.svg';
import closeIcon from '../cards/icon--close.svg';
import leftArrow from '../cards/icon--prev.svg';
import rightArrow from '../cards/icon--next.svg';

import {VirtualMachine} from 'scratch-vm';
import * as tutorials from 'tutorial-tests/src/tutorials';

import Tutorial from './tutorial.jsx';
import {runTest} from 'tutorial-tests';
import * as messages from "tutorial-tests";

const NextPrevButtons = ({isRtl, onNextStep, onPrevStep, expanded}) => (
    <Fragment>
        {onNextStep ? (
            <div>
                <div
                    className={expanded ? (isRtl ? classNames(styles.leftCard, tutorialStyles.leftCard) :
                        classNames(styles.rightCard, tutorialStyles.rightCard)) :
                        styles.hidden}
                />
                <div
                    className={expanded ? (isRtl ? classNames(styles.leftButton, tutorialStyles.leftButton) :
                        classNames(styles.rightButton, tutorialStyles.rightButton)) :
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
                    className={expanded ? (isRtl ? classNames(styles.rightCard, tutorialStyles.rightCard) :
                        classNames(styles.leftCard, tutorialStyles.leftCard)) :
                        styles.hidden}
                />
                <div
                    className={expanded ? (isRtl ? classNames(styles.rightButton, tutorialStyles.rightButton) :
                        classNames(styles.leftButton, tutorialStyles.leftButton)) :
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

const TutorialHeader = ({menu, intl, title, onCloseCards, onShrinkExpandCards, totalSteps, step, expanded}) => (
    <div
        className={expanded ?
            classNames(styles.headerButtons, tutorialStyles.headerButtons) :
            classNames(styles.headerButtons, tutorialStyles.headerButtons, styles.headerButtonsHidden)}
    >
        {totalSteps > 1 && !menu ? (
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
        <div className={tutorialStyles.cardTitleHeader}>
            <span> {intl.formatMessage(title)} </span>
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
                        id="gui.tutorial.cards.shrink"
                    /> :
                    <FormattedMessage
                        defaultMessage="Expand"
                        description="Title for button to expand question category"
                        id="gui.tutorial.cards.expand"
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
                    id="gui.tutorial.cards.close"
                />
            </div>
        </div>
    </div>
);
TutorialHeader.propTypes = {
    menu: PropTypes.bool,
    title: PropTypes.shape({
        msg: PropTypes.object.isRequired,
        data: PropTypes.object
    }),
    expanded: PropTypes.bool.isRequired,
    onCloseCards: PropTypes.func.isRequired,
    onShrinkExpandCards: PropTypes.func.isRequired,
    step: PropTypes.number,
    totalSteps: PropTypes.number,
    intl: intlShape.isRequired
};

const TutorialCards = props => {
    const {
        menu,
        selectedTutorial,
        title,
        intl,
        isRtl,
        onCloseCards,
        onShrinkExpandCards,
        onDrag,
        onStartDrag,
        onEndDrag,
        onNextStep,
        onPrevStep,
        onSelectTutorial,
        totalSteps,
        step,
        expanded,
        vm,
        ...posProps
    } = props;
    let {x, y} = posProps;

    // Copied from the tutorial cards
    const wideCardWidth = 700;
    const cardHorizontalDragOffset = 560; // ~80% of card width
    const cardVerticalDragOffset = expanded ? 400 : 0; // ~80% of card height, if expanded
    const menuBarHeight = 48;

    if (x === 0 && y === 0) {
        x = isRtl ? (-190 - wideCardWidth - cardHorizontalDragOffset) : 620;
        x += cardHorizontalDragOffset;
        y = 60;
    }

    const tutorialMessages = messages[selectedTutorial];

    const rows = [];
    for (let i = 0; i < Object.values(tutorials).length; i++) {
        rows.push(<Tutorial
            content={Object.values(tutorials)[i]}
            onSelect={onSelectTutorial}
        />);
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
                        <TutorialHeader
                            menu={menu}
                            intl={intl}
                            title={menu ? title.msg : tutorialMessages.title}
                            expanded={expanded}
                            step={step}
                            totalSteps={totalSteps}
                            onCloseCards={onCloseCards}
                            onShrinkExpandCards={onShrinkExpandCards}
                        />
                        <div
                            className={expanded ? classNames(styles.stepBody, tutorialStyles.stepBody) : styles.hidden}
                        >
                            {menu ? rows :
                            <>
                                <p>{selectedTutorial}</p>
                            </>
                            }
                        </div>
                        <NextPrevButtons
                            expanded={expanded}
                            isRtl={isRtl}
                            onNextStep={step < totalSteps - 1 ? onNextStep : null}
                            onPrevStep={step > 0 ? onPrevStep : null}
                        />
                    </div>
                </div>
            </Draggable>
        </div>
    );
};
TutorialCards.propTypes = {
    menu: PropTypes.bool,
    selectedTutorial: PropTypes.string,
    title: PropTypes.shape({
        msg: PropTypes.object.isRequired,
        data: PropTypes.object
    }),
    dragging: PropTypes.bool.isRequired,
    expanded: PropTypes.bool.isRequired,
    intl: intlShape.isRequired,
    isRtl: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
    onCloseCards: PropTypes.func.isRequired,
    onDrag: PropTypes.func,
    onEndDrag: PropTypes.func,
    onNextStep: PropTypes.func.isRequired,
    onPrevStep: PropTypes.func.isRequired,
    onShrinkExpandCards: PropTypes.func.isRequired,
    onStartDrag: PropTypes.func,
    onSelectTutorial: PropTypes.func.isRequired,
    totalSteps: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    x: PropTypes.number,
    y: PropTypes.number,
    vm: PropTypes.instanceOf(VirtualMachine).isRequired
};

export default injectIntl(TutorialCards);
