import React from 'react';
import PropTypes from 'prop-types';
import css from "../debugging-help.css";

const MultipleChoice = ({
                            tutorial,
                            step,
                            tutorialIndexData,
                            selectedAnswers,
                            onEnterMultiAnswer,
                        }) => {
    const renderOptions = () => {
        return Object.keys(tutorial[step])
            .filter(key => key.startsWith('option'))
            .map(key => {
                const option = tutorial[step][key];
                // Berechne den Index aus dem Schlüssel "option1", "option2", ...
                const index = parseInt(key.slice('option'.length), 10) - 1;
                const isSelected = selectedAnswers[index];

                return (
                    <div key={key} className={css.option}>
                        <img
                            alt="option picture"
                            className={css.smallImage}
                            draggable={false}
                            style={{ height: option["width"] || 'auto' }}
                            src={tutorialIndexData[option.img] || undefined}
                        />
                        <div
                            className={css.checkboxTrigger}
                            onClick={() => onEnterMultiAnswer(key)}
                        >
                            <button
                                className={isSelected ? css.checkboxActive : css.checkbox}
                                onClick={e => {
                                    e.stopPropagation();
                                    onEnterMultiAnswer(key);
                                }}
                            />
                        </div>
                    </div>
                );
            });
    };

    return <div className={css.questionContainer}>{renderOptions()}</div>;
};

MultipleChoice.propTypes = {
    tutorial: PropTypes.object.isRequired,
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    tutorialIndexData: PropTypes.object.isRequired,
    selectedAnswers: PropTypes.array.isRequired,
    onEnterMultiAnswer: PropTypes.func.isRequired,
};

export default MultipleChoice;
