import PropTypes from 'prop-types';
import React from 'react';

import {Answer} from 'scratch-ir';

import styles from './ir-cards.css';
import Box from '../box/box.jsx';

import IRStatement from './ir-statement.jsx';
import {intlShape, injectIntl} from 'react-intl';

const renderStatements = (statements, answer, glowBlock) => statements.map(statement =>
    (
        <IRStatement
            key={`${answer.id}-${statement.id}`}
            parentKey={`${answer.id}-${statement.id}`}
            statement={statement}
            glowBlock={glowBlock}
        />
    )
);

const IRAnswer = ({answer, glowBlock, intl}) => {
    const text = answer.text;
    const statements = answer.statements ? answer.statements : [];
    const variable = answer.variable;
    const startValue = answer.startValue;
    const endValue = answer.endValue;

    const renderedStatements = renderStatements(statements, answer, glowBlock);

    return (
        <Box
            className={styles.answer}
        >
            <span>
                {intl.formatMessage(text.msg, text.data)}
            </span>
            <br />
            {statements.length ? (
                <ul className={styles.answerStatements}>
                    {renderedStatements}
                </ul>
            ) : null}
        </Box>
    );
};

IRAnswer.propTypes = {
    intl: intlShape.isRequired,
    answer: PropTypes.instanceOf(Answer).isRequired,
    glowBlock: PropTypes.func.isRequired
};

export default injectIntl(IRAnswer);
