import React from 'react';
import styles from '../tutorial/styles/tutorial-cards.css';
import PropTypes from 'prop-types';
import TutorialOutputText from '../tutorial/tutorial-output-text.jsx';

/**
 * Component displaying instructions to solve current step.
 * Moved into tutorial_creation (was previously in tutorial-card-step, removed in develop
 * as unused in the main tutorial flow — kept here for Tutorial Creation preview).
 */
const Instructions = props => {
    const {
        title,
        message1,
        img,
        message2
    } = props;

    return (
        <div>
            <h4 className={styles.stepTitle}>{title} </h4>
            <TutorialOutputText
                content={message1}
            />
            <img
                className={styles.stepImage}
                draggable={false}
                src={img}
                alt={'Image of the current step.'}
            />
            <TutorialOutputText
                content={message2}
            />
        </div>
    );
};
Instructions.propTypes = {
    title: PropTypes.string.isRequired,
    message1: PropTypes.string.isRequired,
    img: PropTypes.node.isRequired,
    message2: PropTypes.string.isRequired
};

export default Instructions;
