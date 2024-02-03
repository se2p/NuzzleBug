import React from 'react';
import styles from '../../styles/tutorial-cards.css';
import PropTypes from 'prop-types';

/**
 * Component displaying instructions to solve current step.
 * @param props properties that are required to create the component.
 * @constructor
 */

const TutorialStepInstructions = props => {
    const {
        title,
        message1,
        img,
        message2
    } = props;

    return (
        <div>
            <h4 className={styles.stepTitle}>{title} </h4>
            <p className={styles.stepInstructions}> {message1} </p>
            <img
                className={styles.stepImage}
                draggable={false}
                src={img}
                alt={'Image of the current step.'}
            />
            <p className={styles.stepInstructions}> {message2} </p>
        </div>
    );
};
TutorialStepInstructions.propTypes = {
    title: PropTypes.string.isRequired,
    message1: PropTypes.string.isRequired,
    img: PropTypes.node.isRequired,
    message2: PropTypes.string.isRequired
};

export default TutorialStepInstructions;
