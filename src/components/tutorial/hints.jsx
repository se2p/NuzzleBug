import PropTypes from 'prop-types';
import React from 'react';
import styles from './tutorial-cards.css';

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

const HintContent = props => {
    const {
        hints,
        onCodeQualityHintGeneration,
        codeQualityButtonTitle
    } = props;
    return (
        <div>
            <div
                className={styles.stepCodeQualityHintGeneration}
                onClick={onCodeQualityHintGeneration}
            >
                <span className={styles.stepTestingButtonTitle}>{codeQualityButtonTitle}</span>
            </div>
            <div>
                {hints.map((hint, index) => (
                    <div key={index}>
                        <h3>{hint.title}</h3>
                        <p>{hint.description}</p>
                    </div>
                ))}
            </div>
        </div>

    );
};

HintContent.propTypes = {
    hints: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        sprite: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        codeSnippet: PropTypes.string
    })).isRequired,
    onCodeQualityHintGeneration: PropTypes.func.isRequired,
    codeQualityButtonTitle: PropTypes.string.isRequired
};

export default HintContent;
