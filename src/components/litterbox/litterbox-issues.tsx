import React from 'react';

import {LitterBoxHint, IssueType} from '../../containers/litterbox-web-api.ts';
import LitterBoxHintComponent from './litter-box-hint.component.tsx';
import styles from './litterbox-pane.css';

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
            const issuesForType = this.issuesForType(prev.selectedType);

            if (issuesForType.length === 0) {
                return {
                    index: prev.index,
                    // eslint-disable-next-line no-undefined
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

    render () {
        return (
            <>
                {this.state.selectedIssue ?
                    <div className={styles.ltrFlexbox}>
                        <button
                            className={styles.issueSwitchButton}
                            onClick={this.handleButtonLeftClick}
                        >
                            {'<'}
                        </button>
                        <div style={{width: '560px'}}>
                            <LitterBoxHintComponent
                                key={this.state.selectedIssue.id}
                                title={this.state.selectedIssue.translatedFinderName}
                                sprite={this.state.selectedIssue.sprite}
                                issueType={this.state.selectedIssue.type}
                                hintDescription={this.state.selectedIssue.hint}
                                scratchBlocksCode={this.state.selectedIssue.scratchBlocksCode}
                                locale={'en'}
                            />
                        </div>
                        <button
                            className={styles.issueSwitchButton}
                            onClick={this.handleButtonRightClick}
                        >
                            {'>'}
                        </button>
                    </div> :
                    null
                }
            </>
        );
    }
}

export default LitterBoxIssues;
