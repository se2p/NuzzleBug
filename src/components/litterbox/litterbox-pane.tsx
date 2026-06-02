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
import logging from 'scratch-vm/src/util/logging.js';

interface LitterBoxPaneProps {
    llmEnabled: boolean,
    vm: ScratchVM,
    locale: string,
    onClose: () => void;
}

interface PreviousProject {
    /**
     * Project JSON
     */
    project: string;
    /**
     * Editing target ID
     */
    selectedSprite: string;
}

interface LitterBoxPaneState {
    selectedFeature: LitterBoxFeature;
    litterBoxIssues: LitterBoxHint[] | undefined;
    llmResponse: string | undefined;
    analysisIsForCurrentProject: boolean;
    previousProject: PreviousProject | undefined;
}

class LitterBoxPane extends React.Component<LitterBoxPaneProps, LitterBoxPaneState> {

    state: LitterBoxPaneState = {
        selectedFeature: LitterBoxFeature.ISSUES,
        litterBoxIssues: undefined,
        llmResponse: undefined,
        analysisIsForCurrentProject: true,
        previousProject: undefined
    };

    componentDidMount() {
        logging.logClickEvent('ICON', new Date(), 'LB_OPEN', null);
        this.fetchLitterBoxIssues();
    }

    componentWillUnmount() {
        logging.logClickEvent('ICON', new Date(), 'LB_CLOSE', null);
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
        runLitterBoxAnalysis(this.props.vm.toJSON(), this.props.locale, 'bugs,smells,perfumes')
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
        logging.logClickEvent('BUTTON', new Date(), 'LB_CHECK_AGAIN', null);
        this.fetchLitterBoxIssues();
    };

    private readonly handleOnExplainIssue = (id: number) => {
        logging.logClickEvent('BUTTON', new Date(), 'LB_GPT_EXPLAIN', null);
        const relevantIssue = this.findIssue(id);
        if (relevantIssue === undefined) {
            return;
        }

        explainIssue(this.props.vm.toJSON(), relevantIssue, this.props.locale)
            .then(updatedIssue => {
                const logMsg = {
                    relevantIssue: relevantIssue,
                    updatedIssue: updatedIssue
                };
                this.handleQuestionLog(logMsg, `Explain_${relevantIssue.name}`);
                this.insertUpdatedIssue(updatedIssue);
            })
            .catch(err => {
                const logMsg = {
                    relevantIssue: relevantIssue,
                    err: err

                };
                this.handleQuestionLog(logMsg, `Explain_Error_${relevantIssue.name}`);
                console.log(err);
            });
    };

    private handleQuestionLog (logMsg: any, purpose: string) {
        logging.logJsonEvent(`LLM_${purpose}.json`, 'LITTERBOX', 'LLM', logMsg, new Date());
    }

    private readonly handleOnFixIssue = (id: number) => {
        logging.logClickEvent('BUTTON', new Date(), 'LB_GPT_FIX', null);
        const relevantIssue = this.findIssue(id);
        if (relevantIssue === undefined) {
            return;
        }

        fixIssue(this.props.vm.toJSON(), relevantIssue, this.props.locale)
            .then(async response => {
                const logMsg = {
                    relevantIssue: relevantIssue,
                    response: response
                };
                this.handleQuestionLog(logMsg, `Fix_${relevantIssue.name}`);

                const previousProject = {
                    project: this.props.vm.toJSON(),
                    selectedSprite: this.props.vm.editingTarget.id
                };
                this.setState({
                    previousProject: previousProject,
                    analysisIsForCurrentProject: false
                });
                await this.props.vm.loadProject(response.fixedProgram);
                return this.props.vm.setEditingTarget(previousProject.selectedSprite);
            })
            .catch(err => {
                const logMsg = {
                    relevantIssue: relevantIssue,
                    err: err

                };
                this.handleQuestionLog(logMsg, `Fix_Error_${relevantIssue.name}`);
                console.log(err);
            });
    };

    private readonly handleOnRevertFix = () => {
        logging.logClickEvent('BUTTON', new Date(), 'LB_REVERT_FIX', null);
        if (this.state.previousProject === undefined) {
            return;
        }

        const prevProject = this.state.previousProject;

        this.props.vm.loadProject(prevProject.project)
            .then(() => {
                this.props.vm.setEditingTarget(prevProject.selectedSprite);

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

        askQuestion(this.props.vm.toJSON(), question, this.props.locale, spriteName)
            .then(response => {
                const logMsg = {
                    question: question,
                    spriteOnly: spriteOnly,
                    response: response

                };
                this.handleQuestionLog(logMsg, `Question`);
                this.setState({
                    llmResponse: response
                });
            })
            .catch(err => {
                const logMsg = {
                    question: question,
                    spriteOnly: spriteOnly,
                    err: err.message

                };
                this.handleQuestionLog(logMsg, `Question_Error`);
                console.log(err);
            });
    };

    render() {
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
                            onRevertFix={this.state.previousProject ? this.handleOnRevertFix : undefined}
                            analysisIsForCurrentProject={this.state.analysisIsForCurrentProject}
                            issues={this.state.litterBoxIssues ?? []}
                            locale={this.props.locale}
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
