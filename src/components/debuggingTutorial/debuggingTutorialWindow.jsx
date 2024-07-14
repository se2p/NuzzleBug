
import React from 'react';
import PropTypes from "prop-types";
import css from "./debuggingTutorialWindow.css";
import styles from "../cards/card.css";
import Draggable from 'react-draggable';
import classNames from "classnames";
import tutorialStyles from "../tutorial/styles/tutorial-cards.css";
import homeIcon from "../tutorial/images/icon--home.svg";
import shrinkIcon from "../cards/icon--shrink.svg";
import expandIcon from "../cards/icon--expand.svg";
import {FormattedMessage} from "react-intl";
import closeIcon from "../cards/icon--close.svg";

const DebuggingTutorialWindow = props => {
    const {
        onDrag,
        onStartDrag,
        onEndDrag,
        isRtl,
        tutorial,
        step,
        onEnterAnswer,
        ...posProps
    } = props;
    let {x, y} = posProps;
    const expanded = true;



    // Copied from the tutorial cards
    const cardHorizontalDragOffset = 560; // ~80% of card width
    const cardVerticalDragOffset = expanded ? 400 : 0; // ~80% of card height, if expanded
    const menuBarHeight = 48;

    if (x === 0 && y === 0) {
        x = isRtl ? (-800 - cardHorizontalDragOffset) : 620;
        x += cardHorizontalDragOffset;
        y = 60;
    }


    return (
        // Custom overlay to act as the bounding parent for the draggable, using values from above
        <div
            className={styles.cardContainerOverlay}
            style={{
                width: `${window.innerWidth + (2 * cardHorizontalDragOffset)}px`,
                height: `${window.innerHeight - menuBarHeight + cardVerticalDragOffset}px`,
                top: `${menuBarHeight}px`,
                left: `${-cardHorizontalDragOffset}px`
            }}
        >
            <Draggable
                bounds="parent"
                position={{x: x, y: y}}
                onDrag={onDrag}
                onStart={onStartDrag}
                onStop={onEndDrag}
            >
                <div className={css.cardContainer}>

                    <div className={css.floatingWindow}>
                        <button onClick={props.onClose}>schließen</button>
                    <div className={css.header}>
                        step: {step}
                        <img src={"imgTemplates/img.png"} alt="Header!" className={css.headerImage} />
                    </div>
                    <div className={css.questionSection}>
                        <div className={css.questionHeader}>
                            <span>{tutorial[step]["text"]}</span>
                            <button className={css.helpButton} onClick={props.onHelp}>i</button>
                        </div>
                        <div className={css.options}>
                            <div className={css.option}>Bild </div>
                        </div>
                    </div>
                    <div className={css.footer}>
                        <button className={css.footerButton} style={{backgroundColor: "red"}}>Zurück</button>
                        <button className={css.footerButton} onClick={onEnterAnswer}>Weiter</button>
                    </div>
                    </div>


                </div>
            </Draggable>
        </div>




    );




};

DebuggingTutorialWindow.props = {
    isVisible: PropTypes.bool,
    onClose: PropTypes.func,
    onHelp: PropTypes.func,
    x: PropTypes.number,
    y: PropTypes.number,
    dragging: PropTypes.bool.isRequired,
    onDrag: PropTypes.func,
    onEndDrag: PropTypes.func,
    onStartDrag: PropTypes.func,
    tutorial: PropTypes.object.isRequired, //TODO
    step: PropTypes.string,
    onEnterAnswer: PropTypes.func,
}














export default DebuggingTutorialWindow;
