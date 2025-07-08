import PropTypes from 'prop-types';
import React, {useState} from 'react';
import styles from '../../styles/tutorial-cards.css';
import arrow from '../../images/icon--arrow-top.svg';

import logging from 'scratch-vm/src/util/logging.js';
import LitterBoxHint from '../../../litterbox/litterbox-hint.tsx';


const CodeQualityHints = props => {
    const {
        hints,
        onCodeQualityHintGeneration,
        codeQualityButtonTitle
    } = props;

    const [selectedType, setSelectedType] = useState('PERFUME');
    const [index, setIndex] = useState(0);
    const [hasHints, setHasHints] = useState({
        hasBugs: hints.filter(hint => hint.type === 'BUG').length > 0,
        hasSmells: hints.filter(hint => hint.type === 'SMELL').length > 0,
        hasPerfumes: hints.filter(hint => hint.type === 'PERFUME').length > 0
    });

    const newHints = () => {
        const hasBugs = hints.filter(hint => hint.type === 'BUG').length > 0;
        const hasSmells = hints.filter(hint => hint.type === 'SMELL').length > 0;
        const hasPerfumes = hints.filter(hint => hint.type === 'PERFUME').length > 0;
        setHasHints({
            hasBugs: hasBugs,
            hasSmells: hasSmells,
            hasPerfumes: hasPerfumes
        });
    };

    const nextHint = i => {
        const filteredHints = hints.filter(hint => hint.type === selectedType);
        if (i + 1 < filteredHints.length) {
            setIndex(i + 1);
        } else {
            setIndex(0);
        }
    };

    const prevHint = i => {
        const filteredHints = hints.filter(hint => hint.type === selectedType);
        if (i - 1 < 0) {
            setIndex(filteredHints.length - 1);
        } else {
            setIndex(i - 1);
        }
    };

    const filterHintsByType = type => {
        // log the click event with scratchlog
        if (logging.isActive()) {
            const clickEventType = 'CODE_QUALITY_'.concat([type]);
            logging.logClickEvent('BUTTON', new Date(), clickEventType, null);
        }
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
                onClick={() => {
                    onCodeQualityHintGeneration();
                    newHints();
                }}
            >
                <span className={styles.stepTestingButtonTitle}>{codeQualityButtonTitle}</span>
            </div>
            {/* code quality hints box */}
            <div
                className={styles.codeQualityBox}
            >
                <div className={styles.hintTypeButtonContainer}>
                    {/* When this button is clicked, perfumes are displayed */}
                    <button
                        onClick={() => filterHintsByType('PERFUME')}
                        // disabled={!hasHints.hasPerfumes}
                        className={styles.hintTypeButton}
                        style={{
                            backgroundColor: hasHints.hasPerfumes ? 'green' : 'gray',
                            textDecorationLine: selectedType === 'PERFUME' ? 'underline' : 'none',
                            fontWeight: selectedType === 'PERFUME' ? 'bolder' : 'normal',
                            textDecorationThickness: '3px'
                        }}

                    >
                        {props.locale === 'de' ? 'Eleganter Code' : 'Good Code'}
                    </button>
                    {/* When this button is clicked, smells are displayed  */}
                    <button
                        onClick={() => filterHintsByType('SMELL')}
                        // disabled={!hasHints.hasSmells}
                        className={styles.hintTypeButton}
                        style={{
                            backgroundColor: hasHints.hasSmells ? 'orange' : 'gray',
                            textDecorationLine: selectedType === 'SMELL' ? 'underline' : 'none',
                            fontWeight: selectedType === 'SMELL' ? 'bolder' : 'normal',
                            textDecorationThickness: '3px'
                        }}
                    >
                        {'Smells'}
                    </button>
                    {/* When this button is clicked, bugs are displayed */}
                    <button
                        onClick={() => filterHintsByType('BUG')}
                        // disabled={!hasHints.hasBugs}
                        className={styles.hintTypeButton}
                        style={{
                            backgroundColor: hasHints.hasBugs ? 'red' : 'gray',
                            textDecorationLine: selectedType === 'BUG' ? 'underline' : 'none',
                            fontWeight: selectedType === 'BUG' ? 'bolder' : 'normal',
                            textDecorationThickness: '3px'
                        }}
                    >
                        {props.locale === 'de' ? 'Fehler' : 'Bugs'}
                    </button>
                </div>
                {/* this div contains the currently selected hint */}
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        lineHeight: 1.5
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
                        <button
                            onClick={() => prevHint(index)}
                            disabled={
                                (selectedType === 'BUG' && !hasHints.hasBugs) ||
                                (selectedType === 'SMELL' && !hasHints.hasSmells) ||
                                (selectedType === 'PERFUME' && !hasHints.hasPerfumes)
                            }
                            style={{
                                visibility: (hints.filter(hint => hint.type === selectedType).length > 1) ? 'visible' : 'hidden'
                            }}
                        >
                            <img
                                src={arrow}
                                draggable={false}
                                alt={'Arrow Left'}
                                className={styles.stepSolutionHeaderArrowLeft}
                            />
                        </button>
                    </div>
                    <div
                        style={{
                            width: '100%'
                        }}
                    >
                        {(selectedType === 'BUG' && hasHints.hasBugs) ||
                        (selectedType === 'SMELL' && hasHints.hasSmells) ||
                        (selectedType === 'PERFUME' && hasHints.hasPerfumes) ?
                            <LitterBoxHint
                                title={hints.filter(hint => hint.type === selectedType)[index].title}
                                sprite={hints.filter(hint => hint.type === selectedType)[index].sprite}
                                issueType={selectedType}
                                hintDescription={hints.filter(hint => hint.type === selectedType)[index].description}
                                scratchBlocksCode={hints.filter(hint => hint.type === selectedType)[index].codeSnippet}
                                locale={props.locale}
                            /> :
                            <span>{props.locale === 'de' ? 'Keine Hinweise verfügbar' : 'No hints available'}</span>
                        }
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
                        <button
                            onClick={() => nextHint(index)}
                            disabled={
                                (selectedType === 'BUG' && !hasHints.hasBugs) ||
                                (selectedType === 'SMELL' && !hasHints.hasSmells) ||
                                (selectedType === 'PERFUME' && !hasHints.hasPerfumes)
                            }
                            style={{
                                visibility: (
                                    hints.filter(hint => hint.type === selectedType).length > 1
                                ) ? 'visible' : 'hidden'
                            }}
                        >
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
        costume: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        codeSnippet: PropTypes.string
    })).isRequired,
    onCodeQualityHintGeneration: PropTypes.func.isRequired,
    codeQualityButtonTitle: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired
};

export default CodeQualityHints;
