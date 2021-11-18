import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Draggable from 'react-draggable';
import {injectIntl, intlShape} from 'react-intl';
import bindAll from 'lodash.bindall';

import {QuestionCategory} from 'scratch-ir';

import IRHeader from '../ir-header/ir-header.jsx';
import IRQuestionHierarchy from '../ir-question-hierarchy/ir-question-hierarchy.jsx';
import IRAnswer from '../ir-answer/ir-answer.jsx';
import cardStyles from '../../../cards/card.css';
import styles from './ir-debugger.css';

class IRDebugger extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'handleQuestionClick'
        ]);
        this.state = {
            selectedQuestion: null
        };
    }

    handleQuestionClick (question) {
        this.setState(() => ({
            selectedQuestion: question
        }));
    }

    render () {
        const {
            target,
            questionHierarchy,
            expanded,
            handleRefresh,
            onClose,
            onShrinkExpand,
            onDrag,
            onStartDrag,
            onEndDrag,
            ...posProps
        } = this.props;
    
        let {x, y} = posProps;
        const cardHorizontalDragOffset = 800; // ~80% of card width
        const cardVerticalDragOffset = expanded ? 400 : 0; // ~80% of card height
        const menuBarHeight = 48;
        if (x === 0 && y === 0) {
            x = 292 + cardHorizontalDragOffset;
            y = 50;
        }
    
        return (
            <div>
                {expanded ? (
                    <div
                        className={styles.overlay}
                        style={{
                            width: `${window.innerWidth + (2 * cardHorizontalDragOffset)}px`,
                            height: `${window.innerHeight - menuBarHeight + cardVerticalDragOffset}px`,
                            top: 0,
                            left: 0
                        }}
                    />
                ) : null}
                <div
                    className={cardStyles.cardContainerOverlay}
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
                        <div className={cardStyles.cardContainer}>
                            <div className={classNames(cardStyles.card, styles.card)}>
                                <IRHeader
                                    target={target}
                                    expanded={expanded}
                                    onRefresh={handleRefresh}
                                    onClose={onClose}
                                    onShrinkExpand={onShrinkExpand}
                                />
                                <div className={expanded ? styles.body : cardStyles.hidden}>
                                    <div className={styles.questionHierarchy}>
                                        <IRQuestionHierarchy
                                            questionHierarchy={questionHierarchy}
                                            selectedQuestion={this.state.selectedQuestion}
                                            onQuestionClick={this.handleQuestionClick}
                                        />
                                    </div>
                                    <div className={styles.answer}>
                                        <IRAnswer selectedQuestion={this.state.selectedQuestion} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Draggable>
                </div>
            </div>
        );
    }
}

IRDebugger.propTypes = {
    intl: intlShape.isRequired,
    target: PropTypes.shape({
        getName: PropTypes.func.isRequired,
        isStage: PropTypes.bool.isRequired
    }).isRequired,
    questionHierarchy: PropTypes.arrayOf(PropTypes.instanceOf(QuestionCategory)),
    expanded: PropTypes.bool.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    handleRefresh: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onShrinkExpand: PropTypes.func.isRequired,
    onStartDrag: PropTypes.func,
    onDrag: PropTypes.func,
    onEndDrag: PropTypes.func
};

export default injectIntl(IRDebugger);
