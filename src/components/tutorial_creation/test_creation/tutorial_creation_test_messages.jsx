import bindAll from 'lodash.bindall';
import React from 'react';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import Input from '../../forms/input.jsx';
import styles from '../tutorial_creation.css';
import {TutorialCreation, TutorialTest} from '../tutorial_creation.ts';
import classNames from 'classnames';
import warnImage from '../../../lib/assets/icon--warn.svg';
import successImage from '../../../lib/assets/icon--success.svg';
import editImage from '../../../lib/assets/icon--edit.svg';
import PopUp from '../pop_up.jsx';
import 'easymde/dist/easymde.min.css';
import TutorialOutputText from '../../tutorial/tutorial-output-text.jsx';


const messages = defineMessages({
    remove: {
        id: 'gui.tutorialCreation.remove',
        defaultMessage: 'Remove',
        description: 'Remove'
    },
    edit: {
        id: 'gui.menuBar.edit',
        defaultMessage: 'Edit',
        description: 'Edit'
    },
    thumbnail: {
        id: 'gui.tutorialCreation.thumbnail',
        defaultMessage: 'Thumbnail',
        description: 'Thumbnail'
    },
    editStep: {
        id: 'gui.tutorialCreation.editStep',
        defaultMessage: 'Edit Step',
        description: 'Edit Step'
    }
});

// Class for output messages of individual tests
class TutorialCreationTestMessages extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'handleWhiskerMessage',
            'handleEditHint',
            'handleCloseDetailEdit',
            'handleUploadImage',
            'handleDescription',
            'handleStepName',
            'handleSolutionMessage'
        ]);

        this.state = {
            whiskerMessages: this.props.selectedTest.whiskerMessages,
            solutionMessages: this.props.selectedTest.solutionMessages,
            images: this.props.selectedTest.solutionImages,
            isPopupOpen: false,
            markdownLanguageIndex: 0,
            markdownIndex: 0,
            failureMessage: '',
            description: '',
            stepName: ''
        };
    }

    // Method to handle the change of the tests description
    handleDescription (event){
        this.setState({description: event.target.value});
    }

    // Method to handle the change of the tests name
    handleStepName (event) {
        this.setState({stepName: event.target.value});
    }

    // Method to handle the change of the tests whisker (failure) message
    // As this is done with markdown and languages it is a bit more complex
    handleWhiskerMessage (event) {
        // language index
        const languageIndex = event.target.dataset.language_index;
        // index of the test step
        const messageIndex = event.target.dataset.message_index;
        this.setState({
            markdownLanguageIndex: languageIndex,
            markdownIndex: messageIndex,
            failureMessage: this.state.whiskerMessages[languageIndex][messageIndex].failureMessage.markdown,
            description: this.state.whiskerMessages[languageIndex][messageIndex].description,
            stepName: this.state.whiskerMessages[languageIndex][messageIndex].name,
            isPopupOpen: true});
    }

    // Method to handle the change of the tests solution message
    handleSolutionMessage (event) {
        const languageIndex = event.target.dataset.language_index;
        const solutionMessages = this.state.solutionMessages;
        solutionMessages[languageIndex].markdown = event.target.value;
        this.setState({solutionMessages: solutionMessages});
        this.props.tutorialCreation.solutionMessages = solutionMessages;
    }

    // Method to handle changing of the markdown of the hint message in a markdown edit popup
    handleEditHint (markdown){
        this.setState({failureMessage: markdown.target.value});
    }

    // Method to handle closing the detail edit dialog
    handleCloseDetailEdit () {
        const newWhisker = this.state.whiskerMessages;
        newWhisker[this.state.markdownLanguageIndex][this.state.markdownIndex].failureMessage.markdown =
                this.state.failureMessage;
        newWhisker[this.state.markdownLanguageIndex][this.state.markdownIndex]
            .description = this.state.description;
        newWhisker[this.state.markdownLanguageIndex][this.state.markdownIndex].name = this.state.stepName;
        this.props.selectedTest.whiskerMessages = newWhisker;
        this.setState({whiskerMessages: newWhisker, isPopupOpen: false});
    }

    // Method to handle an image upload for a solution image
    handleUploadImage (event){
        const languageIndex = event.target.dataset.language_index;
        if (event.target.files && event.target.files[0]) {
            const img = event.target.files[0];
            const images = this.state.images;
            images[languageIndex] = URL.createObjectURL(img);
            this.setState({
                images: images
            });
            this.props.selectedTest.solutionImages = images;

        }
    }


    render () {
        return (
            <div>

                <div
                    className={classNames(styles.flexRow)}
                    style={{alignItems: 'flex-start', height: '28rem'}}
                >
                    <div
                        className={styles.scrollable}
                        style={{height: '100%'}}
                    >
                        {this.props.tutorialCreation.languages.map(((language, index) => (
                            <div
                                key={language.fullName}
                            >
                                <h3>
                                    {language.fullName}
                                </h3>
                                <hr
                                    className="solid"
                                    style={{width: '60%'}}
                                />
                                <div
                                    className={styles.inputContainer}
                                    style={{width: '100%'}}
                                >
                                    <div className={styles.inputDiv}>
                                        <p className={styles.output}>  <FormattedMessage
                                            defaultMessage="Solution Image"
                                            description="Solution Image"
                                            id="gui.tutorialCreation.solutionImage"
                                        />  </p>
                                        <label className={classNames(styles.imageUpload, styles.input)}>
                                            <input
                                                type="file"
                                                onChange={this.handleUploadImage}
                                                data-language_index={index}
                                            />
                                            <FormattedMessage
                                                defaultMessage="Upload Thumbnail"
                                                description="Upload Thumbnail"
                                                id="gui.tutorialCreation.uploadThumbnail"
                                            />
                                        </label>
                                    </div>
                                    <div>
                                        {this.state.whiskerMessages === null ||
                                        this.state.whiskerMessages.length === 0 ? null :
                                            this.state.whiskerMessages[index].map(((whiskerMessage, messageIndex) => (
                                                <div
                                                    className={styles.inputDiv}
                                                    key={`Whisker Message ${index}|${messageIndex}`}
                                                >
                                                    <p className={styles.output}>  {whiskerMessage.name}  </p>
                                                    <div
                                                        className={styles.input}
                                                        style={{padding: 0}}
                                                    >
                                                        {whiskerMessage.failureMessage.markdown === null ||
                                                        whiskerMessage.failureMessage.markdown === '' ?
                                                            <img
                                                                className={classNames(styles.removeButton,
                                                                    styles.margined)}
                                                                src={warnImage}
                                                                style={{
                                                                    width: '20px',
                                                                    height: '20px'
                                                                }}
                                                                alt={this.props.intl.formatMessage(messages.remove)}
                                                            /> : <img
                                                                className={classNames(styles.removeButton,
                                                                    styles.margined)}
                                                                src={successImage}
                                                                style={{
                                                                    width: '20px',
                                                                    height: '20px'
                                                                }}
                                                                alt={this.props.intl.formatMessage(messages.remove)}
                                                            />}
                                                        <div
                                                            className={classNames(styles.hoverable, styles.removeButton,
                                                                styles.margined)}
                                                            onClick={this.handleWhiskerMessage}
                                                            data-language_index={index}
                                                            data-message_index={messageIndex}
                                                        >
                                                            <img
                                                                src={editImage}
                                                                style={{
                                                                    width: '20px',
                                                                    height: '20px'
                                                                }}
                                                                data-language_index={index}
                                                                data-message_index={messageIndex}
                                                                alt={this.props.intl.formatMessage(messages.edit)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )))}
                                        <div className={styles.inputDivVertical}>
                                            <p className={styles.output}> <FormattedMessage
                                                defaultMessage="Solution Message"
                                                description="Solution Message"
                                                id="gui.tutorialCreation.solutionMessage"
                                            />  </p>
                                            <textarea
                                                className={styles.inputTextarea}
                                                value={this.state.solutionMessages[index].markdown}
                                                onChange={this.handleSolutionMessage}
                                                data-language_index={index}
                                                wrap="hard"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )))}
                    </div>
                    <div
                        className={classNames(styles.previewDiv, styles.flexColumn)}
                        style={{
                            marginLeft: '50px',
                            minWidth: '300px'
                        }}
                    >
                        <h2 className={styles.previewHeader}>
                            <FormattedMessage
                                defaultMessage="Preview"
                                description="Preview"
                                id="gui.tutorialCreation.preview"
                            /></h2>
                        <div
                            className={styles.preview}
                            style={{maxHeight: '400px', overflowY: 'scroll', overflowX: 'hidden'}}
                        >
                            <img
                                src={this.state.images[0]}
                                className={styles.thumbnail}
                                alt={this.props.intl.formatMessage(messages.thumbnail)}
                            />
                            <TutorialOutputText
                                content={this.state.solutionMessages[0].markdown}
                            />
                        </div>
                    </div>
                </div>
                <PopUp
                    name={this.props.intl.formatMessage(messages.editStep)}
                    open={this.state.isPopupOpen}
                    content={
                        <div>
                            <div
                                className={styles.inputContainer}
                                style={{width: '100%'}}
                            >
                                <div className={styles.inputDiv}>
                                    <p className={styles.output}> <FormattedMessage
                                        defaultMessage="Step Name"
                                        description="Step Name"
                                        id="gui.tutorialCreation.stepName"
                                    />  </p>
                                    <Input
                                        className={styles.input}
                                        value={this.state.stepName}
                                        onChange={this.handleStepName}
                                    />
                                </div>
                                <div className={styles.inputDiv}>
                                    <p className={styles.output}>  <FormattedMessage
                                        defaultMessage="Step Description"
                                        description="Step Description"
                                        id="gui.tutorialCreation.stepDescription"
                                    />   </p>
                                    <Input
                                        className={styles.input}
                                        value={this.state.description}
                                        onChange={this.handleDescription}
                                    />
                                </div>
                            </div>
                            <div className={styles.inputDivVertical}>
                                <p className={styles.output}>  <FormattedMessage
                                    defaultMessage="Hint"
                                    description="Hint"
                                    id="gui.tutorialCreation.hint"
                                />   </p>
                                <textarea
                                    className={styles.inputTextarea}
                                    value={this.state.failureMessage}
                                    onChange={this.handleEditHint}
                                    wrap="hard"
                                />
                            </div>
                            <div className={classNames(styles.popupActionItems, styles.flexRow)}>
                                <button
                                    style={{marginRight: '10px', marginLeft: '10px'}}
                                    className={styles.button}
                                    onClick={this.handleCloseDetailEdit}
                                >
                                    <FormattedMessage
                                        defaultMessage="Finish"
                                        description="Finish"
                                        id="gui.tutorialCreation.finish"
                                    />
                                </button>
                            </div>
                        </div>
                    }
                />
            </div>

        )
        ;
    }
}

TutorialCreationTestMessages.propTypes = {
    selectedTest: PropTypes.instanceOf(TutorialTest).isRequired,
    tutorialCreation: PropTypes.instanceOf(TutorialCreation).isRequired,
    intl: intlShape
};


export default injectIntl(TutorialCreationTestMessages);
