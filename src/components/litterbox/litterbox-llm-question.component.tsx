import React from 'react';

import styles from './litterbox-pane.css';

interface LitterBoxLlmQuestionProps {
    onSubmitQuestion: (question: string) => void;
    llmResponse?: string;
}

interface LitterBoxLlmQuestionState {
    question?: string;
}

class LitterBoxLlmQuestionComponent extends React.Component<LitterBoxLlmQuestionProps, LitterBoxLlmQuestionState> {

    state: LitterBoxLlmQuestionState = {
        question: undefined
    };

    private readonly handleSubmitQuestion = (event: React.SyntheticEvent) => {
        if (this.state.question) {
            this.props.onSubmitQuestion(this.state.question);
        }
        event.preventDefault();
    };

    private readonly handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            question: event.target.value
        });
    };

    render () {
        return (
            <div>
                <form onSubmit={this.handleSubmitQuestion}>
                    <div className={styles.ltrFlexbox}>
                        <textarea
                            name="question"
                            placeholder={'Your question to GPT about the program'}
                            value={this.state.question}
                            onChange={this.handleInputChange}
                        />
                        <button type="submit">{'Send'}</button>
                    </div>
                </form>
                <div>
                    {this.props.llmResponse}
                </div>
            </div>
        );
    }
}

export default LitterBoxLlmQuestionComponent;
