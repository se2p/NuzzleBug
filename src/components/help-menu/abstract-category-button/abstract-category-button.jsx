import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Button from "../../button/button.jsx";
import {QuestionCategory} from "scratch-ir";
import styles from "../../interrogative-debugging/version-2/ir-question-category/ir-question-category.css";


const AbstractCategoryButtonComponent = function (props) {
    const {
        className,
        onClick,
        message,
        category
    } = props;

    return (
        <div>
            <Button
                className={classNames(
                    className,
                    //styles.helpMenuButton,

                )}
                onClick={() => onClick(category)}
            >
                <div className={styles.categoryText}>
                    {message}
                </div>
            </Button>
        </div>
    );
};

AbstractCategoryButtonComponent.propTypes = {
    category: PropTypes.instanceOf(QuestionCategory),
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    message: PropTypes.string
};

export default AbstractCategoryButtonComponent;
