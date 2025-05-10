import React from 'react';
import PropTypes from 'prop-types';
import css from "./debuggingTutorialHelp.css";

const SingleChoice = ({ tutorial, step, tutorialIndexData, answers, setAnswer }) => {
    // Überprüfe, ob die notwendigen Daten vorhanden sind
    if (!tutorial || !tutorial[step]) {
        console.error("Missing tutorial or tutorial[step]");
        return null;
    }

    // Erstelle die Option-Elemente, die mit "option" beginnen
    const options = Object.keys(tutorial[step])
        .filter(key => key.startsWith("option"))
        .map(key => {
            const option = tutorial[step][key];

            // Prüfe, ob die Option existiert
            if (!option) {
                console.error(`Missing option for key: ${key}`);
                return null;
            }

            const isSelected = answers[0] === key;

            return (
                <div key={key} className={css.option}>
                    <img
                        alt="option picture"
                        className={css.smallImage}
                        style={{ width: option.width }}
                        draggable={false}
                        src={tutorialIndexData[option.img] || undefined}
                    />
                    <div className={css.checkboxTrigger} onClick={() => setAnswer(0, key)}>
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
        });

    return <div className={css.questionContainer}>{options}</div>;
};

SingleChoice.propTypes = {
    tutorial: PropTypes.object.isRequired,
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    tutorialIndexData: PropTypes.object.isRequired,
    answers: PropTypes.array.isRequired,
    setAnswer: PropTypes.func.isRequired,
};

export default SingleChoice;
