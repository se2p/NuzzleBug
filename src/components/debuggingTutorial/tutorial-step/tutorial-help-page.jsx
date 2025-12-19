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
                  }) => {

    const msg = guiMessages.help_page;
    const [selectedOption, setSelectedOption] = useState(0);
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
                        {!optionSelected && <div className={css.EuliBubbleContainer}>
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
                                        <div className={`${css.code} ${selectedOption === 1 ? css.codeSelected : ''}`} onClickCapture={() => setSelectedOption(1)}>
                                            <FitToWidth>
                                                <ScratchBlocks
                                                    blockStyle="scratch3"
                                                    languages={['en', 'de']}
                                                >
                                                    {translate(help.solutionOptions[0].code)}
                                                </ScratchBlocks>
                                            </FitToWidth>
                                        </div>
                                        <div className={`${css.code} ${selectedOption === 2 ? css.codeSelected : ''}`} onClickCapture={() => setSelectedOption(2)}>
                                            <FitToWidth>
                                                <ScratchBlocks
                                                    blockStyle="scratch3"
                                                    languages={['en', 'de']}
                                                >
                                                    {translate(help.solutionOptions[1].code)}
                                                </ScratchBlocks>
                                            </FitToWidth>
                                        </div>
                                        <div className={`${css.code} ${selectedOption === 3 ? css.codeSelected : ''}`} onClickCapture={() => setSelectedOption(3)}>
                                            <FitToWidth>
                                                <ScratchBlocks
                                                    blockStyle="scratch3"
                                                    languages={['en', 'de']}
                                                >
                                                    {translate(help.solutionOptions[2].code)}
                                                </ScratchBlocks>
                                            </FitToWidth>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        }

                        {selectedOption !== 0 && !optionSelected && <div className={css.fadeIn}>
                            <div
                                className={css.helpBubble} onClick={setOptionSelected}
                            >
                                <div className={css.selectionBubbleIndicator} />
                                <span>Überprüfe meine Auswahl <img src={clickIcon} draggable={false} className={css.clickIcon}/></span>
                            </div>
                        </div>}





                        {optionSelected && <div className={css.EuliBubbleContainer}>
                            <div className={css.helpBubbleEuli}>
                                <img
                                    className={css.helpBubbleEuliIndicator}
                                    alt="Bubble-Decal"
                                    src={bubbleIndicatorBlue}
                                />
                                <TypewriterText text={help.solutionOptions[selectedOption - 1].explanation + (help.solutionOptions[selectedOption - 1].isCorrect ? "\n\n Sehr gut!" : "")} speed={15}/>
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
