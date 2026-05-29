import React from 'react';
import {FormattedMessage} from 'react-intl';

import {LitterBoxQuestion} from '../../containers/litterbox-web-api.ts';
import LitterBoxQuestionComponent from './litter-box-question.component.tsx';
import styles from './litterbox-pane.css';
import sharedStyles from './shared.css';

interface LitterBoxQuestionsProps {
    questions: LitterBoxQuestion[];
    onRecheck: () => void;
}

interface LitterBoxQuestionsState {
    index: number;
}

class LitterBoxQuestionsComponent extends React.Component<LitterBoxQuestionsProps, LitterBoxQuestionsState> {
    state: LitterBoxQuestionsState = {
        index: 0
    };

    componentDidUpdate (prevProps: Readonly<LitterBoxQuestionsProps>) {
        if (prevProps.questions !== this.props.questions) {
            this.setState({index: 0});
        }
    }

    private readonly currentIndex = (): number => {
        const {questions} = this.props;
        if (questions.length === 0) return 0;
        return (this.state.index + questions.length) % questions.length;
    };

    private readonly handlePrev = () => {
        this.setState(prev => ({index: prev.index - 1}));
    };

    private readonly handleNext = () => {
        this.setState(prev => ({index: prev.index + 1}));
    };

    render () {
        const {questions, onRecheck} = this.props;
        const index = this.currentIndex();
        const question = questions.length > 0 ? questions[index] : undefined;

        return (
            <>
                <div className={styles.tdFlexbox}>
                    <button
                        className={sharedStyles.genericButton}
                        onClick={onRecheck}
                    >
                        <FormattedMessage
                            id={'gui.litterBox.question.checkAgain'}
                            defaultMessage={'Check Again!'}
                        />
                    </button>
                </div>
                {question ?
                    <div className={styles.ltrFlexbox}>
                        <button
                            className={`${sharedStyles.genericButton} ${styles.issueSwitchButton}`}
                            onClick={this.handlePrev}
                        >
                            <span>{'<'}</span>
                        </button>
                        <div style={{width: '720px', marginTop: 0, marginBottom: 'auto'}}>
                            <LitterBoxQuestionComponent
                                key={question.id}
                                question={question}
                                index={index}
                                total={questions.length}
                            />
                        </div>
                        <button
                            className={`${sharedStyles.genericButton} ${styles.issueSwitchButton}`}
                            onClick={this.handleNext}
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

export default LitterBoxQuestionsComponent;
