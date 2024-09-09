import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import Collapsible from 'react-collapsible';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import bindAll from 'lodash.bindall';

import Box from '../box/box.jsx';
import BBTCollapsibleDescriptionEntry from './bbt-test-collapsible-description.jsx';
import BBTCollapsibleLocationEntry from './bbt-test-collapsible-location.jsx';
import BBTCollapsibleStatusEntry from './bbt-test-collapsible-status.jsx';
import BBTCollapsibleErrorEntry from './bbt-test-collapsible-errors.jsx';
import BBTCollapsibleWhiskerEntry from './bbt-test-collapsible-whisker.jsx';

import styles from './bbt-test-collapsible-entries.css';

import expandIcon from './icons/expand_more_FILL0_wght300_GRAD0_opsz24.svg';
import contractIcon from './icons/expand_less_FILL0_wght300_GRAD0_opsz24.svg';
import runIcon from './icons/play_circle_FILL0_wght300_GRAD0_opsz24.svg';

const messages = defineMessages({
    collapseTestDetails: {
        id: 'gui.blockBasedTesting.collapseTestDetails',
        defaultMessage: 'Collapse test details'
    },
    expandTestDetails: {
        id: 'gui.blockBasedTesting.expandTestDetails',
        defaultMessage: 'Expand test details'
    },
    runThisTest: {
        id: 'gui.blockBasedTesting.runThisTest',
        defaultMessage: 'Run this test'
    }
});

class BBTTestCollapsibleComponent extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'stopPropagation',
            'handleRunTest',
            'handleLocateTest',
            'handleLocateBlock',
            '_getTrigger'
        ]);
    }

    stopPropagation (event) {
        event.stopPropagation();
    }

    handleRunTest (event) {
        event.stopPropagation();
        this.props.onRunTest(this.props.id);
    }

    handleLocateTest () {
        this.handleLocateBlock(this.props.id);
    }

    handleLocateBlock (blockID) {
        this.props.onLocate(this.props.containingSpriteId, blockID);
    }

    _getTrigger (isOpen) {
        return (
            <Box
                className={classNames(
                    styles.trigger,
                    {
                        [styles.backgroundGreen]: this.props.status === 'pass',
                        [styles.backgroundRed]: this.props.status === 'fail' || this.props.status === 'timeout',
                        [styles.backgroundPurple]: this.props.status === 'running'
                    }
                )}
            >

                {isOpen ? (
                    <img
                        className={classNames(styles.icon, styles.iconVerticallyCentered)}
                        title={this.props.intl.formatMessage(messages.collapseTestDetails)}
                        alt={this.props.intl.formatMessage(messages.collapseTestDetails)}
                        draggable={false}
                        src={contractIcon}
                    />
                ) : (
                    <img
                        className={classNames(styles.icon, styles.iconVerticallyCentered)}
                        title={this.props.intl.formatMessage(messages.expandTestDetails)}
                        alt={this.props.intl.formatMessage(messages.expandTestDetails)}
                        draggable={false}
                        src={expandIcon}
                    />
                )}

                <div className={styles.testName}>
                    {this.props.name}
                </div>

                <img
                    className={classNames(
                        styles.iconRight,
                        styles.iconVerticallyCentered,
                        {
                            [styles.iconDisabled]: this.props.isTestOrTestChainRunning
                        }
                    )}
                    draggable={false}
                    src={runIcon}
                    title={this.props.intl.formatMessage(messages.runThisTest)}
                    alt={this.props.intl.formatMessage(messages.runThisTest)}
                    onClick={this.props.isTestOrTestChainRunning ? this.stopPropagation : this.handleRunTest}
                />
            </Box>
        );
    }

    render () {
        return (
            <Collapsible
                className={styles.testCollapsible}
                openedClassName={styles.testCollapsible}
                trigger={this._getTrigger(false)}
                triggerWhenOpen={this._getTrigger(true)}
                transitionTime={40}
                open
            >

                <BBTCollapsibleDescriptionEntry
                    description={this.props.description}
                />

                {this.props.id.startsWith('whisker-') ? (
                    <BBTCollapsibleWhiskerEntry />
                ) : (
                    <BBTCollapsibleLocationEntry
                        spriteName={this.props.containingSpriteName}
                        onLocateTest={this.handleLocateTest}
                    />
                )}

                <BBTCollapsibleStatusEntry
                    status={this.props.status}
                />

                {this.props.status === 'fail' ? (
                    <BBTCollapsibleErrorEntry
                        errors={this.props.errors}
                        onLocateBlock={this.handleLocateBlock}
                    />
                ) : null}

            </Collapsible>
        );
    }
}

BBTTestCollapsibleComponent.propTypes = {
    intl: intlShape,
    isTestOrTestChainRunning: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.oneOf(['none', 'running', 'fail', 'pass', 'timeout']).isRequired,
    errors: PropTypes.object.isRequired,

    containingSpriteId: PropTypes.string,
    containingSpriteName: PropTypes.string,
    onLocate: PropTypes.func,

    onRunTest: PropTypes.func.isRequired
};

export default injectIntl(BBTTestCollapsibleComponent);
