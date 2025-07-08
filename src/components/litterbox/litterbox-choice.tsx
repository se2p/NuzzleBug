import React from 'react';

import Box from '../box/box.jsx';
import styles from './litterbox-pane.css';

export enum LitterBoxFeature {
    ISSUES,
    LLM_QUESTION,
    QUESTIONS,
}

interface LitterBoxFeatureSelectorProps {
    onSelect: (choice: LitterBoxFeature) => void;
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
            <Box className={styles.featureSelector}>
                <button onClick={this.handleSelectIssues}>{'Code Quality'}</button>
                <button onClick={this.handleSelectLlmQuestion}>{'Ask about Code'}</button>
                {/* todo(obermuel,spielede): future extension for LitterBox questions */}
                {/* <button onClick={this.handleSelectQuestions}>{'Question'}</button> */}
            </Box>
        );
    }
}

export default LitterBoxFeatureSelector;
