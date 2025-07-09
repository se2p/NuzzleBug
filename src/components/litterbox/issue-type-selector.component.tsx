import React from 'react';
import {IssueType} from '../../containers/litterbox-web-api.ts';
import styles from './litterbox-pane.css';

interface IssueTypeSelectorComponentProps {
    issueCounts: Map<IssueType, number>;
    onSelect: (type: IssueType) => void;
}

class IssueTypeSelectorComponent extends React.Component<IssueTypeSelectorComponentProps, never> {

    private readonly handleOnClickBugs = () => {
        this.props.onSelect('BUG');
    };

    private readonly handleOnClickSmells = () => {
        this.props.onSelect('SMELL');
    };

    private readonly handleOnClickPerfumes = () => {
        this.props.onSelect('PERFUME');
    };

    private readonly button = (prefix: string, issueType: IssueType, handler: () => void) => (
        <button
            onClick={handler}
            disabled={!this.props.issueCounts.get(issueType)}
        >
            {`${prefix} (${this.props.issueCounts.get(issueType)})`}
        </button>
    );

    render () {
        return (
            <div className={styles.buttonStack}>
                {this.button('Bugs', 'BUG', this.handleOnClickBugs)}
                {this.button('Smells', 'SMELL', this.handleOnClickSmells)}
                {this.button('Perfumes', 'PERFUME', this.handleOnClickPerfumes)}
            </div>
        );
    }
}

export default IssueTypeSelectorComponent;
