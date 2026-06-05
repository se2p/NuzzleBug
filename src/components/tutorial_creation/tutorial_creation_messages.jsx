import bindAll from 'lodash.bindall';
import React from 'react';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import {TutorialCreation} from './tutorial_creation';
import PropTypes from 'prop-types';
import Input from '../forms/input.jsx';
import styles from './tutorial_creation.css';
import classNames from 'classnames';
import Intro, {Success} from './preview-intro-success.jsx';
import successImageDE from '../tutorial/images/greatDoneDE.png';


const messages = defineMessages({
    download: {
        id: 'gui.alerts.download',
        defaultMessage: 'Download',
        description: 'Download'
    }
});

// Class for setting the most important outputs of a tutorial
class TutorialCreationMessages extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'handleEndCardTitles',
            'handleEndCardMessages',
            'handleMessage'
        ]);
        this.state = {
            endCardTitles: this.props.tutorialCreation.endCardTitles,
            endCardMessages: this.props.tutorialCreation.endCardMessages,
            downloadMessages: this.props.tutorialCreation.downloadMessages,
            isPopupOpen: false,
            markdown: '',
            languageIndex: 0
        };
    }

    // Method to handle the event of setting a end card title
    handleEndCardTitles (event) {
        // as there can be multiple languages set it for the selected language index
        const languageIndex = event.target.dataset.language_index;
        const endCardTitles = this.state.endCardTitles;
        endCardTitles[languageIndex] = event.target.value;
        this.setState({endCardTitles: endCardTitles});
        this.props.tutorialCreation.endCardTitles = endCardTitles;
    }

    // Method to handle the event of setting a end card message
    handleEndCardMessages (event) {
        // as there can be multiple languages set it for the selected language index
        const languageIndex = event.target.dataset.language_index;
        const endCardMessages = this.state.endCardMessages;
        endCardMessages[languageIndex] = event.target.value;
        this.setState({endCardMessages: endCardMessages});
        this.props.tutorialCreation.endCardMessages = endCardMessages;
    }

    // Method to handle the event of setting the description
    handleMessage (event){
        // as there can be multiple languages set it for the selected language index
        const languageIndex = event.target.dataset.language_index;
        const downloadMsgs = this.state.downloadMessages;
        downloadMsgs[languageIndex].markdown = event.target.value;
        this.setState({downloadMessages: downloadMsgs});
        this.props.tutorialCreation.downloadMessages = downloadMsgs;
    }


    render () {
        return (
            <div style={{height: '100%'}}>
                <div
                    className={classNames(styles.flexRow, styles.notScrollable)}
                    style={{alignItems: 'flex-start', height: '100%'}}
                >
                    <div className={styles.centered}>

                        {this.props.tutorialCreation.languages.map(((language, index) => (
                            <div
                                key={language.fullName}
                            >
                                <h3>
                                    {language.fullName}
                                </h3>
                                <hr
                                    className={classNames('solid', styles.divider)}
                                />
                                <div
                                    className={styles.inputContainer}
                                    style={{width: '100%'}}
                                >
                                    <div className={styles.inputDivVertical}>
                                        <p className={styles.output}>  <FormattedMessage
                                            defaultMessage="Tutorial Description"
                                            description="Description of the Tutorial"
                                            id="gui.tutorialCreation.tutorialDescription"
                                        />  </p>
                                        <textarea
                                            className={styles.inputTextarea}
                                            value={this.state.downloadMessages[index].markdown ?? ''}
                                            onChange={this.handleMessage}
                                            // pass language index to update the correct message
                                            data-language_index={index}
                                            wrap="hard"
                                        />
                                    </div>
                                    <div className={styles.inputDiv}>
                                        <p className={styles.output}> <FormattedMessage
                                            defaultMessage="End Card Title"
                                            description="Title of the Tutorials End Card"
                                            id="gui.tutorialCreation.endCardTitle"
                                        />  </p>
                                        <Input
                                            className={styles.input}
                                            value={this.state.endCardTitles[index] ?? ''}
                                            onChange={this.handleEndCardTitles}
                                            // pass language index to update the correct message
                                            data-language_index={index}
                                        />
                                    </div>
                                    <div className={styles.inputDivVertical}>
                                        <p className={styles.output}> <FormattedMessage
                                            defaultMessage="End Card Message"
                                            description="Message of the Tutorials End Card"
                                            id="gui.tutorialCreation.endCardMessage"
                                        />  </p>
                                        <textarea
                                            className={styles.inputTextarea}
                                            value={this.state.endCardMessages[index] ?? ''}
                                            onChange={this.handleEndCardMessages}
                                            // pass language index to update the correct message
                                            data-language_index={index}
                                            wrap="hard"
                                        />
                                    </div>
                                </div>
                            </div>
                        )))}
                    </div>
                    <div className={classNames(styles.flexColumn)}>
                        <div className={classNames(styles.previewDivMultiple, styles.flexColumn)}>
                            <h2 className={styles.previewHeader}>
                                <FormattedMessage
                                    defaultMessage="Preview Description"
                                    description="Preview Window"
                                    id="gui.tutorialCreation.previewDescription"
                                /></h2>
                            <div className={styles.preview}>
                                <Intro
                                    content={{
                                        title: this.props.tutorialCreation.names[0],
                                        img: this.props.tutorialCreation.thumbnail,
                                        message: this.state.downloadMessages[0].markdown,
                                        download: []
                                    }}
                                    /* eslint-disable-next-line react/jsx-no-bind */
                                    onDownload={() => {}}
                                    downloadButtonTitle={this.props.intl.formatMessage(messages.download)}
                                />

                            </div>
                        </div>
                        <div className={classNames(styles.previewDivMultiple, styles.flexColumn)}>
                            <h2 className={styles.previewHeader}>
                                <FormattedMessage
                                    defaultMessage="Preview End Card"
                                    description="Preview Window"
                                    id="gui.tutorialCreation.previewEndCard"
                                /></h2>
                            <div className={styles.preview}>
                                <Success
                                    homeButtonTitle={''}
                                    /* eslint-disable-next-line react/jsx-no-bind */
                                    onHome={() => {}}
                                    content={{
                                        title: this.state.endCardTitles[0] ?? '',
                                        message: this.state.endCardMessages[0] ?? '',
                                        img: successImageDE
                                    }}
                                    hideButton
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
        ;
    }
}

TutorialCreationMessages.propTypes = {
    tutorialCreation: PropTypes.instanceOf(TutorialCreation).isRequired,
    intl: intlShape
};


export default injectIntl(TutorialCreationMessages);
