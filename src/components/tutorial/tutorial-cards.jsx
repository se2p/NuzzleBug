import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import Draggable from 'react-draggable';
import {injectIntl, FormattedMessage} from 'react-intl';

import styles from '../cards/card.css';
import tutorialStyles from './tutorial-cards.css';

import homeIcon from './icon--home.svg';
import shrinkIcon from '../cards/icon--shrink.svg';
import expandIcon from '../cards/icon--expand.svg';
import closeIcon from '../cards/icon--close.svg';
import leftArrow from '../cards/icon--prev.svg';
import rightArrow from '../cards/icon--next.svg';

import Tutorial from './tutorial.jsx';
import TutorialStep from '../../containers/tutorial-step.jsx';

const NextPrevButtons = ({isMenuVisible, onNextStep, onPrevStep, expanded}) => (
    isMenuVisible ? null :
        (<Fragment>
            {onNextStep ? (
                <div>
                    <div
                        className={expanded ? classNames(styles.rightCard, tutorialStyles.rightCard) : styles.hidden}
                    />
                    <div
                        className={expanded ? classNames(styles.rightButton, tutorialStyles.rightButton) :
                            styles.hidden}
                        onClick={onNextStep}
                    >
                        <img
                            draggable={false}
                            src={rightArrow}
                        />
                    </div>
                </div>
            ) : null}
            {onPrevStep ? (
                <div>
                    <div
                        className={expanded ? classNames(styles.leftCard, tutorialStyles.leftCard) : styles.hidden}
                    />
                    <div
                        className={expanded ? classNames(styles.leftButton, tutorialStyles.leftButton) : styles.hidden}
                        onClick={onPrevStep}
                    >
                        <img
                            draggable={false}
                            src={leftArrow}
                        />
                    </div>
                </div>
            ) : null}
        </Fragment>)
);
NextPrevButtons.propTypes = {
    isMenuVisible: PropTypes.bool.isRequired,
    expanded: PropTypes.bool.isRequired,
    onNextStep: PropTypes.func,
    onPrevStep: PropTypes.func
};

const TutorialHeader = props => {
    const {
        isMenuVisible,
        locale,
        title,
        onCloseCards,
        onShrinkExpandCards,
        onHomeMenu,
        totalSteps,
        step,
        expanded
    } = props;

    return (
        <div
            className={expanded ? classNames(styles.headerButtons, tutorialStyles.headerButtons) :
                classNames(styles.headerButtons, tutorialStyles.headerButtons, styles.headerButtonsHidden)}
        >
            {totalSteps > 1 && !isMenuVisible ? (
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
                <span> {title} </span>
            </div>
            <div
                className={styles.headerButtonsRight}
            >
                {expanded ?
                    <div
                        className={tutorialStyles.homeButton}
                        onClick={onHomeMenu}
                    >
                        <img
                            className={tutorialStyles.homeButtonIcon}
                            draggable={false}
                            src={homeIcon}
                        />
                        {locale === 'de' ? 'Hauptmenü' : 'Home'}
                    </div> : null}
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
                            id="gui.cards.shrink"
                        /> :
                        <FormattedMessage
                            defaultMessage="Expand"
                            description="Title for button to expand question category"
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
                        defaultMessage="Close"
                        description="Title for button to close question category"
                        id="gui.cards.close"
                    />
                </div>
            </div>
        </div>
    );
};
TutorialHeader.propTypes = {
    isMenuVisible: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    expanded: PropTypes.bool.isRequired,
    onCloseCards: PropTypes.func.isRequired,
    onShrinkExpandCards: PropTypes.func.isRequired,
    onHomeMenu: PropTypes.func.isRequired,
    step: PropTypes.number,
    totalSteps: PropTypes.number
};

const TutorialCards = props => {
    const {
        tutorials,
        isMenuVisible,
        locale,
        currentTutorialStep,
        steps,
        title,
        tutorialMessagesTest,
        onCloseCards,
        onShrinkExpandCards,
        onDrag,
        onStartDrag,
        onEndDrag,
        onNextStep,
        onPrevStep,
        onSelectTutorial,
        onHomeMenu,
        totalSteps,
        step,
        expanded,
        ...posProps
    } = props;
    let {x, y} = posProps;

    // Copied from the tutorial cards
    const cardHorizontalDragOffset = 560; // ~80% of card width
    const cardVerticalDragOffset = expanded ? 400 : 0; // ~80% of card height, if expanded
    const menuBarHeight = 48;

    if (x === 0 && y === 0) {
        x = 620;
        x += cardHorizontalDragOffset;
        y = 60;
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
                            isMenuVisible={isMenuVisible}
                            locale={locale}
                            title={isMenuVisible ? title : tutorialMessagesTest.title}
                            expanded={expanded}
                            step={step}
                            totalSteps={totalSteps}
                            onCloseCards={onCloseCards}
                            onShrinkExpandCards={onShrinkExpandCards}
                            onHomeMenu={onHomeMenu}
                        />
                        <div
                            className={expanded ? classNames(styles.stepBody, tutorialStyles.stepBody) : styles.hidden}
                        >
                            {isMenuVisible ?
                                Array(tutorials.length).fill(0)
                                    .map((_, i) => (
                                        <Tutorial
                                            key={tutorials[i].id}
                                            content={tutorials[i]}
                                            onSelect={onSelectTutorial}
                                        />
                                    )) :
                                <TutorialStep
                                    step={steps[step]}
                                    index={step}
                                />
                            }
                        </div>
                        <NextPrevButtons
                            isMenuVisible={isMenuVisible}
                            expanded={expanded}
                            onNextStep={step < totalSteps - 1 && step < currentTutorialStep ?
                                onNextStep : null}
                            onPrevStep={step > 0 ? onPrevStep : null}
                        />
                    </div>
                </div>
            </Draggable>
        </div>
    );
};

TutorialCards.propTypes = {
    tutorials: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            img: PropTypes.node.isRequired,
            difficulty: PropTypes.string.isRequired,
            totalSteps: PropTypes.number.isRequired
        })),
    steps: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            message1: PropTypes.string.isRequired,
            img: PropTypes.node.isRequired,
            message2: PropTypes.string.isRequired
        })
    ),
    isMenuVisible: PropTypes.bool,
    title: PropTypes.string,
    tutorialMessagesTest: PropTypes.objectOf(PropTypes.string),
    dragging: PropTypes.bool.isRequired,
    expanded: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
    onCloseCards: PropTypes.func.isRequired,
    onDrag: PropTypes.func,
    onEndDrag: PropTypes.func,
    onNextStep: PropTypes.func.isRequired,
    onPrevStep: PropTypes.func.isRequired,
    onShrinkExpandCards: PropTypes.func.isRequired,
    onStartDrag: PropTypes.func,
    onSelectTutorial: PropTypes.func.isRequired,
    onHomeMenu: PropTypes.func.isRequired,
    totalSteps: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    currentTutorialStep: PropTypes.number.isRequired,
    x: PropTypes.number,
    y: PropTypes.number
};

export default injectIntl(TutorialCards);
