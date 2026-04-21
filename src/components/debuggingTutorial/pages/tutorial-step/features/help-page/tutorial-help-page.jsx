import React, {useState} from 'react';
import css from './tutorial-help-page.css';
import ScratchBlocks from 'scratchblocks-react';
import owl from '../../../../images/OwlBranchRight.png';
import bubbleIndicatorBlue from '../../../../images/bubbleIDecalBlue2.png';
import {TypewriterText} from '../test-results/test-utils.jsx';
import {FitToWidth} from '../../../../shared/utils.jsx';
import {translate} from '../../tutorial-step-util.jsx';
import TutorialHelpPageQuiz from './tutorial-help-page-quiz.jsx';
import {tutorialConfig} from '../../../../config.js';

const EuliBubble = ({children}) => (
    <div className={css.EuliBubbleContainer}>
        <div className={css.helpBubbleEuli}>
            <img
                className={css.helpBubbleEuliIndicator}
                alt="Bubble-Decal"
                src={bubbleIndicatorBlue}
            />
            {children}
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

const TutorialHelpPage = ({
    help,
    isGeneratingHint,
    finishedAnswer,
    onFinishedAnswer,
    guiMessages,
    locale,
    removeTutorialPoint,
    shuffledOptionIndexes,
    logResponse,
    vm
}) => {

    const [selectedOption, setNewSelectedOption] = useState(-1);
    const [selectedOptionHistory, setSelectedOptionHistory] = useState([0, 0, 0]);

    const handleSelectOption = optionValue => {
        setNewSelectedOption(optionValue);

        if (!help.solutionOptions[optionValue].isCorrect) removeTutorialPoint();

        // logge die Clicks auf die Distraktoren. [1,0,2] bedeutet, dass zunächst der erste, dann der dritte Distraktor angeklickt wurde.
        const selectedOptionsCounter = selectedOptionHistory.filter(x => x !== 0).length;
        const updatedOptionHistory = selectedOptionHistory;
        updatedOptionHistory[optionValue] = updatedOptionHistory[optionValue] !== 0 ? updatedOptionHistory[optionValue] : selectedOptionsCounter + 1;
        setSelectedOptionHistory(updatedOptionHistory);

        if (help.solutionOptions[optionValue].isCorrect) {
            logResponse(updatedOptionHistory);
        }
    };

    const solutionOptions = help?.solutionOptions ?? [];
    const generatedAllCodeSnippets =
        solutionOptions.length === 3 && solutionOptions.every(o => o?.code?.trim());

    return (
        <div className={css.testContainer}>
            <div className={css.helpWhiteBox}>
                <div className={css.helpContainer}>
                    <>
                        {selectedOption === -1 && <EuliBubble>
                            {isGeneratingHint && <div style={{display: 'flex', flexDirection: 'column'}}>
                                {tutorialConfig.classic.llmHintsEnabled && <div style={{display: 'flex'}}>
                                    <strong><TypewriterText
                                        text={guiMessages.help_page.thinking}
                                        speed={30}
                                    /></strong>
                                    <div className={css.helpPageLoaderContainer}>
                                        <span className={css.helpPageLoader} />
                                    </div>
                                </div>}

                                <TutorialHelpPageQuiz
                                    vm={vm}
                                    quizMessages={guiMessages.quiz}
                                />
                            </div>}

                            {!isGeneratingHint && <TypewriterText
                                text={`${help?.problemText}\n\nWelcher Code-Vorschlag könnte das Problem lösen?`}
                                speed={15}
                                onComplete={onFinishedAnswer}
                            />}
                        </EuliBubble>}

                        {finishedAnswer && generatedAllCodeSnippets &&
                            <div className={css.fadeIn}>
                                <div className={css.greyBubble}>
                                    <div className={css.selectionBubbleIndicator} />

                                    <div className={css.codeSelection}>
                                        {shuffledOptionIndexes.map(optIndex => (
                                            <div
                                                key={optIndex}
                                                className={`${css.code} ${selectedOption === optIndex ? css.codeSelected : ''}`}
                                                onClick={() => handleSelectOption(optIndex)}
                                            >
                                                <FitToWidth>
                                                    <ScratchBlocks
                                                        blockStyle="scratch3"
                                                        languages={['en', 'de']}
                                                    >
                                                        {translate(solutionOptions?.[optIndex]?.code, locale)}
                                                    </ScratchBlocks>
                                                </FitToWidth>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        }

                        {selectedOption !== -1 && <EuliBubble>
                            <TypewriterText
                                text={help.solutionOptions[selectedOption].explanation + (help.solutionOptions[selectedOption].isCorrect ? `\n\n${guiMessages.help.great}` : '')}
                                speed={15}
                            />
                        </EuliBubble>}
                    </>
                </div>
            </div>
        </div>
    );
};

export default TutorialHelpPage;
