import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import iconTutorial from "../tutorial-button/icon--light-bulb.svg";

const DebuggingTutorialButton = props => {
    const {
        active,
        className,
        onClick,
        title,
        ...componentProps
    } = props;

    return (
        <button
            draggable={false}
            aria-disabled={active}
                         title={title}
                         onClick={active ? onClick : null}
                         {...componentProps}>
            aaa
        </button>
    );
};

DebuggingTutorialButton.propTypes = {
    active: PropTypes.bool.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string
};

DebuggingTutorialButton.defaultProps = {
    title: 'Tutorials'
};

export default DebuggingTutorialButton;
