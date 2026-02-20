import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';

import icon from './icon--step-back.svg';
import styles from './step-back.css';

const StepBackComponent = function (props) {
    const {
        vm,
        active,
        paused,
        interrogationEnabled,
        className,
        onClick,
        title,
        ...componentProps
    } = props;

    let enabled = false;
    if (vm.runtime && interrogationEnabled) {
        const traces = vm.getTraces().debugTrace;
        const traceLength = traces ? traces.length : 0;
        if (active && paused) {
            const newLastTrace = vm.runtime.newLastTrace;
            const newLastTraceIndex = traces ? traces.indexOf(newLastTrace) : -1;
            enabled = traceLength > 1 && (!newLastTrace || newLastTraceIndex > 0);
        } else if (!active) {
            enabled = traceLength > 1;
        }
    }

    return (
        <img
            className={classNames(
                className,
                styles.stepBack,
                {
                    [styles.enabled]: enabled
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

StepBackComponent.propTypes = {
    vm: PropTypes.instanceOf(VM),
    active: PropTypes.bool,
    paused: PropTypes.bool,
    interrogationEnabled: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string
};

StepBackComponent.defaultProps = {
    active: false,
    paused: false,
    title: 'Step back'
};

export default StepBackComponent;
