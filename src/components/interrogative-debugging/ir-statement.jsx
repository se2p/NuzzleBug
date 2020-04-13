import PropTypes from 'prop-types';
import React from 'react';

import {
    CalledButWrongBranchStatement,
    CalledControlStatement,
    CalledStatement,
    ChangingStatement,
    ControlStatement,
    EventStatement,
    NotCalledControlStatement,
    NotCalledStatement,
    OverwrittenStatement,
    Statement,
    UserEventStatement
} from 'scratch-ir';

import irStyles from './ir-cards.css';

const handleClick = (glowBlock, blockId) => () => glowBlock(blockId);

const renderNestedStatements = (children, glowBlock) => {
    children.map(stmt =>
        (<IRStatement
            key={stmt.id}
            statement={stmt}
            glowBlock={glowBlock}
        />)
    );
};

const IRStatement = ({glowBlock, statement}) => {
    let content;

    const tracedBlock = statement.statement;

    switch (statement.constructor) {
    case Statement: {
        content = (
            <div>
                <span> {statement.opcode} </span>
            </div>
        );
        break;
    }
    case ChangingStatement: {
        content = (
            <div>
                <span> {statement.opcode} </span>
                <span> {statement.startValue} {'->'} {statement.endValue} </span>
            </div>
        );
        break;
    }
    case CalledButWrongBranchStatement: {
        content = (
            <div>
                <span> {`${statement.opcode} was called ${statement.values.length} times.`} </span>
            </div>
        );
        break;
    }
    case CalledStatement: {
        const children = renderNestedStatements(statement.controlStatements, glowBlock);
        content =
            (<div>
                <span> {`${statement.opcode} was called because of these blocks.`} </span>
                <ul>
                    {children}
                </ul>
            </div>);
        break;
    }
    case NotCalledStatement:
    case OverwrittenStatement:
    case ControlStatement:
    case CalledControlStatement:
    case NotCalledControlStatement:
    case UserEventStatement:
    case EventStatement: {
        content = <span>{statement.constructor}</span>;
        break;
    }
    default: {
        content = (
            <span>{'Could not find that statement.'}</span>
        );
        break;
    }
    }
    return (
        <li
            className={irStyles.statement}
            onClick={handleClick(glowBlock, tracedBlock.blockId)}
        >
            {content}
        </li>
    );
};

IRStatement.propTypes = {
    glowBlock: PropTypes.func.isRequired,
    statement: PropTypes.instanceOf(Statement)
};

export default IRStatement;
