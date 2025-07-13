import React from 'react';
import ReactMarkdown from 'react-markdown';

import styles from './litterbox-pane.css';

interface LitterBoxLlmQuestionProps {
    onSubmitQuestion: (question: string, spriteOnly: boolean) => void;
    llmResponse?: string;
}

interface LitterBoxLlmQuestionState {
    question?: string;
}

class LitterBoxLlmQuestionComponent extends React.Component<LitterBoxLlmQuestionProps, LitterBoxLlmQuestionState> {

    state: LitterBoxLlmQuestionState = {
        question: undefined
    };

    private readonly handleQuestion = (event: React.SyntheticEvent, spriteOnly: boolean) => {
        if (this.state.question) {
            this.props.onSubmitQuestion(this.state.question, spriteOnly);
        }
        event.preventDefault();
    };

    private readonly handleSubmitQuestion = (event: React.SyntheticEvent) => {
        this.handleQuestion(event, false);
    };

    private readonly handleSubmitSpriteQuestion = (event: React.SyntheticEvent) => {
        this.handleQuestion(event, true);
    };

    private readonly handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            question: event.target.value
        });
    };

    render () {
        return (
            <div>
                <form>
                    <div className={styles.ltrFlexbox}>
                        <textarea
                            name="question"
                            placeholder={'Your question to GPT about the program'}
                            value={this.state.question}
                            onChange={this.handleInputChange}
                        />
                        <div className={styles.tdFlexbox}>
                            <button onClick={this.handleSubmitQuestion}>
                                {'Ask question about whole program'}
                            </button>
                            <button onClick={this.handleSubmitSpriteQuestion}>
                                {'Ask question about only the current sprite'}
                            </button>
                        </div>
                    </div>
                </form>
                <div>
                    {this.props.llmResponse ?
                        <ReactMarkdown>{this.props.llmResponse}</ReactMarkdown> :
                        null
                    }
                </div>
            </div>
        );
    }
}

export default LitterBoxLlmQuestionComponent;
