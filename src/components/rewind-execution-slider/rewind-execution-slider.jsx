import PropTypes from 'prop-types';
import React from 'react';

import styles from './rewind-execution-slider.css';

const RewindExecutionSliderComponent = function (props) {

    const {
        active,
        paused,
        min,
        max,
        value,
        onSliderUpdate
    } = props;
    
    return (
        <div>
            {((active && paused) || !active) && max > min ? (
                <div className={styles.sliderContainer}>
                    <input
                        className={styles.slider}
                        type="range"
                        min={min}
                        max={max}
                        value={value}
                        onChange={onSliderUpdate}
                    />
                </div>
            ) : null}
        </div>
    );
};

RewindExecutionSliderComponent.propTypes = {
    active: PropTypes.bool,
    paused: PropTypes.bool,
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.number,
    onSliderUpdate: PropTypes.func
};

RewindExecutionSliderComponent.defaultProps = {
    active: false,
    paused: false
};

export default RewindExecutionSliderComponent;
