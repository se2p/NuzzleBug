import React from 'react';

import {LitterBoxHint, IssueType} from '../../containers/litterbox-web-api.ts';
import LitterBoxHintComponent from './litter-box-hint.component.tsx';
import styles from './litterbox-pane.css';
import IssueTypeSelectorComponent from './issue-type-selector.component.tsx';

interface LitterBoxIssuesProps {
    onCodeQualityRecheck: () => void;
    onExplainIssue: (id: number) => void;
    onFixIssue: (id: number) => void;
    issues: LitterBoxHint[];
}

interface LitterBoxIssuesState {
    index: number;
    selectedType: IssueType;
    selectedIssue: LitterBoxHint | undefined;
}

class LitterBoxIssues extends React.Component<LitterBoxIssuesProps, LitterBoxIssuesState> {
    state: LitterBoxIssuesState = {
        index: 0,
        selectedType: 'SMELL',
        // eslint-disable-next-line no-undefined
        selectedIssue: undefined
    };

    componentDidMount () {
        this.resetSelection();
    }

    componentDidUpdate (
        prevProps: Readonly<LitterBoxIssuesProps>, prevState: Readonly<LitterBoxIssuesState>, _snapshot?: never
    ) {
        if (prevProps.issues !== this.props.issues) {
            this.resetSelection();
        }
        if (prevState.index !== this.state.index || prevState.selectedType !== this.state.selectedType) {
            this.updateSelectedIssue();
        }
    }

    private readonly resetSelection = () => {
        this.setState(prev => {
            const findNewIssue = () => {
                // select a category that contains issues
                const issueCounts = this.issueCounts();
                const issueTypes: IssueType[] = ['BUG', 'SMELL', 'PERFUME'];
                const selectedIssueType = issueTypes.filter(t => (issueCounts.get(t) ?? 0) > 0).pop() ?? 'BUG';
                const selectedIssue = this.issuesForType(selectedIssueType).at(0);

                return {
                    index: 0,
                    selectedType: selectedIssueType,
                    selectedIssue: selectedIssue
                };
            };

            if (prev.selectedIssue) {
                const issueType = prev.selectedIssue.type;
                const issuesForType = this.issuesForType(issueType);
                if (issuesForType.length === 0) {
                    return findNewIssue();
                }

                const index = Math.max(issuesForType.findIndex(issue => issue.id === prev.selectedIssue?.id), 0);
                const issue = issuesForType.at(0);

                return {
                    index,
                    selectedType: issueType,
                    selectedIssue: issue
                };
            }

            return findNewIssue();
        });
    };

    private readonly updateSelectedIssue = () => {
        this.setState(prev => {
            const issuesForType = this.issuesForType(prev.selectedType);

            if (issuesForType.length === 0) {
                return {
                    index: prev.index,
                    selectedIssue: undefined
                };
            }

            const index = (prev.index + issuesForType.length) % issuesForType.length;
            const selectedIssue = issuesForType[index];

            return {
                index,
                selectedIssue
            };
        });
    };

    private readonly issuesForType =
        (type: IssueType): LitterBoxHint[] => this.props.issues.filter(issue => issue.type === type);

    private readonly handleButtonLeftClick = () => {
        this.setState(prev => ({
            index: prev.index - 1
        }));
    };

    private readonly handleButtonRightClick = () => {
        this.setState(prev => ({
            index: prev.index + 1
        }));
    };

    private readonly handleIssueTypeSelect = (type: IssueType) => {
        this.setState(() => ({
            selectedType: type
        }));
    };

    private readonly issueCounts = (): Map<IssueType, number> => {
        const result = new Map();

        result.set('BUG', this.issuesForType('BUG').length);
        result.set('SMELL', this.issuesForType('SMELL').length);
        result.set('PERFUME', this.issuesForType('PERFUME').length);

        return result;
    };

    render () {
        return (
            <>
                <div className={styles.tdFlexbox}>
                    <button onClick={this.props.onCodeQualityRecheck}>
                        {'Check Again!'}
                    </button>
                    <IssueTypeSelectorComponent
                        selectedType={this.state.selectedType}
                        onSelect={this.handleIssueTypeSelect}
                        issueCounts={this.issueCounts()}
                    />
                </div>
                {this.state.selectedIssue ?
                    <div className={styles.ltrFlexbox}>
                        <button
                            className={styles.issueSwitchButton}
                            onClick={this.handleButtonLeftClick}
                        >
                            <span>{'<'}</span>
                        </button>
                        <div style={{width: '720px', marginTop: 0, marginBottom: 'auto'}}>
                            <LitterBoxHintComponent
                                key={this.state.selectedIssue.id}
                                id={this.state.selectedIssue.id}
                                title={this.state.selectedIssue.translatedFinderName}
                                sprite={this.state.selectedIssue.sprite}
                                issueType={this.state.selectedIssue.type}
                                hintDescription={this.state.selectedIssue.hint}
                                scratchBlocksCode={this.state.selectedIssue.scratchBlocksCode}
                                locale={'en'}
                                onExplainIssue={this.props.onExplainIssue}
                                onFixIssue={this.props.onFixIssue}
                            />
                        </div>
                        <button
                            className={styles.issueSwitchButton}
                            onClick={this.handleButtonRightClick}
                        >
                            <span>{'>'}</span>
                        </button>
                    </div> :
                    null
                }
            </>
        );
    }
}

export default LitterBoxIssues;
