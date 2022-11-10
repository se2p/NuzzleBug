import PropTypes from 'prop-types';
import React from 'react';
import styles from './prev-message-generator.css';
import classNames from 'classnames';

const PrevMessageGenerator = function (props) {
    const {
        messages
    } = props;

    return (
        <div className={styles.messages}>
            {messages.map((message, index) => (
                <div
                    key={message}
                    className={((index % 2 === 0) ? styles.messageOwl : styles.messageUser)}
                >
                    <div
                        className={((index % 2 === 0) ?
                            classNames(styles.speechBubbleBoxOwl, styles.speechBubbleTriangleOwl) :
                            classNames(styles.speechBubbleBoxUser, styles.speechBubbleTriangleUser))}
                    >
                        <div
                            className={styles.helpMessages}
                        >
                            <div>
                                {
                                    message
                                }
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

PrevMessageGenerator.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.string)
};

export default PrevMessageGenerator;
