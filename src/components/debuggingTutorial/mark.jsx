import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import css from "./debuggingTutorialHelp.css";

const Mark = ({
                  tutorial,
                  step,
                  answers,
                  setAnswer,
                  tutorialIndexData,
                  selectedBlocks,
                  addSelectedBlock,
                  removeSelectedBlock
              }) => {
    // Falls noch keine Antwort gesetzt ist, setze den Standardwert in einem Effekt
    useEffect(() => {
        if (!answers[0]) {
            setAnswer(0, "option1");
        }
    }, [answers, setAnswer]);

    // Solange answers[0] nicht gesetzt ist, rendere nichts
    if (!answers[0]) {
        return null;
    }

    const curOption = answers[0];
    const currentData = tutorial[step][curOption];
    const optionKeys = Object.keys(tutorial[step]).filter(key => key.startsWith('option'));

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                marginLeft: "40px",
                marginRight: "auto",
                marginBottom: "20px",
                marginTop: "20px"
            }}
        >
            <div style={{ display: "flex", alignItems: "end", width: "100%" }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: currentData.height
                    }}
                >
                    {currentData.selectorData.map((e, index) => (
                        <button
                            key={index}
                            className={
                                selectedBlocks[curOption] && selectedBlocks[curOption].includes(index)
                                    ? css.checkboxActive
                                    : css.checkbox
                            }
                            onClick={() => {
                                if (selectedBlocks[curOption] && selectedBlocks[curOption].includes(index)) {
                                    removeSelectedBlock(curOption, index);
                                } else {
                                    addSelectedBlock(curOption, index);
                                }
                            }}
                            style={{ marginTop: e.height }}
                        />
                    ))}
                </div>

                <img
                    src={tutorialIndexData[currentData.img]}
                    style={{ height: currentData.height, marginLeft: "5px" }}
                    draggable={false}
                    alt="codeSnippets"
                />
            </div>

            <div
                style={{
                    marginTop: "20px",
                    marginBottom: "auto",
                    display: "flex",
                    flexDirection: "column",
                    marginRight: "40px",
                    marginLeft: "auto",
                    borderRadius: "10px",
                    border: "2px solid #575E75FF",
                    padding: "10px"
                }}
            >
                {optionKeys.map(e => (
                    <div
                        key={e}
                        style={{ display: "flex", alignItems: "start", height: "50px" }}
                    >
                        <div
                            style={{
                                display: "flex",
                                height: "100%",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <button
                                className={answers[0] === e ? css.checkboxActive : css.checkbox}
                                onClick={() => setAnswer(0, e)}
                                style={{
                                    borderRadius: "100px",
                                    marginRight: "10px",
                                    marginBottom: "10px"
                                }}
                            />
                        </div>
                        <img
                            className={css.spriteImage}
                            src={tutorialIndexData[tutorial[step][e].sprite]}
                            draggable={false}
                            alt="codeSnippetSprite"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

Mark.propTypes = {
    tutorial: PropTypes.object.isRequired,
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    answers: PropTypes.array.isRequired,
    setAnswer: PropTypes.func.isRequired,
    tutorialIndexData: PropTypes.object.isRequired,
    selectedBlocks: PropTypes.object.isRequired,
    addSelectedBlock: PropTypes.func.isRequired,
    removeSelectedBlock: PropTypes.func.isRequired,
};

export default Mark;
