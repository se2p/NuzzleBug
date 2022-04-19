import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Button from '../button/button.jsx';

import styles from './scratch1984-button.css';

const Scratch1984Button = ({
    className,
    onClick
}) => (
    <Button
        className={classNames(
            className,
            styles.scratch1984Button,
        )}
        onClick={onClick}
    >
        {'Beenden'}
    </Button>
);

Scratch1984Button.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func
};

Scratch1984Button.defaultProps = {
    onClick: () => {}
};

export default Scratch1984Button;
