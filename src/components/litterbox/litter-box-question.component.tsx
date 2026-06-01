import React from 'react';

import {LitterBoxQuestion} from '../../containers/litterbox-web-api.ts';
import ScratchBlocksImageContainer from '../../containers/scratch-blocks-image.container.tsx';
import styles from './hints.css';

interface LitterBoxQuestionProps {
    question: LitterBoxQuestion;
    index: number;
    total: number;
    locale: string;
}

class LitterBoxQuestionComponent extends React.Component<LitterBoxQuestionProps, never> {

    private titleColor (): string {
        switch (this.props.question.type) {
        case 'MULTIPLE_CHOICE': return 'dodgerblue';
        case 'YES_NO': return 'green';
        case 'NUMBER': return 'orange';
        case 'FREE_TEXT': return 'gray';
        default: return 'black';
        }
    }

    render () {
        const {question, index, total} = this.props;

        return (
            <div className={styles.wrapperBox}>
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <div className={styles.sprite}>
                        <span>{question.sprite}</span>
                    </div>
                    <h3
                        className={styles.hintTitle}
                        style={{color: this.titleColor()}}
                    >
                        {question.translatedFinderName}
                    </h3>
                    <span style={{whiteSpace: 'nowrap'}}>
                        {`${index + 1} / ${total}`}
                    </span>
                </div>
                <div style={{display: 'flex'}}>
                    <div className={styles.hintDescriptionBox}>
                        <p>{question.questionText}</p>
                        {question.choices && question.choices.length > 0 &&
                            <ol>
                                {question.choices.map((choice, i) => (
                                    <li key={i}>{choice}</li>
                                ))}
                            </ol>
                        }
                    </div>
                    <div className={styles.scratchBlocksBox}>
                        <ScratchBlocksImageContainer
                            scratchBlocksText={question.scratchBlocksCode}
                            locale={this.props.locale}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default LitterBoxQuestionComponent;
