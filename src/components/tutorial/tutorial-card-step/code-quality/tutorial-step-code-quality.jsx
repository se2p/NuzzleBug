import PropTypes from 'prop-types';
import React, {useState} from 'react';
import styles from '../../styles/tutorial-cards.css';
import stylesHints from '../../styles/tutorial-code-quality.css';


import scratchblocks from 'scratchblocks';
import ScratchBlocks from 'scratchblocks-react';
import de from 'scratchblocks/locales/de.json';

scratchblocks.loadLanguages({de});


const translate = scratchBlocksText => {
    const block = scratchblocks.parse(scratchBlocksText, {
        languages: ['en', 'de']
    });
    block.translate(scratchblocks.allLanguages.de);
    return block.stringify();
};

const ScratchBlocksImage = props => (
    <div className={stylesHints.scratchImage}>
        <ScratchBlocks
            blockStyle="scratch3"
            languages={['en', 'de']}
        >
            {translate(props.scratchBlocksText)}
        </ScratchBlocks>
    </div>
);

ScratchBlocksImage.propTypes = {
    scratchBlocksText: PropTypes.string
};

const HintContent = props => {
    const {
        hints,
        onCodeQualityHintGeneration,
        codeQualityButtonTitle
    } = props;

    const replaceTags = text => text.split(/\[b\]/g)
        .map((segment, index) => (
            index === 0 ? (
                <span key={index}>{segment}</span>
            ) : (
                <React.Fragment key={index}>
                    <strong>{segment.split(/\[\/b\]/g)[0]}</strong>
                    {segment.split(/\[\/b\]/g)[1].split(/\[newLine\]/g)
                        .map((line, lineIndex) => (
                            <React.Fragment key={lineIndex}>
                                <br />
                                {line}
                            </React.Fragment>
                        ))}
                </React.Fragment>
            )
        ));

    const [isAccordionOpen, setIsAccordionOpen] = useState(true);
    const [selectedType, setSelectedType] = useState(null);

    const toggleAccordion = () => {
        setIsAccordionOpen(!isAccordionOpen);
    };

    const filterHintsByType = type => {
        setSelectedType(type);
    };

    const filteredHints = hints.filter(hint => selectedType === null || hint.type === selectedType);

    return (
        <div>
            <div>
                <button onClick={() => filterHintsByType('SMELL')}>Show SMELL Hints</button>
                <button onClick={() => filterHintsByType('BUG')}>Show BUG Hints</button>
                <button onClick={() => filterHintsByType('PERFUME')}>Show PERFUME Hints</button>
            </div>
            <div
                className={styles.stepCodeQualityHintGeneration}
                onClick={onCodeQualityHintGeneration}
            >
                <span className={styles.stepTestingButtonTitle}>{codeQualityButtonTitle}</span>
            </div>
            {isAccordionOpen && (
                <div>
                    {filteredHints.map((hint, index) => (
                        <div key={index}>
                            <h3>{hint.title}</h3>
                            {replaceTags(hint.description)}
                            <ScratchBlocksImage scratchBlocksText={hint.codeSnippet}/>
                        </div>
                    ))}
                </div>
            )}
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
