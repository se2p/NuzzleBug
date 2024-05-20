import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';
import styles from './styles/tutorial-cards.css';

const TutorialMenuItem = ({content, onSelect}) => (
    <div
        className={styles.tutorial}
        /* eslint-disable-next-line react/jsx-no-bind */
        onClick={() => {
            onSelect(content.id, content.totalSteps);
        }}
    >
        <div className={styles.tutorialHead} />
        <div className={styles.tutorialContainer}>
            <img
                draggable={false}
                className={styles.tutorialImage}
                src={content.img}
                alt={'Image of the Tutorial'}
            />
            <div className={styles.tutorialTitle}>{content.title}</div>
            <div
                className={[styles.tutorialDifficulty, content.difficulty === 'easy' ? styles.easy :
                    content.difficulty === 'medium' ? styles.medium : styles.difficult].join(' ')}
            >
                {content.difficultyMsg}
            </div>
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
    onSelect: PropTypes.func.isRequired
};

export default injectIntl(TutorialMenuItem);
