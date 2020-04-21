import {defineMessages} from 'react-intl';

const questionMessages = defineMessages({
    animals: {
        defaultMessage: 'Animals',
        description: 'Tag for filtering a library for animals',
        id: 'gui.ir-question.animals'
    }
});

// TODO Phil 21/04/2020: Update descriptions
// eslint-disable max-len
const answerMessages = defineMessages({
    /**
     * General
     */
    manualChange: {
        defaultMessage: 'No changing statements found, must have been changed manually.',
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.no-changing-statement'
    },

    /**
     * Position
     */
    // Why did change
    positionChange: {
        defaultMessage: `These blocks changed {targetName}'s position.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.position-changed'
    },
    // Why didn't change
    positionNoBlock: {
        defaultMessage: `Your code does not contain any position change blocks for {targetName}.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.position-no-block'
    },
    positionNeverCalled: {
        defaultMessage: `{targetName} position change statements were never called, here's why.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.position-never-called'
    },
    positionSame: {
        defaultMessage: `{targetName} did change its position, but its start and finish position are just the same.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.position-same'
    },
    positionNeverChanged: {
        defaultMessage: `{targetName}'s position change statements were called, but never changed its position.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.position-never-changed'
    },
    // Why not specific value?
    positionSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting position to {value} were called, but overwritten. Some were never called.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.position-specific-overwritten-and-not-called'
    },
    positionSpecificOverwritten: {
        defaultMessage: `Setting position to {value} was called, but later overwritten.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.position-specific-overwritten'
    },
    positionSpecificNeverCalled: {
        defaultMessage: `Setting position to {value} was never called.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.position-specific-not-called'
    },

    /**
     * x-Coordinate
     */
    // Why not specific value?
    xCoordinateSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting x coordinate to {value} were called, but overwritten. Some were never called.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.xcoordinate-specific-overwritten-and-not-called'
    },
    xCoordinateSpecificOverwritten: {
        defaultMessage: `Setting x coordinate to {value} was called, but later overwritten.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.xcoordinate-specific-overwritten'
    },
    xCoordinateSpecificNeverCalled: {
        defaultMessage: `Setting x coordinate to {value} was never called.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.xcoordinate-specific-not-called'
    },

    /**
     * y-Coordinate
     */
    // Why not specific value?
    yCoordinateSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting y coordinate to {value} were called, but overwritten. Some were never called.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.ycoordinate-specific-overwritten-and-not-called'
    },
    yCoordinateSpecificOverwritten: {
        defaultMessage: `Setting y coordinate to {value} was called, but later overwritten.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.ycoordinate-specific-overwritten'
    },
    yCoordinateSpecificNeverCalled: {
        defaultMessage: `Setting y coordinate to {value} was never called.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.ycoordinate-specific-not-called'
    },

    /**
     * Direction
     */
    // Why did change
    directionChange: {
        defaultMessage: `These blocks changed {targetName}'s direction.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.direction-changed'
    },
    // Why didn't change
    directionNoBlock: {
        defaultMessage: `Your code does not contain any direction change blocks for {targetName}.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.direction-no-block'
    },
    directionNeverCalled: {
        defaultMessage: `{targetName} direction change statements were never called, here's why.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.direction-never-called'
    },
    directionSame: {
        defaultMessage: `{targetName} did change its direction, but its start and finish direction are just the same.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.direction-same'
    },
    directionNeverChanged: {
        defaultMessage: `{targetName}'s direction change statements were called, but never changed its direction.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.direction-never-changed'
    },
    // Why not specific value?
    directionSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting direction to {value} were called, but overwritten. Some were never called.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.direction-specific-overwritten-and-not-called'
    },
    directionSpecificOverwritten: {
        defaultMessage: `Setting direction to {value} was called, but later overwritten.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.direction-specific-overwritten'
    },
    directionSpecificNeverCalled: {
        defaultMessage: `Setting direction to {value} was never called.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.direction-specific-not-called'
    },

    /**
     * Backdrop
     */
    // Why did change
    backdropChange: {
        defaultMessage: `These statements changed the backdrop.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.backdrop-changed'
    },
    // Why didn't change
    backdropNoBlock: {
        defaultMessage: `Your code does not contain any backdrop change blocks.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.backdrop-no-block'
    },
    backdropNeverCalled: {
        defaultMessage: `Backdrop change statements were never called, here's why.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.backdrop-never-called'
    },
    backdropSame: {
        defaultMessage: `The backdrop was changed, but its start and finish values are just the same.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.backdrop-same'
    },
    backdropNeverChanged: {
        defaultMessage: `Backdrop change statements were called, but never changed the backdrop.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.backdrop-never-changed'
    },
    // Why not specific value?
    backdropSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting the backdrop to {value} were called, but overwritten. Some were never called.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.backdrop-specific-overwritten-and-not-called'
    },
    backdropSpecificOverwritten: {
        defaultMessage: `Setting the backdrop to {value} was called, but later overwritten.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.backdrop-specific-overwritten'
    },
    backdropSpecificNeverCalled: {
        defaultMessage: `Setting the backdrop to {value} was never called.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.backdrop-specific-not-called'
    },

    /**
     * Costume
     */
    // Why did change
    costumeChange: {
        defaultMessage: `These statements changed {targetName}'s costume.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.costume-changed'
    },
    // Why didn't change
    costumeNoBlock: {
        defaultMessage: `Your code does not contain any costume change statements for {targetName}.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.costume-no-block'
    },
    costumeNeverCalled: {
        defaultMessage: `{targetName}'s costume change statements were never called, here's why.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.costume-never-called'
    },
    costumeSame: {
        defaultMessage: `{targetName}'s costume was changed, but its start and finish values are just the same.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.costume-same'
    },
    costumeNeverChanged: {
        defaultMessage: `{targetName}'s costume change statements were called, but never changed its costume.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.costume-never-changed'
    },
    // Why not specific value?
    costumeSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting {targetName}'s costume to {value} were called, but overwritten. Some were never called.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.costume-specific-overwritten-and-not-called'
    },
    costumeSpecificOverwritten: {
        defaultMessage: `Setting {targetName}'s costume to {value} was called, but later overwritten.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.costume-specific-overwritten'
    },
    costumeSpecificNeverCalled: {
        defaultMessage: `Setting {targetName}'s costume to {value} was never called.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.costume-specific-not-called'
    },

    /**
     * Size
     */
    // Why did change
    sizeChange: {
        defaultMessage: `These statements changed {targetName}'s size.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.size-changed'
    },
    // Why didn't change
    sizeNoBlock: {
        defaultMessage: `Your code does not contain any size change statements for {targetName}.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.size-no-block'
    },
    sizeNeverCalled: {
        defaultMessage: `{targetName}'s size change statements were never called, here's why.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.size-never-called'
    },
    sizeSame: {
        defaultMessage: `{targetName}'s size was changed, but its start and finish values are just the same.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.size-same'
    },
    sizeNeverChanged: {
        defaultMessage: `{targetName}'s size change statements were called, but never changed its size.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.size-never-changed'
    },
    // Why not specific value?
    sizeSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting size to {value} were called, but overwritten. Some were never called.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.size-specific-overwritten-and-not-called'
    },
    sizeSpecificOverwritten: {
        defaultMessage: `Setting size to {value} was called, but later overwritten.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.size-specific-overwritten'
    },
    sizeSpecificNeverCalled: {
        defaultMessage: `Setting size to {value} was never called.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.size-specific-not-called'
    },

    /**
     * Visibility
     */
    // Why did change
    visibilityChange: {
        defaultMessage: `These statements changed {targetName}'s visibility.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.visibility-changed'
    },
    // Why didn't change
    visibilityNoBlock: {
        defaultMessage: `Your code does not contain any visibility change statements for {targetName}.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.visibility-no-block'
    },
    visibilityNeverCalled: {
        defaultMessage: `{targetName}'s visibility change statements were never called, here's why.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.visibility-never-called'
    },
    visibilitySame: {
        defaultMessage: `{targetName}'s visibility was changed, but its start and finish values are just the same.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.visibility-same'
    },
    visibilityNeverChanged: {
        defaultMessage: `{targetName}'s visibility change statements were called, but never changed its visibility.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.visibility-never-changed'
    },
    // Why not specific value?
    visibilitySpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for setting visibility to {value} were called, but overwritten. Some were never called.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.visibility-specific-overwritten-and-not-called'
    },
    visibilitySpecificOverwritten: {
        defaultMessage: `Setting visibility to {value} was called, but later overwritten.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.visibility-specific-overwritten'
    },
    visibilitySpecificNeverCalled: {
        defaultMessage: `Setting visibility to {value} was never called.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.visibility-specific-not-called'
    },

    /**
     * Variable
     */
    // Why did change
    variableChange: {
        defaultMessage: `These statements changed {variableName}'s value.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.variable-changed'
    },
    // Why didn't change
    variableNoBlock: {
        defaultMessage: `Your code does not contain any variable change statements for {targetName}.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.variable-no-block'
    },
    variableNeverCalled: {
        defaultMessage: `{variableName}'s change statements were never called, here's why.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.variable-never-called'
    },
    variableSame: {
        defaultMessage: `{variableName} was changed, but its start and finish values are just the same.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.variable-same'
    },
    variableNeverChanged: {
        defaultMessage: `{variableName}'s change statements were called, but never changed its value.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.variable-never-changed'
    },
    // Why not specific value?
    variableSpecificOverwrittenAndNotCalled: {
        defaultMessage: `Some statements for {variableName}'s value to {value} were called, but overwritten. Some were never called.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.variable-specific-overwritten-and-not-called'
    },
    variableSpecificOverwritten: {
        defaultMessage: `Setting {variableName}'s value to {value} was called, but later overwritten.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.variable-specific-overwritten'
    },
    variableSpecificNeverCalled: {
        defaultMessage: `Setting {variableName}'s value to {value} was never called.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.variable-specific-not-called'
    },

    /**
     * Sound
     */
    soundPlayed: {
        defaultMessage: `Sound {soundName} was played by {targetName}, here's why.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.sound-played'
    },
    soundNotPlayed: {
        defaultMessage: `{soundName} never played by {targetName}, here's why.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.sound-not-played'
    },

    /**
     * Broadcasts
     */
    broadcastCalled: {
        defaultMessage: `Broadcast {broadcastName} was called, here's why.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.broadcast-called'
    },
    broadcastNoBlock: {
        defaultMessage: `There is no block calling broadcast {broadcastName}`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.broadcast-no-block'
    },
    broadcastNeverCalled: {
        defaultMessage: `{broadcastName} was called, here's why.`,
        description: 'Tag for filtering a library for everything',
        id: 'gui.ir-answer.broadcast-never-called'
    }
});

export {
    questionMessages,
    answerMessages
};
