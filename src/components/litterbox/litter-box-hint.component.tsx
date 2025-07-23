import React from 'react';
import styles from './hints.css';
import sharedStyles from './shared.css';
import ScratchBlocksImageContainer from '../../containers/scratch-blocks-image.container.tsx';
import LlmWarningComponent from './llm-warning.component.tsx';

import scratchblocks from 'scratchblocks';
import {IssueType} from '../../containers/litterbox-web-api.ts';
import ReactMarkdown from 'react-markdown';

interface LitterBoxHintProps {
    id: number;
    title: string;
    sprite: string;
    issueType: IssueType;
    hintDescription: string;
    scratchBlocksCode: string;
    locale: string;
    onExplainIssue?: (issueId: number) => void;
    analysisIsForCurrentProject: boolean;
    onFixIssue?: (issueId: number) => void;
    onRevertFix?: () => void;
}

interface LitterBoxHintState {
    hintDescriptionHtml: string;
    llmDescription: string;
}

class LitterBoxHintComponent extends React.Component<LitterBoxHintProps, LitterBoxHintState> {
    state: LitterBoxHintState = {
        hintDescriptionHtml: '',
        llmDescription: ''
    };

    componentDidMount () {
        this.updateDescriptionHtml();
    }

    componentDidUpdate (
        prevProps: Readonly<LitterBoxHintProps>,
        prevState: Readonly<LitterBoxHintState>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _snapshot?: never
    ) {
        if (prevProps.hintDescription !== this.props.hintDescription) {
            this.updateDescriptionHtml();
        }
        if (prevState.hintDescriptionHtml !== this.state.hintDescriptionHtml) {
            this.triggerInlineScratchBlocksRender();
        }
    }

    private titleColor (): string {
        switch (this.props.issueType) {
        case 'BUG': return 'red';
        case 'SMELL': return 'orange';
        case 'PERFUME': return 'green';
        default: return 'black';
        }
    }

    private updateDescriptionHtml (): void {
        this.setState(() => {
            const [description, llmDescription] = this.litterBoxHintToHtml(this.props.hintDescription);
            return {
                hintDescriptionHtml: description,
                llmDescription: llmDescription
            };
        });
    }

    private triggerInlineScratchBlocksRender (): void {
        scratchblocks.renderMatching('code.b', {
            inline: true,
            style: 'scratch3',
            languages: [this.props.locale],
            scale: 0.5
        });
    }

    private litterBoxHintToHtml (hintText: string): [string, string] {
        const parts = hintText.split('[b]LLM Feedback:[/b]', 2);

        let text = parts[0].replace(/\[b]/g, '<strong>');
        text = text.replace(/\[\/b]/g, '</strong>');
        text = text.replace(/\[newLine]/g, '<br />');
        text = text.replace(/\[sbi]/g, '<code class="b">');
        text = text.replace(/\[\/sbi]/g, '</code>');
        text = text.replace(/\[var]/g, '<code class="b">(Variable "');
        text = text.replace(/\[\/var]/g, '")</code>');
        text = text.replace(/\[bc]/g, '<span className={styles.hintHighlightText}><b>');
        text = text.replace(/\[\/bc]/g, '</b></span>');
        text = text.replace(/LLM/g, 'GPT');

        let llmResponse = '';
        if (parts.length > 1) {
            llmResponse = `**GPT Feedback:** ${parts[1]}`.replace(/\[newLine]/g, '\n');
        }

        return [text, llmResponse];
    }

    private readonly handleExplainIssue = () => {
        if (this.props.onExplainIssue) {
            this.props.onExplainIssue(this.props.id);
        }
    };

    private readonly handleFixIssue = () => {
        if (this.props.onFixIssue) {
            this.props.onFixIssue(this.props.id);
        }
    };

    private readonly showExplainButton =
        () => this.props.onExplainIssue !== undefined && this.props.issueType !== 'PERFUME';

    private readonly showFixButton =
        () => this.props.onFixIssue !== undefined && this.props.issueType !== 'PERFUME';

    render () {
        return (
            <div className={styles.wrapperBox}>
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <div className={styles.sprite}>
                        <span>{this.props.sprite}</span>
                    </div>
                    <h3
                        className={styles.hintTitle}
                        style={{
                            color: this.titleColor()
                        }}
                    >
                        {this.props.title}
                    </h3>
                    {this.showExplainButton() ?
                        <div>
                            <button
                                className={sharedStyles.genericButton}
                                onClick={this.handleExplainIssue}
                            >
                                {'GPT: Explain!'}
                            </button>
                        </div> :
                        null
                    }
                    {this.showFixButton() ?
                        <div>
                            <button
                                className={sharedStyles.genericButton}
                                onClick={this.handleFixIssue}
                                disabled={!this.props.analysisIsForCurrentProject}
                                data-tip-disable={this.props.analysisIsForCurrentProject}
                                data-tip={'Check the program again first.'}
                            >
                                {'GPT: Fix!'}
                            </button>
                        </div> :
                        null
                    }
                    {this.props.onRevertFix ?
                        <div>
                            <button
                                className={sharedStyles.genericButton}
                                onClick={this.props.onRevertFix}
                            >
                                {'Revert Fix'}
                            </button>
                        </div> :
                        null
                    }
                    {this.showExplainButton() || this.showFixButton() ? <LlmWarningComponent /> : null}
                </div>
                <div style={{display: 'flex'}}>
                    <div className={styles.hintDescriptionBox}>
                        <div
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{__html: this.state.hintDescriptionHtml}}
                        />
                        {this.state.llmDescription.length > 0 ?
                            <ReactMarkdown>{this.state.llmDescription}</ReactMarkdown> :
                            null
                        }
                    </div>
                    <div className={styles.scratchBlocksBox}>
                        <ScratchBlocksImageContainer
                            scratchBlocksText={this.props.scratchBlocksCode}
                            locale={this.props.locale}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default LitterBoxHintComponent;
