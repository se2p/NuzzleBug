import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import bindAll from 'lodash.bindall';
import classNames from 'classnames';
import {
    CalledButWrongBranchStatement,
    CalledControlStatement,
    CalledStatement,
    ChangingStatement,
    EventStatement,
    NotCalledControlStatement,
    NotCalledStatement,
    OverwrittenStatement,
    Statement,
    UserEventStatement
} from 'scratch-ir';

import {blockMessages as blockMsg, statementMessages as stmtMsg} from '../../lib/libraries/ir-messages.js';
import irStyles from './ir-cards.css';
import styles from './ir-cards.css';
import iconExpand from './icon--expand.svg';
import iconCollapse from './icon--collapse.svg';

const messages = defineMessages({
    showStatementDetailsTitle: {
        id: 'gui.ir-statement.show-details',
        defaultMessage: 'Show Details',
        description: 'Show statement details button title'
    },
    closeStatementDetailsTitle: {
        id: 'gui.ir-statement.close-details',
        defaultMessage: 'Close Details',
        description: 'Close statement details button title'
    }
});

const renderNestedStatements = (intl, parentKey, children, glowBlock) => children.map(statement => {
    const key = `${parentKey}-${statement.id}`;
    return (<IRStatement
        intl={intl}
        key={key}
        parentKey={key}
        statement={statement}
        glowBlock={glowBlock}
        inner
    />);
});

const prettyPrint = (intl, data) => {
    const opcode = data.opcode ? data.opcode : '???';
    if (blockMsg.hasOwnProperty(opcode)) {
        return intl.formatMessage(blockMsg[opcode]);
    }
    return opcode;
};

class IRStatement extends React.Component {
    constructor (props) {
        super(props);

        bindAll(this, [
            'handleExpand'
        ]);

        this.state = {
            expand: this.props.inner
        };
    }

    handleExpand (e) {
        e.preventDefault();

        this.setState(state => ({
            expand: !state.expand
        }));
    }

    render () {
        const {
            intl,
            parentKey,
            glowBlock,
            statement,
            inner
        } = this.props;
        const block = statement.block;
        // blockId for trace content, id for static blocks
        const handleClick = block ? glowBlock(block.id) : null;

        let message; // has to be set.
        let messageData; // can be empty
        let children; // can be empty

        switch (statement.constructor) {
        case ChangingStatement: {
            message = stmtMsg.changingStatement;
            messageData = {
                startValue: statement.startValue,
                endValue: statement.endValue
            };
            break;
        }
        case CalledButWrongBranchStatement: {
            message = stmtMsg.calledButWrongBranchStatement;
            messageData = {
                block: prettyPrint(intl, block),
                timesCalled: statement.values.length,
                value: `${statement.values[0]}`
            };
            break;
        }
        case CalledControlStatement: {
            message = stmtMsg.calledControlStatement;
            messageData = {
                block: prettyPrint(intl, block)
            };
            break;
        }
        case NotCalledControlStatement: {
            message = stmtMsg.notCalledControlStatement;
            messageData = {
                block: prettyPrint(intl, block)
            };
            break;
        }
        case CalledStatement: {
            message = stmtMsg.calledStatement;
            messageData = {
                block: prettyPrint(intl, block)
            };
            children = (
                <ul className={irStyles.statementsInnerList}>
                    {renderNestedStatements(intl, parentKey, statement.controlBlocks, glowBlock)}
                </ul>
            );
            break;
        }
        case NotCalledStatement: {
            message = stmtMsg.notCalledStatement;
            messageData = {
                block: prettyPrint(intl, block)
            };
            children = (
                <ul className={irStyles.statementsInnerList}>
                    {renderNestedStatements(intl, parentKey, statement.controlBlocks, glowBlock)}
                </ul>
            );
            break;
        }
        case OverwrittenStatement: {
            message = stmtMsg.overwrittenStatement;
            messageData = {
                block: prettyPrint(intl, block)
            };
            break;
        }
        case EventStatement: {
            const event = statement.event;
            switch (event.type) {
            case 'broadcast': {
                if (statement.wasCalled) {
                    message = stmtMsg.calledBroadcast;
                    messageData = {
                        name: statement.event.value
                    };
                } else {
                    message = stmtMsg.notCalledBroadcast;
                    messageData = {
                        name: statement.event.value
                    };
                }
                break;
            }
            case 'clone': {
                if (statement.wasCalled) {
                    message = stmtMsg.createdClone;
                    messageData = {
                        name: statement.event.value
                    };
                } else {
                    message = stmtMsg.notCreatedClone;
                    messageData = {
                        name: statement.event.value
                    };
                }
            }
            }
            children = (
                <ul className={irStyles.statementsInnerList}>
                    {renderNestedStatements(intl, parentKey, statement.sendBlocks, glowBlock)}
                </ul>
            );
            break;
        }
        case UserEventStatement: {
            if (statement.wasCalled) {
                message = stmtMsg.calledUserEvent;
                messageData = {
                    name: statement.userEvent.name
                };
            } else {
                message = stmtMsg.notCalledUserEvent;
                messageData = {
                    name: statement.userEvent.name
                };
            }
            break;
        }
        default: {
            message = stmtMsg.failed;
            break;
        }
        }
        if (!message) {
            return null;
        }
        return (
            <li
                className={classNames(
                    inner ? classNames(irStyles.statementListItem, irStyles.statementInner) :
                        irStyles.statementListItem, {[irStyles.statementClickable]: !!handleClick}
                )}
            >
                <div className={irStyles.statementContent}>
                    <div
                        className={irStyles.statementText}
                        onClick={handleClick}
                    >
                        <span>{intl.formatMessage(message, messageData)}</span>
                    </div>
                    { !inner && children ? (
                        <button
                            className={irStyles.statementExpandButton}
                            onClick={this.handleExpand}
                        >
                            {this.state.expand ?
                                <img
                                    className={styles.buttonIcon}
                                    title={intl.formatMessage(messages.closeStatementDetailsTitle)}
                                    src={iconCollapse}
                                /> :
                                <img
                                    className={styles.buttonIcon}
                                    title={intl.formatMessage(messages.showStatementDetailsTitle)}
                                    src={iconExpand}
                                />
                            }
                        </button>
                    ) : null}
                </div>
                {children && this.state.expand ? (
                    <div>
                        {children}
                    </div>
                ) : null}
            </li>
        );
    }
}

IRStatement.propTypes = {
    intl: intlShape.isRequired,
    parentKey: PropTypes.string.isRequired,
    glowBlock: PropTypes.func.isRequired,
    statement: PropTypes.instanceOf(Statement),
    inner: PropTypes.bool.isRequired
};

export default injectIntl(IRStatement);
