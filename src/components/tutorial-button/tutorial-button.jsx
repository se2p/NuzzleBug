import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import iconTutorial from './icon--light-bulb.svg';

import styles from './tutorial-button.css';

const TutorialButton = props => {
    const {
        active,
        className,
        onClick,
        title,
        ...componentProps
    } = props;

    return (
        <>
            <img
                className={classNames(
                    className,
                    styles.tutorialButton,
                    {
                        [styles.isActive]: active
                    }
                )}
                draggable={false}
                aria-disabled={active}
                src={iconTutorial}
                title={title}
                onClick={active ? onClick : null}
                alt={'Light bulb'}
                {...componentProps}
            />
        </>
    );
};

TutorialButton.propTypes = {
    active: PropTypes.bool.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string
};

TutorialButton.defaultProps = {
    title: 'Tutorials'
};

export default TutorialButton;
