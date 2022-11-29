import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';

import styles from './help-menu-body.css';
import Owl from '../owl/help-menu-owl.jsx';
import owlHead from './owl-head.svg';
import {QuestionCategory} from 'scratch-ir';
import AbstractCategoryComponent from '../abstract-category/abstract-category.jsx';
import PrevMessageGenerator from '../prev-message-generator/prev-message-generator.jsx';
import {CSSTransition} from 'react-transition-group';

const HelpMenuBodyComponent = function (props) {
    const {
        categories,
        onClick,
        owlMessage,
        userMessage,
        injected,
        prevMessages
    } = props;


    // const [show, setShow] = useState(false);

    const blockRef = React.useRef(null);
    useEffect(() => {
        if (blockRef.current) {
            blockRef.current.scrollTo({
                top: blockRef.current.scrollHeight,
                left: 0,
                behavior: 'smooth'
            });
        }
        // setTimeout(() => setShow(true), 300);
    });

    /* const handleClick = category => {
        onClick(category);
    };*/

    return (
        <div
            className={styles.menu}
        >
            <div className={styles.header}>
                <i className={styles.owlHead}><img src={owlHead} /></i>
                <div>{'Owl Chat'}</div>
            </div>
            <div
                className={styles.body}
                ref={blockRef}
            >
                <PrevMessageGenerator
                    messages={prevMessages}
                />
                <div
                    className={styles.owlArea}
                >
                    <div
                        className={styles.owl}
                    >
                        <Owl
                            injected={injected}
                            onSubmit={print}
                            enabled={false}
                            message={owlMessage}
                            lookRight={false}
                        />
                    </div>
                </div>
                {categories && categories.length > 0 ? (
                    <div>
                        <div
                            className={styles.category}
                        >
                            {/* <CSSTransition
                                in={show}
                                timeout={200}
                                unmountOnExit
                                classNames="my-node"
                            >*/}
                            <div
                                className={classNames(styles.speechBubbleBox, styles.speechBubbleTriangle)}
                            >
                                <div
                                    id="help-messages"
                                    className={styles.helpMessages}
                                >
                                    <div>
                                        {userMessage}
                                    </div>
                                    <ul className={styles.categoryList}>
                                        {categories.map(category => (
                                            <li
                                                key={category.id}
                                            >
                                                {category.questionCategories && category.questionCategories.length ?
                                                    (<AbstractCategoryComponent
                                                        onClick={onClick}
                                                        category={category}
                                                        abstractCategories={category.questionCategories}
                                                    />) : null}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>) : null}
            </div>
        </div>
    );
};

HelpMenuBodyComponent.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.instanceOf(QuestionCategory)),
    onClick: PropTypes.func.isRequired,
    owlMessage: PropTypes.string.isRequired,
    userMessage: PropTypes.string.isRequired,
    injected: PropTypes.bool.isRequired,
    prevMessages: PropTypes.arrayOf(PropTypes.string)
};

export default HelpMenuBodyComponent;
