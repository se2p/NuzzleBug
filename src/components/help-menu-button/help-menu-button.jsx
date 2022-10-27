import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';

import icon from './icon--help-menu-button.svg';
import styles from './help-menu-button.css';

const HelpMenuButtonComponent = function (props) {
    const {
        className,
        onClick,
        title,
        ...componentProps
    } = props;

    return (
        <img
            className={classNames(
                className,
                styles.helpMenuButton,
                {
                    [styles.enabled]: true
                }
            )}
            draggable={false}
            src={icon}
            onClick={onClick}
            title={title}
            {...componentProps}
        />
    );
};

HelpMenuButtonComponent.propTypes = {
    vm: PropTypes.instanceOf(VM),
    active: PropTypes.bool,
    paused: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string
};

HelpMenuButtonComponent.defaultProps = {
    active: false,
    paused: false,
    title: 'Help menu'
};

export default HelpMenuButtonComponent;
