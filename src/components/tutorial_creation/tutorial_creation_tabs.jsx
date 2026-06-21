import bindAll from 'lodash.bindall';
import React from 'react';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';

import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import tabStyles from 'react-tabs/style/react-tabs.css';
import classNames from 'classnames';
import styles from './tutorial_creation.css';
import TutorialCreationThumbnail from './tutorial_creation_thumbnail.jsx';
import {TutorialCreation} from './tutorial_creation';
import TutorialCreationLanguages from './tutorial_creation_languages.jsx';
import TutorialCreationTestOverview from './tutorial_creation_test_overview.jsx';
import TutorialCreationMessages from './tutorial_creation_messages.jsx';
import TutorialCreationFinish from './tutorial_creation_finish.jsx';
import PropTypes from 'prop-types';

const messages = defineMessages({
    missingName: {
        id: 'gui.tutorialCreation.missingName',
        defaultMessage: 'Tutorial name is missing',
        description: 'Message displayed when the tutorial name is not provided'
    },
    missingThumbnail: {
        id: 'gui.tutorialCreation.missingThumbnail',
        defaultMessage: 'Tutorial thumbnail is missing',
        description: 'Message displayed when the tutorial thumbnail is not provided'
    },
    missingDescription: {
        id: 'gui.tutorialCreation.missingDescription',
        defaultMessage: 'Tutorial description is missing',
        description: 'Message displayed when the tutorial description is not provided'
    },
    missingEndCardTitle: {
        id: 'gui.tutorialCreation.missingEndCardTitle',
        defaultMessage: 'End card title is missing',
        description: 'Message displayed when the end card title is not provided'
    },
    missingEndCardMessage: {
        id: 'gui.tutorialCreation.missingEndCardMessage',
        defaultMessage: 'End card message is missing',
        description: 'Message displayed when the end card message is not provided'
    },
    missingStepName: {
        id: 'gui.tutorialCreation.missingStepName',
        defaultMessage: 'Name is missing for Step:',
        description: 'Message displayed when a step name is not provided'
    },
    missingStepDescription: {
        id: 'gui.tutorialCreation.missingStepDescription',
        defaultMessage: 'Description is missing for Step:',
        description: 'Message displayed when a step description is not provided'
    },
    missingStepSolutionMessage: {
        id: 'gui.tutorialCreation.missingStepSolutionMessage',
        defaultMessage: 'Solution Message is missing for Step:',
        description: 'Message displayed when a step solution message is not provided'
    },
    missingStepSolutionImage: {
        id: 'gui.tutorialCreation.missingStepSolutionImage',
        defaultMessage: 'Solution Image is missing for Step:',
        description: 'Message displayed when a step solution image is not provided'
    },
    missingStepThumbnail: {
        id: 'gui.tutorialCreation.missingStepThumbnail',
        defaultMessage: 'Thumbnail is missing for Step:',
        description: 'Message displayed when a step thumbnail is not provided'
    }

});

// Index of the last step (Finish). Used to hide the "Next" button there
// so the user cannot advance past it onto an empty panel.
const LAST_STEP = 4;

const tabClassNames = {
    tabs: styles.tabs,
    tab: classNames(tabStyles.reactTabsTab, styles.tab),
    tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
    tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
    tabPanelSelected: classNames(tabStyles.reactTabsTabPanelSelected, styles.isSelected),
    tabSelected: classNames(tabStyles.reactTabsTabSelected, styles.isSelected)
};

// Class that creates the default surrounding for the tutorial creation.
// This handles the tab panels and advancing / going back between steps.
// The checks for each step are also performed when switching.
class TutorialCreationTabs extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'handleTabChange',
            'handleFirstTab',
            'handleSecondTab',
            'handleThirdTab',
            'handleFourthTab',
            'handleFifthTab',
            'handleSixthTab',
            'handleNextTab',
            'handlePreviousTab',
            'proceedIfPossible'
        ]);
        this.state = {
            step: 0
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
        this.proceedIfPossible(this.state.step - 1);
    }

    /* Individual Tab Methods */
    handleFirstTab () {
        this.proceedIfPossible(0);
    }

    handleSecondTab () {
        this.proceedIfPossible(1);
    }

    handleThirdTab () {
        this.proceedIfPossible(2);
    }

    handleFourthTab () {
        this.proceedIfPossible(3);
    }

    handleFifthTab () {
        this.proceedIfPossible(4);
    }

    handleSixthTab () {
        this.proceedIfPossible(5);
    }

    // This method proceeds to the next step based on the supplied current step number.
    // Based on this multiple checks are performed to check for complete filling of the inputs.
    // Only if everything checks out it proceeds to the next step. Otherwise, an error message is shown.
    proceedIfPossible (stepNumber){
        // default to true
        let canProceed = true;
        const languageNumber = this.props.tutorialCreation.languages.length;

        // check based on the current step
        switch (this.state.step){
        // check for name and thumbnail
        case (1) : {
            if (!(languageNumber === this.props.tutorialCreation.names.length)){
                alert(this.props.intl.formatMessage(messages.missingName)); // eslint-disable-line
                canProceed = false;
            }
            if (this.props.tutorialCreation.thumbnail === null ||
            typeof this.props.tutorialCreation.thumbnail === 'undefined' ||
            this.props.tutorialCreation.thumbnail === ''){
                alert(this.props.intl.formatMessage(messages.missingThumbnail)); // eslint-disable-line
                canProceed = false;
            }
            break;
        }
        // check for Description and end card title/message
        case (2) : {
            if (!(this.props.tutorialCreation.downloadMessages.length === languageNumber) &&
                !this.props.tutorialCreation.downloadMessages.some(value => value.markdown.length === 0)){
                    alert(this.props.intl.formatMessage(messages.missingDescription)); // eslint-disable-line
                canProceed = false;
            }
            if (!(this.props.tutorialCreation.endCardTitles.length === languageNumber)){
                alert(this.props.intl.formatMessage(messages.missingEndCardTitle)); // eslint-disable-line
                canProceed = false;
            }
            if (!(this.props.tutorialCreation.endCardMessages.length === languageNumber)){
                alert(this.props.intl.formatMessage(messages.missingEndCardMessage)); // eslint-disable-line
                canProceed = false;
            }
            break;
        }
        // check each test for name, description, solutionMessage, solutionImage and Thumbnail
        case (3) : {
            for (const test of this.props.tutorialCreation.tests){
                if (!test.names.length === languageNumber || test.names.some(value => value.length === 0)){
                    alert(`${this.props.intl.formatMessage(messages.missingStepName)} ${test.number}`); // eslint-disable-line
                    canProceed = false;
                }
                if (!test.messageBottom.length === languageNumber ||
                    test.messageBottom.some(value => value.markdown.length === 0)){
                    alert(`${this.props.intl.formatMessage(messages.missingStepDescription)} ${test.number}`); // eslint-disable-line
                    canProceed = false;
                }
                if (!test.solutionMessages.length === languageNumber ||
                    test.solutionMessages.some(value => value.markdown.length === 0)){
                    alert(`${this.props.intl.formatMessage(messages.missingStepSolutionMessage)} ${test.number}`); // eslint-disable-line
                    canProceed = false;
                }
                if (!test.solutionImages.length === languageNumber){
                    alert(`${this.props.intl.formatMessage(messages.missingStepSolutionImage)} ${test.number}`); // eslint-disable-line
                    canProceed = false;
                }
                if (test.image === null ||
                    typeof test.image === 'undefined' ||
                    test.image === ''){
                    alert(`${this.props.intl.formatMessage(messages.missingStepThumbnail)} ${test.number}`); // eslint-disable-line
                    canProceed = false;
                }
            }
            break;
        }
        }

        // proceed if allowed
        if (canProceed) {
            this.setState({step: stepNumber});
        }
    }


    render () {
        return (

            <Tabs
                forceRenderTabPanel
                className={tabClassNames.tabs}
                selectedIndex={this.state.step}
                selectedTabClassName={tabClassNames.tabSelected}
                selectedTabPanelClassName={tabClassNames.tabPanelSelected}
                onSelect={this.handleTabChange}
                style={{height: '80%'}}
            >
                <div
                    className={styles.tabListWrapper}
                    style={{height: '100%'}}
                >
                    <TabPanel style={this.state.step === 0 ? {height: '100%'} : {}}>
                        {this.state.step === 0 ? (
                            <TutorialCreationLanguages
                                tutorialCreation={this.props.tutorialCreation}
                                intl={this.props.intl}
                            />
                        ) : null}
                    </TabPanel>
                    <TabPanel style={this.state.step === 1 ? {height: '100%'} : {}}>
                        {this.state.step === 1 ? (
                            <TutorialCreationThumbnail
                                tutorialCreation={this.props.tutorialCreation}
                                intl={this.props.intl}
                            />
                        ) : null}
                    </TabPanel>
                    <TabPanel style={this.state.step === 2 ? {height: '100%'} : {}}>
                        {this.state.step === 2 ? (
                            <TutorialCreationMessages
                                tutorialCreation={this.props.tutorialCreation}
                                intl={this.props.intl}
                            />
                        ) : null}
                    </TabPanel>
                    <TabPanel style={this.state.step === 3 ? {height: '100%'} : {}}>
                        {this.state.step === 3 ? (
                            <TutorialCreationTestOverview
                                tutorialCreation={this.props.tutorialCreation}
                                intl={this.props.intl}
                            />
                        ) : null}
                    </TabPanel>
                    <TabPanel>
                        {this.state.step === 4 ? (
                            <TutorialCreationFinish
                                tutorialCreation={this.props.tutorialCreation}
                                intl={this.props.intl}
                            />
                        ) : null}
                    </TabPanel>
                    <TabList className={tabClassNames.tabList}>
                        <Tab className={tabClassNames.tab}>
                            <FormattedMessage
                                defaultMessage="Languages"
                                description="Button to get to the Languages panel"
                                id="gui.tutorialCreation.languagesTab"
                            />
                        </Tab>
                        <Tab
                            className={tabClassNames.tab}
                            onClick={this.handleSecondTab}
                        >
                            <FormattedMessage
                                defaultMessage="Basic Infos"
                                description="Button to get to the Basic Infos panel"
                                id="gui.tutorialCreation.basicTab"
                            />
                        </Tab>
                        <Tab
                            className={tabClassNames.tab}
                            onClick={this.handleThirdTab}
                        >
                            <FormattedMessage
                                defaultMessage="Outputs"
                                description="Button to get to the Outputs panel"
                                id="gui.tutorialCreation.outputTab"
                            />
                        </Tab>
                        <Tab
                            className={tabClassNames.tab}
                            onClick={this.handleFourthTab}
                        >
                            <FormattedMessage
                                defaultMessage="Tests"
                                description="Button to get to the Tests panel"
                                id="gui.tutorialCreation.testTab"
                            />
                        </Tab>
                        <Tab
                            className={tabClassNames.tab}
                            onClick={this.handleFifthTab}
                        >
                            <FormattedMessage
                                defaultMessage="Finish"
                                description="Button to get to the Finish panel"
                                id="gui.tutorialCreation.finishTab"
                            />
                        </Tab>
                    </TabList>

                    {this.state.step < LAST_STEP ? (
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
                    ) : null}

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
        );
    }
}

TutorialCreationTabs.propTypes = {
    tutorialCreation: PropTypes.instanceOf(TutorialCreation).isRequired,
    intl: intlShape
};


export default injectIntl(TutorialCreationTabs);
