import React from 'react';
import styles from '../../styles/tutorial-cards.css';
import arrow from '../../images/icon--arrow-top.svg';
import PropTypes from 'prop-types';

/**
 * Component that displays the user a possible solution for the current step.
 *
 * @param title title of the solution
 * @param content content of the solution
 * @param onSolution action that is performed when the solution button is clicked
 * @param solutionExpanded boolean that indicates whether solution is expanded
 * @constructor
 */

const Solution = ({title, content, onSolution, solutionExpanded}) => (
    <>
        <div
            className={styles.stepSolutionHeader}
            onClick={onSolution}
        >
            <p className={styles.stepSolutionHeaderTitle}> {title} </p>
            <img
                className={solutionExpanded ?
                    styles.stepSolutionHeaderArrowDown : styles.stepSolutionHeaderArrowUp}
                src={arrow}
                draggable={false}
                alt={'Arrow'}
            />
        </div>
        {solutionExpanded ?
            <div className={styles.stepSolutionContainer}>
                <img
                    className={styles.stepSolutionImage}
                    src={content.img}
                    draggable={false}
                    alt={'Image of a possible solution for this step.'}
                />
                <p className={styles.stepSolutionText}> {content.message} </p>
            </div> : null}
    </>
);
Solution.propTypes = {
    title: PropTypes.string,
    content: PropTypes.shape({
        message: PropTypes.string.isRequired,
        img: PropTypes.node.isRequired
    }),
    onSolution: PropTypes.func.isRequired,
    solutionExpanded: PropTypes.bool.isRequired
};

export default Solution;
