import React from 'react';
import PropTypes from 'prop-types';
import css from "../debugging-help.css";

const MarkChoice = ({
                        selectedBlocks,
                        tutorial,
                        step,
                        answers,
                        setAnswer,
                        tutorialIndexData
                    }) => {
    // Erstelle das Array "selection" anhand der Keys in selectedBlocks
    const selection = [];
    for (const [option, values] of Object.entries(selectedBlocks)) {
        values.forEach(value => {
            selection.push(`${option}_${value}`);
        });
    }

    return (
        <div className={css.questionContainer}>
            {selection.map(key => {
                const optionData = tutorial[step][key];
                if (!optionData) {
                    console.error(`Kein optionData gefunden für key: ${key}`);
                    return null;
                }
                const isSelected = answers[0] === key;

                return (
                    <div key={key} className={css.option}>
                        <img
                            alt="option picture"
                            className={css.smallImage}
                            style={{ width: optionData.width }}
                            draggable={false}
                            src={tutorialIndexData[optionData.img]}
                        />
                        <div
                            className={css.checkboxTrigger}
                            onClick={() => setAnswer(0, key)}
                        >
                            <button
                                className={isSelected ? css.checkboxActive : css.checkbox}
                                onClick={e => {
                                    e.stopPropagation();
                                    setAnswer(0, key);
                                }}
                                style={{ borderRadius: "100px" }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

MarkChoice.propTypes = {
    selectedBlocks: PropTypes.object.isRequired,
    tutorial: PropTypes.object.isRequired,
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    answers: PropTypes.array.isRequired,
    setAnswer: PropTypes.func.isRequired,
    tutorialIndexData: PropTypes.object.isRequired,
};

export default MarkChoice;
