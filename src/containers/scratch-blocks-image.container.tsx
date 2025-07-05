import React from 'react';
import scratchblocks from 'scratchblocks';
import de from 'scratchblocks/locales/de.json';
import ScratchBlocksImage from '../components/tutorial/tutorial-card-step/code-quality/scratch-blocks-image';

scratchblocks.loadLanguages({de});

interface ScratchBlocksImageContainerProps {
    scratchBlocksText: string;
    locale: string;
}

class ScratchBlocksImageContainer extends React.Component<ScratchBlocksImageContainerProps, never> {

    private translate (scratchBlocksText: string, locale: string): string {
        const block = scratchblocks.parse(scratchBlocksText, {
            languages: ['en', 'de']
        });
        if (locale === 'de') {
            block.translate(scratchblocks.allLanguages.de);
        }
        return block.stringify();
    }

    render () {
        return (
            <ScratchBlocksImage scratchBlocksText={this.translate(this.props.scratchBlocksText, this.props.locale)} />
        );
    }
}

export default ScratchBlocksImageContainer;
