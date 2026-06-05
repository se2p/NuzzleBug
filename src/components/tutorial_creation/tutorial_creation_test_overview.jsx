import bindAll from 'lodash.bindall';
import React from 'react';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import {TutorialCreation} from './tutorial_creation';
import PropTypes from 'prop-types';
import styles from './tutorial_creation.css';
import editImage from '../../lib/assets/icon--edit.svg';
import TutorialCreationTestPopup from './tutorial_creation_test_popup.jsx';

import classNames from 'classnames';


const messages = defineMessages({
    edit: {
        id: 'gui.menuBar.edit',
        defaultMessage: 'Edit',
        description: 'Edit'
    }
});

// Class for the overview page of the tutorials tests
class TutorialCreationTestOverview extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'handleEditTest',
            'handleOnCompleteTest'
        ]);
        this.state = {
            tests: this.props.tutorialCreation.tests,
            selectedTest: null,
            isPopupOpen: false
        };
    }

    // Method to go to the editing popup once a test is clicked
    handleEditTest (test) {
        this.setState({selectedTest: test, isPopupOpen: true});
    }

    // Method that is called once a edit is completed
    handleOnCompleteTest (){
        // update tests as they have ned descriptions etc.
        const newTests = this.state.tests;
        newTests[this.state.selectedTest.number - 1] = this.state.selectedTest;
        this.props.tutorialCreation.tests = newTests;
        this.setState({tests: newTests,
            selectedTest: null,
            isPopupOpen: false});
    }

    render () {
        return (
            <div>
                <div className={styles.centered}>
                    <table
                        className={styles.languagesTable}
                        id="tutorialCreationTestOverview.table"
                    >
                        <thead>
                            <tr>
                                <th style={{width: '80px'}}><FormattedMessage
                                    defaultMessage="Number"
                                    description="Test index"
                                    id="gui.tutorialCreation.number"
                                /></th>
                                <th><FormattedMessage
                                    defaultMessage="Name"
                                    description="Test name"
                                    id="gui.tutorialCreation.name"
                                /></th>
                                <th style={{width: '80px'}} />
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.tests.map(test => (
                                    <tr key={test.number}>
                                        <td>{test.number}</td>
                                        <td>{Object.values(test.names)[0]}</td>
                                        <td className={styles.row}>
                                            <div
                                                className={classNames(styles.hoverable, styles.removeButton,
                                                    styles.margined)}
                                                // best way I could do it here
                                                /* eslint-disable-next-line react/jsx-no-bind */
                                                onClick={() => this.handleEditTest(test)}
                                            >
                                                <img
                                                    src={editImage}
                                                    style={{
                                                        width: '20px',
                                                        height: '20px'
                                                    }}
                                                    alt={this.props.intl.formatMessage(messages.edit)}
                                                />
                                            </div>
                                        </td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
                    <TutorialCreationTestPopup
                        selectedTest={this.state.selectedTest}
                        tutorialCreation={this.props.tutorialCreation}
                        open={this.state.isPopupOpen}
                        onComplete={this.handleOnCompleteTest}
                        intl={this.props.intl}
                    />
                </div>
            </div>
        )
        ;
    }
}

TutorialCreationTestOverview.propTypes = {
    tutorialCreation: PropTypes.instanceOf(TutorialCreation).isRequired,
    intl: intlShape
};


export default injectIntl(TutorialCreationTestOverview);
