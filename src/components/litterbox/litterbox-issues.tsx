import React from 'react';

import {LitterBoxHint, IssueType} from '../../containers/litterbox-web-api.ts';
import LitterBoxHintComponent from './litter-box-hint.component.tsx';

interface LitterBoxIssuesProps {
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

    componentDidUpdate (
        prevProps: Readonly<LitterBoxIssuesProps>, prevState: Readonly<LitterBoxIssuesState>, _snapshot?: never
    ) {
        if (prevProps.issues !== this.props.issues) {
            this.resetIndex();
            this.updateSelectedIssue();
        }
        if (prevState.index !== this.state.index || prevState.selectedType !== this.state.selectedType) {
            this.updateSelectedIssue();
        }
    }

    private readonly resetIndex = () => {
        this.setState(() => ({
            index: 0
        }));
    };

    private readonly updateSelectedIssue = () => {
        this.setState(prev => {
            const issuesForType = this.props.issues.filter(issue => issue.type === prev.selectedType);

            if (issuesForType.length === 0) {
                return {
                    index: prev.index,
                    // eslint-disable-next-line no-undefined
                    selectedIssue: undefined
                };
            }

            const index = prev.index % issuesForType.length;
            const selectedIssue = issuesForType[index];

            return {
                index,
                selectedIssue
            };
        });
    };

    render () {
        return (
            <>
                {this.state.selectedIssue ?
                    <LitterBoxHintComponent
                        key={this.state.selectedIssue.id}
                        title={this.state.selectedIssue.translatedFinderName}
                        sprite={this.state.selectedIssue.sprite}
                        issueType={this.state.selectedIssue.type}
                        hintDescription={this.state.selectedIssue.hint}
                        scratchBlocksCode={this.state.selectedIssue.scratchBlocksCode}
                        locale={'en'}
                    /> :
                    null
                }
            </>
        );
    }
}

export default LitterBoxIssues;
