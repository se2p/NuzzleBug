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
    <div>
        {props.text.map((element, index) => (
            <div key={index}>{element}</div>
        ))}
    </div>
);

HintContent.propTypes = {
    hints: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.number.isRequired,
        sprite: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        codeSnippet: PropTypes.string
    })).isRequired
};

export default HintContent;
