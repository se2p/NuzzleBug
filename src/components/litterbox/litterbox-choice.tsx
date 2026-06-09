import React from 'react';
import {FormattedMessage} from 'react-intl';

import Box from '../box/box.jsx';
import styles from './litterbox-pane.css';
import sharedStyles from './shared.css';
import logging from 'scratch-vm/src/util/logging.js';

export enum LitterBoxFeature {
    ISSUES,
    QUESTIONS,
    LLM_QUESTION,
}

interface LitterBoxFeatureSelectorProps {
    selectedFeature: LitterBoxFeature;
    onSelect: (choice: LitterBoxFeature) => void;
    onClose: () => void;
}

class LitterBoxFeatureSelector extends React.Component<LitterBoxFeatureSelectorProps, never> {

    private readonly handleSelectIssues = () => {
        if (logging.isActive()) {
            logging.logClickEvent('BUTTON', new Date(), 'LB_CODE_QUALITY', null);
        }
        this.props.onSelect(LitterBoxFeature.ISSUES);
    };

    private readonly handleSelectLlmQuestion = () => {
        if (logging.isActive()) {
            logging.logClickEvent('BUTTON', new Date(), 'LB_ASK', null);
        }
        this.props.onSelect(LitterBoxFeature.LLM_QUESTION);
    };

    private readonly handleSelectQuestions = () => {
        if (logging.isActive()) {
            logging.logClickEvent('BUTTON', new Date(), 'LB_CODE_UNDERSTANDING', null);
        }
        this.props.onSelect(LitterBoxFeature.QUESTIONS);
    };

    private readonly buttonStyle = (feature: LitterBoxFeature): string => {
        const base = this.props.selectedFeature === feature ? styles.issueTypeSelectorActive : '';
        return `${base} ${sharedStyles.genericButton}`;
    };

    render () {
        return (
            <Box className={styles.buttonStack}>
                <button
                    className={this.buttonStyle(LitterBoxFeature.ISSUES)}
                    onClick={this.handleSelectIssues}
                >
                    <FormattedMessage
                        id={'gui.litterBox.codeQuality'}
                        defaultMessage={'Code Quality'}
                    />
                </button>
                <button
                    className={this.buttonStyle(LitterBoxFeature.QUESTIONS)}
                    onClick={this.handleSelectQuestions}
                >
                    <FormattedMessage
                        id={'gui.litterBox.question'}
                        defaultMessage={'Code understanding'}
                    />
                </button>
                <button
                    className={this.buttonStyle(LitterBoxFeature.LLM_QUESTION)}
                    onClick={this.handleSelectLlmQuestion}
                >
                    <FormattedMessage
                        id={'gui.litterBox.askAboutCode'}
                        defaultMessage={'Ask about Code'}
                    />
                </button>
                <button
                    className={sharedStyles.genericButton}
                    style={{marginTop: '1rem'}}
                    onClick={this.props.onClose}
                >
                    <FormattedMessage
                        id={'gui.cards.close'}
                        defaultMessage={'Close'}
                    />
                </button>
            </Box>
        );
    }
}

export default LitterBoxFeatureSelector;
