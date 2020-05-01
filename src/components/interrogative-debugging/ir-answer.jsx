import PropTypes from 'prop-types';
import React from 'react';

import {Answer} from 'scratch-ir';

import styles from './ir-cards.css';
import Box from '../box/box.jsx';

import IRStatement from './ir-statement.jsx';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';

const renderStatements = (statements, answer, glowBlock) => statements.map(statement => {
    const key = `${(answer.id)}-${statement.id}`;
    return (
        <IRStatement
            key={key}
            parentKey={key}
            statement={statement}
            glowBlock={glowBlock}
            inner={false}
        />
    );
});

const IRAnswer = ({answer, glowBlock, intl}) => {
    const text = answer.text;

    return (
        <Box
            className={styles.answer}
        >
            <div>
                <span>
                    {intl.formatMessage(text.msg, text.data)}
                </span>

            </div>
            <br />
            {answer.statements && answer.statements.length ? (
                <>
                    <FormattedMessage
                        defaultMessage={'Relevant blocks:'}
                        description="Title for answer statements."
                        id={'gui.ir-answer.relevant-blocks'}
                    />
                    <ul className={styles.answerStatementsList}>
                        {renderStatements(answer.statements, answer, glowBlock)}
                    </ul>
                </>
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
