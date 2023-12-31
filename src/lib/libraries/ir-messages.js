/* eslint-disable max-len */
import {defineMessages} from 'react-intl';

const questionMessages = defineMessages({
    /**
     * Categories
     */
    categoryGeneral: {
        defaultMessage: `General`,
        id: 'gui.ir.questions.category-general'
    },
    categoryOverall: {
        defaultMessage: `Overall`,
        id: 'gui.ir.questions.category-overall'
    },
    categoryTarget: {
        defaultMessage: `{targetName}`,
        id: 'gui.ir.questions.category-target'
    },

    /**
     * General
     */
    generalDidntAnythingMove: {
        defaultMessage: `Why didn't anything move?`,
        id: 'gui.ir.questions.general-didnt-anything-move'
    },
    generalDidntPlayAnySound: {
        defaultMessage: `Why didn't the program play any sound?`,
        id: 'gui.ir.questions.general-didnt-play-any-sound'
    },

    /**
     * Position
     */
    positionDidChange: {
        defaultMessage: `Why did {targetName}'s position change?`,
        id: 'gui.ir.questions.position-did-change'
    },
    positionDidntChange: {
        defaultMessage: `Why didn't {targetName}'s position change?`,
        id: 'gui.ir.questions.position-didnt-change'
    },
    positionDidntSpecific: {
        defaultMessage: `Why didn't {targetName} have position {value}?`,
        id: 'gui.ir.questions.position-didnt-specific'
    },

    /**
     * x-Coordinate
     */
    xCoordinateDidntSpecific: {
        defaultMessage: `Why didn't {targetName}'s x coordinate have value {value}?`,
        id: 'gui.ir.questions.xcoordinate-didnt-specific'
    },

    /**
     * y-Coordinate
     */
    yCoordinateDidntSpecific: {
        defaultMessage: `Why didn't {targetName}'s y coordinate have value {value}?`,
        id: 'gui.ir.questions.ycoordinate-didnt-specific'
    },

    /**
     * Direction
     */
    directionDidChange: {
        defaultMessage: `Why did {targetName}'s direction change?`,
        id: 'gui.ir.questions.direction-did-change'
    },
    directionDidntChange: {
        defaultMessage: `Why didn't {targetName}'s direction change?`,
        id: 'gui.ir.questions.direction-didnt-change'
    },
    directionDidntSpecific: {
        defaultMessage: `Why didn't {targetName}'s direction have value {value}?`,
        id: 'gui.ir.questions.direction-didnt-specific'
    },

    /**
     * Backdrop
     */
    backdropDidChange: {
        defaultMessage: `Why did stage's backdrop change?`,
        id: 'gui.ir.questions.backdrop-did-change'
    },
    backdropDidntChange: {
        defaultMessage: `Why didn't stage's backdrop change?`,
        id: 'gui.ir.questions.backdrop-didnt-change'
    },
    backdropDidntSpecific: {
        defaultMessage: `Why didn't stage's backdrop have value {value}?`,
        id: 'gui.ir.questions.backdrop-didnt-specific'
    },

    /**
     * Costume
     */
    costumeDidChange: {
        defaultMessage: `Why did {targetName}'s costume change?`,
        id: 'gui.ir.questions.costume-did-change'
    },
    costumeDidntChange: {
        defaultMessage: `Why didn't {targetName}'s costume change?`,
        id: 'gui.ir.questions.costume-didnt-change'
    },
    costumeDidntSpecific: {
        defaultMessage: `Why didn't {targetName}'s costume have value {value}?`,
        id: 'gui.ir.questions.costume-didnt-specific'
    },

    /**
     * Size
     */
    sizeDidChange: {
        defaultMessage: `Why did {targetName}'s size change?`,
        id: 'gui.ir.questions.size-did-change'
    },
    sizeDidntChange: {
        defaultMessage: `Why didn't {targetName}'s size change?`,
        id: 'gui.ir.questions.size-didnt-change'
    },
    sizeDidntSpecific: {
        defaultMessage: `Why didn't {targetName}'s size have value {value}?`,
        id: 'gui.ir.questions.size-didnt-specific'
    },

    /**
     * Visibility
     */
    visibilityDidChange: {
        defaultMessage: `Why did {targetName}'s visibility change?`,
        id: 'gui.ir.questions.visibility-did-change'
    },
    visibilityDidntChange: {
        defaultMessage: `Why didn't {targetName}'s visibility change?`,
        id: 'gui.ir.questions.visibility-didnt-change'
    },
    visibilityDidntSpecific: {
        defaultMessage: `Why didn't {targetName}'s visibility have value {value, select,
            visible {visible}
            hidden {hidden}
            other {unknown}
        }?`,
        id: 'gui.ir.questions.visibility-didnt-specific'
    },
    /**
     * Interaction
     */
    interactionDidNotAsk: {
        defaultMessage: `Why didn't {targetName} ask {message}?`,
        id: 'gui.ir.questions.interaction-did-not-ask'
    },
    interactionDidNotSay: {
        defaultMessage: `Why didn't {targetName} say {message}?`,
        id: 'gui.ir.questions.interaction-did-not-say'
    },
    interactionDidNotThink: {
        defaultMessage: `Why didn't {targetName} think {message}?`,
        id: 'gui.ir.questions.interaction-did-not-think'
    },

    /**
     * Global Variables
     */
    globalVariableDidntChange: {
        defaultMessage: `Why didn't global variable {variableName} change from {value}?`,
        id: 'gui.ir.questions.global-variable-didnt-change'
    },
    globalVariableDidChange: {
        defaultMessage: `Why did global variable {variableName} change from {firstValue} to {finalValue}?`,
        id: 'gui.ir.questions.global-variable-did-change'
    },
    globalVariableDidntSpecific: {
        defaultMessage: `Why didn't global variable {variableName} have value {value}?`,
        id: 'gui.ir.questions.global-variable-didnt-specific'
    },

    /**
     * Variable
     */
    variableDidntChange: {
        defaultMessage: `Why didn't {targetName}'s variable {variableName} change from {value}?`,
        id: 'gui.ir.questions.variable-didnt-change'
    },
    variableDidChange: {
        defaultMessage: `Why did {targetName}'s variable {variableName} change from {firstValue} to {finalValue}?`,
        id: 'gui.ir.questions.variable-did-change'
    },
    variableDidntSpecific: {
        defaultMessage: `Why didn't {targetName}'s variable {variableName} have value {value}?`,
        id: 'gui.ir.questions.variable-didnt-specific'
    },

    /**
     * List
     */
    globalListDidntChange: {
        defaultMessage: `Why didn't global list {listName} change from {value}?`,
        id: 'gui.ir.questions.global-list-didnt-change'
    },
    globalListDidChange: {
        defaultMessage: `Why did global list {listName} change from {firstValue} to {finalValue}?`,
        id: 'gui.ir.questions.global-list-did-change'
    },
    listDidntChange: {
        defaultMessage: `Why didn't {targetName}'s list {listName} change from {value}?`,
        id: 'gui.ir.questions.list-didnt-change'
    },
    listDidChange: {
        defaultMessage: `Why did {targetName}'s list {listName} change from {firstValue} to {finalValue}?`,
        id: 'gui.ir.questions.list-did-change'
    },

    /**
     * Sound
     */
    soundDidPlay: {
        defaultMessage: `Why did {targetName} play sound {soundName}?`,
        id: 'gui.ir.questions.sound-did-play'
    },
    soundDidntPlay: {
        defaultMessage: `Why didn't {targetName} play sound {soundName}?`,
        id: 'gui.ir.questions.sound-didnt-play'
    },

    /**
     * Broadcasts
     */
    broadcastDidCall: {
        defaultMessage: `Why did event {broadcastName} get called?`,
        id: 'gui.ir.questions.broadcast-did-call'
    },
    broadcastDidntCall: {
        defaultMessage: `Why didn't event {broadcastName} get called?`,
        id: 'gui.ir.questions.broadcast-didnt-call'
    },

    /**
     * Cloning events
     */
    cloneDidCreate: {
        defaultMessage: `Why did {targetName} get cloned?`,
        id: 'gui.ir.questions.clone-did-create'
    },
    cloneDidntCreate: {
        defaultMessage: `Why didn't {targetName} get cloned?`,
        id: 'gui.ir.questions.clone-didnt-create'
    }
});

const answerMessages = defineMessages({
    /**
     * General
     */
    manualChange: {
        defaultMessage: `No changing statements found, must have been changed manually.`,
        id: 'gui.ir.answers.no-changing-statement'
    },

    /**
     * Position
     */
    // Why did change
    positionChange: {
        defaultMessage: `These blocks changed {targetName}'s position.`,
        id: 'gui.ir.answers.position-changed'
    },
    // Why didn't change
    positionNoBlock: {
        defaultMessage: `Your code does not contain any position change blocks for {targetName}.`,
        id: 'gui.ir.answers.position-no-block'
    },
    positionNeverCalled: {
        defaultMessage: `{targetName} position change statements were never called.`,
        id: 'gui.ir.answers.position-never-called'
    },
    positionSame: {
        defaultMessage: `{targetName} did change its position, but its start and finish position are just the same.`,
        id: 'gui.ir.answers.position-same'
    },
    positionNeverChanged: {
        defaultMessage: `{targetName}'s position change statements were called, but never changed its position.`,
        id: 'gui.ir.answers.position-never-changed'
    },
    // Why not specific value?
    positionSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting position to {value} were called, but overwritten. Some were never called.`,
        id: 'gui.ir.answers.position-specific-overwritten-and-not-called'
    },
    positionSpecificOverwritten: {
        defaultMessage: `Setting position to {value} was called, but later overwritten.`,
        id: 'gui.ir.answers.position-specific-overwritten'
    },
    positionSpecificNeverCalled: {
        defaultMessage: `Setting position to {value} was never called.`,
        id: 'gui.ir.answers.position-specific-not-called'
    },

    /**
     * x-Coordinate
     */
    // Why not specific value?
    xCoordinateSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting x coordinate to {value} were called, but overwritten. Some were never called.`,
        id: 'gui.ir.answers.xcoordinate-specific-overwritten-and-not-called'
    },
    xCoordinateSpecificOverwritten: {
        defaultMessage: `Setting x coordinate to {value} was called, but later overwritten.`,
        id: 'gui.ir.answers.xcoordinate-specific-overwritten'
    },
    xCoordinateSpecificNeverCalled: {
        defaultMessage: `Setting x coordinate to {value} was never called.`,
        id: 'gui.ir.answers.xcoordinate-specific-not-called'
    },

    /**
     * y-Coordinate
     */
    // Why not specific value?
    yCoordinateSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting y coordinate to {value} were called, but overwritten. Some were never called.`,
        id: 'gui.ir.answers.ycoordinate-specific-overwritten-and-not-called'
    },
    yCoordinateSpecificOverwritten: {
        defaultMessage: `Setting y coordinate to {value} was called, but later overwritten.`,
        id: 'gui.ir.answers.ycoordinate-specific-overwritten'
    },
    yCoordinateSpecificNeverCalled: {
        defaultMessage: `Setting y coordinate to {value} was never called.`,
        id: 'gui.ir.answers.ycoordinate-specific-not-called'
    },

    /**
     * Direction
     */
    // Why did change
    directionChange: {
        defaultMessage: `These blocks changed {targetName}'s direction.`,
        id: 'gui.ir.answers.direction-changed'
    },
    // Why didn't change
    directionNoBlock: {
        defaultMessage: `Your code does not contain any direction change blocks for {targetName}.`,
        id: 'gui.ir.answers.direction-no-block'
    },
    directionNeverCalled: {
        defaultMessage: `{targetName} direction change statements were never called.`,
        id: 'gui.ir.answers.direction-never-called'
    },
    directionSame: {
        defaultMessage: `{targetName} did change its direction, but its start and finish direction are just the same.`,
        id: 'gui.ir.answers.direction-same'
    },
    directionNeverChanged: {
        defaultMessage: `{targetName}'s direction change statements were called, but never changed its direction.`,
        id: 'gui.ir.answers.direction-never-changed'
    },
    // Why not specific value?
    directionSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting direction to {value} were called, but overwritten. Some were never called.`,
        id: 'gui.ir.answers.direction-specific-overwritten-and-not-called'
    },
    directionSpecificOverwritten: {
        defaultMessage: `Setting direction to {value} was called, but later overwritten.`,
        id: 'gui.ir.answers.direction-specific-overwritten'
    },
    directionSpecificNeverCalled: {
        defaultMessage: `Setting direction to {value} was never called.`,
        id: 'gui.ir.answers.direction-specific-not-called'
    },

    /**
     * Backdrop
     */
    // Why did change
    backdropChange: {
        defaultMessage: `These statements changed the backdrop.`,
        id: 'gui.ir.answers.backdrop-changed'
    },
    // Why didn't change
    backdropNoBlock: {
        defaultMessage: `Your code does not contain any backdrop change blocks.`,
        id: 'gui.ir.answers.backdrop-no-block'
    },
    backdropNeverCalled: {
        defaultMessage: `Backdrop change statements were never called.`,
        id: 'gui.ir.answers.backdrop-never-called'
    },
    backdropSame: {
        defaultMessage: `The backdrop was changed, but its start and finish values are just the same.`,
        id: 'gui.ir.answers.backdrop-same'
    },
    backdropNeverChanged: {
        defaultMessage: `Backdrop change statements were called, but never changed the backdrop.`,
        id: 'gui.ir.answers.backdrop-never-changed'
    },
    // Why not specific value?
    backdropSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting the backdrop to {value} were called, but overwritten. Some were never called.`,
        id: 'gui.ir.answers.backdrop-specific-overwritten-and-not-called'
    },
    backdropSpecificOverwritten: {
        defaultMessage: `Setting the backdrop to {value} was called, but later overwritten.`,
        id: 'gui.ir.answers.backdrop-specific-overwritten'
    },
    backdropSpecificNeverCalled: {
        defaultMessage: `Setting the backdrop to {value} was never called.`,
        id: 'gui.ir.answers.backdrop-specific-not-called'
    },

    /**
     * Costume
     */
    // Why did change
    costumeChange: {
        defaultMessage: `These statements changed {targetName}'s costume.`,
        id: 'gui.ir.answers.costume-changed'
    },
    // Why didn't change
    costumeNoBlock: {
        defaultMessage: `Your code does not contain any costume change statements for {targetName}.`,
        id: 'gui.ir.answers.costume-no-block'
    },
    costumeNeverCalled: {
        defaultMessage: `{targetName}'s costume change statements were never called.`,
        id: 'gui.ir.answers.costume-never-called'
    },
    costumeSame: {
        defaultMessage: `{targetName}'s costume was changed, but its start and finish values are just the same.`,
        id: 'gui.ir.answers.costume-same'
    },
    costumeNeverChanged: {
        defaultMessage: `{targetName}'s costume change statements were called, but never changed its costume.`,
        id: 'gui.ir.answers.costume-never-changed'
    },
    // Why not specific value?
    costumeSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting {targetName}'s costume to {value} were called, but overwritten. Some were never called.`,
        id: 'gui.ir.answers.costume-specific-overwritten-and-not-called'
    },
    costumeSpecificOverwritten: {
        defaultMessage: `Setting {targetName}'s costume to {value} was called, but later overwritten.`,
        id: 'gui.ir.answers.costume-specific-overwritten'
    },
    costumeSpecificNeverCalled: {
        defaultMessage: `Setting {targetName}'s costume to {value} was never called.`,
        id: 'gui.ir.answers.costume-specific-not-called'
    },

    /**
     * Size
     */
    // Why did change
    sizeChange: {
        defaultMessage: `These statements changed {targetName}'s size.`,
        id: 'gui.ir.answers.size-changed'
    },
    // Why didn't change
    sizeNoBlock: {
        defaultMessage: `Your code does not contain any size change statements for {targetName}.`,
        id: 'gui.ir.answers.size-no-block'
    },
    sizeNeverCalled: {
        defaultMessage: `{targetName}'s size change statements were never called.`,
        id: 'gui.ir.answers.size-never-called'
    },
    sizeSame: {
        defaultMessage: `{targetName}'s size was changed, but its start and finish values are just the same.`,
        id: 'gui.ir.answers.size-same'
    },
    sizeNeverChanged: {
        defaultMessage: `{targetName}'s size change statements were called, but never changed its size.`,
        id: 'gui.ir.answers.size-never-changed'
    },
    // Why not specific value?
    sizeSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting size to {value} were called, but overwritten. Some were never called.`,
        id: 'gui.ir.answers.size-specific-overwritten-and-not-called'
    },
    sizeSpecificOverwritten: {
        defaultMessage: `Setting size to {value} was called, but later overwritten.`,
        id: 'gui.ir.answers.size-specific-overwritten'
    },
    sizeSpecificNeverCalled: {
        defaultMessage: `Setting size to {value} was never called.`,
        id: 'gui.ir.answers.size-specific-not-called'
    },

    /**
     * Visibility
     */
    // Why did change
    visibilityChange: {
        defaultMessage: `These statements changed {targetName}'s visibility.`,
        id: 'gui.ir.answers.visibility-changed'
    },
    // Why didn't change
    visibilityNoBlock: {
        defaultMessage: `Your code does not contain any visibility change statements for {targetName}.`,
        id: 'gui.ir.answers.visibility-no-block'
    },
    visibilityNeverCalled: {
        defaultMessage: `{targetName}'s visibility change statements were never called.`,
        id: 'gui.ir.answers.visibility-never-called'
    },
    visibilitySame: {
        defaultMessage: `{targetName}'s visibility was changed, but its start and finish values are just the same.`,
        id: 'gui.ir.answers.visibility-same'
    },
    visibilityNeverChanged: {
        defaultMessage: `{targetName}'s visibility change statements were called, but never changed its visibility.`,
        id: 'gui.ir.answers.visibility-never-changed'
    },
    // Why not specific value?
    visibilitySpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting visibility to {value, select,
            visible {visible}
            hidden {hidden}
            other {unknown}
        } were called, but overwritten. Some were never called.`,
        id: 'gui.ir.answers.visibility-specific-overwritten-and-not-called'
    },
    visibilitySpecificOverwritten: {
        defaultMessage: `Setting visibility to {value, select,
            visible {visible}
            hidden {hidden}
            other {unknown}
        } was called, but later overwritten.`,
        id: 'gui.ir.answers.visibility-specific-overwritten'
    },
    visibilitySpecificNeverCalled: {
        defaultMessage: `Setting visibility to {value, select,
            visible {visible}
            hidden {hidden}
            other {unknown}
        } was never called.`,
        id: 'gui.ir.answers.visibility-specific-not-called'
    },

    /**
     * Interaction
     */
    interactionDidNotAskNeverCalled: {
        defaultMessage: `Blocks to ask {message} were just never called.`,
        id: 'gui.ir.answers.interaction-did-not-ask-never-called'
    },
    interactionDidNotSayNeverCalled: {
        defaultMessage: `Blocks to say {message} were just never called.`,
        id: 'gui.ir.answers.interaction-did-not-say-never-called'
    },
    interactionDidNotThinkNeverCalled: {
        defaultMessage: `Blocks to think {message} were just never called.`,
        id: 'gui.ir.answers.interaction-did-not-think-never-called'
    },

    /**
     * Variable
     */
    // Why did change
    variableChange: {
        defaultMessage: `These statements changed {variableName}'s value.`,
        id: 'gui.ir.answers.variable-changed'
    },
    // Why didn't change
    variableNoBlock: {
        defaultMessage: `Your code does not contain any variable change statements for {variableName}.`,
        id: 'gui.ir.answers.variable-no-block'
    },
    variableNeverCalled: {
        defaultMessage: `{variableName}'s change statements were never called.`,
        id: 'gui.ir.answers.variable-never-called'
    },
    variableSame: {
        defaultMessage: `{variableName} was changed, but its start and finish values are just the same.`,
        id: 'gui.ir.answers.variable-same'
    },
    variableNeverChanged: {
        defaultMessage: `{variableName}'s change statements were called, but never changed its value.`,
        id: 'gui.ir.answers.variable-never-changed'
    },
    // Why not specific value?
    variableSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for {variableName}'s value to {value} were called, but overwritten. Some were never called.`,
        id: 'gui.ir.answers.variable-specific-overwritten-and-not-called'
    },
    variableSpecificOverwritten: {
        defaultMessage: `Setting {variableName}'s value to {value} was called, but later overwritten.`,
        id: 'gui.ir.answers.variable-specific-overwritten'
    },
    variableSpecificNeverCalled: {
        defaultMessage: `Setting {variableName}'s value to {value} was never called.`,
        id: 'gui.ir.answers.variable-specific-not-called'
    },
    /**
     * List
     */
    // Why did change
    listChange: {
        defaultMessage: `These statements changed {listName}.`,
        id: 'gui.ir.answers.list-changed'
    },
    // Why didn't change
    listNoBlock: {
        defaultMessage: `Your code does not contain any list update statements for {listName}.`,
        id: 'gui.ir.answers.list-no-block'
    },
    listNeverCalled: {
        defaultMessage: `{listName}'s update statements were never called.`,
        id: 'gui.ir.answers.list-never-called'
    },
    listSame: {
        defaultMessage: `{listName} was updated, but its start and finish values are just the same.`,
        id: 'gui.ir.answers.list-same'
    },
    listNeverChanged: {
        defaultMessage: `{listName}'s update statements were called, but never changed its value.`,
        id: 'gui.ir.answers.list-never-changed'
    },

    /**
     * Sound
     */
    soundPlayed: {
        defaultMessage: `Sound {soundName} was played by {targetName}.`,
        id: 'gui.ir.answers.sound-played'
    },
    soundNotPlayed: {
        defaultMessage: `{soundName} was never played by {targetName}.`,
        id: 'gui.ir.answers.sound-not-played'
    },

    /**
     * Broadcasts
     */
    broadcastCalled: {
        defaultMessage: `Broadcast {broadcastName} was called {timesCalled, plural,
            =1 {once}
            =2 {twice}
            other {# times}
        }.`,
        id: 'gui.ir.answers.broadcast-called'
    },
    broadcastNoBlock: {
        defaultMessage: `Your code does not not contain any blocks calling broadcast {broadcastName}.`,
        id: 'gui.ir.answers.broadcast-no-block'
    },
    broadcastNeverCalled: {
        defaultMessage: `{broadcastName} send blocks were never called.`,
        id: 'gui.ir.answers.broadcast-never-called'
    },

    /**
     * Cloning
     */
    cloneCreated: {
        defaultMessage: `{targetName} was cloned {timesCalled, plural,
            =1 {once}
            =2 {twice}
            other {# times}
        }.`,
        id: 'gui.ir.answers.clone-created'
    },
    cloneNeverCreated: {
        defaultMessage: `{targetName}'s cloning was never initiated.`,
        id: 'gui.ir.answers.clone-never-created'
    }
});

const blockMessages = defineMessages({
    // Motion blocks
    motion_movesteps: {
        defaultMessage: `Move steps block`,
        id: 'gui.ir.blocks.motion_movesteps'
    },
    motion_turnleft: {
        defaultMessage: `Turn right block`,
        id: 'gui.ir.blocks.motion_turnleft'
    },
    motion_turnright: {
        defaultMessage: `Turn right block`,
        id: 'gui.ir.blocks.motion_turnright'
    },
    motion_pointindirection: {
        defaultMessage: `Point in direction block`,
        id: 'gui.ir.blocks.motion_pointindirection'
    },
    motion_pointtowards: {
        defaultMessage: `Point towards block`,
        id: 'gui.ir.blocks.motion_pointtowards'
    },
    motion_goto: {
        defaultMessage: `Go to block`,
        id: 'gui.ir.blocks.motion_goto'
    },
    motion_gotoxy: {
        defaultMessage: `Go to position block`,
        id: 'gui.ir.blocks.motion_gotoxy'
    },
    motion_glidesecstoxy: {
        defaultMessage: `Glide to position block`,
        id: 'gui.ir.blocks.motion_glidesecstoxy'
    },
    motion_glideto: {
        defaultMessage: `Glide to position block`,
        id: 'gui.ir.blocks.motion_glideto'
    },
    motion_changexby: {
        defaultMessage: `Change x by block`,
        id: 'gui.ir.blocks.motion_changexby'
    },
    motion_setx: {
        defaultMessage: `Set x block`,
        id: 'gui.ir.blocks.motion_setx'
    },
    motion_changeyby: {
        defaultMessage: `Change y by block`,
        id: 'gui.ir.blocks.motion_changeyby'
    },
    motion_sety: {
        defaultMessage: `Set y block`,
        id: 'gui.ir.blocks.motion_sety'
    },
    motion_ifonedgebounce: {
        defaultMessage: `Bounce on edge block`,
        id: 'gui.ir.blocks.motion_ifonedgebounce'
    },
    motion_setrotationstyle: {
        defaultMessage: `Set rotation block`,
        id: 'gui.ir.blocks.motion_setrotationstyle'
    },

    // Looks blocks
    looks_sayforsecs: {
        defaultMessage: `Saying block`,
        id: 'gui.ir.blocks.looks_sayforsecs'
    },
    looks_say: {
        defaultMessage: `Saying block`,
        id: 'gui.ir.blocks.looks_say'
    },
    looks_thinkforsecs: {
        defaultMessage: `Thinking block`,
        id: 'gui.ir.blocks.looks_thinkforsecs'
    },
    looks_think: {
        defaultMessage: `Thinking block`,
        id: 'gui.ir.blocks.looks_think'
    },
    looks_switchcostumeto: {
        defaultMessage: `Switch costume block`,
        id: 'gui.ir.blocks.looks_switchcostumeto'
    },
    looks_nextcostume: {
        defaultMessage: `Next costume block`,
        id: 'gui.ir.blocks.looks_nextcostume'
    },
    looks_switchbackdropto: {
        defaultMessage: `Switch backdrop block`,
        id: 'gui.ir.blocks.looks_switchbackdropto'
    },
    looks_nextbackdrop: {
        defaultMessage: `Next backdrop block`,
        id: 'gui.ir.blocks.looks_nextbackdrop'
    },
    looks_changesizeby: {
        defaultMessage: `Change size block`,
        id: 'gui.ir.blocks.looks_changesizeby'
    },
    looks_setsizeto: {
        defaultMessage: `Set size block`,
        id: 'gui.ir.blocks.looks_setsizeto'
    },
    looks_show: {
        defaultMessage: `Show block`,
        id: 'gui.ir.blocks.looks_show'
    },
    looks_hide: {
        defaultMessage: `Hide block`,
        id: 'gui.ir.blocks.looks_hide'
    },

    // Sound blocks
    sound_play: {
        defaultMessage: `Play sound block`,
        id: 'gui.ir.blocks.sound_play'
    },
    sound_playuntildone: {
        defaultMessage: `Play sound block`,
        id: 'gui.ir.blocks.sound_playuntildone'
    },
    sound_stopallsounds: {
        defaultMessage: `Stop sounds block`,
        id: 'gui.ir.blocks.sound_stopallsounds'
    },

    // Event blocks
    event_whenflagclicked: {
        defaultMessage: `When green flag clicked block`,
        id: 'gui.ir.blocks.event_whenflagclicked'
    },
    event_whenkeypressed: {
        defaultMessage: `When key pressed block`,
        id: 'gui.ir.blocks.event_whenkeypressed'
    },
    event_whenthisspriteclicked: {
        defaultMessage: `When this sprite clicked block`,
        id: 'gui.ir.blocks.event_whenthisspriteclicked'
    },
    event_whenstageclicked: {
        defaultMessage: `When stage clicked block`,
        id: 'gui.ir.blocks.event_whenstageclicked'
    },
    event_whentouchingobject: {
        defaultMessage: `When this sprite touches block`,
        id: 'gui.ir.blocks.event_whentouchingobject'
    },
    event_whenbroadcastreceived: {
        defaultMessage: `Receive broadcast block`,
        id: 'gui.ir.blocks.event_whenbroadcastreceived'
    },
    event_whenbackdropswitchesto: {
        defaultMessage: `When backdrop switches block`,
        id: 'gui.ir.blocks.event_whenbackdropswitchesto'
    },
    event_whengreaterthan: {
        defaultMessage: `When greater block`,
        id: 'gui.ir.blocks.event_whengreaterthan'
    },
    event_broadcast: {
        defaultMessage: `Send broadcast block`,
        id: 'gui.ir.blocks.event_broadcast'
    },
    event_broadcastandwait: {
        defaultMessage: `Send broadcast block`,
        id: 'gui.ir.blocks.event_broadcastandwait'
    },

    // Control blocks
    control_wait: {
        defaultMessage: `Wait block`,
        id: 'gui.ir.blocks.control_wait'
    },
    control_wait_until: {
        defaultMessage: `Wait until block`,
        id: 'gui.ir.blocks.control_wait_until'
    },
    control_forever: {
        defaultMessage: `Forever loop block`,
        id: 'gui.ir.blocks.control_forever'
    },
    control_repeat: {
        defaultMessage: `Repeat loop block`,
        id: 'gui.ir.blocks.control_repeat'
    },
    control_repeat_until: {
        defaultMessage: `Repeat until loop block`,
        id: 'gui.ir.blocks.control_repeat_until'
    },
    control_if: {
        defaultMessage: `If block`,
        id: 'gui.ir.blocks.control_if'
    },
    control_if_else: {
        defaultMessage: `If-else block`,
        id: 'gui.ir.blocks.control_if_else'
    },
    control_stop: {
        defaultMessage: `Stop block`,
        id: 'gui.ir.blocks.control_stop'
    },
    control_start_as_clone: {
        defaultMessage: `Start as clone block`,
        id: `gui.ir.blocks.control_start_as_clone`
    },
    control_create_clone_of: {
        defaultMessage: `Clone block`,
        id: `gui.ir.blocks.control_create_clone_of`
    },
    control_delete_this_clone: {
        defaultMessage: `Delete clone block`,
        id: `gui.ir.blocks.control_delete_this_clone`
    },

    // Sensing blocks
    sensing_touchingobject: {
        defaultMessage: `Touching block`,
        id: 'gui.ir.blocks.sensing_touchingobject'
    },
    sensing_touchingcolor: {
        defaultMessage: `Touching color block`,
        id: 'gui.ir.blocks.sensing_touchingcolor'
    },
    sensing_coloristouchingcolor: {
        defaultMessage: `Two colors touching block`,
        id: 'gui.ir.blocks.sensing_coloristouchingcolor'
    },
    sensing_distanceto: {
        defaultMessage: `Distance block`,
        id: 'gui.ir.blocks.sensing_distanceto'
    },
    sensing_askandwait: {
        defaultMessage: `Asking block`,
        id: 'gui.ir.blocks.sensing_askandwait'
    },
    sensing_keypressed: {
        defaultMessage: `Key pressed block`,
        id: 'gui.ir.blocks.sensing_keypressed'
    },
    sensing_mousedown: {
        defaultMessage: `Mouse down block`,
        id: 'gui.ir.blocks.sensing_mousedown'
    },
    sensing_setdragmode: {
        defaultMessage: `Set drag mode block`,
        id: 'gui.ir.blocks.sensing_setdragmode'
    },
    sensing_resettimer: {
        defaultMessage: `Reset timer block`,
        id: 'gui.ir.blocks.sensing_resettimer'
    },
    sensing_of: {
        defaultMessage: `Attribute block`,
        id: 'gui.ir.blocks.sensing_of'
    },

    // Variables blocks
    data_setvariableto: {
        defaultMessage: `Set variable block`,
        id: 'gui.ir.blocks.data_setvariableto'
    },
    data_changevariableby: {
        defaultMessage: `Change variable block`,
        id: 'gui.ir.blocks.data_changevariableby'
    },
    // List blocks
    data_addtolist: {
        defaultMessage: `Add to list block`,
        id: 'gui.ir.blocks.data_addtolist'
    },
    data_deleteoflist: {
        defaultMessage: `Delete from list block`,
        id: 'gui.ir.blocks.data_deleteoflist'
    },
    data_deletealloflist: {
        defaultMessage: `Clear list block`,
        id: 'gui.ir.blocks.data_deletealloflist'
    },
    data_insertatlist: {
        defaultMessage: `Insert at list block`,
        id: 'gui.ir.blocks.data_insertatlist'
    },
    data_replaceitemoflist: {
        defaultMessage: `Replace at list block`,
        id: 'gui.ir.blocks.data_replaceitemoflist'
    }
});

const eventMessages = defineMessages({
    broadcast: {
        defaultMessage: `Broadcast {value}`,
        id: 'gui.ir.event.broadcast'
    },
    clone: {
        defaultMessage: `Cloning {value} event`,
        id: 'gui.ir.event.clone'
    }
});

const userEventMessages = defineMessages({
    event_whenflagclicked: {
        defaultMessage: `Green Flag event`,
        id: 'gui.ir.user-event.event_whenflagclicked'
    },
    event_whenthisspriteclicked: {
        defaultMessage: `{value} Clicked event`,
        id: 'gui.ir.user-event.event_whenthisspriteclicked'
    },
    event_whenstageclicked: {
        defaultMessage: `Stage Clicked event`,
        id: 'gui.ir.user-event.event_whenstageclicked'
    },
    event_whenkeypressed: {
        defaultMessage: `{value, select,
            space {Space Key}
            any {Any Key}
            other {Key {value}}
        } Pressed event`,
        id: 'gui.ir.user-event.event_whenkeypressed'
    }
});

const statementMessages = defineMessages({
    // No statement
    failed: {
        defaultMessage: `Failed to display`,
        id: 'gui.ir.statement.failed'
    },
    // UnreachableStatement
    unreachableStatement: {
        defaultMessage: `{block} seems to be unreachable.`,
        id: 'gui.ir.statement.unreachable-statement'
    },
    // ChangingStatement
    changingStatement: {
        defaultMessage: `{block} resulted in a change from {startValue} to {endValue}.`,
        id: 'gui.ir.statement.changing-statement'
    },
    // NotChangingStatement
    notChangingStatement: {
        defaultMessage: `{block} was called {timesCalled, plural,
            =1 {once}
            =2 {twice}
            other {# times}
        }, but never resulted in a change from {value}.`,
        id: 'gui.ir.statement.not-changing-statement'
    },
    // CalledButWrongBranchStatement
    calledButWrongBranchStatement: {
        defaultMessage: `{block} was called {timesCalled, plural,
            =1 {once}
            =2 {twice}
            other {# times}
        } and the condition was {timesCalled, plural,
            =1 {{value}}
            =2 {{value} both times}
            other {always {value}}
        }, but expected to be {requiredCondition, select,
            true {true}
            false {false}
            other {other}
        }.`,
        id: 'gui.ir.statement.called-but-wrong-branch-statement'
    },
    // RightBranchButStoppedStatement
    rightBranchButStoppedStatement: {
        defaultMessage: `{block} was called {condition, select,
            true {with the correct condition true}
            false {with the correct condition false}
            other {}
        }, but execution was stopped before reaching the target block.`,
        id: 'gui.ir.statement.right-branch-but-stopped-statement'
    },
    // NotCalledControlStatement: {
    calledControlStatement: {
        defaultMessage: `{block} was called  {condition, select,
            true {with the correct condition true}
            false {with the correct condition false}
            other {}
        }.`,
        id: 'gui.ir.statement.called-control-statement'
    },
    // NotCalledControlStatement: {
    notCalledControlStatement: {
        defaultMessage: `{block} was never called.`,
        id: 'gui.ir.statement.not-called-control-statement'
    },
    // CalledStatement
    calledStatement: {
        defaultMessage: `{block} was called.`,
        id: 'gui.ir.statement.called-statement'
    },
    // NotCalledStatement
    notCalledStatement: {
        defaultMessage: `{block} was never called.`,
        id: 'gui.ir.statement.not-called-statement'
    },
    // OverwrittenStatement
    overwrittenStatement: {
        defaultMessage: `{block} was called {timesCalled, plural,
            =1 {once, but}
            =2 {twice, but the last call}
            other {# times, but the last call}
        } was overwritten.`,
        id: 'gui.ir.statement.overwritten-statement'
    },
    // OverwritingStatement
    overwritingStatement: {
        defaultMessage: `{block} overwrote {startValue} to {endValue}.`,
        id: 'gui.ir.statement.overwriting-statement'
    },
    // EventNotSentStatement,
    eventNotSentStatement: {
        defaultMessage: `{event} was never sent.`,
        id: 'gui.ir.statement.event-not-sent-statement'
    },
    // EventSentAndReceiveButStoppedStatement,
    eventSentAndReceiveButStoppedStatement: {
        defaultMessage: `{event} was sent and received, but execution was stopped before the target block.`,
        id: 'gui.ir.statement.event-sent-and-receive-but-stopped-statement'
    },
    // EventSentNotReceivedStatement,
    eventSentNotReceivedStatement: {
        defaultMessage: `{event} was sent, but did not trigger the receiving block just yet.`,
        id: 'gui.ir.statement.event-sent-not-receive-statement'
    },
    // EventSentStatement,
    eventSentStatement: {
        defaultMessage: `{event} was sent.`,
        id: 'gui.ir.statement.event-sent-statement'
    },
    // UserEventCalledStatement,
    userEventCalledStatement: {
        defaultMessage: `{userEvent} was triggered.`,
        id: 'gui.ir.statement.user-event-called-statement'
    },
    // UserEventCalledButStoppedStatement,
    userEventCalledButStoppedStatement: {
        defaultMessage: `{userEvent} was triggered, but execution was stopped before reaching the target block.`,
        id: 'gui.ir.statement.user-event-called-but-stopped-statement'
    },
    // UserEventNotCalledStatement
    userEventNotCalledStatement: {
        defaultMessage: `{userEvent} was never triggered.`,
        id: 'gui.ir.statement.user-event-not-called-statement'
    }
});

class StatementFormatter {
    constructor (targets, blocks) {
        this.targets = targets;
        this.blocks = blocks;
    }

    formatBlock (block) {
        const opcode = block.opcode;
        const title = blockMessages[opcode];
        const extras = {};

        // targets, blocks and opcode can be used to format a block specifically:
        // switch (opcode) {
        // case 'control_stop':
        //     extras.type = block.inputs...;
        // }

        return {title, extras};
    }

    formatEvent (event) {
        const title = eventMessages[event.type];
        const extras = {
            value: event.value
        };
        return {title, extras};
    }

    formatUserEvent (userEvent) {
        const title = userEventMessages[userEvent.opcode];
        const extras = {
            value: userEvent.value
        };
        return {title, extras};
    }
}

export {
    questionMessages,
    answerMessages,
    statementMessages,
    StatementFormatter
};
