import React from 'react';

import Box from '../box/box.jsx';
import styles from './litterbox-pane.css';
import LitterBoxIssues from './litterbox-issues.tsx';
import LitterBoxFeatureSelector, {LitterBoxFeature} from './litterbox-choice.tsx';
import ScratchVM from 'scratch-vm';
import {
    askQuestion,
    explainIssue,
    fixIssue,
    LitterBoxHint,
    runLitterBoxAnalysis
} from '../../containers/litterbox-web-api.ts';
import LitterBoxLlmQuestionComponent from './litterbox-llm-question.component.tsx';

interface LitterBoxPaneProps {
    llmEnabled: boolean,
    vm: ScratchVM,
    onClose: () => void;
}

interface LitterBoxPaneState {
    selectedFeature: LitterBoxFeature;
    litterBoxIssues: LitterBoxHint[] | undefined;
    llmResponse: string | undefined;
    analysisIsForCurrentProject: boolean;
    previousProject: string | undefined;
}

class LitterBoxPane extends React.Component<LitterBoxPaneProps, LitterBoxPaneState> {

    state: LitterBoxPaneState = {
        selectedFeature: LitterBoxFeature.ISSUES,
        litterBoxIssues: undefined,
        llmResponse: undefined,
        analysisIsForCurrentProject: true,
        previousProject: undefined
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
                this.setState({
                    litterBoxIssues,
                    analysisIsForCurrentProject: true
                });
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    litterBoxIssues: [],
                    analysisIsForCurrentProject: true
                });
            });
    };

    private readonly handleRecheckCodeQuality = () => {
        this.fetchLitterBoxIssues();
    };

    private readonly handleOnExplainIssue = (id: number) => {
        const relevantIssue = this.findIssue(id);
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

    private readonly handleOnFixIssue = (id: number) => {
        const relevantIssue = this.findIssue(id);
        if (relevantIssue === undefined) {
            return;
        }

        fixIssue(this.props.vm.toJSON(), relevantIssue)
            .then(response => {
                const previousProject = this.props.vm.toJSON();
                this.setState({
                    previousProject: previousProject,
                    analysisIsForCurrentProject: false
                });
                return this.props.vm.loadProject(response.fixedProgram);
            })
            .catch(err => {
                console.log(err);
            });
    };

    private readonly handleOnRevertFix = () => {
        if (this.state.previousProject === undefined) {
            return;
        }

        this.props.vm.loadProject(this.state.previousProject)
            .then(() => {
                this.setState({
                    previousProject: undefined
                });
            });
    };

    private readonly findIssue = (id: number): LitterBoxHint | undefined =>
        this.state.litterBoxIssues?.find(issue => issue.id === id);

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

    private readonly handleSubmitLlmQuestion = (question: string, spriteOnly: boolean) => {
        const spriteName = spriteOnly ? this.props.vm.editingTarget.getName() : undefined;

        askQuestion(this.props.vm.toJSON(), question, spriteName)
            .then(response => {
                this.setState({
                    llmResponse: response
                });
            })
            .catch(err => console.log(err));
    };

    render () {
        return (
            <Box className={styles.main}>
                <div style={{maxWidth: '100px', marginRight: '0.5rem'}}>
                    <LitterBoxFeatureSelector
                        selectedFeature={this.state.selectedFeature}
                        onSelect={this.handleOnSelectFeature}
                        onClose={this.props.onClose}
                    />
                </div>
                {
                    this.state.selectedFeature === LitterBoxFeature.ISSUES ?
                        <LitterBoxIssues
                            onCodeQualityRecheck={this.handleRecheckCodeQuality}
                            onExplainIssue={this.props.llmEnabled ? this.handleOnExplainIssue : undefined}
                            onFixIssue={this.props.llmEnabled ? this.handleOnFixIssue : undefined}
                            onRevertFix={
                                this.state.previousProject && !this.state.analysisIsForCurrentProject ?
                                    this.handleOnRevertFix :
                                    undefined
                            }
                            analysisIsForCurrentProject={this.state.analysisIsForCurrentProject}
                            issues={this.state.litterBoxIssues ?? []}
                        /> :
                        null
                }
                {
                    this.state.selectedFeature === LitterBoxFeature.LLM_QUESTION && this.props.llmEnabled ?
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
