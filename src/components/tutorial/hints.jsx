import PropTypes from 'prop-types';
import React from 'react';

// import scratchblocks from 'scratchblocks';
// import ScratchBlocks from 'scratchblocks-react';
// import de from 'scratchblocks/locales/de.json';

// scratchblocks.loadLanguages({de});

const HintExplanation = props => (
    <div>
        <p>{props.hintExplanation}</p>
    </div>
);

HintExplanation.propTypes = {
    hintExplanation: PropTypes.string
};

const HintContent = props => (
    <div>{props.text}</div>
);

HintContent.propTypes = {
    text: PropTypes.string
};

export default HintContent;
