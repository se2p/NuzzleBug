import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './help-menu-body.css';
import Owl from "../owl/help-menu-owl.jsx";
import {QuestionCategory} from "scratch-ir";
import AbstractCategoryComponent from "../abstract-category/abstract-category.jsx";

const HelpMenuBodyComponent = function (props) {
    const {
        abstractCategories,
        onClick,
        message
    } = props;

    return (
        <div>
            <Owl onSubmit={print} enabled={false} text={message}/>
            {abstractCategories ? (
                <div className={styles.category}>
                    <ul className={styles.categoryList}>
                        {abstractCategories.map(category => (
                            <li
                                key={category.id}
                            >
                                {category.questionCategories && category.questionCategories.length ? (
                                <AbstractCategoryComponent
                                    onClick={onClick}
                                    category = {category}
                                    abstractCategories={category.questionCategories}
                                />):null}
                            </li>
                        ))}
                    </ul>
                </div>):null}
        </div>

    );
};

HelpMenuBodyComponent.propTypes = {
    abstractCategories: PropTypes.arrayOf(PropTypes.instanceOf(QuestionCategory)),
    onClick: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired
};

export default HelpMenuBodyComponent;
