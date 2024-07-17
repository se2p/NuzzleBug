import classNames from 'classnames';
import PropTypes, {func} from 'prop-types';
import React, {Fragment} from 'react';
import Draggable from 'react-draggable';
import {injectIntl, FormattedMessage} from 'react-intl';

import styles from '../cards/card.css';
import tutorialStyles from './styles/tutorial-cards.css';

import homeIcon from './images/icon--home.svg';
import shrinkIcon from '../cards/icon--shrink.svg';
import expandIcon from '../cards/icon--expand.svg';
import closeIcon from '../cards/icon--close.svg';
import leftArrow from '../cards/icon--prev.svg';
import rightArrow from '../cards/icon--next.svg';
import backIcon from './images/icon--back.png'

import Tutorial from './tutorial-menu-item.jsx';
import TutorialStep from '../../containers/tutorial-step.jsx';
import VirtualMachine from 'scratch-vm';
import DebuggingTutorialStep from "../../containers/debugging-tutorial-step.jsx";
import DebuggingTutorialOverview from "../../containers/debugging-tutorial-overview.jsx";
import DebuggingTutorialStep1 from "../../containers/debugging-tutorial-step1.jsx";



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
                            alt={'Arrow pointing right'}
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
                            alt={'Arrow pointing left'}
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
        title,
        homeButtonTitle,
        backButtonTitle,
        onCloseCards,
        onShrinkExpandCards,
        onHomeMenu,
        totalSteps,
        step,
        expanded,
        contentType,
    } = props;

    const isBackButtonEnabled = contentType === "DEBUGGING_STEP" || contentType === "DEBUGGING_HELP";
    let homeButtonText = "";
    if (contentType === "DEBUGGING_STEP") {
        homeButtonText = backButtonTitle;
    } else if (contentType === "DEBUGGING_HELP") {
        homeButtonText = "Aktueller Schritt"; //TODO add buttonText
    } else {homeButtonText = homeButtonTitle;}

    return (
        <div
            className={expanded ? classNames(styles.headerButtons, tutorialStyles.headerButtons) :
                classNames(styles.headerButtons, tutorialStyles.headerButtons, styles.headerButtonsHidden)}
        >
            {totalSteps > 1 && !isMenuVisible ? (
                <div className={styles.stepsList} style={{marginLeft: '18px'}}>
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
                            src={isBackButtonEnabled ? backIcon : homeIcon}
                            alt={'House'}
                        />
                        {homeButtonText}
                    </div> : null}
                <div
                    className={styles.shrinkExpandButton}
                    onClick={onShrinkExpandCards}
                >
                    <img
                        draggable={false}
                        src={expanded ? shrinkIcon : expandIcon}
                        alt={'Arrow, that indicates whether to shrink or expand the content.'}
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
                        alt={'Cross'}
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
    title: PropTypes.string.isRequired,
    homeButtonTitle: PropTypes.string.isRequired,
    expanded: PropTypes.bool.isRequired,
    onCloseCards: PropTypes.func.isRequired,
    onShrinkExpandCards: PropTypes.func.isRequired,
    onHomeMenu: PropTypes.func.isRequired,
    step: PropTypes.number,
    totalSteps: PropTypes.number
};

const TutorialCards = props => {
    const {
        cardRef,
        tutorials,
        selectedTutorial,
        isMenuVisible, //TODO löschen
        isRtl,
        currentTutorialStep,
        title,
        homeButtonTitle,
        backButtonTitle,
        guiMessages,
        tutorialMessages,
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
        vm,
        contentType,
        onSetContentType,
        onStartTutorial,
        projectFiles,
        onOpenHelp,
        tutorialIndexData,
        ...posProps
    } = props;
    let {x, y} = posProps;

    // Copied from the tutorial cards
    const cardHorizontalDragOffset = 560; // ~80% of card width
    const cardVerticalDragOffset = expanded ? 400 : 0; // ~80% of card height, if expanded
    const menuBarHeight = 48;

    if (x === 0 && y === 0) {
        x = isRtl ? (-800 - cardHorizontalDragOffset) : 620;
        x += cardHorizontalDragOffset;
        y = 60;
    }

    let detectors;
    let isDebuggingTutorialSelected = false;
    const tut = tutorials.filter(tutorial => tutorial.id === selectedTutorial);
    if (tut.length > 0 && tut[0] !== undefined) {
        isDebuggingTutorialSelected = tut[0].isDebuggingTutorial;
        if (tut[0].detectors) detectors = tut[0].detectors;
    }




    const parseContent = function () {

        switch (contentType) {
            case "TUTORIAL_SELECTED":
                if (isDebuggingTutorialSelected) {
                    return <DebuggingTutorialOverview
                        title={title}
                        tutorialMessages={tutorialMessages}
                        tutorialPicture={tut[0].img}
                        onStartTutorial={onStartTutorial}
                        vm={vm}
                        stepCount={totalSteps}
                    />;
                } else {
                    return <TutorialStep
                        guiMessages={guiMessages}
                        tutorialMessages={tutorialMessages}
                        detectors={detectors}
                        step={step}
                        nextStep={onNextStep}
                        vm={vm}
                    />;
                }
            case "DEBUGGING_STEP":
                return <DebuggingTutorialStep1
                    onOpenHelp={onOpenHelp}
                    tutorialMessages={tutorialMessages}
                    projectFiles={"projectFiles"}
                    vm={vm}
                    step={step}
                    nextStep={onNextStep}
                />;
            case "DEBUGGING_HELP":
                return <DebuggingTutorialStep
                    tutorial={tutorialMessages}
                    tutorialIndexData={tutorialIndexData}
                />
            default: //Show menu
                return Array(tutorials.length).fill(0)
                    .map((_, i) => (
                        <Tutorial
                            isDebuggingTutorial={tutorials[i].isDebuggingTutorial}
                            key={tutorials[i].id}
                            content={tutorials[i]}
                            onSelect={onSelectTutorial}
                        />
                    ));
        }
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
                    <div className={styles.card} >
                        <TutorialHeader
                            isMenuVisible={isMenuVisible}
                            title={title}
                            homeButtonTitle={homeButtonTitle}
                            backButtonTitle={backButtonTitle}
                            expanded={expanded}
                            step={step}
                            totalSteps={totalSteps}
                            onCloseCards={onCloseCards}
                            onShrinkExpandCards={onShrinkExpandCards}
                            onHomeMenu={onHomeMenu}
                            contentType={contentType}
                        />
                        <div
                            className={expanded ? classNames(styles.stepBody, tutorialStyles.stepBody) : styles.hidden}
                            ref={cardRef}
                        >

                            {parseContent()}




                        </div>
                        <NextPrevButtons
                            isMenuVisible={isMenuVisible}
                            expanded={expanded}
                            onNextStep={step < totalSteps - 1 && step < currentTutorialStep ?
                                onNextStep : null}
                            onPrevStep={step > 0 ? onPrevStep : null}
                        />
                        {expanded ?
                            <div className={tutorialStyles.footer}>
                                <p className={tutorialStyles.footerText}>{guiMessages.codeClub}</p>
                                <div
                                    /* eslint-disable-next-line react/jsx-no-bind */
                                    onClick={() =>
                                        window.open('https://projects.raspberrypi.org/en/codeclub', '_blank')}
                                    className={tutorialStyles.footerLink}
                                    /* eslint-disable-next-line react/jsx-no-literals */
                                >Code Club</div>
                            </div> : null}
                    </div>
                </div>
            </Draggable>
        </div>
    );
};

TutorialCards.propTypes = {
    cardRef: PropTypes.func,
    tutorials: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            img: PropTypes.node.isRequired,
            difficulty: PropTypes.string.isRequired,
            totalSteps: PropTypes.number.isRequired,
            detectors: PropTypes.string
        })),
    selectedTutorial: PropTypes.string,
    isMenuVisible: PropTypes.bool,
    isRtl: PropTypes.bool.isRequired,
    title: PropTypes.string,
    homeButtonTitle: PropTypes.string,
    guiMessages: PropTypes.objectOf(PropTypes.string),
    tutorialMessages: PropTypes.shape({
        failureMessage: PropTypes.string,
        description: PropTypes.string
    }),
    dragging: PropTypes.bool.isRequired,
    expanded: PropTypes.bool.isRequired,
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
    y: PropTypes.number,
    vm: PropTypes.instanceOf(VirtualMachine).isRequired,
    onSetContentType: PropTypes.func,
    onOpenHelp: PropTypes.func,
};

export default injectIntl(TutorialCards);
