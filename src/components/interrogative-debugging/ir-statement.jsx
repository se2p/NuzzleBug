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
    EventNotSentStatement,
    EventSentAndReceiveButStoppedStatement,
    EventSentNotReceivedStatement,
    EventSentStatement,
    NotCalledControlStatement,
    NotCalledStatement,
    NotChangingStatement,
    OverwritingStatement,
    OverwrittenStatement,
    RightBranchButStoppedStatement,
    Statement,
    UnreachableStatement,
    UserEventCalledStatement,
    UserEventCalledButStoppedStatement,
    UserEventNotCalledStatement
} from 'scratch-ir';

import {StatementFormatter, statementMessages as msg} from '../../lib/libraries/ir-messages.js';
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

class IRStatement extends React.Component {
    constructor (props) {
        super(props);

        bindAll(this, [
            'handleExpand',
            'prettyPrintBlock',
            'prettyPrintEvent',
            'prettyPrintUserEvent',
            'renderNestedStatements'
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

    prettyPrintBlock (block) {
        const {title, extras} = this.props.formatter.formatBlock(block);
        return this.props.intl.formatMessage(title, extras);
    }

    prettyPrintEvent (event) {
        const {title, extras} = this.props.formatter.formatEvent(event);
        return this.props.intl.formatMessage(title, extras);
    }

    prettyPrintUserEvent (userEvent) {
        const {title, extras} = this.props.formatter.formatUserEvent(userEvent);
        return this.props.intl.formatMessage(title, extras);
    }

    renderNestedStatements (parentKey, children) {
        const {
            formatter,
            glowBlock,
            intl
        } = this.props;

        return children.map(childStatement => {
            const key = `${parentKey}-${childStatement.id}`;
            return (<IRStatement
                key={key}
                parentKey={key}
                statement={childStatement}
                inner
                intl={intl}
                formatter={formatter}
                glowBlock={glowBlock}
            />);
        });
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
        const blockTitle = block ? this.prettyPrintBlock(block) : {};
        const event = statement.event;
        const eventTitle = event ? this.prettyPrintEvent(event) : {};
        const userEvent = statement.userEvent;
        const userEventTitle = userEvent ? this.prettyPrintUserEvent(userEvent) : {};
        let handleClick = block ? glowBlock(block.id) : null;

        let message = null; // has to be set.
        let messageData = {}; // can be empty
        let children = null; // can be empty

        switch (statement.constructor) {
        case ChangingStatement: {
            message = msg.changingStatement;
            messageData = {
                block: blockTitle,
                startValue: statement.startValue,
                endValue: statement.endValue
            };
            break;
        }
        case NotChangingStatement: {
            message = msg.notChangingStatement;
            messageData = {
                block: blockTitle,
                value: statement.value,
                timesCalled: statement.timesCalled
            };
            break;
        }
        case CalledButWrongBranchStatement: {
            message = msg.calledButWrongBranchStatement;
            messageData = {
                block: blockTitle,
                timesCalled: statement.values.length,
                value: `${statement.values[0]}`,
                requiredCondition: statement.requiredCondition
            };
            break;
        }
        case RightBranchButStoppedStatement: {
            message = msg.rightBranchButStoppedStatement;
            messageData = {
                block: blockTitle,
                condition: `${statement.requiredCondition}`
            };
            break;
        }
        case CalledControlStatement: {
            message = msg.calledControlStatement;
            messageData = {
                block: blockTitle,
                condition: `${statement.requiredCondition}`
            };
            break;
        }
        case NotCalledControlStatement: {
            message = msg.notCalledControlStatement;
            messageData = {
                block: blockTitle
            };
            break;
        }
        case CalledStatement: {
            message = msg.calledStatement;
            messageData = {
                block: blockTitle
            };
            children = (
                <ul className={irStyles.statementsInnerList}>
                    {this.renderNestedStatements(parentKey, statement.controlBlocks)}
                </ul>
            );
            break;
        }
        case NotCalledStatement: {
            message = msg.notCalledStatement;
            messageData = {
                block: blockTitle
            };
            children = (
                <ul className={irStyles.statementsInnerList}>
                    {this.renderNestedStatements(parentKey, statement.controlBlocks)}
                </ul>
            );
            break;
        }
        case OverwrittenStatement: {
            message = msg.overwrittenStatement;
            messageData = {
                block: blockTitle,
                timesCalled: statement.timesCalled
            };
            children = (
                <ul className={irStyles.statementsInnerList}>
                    {this.renderNestedStatements(parentKey, [statement.overwriting])}
                </ul>
            );
            break;
        }
        case OverwritingStatement: {
            message = msg.overwritingStatement;
            messageData = {
                block: blockTitle,
                startValue: statement.startValue,
                endValue: statement.endValue
            };
            break;
        }
        case UnreachableStatement: {
            message = msg.unreachableStatement;
            messageData = {
                block: blockTitle
            };
            break;
        }
        case EventSentStatement: {
            message = msg.eventSentStatement;
            messageData = {
                event: eventTitle
            };
            if (!inner) {
                children = (
                    <ul className={irStyles.statementsInnerList}>
                        {this.renderNestedStatements(parentKey, statement.sendBlocks)}
                    </ul>
                );
            }
            break;
        }
        case EventNotSentStatement: {
            message = msg.eventNotSentStatement;
            messageData = {
                event: eventTitle
            };
            if (!inner) {
                children = (
                    <ul className={irStyles.statementsInnerList}>
                        {this.renderNestedStatements(parentKey, statement.sendBlocks)}
                    </ul>
                );
            }
            break;
        }
        case EventSentAndReceiveButStoppedStatement: {
            message = msg.eventSentAndReceiveButStoppedStatement;
            messageData = {
                event: eventTitle
            };
            handleClick = glowBlock(statement.receivingBlock.id);
            break;
        }
        case EventSentNotReceivedStatement: {
            message = msg.eventSentNotReceivedStatement;
            messageData = {
                event: eventTitle
            };
            handleClick = glowBlock(statement.receivingBlock.id);
            break;
        }

        case UserEventCalledStatement: {
            message = msg.userEventCalledStatement;
            messageData = {
                userEvent: userEventTitle
            };
            break;
        }
        case UserEventCalledButStoppedStatement: {
            message = msg.userEventCalledButStoppedStatement;
            messageData = {
                userEvent: userEventTitle
            };
            break;
        }
        case UserEventNotCalledStatement: {
            message = msg.userEventNotCalledStatement;
            messageData = {
                userEvent: userEventTitle
            };
            break;
        }
        default: {
            message = msg.failed;
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
                        style={{textAlign: 'left'}}
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
    formatter: PropTypes.instanceOf(StatementFormatter).isRequired,
    glowBlock: PropTypes.func.isRequired,
    statement: PropTypes.instanceOf(Statement),
    inner: PropTypes.bool.isRequired
};

export default injectIntl(IRStatement);
