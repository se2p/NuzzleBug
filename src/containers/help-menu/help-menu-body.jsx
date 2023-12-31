import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import HelpMenuBodyComponent from '../../components/help-menu/body/help-menu-body.jsx';
import {
    closeHelpMenu

} from '../../reducers/help-menu.js';
import {QuestionCategory} from 'scratch-ir';
import {ChatMessage} from './chat-message.jsx';

const owlMessages = defineMessages({
    noQuestionsStage: {
        id: 'gui.help-menu.steps.owl.no-questions-stage',
        defaultMessage: 'No questions available!',
        description: 'no questions available!',
        values: {}
    },
    noQuestionsSprite: {
        id: 'gui.help-menu.steps.owl.no-questions-sprite',
        defaultMessage: 'No questions available!',
        description: 'no questions available!',
        values: {}
    },
    chooseCategory: {
        id: 'gui.help-menu.steps.owl.choose-category',
        defaultMessage: 'Which category?',
        description: 'Third step for selecting a category',
        values: {}
    },
    chooseQuestionTypeMultiple: {
        id: 'gui.help-menu.steps.owl.choose-question-type-multiple',
        defaultMessage: 'Did it happen or not?',
        description: 'Fourth step for selecting what type the question has',
        values: {}
    },
    chooseQuestionTypeSingle: {
        id: 'gui.help-menu.steps.owl.choose-question-type-single',
        defaultMessage: 'According to the blocks available, you have only one choice!',
        description: 'Fourth step but only one question type is available',
        values: {}
    },
    finished: {
        id: 'gui.help-menu.steps.owl.finished',
        defaultMessage: 'Finished!',
        description: 'Fifth step for when the help is finished',
        values: {}
    },
    messageBoxButton: {
        id: 'gui.help-menu.controls.message-box-button',
        defaultMessage: 'OK',
        description: 'The text for the button in the speech bubble of the owl',
        values: {}
    }
});

const userMessages = defineMessages({
    chooseCategory: {
        id: 'gui.help-menu.steps.user.choose-category',
        defaultMessage: 'Ok, i choose',
        description: 'Third step for the user text for selecting a category'
    },
    chooseQuestionType: {
        id: 'gui.help-menu.steps.user.choose-question-type',
        defaultMessage: 'I think it did',
        description: 'Fourth step for the user text for selecting what type the question has'
    }
});

class HelpMenuBody extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'handleOwlMessage',
            'handleUserMessage',
            'generatePrevMessages',
            'translate'
        ]);
    }

    translate (id, values) {
        return this.props.intl.formatMessage({id}, values);
    }

    handleOwlMessage () {
        let chosenMessage = null;
        if (this.props.chooseCategory && this.props.categories.length === 0) {
            if (this.props.targetName) {
                chosenMessage = owlMessages.noQuestionsSprite;
                chosenMessage.values = {sprite: this.props.targetName};
            }
            else {
                chosenMessage = owlMessages.noQuestionsStage;
            }
        } else if (this.props.chooseCategory){
            chosenMessage = owlMessages.chooseCategory;
        } else if (this.props.chooseQuestionType && this.props.categories[0].questionCategories.length &&
            this.props.categories[0].questionCategories.length > 1) {
            chosenMessage = owlMessages.chooseQuestionTypeMultiple;
        } else if (this.props.chooseQuestionType){
            chosenMessage = owlMessages.chooseQuestionTypeSingle;
        } else if (this.props.finished) {
            chosenMessage = owlMessages.finished;
        }
        return chosenMessage;
    }

    handleUserMessage () {
        let chosenMessage;
        if (this.props.chooseCategory){
            chosenMessage = userMessages.chooseCategory;
        } else {
            chosenMessage = userMessages.chooseQuestionType;
        }
        if (chosenMessage) {
            return this.translate(chosenMessage.id, {});
        }
        return '';
    }

    generatePrevMessages (){
        const messages = [];
        if (this.props.selectedAbstractCategory){
            let categoryCount = 0;
            let categoryColor;
            if (this.props.selectedAbstractCategory.form) {
                for (const category of this.props.abstractCategories) {
                    if (category.type === this.props.selectedAbstractCategory.type) {
                        categoryColor = category.color;
                        for (const subcategory of category.questionCategories) {
                            if (subcategory.abstractType === this.props.selectedAbstractCategory.abstractType) {
                                categoryCount = subcategory.questionCategories.length;
                            }
                        }
                    }
                }
            }
            const owlMessage1 = new ChatMessage({
                message: this.props.intl.formatMessage(owlMessages.chooseCategory)
            });
            messages.push(owlMessage1);
            const userMessage1 = new ChatMessage({
                message: this.props.intl.formatMessage(userMessages.chooseCategory),
                userAnswer: this.translate(
                    `gui.ir-debugger.abstract-category.type.${this.props.selectedAbstractCategory.abstractType}`,
                    {}
                ),
                type: this.props.selectedAbstractCategory.type,
                abstractType: this.props.selectedAbstractCategory.abstractType,
                color: categoryColor ? categoryColor : this.props.selectedAbstractCategory.color
            });
            messages.push(userMessage1);

            if (this.props.selectedAbstractCategory.form){

                const owlMessage2 = new ChatMessage({
                    message: ''
                });
                if (categoryCount === 1){
                    owlMessage2.message = this.props.intl.formatMessage(owlMessages.chooseQuestionTypeSingle);
                } else {
                    owlMessage2.message = this.props.intl.formatMessage(owlMessages.chooseQuestionTypeMultiple);
                }
                messages.push(owlMessage2);
                const userMessage2 = new ChatMessage({
                    message: this.props.intl.formatMessage(userMessages.chooseQuestionType),
                    userAnswer: this.translate(
                        `gui.ir-debugger.question.form.${this.props.selectedAbstractCategory.form}`,
                        {}
                    ),
                    type: this.props.selectedAbstractCategory.type,
                    abstractType: this.props.selectedAbstractCategory.abstractType,
                    color: categoryColor ? categoryColor : this.props.selectedAbstractCategory.color,
                    form: this.props.selectedAbstractCategory.form
                });
                messages.push(userMessage2);
            }
        }
        return messages;
    }

    render () {
        const {
            onClick,
            categories
        } = this.props;

        const owlMessage = this.handleOwlMessage();
        const userMessage = this.handleUserMessage();
        const prevMessages = this.generatePrevMessages();

        return (
            <HelpMenuBodyComponent
                injected={this.props.injected}
                chooseQuestionType={this.props.chooseQuestionType}
                owlMessage={owlMessage}
                userMessage={userMessage}
                onClick={onClick}
                categories={categories}
                prevMessages={prevMessages}
            />
        );
    }
}

HelpMenuBody.propTypes = {
    intl: intlShape.isRequired,
    categories: PropTypes.arrayOf(PropTypes.instanceOf(QuestionCategory)),
    abstractCategories: PropTypes.arrayOf(PropTypes.instanceOf(QuestionCategory)),
    onClick: PropTypes.func.isRequired,
    chooseCategory: PropTypes.bool.isRequired,
    chooseQuestionType: PropTypes.bool.isRequired,
    finished: PropTypes.bool.isRequired,
    injected: PropTypes.bool.isRequired,
    selectedAbstractCategory: PropTypes.instanceOf(QuestionCategory),
    targetName: PropTypes.string
};

const mapStateToProps = state => ({
    targetName: state.scratchGui.helpMenu.targetName,
    chooseCategory: state.scratchGui.helpMenu.chooseCategory,
    chooseQuestionType: state.scratchGui.helpMenu.chooseQuestionType,
    finished: state.scratchGui.helpMenu.finished,
    injected: state.scratchGui.helpMenu.injected
});

const mapDispatchToProps = dispatch => ({
    onCloseHelpMenu: () => dispatch(closeHelpMenu())
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(HelpMenuBody));
