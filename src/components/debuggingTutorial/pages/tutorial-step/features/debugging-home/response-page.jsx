import React from 'react';
import PropTypes from 'prop-types';
import css from '../../tutorial-flow/tutorial-flow.css';
import owl from '../../../../images/OwlBranchRight.png';
import bubbleIndicatorGray from '../../../../images/bubbleDecalGrey.png';
import ControlPanelButtons from './control-panel-buttons.jsx';
import {tutorialConfig} from '../../../../config.js';

const ResponsePage = ({
    guiMessages,
    isDebuggingTutorial,
    responseType,
    testResults,
    setCurPage,
    setResponseType,
    onOpenHelp,
    PAGE_TEST_RESULTS,
    getResponse,
    onClickTest
}) => (
    <div className={css.cpContainer}>
        <div
            className={css.whiteBox}
            style={{marginTop: '60px', width: '80%', border: '#575E75FF solid 3px'}}
        >
            <img
                className={css.controlPanelImageSmall}
                src={owl}
                alt="Owl picture"
                draggable={false}
            />

            <div>
                <div className={css.responseBubble}>
                    <img
                        className={css.responseBubbleIndicator}
                        src={bubbleIndicatorGray}
                        alt="bubbleDecal"
                    />
                    {getResponse()}
                </div>
            </div>
        </div>

        <ControlPanelButtons
            guiMessages={guiMessages}
            isDebuggingTutorial={isDebuggingTutorial}
            responseType={responseType}
            testResults={testResults}
            setCurPage={setCurPage}
            setResponseType={setResponseType}
            onOpenHelp={onOpenHelp}
            PAGE_TEST_RESULTS={PAGE_TEST_RESULTS}
            tutorialConfig={tutorialConfig}
            onClickTest={onClickTest}
        />
    </div>
);

ResponsePage.propTypes = {
    guiMessages: PropTypes.object.isRequired,
    isDebuggingTutorial: PropTypes.bool.isRequired,
    responseType: PropTypes.string.isRequired,
    testResults: PropTypes.object,
    setCurPage: PropTypes.func.isRequired,
    setResponseType: PropTypes.func.isRequired,
    onOpenHelp: PropTypes.func.isRequired,
    PAGE_TEST_RESULTS: PropTypes.string.isRequired,
    getResponse: PropTypes.func.isRequired,
    tutorialConfig: PropTypes.object.isRequired
};

export default ResponsePage;
