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
        defaultMessage: `Broadcast {broadcastName} was called, here's why.`,
        id: 'gui.ir-answer.broadcast-called'
    },
    broadcastNoBlock: {
        defaultMessage: `There is no block calling broadcast {broadcastName}`,
        id: 'gui.ir-answer.broadcast-no-block'
    },
    broadcastNeverCalled: {
        defaultMessage: `{broadcastName} send blocks were never called.`,
        id: 'gui.ir-answer.broadcast-never-called'
    }
});

const blockMessages = {
    control_forever: {
        defaultMessage: `Forever loop`,
        id: 'gui.ir-blocks.control_forever'
    },
    control_repeat: {
        defaultMessage: `Repeat loop`,
        id: 'gui.ir-blocks.control_repeat'
    },
    control_repeat_until: {
        defaultMessage: `Repeat until loop`,
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

    /*
    control_stop: 'stop',
    control_stop_all: 'all',
    control_stop_this: 'this script',
    control_stop_other: 'other scripts in sprite',
    control_wait: 'wait %1 seconds',
    control_waituntil: 'wait until %1',
    control_repeatuntil: 'repeat until %1',
    control_while: 'while %1',
    control_startasclone: 'when i start as a clone',
    control_createcloneof: 'create clone of %1',
    control_createcloneof_myself: 'myself',
    control_deletethisclone: 'delete this clone',
    data_setvariableto: 'set %1 to %2',
    data_changevariableby: 'change %1 by %2',
    event_whenflagclicked: 'when %1 clicked',
    event_whenthisspriteclicked: 'when this sprite clicked',
    event_whenstageclicked: 'when stage clicked',
    event_whentouchingobject: 'when this sprite touches %1',
    event_whenbroadcastreceived: 'when i receive %1',
    event_whenbackdropswitchesto: 'when backdrop switches to %1',
    event_whengreaterthan: 'when %1 > %2',
    event_whengreaterthan_timer: 'timer',
    event_whengreaterthan_loudness: 'loudness',
    event_broadcast: 'broadcast %1',
    event_broadcastandwait: 'broadcast %1 and wait',
    event_whenkeypressed: 'when %1 key pressed',
    event_whenkeypressed_space: 'space',
    event_whenkeypressed_left: 'left arrow',
    event_whenkeypressed_right: 'right arrow',
    event_whenkeypressed_down: 'down arrow',
    event_whenkeypressed_up: 'up arrow',
    event_whenkeypressed_any: 'any',
    looks_sayforsecs: 'say %1 for %2 seconds',
    looks_say: 'say %1',
    looks_hello: 'hello!',
    looks_thinkforsecs: 'think %1 for %2 seconds',
    looks_think: 'think %1',
    looks_hmm: 'hmm...',
    looks_show: 'show',
    looks_hide: 'hide',
    looks_changesizeby: 'change size by %1',
    looks_setsizeto: 'set size to %1 %',
    looks_size: 'size',
    looks_changestretchby: 'change stretch by %1',
    looks_setstretchto: 'set stretch to %1 %',
    looks_switchcostumeto: 'switch costume to %1',
    looks_nextcostume: 'next costume',
    looks_switchbackdropto: 'switch backdrop to %1',
    looks_backdropnumbername: 'backdrop %1',
    looks_costumenumbername: 'costume %1',
    looks_numbername_number: 'number',
    looks_numbername_name: 'name',
    looks_switchbackdroptoandwait: 'switch backdrop to %1 and wait',
    looks_nextbackdrop_block: 'next backdrop',
    looks_nextbackdrop: 'next backdrop',
    looks_previousbackdrop: 'previous backdrop',
    looks_randombackdrop: 'random backdrop',
    motion_movesteps: 'move %1 steps',
    motion_turnleft: 'turn %1 %2 degrees',
    motion_turnright: 'turn %1 %2 degrees',
    motion_pointindirection: 'point in direction %1',
    motion_pointtowards: 'point towards %1',
    motion_pointtowards_pointer: 'mouse-pointer',
    motion_pointtowards_random: 'random direction',
    motion_goto: 'go to %1',
    motion_goto_pointer: 'mouse-pointer',
    motion_goto_random: 'random position',
    motion_gotoxy: 'go to x: %1 y: %2',
    motion_glidesecstoxy: 'glide %1 secs to x: %2 y: %3',
    motion_glideto: 'glide %1 secs to %2',
    motion_glideto_pointer: 'mouse-pointer',
    motion_glideto_random: 'random position',
    motion_changexby: 'change x by %1',
    motion_setx: 'set x to %1',
    motion_changeyby: 'change y by %1',
    motion_sety: 'set y to %1',
    motion_ifonedgebounce: 'if on edge, bounce',
    motion_setrotationstyle: 'set rotation style %1',
    motion_setrotationstyle_leftright: 'left-right',
    motion_setrotationstyle_dontrotate: 'don\'t rotate',
    motion_setrotationstyle_allaround: 'all around',
    motion_xposition: 'x position',
    motion_yposition: 'y position',
    motion_direction: 'direction',
    motion_scrollright: 'scroll right %1',
    motion_scrollup: 'scroll up %1',
    motion_alignscene: 'align scene %1',
    motion_alignscene_bottomleft: 'bottom-left',
    motion_alignscene_bottomright: 'bottom-right',
    motion_alignscene_middle: 'middle',
    motion_alignscene_topleft: 'top-left',
    motion_alignscene_topright: 'top-right',
    motion_xscroll: 'x scroll',
    motion_yscroll: 'y scroll',
    motion_stage_selected: 'stage selected: no motion blocks',
    operators_add: '%1 + %2',
    operators_subtract: '%1 - %2',
    operators_multiply: '%1 * %2',
    operators_divide: '%1 / %2',
    operators_random: 'pick random %1 to %2',
    operators_gt: '%1 > %2',
    operators_lt: '%1 < %2',
    operators_equals: '%1 = %2',
    operators_and: '%1 and %2',
    operators_or: '%1 or %2',
    operators_not: 'not %1',
    operators_join: 'join %1 %2',
    operators_join_apple: 'apple',
    operators_join_banana: 'banana',
    operators_letterof: 'letter %1 of %2',
    operators_letterof_apple: 'a',
    operators_length: 'length of %1',
    operators_contains: '%1 contains %2?',
    operators_mod: '%1 mod %2',
    operators_round: 'round %1',
    operators_mathop: '%1 of %2',
    operators_mathop_abs: 'abs',
    operators_mathop_floor: 'floor',
    operators_mathop_ceiling: 'ceiling',
    operators_mathop_sqrt: 'sqrt',
    operators_mathop_sin: 'sin',
    operators_mathop_cos: 'cos',
    operators_mathop_tan: 'tan',
    operators_mathop_asin: 'asin',
    operators_mathop_acos: 'acos',
    operators_mathop_atan: 'atan',
    operators_mathop_ln: 'ln',
    operators_mathop_log: 'log',
    operators_mathop_eexp: 'e ^',
    operators_mathop_10exp: '10 ^',
    procedures_definition: 'define %1',
    sensing_touchingobject: 'touching %1?',
    sensing_touchingobject_pointer: 'mouse-pointer',
    sensing_touchingobject_edge: 'edge',
    sensing_touchingcolor: 'touching color %1?',
    sensing_coloristouchingcolor: 'color %1 is touching %2?',
    sensing_distanceto: 'distance to %1',
    sensing_distanceto_pointer: 'mouse-pointer',
    sensing_askandwait: 'ask %1 and wait',
    sensing_ask_text: 'what\'s your name?',
    sensing_answer: 'answer',
    sensing_keypressed: 'key %1 pressed?',
    sensing_mousedown: 'mouse down?',
    sensing_mousex: 'mouse x',
    sensing_mousey: 'mouse y',
    sensing_setdragmode: 'set drag mode %1',
    sensing_setdragmode_draggable: 'draggable',
    sensing_setdragmode_notdraggable: 'not draggable',
    sensing_loudness: 'loudness',
    sensing_loud: 'loud?',
    sensing_timer: 'timer',
    sensing_resettimer: 'reset timer',
    sensing_of: '%1 of %2',
    sensing_of_xposition: 'x position',
    sensing_of_yposition: 'y position',
    sensing_of_direction: 'direction',
    sensing_of_costumenumber: 'costume #',
    sensing_of_costumename: 'costume name',
    sensing_of_size: 'size',
    sensing_of_volume: 'volume',
    sensing_of_backdropnumber: 'backdrop #',
    sensing_of_backdropname: 'backdrop name',
    sensing_of_stage: 'stage',
    sensing_current: 'current %1',
    sensing_current_year: 'year',
    sensing_current_month: 'month',
    sensing_current_date: 'date',
    sensing_current_dayofweek: 'day of week',
    sensing_current_hour: 'hour',
    sensing_current_minute: 'minute',
    sensing_current_second: 'second',
    sensing_dayssince2000: 'days since 2000',
    sensing_username: 'username',
    sensing_userid: 'user id',
    sound_play: 'start sound %1',
    sound_playuntildone: 'play sound %1 until done'
    */
};

const statementMessages = defineMessages({
    // No statement
    failed: {
        defaultMessage: `Failed to display`,
        id: 'gui.ir-statement.failed'
    },
    // ChangingStatement
    changingStatement: {
        defaultMessage: `{startValue} -> {endValue}`,
        id: 'gui.ir-statement.changing-statement'
    },
    // CalledButWrongBranchStatement
    calledButWrongBranchStatement: {
        defaultMessage: `{block} was called {timesCalled} times, but the condition was always {value}.`,
        id: 'gui.ir-statement.called-but-wrong-branch-statement'
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
        defaultMessage: `{block} was called, but later overwritten.`,
        id: 'gui.ir-statement.overwritten-statement'
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
    // UserEventStatement
    calledUserEvent: {
        defaultMessage: `User Event {name} was called.`,
        id: 'gui.ir-statement.called-user-event'
    },
    notCalledUserEvent: {
        defaultMessage: `User Event {name} was never called.`,
        id: 'gui.ir-statement.not-called-user-event'
    },
});

export {
    questionMessages,
    answerMessages,
    blockMessages,
    statementMessages
};
