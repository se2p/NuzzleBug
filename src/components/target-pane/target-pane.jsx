import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';

import VM from 'scratch-vm';

import SpriteLibrary from '../../containers/sprite-library.jsx';
import SpriteSelectorComponent from '../sprite-selector/sprite-selector.jsx';
import StageSelector from '../../containers/stage-selector.jsx';
import {STAGE_DISPLAY_SIZES} from '../../lib/layout-constants';
import getCostumeUrl from '../../lib/get-costume-url';

import {ContextMenuTrigger} from 'react-contextmenu';
import {ContextMenu, MenuItem} from '../context-menu/context-menu.jsx';
import {FormattedMessage} from 'react-intl';

import styles from './target-pane.css';
import {c} from 'bowser';

/*
 * Pane that contains the sprite selector, sprite info, stage selector,
 * and the new sprite, costume and backdrop buttons
 * @param {object} props Props for the component
 * @returns {React.Component} rendered component
 */
class TargetPane extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'handleOpenIRStageDebugger',
            'handleOpenStage'
        ]);
    }

    handleOpenIRStageDebugger () {
        const {
            onInterrogativeButtonClick,
            stage
        } = this.props;
        const costumeUrl = stage.costume.asset ?
            getCostumeUrl(stage.costume.asset) : null;
        onInterrogativeButtonClick(stage.id, costumeUrl);
    }

    handleOpenStage (id){
        const {
            onInterrogativeButtonClick,
            onSelectSprite,
            onChooseCategory,
            onSpriteSelected,
            spriteSelectionEnabled,
            stage
        } = this.props;
        onSelectSprite(id);
        if (spriteSelectionEnabled){
            const costumeUrl = stage.costume.asset ?
                getCostumeUrl(stage.costume.asset) : null;
            onSpriteSelected(null);
            onChooseCategory();
            onInterrogativeButtonClick(stage.id, costumeUrl);
            this.forceUpdate();
        }
    }

    render () {
        const {
            editingTarget,
            fileInputRef,
            hoveredTarget,
            spriteLibraryVisible,
            onActivateBlocksTab,
            onChangeSpriteDirection,
            onChangeSpriteName,
            onChangeSpriteRotationStyle,
            onChangeSpriteSize,
            onChangeSpriteVisibility,
            onChangeSpriteX,
            onChangeSpriteY,
            onDeleteSprite,
            onDrop,
            onDuplicateSprite,
            onExportSprite,
            onInterrogativeButtonClick,
            onFileUploadClick,
            onNewSpriteClick,
            onPaintSpriteClick,
            onRequestCloseSpriteLibrary,
            onSelectSprite,
            onSpriteUpload,
            onSurpriseSpriteClick,
            raiseSprites,
            stage,
            stageSize,
            sprites,
            vm,
            interrogationEnabled,
            ...componentProps
        } = this.props;

        return (
            <div
                className={styles.targetPane}
                {...componentProps}
            >
                <SpriteSelectorComponent
                    editingTarget={editingTarget}
                    hoveredTarget={hoveredTarget}
                    raised={raiseSprites}
                    selectedId={editingTarget}
                    spriteFileInput={fileInputRef}
                    sprites={sprites}
                    stageSize={stageSize}
                    onChangeSpriteDirection={onChangeSpriteDirection}
                    onChangeSpriteName={onChangeSpriteName}
                    onChangeSpriteRotationStyle={onChangeSpriteRotationStyle}
                    onChangeSpriteSize={onChangeSpriteSize}
                    onChangeSpriteVisibility={onChangeSpriteVisibility}
                    onChangeSpriteX={onChangeSpriteX}
                    onChangeSpriteY={onChangeSpriteY}
                    onDeleteSprite={onDeleteSprite}
                    onDrop={onDrop}
                    onDuplicateSprite={onDuplicateSprite}
                    onExportSprite={onExportSprite}
                    onInterrogativeButtonClick={onInterrogativeButtonClick}
                    onFileUploadClick={onFileUploadClick}
                    onNewSpriteClick={onNewSpriteClick}
                    onPaintSpriteClick={onPaintSpriteClick}
                    onSelectSprite={onSelectSprite}
                    onSpriteUpload={onSpriteUpload}
                    onSurpriseSpriteClick={onSurpriseSpriteClick}
                />
                <ContextMenuTrigger
                    id="stageContextMenu"
                    className={styles.text}
                >
                    <div className={styles.stageSelectorWrapper}>
                        {stage.id && <StageSelector
                            asset={
                                stage.costume &&
                                stage.costume.asset
                            }
                            backdropCount={stage.costumeCount}
                            id={stage.id}
                            selected={stage.id === editingTarget}
                            onSelect={this.handleOpenStage}
                        />}
                        <div>
                            {spriteLibraryVisible ? (
                                <SpriteLibrary
                                    vm={vm}
                                    onActivateBlocksTab={onActivateBlocksTab}
                                    onRequestClose={onRequestCloseSpriteLibrary}
                                />
                            ) : null}
                        </div>
                    </div>
                </ContextMenuTrigger>
                {onInterrogativeButtonClick && stage.id && interrogationEnabled ? (
                    <ContextMenu id="stageContextMenu">
                        <MenuItem onClick={this.handleOpenIRStageDebugger}>
                            <FormattedMessage
                                defaultMessage="Ask why..."
                                description="Menu item to open the interrogative debugger for the stage"
                                id="gui.ir-debugger.controls.open-debugger"
                            />
                        </MenuItem>
                    </ContextMenu>
                ) : null}
            </div>
        );
    }
}

const spriteShape = PropTypes.shape({
    costume: PropTypes.shape({
        // asset is defined in scratch-storage's Asset.js
        asset: PropTypes.object, // eslint-disable-line react/forbid-prop-types
        url: PropTypes.string,
        name: PropTypes.string.isRequired,
        // The following are optional because costumes uploaded from disk
        // will not have these properties available
        bitmapResolution: PropTypes.number,
        rotationCenterX: PropTypes.number,
        rotationCenterY: PropTypes.number
    }),
    costumeCount: PropTypes.number,
    direction: PropTypes.number,
    id: PropTypes.string,
    name: PropTypes.string,
    order: PropTypes.number,
    size: PropTypes.number,
    visibility: PropTypes.bool,
    x: PropTypes.number,
    y: PropTypes.number
});

TargetPane.propTypes = {
    editingTarget: PropTypes.string,
    extensionLibraryVisible: PropTypes.bool,
    fileInputRef: PropTypes.func,
    hoveredTarget: PropTypes.shape({
        hoveredSprite: PropTypes.string,
        receivedBlocks: PropTypes.bool
    }),
    onActivateBlocksTab: PropTypes.func.isRequired,
    onChangeSpriteDirection: PropTypes.func,
    onChangeSpriteName: PropTypes.func,
    onChangeSpriteRotationStyle: PropTypes.func,
    onChangeSpriteSize: PropTypes.func,
    onChangeSpriteVisibility: PropTypes.func,
    onChangeSpriteX: PropTypes.func,
    onChangeSpriteY: PropTypes.func,
    onDeleteSprite: PropTypes.func,
    onDrop: PropTypes.func,
    onDuplicateSprite: PropTypes.func,
    onExportSprite: PropTypes.func,
    onInterrogativeButtonClick: PropTypes.func,
    onFileUploadClick: PropTypes.func,
    onNewSpriteClick: PropTypes.func,
    onPaintSpriteClick: PropTypes.func,
    onRequestCloseExtensionLibrary: PropTypes.func,
    onRequestCloseSpriteLibrary: PropTypes.func,
    onSelectSprite: PropTypes.func,
    onSpriteUpload: PropTypes.func,
    onSurpriseSpriteClick: PropTypes.func,
    spriteSelectionEnabled: PropTypes.bool.isRequired,
    onSpriteSelected: PropTypes.func.isRequired,
    onChooseCategory: PropTypes.func.isRequired,
    raiseSprites: PropTypes.bool,
    spriteLibraryVisible: PropTypes.bool,
    sprites: PropTypes.objectOf(spriteShape),
    stage: spriteShape,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    vm: PropTypes.instanceOf(VM),
    interrogationEnabled: PropTypes.bool
};

export default TargetPane;
