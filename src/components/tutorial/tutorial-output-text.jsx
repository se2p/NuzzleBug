import bindAll from 'lodash.bindall';
import React from 'react';
import {injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import styles from './styles/tutorial-cards.css';
import ReactMarkdown from 'react-markdown';
import classNames from 'classnames';
import stylesHints from './styles/tutorial-code-quality.css';
import ScratchBlocks from 'scratchblocks-react';
import de from 'scratchblocks/locales/de.json';
import scratchblocks from 'scratchblocks';
import {translate} from 'autoprefixer/lib/hacks/grid-utils';

scratchblocks.loadLanguages({de});

const ScratchBlocksImage = props => (
    <div className={stylesHints.scratchImage}>
        <ScratchBlocks
            blockStyle="scratch3"
            languages={['en', 'de']}
        >
            {translate(props.scratchBlocksText, props.locale)}
        </ScratchBlocks>
    </div>
);

ScratchBlocksImage.propTypes = {
    scratchBlocksText: PropTypes.string,
    locale: PropTypes.string
};

class TutorialOutputText extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [

        ]);
    }

    processContent (){
        const regExp = /\[scratchblocks]([\s\S]*?)\[\/scratchblocks]/g;

        const contentArray = [];
        let lastIndex = 0;
        const inputText = this.props.content === null || !this.props.content ? '' : this.props.content;

        // Find all scratch blocks
        inputText.replace(regExp, (match, content, index) => {
            // Add anything before as markdown
            if (index > lastIndex) {
                contentArray.push({type: 'markdown', text: inputText.slice(lastIndex, index).trim()});
            }

            // Add as scratch block
            contentArray.push({type: 'scratchblock', text: content.trim()});
            lastIndex = index + match.length;
        });

        // If remaining or no scratch blocks are found add rest as markdown
        if (lastIndex < inputText.length) {

            contentArray.push({type: 'markdown', text: inputText.slice(lastIndex).trim()});

        }

        return contentArray;
    }

    CodeRenderer = ({language, value}) => (
        <pre>
            <code className={`language-${language}`}>{value}</code>
        </pre>
    );


    render () {

        return (
            <div className={styles.break}>
                {this.processContent(this.props.content).map((content, index) => {
                    if (content.type === 'markdown'){
                        return (<ReactMarkdown
                            className={classNames(styles.stepInstructions, this.props.additionalStyling)}
                            components={{
                                code: this.CodeRenderer
                            }}
                            key={`markdown_${index}`}
                        >{content.text}
                        </ReactMarkdown>);
                    }
                    return (<ScratchBlocks
                        blockStyle="scratch3"
                        key={`scratchblock_${index}`}
                    >
                        {content.text}
                    </ScratchBlocks>);

                })}
            </div>
        )
        ;
    }
}

TutorialOutputText.propTypes = {
    content: PropTypes.string,
    additionalStyling: PropTypes.string
};


export default injectIntl(TutorialOutputText);
