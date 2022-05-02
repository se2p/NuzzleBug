import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl, FormattedHTMLMessage} from 'react-intl';
import classNames from 'classnames';

import scratchblocks from 'scratchblocks';

import {QuestionV2 as Question} from 'scratch-ir';

import styles from './ir-selected-question.css';
import irStyles from '../ir-styles.css';

class IRSelectedQuestion extends React.Component {

    constructor (props) {
        super(props);
        this.state = {};
    }

    componentDidMount () {
        this.renderScratchBlocks();
    }

    componentDidUpdate (prevProps) {
        if (prevProps.selectedQuestion !== this.props.selectedQuestion) {
            this.renderScratchBlocks();
        }
    }

    renderScratchBlocks () {
        scratchblocks.renderMatching('#selectedQuestion code.scratchBlock', {
            inline: true,
            style: 'scratch3',
            languages: ['en', 'de'],
            scale: 0.55
        });
    }

    render () {
        const {
            selectedQuestion
        } = this.props;
        return (
            <div>
                {selectedQuestion ? (
                    <div>
                        <div
                            id="selectedQuestion"
                            className={classNames(
                                styles.selectedQuestion,
                                irStyles[`color-${selectedQuestion.color.replace('#', '')}`]
                            )}
                        >
                            {selectedQuestion.messages.map((message, index) => (
                                message.scratchBlock ?
                                    <code
                                        key={index}
                                        className="scratchBlock"
                                    >
                                        {message.scratchBlock}
                                    </code> :
                                    <FormattedHTMLMessage
                                        key={index}
                                        tagName="span"
                                        {...message}
                                    />
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

IRSelectedQuestion.propTypes = {
    selectedQuestion: PropTypes.instanceOf(Question)
};

export default injectIntl(IRSelectedQuestion);
