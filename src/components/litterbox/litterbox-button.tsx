import React from 'react';

import styles from './litterbox-button.css';
import icon from './litterbox-icon.svg';

interface LitterBoxButtonProps {
    onClick: () => void;
}

const LitterBoxButton = function (props: LitterBoxButtonProps) {
    return (
        <img
            className={styles.litterboxButton}
            src={icon}
            alt="LitterBox"
            onClick={props.onClick}
        />
    );
};

export default LitterBoxButton;
