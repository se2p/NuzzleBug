import React from 'react';
import PropTypes from 'prop-types';
import css from '../../tutorial-flow/tutorial-flow.css';

import logging from 'scratch-vm/src/util/logging.js';

import buttonOwly from '../../../../images/buttonOwly.png';
import buttonReset from '../../../../images/buttonReset.png';
import buttonResult from '../../../../images/buttonResults.png';
import buttonTest from '../../../../images/buttonTest.png';
import buttonHelp from '../../../../images/buttonHelp.png';

import {
    RESPONSE_START,
    RESPONSE_DEFAULT,
    RESPONSE_RELOAD,
    RESPONSE_TESTING,
    RESPONSE_TESTING_FINISHED,
    RESPONSE_ASK_TEST_START,
    RESPONSE_EXPLANATION1,
    RESPONSE_EXPLANATION2,
    RESPONSE_EXPLANATION3,
    RESPONSE_EXPLANATION4
} from '../../../../shared/tutorial-constants.jsx';

const ControlPanelButtons = ({
    guiMessages,
    isDebuggingTutorial,
    responseType,
    testResults,
    setCurPage,
    setResponseType,
    onOpenHelp,
    PAGE_TEST_RESULTS,
    tutorialConfig,
    onClickTest
}) => {
    const passed = !!testResults?.passed;

    const isTestButtonEnabled = () =>
        (responseType === RESPONSE_START ||
            responseType === RESPONSE_DEFAULT ||
            responseType === RESPONSE_TESTING ||
            responseType === RESPONSE_TESTING_FINISHED) &&
        !passed;

    const isResultButtonEnabled = () =>
        responseType === RESPONSE_START ||
        responseType === RESPONSE_DEFAULT ||
        responseType === RESPONSE_ASK_TEST_START ||
        passed;

    const isEuliButtonEnabled = () =>
        responseType === RESPONSE_START || responseType === RESPONSE_DEFAULT;

    const isTodoButtonEnabled = () =>
        responseType === RESPONSE_START ||
        responseType === RESPONSE_DEFAULT ||
        responseType === RESPONSE_EXPLANATION1 ||
        responseType === RESPONSE_EXPLANATION2 ||
        responseType === RESPONSE_EXPLANATION3 ||
        responseType === RESPONSE_EXPLANATION4;

    const isResetButtonEnabled = () =>
        responseType === RESPONSE_START ||
        responseType === RESPONSE_DEFAULT ||
        responseType === RESPONSE_RELOAD;

    // Wird genutzt um die Icons individuell auszugrauen
    const gray = (enabled, brightness) =>
        (enabled ? 'none' : `grayscale(100%) brightness(${brightness})`);

    const onClickResult = () => {
        if (testResults === null || testResults === undefined) {
            setResponseType(RESPONSE_ASK_TEST_START);
        } else {
            setCurPage(PAGE_TEST_RESULTS);
            if (!passed) setResponseType(RESPONSE_DEFAULT);
        }
    };

    const onClickHelp = () => { // Nutzer klickt auf "frage Euli". Also öffne die Debugging-Hilfestellung.
        if (!isDebuggingTutorial) return;
        if (logging.isActive()) {
            logging.logClickEvent('BUTTON', new Date(), 'OPEN_HELP_PAGE', null);
        }
        onOpenHelp();
    };

    const onClickTodo = () => {
        if (!passed) setResponseType(RESPONSE_EXPLANATION1);
    };

    const onClickReset = () => {
        if (!passed) setResponseType(RESPONSE_RELOAD);
    };

    return (
        <div className={css.cpButtonRow}>
            {isDebuggingTutorial ? (
                <div className={css.controlPanelButtonParent}>
                    <img
                        className={css.cpButton}
                        src={buttonTest}
                        alt="Button Icon"
                        draggable={false}
                        onClick={onClickTest}
                        style={{filter: gray(isTestButtonEnabled(), 1.2)}}
                    />
                    <span className={css.cpButtonDescription}>{guiMessages.step.testButton}</span>
                </div>
            ) : (
                <div className={css.controlPanelButtonParent}>
                    <img
                        className={css.cpButton}
                        src={buttonResult}
                        alt="Button Icon"
                        draggable={false}
                        onClick={onClickResult}
                        style={{filter: gray(isResultButtonEnabled(), 2.6)}}
                    />
                    <span className={css.cpButtonDescription}>{guiMessages.step.resultButton}</span>
                </div>
            )}

            <div className={css.controlPanelButtonParent}>
                <img
                    className={css.cpButton}
                    src={buttonOwly}
                    alt="Button Icon"
                    draggable={false}
                    onClick={onClickHelp}
                    style={{filter: gray(isEuliButtonEnabled(), 1.6)}}
                />
                <span className={css.cpButtonDescription}>{guiMessages.step.euliButton}</span>
            </div>

            {tutorialConfig.debugging.enableTodoButton && (
                <div className={css.controlPanelButtonParent}>
                    <img
                        className={css.cpButton}
                        src={buttonHelp}
                        alt="Button Icon"
                        draggable={false}
                        onClick={onClickTodo}
                        style={{filter: gray(isTodoButtonEnabled(), 1.0)}}
                    />
                    <span className={css.cpButtonDescription}>{guiMessages.step.todoButton}</span>
                </div>
            )}

            {tutorialConfig.debugging.enableResetButton && (
                <div className={css.controlPanelButtonParent}>
                    <img
                        className={css.cpButton}
                        src={buttonReset}
                        alt="Button Icon"
                        draggable={false}
                        onClick={onClickReset}
                        style={{filter: gray(isResetButtonEnabled(), 1.8)}}
                    />
                    <span className={css.cpButtonDescription}>{guiMessages.step.resetButton}</span>
                </div>
            )}
        </div>
    );
};

ControlPanelButtons.propTypes = {
    guiMessages: PropTypes.object.isRequired,
    isDebuggingTutorial: PropTypes.bool.isRequired,
    responseType: PropTypes.string.isRequired,
    testResults: PropTypes.object,
    setCurPage: PropTypes.func.isRequired,
    setResponseType: PropTypes.func.isRequired,
    onOpenHelp: PropTypes.func.isRequired,
    PAGE_TEST_RESULTS: PropTypes.string.isRequired,
    tutorialConfig: PropTypes.object.isRequired
};

export default ControlPanelButtons;
