import React from 'react';

import {LitterBoxQuestion} from '../../containers/litterbox-web-api.ts';
import ScratchBlocksImageContainer from '../../containers/scratch-blocks-image.container.tsx';
import styles from './hints.css';

interface LitterBoxQuestionProps {
    question: LitterBoxQuestion;
    index: number;
    total: number;
    locale: string;
}

interface LitterBoxQuestionState {
    questionTextHtml: string;
}

class LitterBoxQuestionComponent extends React.Component<LitterBoxQuestionProps, LitterBoxQuestionState> {
    state: LitterBoxQuestionState = {
        questionTextHtml: ''
    };

    componentDidMount () {
        this.updateQuestionTextHtml();
    }

    componentDidUpdate (prevProps: Readonly<LitterBoxQuestionProps>) {
        if (prevProps.question !== this.props.question) {
            this.updateQuestionTextHtml();
        }
    }

    private updateQuestionTextHtml (): void {
        this.setState({questionTextHtml: this.toHtml(this.props.question.questionText)});
    }

    private toHtml (text: string | undefined): string {
        if (!text) return '';
        let html = text.replace(/\[b]/g, '<strong>');
        html = html.replace(/\[\/b]/g, '</strong>');
        html = html.replace(/\[newLine]/g, '<br />');
        html = html.replace(/\[sbi]/g, '<code class="b">');
        html = html.replace(/\[\/sbi]/g, '</code>');
        html = html.replace(/\[var]/g, '<code class="b">(Variable "');
        html = html.replace(/\[\/var]/g, '")</code>');
        html = html.replace(/\[bc]/g, '<span className={styles.hintHighlightText}><b>');
        html = html.replace(/\[\/bc]/g, '</b></span>');
        return html;
    }

    private titleColor (): string {
        switch (this.props.question.type) {
        case 'MULTIPLE_CHOICE': return 'dodgerblue';
        case 'YES_NO': return 'green';
        case 'NUMBER': return 'orange';
        case 'FREE_TEXT': return 'gray';
        default: return 'black';
        }
    }

    render () {
        const {question, index, total} = this.props;

        return (
            <div className={styles.wrapperBox}>
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <div className={styles.sprite}>
                        <span>{question.sprite}</span>
                    </div>
                    <h3
                        className={styles.hintTitle}
                        style={{color: this.titleColor()}}
                    >
                        {question.translatedFinderName}
                    </h3>
                    <span style={{whiteSpace: 'nowrap'}}>
                        {`${index + 1} / ${total}`}
                    </span>
                </div>
                <div style={{display: 'flex'}}>
                    <div className={styles.hintDescriptionBox}>
                        <div
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{__html: this.state.questionTextHtml}}
                        />
                        {question.choices && question.choices.length > 0 &&
                            <ol>
                                {question.choices.map((choice, i) => (
                                    <li key={i}>{choice}</li>
                                ))}
                            </ol>
                        }
                    </div>
                    <div className={styles.scratchBlocksBox}>
                        <ScratchBlocksImageContainer
                            scratchBlocksText={question.scratchBlocksCode}
                            locale={this.props.locale}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default LitterBoxQuestionComponent;
