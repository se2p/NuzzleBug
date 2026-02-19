import React from 'react';
import PropTypes from 'prop-types';
import css from "../debugging-help.css";

const Message = ({ tutorial, step, tutorialIndexData }) => {
    if (!tutorial || !tutorial[step]) {
        console.error("Missing tutorial or tutorial[step]");
        return null;
    }

    const { message, img, width } = tutorial[step];
    const imgSrc = img ? tutorialIndexData[img] : null;

    return (
        <div className={css.messageTextContainer}>
            {message && <span className={css.messageText}>{message}</span>}
            {img && imgSrc && (
                <img
                    src={imgSrc}
                    style={{ width: width, height: 'auto' }}
                    draggable={false}
                    alt="messageContent"
                />
            )}
        </div>
    );
};

Message.propTypes = {
    tutorial: PropTypes.object.isRequired,
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    tutorialIndexData: PropTypes.object.isRequired,
};

export default Message;
