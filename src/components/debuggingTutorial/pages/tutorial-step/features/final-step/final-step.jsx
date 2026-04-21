import css from './final-step.css';
import owl2 from '../../../../images/owlTransparent.png';
import bubbleIndicatorBlue from '../../../../images/bubbleIDecalBlue2.png';
import React from 'react';
import rightArrow from '../../../../../cards/icon--next.svg';


/**
 * Renders the final congratulation message after finishing a tutorial.
 */
export const FinalStep = ({tutorialMessages, guiMessages, onBackToTutorialSelection, tutorialPoints}) => {

    const renderNextButton = () => (
        <div>
            <div
                className={css.rightButton}
                onClick={() => onBackToTutorialSelection()}
            >
                <span>{guiMessages.finalStep.home}</span>
                <img
                    draggable={false}
                    src={rightArrow}
                    alt="Arrow pointing right"
                />
            </div>
        </div>
    );

    return (
        <div className={css.cpContainer}>
            <span className={css.finalTitle}>{guiMessages.finalStep.title}</span>
            <div className={css.whiteBox}>
                <div className={css.bubbleContainer}>
                    <div className={css.testStartBubble}>
                        <img
                            className={css.finalBubbleIndicator}
                            alt={'Bubble-Decal'}
                            src={bubbleIndicatorBlue}
                        />
                        <span>
                            {tutorialMessages.successMsg}
                            <br /><br /><strong>{guiMessages.finalStep.scoreBefore}<strong style={{color: '#4D97FFFF'}}>{tutorialPoints}</strong>{guiMessages.finalStep.scoreAfter}</strong>
                        </span>
                    </div>
                    <img
                        src={owl2}
                        alt={'Picture of Euli'}
                        className={css.owlImage}
                        draggable={false}
                    />
                </div>
            </div>
            {renderNextButton()}
        </div>
    );
};
