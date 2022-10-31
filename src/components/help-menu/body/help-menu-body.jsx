import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './help-menu-body.css';
import Owl from '../owl/help-menu-owl.jsx';
import {QuestionCategory} from 'scratch-ir';
import AbstractCategoryComponent from '../abstract-category/abstract-category.jsx';

const HelpMenuBodyComponent = function (props) {
    const {
        abstractCategories,
        onClick,
        message,
        injected,
        chooseQuestionType
    } = props;

    return (
        <div
            className={styles.body}
        >
            <div className={styles.menu}>
                <div
                    className={styles.owlArea}
                >
                    <div className={styles.owl}>
                        <Owl
                            injected={injected}
                            onSubmit={print}
                            enabled={false}
                            text={message}
                        />
                    </div>
                </div>
                {abstractCategories && abstractCategories.length > 0 ? (
                    <div
                        className={styles.category}
                    >
                        <div
                            className={classNames(styles.speechBubbleBox, styles.speechBubbleTriangle)}
                        >
                            <div
                                id="help-messages"
                                className={styles.helpMessages}
                            >
                                <div>
                                    {'text'}
                                </div>
                                <ul className={styles.categoryList}>
                                    {abstractCategories.map(category => (
                                        <li
                                            key={category.id}
                                        >
                                            {category.questionCategories && category.questionCategories.length ? (
                                                <AbstractCategoryComponent
                                                    onClick={onClick}
                                                    category={category}
                                                    abstractCategories={category.questionCategories}
                                                />) : null}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>) : null}
            </div>
        </div>

    );
};

HelpMenuBodyComponent.propTypes = {
    abstractCategories: PropTypes.arrayOf(PropTypes.instanceOf(QuestionCategory)),
    chooseQuestionType: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    injected: PropTypes.bool.isRequired
};

export default HelpMenuBodyComponent;
