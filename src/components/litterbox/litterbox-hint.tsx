import React from 'react';
import styles from './hints.css';
import ScratchBlocksImageContainer from '../../containers/scratch-blocks-image.container.tsx';

import scratchblocks from 'scratchblocks';

type IssueType = 'BUG' | 'SMELL' | 'PERFUME';

interface LitterBoxHintProps {
    title: string;
    sprite: string;
    issueType: IssueType;
    hintDescription: string;
    scratchBlocksCode: string;
    locale: string;
}

interface LitterBoxHintState {
    hintDescriptionHtml: string;
}

class LitterBoxHint extends React.Component<LitterBoxHintProps, LitterBoxHintState> {
    state: LitterBoxHintState = {
        hintDescriptionHtml: ''
    };

    componentDidMount () {
        this.updateDescriptionHtml();
    }

    componentDidUpdate (
        prevProps: Readonly<LitterBoxHintProps>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _prevState: Readonly<LitterBoxHintState>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _snapshot?: never
    ) {
        if (prevProps.hintDescription !== this.props.hintDescription) {
            this.updateDescriptionHtml();
        }

        this.triggerInlineScratchBlocksRender();
    }

    private titleColor (): string {
        switch (this.props.issueType) {
        case 'BUG': return 'red';
        case 'SMELL': return 'orange';
        case 'PERFUME': return 'green';
        }
    }

    private updateDescriptionHtml (): void {
        this.setState(prev => ({
            ...prev,
            hintDescriptionHtml: this.litterBoxHintToHtml(this.props.hintDescription)
        }));
    }

    private triggerInlineScratchBlocksRender (): void {
        scratchblocks.renderMatching('code.b', {
            inline: true,
            style: 'scratch3',
            languages: [this.props.locale],
            scale: 0.5
        });
    }

    private litterBoxHintToHtml (hintText: string): string {
        let text = hintText.replace(/\[b]/g, '<strong>');
        text = text.replace(/\[\/b]/g, '</strong>');
        text = text.replace(/\[newLine]/g, '<br />');
        text = text.replace(/\[sbi]/g, '<code class="b">');
        text = text.replace(/\[\/sbi]/g, '</code>');
        text = text.replace(/\[var]/g, '<code class="b">(Variable "');
        text = text.replace(/\[\/var]/g, '")</code>');
        text = text.replace(/\[bc]/g, '<span className={styles.hintHighlightText}><b>');
        text = text.replace(/\[\/bc]/g, '</b></span>');
        return text;
    }

    render () {
        return (
            <>
                <div style={{display: 'flex'}}>
                    <br />
                    <div className={styles.sprite}>{this.props.sprite}</div>
                    <h3
                        style={{
                            flex: '4',
                            width: '100%',
                            alignContent: 'center',
                            color: this.titleColor()
                        }}
                    >
                        {this.props.title}
                    </h3>
                </div>
                <div
                    style={{
                        display: 'flex'
                    }}
                >
                    <div
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{__html: this.state.hintDescriptionHtml}}
                        style={{
                            flex: 1,
                            border: '2px',
                            minHeight: '250px',
                            maxHeight: '92%',
                            borderStyle: 'dashed none dashed dashed',
                            borderWidth: '2px',
                            maxWidth: '281.96px',
                            padding: '2%',
                            textAlign: 'left'
                        }}
                    />
                    <div
                        style={{
                            flex: 1,
                            border: '2px',
                            minHeight: '250px',
                            maxHeight: '92%',
                            borderStyle: 'dashed',
                            borderWidth: '2px',
                            maxWidth: '281.96px',
                            padding: '2%'
                        }}
                    >
                        <div
                            style={{
                                overflowX: 'scroll'
                            }}
                        >
                            <ScratchBlocksImageContainer
                                scratchBlocksText={this.props.scratchBlocksCode}
                                locale={this.props.locale}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default LitterBoxHint;
