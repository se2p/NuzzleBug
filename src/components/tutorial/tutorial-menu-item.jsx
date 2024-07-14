import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';
import styles from './styles/tutorial-cards.css';
import debuggingIcon from './images/icon--debugging-bug.png'
import tutorialIcon from "./images/icon--tutorial.png";

const TutorialMenuItem = ({content, onSelect, isDebuggingTutorial}) => (
    <div
        className={isDebuggingTutorial ? styles.tutorialDebugging : styles.tutorial}
        /* eslint-disable-next-line react/jsx-no-bind */
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
);
TutorialMenuItem.propTypes = {
    content: PropTypes.shape({
        title: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        img: PropTypes.node.isRequired,
        difficulty: PropTypes.string.isRequired,
        difficultyMsg: PropTypes.string.isRequired,
        totalSteps: PropTypes.number.isRequired
    }),
    onSelect: PropTypes.func.isRequired,
    isDebuggingTutorial: PropTypes.bool.isRequired
};

export default injectIntl(TutorialMenuItem);
