import React from 'react';

import Box from '../box/box.jsx';
import styles from './litterbox-pane.css';

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

    render () {
        return (
            <Box className={styles.buttonStack}>
                <button
                    className={
                        this.props.selectedFeature === LitterBoxFeature.ISSUES ?
                            styles.issueTypeSelectorActive :
                            undefined
                    }
                    onClick={this.handleSelectIssues}
                >
                    {'Code Quality'}
                </button>
                <button
                    className={
                        this.props.selectedFeature === LitterBoxFeature.LLM_QUESTION ?
                            styles.issueTypeSelectorActive :
                            undefined
                    }
                    onClick={this.handleSelectLlmQuestion}
                >
                    {'Ask about Code'}
                </button>
                {/* todo(obermuel,spielede): future extension for LitterBox questions */}
                {/* <button onClick={this.handleSelectQuestions}>{'Question'}</button> */}
                <button
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
