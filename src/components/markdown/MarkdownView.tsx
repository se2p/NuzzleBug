import React from 'react';
import ReactMarkdown from 'react-markdown';
import ScratchBlocksImageContainer from '../../containers/scratch-blocks-image.container.tsx';

interface MarkdownViewProps {
    markdown: string;
    locale: string;
}

interface MarkdownViewState {
}

/**
 * Renders arbitrary Markdown texts. Renders contained ScratchBlocks syntax as images.
 *
 * Features:
 * * Inline code containing a colour (e.g. `#123456`) is rendered as a coloured circle similar to
 *   the colour blobs in the Scratch code.
 * * All code blocks (i.e. fenced in triple backticks) are assumed to be ScratchBlocks syntax.
 *   Code blocks are therefore rendered as an image that represents this code instead.
 */
class MarkdownViewComponent extends React.Component<MarkdownViewProps, MarkdownViewState> {

    render () {
        return (
            <ReactMarkdown
                components={{
                    code ({node, inline, className, children, ...props}) {
                        const scratchBlocksCode = String(children)
                            .replace(/^\/\/.*/g, '');
                        const isColour = new RegExp(/^#[0-9a-fA-F]{6}$/).exec(scratchBlocksCode.trim());

                        if (isColour) {
                            return (
                                <span
                                    style={{
                                        height: '20px',
                                        width: '25px',
                                        backgroundColor: scratchBlocksCode,
                                        borderRadius: '40%',
                                        display: 'inline-block'
                                    }}
                                />
                            );
                        } else if (inline) {
                            return (
                                <code
                                    {...props}
                                    className={className}
                                >
                                    {children}
                                </code>
                            );
                        }

                        return (
                            <ScratchBlocksImageContainer
                                scratchBlocksText={scratchBlocksCode}
                                locale={'en'}
                            />
                        );
                    }
                }}
            >
                {this.props.markdown}
            </ReactMarkdown>
        );
    }
}

export default MarkdownViewComponent;
