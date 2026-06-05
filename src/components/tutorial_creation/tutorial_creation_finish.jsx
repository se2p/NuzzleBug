import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, injectIntl} from 'react-intl';

import tutGenImage from '../../lib/assets/tutorial_generator.png';
import styles from './tutorial_creation.css';
import {TutorialCreator} from './tutorial_creator.js';
import {TutorialCreation} from './tutorial_creation';
import {TutorialLoader} from './tutorial_loader';
import classNames from 'classnames';

// Class to download edits and finished tutorials
class TutorialCreationFinish extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'handleDownload',
            'handleDownloadEdit'
        ]);
        this.state = {
            loading: false,
            tutorialCreator: new TutorialCreator(this.props.tutorialCreation)
        };
    }

    // method to download the finished tutorial
    handleDownload () {
        // set loader
        this.setState({loading: true});
        // create tutorial and download blob
        this.state.tutorialCreator.createTutorial().then(blob => {
            this.setState({loading: false});
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'tutorial.zip';
            link.click();
            URL.revokeObjectURL(link.href); // Clean up the URL object
        });
    }

    // Method to save current edit as json file
    handleDownloadEdit () {
        TutorialLoader.handleTutorialDownload(this.props.tutorialCreation);
    }


    render () {
        return (
            <div>
                <img
                    style={{marginTop: 0}}
                    className={styles.tutLogo}
                    src={tutGenImage}
                />
                {this.state.loading ? <div className={styles.loader} /> : <div style={{height: '120px'}} />}
                <div style={{display: 'flex'}}>
                    <button
                        className={classNames(styles.button, styles.orange)}
                        style={{marginTop: '35px'}}
                        onClick={this.handleDownloadEdit}
                    >
                        <FormattedMessage
                            defaultMessage="Download Edit"
                            description="Download currently editing Tutorial"
                            id="gui.tutorialCreation.downloadEdit"
                        />
                    </button>
                    <button
                        className={styles.button}
                        style={{marginTop: '35px'}}
                        onClick={this.handleDownload}
                    >
                        <FormattedMessage
                            defaultMessage="Download Tutorial"
                            description="Finsh the tutorial creation"
                            id="gui.tutorialCreation.downloadTutorial"
                        />
                    </button>
                </div>
            </div>
        );
    }
}


TutorialCreationFinish.propTypes = {
    tutorialCreation: PropTypes.instanceOf(TutorialCreation).isRequired
};


export default injectIntl(TutorialCreationFinish);
