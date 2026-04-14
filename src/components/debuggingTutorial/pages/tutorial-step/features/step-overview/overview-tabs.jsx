import React from 'react';
import PropTypes from 'prop-types';
import css from '../../tutorial-flow/tutorial-flow.css';
import iconErrors from '../../../../images/icon--Errors.png';
import iconDescription from '../../../../images/icon--Description.png';
import iconControls from '../../../../images/icon--Controls.png';

const OverviewTabs = ({
    contentType,
    setContentType,
    isDebuggingTutorial,
    showControlOverview,
    guiMessages
}) => (
    <div className={css.tabContainer}>
        <button
            className={css.tabButton}
            id="beschreibungTab"
            style={{backgroundColor: contentType === 'DETAILS' ? '#4D97FFFF' : ''}}
            onClick={() => setContentType('DETAILS')}
        >
            <div style={{display: 'flex', alignItems: 'center'}}>
                <img
                    className={css.icon}
                    src={iconDescription}
                    alt="icon"
                    draggable={false}
                />
                {guiMessages.step.description}
            </div>
        </button>

        {isDebuggingTutorial && (
            <button
                className={css.tabButton}
                id="fehlerTab"
                style={{backgroundColor: contentType === 'ERRORS' ? '#cf3b28FF' : ''}}
                onClick={() => setContentType('ERRORS')}
            >
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <img
                        className={css.icon}
                        src={iconErrors}
                        alt="icon"
                        draggable={false}
                    />
                    {guiMessages.step.error}
                </div>
            </button>
        )}

        {showControlOverview && (
            <button
                className={css.tabButton}
                id="steuerungTab"
                style={{backgroundColor: contentType === 'CONTROLS' ? '#ffab19ff' : ''}}
                onClick={() => setContentType('CONTROLS')}
            >
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <img
                        className={css.icon}
                        src={iconControls}
                        alt="icon"
                        draggable={false}
                    />
                    {guiMessages.step.controls}
                </div>
            </button>
        )}
    </div>
);

OverviewTabs.propTypes = {
    contentType: PropTypes.string.isRequired,
    setContentType: PropTypes.func.isRequired,
    isDebuggingTutorial: PropTypes.bool.isRequired,
    showControlOverview: PropTypes.bool.isRequired,
    guiMessages: PropTypes.object.isRequired
};

export default OverviewTabs;
