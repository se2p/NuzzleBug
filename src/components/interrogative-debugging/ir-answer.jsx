import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import {Answer} from 'scratch-ir';

import styles from './ir-cards.css';
import Box from '../box/box.jsx';

import IRStatement from './ir-statement.jsx';
import {injectIntl, intlShape} from 'react-intl';

import iconLightBulb from './icon--light-bulb.svg';

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
            <div className={styles.answerTextContainer}>
                <img
                    className={styles.showIcon}
                    alt={'Answer Indicator'}
                    src={iconLightBulb}
                />
                <span className={styles.answerText}>
                    {intl.formatMessage(text.msg, text.data)}
                </span>

            </div>
            {answer.statements && answer.statements.length ? (
                <div className={styles.answerContent}>
                    <ul className={classNames(styles.answerStatementsList, styles.alignLeft)}>
                        {renderStatements(answer.statements, answer, glowBlock)}
                    </ul>
                </div>
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
