import PropTypes from 'prop-types';
import React from 'react';

import scratchblocks from 'scratchblocks';
import ScratchBlocks from 'scratchblocks-react';
import de from 'scratchblocks/locales/de.json';

import styles from './hints-explanation-card.css';

scratchblocks.loadLanguages({de});

const ScratchBlocksImage = props => (
    <div className={styles.scratchImage}>
        <ScratchBlocks
            blockStyle="scratch3"
            languages={['en', 'de']}
        >
            {props.scratchBlocksText}
        </ScratchBlocks>
    </div>
);

ScratchBlocksImage.propTypes = {
    scratchBlocksText: PropTypes.string
};

const HintExplanation = props => (
    <div className={styles.hintExplanation}>
        <h3 className={styles.hintExplanationHead}>{props.hintId.value}{': '}{props.hintType}</h3>
        <p className={styles.hintExplanationText}>
            {props.explanation.comment}
        </p>
        {'Vorher:'}
        {props.scratchBlocksBefore ? <ScratchBlocksImage scratchBlocksText={props.scratchBlocksBefore.value} /> : ''}
        {'Nachher:'}
        {props.scratchBlocksAfter ? <ScratchBlocksImage scratchBlocksText={props.scratchBlocksAfter.value} /> : ''}
    </div>
);

HintExplanation.propTypes = {
    hintId: PropTypes.shape({
        value: PropTypes.number
    }),
    hintType: PropTypes.string,
    explanation: PropTypes.shape({
        comment: PropTypes.string
    }),
    scratchBlocksBefore: PropTypes.shape({
        value: PropTypes.string
    }),
    scratchBlocksAfter: PropTypes.shape({
        value: PropTypes.string
    })
};

const ActorHints = props => (
    <details>
        <summary>{props.actorName.name}</summary>
        {
            props.explanations.map(explanation =>
                (<HintExplanation
                    key={explanation.hintId.value}
                    hintId={explanation.hintId}
                    hintType={explanation.hintType}
                    explanation={explanation.explanation}
                    scratchBlocksBefore={explanation.scratchBlocksBefore}
                    scratchBlocksAfter={explanation.scratchBlocksAfter}
                />)
            )
        }
    </details>
);

ActorHints.propTypes = {
    actorName: PropTypes.shape({
        name: PropTypes.string
    }),
    explanations: PropTypes.arrayOf(PropTypes.object)
};

export {
    ActorHints,
    HintExplanation,
    ScratchBlocksImage
};
