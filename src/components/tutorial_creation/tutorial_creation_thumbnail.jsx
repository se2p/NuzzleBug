import bindAll from 'lodash.bindall';
import React from 'react';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import {Difficulty, TutorialCreation} from './tutorial_creation';
import PropTypes from 'prop-types';
import Input from '../forms/input.jsx';
import styles from './tutorial_creation.css';

import classNames from 'classnames';
import Tutorial from '../tutorial/tutorial-menu-item.jsx';


const messages = defineMessages({
    name: {
        id: 'gui.tutorialCreation.name',
        defaultMessage: 'Name',
        description: 'Name'
    }
});

// Class for setting the tutorial thumbnail and name
class TutorialCreationThumbnail extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'handleName',
            'handleImageChange',
            'handleDifficultySelect'
        ]);
        this.state = {
            thumbnail: this.props.tutorialCreation.thumbnail,
            names: this.props.tutorialCreation.names,
            difficulty: this.props.tutorialCreation.difficulty
        };
    }

    // Method to handle a thumbnail upload
    handleImageChange (event) {
        if (event.target.files && event.target.files[0]) {
            const img = URL.createObjectURL(event.target.files[0]);
            this.setState({
                thumbnail: img
            });
            this.props.tutorialCreation.thumbnail = img;
        }
    }

    // Method to handle name input
    handleName (event) {
        const languageIndex = event.target.dataset.language_index;
        const names = this.state.names;
        names[languageIndex] = event.target.value;
        this.setState({names: names});
        this.props.tutorialCreation.names = names;
        this.props.tutorialCreation.name = `${event.target.value.toString().toLowerCase()}_${Date.now()}`;


    }

    // Method for handling a difficulty selection
    handleDifficultySelect (event) {
        const diff = Difficulty[event.target.value];
        this.setState({difficulty: diff});
        this.props.tutorialCreation.difficulty = diff;
    }


    render () {
        return (<div
            className={classNames(styles.flexRow, styles.scrollable)}
            style={{alignItems: 'stretch', height: '100%'}}
        >
            <div className={styles.centered}>
                <img
                    src={this.state.thumbnail}
                    className={styles.thumbnail}
                />
                <div className={styles.inputContainer}>
                    <div className={styles.inputDiv}>
                        <p className={styles.output}>
                            <FormattedMessage
                                defaultMessage="Thumbnail"
                                description="Thumbnail"
                                id="gui.tutorialCreation.thumbnail"
                            />  </p>
                        <label className={classNames(styles.imageUpload, styles.input)}>
                            <input
                                type="file"
                                onChange={this.handleImageChange}
                            />
                            <FormattedMessage
                                defaultMessage="Upload Thumbnail"
                                description="Upload Thumbnail"
                                id="gui.tutorialCreation.uploadThumbnail"
                            />
                        </label>
                    </div>
                    <div className={styles.inputDiv}>
                        <p className={styles.output}>   <FormattedMessage
                            defaultMessage="Difficulty"
                            description="Difficulty"
                            id="gui.tutorialCreation.difficulty"
                        />   </p>
                        <select
                            className={classNames(styles.centered, styles.dropdown, styles.input)}
                            onChange={this.handleDifficultySelect}
                        >
                            {
                                Object.entries(Difficulty).map(diff => (<option
                                    value={diff[0]}
                                    key={diff[0]}
                                >{diff[1].message}</option>))
                            }
                        </select>
                    </div>
                    {this.props.tutorialCreation.languages.map((language, index) => (
                        <div
                            key={`name${language.shortCode}`}
                            className={styles.inputDiv}
                        >
                            <p className={styles.output}>
                                {`${this.props.intl.formatMessage(messages.name)} ${language.fullName} :`}  </p>
                            <Input
                                className={styles.input}
                                value={this.state.names[index] ?? ''}
                                onChange={this.handleName}
                                data-language_index={index}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className={classNames(styles.previewDiv, styles.flexColumn)}>
                <h2 className={styles.previewHeader}>
                    <FormattedMessage
                        defaultMessage="Preview"
                        description="Preview Window"
                        id="gui.tutorialCreation.preview"
                    /></h2>
                <div className={styles.preview}>
                    <Tutorial
                        key={'preview'}
                        content={{
                            title: this.state.names[0] ?? '',
                            id: 'preview',
                            img: this.state.thumbnail,
                            difficulty: this.state.difficulty === null ? '' : this.state.difficulty.name,
                            difficultyMsg: this.state.difficulty === null ? '' : this.state.difficulty.message,
                            totalSteps: 2
                        }}
                        // Cleanest way to define an empty function
                        /* eslint-disable-next-line react/jsx-no-bind */
                        onSelect={() => {}}
                    />
                </div>
            </div>
        </div>)
        ;
    }
}

TutorialCreationThumbnail.propTypes = {
    tutorialCreation: PropTypes.instanceOf(TutorialCreation).isRequired,
    intl: intlShape
};


export default injectIntl(TutorialCreationThumbnail);
