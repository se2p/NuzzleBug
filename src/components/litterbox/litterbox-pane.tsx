import React from 'react';

import Box from '../box/box.jsx';
import styles from './litterbox-pane.css';
import LitterBoxIssues from './litterbox-issues.tsx';
import LitterBoxFeatureSelector, {LitterBoxFeature} from './litterbox-choice.tsx';
import ScratchVM from 'scratch-vm';
import {explainIssue, LitterBoxHint, runLitterBoxAnalysis} from '../../containers/litterbox-web-api.ts';
import LitterBoxLlmQuestionComponent from './litterbox-llm-question.component.tsx';

interface LitterBoxPaneProps {
    vm: ScratchVM
}

interface LitterBoxPaneState {
    selectedFeature: LitterBoxFeature;
    litterBoxIssues: LitterBoxHint[] | undefined;
    llmResponse: string | undefined;
}

class LitterBoxPane extends React.Component<LitterBoxPaneProps, LitterBoxPaneState> {

    state: LitterBoxPaneState = {
        selectedFeature: LitterBoxFeature.ISSUES,
        litterBoxIssues: undefined,
        llmResponse: undefined
    };

    componentDidMount () {
        this.fetchLitterBoxIssues();
    }

    private readonly handleOnSelectFeature = (feature: LitterBoxFeature) => {
        this.setState(prev => ({
            ...prev,
            selectedFeature: feature
        }));

        switch (feature) {
        case LitterBoxFeature.ISSUES:
            this.handleOnSelectIssues();
            break;
        case LitterBoxFeature.LLM_QUESTION:
        case LitterBoxFeature.QUESTIONS:
            // do nothing for now
            break;
        }
    };

    private readonly handleOnSelectIssues = () => {
        if (!this.state.litterBoxIssues) {
            this.fetchLitterBoxIssues();
        }
    };

    private readonly fetchLitterBoxIssues = () => {
        runLitterBoxAnalysis(this.props.vm.toJSON())
            .then(litterBoxIssues => {
                this.setState(prev => ({
                    ...prev,
                    litterBoxIssues
                }));
            })
            .catch(err => {
                console.log(err);
                this.setState(prev => ({
                    ...prev,
                    litterBoxIssues: []
                }));
            });
    };

    private readonly handleRecheckCodeQuality = () => {
        this.fetchLitterBoxIssues();
    };

    private readonly handleOnExplainIssue = (id: number) => {
        const relevantIssue = this.state.litterBoxIssues?.find(issue => issue.id === id);
        // eslint-disable-next-line no-undefined
        if (relevantIssue === undefined) {
            return;
        }

        explainIssue(this.props.vm.toJSON(), relevantIssue)
            .then(updatedIssue => {
                this.insertUpdatedIssue(updatedIssue);
            })
            .catch(err => {
                console.log(err);
            });
    };

    private readonly insertUpdatedIssue = (updatedIssue: LitterBoxHint) => {
        if (!this.state.litterBoxIssues) {
            return;
        }

        this.setState(prev => {
            const newIssues = prev.litterBoxIssues?.map(issue => {
                if (issue.id === updatedIssue.id) {
                    return updatedIssue;
                }

                return issue;
            });

            return ({
                litterBoxIssues: newIssues
            });
        });
    };

    private readonly handleSubmitLlmQuestion = (question: string) => {
        // todo(fein): actual implementation
        //  - fetch current sprite name
        //  - request to the API
        this.setState({
            llmResponse: `LLM response to question: ${question}`
        });
    };

    render () {
        return (
            <Box className={styles.main}>
                <div style={{maxWidth: '100px', marginRight: '0.5rem'}}>
                    <LitterBoxFeatureSelector
                        selectedFeature={this.state.selectedFeature}
                        onSelect={this.handleOnSelectFeature}
                    />
                </div>
                {
                    this.state.selectedFeature === LitterBoxFeature.ISSUES ?
                        <LitterBoxIssues
                            onCodeQualityRecheck={this.handleRecheckCodeQuality}
                            onExplainIssue={this.handleOnExplainIssue}
                            issues={this.state.litterBoxIssues ?? []}
                        /> :
                        null
                }
                {
                    this.state.selectedFeature === LitterBoxFeature.LLM_QUESTION ?
                        <LitterBoxLlmQuestionComponent
                            onSubmitQuestion={this.handleSubmitLlmQuestion}
                            llmResponse={this.state.llmResponse}
                        /> :
                        null
                }
            </Box>
        );
    }
}

export default LitterBoxPane;
