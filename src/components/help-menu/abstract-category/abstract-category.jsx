import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl, intlShape} from 'react-intl';
import styles from './abstract-category.css';
import {QuestionCategory} from 'scratch-ir';
import AbstractCategoryButtonComponent from '../abstract-category-button/abstract-category-button.jsx';

const AbstractCategoryComponent = function (props) {
    const {
        abstractCategories,
        intl,
        onClick,
        category
    } = props;

    return (
        <div>
            <ul className={styles.categoryList}>
                {abstractCategories.map(abstractCategory => (
                    <li
                        key={abstractCategory.id}
                        className={styles.categoryListWrapItem}
                        style={category.color ? {
                            backgroundColor: category.color,
                            color: 'white'
                        } : null}
                    >
                        <div
                            className={styles.categoryListItem}
                        >
                            <AbstractCategoryButtonComponent
                                onClick={onClick}
                                message={intl.formatMessage(abstractCategory.message)}
                                category={abstractCategory}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>

    );
};

AbstractCategoryComponent.propTypes = {
    abstractCategories: PropTypes.arrayOf(PropTypes.instanceOf(QuestionCategory)),
    category: PropTypes.instanceOf(QuestionCategory),
    onClick: PropTypes.func.isRequired,
    intl: intlShape.isRequired
};

export default injectIntl(AbstractCategoryComponent);
