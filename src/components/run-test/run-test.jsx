import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Test from 'whisker-main/whisker-main/src/test-runner/test';

import runTestIcon from './icon--run-test.png';
import styles from './run-test.css';

const RunTestComponent = function (props) {
    const {
        testResult,
        active,
        className,
        onClick,
        title,
        ...componentProps
    } = props;
    return (
        <div
            className={classNames(
                className,
                styles.runTestDiv,
                {
                    [styles.isActive]: active
                }
            )}
            onClick={onClick}
            title={title}
            {...componentProps}
        >
            <img
                className={styles.runTest}
                draggable={false}
                src={runTestIcon}
            />
            <div
                className={classNames(
                    {
                        [styles.pass]: testResult === Test.PASS,
                        [styles.fail]: testResult === Test.FAIL || testResult === Test.ERROR
                    }
                )}
            />
        </div>
    );
};
RunTestComponent.propTypes = {
    testResult: PropTypes.string,
    active: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string
};
RunTestComponent.defaultProps = {
    active: false,
    title: 'Run test'
};
export default RunTestComponent;
