import React, {useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import styles from './bbt-coordinates-tooltip.css';

const BBTCoordinatesTooltip = props => {
    const ref = useRef(null);

    const canvasLeft = props.canvasLeft;
    const canvasTop = props.canvasTop;

    const mouseMoveListener = e => {
        if (e && ref && ref.current) {

            ref.current.innerHTML =
                `${Math.round(e.clientX - canvasLeft - 240)} / ${Math.round(180 - (e.clientY - canvasTop))}`;

            ref.current.style.left = `${e.clientX - 30}px`;
            ref.current.style.top = `${e.clientY + 25}px`;
        }
    };

    useEffect(() => {
        mouseMoveListener(window.event);
        document.addEventListener('mousemove', mouseMoveListener);

        return () => document.removeEventListener('mousemove', mouseMoveListener);
    });

    return (
        <div
            ref={ref}
            className={styles.coordinatesTooltip}
        />
    );
};

BBTCoordinatesTooltip.propTypes = {
    canvasLeft: PropTypes.number,
    canvasTop: PropTypes.number
};

const mapStateToProps = state => ({
    canvasLeft: state.scratchGui.stageSize.canvasLeft,
    canvasTop: state.scratchGui.stageSize.canvasTop
});

export default connect(
    mapStateToProps
)(BBTCoordinatesTooltip);
