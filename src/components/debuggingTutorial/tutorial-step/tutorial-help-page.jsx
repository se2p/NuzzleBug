import React, {useState} from "react";
import css from "./tutorial-help-page.css";
import ScratchBlocks from "scratchblocks-react";
import scratchblocks from "scratchblocks";
import owl from "../images/OwlBranchRight.png";
import bubbleIndicatorBlue from "../images/bubbleIDecalBlue2.png";
import {TypewriterText} from "../test-results/test-utils.jsx";
import clickIcon from "../images/clickIcon.png"
import {FitToWidth} from "../typewriter.jsx";
const TutorialHelpPage = ({
                              help,
                              isGeneratingHint,
                              generateNewHint,
                              finishedAnswer,
                              returnToTestResults,
                              onFinishedAnswer,
                              guiMessages,
                              locale,
                              optionSelected,
                              setOptionSelected,
                              removeTutorialPoint,
                              shuffledOptionIndexes,
                  }) => {

    const msg = guiMessages.help_page;
    const [selectedOption, setSelectedOption] = useState(-1);

    const optA = shuffledOptionIndexes[0];
    const optB = shuffledOptionIndexes[1];
    const optC = shuffledOptionIndexes[2];

    /**
     * Translates the given scratchBlocksText. Currently only en and de are supported.
     */
    const translate3 = (scratchBlocksText) => {
        if (!scratchBlocksText) return "";

        const block = scratchblocks.parse(scratchBlocksText, {
            languages: ['en', 'de']
        });
        if (locale === 'de') {
            block.translate(scratchblocks.allLanguages.de);
        }
        return block.stringify();
    };

    const translate = (scratchBlocksText) => {
        if (typeof scratchBlocksText !== "string" || scratchBlocksText.trim() === "") return "";

        try {
            const langs = [scratchblocks.allLanguages.en, scratchblocks.allLanguages.de];

            const parsed = scratchblocks.parse(scratchBlocksText, { lang: "en" });

            if (locale === "de") {
                // parse() kann je nach Input eine Liste zurückgeben
                if (Array.isArray(parsed)) {
                    parsed.forEach(b => b?.translate?.(scratchblocks.allLanguages.de));
                } else {
                    parsed?.translate?.(scratchblocks.allLanguages.de);
                }
            }

            // stringify ebenfalls je nach Typ
            if (Array.isArray(parsed)) {
                return parsed.map(b => b.stringify()).join("\n\n");
            }
            return parsed.stringify();
        } catch (e) {
            console.log("ERROR: " + e + ": " + scratchBlocksText)
            // Fallback: im Worst Case den Originaltext anzeigen statt UI zu crashen
            return scratchBlocksText;
        }
    };

    return (
        <div className={css.testContainer}>
            <div className={css.helpWhiteBox}>
                <div className={css.helpContainer}>
                    <>
                        {selectedOption === -1 && <div className={css.EuliBubbleContainer}>
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

                                {!isGeneratingHint && <TypewriterText text={help?.problemText + "\n\nWelcher Code-Vorschlag könnte das Problem lösen?"} speed={15} onComplete={onFinishedAnswer}/>}
                            </div>

                            <div className={css.imageContainer}>
                                <img
                                    src={owl}
                                    alt={"Picture of Euli"}
                                    className={css.owlImage}
                                    draggable={false}
                                />
                            </div>
                        </div>}






                        {finishedAnswer &&
                            <div className={css.fadeIn}>
                                <div className={css.greyBubble}>
                                    <div className={css.selectionBubbleIndicator} />

                                    <div className={css.codeSelection}>
                                        <div className={`${css.code} ${selectedOption === optA ? css.codeSelected : ''}`} onClickCapture={() => {setSelectedOption(optA); if (!help.solutionOptions[optA].isCorrect) removeTutorialPoint()}}>
                                            <FitToWidth>
                                                <ScratchBlocks
                                                    blockStyle="scratch3"
                                                    languages={['en', 'de']}
                                                >
                                                    {translate(help?.solutionOptions[optA].code)}
                                                </ScratchBlocks>
                                            </FitToWidth>
                                        </div>
                                        <div className={`${css.code} ${selectedOption === optB ? css.codeSelected : ''}`} onClickCapture={() => {setSelectedOption(optB); if (!help.solutionOptions[optB].isCorrect) removeTutorialPoint()}}>
                                            <FitToWidth>
                                                <ScratchBlocks
                                                    blockStyle="scratch3"
                                                    languages={['en', 'de']}
                                                >
                                                    {translate(help?.solutionOptions[optB].code)}
                                                </ScratchBlocks>
                                            </FitToWidth>
                                        </div>
                                        <div className={`${css.code} ${selectedOption === optC ? css.codeSelected : ''}`} onClickCapture={() => {setSelectedOption(optC); if (!help.solutionOptions[optC].isCorrect) removeTutorialPoint()}}>
                                            <FitToWidth>
                                                <ScratchBlocks
                                                    blockStyle="scratch3"
                                                    languages={['en', 'de']}
                                                >
                                                    {translate(help?.solutionOptions[optC].code)}
                                                </ScratchBlocks>
                                            </FitToWidth>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        }

                        {/*selectedOption !== 0 && !optionSelected && <div className={css.fadeIn}>
                            <div
                                className={css.helpBubble} onClick={setOptionSelected}
                            >
                                <div className={css.selectionBubbleIndicator} />
                                <span>Überprüfe meine Auswahl <img src={clickIcon} draggable={false} className={css.clickIcon}/></span>
                            </div>
                        </div>*/}





                        {selectedOption !== -1 && <div className={css.EuliBubbleContainer}>
                            <div className={css.helpBubbleEuli}>
                                <img
                                    className={css.helpBubbleEuliIndicator}
                                    alt="Bubble-Decal"
                                    src={bubbleIndicatorBlue}
                                />
                                <TypewriterText text={help.solutionOptions[selectedOption].explanation + (help.solutionOptions[selectedOption].isCorrect ? "\n\n Sehr gut!" : "")} speed={15}/>
                            </div>

                            <div className={css.imageContainer}>
                                <img
                                    src={owl}
                                    alt={"Picture of Euli"}
                                    className={css.owlImage}
                                    draggable={false}
                                />
                            </div>
                        </div>}



                        {/*optionSelected && <div className={css.fadeIn}>
                            <div
                                className={`${css.helpBubble} ${isGeneratingHint ? css.selected : ''}`}
                                onClick={returnToTestResults}
                            >
                                <div className={css.selectionBubbleIndicator} />
                                <span>{msg.returnToResults}</span>
                            </div>
                        </div>*/}


                        {/*finishedAnswer && <>
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
                        </>*/}
                    </>
                </div>
            </div>
        </div>
    );
};

export default TutorialHelpPage;
