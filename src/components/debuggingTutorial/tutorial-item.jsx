import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl} from "react-intl";
import css from "./tutorial-item.css";
import difficulty_easy from "./images/difficultyIconEasy.png"
import difficulty_medium from "./images/difficultyIconMedium.png"
import difficulty_hard from "./images/difficultyIconHard.png"

const TutorialItem = ({content, onSelect, isDebuggingTutorial}) => (
    <div className={css.box} onClick={() => onSelect(content.id, content.totalSteps)}>
        <div className={css.header} style={{backgroundColor: isDebuggingTutorial ? "#70a45b" : "#4D97FFFF"}}>
            <span>{content.title}</span>
        </div>
        <div className={css.container}>
            <img className={css.titleImage} alt={"banner"} src={content.img}/>
            <div className={css.data}>
                <span>Schwierigkeit:</span>
                {renderDifficultlyIcon(content)}
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


/*
<div
        className={isDebuggingTutorial ? styles.tutorialDebugging : styles.tutorial}
         eslint-disable-next-line react/jsx-no-bind
onClick={() => {
    onSelect(content.id, content.totalSteps);
}}
>
<div className={isDebuggingTutorial ? styles.tutorialDebuggingHead : styles.tutorialHead} />
<div className={isDebuggingTutorial ? styles.tutorialDebuggingContainer : styles.tutorialContainer}>
    <img
        draggable={false}
        className={styles.tutorialImage}
        src={content.img}
        alt={'Image of the Tutorial'}
    />
    <div className={isDebuggingTutorial ? styles.tutorialDebuggingTitle : styles.tutorialTitle}>{content.title}</div>
    <div
        className={[styles.tutorialDifficulty, content.difficulty === 'easy' ? styles.easy :
            content.difficulty === 'medium' ? styles.medium : styles.difficult].join(' ')}
    >
        {content.difficultyMsg}
    </div>
    <img
        draggable={false}
        className={styles.tutorialDebuggingIcon}
        src={isDebuggingTutorial ? debuggingIcon : tutorialIcon}
        alt={'DebuggingTutorial Icon'}
    />
</div>
</div>
 */
