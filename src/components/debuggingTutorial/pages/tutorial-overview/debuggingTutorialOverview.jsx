import css from './debuggingTutorialOverview.css';
import PropTypes from 'prop-types';
import React from 'react';
import bubbleIndicatorGray from '../../images/bubbleDecalGrey2.png';
import bubbleIndicatorBlue from '../../images/bubbleIDecalBlue2.png';
import owl from '../../images/OwlBranchRight.png';
import arrowNext from '../../images/icon_arrowNext.png';
import backButton from '../../images/nextButton3.png';
import saveTrueIcon from '../../images/saveTrueIcon.png';
import saveTrueIconWhite from '../../images/autoSaveOnWhite.png';
import saveFalseIconWhite from '../../images/autoSaveOffWhite.png';
import saveFalseIcon from '../../images/saveFalseIcon.png';
import difficulty1 from '../../images/difficultyIconEasy.png';
import difficulty2 from '../../images/difficultyIconMedium.png';
import difficulty3 from '../../images/difficultyIconHard.png';

import {CONTENT_START_TUTORIAL, CONTENT_DESCRIPTION} from '../../shared/tutorial-constants.jsx';
import rightArrow from '../../../cards/icon--next.svg';
import {parseColoredText} from '../../shared/utils.jsx';

const difficultyImages = {
    1: difficulty1,
    2: difficulty2,
    3: difficulty3
};

const DebuggingTutorialOverview = props => {
    const {
        tutorialPicture,
        onStart,
        tutorialMessages,
        setAutoSave,
        autoSave,
        setContentType,
        contentType,
        tutorialIndexData,
        openAutoSaveSelection,
        isProjectEmpty,
        isNewTutorialSelected,
        guiMessages
    } = props;

    const renderDescription = () => (
        <div className={css.bubbleContainer}>
            <div
                className={css.bubble}
                style={{borderColor: contentType === CONTENT_START_TUTORIAL ? '#4D97FFFF' : '#575E75FF'}}
            >
                <img
                    className={css.bubbleIndicator}
                    alt={'Bubble-Decal'}
                    src={bubbleIndicatorGray}
                    style={{top: '20%'}}
                />

                <div className={css.detailsContainer}>
                    <div className={css.imageArea}>
                        <img
                            src={tutorialPicture}
                            draggable={false}
                            className={css.overviewImage}
                            alt={'StepImage'}
                        />
                        <div className={css.detailsArea}>
                            <div style={{display: 'flex'}}>
                                <span>{guiMessages.overview.steps}</span>
                                <div className={css.stepNumber}>{tutorialIndexData.totalSteps}</div>
                            </div>
                            <div style={{display: 'flex'}}>
                                <span>{guiMessages.overview.difficulty}</span>
                                <img
                                    className={css.difficultyIcon}
                                    src={difficultyImages[tutorialIndexData.difficulty]}
                                    alt={'difficultyIcon'}
                                    draggable={false}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={css.verticalLineContainer}>
                        <div className={css.verticalLine} />
                    </div>
                    <div className={css.textArea}>
                        <div>
                            {parseColoredText(tutorialMessages.description)}
                        </div>
                    </div>
                </div>
            </div>
            <div className={css.imageContainer}>
                <img
                    src={owl}
                    alt={'Picture of Euli'}
                    className={css.owlImage}
                    draggable={false}
                />
            </div>
        </div>
    );

    const renderAutosaveSelection = () => (
        <div className={css.bubbleContainer}>
            <div className={css.selectionContainer}>
                <div className={css.startBubble}>
                    <img
                        className={css.bubbleIndicator}
                        alt={'Bubble-Decal'}
                        src={bubbleIndicatorBlue}
                    />
                    {getSelectionBubbleMessage()}
                </div>
                <div
                    className={`${css.selectionBubble} ${(autoSave === '' || autoSave === 'NO') ? '' : css.selected}`}
                    onClick={() => setAutoSave('YES')}
                >
                    <div className={css.selectionBubbleIndicator} />
                    <img
                        src={(autoSave === '' || autoSave === 'NO') ? saveTrueIcon : saveTrueIconWhite}
                        className={css.selectionIcon}
                        alt={'Icon'}
                    />
                    {guiMessages.overview.auto_save_answer_yes}
                </div>
                <div
                    className={`${css.selectionBubble} ${(autoSave === '' || autoSave === 'YES') ? '' : css.selected}`}
                    onClick={() => setAutoSave('NO')}
                >
                    <div className={css.selectionBubbleIndicator} />
                    <img
                        src={(autoSave === '' || autoSave === 'YES') ? saveFalseIcon : saveFalseIconWhite}
                        className={css.selectionIcon}
                        alt={'Icon'}
                    />
                    {guiMessages.overview.auto_save_answer_no}
                </div>
            </div>
            <div className={css.imageContainer}>
                <img
                    src={owl}
                    alt={'Picture of Euli'}
                    className={css.owlImage}
                    draggable={false}
                />
            </div>
        </div>
    );

    const renderButtonBar = () => {
        if (contentType === CONTENT_DESCRIPTION) {
            return (
                <div className={css.buttonContainer}>
                    <div className={css.rightCard} />
                    <div
                        className={css.rightButton}
                        onClick={() => {
                            if (isNewTutorialSelected && !isProjectEmpty) {
                                openAutoSaveSelection();
                            } else {
                                onStart();
                            }
                        }}
                    >
                        <span>{guiMessages.overview.next}</span>
                        <img
                            draggable={false}
                            src={rightArrow}
                            alt="Arrow pointing right"
                        />
                    </div>
                </div>
            );
        }
        const autoSaveOptionSelected = autoSave !== '';

        return (
            <div className={css.buttonContainer}>
                <div className={css.left}>
                    <div className={css.backButtonContainer}>
                        <div className={css.arrowFill} />
                        <img
                            className={css.backButton}
                            onClick={() => setContentType(CONTENT_DESCRIPTION)}
                            src={backButton}
                            alt={'Back'}
                        />
                    </div>
                </div>

                <div className={css.center}>
                    {autoSaveOptionSelected && <a
                        href="#"
                        className={`${css.effect} ${css['effect-1']}`}
                        onClick={onStart}
                    >
                        <span>{guiMessages.overview.start_tutorial}</span>
                        <img
                            src={arrowNext}
                            alt="Icon"
                            className={css.buttonIcon}
                        />
                    </a>}
                </div>

                <div className={css.right} />
            </div>
        );

    };

    /**
     * Get Eulis response based on the selected autoSafe method.
     * @returns {JSX.Element}
     */
    const getSelectionBubbleMessage = () => {
        if (autoSave === '') {
            return <span>{parseColoredText(guiMessages.overview.auto_save_question)}</span>;
        } else if (autoSave === 'YES') {
            return <span>{parseColoredText(guiMessages.overview.auto_save_response_yes)}</span>;
        }
        return <span>{parseColoredText(guiMessages.overview.auto_save_response_no)}</span>;

    };

    return (
        <div className={css.container}>

            <h1
                className={css.heading}
                style={{color: contentType === CONTENT_START_TUTORIAL ? '#575E75FF' : '#4D97FFFF'}}
            >
                {tutorialMessages.title}
            </h1>
            <div className={css.whiteBox}>
                {contentType === CONTENT_DESCRIPTION ? renderDescription() : renderAutosaveSelection()}
            </div>
            {renderButtonBar()}
        </div>
    );
};

DebuggingTutorialOverview.propTypes = {
    onStartTutorial: PropTypes.func.isRequired
};

export default DebuggingTutorialOverview;
