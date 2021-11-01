import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import bindAll from 'lodash.bindall';
import {injectIntl, intlShape} from 'react-intl';

import {Answer} from 'scratch-ir';

import styles from './ir-cards.css';
import Box from '../../box/box.jsx';

import {StatementFormatter} from '../../../lib/libraries/ir-messages.js';
import IRStatement from './ir-statement.jsx';

import iconLightBulb from './icon--light-bulb.svg';


class IRAnswer extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'renderStatements'
        ]);
    }

    renderStatements (statements) {
        const {
            answer,
            glowBlock,
            statementFormatter
        } = this.props;

        return statements.map(statement => {
            const key = `${(answer.id)}-${statement.id}`;
            return (
                <IRStatement
                    key={key}
                    parentKey={key}
                    statement={statement}
                    glowBlock={glowBlock}
                    formatter={statementFormatter}
                    inner={false}
                />
            );
        });
    }

    render () {
        const {
            answer,
            intl
        } = this.props;
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
                        <ul className={classNames(styles.answerStatementsList)}>
                            {this.renderStatements(answer.statements)}
                        </ul>
                    </div>
                ) : null}
            </Box>
        );
    }
}

IRAnswer.propTypes = {
    intl: intlShape.isRequired,
    answer: PropTypes.instanceOf(Answer).isRequired,
    statementFormatter: PropTypes.instanceOf(StatementFormatter).isRequired,
    glowBlock: PropTypes.func.isRequired
};

export default injectIntl(IRAnswer);
