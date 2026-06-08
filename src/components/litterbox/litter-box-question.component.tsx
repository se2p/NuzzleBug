import React from 'react';

import {LitterBoxQuestion} from '../../containers/litterbox-web-api.ts';
import ScratchBlocksImageContainer from '../../containers/scratch-blocks-image.container.tsx';
import styles from './hints.css';
import questionStyles from './litter-box-question.css';
import sharedStyles from './shared.css';
import scratchblocks from 'scratchblocks';
import {FormattedMessage} from 'react-intl';
import logging from 'scratch-vm/src/util/logging.js';

interface LitterBoxQuestionProps {
    question: LitterBoxQuestion;
    index: number;
    total: number;
    locale: string;
}

interface LitterBoxQuestionState {
    questionTextHtml: string;
    selectedChoices: string[];
    inputValue: string;
    feedback: 'correct' | 'incorrect' | 'manual' | null;
}

class LitterBoxQuestionComponent extends React.Component<LitterBoxQuestionProps, LitterBoxQuestionState> {
    state: LitterBoxQuestionState = {
        questionTextHtml: '',
        selectedChoices: [],
        inputValue: '',
        feedback: null
    };

    componentDidMount () {
        this.updateQuestionTextHtml();
    }

    componentDidUpdate (
        prevProps: Readonly<LitterBoxQuestionProps>,
        prevState: Readonly<LitterBoxQuestionState>
    ) {
        if (prevProps.question !== this.props.question) {
            this.updateQuestionTextHtml();
            this.setState({selectedChoices: [], inputValue: '', feedback: null});
        }
        if (prevState.questionTextHtml !== this.state.questionTextHtml) {
            this.triggerInlineScratchBlocksRender();
        }
    }

    private updateQuestionTextHtml (): void {
        this.setState({questionTextHtml: this.toHtml(this.props.question.questionText)});
    }

    private triggerInlineScratchBlocksRender (): void {
        scratchblocks.renderMatching('code.b', {
            inline: true,
            style: 'scratch3',
            languages: [this.props.locale],
            scale: 0.5
        });
    }

    private translateBlockText (blockText: string): string {
        if (this.props.locale === 'en') {
            return blockText;
        }
        try {
            const lang = scratchblocks.allLanguages[this.props.locale];
            if (!lang) {
                return blockText;
            }
            const block = scratchblocks.parse(blockText, {languages: ['en', this.props.locale]});
            block.translate(lang);
            return block.stringify();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_ignored) {
            return blockText;
        }
    }

    private toHtml (text: string | undefined): string {
        if (!text) return '';
        let html = text.replace(/\[b]/g, '<strong>');
        html = html.replace(/\[\/b]/g, '</strong>');
        html = html.replace(/\[newLine]/g, '<br />');
        html = html.replace(/\[sbi]([\s\S]*?)\[\/sbi]/g, (_, blockCode) => {
            const translated = this.translateBlockText(blockCode.trim());
            const escaped = translated.replace(/&/g, '&amp;').replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            return `<code class="b">${escaped}</code>`;
        });
        html = html.replace(/\[var]/g, '<code class="b">(Variable "');
        html = html.replace(/\[\/var]/g, '")</code>');
        html = html.replace(/\[bc]/g, '<span className={styles.hintHighlightText}><b>');
        html = html.replace(/\[\/bc]/g, '</b></span>');
        return html;
    }

    private titleColor (): string {
        switch (this.props.question.type) {
        case 'MULTIPLE_CHOICE':
            return 'dodgerblue';
        case 'YES_NO':
            return 'green';
        case 'NUMBER':
            return 'orange';
        case 'FREE_TEXT':
            return 'gray';
        default:
            return 'black';
        }
    }

    private readonly handleSelectChoice = (choice: string, multiSelect = false) => {
        if (this.state.feedback !== null) return;
        if (multiSelect) {
            const {selectedChoices} = this.state;
            if (selectedChoices.includes(choice)) {
                this.setState({selectedChoices: selectedChoices.filter(c => c !== choice)});
            } else {
                this.setState({selectedChoices: [...selectedChoices, choice]});
            }
        } else {
            this.setState({selectedChoices: [choice]});
        }
    };

    private readonly handleCheckAnswer = () => {
        if (logging.isActive()) {
            logging.logClickEvent('BUTTON', new Date(), 'LB_CHECK_ANSWER', null);
        }
        const {question} = this.props;
        const {selectedChoices, inputValue} = this.state;
        const correctAnswers = question.correctAnswers || [];

        if (question.type === 'FREE_TEXT' && correctAnswers.length === 0) {
            this.setState({feedback: 'manual'});
            return;
        }

        if (correctAnswers.length === 0) return;

        let isCorrect = false;
        let givenAnswer: string | null = null;

        if (question.type === 'MULTIPLE_CHOICE') {
            if (selectedChoices.length === 0) return;
            givenAnswer = selectedChoices.join(', ');
            isCorrect = correctAnswers.length === selectedChoices.length &&
                correctAnswers.every(a => selectedChoices.some(s => s.toLowerCase() === a.toLowerCase()));
        } else if (question.type === 'YES_NO') {
            if (selectedChoices.length === 0) return;
            givenAnswer = selectedChoices[0];
            isCorrect = correctAnswers.some(a => a.toLowerCase() === selectedChoices[0].toLowerCase());
        } else if (question.type === 'NUMBER') {
            const userNum = Number.parseFloat(inputValue);
            if (Number.isNaN(userNum)) return;
            givenAnswer = inputValue;
            isCorrect = correctAnswers.some(a => Number.parseFloat(a) === userNum);
        } else if (question.type === 'FREE_TEXT') {
            if (!inputValue.trim()) return;
            givenAnswer = inputValue;
            isCorrect = correctAnswers.some(a => a.toLowerCase() === inputValue.trim().toLowerCase());
        }

        const logMsg = {
            question: question,
            givenAnswer: givenAnswer,
            correctAnswer: correctAnswers
        };
        this.handleQuestionLog(logMsg, `Answer_${question.name}`);
        this.setState({feedback: isCorrect ? 'correct' : 'incorrect'});
    };

    private handleQuestionLog (logMsg: any, purpose: string) {
        if (logging.isActive()) {
            logging.logJsonEvent(`LitterBox_QLC_${purpose}.json`, 'LITTERBOX', 'QUESTION', logMsg, new Date());
        }
    }

    private renderChoiceOptions (): React.ReactNode {
        const {question} = this.props;
        const {selectedChoices, feedback} = this.state;
        const choices = question.choices || [];
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        return (
            <div className={questionStyles.answerOptions}>
                {choices.map((choice, i) => {
                    const isSelected = selectedChoices.includes(choice);
                    const isCorrect = (question.correctAnswers || []).some(
                        a => a.toLowerCase() === choice.toLowerCase()
                    );
                    const className = [
                        questionStyles.answerOption,
                        isSelected ? questionStyles.selected : '',
                        feedback !== null && isCorrect ? questionStyles.correct : '',
                        feedback !== null && isSelected && !isCorrect ? questionStyles.incorrect : ''
                    ].filter(Boolean).join(' ');

                    return (
                        <button
                            key={choice}
                            className={className}
                            onClick={() => this.handleSelectChoice(choice, true)}
                        >
                            <span className={questionStyles.optionLetter}>{letters[i]}</span>
                            {/* eslint-disable-next-line react/no-danger */}
                            <span dangerouslySetInnerHTML={{__html: this.toHtml(choice)}} />
                        </button>
                    );
                })}
            </div>
        );
    }

    private renderYesNoOptions (): React.ReactNode {
        const {question} = this.props;
        const {selectedChoices, feedback} = this.state;
        const hasCustomChoices = !!(question.choices?.length);
        const choices: string[] = question.choices?.length ? question.choices : ['Yes', 'No'];
        const yesNoLabels = [
            <FormattedMessage
                key={'yes'}
                id="gui.litterBox.question.yes"
                defaultMessage="Yes"
            />,
            <FormattedMessage
                key={'no'}
                id="gui.litterBox.question.no"
                defaultMessage="No"
            />
        ];

        return (
            <div className={questionStyles.answerOptions}>
                {choices.map((choice, i) => {
                    const isSelected = selectedChoices[0] === choice;
                    const isCorrect = (question.correctAnswers || []).some(
                        a => a.toLowerCase() === choice.toLowerCase()
                    );
                    const className = [
                        questionStyles.answerOption,
                        isSelected ? questionStyles.selected : '',
                        feedback !== null && isCorrect ? questionStyles.correct : '',
                        feedback !== null && isSelected && !isCorrect ? questionStyles.incorrect : ''
                    ].filter(Boolean).join(' ');

                    return (
                        <button
                            key={choice}
                            className={className}
                            onClick={() => this.handleSelectChoice(choice)}
                        >
                            {hasCustomChoices ?
                                // eslint-disable-next-line react/no-danger
                                <span dangerouslySetInnerHTML={{__html: this.toHtml(choice)}} /> :
                                <span>{yesNoLabels[i]}</span>
                            }
                        </button>
                    );
                })}
            </div>
        );
    }

    private renderTextInput (type: 'text' | 'number'): React.ReactNode {
        return (
            <input
                type={type}
                className={questionStyles.freeTextInput}
                value={this.state.inputValue}
                onChange={e => this.setState({inputValue: e.target.value, feedback: null})}
                disabled={this.state.feedback !== null}
            />
        );
    }

    private renderFeedback (): React.ReactNode {
        const {feedback} = this.state;
        if (feedback === null) return null;
        if (feedback === 'manual') {
            return (
                <div className={questionStyles.feedbackManual}>
                    <FormattedMessage
                        id={'gui.litterBox.question.manual'}
                        defaultMessage={'This question has to be checked manually.'}
                    />
                </div>
            );
        }
        return (
            <div className={feedback === 'correct' ? questionStyles.feedbackCorrect : questionStyles.feedbackIncorrect}>
                {feedback === 'correct' ? '✓ Correct!' : '✗ Incorrect'}
            </div>
        );
    }

    private renderAnswerSection (): React.ReactNode {
        const {question} = this.props;
        const hasCorrectAnswers = (question.correctAnswers || []).length > 0;

        let options: React.ReactNode = null;
        if (question.type === 'MULTIPLE_CHOICE') {
            options = this.renderChoiceOptions();
        } else if (question.type === 'YES_NO') {
            options = this.renderYesNoOptions();
        } else if (question.type === 'NUMBER') {
            options = this.renderTextInput('number');
        } else if (question.type === 'FREE_TEXT') {
            options = this.renderTextInput('text');
        }

        return (
            <div>
                {options}
                {(hasCorrectAnswers || question.type === 'FREE_TEXT') &&
                    <button
                        className={sharedStyles.genericButton}
                        onClick={this.handleCheckAnswer}
                        disabled={this.state.feedback !== null}
                    >
                        <FormattedMessage
                            id={'gui.litterBox.question.checkAnswer'}
                            defaultMessage={'Check Answer'}
                        />
                    </button>
                }
                {this.renderFeedback()}
            </div>
        );
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
                        {this.renderAnswerSection()}
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
