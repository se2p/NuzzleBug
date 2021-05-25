import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';
import styles from './tutorial-cards.css';

const TutorialSuccess = ({onHomeMenu}) => (
    <div className={styles.tutorialStep}>
        <h4 className={styles.stepTitle}> Success </h4>
        <p className={styles.stepInstructions}> You successfully finished tutorial boat Race. Probier noch weitere Tutorials aus </p>
        <div className={styles.stepTestingButton}
        onClick={onHomeMenu}>
        <span className={styles.stepTestingButtonTitle}>Home</span>
    </div>
    </div>
);
TutorialSuccess.propTypes = {
    onHomeMenu: PropTypes.func.isRequired
};

export default injectIntl(TutorialSuccess);
