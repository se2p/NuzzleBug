import React from 'react';
import styles from './hints.css';
import ScratchBlocksImageContainer from '../../containers/scratch-blocks-image.container.tsx';
import LlmWarningComponent from "./llm-warning.component.tsx";

import scratchblocks from 'scratchblocks';
import {IssueType} from '../../containers/litterbox-web-api.ts';

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
}

class LitterBoxHintComponent extends React.Component<LitterBoxHintProps, LitterBoxHintState> {
    state: LitterBoxHintState = {
        hintDescriptionHtml: ''
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
        this.setState(prev => ({
            ...prev,
            hintDescriptionHtml: this.litterBoxHintToHtml(this.props.hintDescription)
        }));
    }

    private triggerInlineScratchBlocksRender (): void {
        scratchblocks.renderMatching('code.b', {
            inline: true,
            style: 'scratch3',
            languages: [this.props.locale],
            scale: 0.5
        });
    }

    private litterBoxHintToHtml (hintText: string): string {
        let text = hintText.replace(/\[b]/g, '<strong>');
        text = text.replace(/\[\/b]/g, '</strong>');
        text = text.replace(/\[newLine]/g, '<br />');
        text = text.replace(/\[sbi]/g, '<code class="b">');
        text = text.replace(/\[\/sbi]/g, '</code>');
        text = text.replace(/\[var]/g, '<code class="b">(Variable "');
        text = text.replace(/\[\/var]/g, '")</code>');
        text = text.replace(/\[bc]/g, '<span className={styles.hintHighlightText}><b>');
        text = text.replace(/\[\/bc]/g, '</b></span>');
        text = text.replace(/LLM/g, 'GPT');
        return text;
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
                    {this.props.onExplainIssue ?
                        <div>
                            <button onClick={this.handleExplainIssue}>{'GPT: Explain!'}</button>
                        </div> :
                        null
                    }
                    {this.props.onFixIssue ?
                        <div>
                            {/* todo(fein): needs a tooltip to explain why it is disabled */}
                            <button
                                onClick={this.handleFixIssue}
                                disabled={!this.props.analysisIsForCurrentProject}
                            >
                                {'GPT: Fix!'}
                            </button>
                        </div> :
                        null
                    }
                    {this.props.onRevertFix ?
                        <div>
                            <button
                                onClick={this.props.onRevertFix}
                            >
                                {'Revert Fix'}
                            </button>
                        </div> :
                        null
                    }
                    {this.props.onExplainIssue ? <LlmWarningComponent /> : null}
                </div>
                <div style={{display: 'flex'}}>
                    <div
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{__html: this.state.hintDescriptionHtml}}
                        className={styles.hintDescriptionBox}
                    />
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
