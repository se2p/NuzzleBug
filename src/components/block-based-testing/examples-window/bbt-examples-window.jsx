import React, {useState} from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import Box from '../../box/box.jsx';

import styles from './bbt-examples-window.css';
import cardStyles from '../../cards/card.css';

import shrinkIcon from '../../cards/icon--shrink.svg';
import expandIcon from '../../cards/icon--expand.svg';
import closeIcon from '../../cards/icon--close.svg';

import endOfGameImageEn from './images/endofgame_en.png';
import endOfGameImageDe from './images/endofgame_de.png';
import testMoveRightEn from './images/testmoveright_en.png';
import testMoveRightDe from './images/testmoveright_de.png';
import didCloneMoveImageEn from './images/didclonemove_en.png';
import didCloneMoveImageDe from './images/didclonemove_de.png';

import selectSpriteImage from './images/select-sprite.png';

const messages = defineMessages({
    headline: {
        id: 'gui.blockBasedTesting.examplesWindow.headline',
        defaultMessage: 'Block-Based Test Examples'
    },
    text: {
        id: 'gui.blockBasedTesting.examplesWindow.text',
        defaultMessage: 'Here are some examples of Block-Based Tests. ' +
            'You can insert them directly onto the workspace of ' +
            'the current sprite by clicking on the button. ' +
            'Make sure you have selected the correct sprite!'
    },
    insertThisTest: {
        id: 'gui.blockBasedTesting.examplesWindow.insertThisTest',
        defaultMessage: 'Insert this test!'
    },
    expand: {
        id: 'gui.cards.expand',
        defaultMessage: 'Expand'
    },
    shrink: {
        id: 'gui.cards.shrink',
        defaultMessage: 'Shrink'
    },
    close: {
        id: 'gui.cards.close',
        defaultMessage: 'Close'
    },
    didCloneMoveTitle: {
        id: 'gui.blockBasedTesting.examplesWindow.didCloneMoveTitle',
        defaultMessage: 'Testing with clones'
    },
    didCloneMoveDescription: {
        id: 'gui.blockBasedTesting.examplesWindow.didCloneMoveDescription',
        defaultMessage: 'Clones are often used in Scratch projects to create multiple copies of a sprite. ' +
            'They can be addressed by providing the clone number, where 0 is the original sprite ' +
            'and 1 is the first clone.'
    },
    endOfGameTitle: {
        id: 'gui.blockBasedTesting.examplesWindow.endOfGameTitle',
        defaultMessage: 'Complex test'
    },
    endOfGameDescription: {
        id: 'gui.blockBasedTesting.examplesWindow.endOfGameDescription',
        defaultMessage: 'An example for a more complex test that checks if a sprite says something ' +
            'starting with "S" after it touches red. It also checks if all the game ' +
            'scripts have stopped at the end.'
    },
    testMoveRightTitle: {
        id: 'gui.blockBasedTesting.examplesWindow.testMoveRightTitle',
        defaultMessage: 'Sprite movement when pressing key'
    },
    testMoveRightDescription: {
        id: 'gui.blockBasedTesting.examplesWindow.testMoveRightDescription',
        defaultMessage: 'To test if a sprite moves when a key is pressed, start with saving the current position. ' +
            'Then, programmatically press the key and hold it for a few seconds. ' +
            'Next, wait until the script that moves the sprite is done and ' +
            'check if the position has changed correctly compared to the initial position. ' +
            'Finally, restore the original state.'
    }
});

const BBTExamplesWindowComponent = props => {

    const [isExpanded, setExpanded] = useState(true);

    return (
        <Draggable bounds="parent">
            <Box className={styles.examplesWindow}>

                <Box className={styles.header}>

                    <Box className={styles.headerLeft}>
                        {props.intl.formatMessage(messages.headline)}
                    </Box>

                    <Box className={styles.headerRight}>

                        {isExpanded ? (
                            <div
                                className={cardStyles.allButton}
                                onClick={() => setExpanded(false)}
                            >
                                <img
                                    draggable={false}
                                    src={shrinkIcon}
                                />
                                {props.intl.formatMessage(messages.shrink)}
                            </div>
                        ) : (
                            <div
                                className={cardStyles.allButton}
                                onClick={() => setExpanded(true)}
                            >
                                <img
                                    draggable={false}
                                    src={expandIcon}
                                />
                                {props.intl.formatMessage(messages.expand)}
                            </div>
                        )}

                        <div
                            className={cardStyles.allButton}
                            onClick={props.onClose}
                        >
                            <img
                                draggable={false}
                                src={closeIcon}
                            />
                            {props.intl.formatMessage(messages.close)}
                        </div>
                    </Box>

                </Box>

                {isExpanded ? (
                    <>
                        <Box className={styles.middle}>
                            <Box className={styles.middleLeft}>
                                {props.intl.formatMessage(messages.text)}
                            </Box>

                            <Box className={styles.middleRight}>
                                <div>
                                    <img
                                        src={selectSpriteImage}
                                        draggable={false}
                                    />
                                </div>
                            </Box>
                        </Box>

                        <Box className={styles.body}>

                            <div className={styles.exampleEntry}>
                                <img
                                    src={props.intl.locale === 'de' ? testMoveRightDe : testMoveRightEn}
                                    draggable={false}
                                />
                                <div className={styles.exampleEntryDescription}>
                                    <div className={styles.exampleEntryDescriptionTitle}>
                                        {props.intl.formatMessage(messages.testMoveRightTitle)}
                                    </div>
                                    <div className={styles.exampleEntryDescriptionText}>
                                        {props.intl.formatMessage(messages.testMoveRightDescription)}
                                    </div>
                                    <button onClick={() => props.onClickExample(1)}>
                                        {props.intl.formatMessage(messages.insertThisTest)}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.exampleEntry}>
                                <img
                                    src={props.intl.locale === 'de' ? didCloneMoveImageDe : didCloneMoveImageEn}
                                    draggable={false}
                                />
                                <div className={styles.exampleEntryDescription}>
                                    <div className={styles.exampleEntryDescriptionTitle}>
                                        {props.intl.formatMessage(messages.didCloneMoveTitle)}
                                    </div>
                                    <div className={styles.exampleEntryDescriptionText}>
                                        {props.intl.formatMessage(messages.didCloneMoveDescription)}
                                    </div>
                                    <button onClick={() => props.onClickExample(2)}>
                                        {props.intl.formatMessage(messages.insertThisTest)}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.exampleEntry}>
                                <img
                                    src={props.intl.locale === 'de' ? endOfGameImageDe : endOfGameImageEn}
                                    draggable={false}
                                />
                                <div className={styles.exampleEntryDescription}>
                                    <div className={styles.exampleEntryDescriptionTitle}>
                                        {props.intl.formatMessage(messages.endOfGameTitle)}
                                    </div>
                                    <div className={styles.exampleEntryDescriptionText}>
                                        {props.intl.formatMessage(messages.endOfGameDescription)}
                                    </div>
                                    <button onClick={() => props.onClickExample(0)}>
                                        {props.intl.formatMessage(messages.insertThisTest)}
                                    </button>
                                </div>
                            </div>


                        </Box>


                    </>
                ) : null}
            </Box>
        </Draggable>
    );
};

BBTExamplesWindowComponent.propTypes = {
    intl: intlShape,
    onClose: PropTypes.func.isRequired,
    onClickExample: PropTypes.func.isRequired
};

export default injectIntl(BBTExamplesWindowComponent);
