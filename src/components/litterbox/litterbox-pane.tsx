import React from 'react';

import Box from '../box/box.jsx';
import styles from './litterbox-pane.css';
import LitterBoxIssues from './litterbox-issues.tsx';
import LitterBoxFeatureSelector, {LitterBoxFeature} from './litterbox-choice.tsx';
import ScratchVM from 'scratch-vm';
import {LitterBoxHint, runLitterBoxAnalysis} from '../../containers/litterbox-web-api.ts';

interface LitterBoxPaneProps {
    vm: ScratchVM
}

interface LitterBoxPaneState {
    selectedFeature: LitterBoxFeature;
    litterBoxIssues: LitterBoxHint[] | undefined;
}

class LitterBoxPane extends React.Component<LitterBoxPaneProps, LitterBoxPaneState> {

    state: LitterBoxPaneState = {
        selectedFeature: LitterBoxFeature.ISSUES,
        // eslint-disable-next-line no-undefined
        litterBoxIssues: undefined
    };

    componentDidMount () {
        this.fetchLitterBoxIssues();
    }

    private readonly handleOnSelectFeature = (feature: LitterBoxFeature) => {
        this.setState(prev => ({
            ...prev,
            selectedFeature: feature
        }));

        switch (feature) {
        case LitterBoxFeature.ISSUES:
            this.handleOnSelectIssues();
            break;
        case LitterBoxFeature.LLM_QUESTION:
        case LitterBoxFeature.QUESTIONS:
            // do nothing for now
            break;
        }
    };

    private readonly handleOnSelectIssues = () => {
        if (!this.state.litterBoxIssues) {
            this.fetchLitterBoxIssues();
        }
    };

    private readonly fetchLitterBoxIssues = () => {
        runLitterBoxAnalysis(this.props.vm.toJSON())
            .then(litterBoxIssues => {
                this.setState(prev => ({
                    ...prev,
                    litterBoxIssues
                }));
            })
            .catch(err => {
                console.log(err);
                this.setState(prev => ({
                    ...prev,
                    litterBoxIssues: []
                }));
            });
    };

    private readonly handleRecheckCodeQuality = () => {
        this.fetchLitterBoxIssues();
    };

    render () {
        return (
            <Box className={styles.main}>
                <div style={{maxWidth: '100px', marginRight: '0.5rem'}}>
                    <LitterBoxFeatureSelector onSelect={this.handleOnSelectFeature} />
                </div>
                {
                    this.state.selectedFeature === LitterBoxFeature.ISSUES ?
                        <LitterBoxIssues
                            onCodeQualityRecheck={this.handleRecheckCodeQuality}
                            issues={this.state.litterBoxIssues ?? []}
                        /> :
                        null
                }
            </Box>
        );
    }
}

export default LitterBoxPane;
