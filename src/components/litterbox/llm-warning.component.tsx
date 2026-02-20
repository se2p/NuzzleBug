import React from 'react';
import ReactTooltip from 'react-tooltip';
import {injectIntl} from 'react-intl';

interface LlmWarningComponentProps {
    intl: IntlShape;
}

const LlmWarningComponent = (props: LlmWarningComponentProps) => (
    <>
        <span
            style={{
                fontSize: '200%',
                fontWeight: 'bolder',
                color: 'red',
                border: 'solid',
                borderColor: 'gray',
                borderWidth: '1px',
                borderRadius: '10px',
                paddingLeft: '0.25rem',
                paddingRight: '0.25rem'
            }}
            data-tip={props.intl.formatMessage({
                id: 'gui.litterBox.gptDisclaimer',
                defaultMessage: 'Answers by GPT may be incorrect.<br>' +
                    'It might invent new blocks that don’t exist or make up new behaviour for existing blocks.<br>' +
                    'If a response by GPT does not make sense, you might know more about Scratch than GPT.'
            })}
        >
            {'!'}
        </span>
        <ReactTooltip multiline />
    </>
);

export default injectIntl(LlmWarningComponent);
