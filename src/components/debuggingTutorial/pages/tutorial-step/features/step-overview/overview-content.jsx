import React from 'react';
import PropTypes from 'prop-types';

import css from '../../tutorial-flow/tutorial-flow.css';

import owl from '../../../../images/OwlBranchRight.png';
import bubbleIndicator from '../../../../images/SpeachBubbleRed.png';

import {generateControlImages} from '../../tutorial-step-util.jsx';
import {parseColoredText} from '../../../../shared/utils.jsx';

const OverviewContent = ({
    contentType,
    tutorialMessages,
    overviewStep,
    tutorialIndexData,
    isErrorInfoVisible,
    showErrorInfo,
    guiMessages
}) => {
    // Rendere den aktuellen Content der TutorialÜbersicht, je nachdem, welchen Reiter der Nutzer zuvor angeklickt hat.
    switch (contentType) {
    case 'DETAILS': {
        const stepMsg = tutorialMessages?.[overviewStep] ?? {};
        return (
            <div className={css.detailsContainer}>
                <div className={css.textArea}>
                    <h1>{stepMsg.title}</h1>
                    <p>{parseColoredText(stepMsg.description)}</p>
                </div>

                <div className={css.verticalLineContainer}>
                    <div className={css.verticalLine} />
                </div>

                <div className={css.imageArea}>
                    <img
                        src={tutorialIndexData?.[stepMsg.image]}
                        draggable={false}
                        className={css.overviewImage}
                        alt="StepImage"
                    />
                </div>
            </div>
        );
    }

    case 'ERRORS': {
        const stepMsg = tutorialMessages?.[overviewStep] ?? {};
        return (
            <div className={css.errorContainer}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        justifyContent: 'space-between',
                        height: '200px'
                    }}
                >
                    <div className={css.detailsContainer}>
                        <div className={css.bubble}>
                            <img
                                className={css.bubbleIndicator}
                                alt="Bubble-Decal"
                                src={bubbleIndicator}
                            />

                            {isErrorInfoVisible ? (
                                <p>
                                    <strong>{guiMessages.step.ofCourse}</strong>
                                    <br />
                                    <br />
                                    {stepMsg.errorDescription}
                                </p>
                            ) : (
                                <p>
                                    {guiMessages.step.errMessage1}{' '}
                                    <strong>
                                        {stepMsg.errorAmount} {guiMessages.step.errMessage2}
                                    </strong>{' '}
                                    {guiMessages.step.errMessage3}
                                </p>
                            )}
                        </div>
                    </div>

                    {!isErrorInfoVisible && (
                        <div style={{display: 'flex', justifyContent: 'flex-start'}}>
                            <span className={css.p}>{guiMessages.step.showError1}</span>
                            <button
                                onClick={showErrorInfo}
                                className={css.errorButton}
                            >
                                {guiMessages.step.showError2}
                            </button>
                        </div>
                    )}
                </div>

                <img
                    src={owl}
                    alt="Euli"
                    className={css.image}
                    draggable={false}
                />
            </div>
        );
    }

    case 'CONTROLS': {
        const stepMsg = tutorialMessages?.[overviewStep] ?? {};
        return (
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    marginRight: '15px',
                    alignItems: 'center'
                }}
            >
                <div className={css.controlContainer}>{generateControlImages(tutorialMessages, overviewStep, tutorialIndexData)}</div>
                <p
                    className={css.p}
                    style={{textAlign: 'center'}}
                >
                    {parseColoredText(stepMsg.controlInfo, tutorialIndexData)}
                </p>
            </div>
        );
    }

    default:
        console.warn(`${contentType} is unknown!`);
        return null;
    }
};

OverviewContent.propTypes = {
    contentType: PropTypes.string.isRequired,
    tutorialMessages: PropTypes.object.isRequired,
    overviewStep: PropTypes.string.isRequired,
    tutorialIndexData: PropTypes.object.isRequired,
    isErrorInfoVisible: PropTypes.bool.isRequired,
    showErrorInfo: PropTypes.func.isRequired,
    guiMessages: PropTypes.object.isRequired
};

export default OverviewContent;
