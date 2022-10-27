import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Draggable from 'react-draggable';
import {FormattedMessage, injectIntl, intlShape} from 'react-intl';
import VirtualMachine from 'scratch-vm';

import HMHead from '../header/help-menu-header.jsx';
import Owl from '../owl/help-menu-owl.jsx';
import cardStyles from '../../cards/card.css';
import styles from './help-menu.css';


class HelpMenu extends React.Component {

    constructor (props) {
        super(props);
        this.header = React.createRef();
        this.body = React.createRef();
        this.owl = React.createRef();
    }

    componentDidMount () {
        this._updateWidth();
    }

    componentDidUpdate (prevProps) {
        this._updateWidth();
    }

    _updateWidth () {
        const headerWidth = this.header.current.clientWidth;
        this.body.current.setAttribute('style', `width: ${headerWidth}px`);
    }

    render () {
        const {
            vm,
            intl,
            expanded,
            flying,
            onClose,
            onBack,
            onShrinkExpand,
            onDrag,
            onStartDrag,
            onEndDrag,
            onOwlButtonSubmit,
            handledMessage,
            crashed,
            runAction,
            actionExecuted,
            spriteSelection,
            buttonText,
            ...posProps
        } = this.props;

        let {x, y} = posProps;
        const cardHorizontalDragOffset = 400; // ~80% of card width
        const cardVerticalDragOffset = expanded ? 432 : 0; // ~80% of card height
        const menuBarHeight = 10;

        // Todo make Stage size responsive
        return (
            <div>
                {(expanded && (runAction || spriteSelection)) ? (
                    <div
                        className={styles.expandedOverlay}
                        style={{
                            width: `calc(${window.innerWidth}px - 480px - ((0.5rem + 0.0625rem) * 2))`,
                            height: `${window.innerHeight + cardVerticalDragOffset}px`,
                            top: 0,
                            left: 0
                        }}
                    />
                ) : (expanded ? (
                    <div
                        className={styles.expandedOverlay}
                        style={{
                            width: `${window.innerWidth + (2 * cardHorizontalDragOffset)}px`,
                            height: `${window.innerHeight + cardVerticalDragOffset}px`,
                            top: 0,
                            left: 0
                        }}
                    />
                ) : null)}
                <div
                    className={styles.overlay}
                    style={{
                        width: `${window.innerWidth + (2 * cardHorizontalDragOffset)}px`,
                        height: `${window.innerHeight - menuBarHeight + cardVerticalDragOffset}px`,
                        top: `${menuBarHeight}px`,
                        left: `${-cardHorizontalDragOffset}px`
                    }}
                >
                    <Draggable
                        bounds="parent"
                        position={{x: x, y: y}}
                        onDrag={onDrag}
                        onStart={onStartDrag}
                        onStop={onEndDrag}
                    >
                        <div className={cardStyles.cardContainer}>
                            <div className={classNames(cardStyles.card, styles.card)}>
                                <div
                                    ref={this.header}
                                    className={styles.header}
                                >
                                    <HMHead
                                        expanded={expanded}
                                        onClose={onClose}
                                        onBack={onBack}
                                        onShrinkExpand={onShrinkExpand}
                                    />
                                </div>
                                <div
                                    className={expanded ? styles.owl : cardStyles.hidden}
                                    ref={this.owl}
                                >
                                    <div className={styles.card}>
                                        <Owl
                                            text={handledMessage}
                                            flying={flying}
                                            onSubmit={onOwlButtonSubmit}
                                            buttonText={buttonText}
                                            enabled={actionExecuted}
                                        />
                                    </div>
                                </div>
                                <div
                                    className={(expanded) ? styles.body : cardStyles.hidden}
                                    ref={this.body}
                                >
                                    {(crashed ? (
                                        <div className={styles.helpMenuCrashMessage}>
                                            <FormattedMessage
                                                defaultMessage="Oops! Something went wrong."
                                                description="Crash Message title"
                                                id="gui.crashMessage.label"
                                            />
                                        </div>
                                    ) : null)}
                                </div>
                            </div>
                        </div>
                    </Draggable>
                </div>
            </div>
        );
    }
}

HelpMenu.propTypes = {
    intl: intlShape.isRequired,
    vm: PropTypes.instanceOf(VirtualMachine).isRequired,
    expanded: PropTypes.bool.isRequired,
    flying: PropTypes.bool,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    onBack: PropTypes.func,
    onShrinkExpand: PropTypes.func.isRequired,
    onStartDrag: PropTypes.func,
    onDrag: PropTypes.func,
    handledMessage: PropTypes.string,
    onEndDrag: PropTypes.func,
    crashed: PropTypes.bool.isRequired,
    runAction: PropTypes.bool.isRequired,
    spriteSelection: PropTypes.bool.isRequired,
    onOwlButtonSubmit: PropTypes.func.isRequired,
    buttonText: PropTypes.string,
    actionExecuted: PropTypes.bool
};

export default injectIntl(HelpMenu);
