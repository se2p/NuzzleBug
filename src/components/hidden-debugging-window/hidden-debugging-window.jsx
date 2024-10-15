import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import Box from '../box/box.jsx';
import styles from './hidden-debugging-window.css';
import cardStyles from '../cards/card.css';
import shrinkIcon from '../cards/icon--shrink.svg';
import expandIcon from '../cards/icon--expand.svg';
import closeIcon from '../cards/icon--close.svg';

const HiddenDebuggingWindowComponent = props => {

    const [isExpanded, setExpanded] = useState(true);

    return (
        <Draggable bounds="parent">
            <Box className={styles.hiddenDebuggingWindow}>
                <Box className={styles.header}>

                    <Box className={styles.headerLeft}>
                        {'Debugging Window'}
                    </Box>

                    <Box className={styles.headerRight}>
                        {isExpanded ? (
                            <div
                                className={cardStyles.allButton}
                                onClick={() => setExpanded(false)}
                            >
                                <img
                                    draggable={false}
                                    src={shrinkIcon}
                                />
                                {'Shrink'}
                            </div>
                        ) : (
                            <div
                                className={cardStyles.allButton}
                                onClick={() => setExpanded(true)}
                            >
                                <img
                                    draggable={false}
                                    src={expandIcon}
                                />
                                {'Expand'}
                            </div>
                        )}

                        <div
                            className={cardStyles.allButton}
                            onClick={props.onClose}
                        >
                            <img
                                draggable={false}
                                src={closeIcon}
                            />
                            {'Close'}
                        </div>
                    </Box>
                </Box>

                {isExpanded ? (
                    <Box className={styles.body} >
                        {props.children}
                    </Box>
                ) : null}
            </Box>
        </Draggable>
    );

};


HiddenDebuggingWindowComponent.propTypes = {
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node
};

export default HiddenDebuggingWindowComponent;
