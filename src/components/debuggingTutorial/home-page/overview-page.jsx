import React, { useRef } from "react";
import PropTypes from "prop-types";
import css from "../features/tutorial-flow/tutorial-flow.css";
import rightArrow from "../../cards/icon--next.svg";
import OverviewTabs from "./overview-tabs.jsx";
import { handleHoldButton, resetHoldButton } from "../features/tutorial-flow/tutorial-step-util.jsx";
import OverviewContent from "./overview-content.jsx";

/**
 * Overview page for one tutorial step:
 * - Tabs (Details / Errors / Controls)
 * - Content container
 * - Next button OR Hold-to-start button
 */
const OverviewPage = ({
                          contentType,
                          isLoading,
                          isShowingQuickHandle,
                          isDebuggingTutorial,
                          showControlOverview,
                          setContentType,
                          setLoading,
                          onStartAfterHold,
                          getBorderColor,
                          guiMessages,
                          tutorialMessages,
                          overviewStep,
                          tutorialIndexData,
                          isErrorInfoVisible,
                          showErrorInfo,
                      }) => {
    const progressBarRef = useRef(null);
    const timeoutIdRef = useRef(null);

    const handleMouseDown = () => {
        timeoutIdRef.current = handleHoldButton(
            progressBarRef,
            () => {
                onStartAfterHold(true);
            },
            setLoading
        );
    };

    const handleMouseUp = () => resetHoldButton(progressBarRef, setLoading, timeoutIdRef);

    return (
        <div className={css.cpContainer}>
            <div className={css.whiteBoxOverview}>
                <div style={{ width: "100%" }}>
                    <OverviewTabs
                        contentType={contentType}
                        setContentType={setContentType}
                        isDebuggingTutorial={isDebuggingTutorial}
                        showControlOverview={showControlOverview}
                        guiMessages={guiMessages}
                    />

                    <div className={css.container} style={{ borderColor: getBorderColor(contentType) }}>
                        {  <OverviewContent
                                 contentType={contentType}
                                 tutorialMessages={tutorialMessages}
                                 overviewStep={overviewStep}
                                 tutorialIndexData={tutorialIndexData}
                                 isErrorInfoVisible={isErrorInfoVisible}
                                 showErrorInfo={showErrorInfo}
                                 guiMessages={guiMessages}
                               />}
                    </div>
                </div>
            </div>

            <div className={css.buttonContainer}>
                {isShowingQuickHandle ? (
                    <div className={css.overviewNextButton} onClick={() => onStartAfterHold(false)}>
                        <span>{guiMessages.step.next}</span>
                        <img draggable={false} src={rightArrow} alt="Arrow pointing right" />
                    </div>
                ) : (
                    <button
                        className={isLoading ? css.resetButtonPressed : css.resetButton}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        {guiMessages.step.startTutorial}
                        <div className={css.progressBar} ref={progressBarRef}></div>
                    </button>
                )}
            </div>
        </div>
    );
};

OverviewPage.propTypes = {
    contentType: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isShowingQuickHandle: PropTypes.bool.isRequired,

    isDebuggingTutorial: PropTypes.bool.isRequired,
    showControlOverview: PropTypes.bool.isRequired,

    setContentType: PropTypes.func.isRequired,
    setCurPage: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    onStartAfterHold: PropTypes.func.isRequired,

    getContent: PropTypes.func.isRequired,
    getBorderColor: PropTypes.func.isRequired,

    PAGE_RESPONSE: PropTypes.string.isRequired,
    guiMessages: PropTypes.object.isRequired,
};

export default OverviewPage;
