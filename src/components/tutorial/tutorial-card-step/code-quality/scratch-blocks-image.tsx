import React from 'react';

import styles from '../../styles/tutorial-code-quality.css';
import ScratchBlocks from 'scratchblocks-react';

interface ScratchBlocksImageProps {
    scratchBlocksText: string;
}

const ScratchBlocksImage = (props: ScratchBlocksImageProps) => (
    <div className={styles.scratchImage}>
        <ScratchBlocks
            blockStyle="scratch3"
            languages={['en', 'de']}
        >
            {props.scratchBlocksText}
        </ScratchBlocks>
    </div>
);

export default ScratchBlocksImage;
