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

const owlMessages = defineMessages({
    noQuestions: {
        id: 'gui.help-menu.steps.owl.no-questions',
        defaultMessage: 'No questions available!',
        description: 'no questions available!'
    },
    chooseCategory: {
        id: 'gui.help-menu.steps.owl.choose-category',
        defaultMessage: 'Which category?',
        description: 'Third step for selecting a category'
    },
    chooseQuestionTypeMultiple: {
        id: 'gui.help-menu.steps.owl.choose-question-type-multiple',
        defaultMessage: 'Did it happen or not?',
        description: 'Fourth step for selecting what type the question has'
    },
    chooseQuestionTypeSingle: {
        id: 'gui.help-menu.steps.owl.choose-question-type-single',
        defaultMessage: 'According to the blocks available, you have only one choice!',
        description: 'Fourth step but only one question type is available'
    },
    finished: {
        id: 'gui.help-menu.steps.owl.finished',
        defaultMessage: 'Finished!',
        description: 'Fifth step for when the help is finished'
    },
    messageBoxButton: {
        id: 'gui.help-menu.controls.message-box-button',
        defaultMessage: 'OK',
        description: 'The text for the button in the speech bubble of the owl'
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
            chosenMessage = owlMessages.noQuestions;
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
        return this.props.intl.formatMessage(chosenMessage);
    }

    handleUserMessage () {
        let chosenMessage;
        if (this.props.chooseCategory){
            chosenMessage = userMessages.chooseCategory;
        } else {
            chosenMessage = userMessages.chooseQuestionType;
        }
        return this.props.intl.formatMessage(chosenMessage);
    }

    generatePrevMessages (){
        const messages = [];
        if (this.props.selectedAbstractCategory){
            messages.push(this.props.intl.formatMessage(owlMessages.chooseCategory));
            let message = this.props.intl.formatMessage(userMessages.chooseCategory);
            message += ` ${this.translate(
                `gui.ir-debugger.abstract-category.type.${this.props.selectedAbstractCategory.abstractType}`,
                {}
            )}`;
            messages.push(message);
            if (this.props.selectedAbstractCategory.form){
                let categoryCount = 0;
                for (const category of this.props.abstractCategories) {
                    if (category.type === this.props.selectedAbstractCategory.type) {
                        for (const subcategory of category.questionCategories) {
                            if (subcategory.abstractType === this.props.selectedAbstractCategory.abstractType) {
                                categoryCount = subcategory.questionCategories.length;
                            }
                        }
                    }
                }
                if (categoryCount === 1){
                    messages.push(this.props.intl.formatMessage(owlMessages.chooseQuestionTypeSingle));
                } else {
                    messages.push(this.props.intl.formatMessage(owlMessages.chooseQuestionTypeMultiple));
                }
                message = this.props.intl.formatMessage(userMessages.chooseQuestionType);
                message += ` "${this.translate(
                    `gui.ir-debugger.question.form.${this.props.selectedAbstractCategory.form}`,
                    {}
                )}"`;
                messages.push(message);
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
    selectedAbstractCategory: PropTypes.instanceOf(QuestionCategory)
};

const mapStateToProps = state => ({
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
