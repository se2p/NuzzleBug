import React from 'react';

import Box from '../box/box.jsx';
import styles from './litterbox-pane.css';
import sharedStyles from './shared.css';

export enum LitterBoxFeature {
    ISSUES,
    LLM_QUESTION,
    QUESTIONS,
}

interface LitterBoxFeatureSelectorProps {
    selectedFeature: LitterBoxFeature;
    onSelect: (choice: LitterBoxFeature) => void;
    onClose: () => void;
}

class LitterBoxFeatureSelector extends React.Component<LitterBoxFeatureSelectorProps, never> {

    private readonly handleSelectIssues = () => {
        this.props.onSelect(LitterBoxFeature.ISSUES);
    };

    private readonly handleSelectLlmQuestion = () => {
        this.props.onSelect(LitterBoxFeature.LLM_QUESTION);
    };

    private readonly handleSelectQuestions = () => {
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
                    {'Code Quality'}
                </button>
                <button
                    className={this.buttonStyle(LitterBoxFeature.LLM_QUESTION)}
                    onClick={this.handleSelectLlmQuestion}
                >
                    {'Ask about Code'}
                </button>
                {/* todo(obermuel,spielede): future extension for LitterBox questions */}
                {/* <button onClick={this.handleSelectQuestions}>{'Question'}</button> */}
                <button
                    className={sharedStyles.genericButton}
                    style={{marginTop: '1rem'}}
                    onClick={this.props.onClose}
                >
                    {'Close'}
                </button>
            </Box>
        );
    }
}

export default LitterBoxFeatureSelector;
