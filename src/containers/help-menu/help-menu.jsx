import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import VirtualMachine from 'scratch-vm';
import logging from 'scratch-vm/src/util/logging.js';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import HelpMenuComponent from '../../components/help-menu/main-window/help-menu.jsx';
import {
    closeHelpMenu,
    shrinkExpandHelpMenu,
    startDragHelpMenu,
    dragHelpMenu,
    endDragHelpMenu,
    startSpriteSelection,
    repositionHelpMenuWindow
} from '../../reducers/help-menu.js';

const messages = defineMessages({
    runAction: {
        id: 'gui.help-menu.steps.owl.run-action',
        defaultMessage: 'Let the project run',
        description: 'First step for starting the execution of the application'
    },
    runActionCompleted: {
        id: 'gui.help-menu.steps.owl.run-action-completed',
        defaultMessage: 'Can we proceed?',
        description: 'First step for starting the execution of the application'
    },
    spriteSelection: {
        id: 'gui.help-menu.steps.owl.sprite-selection',
        defaultMessage: 'Select sprite!',
        description: 'Second step for selecting a sprite'
    },
    messageBoxButton: {
        id: 'gui.help-menu.controls.message-box-button',
        defaultMessage: 'OK',
        description: 'The text for te button in the speech bubble of the owl'
    }
});

class HelpMenu extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'handleBackButtonClick',
            'handleClose',
            'handleMessage',
            'handleButtonSubmit',
            'translate',
        ]);
        this.init();
    }

    componentDidMount () {
        this.mounted = true;
    }

    componentWillUnmount () {
        this.mounted = false;
    }

    init () {
        this.initProperties();

        if (!this.props.visible) {
            this.cancel = true;
        }
    }

    initProperties () {
        this.cancel = false;
        this.crashed = false;
        this.flying = true;
    }

    handleClose () {
        this.props.onCloseHelpMenu();
        if (logging.isActive()) {
            logging.logClickEvent('BUTTON', new Date(), 'CLOSE_HELP_MENU', null);
        }
    }

    handleMessage (){
        if (this.props.runAction && !this.props.actionExecuted) {
            return (this.props.intl.formatMessage(messages.runAction));
        } else if (this.props.runAction) {
            return (this.props.intl.formatMessage(messages.runActionCompleted));
        } else if (this.props.spriteSelection) {
            return (this.props.intl.formatMessage(messages.spriteSelection));
        }
    }

    handleButtonSubmit () {
        this.props.onStartSpriteSelection();
        this.handleMessage();
        const x = window.innerWidth - 480 - 200;
        const y = window.innerHeight / 4 * 3;
        this.props.repositionHelpMenuWindow(x, y);
        this.forceUpdate();
    }

    translate (id, values) {
        return this.props.intl.formatMessage({id}, values);
    }

    handleBackButtonClick () {
        /*
            this.update();
            this.setSelectedQuestion(previousBlock.selectedQuestion);
            this.forceUpdate();
         */

    }

    render () {
        const {
            actionExecuted,
            x,
            y
        } = this.props;

        if (this.cancel) {
            return null;
        }

        const message = this.handleMessage();
        const buttonText = this.props.intl.formatMessage(messages.messageBoxButton);

        return (
            <HelpMenuComponent
                handledMessage={message}
                onBack={false ? this.handleBackButtonClick : null}
                crashed={this.crashed}
                onClose={this.handleClose}
                onOwlButtonSubmit={this.handleButtonSubmit}
                buttonText={buttonText}
                actionExecuted={actionExecuted}
                x={x}
                y={y}

                {...this.props}
            />
        );
    }
}

HelpMenu.propTypes = {
    intl: intlShape.isRequired,
    vm: PropTypes.instanceOf(VirtualMachine).isRequired,
    visible: PropTypes.bool.isRequired,
    expanded: PropTypes.bool.isRequired,
    runAction: PropTypes.bool.isRequired,
    spriteSelection: PropTypes.bool.isRequired,
    flying: PropTypes.bool,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    handledMessage: PropTypes.string,
    onCloseHelpMenu: PropTypes.func.isRequired,
    onShrinkExpand: PropTypes.func.isRequired,
    onStartDrag: PropTypes.func.isRequired,
    onDrag: PropTypes.func.isRequired,
    onEndDrag: PropTypes.func.isRequired,
    onStartSpriteSelection: PropTypes.func.isRequired,
    messageBoxButtonText: PropTypes.string,
    actionExecuted: PropTypes.bool,
    repositionHelpMenuWindow: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    visible: state.scratchGui.helpMenu.visible,
    expanded: state.scratchGui.helpMenu.expanded,
    runAction: state.scratchGui.helpMenu.runAction,
    spriteSelection: state.scratchGui.helpMenu.spriteSelection,
    actionExecuted: state.scratchGui.helpMenu.actionExecuted,
    x: state.scratchGui.helpMenu.x,
    y: state.scratchGui.helpMenu.y
});

const mapDispatchToProps = dispatch => ({
    onCloseHelpMenu: () => dispatch(closeHelpMenu()),
    onShrinkExpand: () => dispatch(shrinkExpandHelpMenu()),
    onStartDrag: () => dispatch(startDragHelpMenu()),
    onDrag: (e_, data) => dispatch(dragHelpMenu(data.x, data.y)),
    onEndDrag: () => dispatch(endDragHelpMenu()),
    onStartSpriteSelection: () => dispatch(startSpriteSelection()),
    repositionHelpMenuWindow: (x, y) => dispatch(repositionHelpMenuWindow(x, y))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(HelpMenu));
