import PropTypes from 'prop-types';
import React from 'react';

import {Answer} from 'scratch-ir';

import styles from './ir-cards.css';
import Box from '../box/box.jsx';

import IRStatement from './ir-statement.jsx';

const renderStatements = (answer, statements, glowBlock) => statements.map(statement =>
    (
        <IRStatement
            key={`${answer.id}-${statement.id}`}
            parentKey={`${answer.id}-${statement.id}`}
            statement={statement}
            glowBlock={glowBlock}
        />
    )
);

const IRAnswer = ({answer, glowBlock}) => {
    const statements = answer.statements ? answer.statements : [];
    const variable = answer.variable;
    const startValue = answer.startValue;
    const endValue = answer.endValue;

    const renderedStatements = renderStatements(answer, statements, glowBlock);

    return (
        <Box
            className={styles.answer}
        >
            <span>
                {answer.text}
            </span>
            <br />
            {variable ? (
                <div>
                    <span>{`${variable.name} was changed ${statements.length} times.`}</span>
                    <br />
                    <span>{`Start value: ${startValue}`}</span>
                    <br />
                    <span>{`End value: ${endValue}.`}</span>
                </div>
            ) : null}
            {statements.length ? (
                <ul className={styles.answerStatements}>
                    {renderedStatements}
                </ul>
            ) : null}
        </Box>
    );
};

IRAnswer.propTypes = {
    answer: PropTypes.instanceOf(Answer).isRequired,
    glowBlock: PropTypes.func.isRequired
};

export default IRAnswer;
