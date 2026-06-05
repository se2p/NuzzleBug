import bindAll from 'lodash.bindall';
import React from 'react';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import styles from './tutorial_creation.css';
import {TutorialCreation, TutorialTest} from './tutorial_creation';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import tabStyles from 'react-tabs/style/react-tabs.css';
import classNames from 'classnames';
import TutorialCreationTestBasics from './test_creation/tutorial_creation_test_basics.jsx';
import TutorialCreationTestMessages from './test_creation/tutorial_creation_test_messages.jsx';

const tabClassNames = {
    tabs: styles.tabs,
    tab: classNames(tabStyles.reactTabsTab, styles.tab),
    tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
    tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
    tabPanelSelected: classNames(tabStyles.reactTabsTabPanelSelected, styles.isSelected),
    tabSelected: classNames(tabStyles.reactTabsTabSelected, styles.isSelected)
};

const messages = defineMessages({
    missingMessageBottom: {
        id: 'gui.menuBar.missingMessageBottom',
        defaultMessage: 'Description is missing',
        description: 'Missing Description'
    },
    missingTestImage: {
        id: 'gui.tutorialCreation.missingTestImage',
        defaultMessage: 'Test image is missing',
        description: 'Missing test image'
    },
    missingTestName: {
        id: 'gui.tutorialCreation.missingTestName',
        defaultMessage: 'Test name is missing or mismatched',
        description: 'Missing or mismatched test name'
    },
    missingWhiskerMessage: {
        id: 'gui.tutorialCreation.missingWhiskerMessage',
        defaultMessage: 'Whisker message is missing or mismatched',
        description: 'Missing or mismatched whisker message'
    },
    missingSolutionMessages: {
        id: 'gui.tutorialCreation.missingSolutionMessages',
        defaultMessage: 'Solution messages are missing or mismatched',
        description: 'Missing or mismatched solution messages'
    },
    missingSolutionImages: {
        id: 'gui.tutorialCreation.missingSolutionImages',
        defaultMessage: 'Solution images are missing or mismatched',
        description: 'Missing or mismatched solution images'
    }
});

// Class for the popup and tabs of the test editing
class TutorialCreationTestPopup extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'handleTabChange',
            'handleFirstTab',
            'handleNextTab',
            'handlePreviousTab',
            'proceedIfPossible'
        ]);
        this.state = {
            step: 0,
            isPopupOpen: false
        };
    }

    /* Generic Tab Change Method */

    handleTabChange (tab){
        this.proceedIfPossible(tab);
    }

    /* Next and Previous Buttons */
    handleNextTab () {
        this.proceedIfPossible(this.state.step + 1);
    }

    handlePreviousTab () {
        this.setState({step: this.state.step - 1});

    }

    // Method to proceed to target based on the currently selected index if possible
    proceedIfPossible (target) {
        // default to true
        let canProceed = true;

        // check description, name and image on first tab
        if (this.state.step === 0){
            if (this.props.tutorialCreation.messageBottom === null){
                // eslint-disable-next-line no-alert
                alert(this.props.intl.formatMessage(messages.missingMessageBottom));
                canProceed = false;
            }
            if (this.props.selectedTest.image === null){
                // eslint-disable-next-line no-alert
                alert(this.props.intl.formatMessage(messages.missingTestImage));
                canProceed = false;
            }
            if (this.props.selectedTest.names === null ||
                !(this.props.selectedTest.names.length === this.props.tutorialCreation.languages.length)){
                // eslint-disable-next-line no-alert
                alert(this.props.intl.formatMessage(messages.missingTestName));
                canProceed = false;
            }
        }

        // check whisker message, solution message and image on second tab
        if (this.state.step === 1){
            if (this.props.selectedTest.whiskerMessages === null ||
                !(this.props.selectedTest.whiskerMessages.length === this.props.selectedTest.languages.length)){
                // eslint-disable-next-line no-alert
                alert(this.props.intl.formatMessage(messages.missingWhiskerMessage));
                canProceed = false;
            }
            if (this.props.selectedTest.solutionMessages === null ||
                !(this.props.selectedTest.solutionMessages.length === this.props.selectedTest.languages.length)){
                // eslint-disable-next-line no-alert
                alert(this.props.intl.formatMessage(messages.missingSolutionMessages));
                canProceed = false;
            }
            if (this.props.selectedTest.solutionImages === null ||
                !(this.props.selectedTest.solutionImages.length === this.props.selectedTest.languages.length)){
                // eslint-disable-next-line no-alert
                alert(this.props.intl.formatMessage(messages.missingSolutionImages));
                canProceed = false;
            }
        }

        // proceed if possible
        if (canProceed){
            this.setState({step: target});
        }
    }

    /* Individual Tab Methods */
    handleFirstTab () {
        this.setState({step: 0});
    }

    render () {
        return (
            <div>

                {this.props.open && (
                    <div
                        className={classNames(styles.popup, styles.popupLarge)}
                    >
                        <h2><FormattedMessage
                            defaultMessage="Test"
                            description="Test for a Tutorial"
                            id="gui.tutorialCreation.test"
                        /></h2>
                        <Tabs
                            forceRenderTabPanel
                            className={tabClassNames.tabs}
                            selectedIndex={this.state.step}
                            selectedTabClassName={tabClassNames.tabSelected}
                            selectedTabPanelClassName={tabClassNames.tabPanelSelected}
                            onSelect={this.handleTabChange}
                        >
                            <div className={styles.tabListWrapper}>
                                <TabPanel>
                                    {this.state.step === 0 ? (
                                        <TutorialCreationTestBasics
                                            selectedTest={this.props.selectedTest}
                                            tutorialCreation={this.props.tutorialCreation}
                                        />
                                    ) : null}
                                </TabPanel>
                                <TabPanel>
                                    {this.state.step === 1 ? (
                                        <TutorialCreationTestMessages
                                            selectedTest={this.props.selectedTest}
                                            tutorialCreation={this.props.tutorialCreation}
                                            intl={this.props.intl}
                                        />
                                    ) : null}
                                </TabPanel>

                                <TabList className={tabClassNames.tabList}>
                                    <Tab className={tabClassNames.tab}>
                                        <FormattedMessage
                                            defaultMessage="Basic Infos"
                                            description="Button to get to the Basic Infos panel"
                                            id="gui.tutorialCreation.basicTab"
                                        />
                                    </Tab>
                                    <Tab className={tabClassNames.tab}>
                                        <FormattedMessage
                                            defaultMessage="Outputs"
                                            description="Button to get to the Outputs panel"
                                            id="gui.tutorialCreation.outputTab"
                                        />
                                    </Tab>
                                </TabList>

                                {this.state.step < 1 ? (
                                    <button
                                        className={styles.nextButton}
                                        onClick={this.handleNextTab}
                                    >
                                        <FormattedMessage
                                            defaultMessage="Next"
                                            description="Advance to next step"
                                            id="gui.tutorialCreation.next"
                                        />
                                    </button>
                                ) : <button
                                    className={styles.nextButton}
                                    onClick={this.props.onComplete}
                                >
                                    <FormattedMessage
                                        defaultMessage="Finish"
                                        description="Finish Test Adding"
                                        id="gui.tutorialCreation.finish"
                                    />
                                </button>}

                                {this.state.step > 0 ? (
                                    <button
                                        className={styles.previousButton}
                                        onClick={this.handlePreviousTab}
                                    >
                                        <FormattedMessage
                                            defaultMessage="Previous"
                                            description="Go back to previos step"
                                            id="gui.tutorialCreation.previous"
                                        />
                                    </button>
                                ) : null}

                            </div>
                        </Tabs>
                        <div />
                    </div>
                )}

                {/* Background overlay */}
                {this.props.open && (
                    <div
                        className={styles.popupCatcher}
                    />
                )}
            </div>
        )
        ;
    }
}

TutorialCreationTestPopup.propTypes = {
    selectedTest: PropTypes.oneOfType([
        PropTypes.instanceOf(TutorialTest),
        PropTypes.oneOf([null])
    ]),
    tutorialCreation: PropTypes.instanceOf(TutorialCreation).isRequired,
    open: PropTypes.bool.isRequired,
    onComplete: PropTypes.func.isRequired,
    intl: intlShape
};


export default injectIntl(TutorialCreationTestPopup);
