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
            data-tip={props.intl.formatMessage({id: 'gui.litterBox.gptDisclaimer'})}
        >
            {'!'}
        </span>
        <ReactTooltip multiline />
    </>
);

export default injectIntl(LlmWarningComponent);
