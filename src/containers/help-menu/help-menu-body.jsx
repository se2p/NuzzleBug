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

const messages = defineMessages({
    noQuestions: {
        id: 'gui.help-menu.steps.no-questions',
        defaultMessage: 'No questions available!',
        description: 'no questions available!'
    },
    chooseCategory: {
        id: 'gui.help-menu.steps.choose-category',
        defaultMessage: 'Which category?',
        description: 'Third step for selecting a category'
    },
    chooseQuestionTypeMultiple: {
        id: 'gui.help-menu.steps.choose-question-type-multiple',
        defaultMessage: 'Did it happen or not?',
        description: 'Fourth step for selecting what type the question has'
    },
    chooseQuestionTypeSingle: {
        id: 'gui.help-menu.steps.choose-question-type-single',
        defaultMessage: 'According to the blocks available, you have only one choice!',
        description: 'Fourth step but only one question type is available'
    },
    finished: {
        id: 'gui.help-menu.steps.finished',
        defaultMessage: 'Finished!',
        description: 'Fifth step for when the help is finished'
    },
    messageBoxButton: {
        id: 'gui.help-menu.controls.message-box-button',
        defaultMessage: 'OK',
        description: 'The text for the button in the speech bubble of the owl'
    }
});

class HelpMenuBody extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'handleMessage',
            'translate'
        ]);
    }

    translate (id, values) {
        return this.props.intl.formatMessage({id}, values);
    }

    handleMessage () {
        if (this.props.chooseCategory && this.props.abstractCategories.length === 0) {
            return (this.props.intl.formatMessage(messages.noQuestions));
        } else if (this.props.chooseCategory){
            return (this.props.intl.formatMessage(messages.chooseCategory));
        } else if (this.props.chooseQuestionType && this.props.abstractCategories[0].questionCategories.length &&
            this.props.abstractCategories[0].questionCategories.length > 1) {
            return (this.props.intl.formatMessage(messages.chooseQuestionTypeMultiple));
        } else if (this.props.chooseQuestionType){
            return (this.props.intl.formatMessage(messages.chooseQuestionTypeSingle));
        } else if (this.props.finished) {
            return (this.props.intl.formatMessage(messages.finished));
        }
    }

    render () {
        const {
            onClick,
            abstractCategories
        } = this.props;

        const message = this.handleMessage();

        return (
            <HelpMenuBodyComponent
                injected={this.props.injected}
                chooseQuestionType={this.props.chooseQuestionType}
                message={message}
                onClick={onClick}
                abstractCategories={abstractCategories}
            />
        );
    }
}

HelpMenuBody.propTypes = {
    intl: intlShape.isRequired,
    abstractCategories: PropTypes.arrayOf(PropTypes.instanceOf(QuestionCategory)),
    onClick: PropTypes.func.isRequired,
    chooseCategory: PropTypes.bool.isRequired,
    chooseQuestionType: PropTypes.bool.isRequired,
    finished: PropTypes.bool.isRequired,
    injected: PropTypes.bool.isRequired
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
