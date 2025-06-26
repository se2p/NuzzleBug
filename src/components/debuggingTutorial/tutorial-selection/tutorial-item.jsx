import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl} from "react-intl";
import css from "./tutorial-item.css";

import difficulty_easy from "../images/difficultyIconEasy.png"
import difficulty_medium from "../images/difficultyIconMedium.png"
import difficulty_hard from "../images/difficultyIconHard.png"

const TutorialItem = ({content, onSelect, isDebuggingTutorial, guiMessages}) => (
    <div className={css.box} onClick={() => onSelect(content.id, content.totalSteps)}>
        <div className={isDebuggingTutorial ? css.headerGreen : css.headerBlue}>
            <span>{content.title}</span>
        </div>
        <div className={css.container}>
            <img className={css.titleImage} alt={"banner"} src={content.img} draggable={false}/>
            <div className={css.data}>
                <span>{guiMessages.selection.difficulty}</span>
                {renderDifficultlyIcon(content)}
                <span>{guiMessages.selection.steps}</span>
                <strong>{content.totalSteps}</strong>
            </div>
        </div>
    </div>
);

const renderDifficultlyIcon = (content) => {
    let difficulty = difficulty_easy;
    if (content.difficulty === 2) { difficulty = difficulty_medium; }
    if (content.difficulty === 3) { difficulty = difficulty_hard; }

    return <img className={css.icon} src={difficulty} alt={"difficulty"}/>
}

TutorialItem.propTypes = {
    content: PropTypes.shape({
        title: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        img: PropTypes.node.isRequired,
        difficulty: PropTypes.number.isRequired,
        totalSteps: PropTypes.number.isRequired
    }),
    onSelect: PropTypes.func.isRequired,
    isDebuggingTutorial: PropTypes.bool.isRequired
};

export default injectIntl(TutorialItem);
