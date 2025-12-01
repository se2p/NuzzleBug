import React from "react";
import css from "./debuggingTutorialStep.css";
import ScratchBlocks from "scratchblocks-react";
import scratchblocks from "scratchblocks";
import owl from "../images/OwlBranchRight.png";
import bubbleIndicatorBlue from "../images/bubbleIDecalBlue2.png";
import {TypewriterText} from "../test-results/test-utils.jsx";


const TutorialHelpPage = ({
                              help,
                              isGeneratingHint,
                              generateNewHint,
                              finishedAnswer,
                              returnToTestResults,
                              onFinishedAnswer,
                              guiMessages,
                              locale
                  }) => {

    const msg = guiMessages.help_page;

    /**
     * Translates the given scratchBlocksText. Currently only en and de are supported.
     */
    const translate = (scratchBlocksText) => {
        if (!scratchBlocksText) return "";

        const block = scratchblocks.parse(scratchBlocksText, {
            languages: ['en', 'de']
        });
        if (locale === 'de') {
            block.translate(scratchblocks.allLanguages.de);
        }
        return block.stringify();
    };

    return (
        <div className={css.testContainer}>
            <div className={css.helpWhiteBox}>
                <div className={css.helpContainer}>
                    <>

                        <div className={css.helpBubbleEuli}>
                            <img
                                className={css.helpBubbleEuliIndicator}
                                alt="Bubble-Decal"
                                src={bubbleIndicatorBlue}
                            />
                            {isGeneratingHint && <div style={{display: "flex"}}>
                                <strong><TypewriterText text={msg.thinking} speed={30}/></strong>
                                <div className={css.helpPageLoaderContainer}>
                                    <span className={css.helpPageLoader}></span>
                                </div>
                            </div>}

                            {!isGeneratingHint && <TypewriterText text={help?.Text} speed={15} onComplete={onFinishedAnswer}/>}



                            {finishedAnswer &&
                                <div style={{transform: "scale(0.8)"}} className={css.fadeIn}>
                                    <div style={{display: "flex", justifyContent: "center"}}>
                                            {help?.Code && (
                                                <ScratchBlocks
                                                    blockStyle="scratch3"
                                                    languages={['en', 'de']}
                                                >
                                                    {translate(help.Code)}
                                                </ScratchBlocks>
                                            )}
                                    </div>
                                </div>
                            }
                        </div>

                        {finishedAnswer && <>
                            {help?.finishedHelpFlag ?
                                <div className={css.fadeIn}>
                                    <div
                                        className={`${css.helpBubble} ${isGeneratingHint ? css.selected : ''}`}
                                        onClick={returnToTestResults}
                                    >
                                        <div className={css.selectionBubbleIndicator} />
                                        <span>{msg.returnToResults}</span>
                                    </div>
                                </div>
                                :
                                <div className={css.fadeIn}>
                                    <div
                                        className={`${css.helpBubble} ${isGeneratingHint ? css.selected : ''}`}
                                        onClick={generateNewHint}
                                    >
                                        <div className={css.selectionBubbleIndicator} />
                                        <span>{msg.newHint}</span>
                                    </div>
                                </div>
                            }
                        </>}
                    </>
                </div>

                <div className={css.imageContainer}>
                    <img
                        src={owl}
                        alt={"Picture of Euli"}
                        className={css.owlImage}
                        draggable={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default TutorialHelpPage;
