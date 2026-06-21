import bindAll from 'lodash.bindall';
import React from 'react';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import {TutorialCreation, Language, TestMessage} from './tutorial_creation';
import PropTypes from 'prop-types';
import styles from './tutorial_creation.css';
import deleteImage from '../../lib/assets/icon--delete.svg';

import classNames from 'classnames';
import PopUp from './pop_up.jsx';


const messages = defineMessages({
    addLanguageError: {
        id: 'gui.tutorialCreation.addLanguageError',
        defaultMessage: 'Selected Language already is set',
        description: 'Selection Error'
    },
    addLanguage: {
        id: 'gui.tutorialCreation.addLanguage',
        defaultMessage: 'Add Language',
        description: 'Add a Language'
    },
    removeLanguage: {
        id: 'gui.tutorialCreation.removeLanguage',
        defaultMessage: 'Remove Language',
        description: 'Tooltip for the button that removes a language from the tutorial'
    }
});

// Class for adding languages to the current tutorial
class TutorialCreationLanguages extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'handleAddLanguage',
            'handleOpenPopup',
            'handleLanguageSelect',
            'handleRemoveLanguage',
            'handleAbort'
        ]);
        this.state = {
            languages: this.props.tutorialCreation.languages,
            selectedLanguage: Language.ENGLISH,
            isPopupOpen: false
        };
    }

    // Method for opening the add popup
    handleOpenPopup () {
        this.setState({isPopupOpen: true});
    }

    // Method for adding a language from the popup
    handleAddLanguage () {
        // check if language is already added
        if (this.state.languages.includes(this.state.selectedLanguage)){
            // eslint-disable-next-line no-alert
            alert(this.props.intl.formatMessage(messages.addLanguageError));
        } else {
            this.state.languages.push(this.state.selectedLanguage);
            this.props.tutorialCreation.languages = this.state.languages;
            this.props.tutorialCreation.downloadMessages.push(
                new TestMessage(`downloadMessage${this.state.selectedLanguage.shortCode}`));
            this.setState({isPopupOpen: false});
        }
    }

    // Method for removing a language from the selected languages
    handleRemoveLanguage (lang) {
        if (this.state.languages.includes(lang)){
            const removed = this.state.languages.filter(item => item !== lang);
            this.setState({languages: removed});
            this.props.tutorialCreation.languages = this.state.languages;
        }
    }

    // Handler for language selection
    handleLanguageSelect (lang) {
        this.setState({selectedLanguage: Language[lang.target.value]});
    }

    // Handler for language abort
    handleAbort () {
        this.setState({languages: this.props.tutorialCreation.languages,
            selectedLanguage: Language.ENGLISH,
            isPopupOpen: false});
    }

    render () {
        return (
            <div>
                <div className={styles.centered}>
                    <table
                        style={{width: '50%'}}
                        className={styles.languagesTable}
                        id="tutorialCreationLanguages.languagesTable"
                    >
                        <thead>
                            <tr>
                                <th />
                                <th><FormattedMessage
                                    defaultMessage="Language"
                                    description="Language overview"
                                    id="gui.tutorialCreation.language"
                                /></th>
                                <th><FormattedMessage
                                    defaultMessage="Short Code"
                                    description="Language Short Code"
                                    id="gui.tutorialCreation.languageShortCode"
                                /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.languages.map(language => (<tr key={language.fullName}>
                                    <td>
                                        <div
                                            className={classNames(styles.hoverable, styles.removeButton)}
                                            title={this.props.intl.formatMessage(messages.removeLanguage)}
                                            // best way I could do it here
                                            /* eslint-disable-next-line react/jsx-no-bind */
                                            onClick={() => this.handleRemoveLanguage(language)}
                                        >
                                            <img
                                                src={deleteImage}
                                                alt={this.props.intl.formatMessage(messages.removeLanguage)}
                                                style={{
                                                    width: '20px',
                                                    height: '20px'
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td>{language.fullName}</td>
                                    <td>{language.shortCode}</td>
                                </tr>))
                            }
                        </tbody>
                    </table>
                    <button
                        style={{marginTop: '50px'}}
                        className={styles.button}
                        onClick={this.handleOpenPopup}
                    >
                        <FormattedMessage
                            defaultMessage="Add Language"
                            description="Add a Language"
                            id="gui.tutorialCreation.addLanguage"
                        />
                    </button>

                    <PopUp
                        name={this.props.intl.formatMessage(messages.addLanguage)}
                        open={this.state.isPopupOpen}
                        content={
                            <div>
                                <select
                                    className={classNames(styles.centered, styles.dropdown)}
                                    onChange={this.handleLanguageSelect}
                                >
                                    {
                                        Object.entries(Language).map(language => (
                                            <option
                                                value={language[0]}
                                                key={language[0]}
                                            >{language[1].fullName}</option>
                                        ))
                                    }
                                </select>

                                <div className={classNames(styles.popupActionItems, styles.flexRow)}>
                                    <button
                                        style={{marginRight: '10px', marginLeft: '10px'}}
                                        className={classNames(styles.button, styles.red)}
                                        onClick={this.handleAbort}
                                    >
                                        <FormattedMessage
                                            defaultMessage="Abort"
                                            description="Abort Language Adding"
                                            id="gui.tutorialCreation.abort"
                                        />
                                    </button>
                                    <button
                                        style={{marginRight: '10px', marginLeft: '10px'}}
                                        className={styles.button}
                                        onClick={this.handleAddLanguage}
                                    >
                                        <FormattedMessage
                                            defaultMessage="Add"
                                            description="Add the selected Language"
                                            id="gui.tutorialCreation.add"
                                        />
                                    </button>
                                </div>
                            </div>
                        }
                    />
                </div>
            </div>
        )
        ;
    }
}

TutorialCreationLanguages.propTypes = {
    tutorialCreation: PropTypes.instanceOf(TutorialCreation).isRequired,
    intl: intlShape
};


export default injectIntl(TutorialCreationLanguages);
