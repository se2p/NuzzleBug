import React from 'react';
import styles from '../../styles/tutorial-cards.css';
import loading from '../../images/icon--loading.svg';
import checkmark from '../../images/icon--checkmark.png';
import crossMark from '../../images/icon--cross-mark.png';
import PropTypes from 'prop-types';

/**
 * Component that tests and displays the results of the tests.
 * @constructor
 */

const TutorialStepTesting = props => {
    const {
        testButtonTitle,
        successMsg,
        failMsg,
        loadingMsg,
        onTest,
        testButtonVisible,
        tested,
        success,
        currentlyTesting
    } = props;

    return (
        <div className={styles.stepTesting}>
            {testButtonVisible ?
                <div
                    className={styles.stepTestingButton}
                    onClick={onTest}
                    style={{
                        pointerEvents: currentlyTesting ? 'none' : 'auto',
                        opacity: currentlyTesting ? 0.5 : 1
                    }}
                >
                    <span className={styles.stepTestingButtonTitle}>{testButtonTitle}</span>
                </div> : null}
            {tested ?
                (currentlyTesting ?
                    <p className={styles.stepTestingLoading}>
                        <img
                            style={{
                                height: '20px',
                                verticalAlign: 'middle',
                                marginRight: 10,
                                marginBottom: 4.5
                            }}
                            src={loading}
                            draggable={false}
                            alt={'loading arrows'}
                        />
                        {loadingMsg}
                    </p> :
                    (success ?
                        <p className={styles.stepTestingSuccess}>
                            <img
                                style={{
                                    height: '20px',
                                    verticalAlign: 'middle',
                                    marginRight: 10,
                                    marginBottom: 4.5
                                }}
                                src={checkmark}
                                draggable={false}
                                alt={'Checkmark'}
                            />
                            {successMsg}
                        </p> :
                        <p className={styles.stepTestingFailShort}>
                            <img
                                style={{
                                    height: '20px',
                                    verticalAlign: 'middle',
                                    marginRight: 10,
                                    marginBottom: 4.5
                                }}
                                src={crossMark}
                                draggable={false}
                                alt={'Cross mark'}
                            />
                            {failMsg}
                        </p>
                    )) : null}
        </div>
    );
};
TutorialStepTesting.propTypes = {
    testButtonTitle: PropTypes.string.isRequired,
    successMsg: PropTypes.string.isRequired,
    failMsg: PropTypes.string.isRequired,
    loadingMsg: PropTypes.string.isRequired,
    onTest: PropTypes.func.isRequired,
    testButtonVisible: PropTypes.bool.isRequired,
    tested: PropTypes.bool.isRequired,
    success: PropTypes.bool.isRequired,
    currentlyTesting: PropTypes.bool.isRequired
};
