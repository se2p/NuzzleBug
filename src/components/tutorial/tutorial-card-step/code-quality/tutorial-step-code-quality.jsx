import PropTypes from 'prop-types';
import React, {useState} from 'react';
import styles from '../../styles/tutorial-cards.css';
import stylesHints from '../../styles/tutorial-code-quality.css';
import arrow from '../../images/icon--arrow-top.svg';

import scratchblocks from 'scratchblocks';
import ScratchBlocks from 'scratchblocks-react';
import de from 'scratchblocks/locales/de.json';
// import en from 'scratchblocks/locales/en.json';

scratchblocks.loadLanguages({de});


const translate = scratchBlocksText => {
    const block = scratchblocks.parse(scratchBlocksText, {
        languages: ['en'] // , 'de'
    });
    // block.translate(scratchblocks.allLanguages.en);
    return block.stringify();
};

const ScratchBlocksImage = props => (
    <div className={stylesHints.scratchImage}>
        <ScratchBlocks
            blockStyle="scratch3"
            languages={['en']} // , 'de'
        >
            {translate(props.scratchBlocksText)}
        </ScratchBlocks>
    </div>
);

ScratchBlocksImage.propTypes = {
    scratchBlocksText: PropTypes.string
};

const CodeQualityHints = props => {
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
                                <br/>
                                {line}
                            </React.Fragment>
                        ))}
                </React.Fragment>
            )
        ));

    const [selectedType, setSelectedType] = useState(null);
    const [index, setIndex] = useState(0);

    const nextHint = i => {
        const filteredHints = hints.filter(hint => selectedType === null || hint.type === selectedType);
        if (i + 1 < filteredHints.length) {
            setIndex(i + 1);
        } else {
            setIndex(0);
        }

    };

    const prevHint = i => {
        const filteredHints = hints.filter(hint => selectedType === null || hint.type === selectedType);
        if (i - 1 < 0) {
            setIndex(filteredHints.length - 1);
        } else {
            setIndex(i - 1);
        }

    };

    const filterHintsByType = type => {
        setSelectedType(type);
        setIndex(0);
    };

    return (
        <div
            style={{
                paddingLeft: '5%',
                paddingRight: '3%'
            }}
        >
            {/* check code quality button */}
            <div
                className={styles.stepCodeQualityHintGeneration}
                onClick={onCodeQualityHintGeneration}
            >
                <span className={styles.stepTestingButtonTitle}>{codeQualityButtonTitle}</span>
            </div>
            {/* code quality hints box */}
            <div
                className={styles.codeQualityBox}
            >
                <div className={styles.hintTypeButtonContainer}>
                    <button
                        onClick={() => filterHintsByType('SMELL')}
                        className={styles.hintTypeButton}
                    >
                        {'Show SMELL Hints'}
                    </button>
                    <button
                        onClick={() => filterHintsByType('BUG')}
                        className={styles.hintTypeButton}
                    >
                        {'Show BUG Hints'}
                    </button>
                    <button
                        onClick={() => filterHintsByType('PERFUME')}
                        className={styles.hintTypeButton}
                    >
                        {'Show PERFUME Hints'}
                    </button>
                </div>

                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            height: '380px',
                            paddingRight: '3px'
                        }}
                    >
                        <button onClick={() => prevHint(index)}>
                            <img
                                src={arrow}
                                draggable={false}
                                alt={'Arrow Left'}
                                className={styles.stepSolutionHeaderArrowLeft}
                            />
                        </button>
                    </div>
                    {/* {filteredHints.map((hint, index) => ( */}
                    {/*     <div key={index}> */}

                    {/*     </div> */}
                    {/* ))} */}

                    <div
                        style={{
                            width: '100%'
                        }}
                    >
                        <h3
                            style={{
                                width: '100%',
                                alignContent: 'center'
                            }}
                        >
                            <br />
                            {hints[index].title}
                        </h3>
                        <div
                            style={{
                                display: 'flex',
                                width: '563.93px'
                            }}
                        >
                            <div
                                style={{
                                    flex: 1,
                                    border: '2px',
                                    minHeight: '250px',
                                    maxHeight: '92%',
                                    borderStyle: 'dashed none dashed dashed',
                                    borderWidth: '2px',
                                    maxWidth: '260px',
                                    padding: '2%'
                                }}
                            >
                                {replaceTags(hints[index].description)}
                            </div>
                            <div
                                style={{
                                    flex: 1,
                                    border: '2px',
                                    minHeight: '250px',
                                    maxHeight: '92%',
                                    borderStyle: 'dashed',
                                    borderWidth: '2px',
                                    maxWidth: '260px',
                                    padding: '2%'
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: '200px'
                                    }}
                                >
                                    <ScratchBlocksImage
                                        scratchBlocksText={hints[index].codeSnippet}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            height: '380px',
                            paddingLeft: '3px'
                        }}
                    >
                        <button onClick={() => nextHint(index)}>
                            <img
                                src={arrow}
                                draggable={false}
                                alt={'Arrow Right'}
                                className={styles.stepSolutionHeaderArrowRight}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

CodeQualityHints.propTypes = {
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

export default CodeQualityHints;
