import bindAll from 'lodash.bindall';
import React from 'react';
import {FormattedMessage, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import styles from '../tutorial_creation.css';
import {TutorialCreation, TutorialTest} from '../tutorial_creation.ts';
import classNames from 'classnames';
import Instructions from '../preview-instructions.jsx';
import Input from '../../forms/input.jsx';

/*
https://stackoverflow.com/questions/51272255/how-to-use-filereader-in-react
https://hatchjs.com/read-file-in-react-js/
https://stackoverflow.com/questions/32794062/parse-data-from-json-in-reactjs
 */

// Class for the basics (name, thumbnail) of a tutorial test
class TutorialCreationTestBasics extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'handleUploadImage',
            'handleName',
            'handleMessageBottom'
        ]);

        this.state = {
            thumbnail: this.props.selectedTest.image,
            filename: null,
            file: null,
            names: this.props.selectedTest.names,
            messagesBottom: this.props.selectedTest.messageBottom

        };
    }

    // Method to handle the name setting event
    handleName (event) {
        const languageIndex = event.target.dataset.language_index;
        const newNames = this.state.names;
        newNames[languageIndex] = event.target.value;
        this.setState({names: newNames});
        this.props.selectedTest.names = newNames;
    }

    // Method to handle the image upload event
    handleUploadImage (event){
        if (event.target.files && event.target.files[0]) {
            const img = event.target.files[0];
            this.setState({
                thumbnail: URL.createObjectURL(img)
            }, () => {
                this.props.selectedTest.image = this.state.thumbnail;
            });

        }
    }

    // Method to handle the description
    handleMessageBottom (event) {
        const languageIndex = event.target.dataset.language_index;
        const messagesBottom = this.state.messagesBottom;
        messagesBottom[languageIndex].markdown = event.target.value;
        this.setState({messagesBottom: messagesBottom});
        this.props.tutorialCreation.messageBottom = messagesBottom;
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
                        <div className={styles.centered}>
                            <img
                                src={this.state.thumbnail}
                                className={styles.thumbnail}
                            />
                            <div className={styles.inputContainer}>
                                <div className={styles.inputDiv}>
                                    <p className={styles.output}>  <FormattedMessage
                                        defaultMessage="Thumbnail"
                                        description="Thumbnail"
                                        id="gui.tutorialCreation.thumbnail"
                                    />  </p>
                                    <label className={classNames(styles.imageUpload, styles.input)}>
                                        <input
                                            type="file"
                                            onChange={this.handleUploadImage}
                                        />
                                        <FormattedMessage
                                            defaultMessage="Upload Thumbnail"
                                            description="Upload Thumbnail"
                                            id="gui.tutorialCreation.uploadThumbnail"
                                        />
                                    </label>
                                </div>
                            </div>
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
                                                defaultMessage="Name"
                                                description="Name"
                                                id="gui.tutorialCreation.name"
                                            />  </p>
                                            <Input
                                                className={styles.input}
                                                value={this.state.names[index]}
                                                onChange={this.handleName}
                                                data-language_index={index}
                                            />
                                        </div>
                                        <div className={styles.inputDivVertical}>
                                            <p className={styles.output}> <FormattedMessage
                                                defaultMessage="Step Description"
                                                description="Step Description"
                                                id="gui.tutorialCreation.stepDescription"
                                            />  </p>
                                            <textarea
                                                className={styles.inputTextarea}
                                                value={this.state.messagesBottom[index].markdown}
                                                onChange={this.handleMessageBottom}
                                                data-language_index={index}
                                                wrap="hard"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )))}
                        </div>
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
                            <Instructions
                                message1={''}
                                message2={this.state.messagesBottom[0].markdown}
                                title={this.state.names[0]}
                                img={this.state.thumbnail}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
        ;
    }
}

TutorialCreationTestBasics.propTypes = {
    selectedTest: PropTypes.instanceOf(TutorialTest).isRequired,
    tutorialCreation: PropTypes.instanceOf(TutorialCreation).isRequired
};


export default injectIntl(TutorialCreationTestBasics);
