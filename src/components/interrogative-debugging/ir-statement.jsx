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

const getComponentKey = (parentKey, statement) => {
    let id;
    if (statement.statement) {
        const block = statement.statement;
        id = block.blockId ? block.blockId : block.id;
    } else if (statement.event) {
        const event = statement.event;
        id = `${event.type}:${event.value}`;
    } else if (statement.userEvent) {
        const event = statement.userEvent;
        id = `${event.type}:${event.value}`;
    } else {
        id = 'unknown';
    }
    return `${parentKey}-${id}`;
};

const renderNestedStatements = (parentKey, children, glowBlock) => children.map(stmt => {
    const key = getComponentKey(parentKey, stmt);
    return (<IRStatement
        key={key}
        parentKey={key}
        statement={stmt}
        glowBlock={glowBlock}
    />);
});

const forBlock = opcode => {
    switch (opcode) {
    case '':
        return '';
    }
};

// TODO Phil 20/04/2020: obviously adjust this
const prettyPrint = data => {
    const opcode = data.opcode ? data.opcode : '???';
    switch (opcode) {
    case 'control_forever': {
        return `Forever loop`;
    }
    case 'control_repeat': {
        return `Repeat loop`;
    }
    case 'control_repeat_until': {
        return `Repeat until loop`;
    }
    case 'control_if': {
        return `If block`;
    }
    case 'control_if_else': {
        return `If else block`;
    }
    }
    return '';
};

const IRStatement = ({parentKey, glowBlock, statement}) => {
    const tracedBlock = statement.statement;
    // blockId for trace content, id for static blocks
    const blockId = tracedBlock ? (tracedBlock.blockId ? tracedBlock.blockId : tracedBlock.id) : null;
    const handleClick = blockId ? glowBlock(blockId) : null;

    let content;
    let children;

    switch (statement.constructor) {
    case ChangingStatement: {
        content = (<span> {statement.startValue} {'->'} {statement.endValue} </span>);
        break;
    }
    case CalledButWrongBranchStatement: {
        content = (
            <span>
                {`${prettyPrint(tracedBlock)} was called ${statement.values.length} times.`}
            </span>
        );
        break;
    }
    case NotCalledControlStatement: {
        content = <span> {`${prettyPrint(tracedBlock)} was never called.`} </span>;
        break;
    }
    case CalledStatement: {
        content = (<span> {`${tracedBlock.opcode} was called, because`} </span>);
        children = (
            <ul>
                {renderNestedStatements(parentKey, statement.controlStatements, glowBlock)}
            </ul>
        );
        break;
    }
    case NotCalledStatement: {
        content = (<span> {`${tracedBlock.opcode} was never called, because`} </span>);
        children = (
            <ul>
                {renderNestedStatements(parentKey, statement.controlStatements, glowBlock)}
            </ul>
        );
        break;
    }
    case EventStatement: {
        const event = statement.event;
        switch (event.type) {
        case 'broadcast': {
            content = statement.wasCalled ? (
                <span> {`Broadcast ${event.value} was called.`} </span>
            ) : (
                <span> {`Broadcast ${event.value} never called.`} </span>
            );
            break;
        }
        case 'clone': {
            content = statement.wasCalled ? (
                <span> {`Sprite ${event.value} was cloned.`} </span>
            ) : (
                <span> {`Sprite ${event.value} never cloned.`} </span>
            );
            break;
        }
        }
        children = (
            <ul>
                {renderNestedStatements(parentKey, statement.sendStatements, glowBlock)}
            </ul>
        );
        break;
    }
    case Statement:
    case OverwrittenStatement:
    case ControlStatement:
    case CalledControlStatement:
    case UserEventStatement: {
        content = <span>{statement.constructor.name}</span>;
        break;
    }
    default: {
        content = (
            <span>{'Could not find that statement.'}</span>
        );
        break;
    }
    }
    // TODO Phil 17/04/2020: Make children hideable
    return (
        <li className={irStyles.statement}>
            <div onClick={handleClick}>
                {content}
            </div>
            {children ? (
                <div>
                    {children}
                </div>
            ) : null}
        </li>
    );
};

IRStatement.propTypes = {
    parentKey: PropTypes.string.isRequired,
    glowBlock: PropTypes.func.isRequired,
    statement: PropTypes.instanceOf(Statement)
};

export default IRStatement;
