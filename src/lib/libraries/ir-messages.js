/* eslint-disable max-len */
import {defineMessages} from 'react-intl';

const questionMessages = defineMessages({
    /**
     * Categories
     */
    categoryGeneral: {
        defaultMessage: `General`,
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.category-general'
    },
    categoryOverall: {
        defaultMessage: `Overall`,
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.category-overall'
    },
    categoryTarget: {
        defaultMessage: `{targetName}`,
        description: 'Questions about target {targetName}',
        id: 'gui.ir-question.category-target'
    },

    /**
     * General
     */
    generalDidntAnythingMove: {
        defaultMessage: `Why didn't anything move?`,
        description: 'Questions about target {targetName}',
        id: 'gui.ir-question.general-didnt-anything-move'
    },
    generalDidntPlayAnySound: {
        defaultMessage: `Why didn't the program play any sound?`,
        description: 'Questions about target {targetName}',
        id: 'gui.ir-question.general-didnt-play-any-sound'
    },

    /**
     * Position
     */
    positionDidChange: {
        defaultMessage: `Why did {targetName}'s position change?`,
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.position-did-change'
    },
    positionDidntChange: {
        defaultMessage: `Why didn't {targetName}'s position change?`,
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.position-didnt-change'
    },
    positionDidntSpecific: {
        defaultMessage: `Why didn't {targetName} have position {value}?`,
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.position-didnt-specific'
    },

    /**
     * x-Coordinate
     */
    xCoordinateDidntSpecific: {
        defaultMessage: `Why didn't {targetName}'s x coordinate have value {value}?`,
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.xcoordinate-didnt-specific'
    },

    /**
     * y-Coordinate
     */
    yCoordinateDidntSpecific: {
        defaultMessage: `Why didn't {targetName}'s y coordinate have value {value}?`,
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.ycoordinate-didnt-specific'
    },

    /**
     * Direction
     */
    directionDidChange: {
        defaultMessage: `Why did {targetName}'s direction change?`,
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.direction-did-change'
    },
    directionDidntChange: {
        defaultMessage: `Why didn't {targetName}'s direction change?`,
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.direction-didnt-change'
    },
    directionDidntSpecific: {
        defaultMessage: `Why didn't {targetName}'s direction have value {value}?`,
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.direction-didnt-specific'
    },

    /**
     * Backdrop
     */
    backdropDidChange: {
        defaultMessage: `Why did stage's backdrop change?`,
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.backdrop-did-change'
    },
    backdropDidntChange: {
        defaultMessage: `Why didn't stage's backdrop change?`,
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.backdrop-didnt-change'
    },
    backdropDidntSpecific: {
        defaultMessage: `Why didn't stage's backdrop have value {value}?`,
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.backdrop-didnt-specific'
    },

    /**
     * Costume
     */
    costumeDidChange: {
        defaultMessage: `Why did {targetName}'s costume change?`,
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.costume-did-change'
    },
    costumeDidntChange: {
        defaultMessage: `Why didn't {targetName}'s costume change?`,
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.costume-didnt-change'
    },
    costumeDidntSpecific: {
        defaultMessage: `Why didn't {targetName}'s costume have value {value}?`,
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.costume-didnt-specific'
    },

    /**
     * Size
     */
    sizeDidChange: {
        defaultMessage: `Why did {targetName}'s size change?`,
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.size-did-change'
    },
    sizeDidntChange: {
        defaultMessage: `Why didn't {targetName}'s size change?`,
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.size-didnt-change'
    },
    sizeDidntSpecific: {
        defaultMessage: `Why didn't {targetName}'s size have value {value}?`,
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.size-didnt-specific'
    },

    /**
     * Visibility
     */
    visibilityDidChange: {
        defaultMessage: `Why did {targetName}'s visibility change?`,
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.visibility-did-change'
    },
    visibilityDidntChange: {
        defaultMessage: `Why didn't {targetName}'s visibility change?`,
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.visibility-didnt-change'
    },
    visibilityDidntSpecific: {
        defaultMessage: `Why didn't {targetName}'s visibility have value {value}?`,
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.visibility-didnt-specific'
    },

    /**
     * Global Variables
     */
    globalVariableDidntChange: {
        defaultMessage: `Why didn't global variable {variableName} change from {value}?`,
        id: 'gui.ir-question.global-variable-didnt-change'
    },
    globalVariableDidChange: {
        defaultMessage: `Why did global variable {variableName} change from {firstValue} to {finalValue}?`,
        id: 'gui.ir-question.global-variable-did-change'
    },
    globalVariableDidntSpecific: {
        defaultMessage: `Why didn't global variable {variableName} have value {value}?`,
        id: 'gui.ir-question.global-variable-didnt-specific'
    },

    /**
     * Variable
     */
    variableDidntChange: {
        defaultMessage: `Why didn't {targetName}'s variable {variableName} change from {value}?`,
        id: 'gui.ir-question.variable-didnt-change'
    },
    variableDidChange: {
        defaultMessage: `Why did {targetName}'s variable {variableName} change from {firstValue} to {finalValue}?`,
        id: 'gui.ir-question.variable-did-change'
    },
    variableDidntSpecific: {
        defaultMessage: `Why didn't {targetName}'s variable {variableName} have value {value}?`,
        id: 'gui.ir-question.variable-didnt-specific'
    },

    /**
     * Sound
     */
    soundDidPlay: {
        defaultMessage: `Why did {targetName} play sound {soundName}?`,
        id: 'gui.ir-question.sound-did-play'
    },
    soundDidntPlay: {
        defaultMessage: `Why didn't {targetName} play sound {soundName}?`,
        id: 'gui.ir-question.sound-didnt-play'
    },

    /**
     * Broadcasts
     */
    broadcastDidCall: {
        defaultMessage: `Why did event {broadcastName} get called?`,
        id: 'gui.ir-question.broadcast-did-call'
    },
    broadcastDidntCall: {
        defaultMessage: `Why didn't event {broadcastName} get called?`,
        id: 'gui.ir-question.broadcast-didnt-call'
    },

    /**
     * Cloning events
     */
    cloneDidCreate: {
        defaultMessage: `Why did {targetName} get cloned?`,
        id: 'gui.ir-question.clone-did-create'
    },
    cloneDidntCreate: {
        defaultMessage: `Why didn't {targetName} get cloned?`,
        id: 'gui.ir-question.clone-didnt-create'
    }
});

const answerMessages = defineMessages({
    /**
     * General
     */
    manualChange: {
        defaultMessage: 'No changing statements found, must have been changed manually.',
        id: 'gui.ir-answer.no-changing-statement'
    },

    /**
     * Position
     */
    // Why did change
    positionChange: {
        defaultMessage: `These blocks changed {targetName}'s position.`,
        id: 'gui.ir-answer.position-changed'
    },
    // Why didn't change
    positionNoBlock: {
        defaultMessage: `Your code does not contain any position change blocks for {targetName}.`,
        id: 'gui.ir-answer.position-no-block'
    },
    positionNeverCalled: {
        defaultMessage: `{targetName} position change statements were never called, here's why.`,
        id: 'gui.ir-answer.position-never-called'
    },
    positionSame: {
        defaultMessage: `{targetName} did change its position, but its start and finish position are just the same.`,
        id: 'gui.ir-answer.position-same'
    },
    positionNeverChanged: {
        defaultMessage: `{targetName}'s position change statements were called, but never changed its position.`,
        id: 'gui.ir-answer.position-never-changed'
    },
    // Why not specific value?
    positionSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting position to {value} were called, but overwritten. Some were never called.`,
        id: 'gui.ir-answer.position-specific-overwritten-and-not-called'
    },
    positionSpecificOverwritten: {
        defaultMessage: `Setting position to {value} was called, but later overwritten.`,
        id: 'gui.ir-answer.position-specific-overwritten'
    },
    positionSpecificNeverCalled: {
        defaultMessage: `Setting position to {value} was never called.`,
        id: 'gui.ir-answer.position-specific-not-called'
    },

    /**
     * x-Coordinate
     */
    // Why not specific value?
    xCoordinateSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting x coordinate to {value} were called, but overwritten. Some were never called.`,
        id: 'gui.ir-answer.xcoordinate-specific-overwritten-and-not-called'
    },
    xCoordinateSpecificOverwritten: {
        defaultMessage: `Setting x coordinate to {value} was called, but later overwritten.`,
        id: 'gui.ir-answer.xcoordinate-specific-overwritten'
    },
    xCoordinateSpecificNeverCalled: {
        defaultMessage: `Setting x coordinate to {value} was never called.`,
        id: 'gui.ir-answer.xcoordinate-specific-not-called'
    },

    /**
     * y-Coordinate
     */
    // Why not specific value?
    yCoordinateSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting y coordinate to {value} were called, but overwritten. Some were never called.`,
        id: 'gui.ir-answer.ycoordinate-specific-overwritten-and-not-called'
    },
    yCoordinateSpecificOverwritten: {
        defaultMessage: `Setting y coordinate to {value} was called, but later overwritten.`,
        id: 'gui.ir-answer.ycoordinate-specific-overwritten'
    },
    yCoordinateSpecificNeverCalled: {
        defaultMessage: `Setting y coordinate to {value} was never called.`,
        id: 'gui.ir-answer.ycoordinate-specific-not-called'
    },

    /**
     * Direction
     */
    // Why did change
    directionChange: {
        defaultMessage: `These blocks changed {targetName}'s direction.`,
        id: 'gui.ir-answer.direction-changed'
    },
    // Why didn't change
    directionNoBlock: {
        defaultMessage: `Your code does not contain any direction change blocks for {targetName}.`,
        id: 'gui.ir-answer.direction-no-block'
    },
    directionNeverCalled: {
        defaultMessage: `{targetName} direction change statements were never called, here's why.`,
        id: 'gui.ir-answer.direction-never-called'
    },
    directionSame: {
        defaultMessage: `{targetName} did change its direction, but its start and finish direction are just the same.`,
        id: 'gui.ir-answer.direction-same'
    },
    directionNeverChanged: {
        defaultMessage: `{targetName}'s direction change statements were called, but never changed its direction.`,
        id: 'gui.ir-answer.direction-never-changed'
    },
    // Why not specific value?
    directionSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting direction to {value} were called, but overwritten. Some were never called.`,
        id: 'gui.ir-answer.direction-specific-overwritten-and-not-called'
    },
    directionSpecificOverwritten: {
        defaultMessage: `Setting direction to {value} was called, but later overwritten.`,
        id: 'gui.ir-answer.direction-specific-overwritten'
    },
    directionSpecificNeverCalled: {
        defaultMessage: `Setting direction to {value} was never called.`,
        id: 'gui.ir-answer.direction-specific-not-called'
    },

    /**
     * Backdrop
     */
    // Why did change
    backdropChange: {
        defaultMessage: `These statements changed the backdrop.`,
        id: 'gui.ir-answer.backdrop-changed'
    },
    // Why didn't change
    backdropNoBlock: {
        defaultMessage: `Your code does not contain any backdrop change blocks.`,
        id: 'gui.ir-answer.backdrop-no-block'
    },
    backdropNeverCalled: {
        defaultMessage: `Backdrop change statements were never called, here's why.`,
        id: 'gui.ir-answer.backdrop-never-called'
    },
    backdropSame: {
        defaultMessage: `The backdrop was changed, but its start and finish values are just the same.`,
        id: 'gui.ir-answer.backdrop-same'
    },
    backdropNeverChanged: {
        defaultMessage: `Backdrop change statements were called, but never changed the backdrop.`,
        id: 'gui.ir-answer.backdrop-never-changed'
    },
    // Why not specific value?
    backdropSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting the backdrop to {value} were called, but overwritten. Some were never called.`,
        id: 'gui.ir-answer.backdrop-specific-overwritten-and-not-called'
    },
    backdropSpecificOverwritten: {
        defaultMessage: `Setting the backdrop to {value} was called, but later overwritten.`,
        id: 'gui.ir-answer.backdrop-specific-overwritten'
    },
    backdropSpecificNeverCalled: {
        defaultMessage: `Setting the backdrop to {value} was never called.`,
        id: 'gui.ir-answer.backdrop-specific-not-called'
    },

    /**
     * Costume
     */
    // Why did change
    costumeChange: {
        defaultMessage: `These statements changed {targetName}'s costume.`,
        id: 'gui.ir-answer.costume-changed'
    },
    // Why didn't change
    costumeNoBlock: {
        defaultMessage: `Your code does not contain any costume change statements for {targetName}.`,
        id: 'gui.ir-answer.costume-no-block'
    },
    costumeNeverCalled: {
        defaultMessage: `{targetName}'s costume change statements were never called, here's why.`,
        id: 'gui.ir-answer.costume-never-called'
    },
    costumeSame: {
        defaultMessage: `{targetName}'s costume was changed, but its start and finish values are just the same.`,
        id: 'gui.ir-answer.costume-same'
    },
    costumeNeverChanged: {
        defaultMessage: `{targetName}'s costume change statements were called, but never changed its costume.`,
        id: 'gui.ir-answer.costume-never-changed'
    },
    // Why not specific value?
    costumeSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting {targetName}'s costume to {value} were called, but overwritten. Some were never called.`,
        id: 'gui.ir-answer.costume-specific-overwritten-and-not-called'
    },
    costumeSpecificOverwritten: {
        defaultMessage: `Setting {targetName}'s costume to {value} was called, but later overwritten.`,
        id: 'gui.ir-answer.costume-specific-overwritten'
    },
    costumeSpecificNeverCalled: {
        defaultMessage: `Setting {targetName}'s costume to {value} was never called.`,
        id: 'gui.ir-answer.costume-specific-not-called'
    },

    /**
     * Size
     */
    // Why did change
    sizeChange: {
        defaultMessage: `These statements changed {targetName}'s size.`,
        id: 'gui.ir-answer.size-changed'
    },
    // Why didn't change
    sizeNoBlock: {
        defaultMessage: `Your code does not contain any size change statements for {targetName}.`,
        id: 'gui.ir-answer.size-no-block'
    },
    sizeNeverCalled: {
        defaultMessage: `{targetName}'s size change statements were never called, here's why.`,
        id: 'gui.ir-answer.size-never-called'
    },
    sizeSame: {
        defaultMessage: `{targetName}'s size was changed, but its start and finish values are just the same.`,
        id: 'gui.ir-answer.size-same'
    },
    sizeNeverChanged: {
        defaultMessage: `{targetName}'s size change statements were called, but never changed its size.`,
        id: 'gui.ir-answer.size-never-changed'
    },
    // Why not specific value?
    sizeSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting size to {value} were called, but overwritten. Some were never called.`,
        id: 'gui.ir-answer.size-specific-overwritten-and-not-called'
    },
    sizeSpecificOverwritten: {
        defaultMessage: `Setting size to {value} was called, but later overwritten.`,
        id: 'gui.ir-answer.size-specific-overwritten'
    },
    sizeSpecificNeverCalled: {
        defaultMessage: `Setting size to {value} was never called.`,
        id: 'gui.ir-answer.size-specific-not-called'
    },

    /**
     * Visibility
     */
    // Why did change
    visibilityChange: {
        defaultMessage: `These statements changed {targetName}'s visibility.`,
        id: 'gui.ir-answer.visibility-changed'
    },
    // Why didn't change
    visibilityNoBlock: {
        defaultMessage: `Your code does not contain any visibility change statements for {targetName}.`,
        id: 'gui.ir-answer.visibility-no-block'
    },
    visibilityNeverCalled: {
        defaultMessage: `{targetName}'s visibility change statements were never called, here's why.`,
        id: 'gui.ir-answer.visibility-never-called'
    },
    visibilitySame: {
        defaultMessage: `{targetName}'s visibility was changed, but its start and finish values are just the same.`,
        id: 'gui.ir-answer.visibility-same'
    },
    visibilityNeverChanged: {
        defaultMessage: `{targetName}'s visibility change statements were called, but never changed its visibility.`,
        id: 'gui.ir-answer.visibility-never-changed'
    },
    // Why not specific value?
    visibilitySpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting visibility to {value} were called, but overwritten. Some were never called.`,
        id: 'gui.ir-answer.visibility-specific-overwritten-and-not-called'
    },
    visibilitySpecificOverwritten: {
        defaultMessage: `Setting visibility to {value} was called, but later overwritten.`,
        id: 'gui.ir-answer.visibility-specific-overwritten'
    },
    visibilitySpecificNeverCalled: {
        defaultMessage: `Setting visibility to {value} was never called.`,
        id: 'gui.ir-answer.visibility-specific-not-called'
    },

    /**
     * Variable
     */
    // Why did change
    variableChange: {
        defaultMessage: `These statements changed {variableName}'s value.`,
        id: 'gui.ir-answer.variable-changed'
    },
    // Why didn't change
    variableNoBlock: {
        defaultMessage: `Your code does not contain any variable change statements for {variableName}.`,
        id: 'gui.ir-answer.variable-no-block'
    },
    variableNeverCalled: {
        defaultMessage: `{variableName}'s change statements were never called, here's why.`,
        id: 'gui.ir-answer.variable-never-called'
    },
    variableSame: {
        defaultMessage: `{variableName} was changed, but its start and finish values are just the same.`,
        id: 'gui.ir-answer.variable-same'
    },
    variableNeverChanged: {
        defaultMessage: `{variableName}'s change statements were called, but never changed its value.`,
        id: 'gui.ir-answer.variable-never-changed'
    },
    // Why not specific value?
    variableSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for {variableName}'s value to {value} were called, but overwritten. Some were never called.`,
        id: 'gui.ir-answer.variable-specific-overwritten-and-not-called'
    },
    variableSpecificOverwritten: {
        defaultMessage: `Setting {variableName}'s value to {value} was called, but later overwritten.`,
        id: 'gui.ir-answer.variable-specific-overwritten'
    },
    variableSpecificNeverCalled: {
        defaultMessage: `Setting {variableName}'s value to {value} was never called.`,
        id: 'gui.ir-answer.variable-specific-not-called'
    },

    /**
     * Sound
     */
    soundPlayed: {
        defaultMessage: `Sound {soundName} was played by {targetName}, here's why.`,
        id: 'gui.ir-answer.sound-played'
    },
    soundNotPlayed: {
        defaultMessage: `{soundName} never played by {targetName}, here's why.`,
        id: 'gui.ir-answer.sound-not-played'
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
        id: 'gui.ir-answer.broadcast-called'
    },
    broadcastNoBlock: {
        defaultMessage: `Your code does not not contain any blocks calling broadcast {broadcastName}.`,
        id: 'gui.ir-answer.broadcast-no-block'
    },
    broadcastNeverCalled: {
        defaultMessage: `{broadcastName} send blocks were never called.`,
        id: 'gui.ir-answer.broadcast-never-called'
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
        id: 'gui.ir-answer.clone-created'
    },
    cloneNeverCreated: {
        defaultMessage: `{targetName}'s cloning was never initiated.`,
        id: 'gui.ir-answer.clone-never-created'
    }
});

const blockMessages = defineMessages({
    // Motion blocks
    motion_movesteps: {
        defaultMessage: 'Move steps block',
        id: 'gui.ir-blocks.motion_movesteps'
    },
    motion_turnleft: {
        defaultMessage: 'Turn right block',
        id: 'gui.ir-blocks.motion_turnleft'
    },
    motion_turnright: {
        defaultMessage: 'Turn right block',
        id: 'gui.ir-blocks.motion_turnright'
    },
    motion_pointindirection: {
        defaultMessage: 'Point in direction block',
        id: 'gui.ir-blocks.motion_pointindirection'
    },
    motion_pointtowards: {
        defaultMessage: 'Point towards block',
        id: 'gui.ir-blocks.motion_pointtowards'
    },
    motion_goto: {
        defaultMessage: 'Go to block',
        id: 'gui.ir-blocks.motion_goto'
    },
    motion_gotoxy: {
        defaultMessage: 'Go to position block',
        id: 'gui.ir-blocks.motion_gotoxy'
    },
    motion_glidesecstoxy: {
        defaultMessage: 'Glide to position block',
        id: 'gui.ir-blocks.motion_glidesecstoxy'
    },
    motion_glideto: {
        defaultMessage: 'Glide to position block',
        id: 'gui.ir-blocks.motion_glideto'
    },
    motion_changexby: {
        defaultMessage: 'Change x by block',
        id: 'gui.ir-blocks.motion_changexby'
    },
    motion_setx: {
        defaultMessage: 'Set x block',
        id: 'gui.ir-blocks.motion_setx'
    },
    motion_changeyby: {
        defaultMessage: 'Change y by block',
        id: 'gui.ir-blocks.motion_changeyby'
    },
    motion_sety: {
        defaultMessage: 'Set y block',
        id: 'gui.ir-blocks.motion_sety'
    },
    motion_ifonedgebounce: {
        defaultMessage: 'Bounce on edge block',
        id: 'gui.ir-blocks.motion_ifonedgebounce'
    },
    motion_setrotationstyle: {
        defaultMessage: 'Set rotation block',
        id: 'gui.ir-blocks.motion_setrotationstyle'
    },

    // Looks blocks
    looks_sayforsecs: {
        defaultMessage: 'Say block',
        id: 'gui.ir-blocks.looks_sayforsecs'
    },
    looks_say: {
        defaultMessage: 'Say block',
        id: 'gui.ir-blocks.looks_say'
    },
    looks_thinkforsecs: {
        defaultMessage: 'Think block',
        id: 'gui.ir-blocks.looks_thinkforsecs'
    },
    looks_think: {
        defaultMessage: 'Think block',
        id: 'gui.ir-blocks.looks_think'
    },
    looks_switchcostumeto: {
        defaultMessage: 'Switch costume block',
        id: 'gui.ir-blocks.looks_switchcostumeto'
    },
    looks_nextcostume: {
        defaultMessage: 'Next costume block',
        id: 'gui.ir-blocks.looks_nextcostume'
    },
    looks_switchbackdropto: {
        defaultMessage: 'Switch backdrop block',
        id: 'gui.ir-blocks.looks_switchbackdropto'
    },
    looks_nextbackdrop: {
        defaultMessage: 'Next backdrop block',
        id: 'gui.ir-blocks.looks_nextbackdrop'
    },
    looks_changesizeby: {
        defaultMessage: 'Change size block',
        id: 'gui.ir-blocks.looks_changesizeby'
    },
    looks_setsizeto: {
        defaultMessage: 'Set size block',
        id: 'gui.ir-blocks.looks_setsizeto'
    },
    looks_show: {
        defaultMessage: 'Show block',
        id: 'gui.ir-blocks.looks_show'
    },
    looks_hide: {
        defaultMessage: 'Show block',
        id: 'gui.ir-blocks.looks_hide'
    },

    // Sound blocks
    sound_play: {
        defaultMessage: 'Play sound block',
        id: 'gui.ir-blocks.sound_play'
    },
    sound_playuntildone: {
        defaultMessage: 'Play sound block',
        id: 'gui.ir-blocks.sound_playuntildone'
    },
    sound_stopallsounds: {
        defaultMessage: 'Stop sounds block',
        id: 'gui.ir-blocks.sound_stopallsounds'
    },

    // Event blocks
    event_whenflagclicked: {
        defaultMessage: 'When green flag clicked block',
        id: 'gui.ir-blocks.event_whenflagclicked'
    },
    event_whenkeypressed: {
        defaultMessage: 'When key pressed block',
        id: 'gui.ir-blocks.event_whenkeypressed'
    },
    event_whenthisspriteclicked: {
        defaultMessage: 'When this sprite clicked block',
        id: 'gui.ir-blocks.event_whenthisspriteclicked'
    },
    event_whenstageclicked: {
        defaultMessage: 'When stage clicked block',
        id: 'gui.ir-blocks.event_whenstageclicked'
    },
    event_whentouchingobject: {
        defaultMessage: 'When this sprite touches block',
        id: 'gui.ir-blocks.event_whentouchingobject'
    },
    event_whenbroadcastreceived: {
        defaultMessage: 'Receive broadcast block',
        id: 'gui.ir-blocks.event_whenbroadcastreceived'
    },
    event_whenbackdropswitchesto: {
        defaultMessage: 'When backdrop switches block',
        id: 'gui.ir-blocks.event_whenbackdropswitchesto'
    },
    event_whengreaterthan: {
        defaultMessage: 'When greater block',
        id: 'gui.ir-blocks.event_whengreaterthan'
    },
    event_broadcast: {
        defaultMessage: 'Send broadcast block',
        id: 'gui.ir-blocks.event_broadcast'
    },
    event_broadcastandwait: {
        defaultMessage: 'Send broadcast block',
        id: 'gui.ir-blocks.event_broadcastandwait'
    },

    // Control blocks
    control_wait: {
        defaultMessage: `Wait block`,
        id: 'gui.ir-blocks.control_wait'
    },
    control_wait_until: {
        defaultMessage: `Wait until block`,
        id: 'gui.ir-blocks.control_wait_until'
    },
    control_forever: {
        defaultMessage: `Forever loop block`,
        id: 'gui.ir-blocks.control_forever'
    },
    control_repeat: {
        defaultMessage: `Repeat loop block`,
        id: 'gui.ir-blocks.control_repeat'
    },
    control_repeat_until: {
        defaultMessage: `Repeat until loop block`,
        id: 'gui.ir-blocks.control_repeat_until'
    },
    control_if: {
        defaultMessage: `If block`,
        id: 'gui.ir-blocks.control_if'
    },
    control_if_else: {
        defaultMessage: `If-else block`,
        id: 'gui.ir-blocks.control_if_else'
    },
    // TODO Phil 05/05/2020: differentiate between stop types
    control_stop: {
        defaultMessage: `Stop block`,
        id: 'gui.ir-blocks.control_stop'
    },
    control_start_as_clone: {
        defaultMessage: `Start as clone block`,
        id: `gui.ir-blocks.control_start_as_clone`
    },
    control_create_clone_of: {
        defaultMessage: `Clone block`,
        id: `gui.ir-blocks.control_create_clone_of`
    },
    control_delete_this_clone: {
        defaultMessage: `Delete clone block`,
        id: `gui.ir-blocks.control_delete_this_clone`
    },

    // Sensing blocks
    sensing_touchingobject: {
        defaultMessage: 'Touching block',
        id: 'gui.ir-blocks.sensing_touchingobject'
    },
    sensing_touchingcolor: {
        defaultMessage: 'Touching color block',
        id: 'gui.ir-blocks.sensing_touchingcolor'
    },
    sensing_coloristouchingcolor: {
        defaultMessage: 'Two colors touching block',
        id: 'gui.ir-blocks.sensing_coloristouchingcolor'
    },
    sensing_distanceto: {
        defaultMessage: 'Distance block',
        id: 'gui.ir-blocks.sensing_distanceto'
    },
    sensing_askandwait: {
        defaultMessage: 'Ask block',
        id: 'gui.ir-blocks.sensing_askandwait'
    },
    sensing_keypressed: {
        defaultMessage: 'Key pressed block',
        id: 'gui.ir-blocks.sensing_keypressed'
    },
    sensing_mousedown: {
        defaultMessage: 'Mouse down block',
        id: 'gui.ir-blocks.sensing_mousedown'
    },
    sensing_setdragmode: {
        defaultMessage: 'Set drag mode block',
        id: 'gui.ir-blocks.sensing_setdragmode'
    },
    sensing_resettimer: {
        defaultMessage: 'Reset timer block',
        id: 'gui.ir-blocks.sensing_resettimer'
    },
    sensing_of: {
        defaultMessage: 'Attribute block',
        id: 'gui.ir-blocks.sensing_of'
    },

    // Variables blocks
    data_setvariableto: {
        defaultMessage: 'Set variable block',
        id: 'gui.ir-blocks.data_setvariableto'
    },
    data_changevariableby: {
        defaultMessage: 'Change variable block',
        id: 'gui.ir-blocks.data_changevariableby'
    }
});

const eventMessages = defineMessages({
    broadcast: {
        defaultMessage: 'Green Flag event',
        id: 'gui.ir-event.clone'
    },
    clone: {
        id: 'gui.ir-event.clone'
    }
});

const userEventMessages = defineMessages({
    event_whenflagclicked: {
        defaultMessage: 'Green Flag event',
        id: 'gui.ir-user-event.event_whenflagclicked'
    },
    event_whenthisspriteclicked: {
        defaultMessage: '{value} Clicked event',
        id: 'gui.ir-user-event.event_whenthisspriteclicked'
    },
    event_whenstageclicked: {
        defaultMessage: 'Stage Clicked event',
        id: 'gui.ir-user-event.event_whenstageclicked'
    },
    event_whenkeypressed: {
        defaultMessage: `{value, select,
            space {Space Key}
            any {Any Key}
            other {Key {value}}
        } Pressed event`,
        id: 'gui.ir-user-event.event_whenkeypressed'
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

        switch (opcode) {
        case 'test':
            extras.test = 'test';
        }

        return {title, extras};
    }

    formatEvent (event) {
        const title = eventMessages[event.name];
        const titleExtra = {
            value: event.value
        };
        return {title, titleExtra};
    }

    formatUserEvent (userEvent) {
        const title = userEventMessages[userEvent.opcode];
        const titleExtra = {
            value: userEvent.value
        };
        return {title, titleExtra};
    }
}

const statementMessages = defineMessages({
    // No statement
    failed: {
        defaultMessage: `Failed to display`,
        id: 'gui.ir-statement.failed'
    },
    // ChangingStatement
    changingStatement: {
        defaultMessage: `{block} resulted in a change from {startValue} to {endValue}.`,
        id: 'gui.ir-statement.changing-statement'
    },
    // NotChangingStatement
    notChangingStatement: {
        defaultMessage: `{block} was called {timesCalled, plural,
            =1 {once}
            =2 {twice}
            other {# times}
        }, but never resulted in a change from {value}.`,
        id: 'gui.ir-statement.not-changing-statement'
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
        id: 'gui.ir-statement.called-but-wrong-branch-statement'
    },
    // RightBranchButStoppedStatement
    rightBranchButStoppedStatement: {
        defaultMessage: `{block} was called {condition, select,
            true {with the correct condition true}
            false {with the correct condition false}
            other {}
        }, but execution was stopped before reaching the target block.`,
        id: 'gui.ir-statement.right-branch-but-stopped-statement'
    },
    // NotCalledControlStatement: {
    calledControlStatement: {
        defaultMessage: `{block} was called.`,
        id: 'gui.ir-statement.called-control-statement'
    },
    // NotCalledControlStatement: {
    notCalledControlStatement: {
        defaultMessage: `{block} was never called.`,
        id: 'gui.ir-statement.not-called-control-statement'
    },
    // CalledStatement
    calledStatement: {
        defaultMessage: `{block} was called.`,
        id: 'gui.ir-statement.called-statement'
    },
    // NotCalledStatement
    notCalledStatement: {
        defaultMessage: `{block} was never called.`,
        id: 'gui.ir-statement.not-called-statement'
    },
    // OverwrittenStatement
    overwrittenStatement: {
        defaultMessage: `{block} was called {timesCalled, plural,
            =1 {once, but}
            =2 {twice, but the last call}
            other {# times, but the last call}
        } was overwritten.`,
        id: 'gui.ir-statement.overwritten-statement'
    },
    // OverwritingStatement
    overwritingStatement: {
        defaultMessage: `{block} overwrote {startValue} to {endValue}.`,
        id: 'gui.ir-statement.overwriting-statement'
    },
    // EventStatement
    calledBroadcast: {
        defaultMessage: `Broadcast {name} was called.`,
        id: 'gui.ir-statement.called-broadcast'
    },
    notCalledBroadcast: {
        defaultMessage: `Broadcast {name} was never called.`,
        id: 'gui.ir-statement.not-called-broadcast'
    },
    createdClone: {
        defaultMessage: `Sprite {name} was cloned.`,
        id: 'gui.ir-statement.created-clone'
    },
    notCreatedClone: {
        defaultMessage: `Sprite {name} was never cloned.`,
        id: 'gui.ir-statement.not-created-clone'
    },
    // UserEventCalledStatement,
    userEventCalledStatement: {
        defaultMessage: `{userEvent} was triggered.`,
        id: 'gui.ir-statement.user-event-called-statement'
    },
    // UserEventCalledButStoppedStatement,
    userEventCalledButStoppedStatement: {
        defaultMessage: `{userEvent} was triggered, but execution was stopped before reaching the target block.`,
        id: 'gui.ir-statement.user-event-called-but-stopped-statement'
    },
    // UserEventNotCalledStatement
    userEventNotCalledStatement: {
        defaultMessage: `{userEvent} was never triggered.`,
        id: 'gui.ir-statement.user-event-not-called-statement'
    }
});

export {
    questionMessages,
    answerMessages,
    statementMessages,
    StatementFormatter
};
