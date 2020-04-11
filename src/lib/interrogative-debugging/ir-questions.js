import {
    costumeIndexForTargetAndName,
    Extract,
    ExtractTrace,
    forQuestionType,
    generateId,
    getAllBlocks
} from './ir-questions-util';
import {
    EventFilter,
    LooksFilter,
    MotionFilter,
    SoundFilter,
    VariableFilter
} from 'scratch-analysis';

const QuestionTypes = Object.freeze({
    // Movement Questions
    DID_MOVE: 0,
    DID_NOT_MOVE: 1,
    DID_CHANGE_DIRECTION: 10,
    DID_NOT_CHANGE_DIRECTION: 11,
    DID_NOT_SPECIFIC_POSITION: 20,
    DID_NOT_SPECIFIC_X: 21,
    DID_NOT_SPECIFIC_Y: 22,
    DID_NOT_SPECIFIC_DIRECTION: 23,

    // Appearance
    DID_CHANGE_COSTUME: 50,
    DID_NOT_CHANGE_COSTUME: 51,
    DID_NOT_SPECIFIC_COSTUME: 52,
    DID_CHANGE_SIZE: 60,
    DID_NOT_CHANGE_SIZE: 61,
    DID_NOT_SPECIFIC_SIZE: 62,
    DID_CHANGE_VISIBILITY: 70,
    DID_NOT_CHANGE_VISIBILITY: 71,
    DID_NOT_SPECIFIC_VISIBILITY: 72,

    // Variable specific
    DID_VARIABLE_CHANGE: 100,
    DID_NOT_VARIABLE_CHANGE: 101,
    DID_NOT_VARIABLE_SPECIFIC_VALUE: 102,
    DID_VARIABLE_SHOW: 104,
    DID_NOT_VARIABLE_SHOW: 105,

    // Sound specific
    DID_NOT_PLAY_ANY_SOUND: 150,
    DID_PLAY_SOUND: 151,
    DID_NOT_PLAY_SOUND: 152,

    // Event specific
    DID_CALL_EVENT: 200,
    DID_NOT_CALL_EVENT: 201,

    // General stuff
    DID_NOTHING_MOVE: 400,
    DID_NOTHING_SOUND: 401,

    // Block specific
    DID_EXECUTE: 900,
    DID_NOT_EXECUTE: 901,

    DID_LAST_QUESTION: 9999
});

class Question {
    constructor (props) {
        this.id = generateId();

        this.type = props.type;
        this.text = props.text;

        this.blockId = props.blockId;
        this.target = props.target;

        this.variable = props.variable;

        this.broadcastVariable = props.broadcastVariable;
        this.broadcastBlocks = props.broadcastBlocks;

        this.sound = props.sound;
        this.soundBlocks = props.soundBlocks;

        this.value = props.value;
        this.setBlocks = props.setBlocks;
    }
}

class Statement {
    constructor (statement) {
        this.statement = statement;
    }
}

class ChangingStatement extends Statement {
    constructor (statement, startValue, endValue) {
        super(statement);
        this.startValue = startValue;
        this.endValue = endValue;
    }
}

class CalledStatement extends Statement {
    constructor (statement, controlStatements) {
        super(statement);
        this.controlStatements = controlStatements;
    }
}

class NotCalledStatement extends Statement {
    constructor (statement, controlStatements) {
        super(statement);
        this.controlStatements = controlStatements;
    }
}

class OverwrittenStatement extends Statement {
}

class ControlStatement extends Statement {
}

class CalledControlStatement extends ControlStatement {
    constructor (statement, values) {
        super(statement);
        this.values = values;
    }
}
class UserEventStatement extends ControlStatement {
    constructor (event) {
        super();
        this.event = event;
    }
}

class EventStatement extends ControlStatement {
    constructor (event) {
        super();
        this.event = event;
    }
}

class CalledButWrongBranchStatement extends ControlStatement {
    constructor (statement, values) {
        super(statement);
        this.values = values;
    }
}

class NotCalledControlStatement extends ControlStatement {
}


class Answer {
    constructor (props) {
        this.id = generateId();

        // Mandatory properties
        this.type = props.type;
        this.text = props.text;

        // Optional properties
        this.statements = props.statements;

        this.blocks = props.blocks;

        this.variable = props.variable;
        this.startValue = props.startValue;
        this.endValue = props.endValue;
    }
}

class QuestionProvider {
    constructor (vm, trace, traceMap) {
        this.vm = vm;
        this.trace = trace;
        this.traceMap = traceMap;

        this.questions = {
            generalQuestions: [],
            overallQuestions: [],
            targets: {}
        };

        this.generateQuestions();
    }

    generateQuestions () {
        const trace = this.trace;
        const traceMap = this.traceMap;
        const anything = {
            move: false,
            sound: false
        };

        const targets = this.vm.runtime.targets;
        const allBlocks = getAllBlocks(targets);
        for (const target of targets) {
            const targetQuestions = [];

            const initialTargetState = trace[0].ti(target.id);
            const blocks = target.blocks._blocks;
            const targetTrace = trace.filter(s => blocks.hasOwnProperty(s.blockId));

            // // Checks whether a block was executed or not
            // for (const blockId in blocks) {
            //     let text;
            //     let type;
            //     if (trace.some(t => t.blockId === blockId)) {
            //         type = QuestionTypes.DID_EXECUTE;
            //         text = `Why did ${blocks[blockId].opcode} execute?`;
            //     } else {
            //         type = QuestionTypes.DID_NOT_EXECUTE;
            //         text = `Why didn't ${blocks[blockId].opcode} execute?`;
            //     }
            //
            //     targetQuestions.push(new Question({
            //         type: type,
            //         blockId: blockId,
            //         text: text
            //     }));
            // }

            // Checks whether the target did move or not?
            if (!target.isStage) {
                {
                    // Why did sprite move?
                    // Why didn't sprite move?
                    const containedMoveStmts = Object.values(blocks).some(MotionFilter.positionChange);
                    if (containedMoveStmts) {
                        if (initialTargetState.x === target.x && initialTargetState.y === target.y) {
                            targetQuestions.push(new Question({
                                type: QuestionTypes.DID_NOT_MOVE,
                                target: target,
                                text: `Why didn't ${target.sprite.name} move?`
                            }));
                        } else {
                            anything.move = true;
                            targetQuestions.push(new Question({
                                type: QuestionTypes.DID_MOVE,
                                target: target,
                                text: `Why did ${target.sprite.name} move?`
                            }));
                        }
                    }
                }

                {
                    // Why didn't have sprite position (<x>,<y>)?
                    const covered = {};
                    const positionSetStmts = Object.values(blocks).filter(MotionFilter.positionSet);
                    for (const setStmt of positionSetStmts) {
                        const xPos = Extract.xPosition(blocks, setStmt);
                        const yPos = Extract.yPosition(blocks, setStmt);
                        if (xPos !== target.x || yPos !== target.y) {
                            const coordinate = `(${xPos},${yPos})`;
                            if (covered.hasOwnProperty(coordinate)) {
                                covered[coordinate].push(setStmt);
                            } else {
                                covered[coordinate] = [setStmt];
                            }
                        }
                    }
                    for (const [coordinate, setBlocks] of Object.entries(covered)) {
                        targetQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_SPECIFIC_POSITION,
                            target: target,
                            setBlocks: setBlocks,
                            value: coordinate,
                            text: `Why didn't ${target.sprite.name}'s have position ${coordinate}?`
                        }));
                    }
                }

                {
                    // Why didn't sprite’s x coordinate have value <x> ?
                    const covered = {};
                    const xSetStmts = Object.values(blocks).filter(MotionFilter.xSet);
                    for (const setStmt of xSetStmts) {
                        const xPos = Extract.xPosition(blocks, setStmt);
                        if (xPos !== target.x) {
                            if (covered.hasOwnProperty(xPos)) {
                                covered[xPos].push(setStmt);
                            } else {
                                covered[xPos] = [setStmt];
                            }
                        }
                    }
                    for (const [xPos, setBlocks] of Object.entries(covered)) {
                        targetQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_SPECIFIC_X,
                            target: target,
                            setBlocks: setBlocks,
                            value: xPos,
                            text: `Why didn't ${target.sprite.name}'s x coordinate have value ${xPos}?`
                        }));
                    }
                }

                {
                    // Why didn't sprite’s y coordinate have value <y> ?
                    const covered = {};
                    const ySetStmts = Object.values(blocks).filter(MotionFilter.ySet);
                    for (const setStmt of ySetStmts) {
                        const yPos = Extract.yPosition(blocks, setStmt);
                        if (yPos !== target.y) {
                            if (covered.hasOwnProperty(yPos)) {
                                covered[yPos].push(setStmt);
                            } else {
                                covered[yPos] = [setStmt];
                            }
                        }
                    }
                    for (const [yPos, setBlocks] of Object.entries(covered)) {
                        targetQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_SPECIFIC_X,
                            target: target,
                            setBlocks: setBlocks,
                            value: yPos,
                            text: `Why didn't ${target.sprite.name}'s y coordinate have value ${yPos}?`
                        }));
                    }
                }
            }

            // Check whether the sprite direction did change or not?
            if (!target.isStage) {
                // Why did sprite’s direction change?
                // Why didn't sprite’s direction change?
                const containedDirectionStmt = Object.values(blocks).some(MotionFilter.directionChange);
                if (containedDirectionStmt) {
                    if (initialTargetState.direction === target.direction) {
                        targetQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_CHANGE_DIRECTION,
                            target: target,
                            text: `Why didn't ${target.sprite.name}'s direction change?`
                        }));
                    } else {
                        targetQuestions.push(new Question({
                            type: QuestionTypes.DID_CHANGE_DIRECTION,
                            target: target,
                            text: `Why did ${target.sprite.name}'s direction change?`
                        }));
                    }
                }

                // Why didn't sprite’s direction have value <direction> ?
                const covered = {};
                const directionSetStmts = Object.values(blocks).filter(MotionFilter.directionSet);
                for (const setStmt of directionSetStmts) {
                    const directionValue = Extract.direction(blocks, setStmt);
                    if (directionValue !== target.direction) {
                        if (covered.hasOwnProperty(directionValue)) {
                            covered[directionValue].push(setStmt);
                        } else {
                            covered[directionValue] = [setStmt];
                        }
                    }
                }
                for (const [direction, setBlocks] of Object.entries(covered)) {
                    targetQuestions.push(new Question({
                        type: QuestionTypes.DID_NOT_SPECIFIC_DIRECTION,
                        target: target,
                        setBlocks: setBlocks,
                        text: `Why didn't ${target.sprite.name}'s direction have value ${direction}?`
                    }));
                }
            }

            // Check whether the stage backdrop or target costume did change or not?
            if (target.isStage) {
                const containedBackdropChange = Object.values(allBlocks).some(LooksFilter.backdropChange);
                if (containedBackdropChange) {
                    const firstBackdrop = initialTargetState.currentCostume;
                    const finalBackDrop = target.currentCostume;
                    if (firstBackdrop === finalBackDrop) {
                        targetQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_CHANGE_COSTUME,
                            target: target,
                            text: `Why didn't stage's backdrop change?`
                        }));
                    } else {
                        targetQuestions.push(new Question({
                            type: QuestionTypes.DID_CHANGE_COSTUME,
                            target: target,
                            text: `Why did stage's backdrop change?`
                        }));
                    }
                }
                {
                    // Why didn't stage's backdrop have value <costume> ?
                    const covered = {};
                    const backdropSetStmts = Object.values(allBlocks).filter(LooksFilter.backdropSet);
                    for (const setStmt of backdropSetStmts) {
                        // Only the name, but we need the index
                        const backdrop = Extract.backdrop(allBlocks, setStmt);
                        const costumeIndex = costumeIndexForTargetAndName(target, backdrop);
                        if (costumeIndex && parseInt(costumeIndex, 10) !== target.currentCostume) {
                            if (covered.hasOwnProperty(backdrop)) {
                                covered[backdrop].push(setStmt);
                            } else {
                                covered[backdrop] = [setStmt];
                            }
                        }
                    }
                    for (const [backdrop, setBlocks] of Object.entries(covered)) {
                        targetQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_SPECIFIC_COSTUME,
                            target: target,
                            setBlocks: setBlocks,
                            value: backdrop,
                            text: `Why didn't stage's backdrop have value ${backdrop}?`
                        }));
                    }
                }
            } else {
                const containedCostumeStmt = Object.values(blocks).some(LooksFilter.costumeChange);
                if (containedCostumeStmt) {
                    const firstCostume = initialTargetState.currentCostume;
                    const finalCostume = target.currentCostume;
                    if (firstCostume === finalCostume) {
                        targetQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_CHANGE_COSTUME,
                            target: target,
                            text: `Why didn't ${target.sprite.name}'s costume change?`
                        }));
                    } else {
                        targetQuestions.push(new Question({
                            type: QuestionTypes.DID_CHANGE_COSTUME,
                            target: target,
                            text: `Why did ${target.sprite.name}'s costume change?`
                        }));
                    }
                }
                {
                    // Why didn't sprite’s costume have value <costume> ?
                    const covered = {};
                    const costumeSetStmts = Object.values(blocks).filter(LooksFilter.costumeSet);
                    for (const setStmt of costumeSetStmts) {
                        // Only the name, but we need the index
                        const costume = Extract.costume(blocks, setStmt);
                        const costumeIndex = costumeIndexForTargetAndName(target, costume);
                        if (costumeIndex && parseInt(costumeIndex, 10) !== target.currentCostume) {
                            if (covered.hasOwnProperty(costume)) {
                                covered[costume].push(setStmt);
                            } else {
                                covered[costume] = [setStmt];
                            }
                        }
                    }
                    for (const [costume, setBlocks] of Object.entries(covered)) {
                        targetQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_SPECIFIC_COSTUME,
                            target: target,
                            setBlocks: setBlocks,
                            value: costume,
                            text: `Why didn't ${target.sprite.name}'s wear costume ${costume}?`
                        }));
                    }
                }
            }

            // Check whether the sprite size change
            if (!target.isStage) {
                // Why did sprite’s size change?
                // Why didn't sprite’s size change?
                const containedSizeStmt = Object.values(blocks).some(LooksFilter.sizeChange);
                if (containedSizeStmt) {
                    if (initialTargetState.size === target.size) {
                        targetQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_CHANGE_SIZE,
                            target: target,
                            text: `Why didn't ${target.sprite.name}'s size change?`
                        }));
                    } else {
                        targetQuestions.push(new Question({
                            type: QuestionTypes.DID_CHANGE_SIZE,
                            target: target,
                            text: `Why did ${target.sprite.name}'s size change?`
                        }));
                    }
                }
                {
                    // Why didn't sprite’s size have value <size> ?
                    const covered = {};
                    const sizeSetStmts = Object.values(blocks).filter(LooksFilter.sizeSet);
                    for (const setStmt of sizeSetStmts) {
                        const size = Extract.sizeValue(blocks, setStmt);
                        if (size !== target.size) {
                            if (covered.hasOwnProperty(size)) {
                                covered[size].push(setStmt);
                            } else {
                                covered[size] = [setStmt];
                            }
                        }
                    }
                    for (const [size, setBlocks] of Object.entries(covered)) {
                        targetQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_SPECIFIC_SIZE,
                            target: target,
                            setBlocks: setBlocks,
                            value: size,
                            text: `Why didn't ${target.sprite.name}'s size have value ${size}?`
                        }));
                    }
                }
            }

            // Check whether the sprite visibility change
            if (!target.isStage) {
                const containedVisibilityStmt = Object.values(blocks).some(LooksFilter.visibilitySet);
                if (containedVisibilityStmt) {
                    if (initialTargetState.visible === target.visible) {
                        targetQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_CHANGE_VISIBILITY,
                            target: target,
                            text: `Why didn't ${target.sprite.name}'s visibility change?`
                        }));
                    } else {
                        targetQuestions.push(new Question({
                            type: QuestionTypes.DID_CHANGE_VISIBILITY,
                            target: target,
                            text: `Why did ${target.sprite.name}'s visibility change?`
                        }));
                    }
                }
                {
                    // Why didn't sprite’s visibility have value <visibility> ?
                    const covered = {};
                    const visibilitySetStmts = Object.values(blocks).filter(LooksFilter.visibilitySet);
                    for (const setStmt of visibilitySetStmts) {
                        // target.visible is a boolean value
                        const visibility = setStmt.opcode === 'looks_show'; // && !=== 'looks_hide'
                        if (visibility !== target.visible) {
                            if (covered.hasOwnProperty(visibility)) {
                                covered[visibility].push(setStmt);
                            } else {
                                covered[visibility] = [setStmt];
                            }
                        }
                    }
                    for (const [visibility, setBlocks] of Object.entries(covered)) {
                        const visibleString = visibility ? 'shown' : 'hidden';
                        targetQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_SPECIFIC_VISIBILITY,
                            target: target,
                            setBlocks: setBlocks,
                            value: visibleString,
                            text: `Why didn't ${target.sprite.name}'s visibility have value ${visibleString}?`
                        }));
                    }
                }
            }

            // Checks target variable values
            for (const [variableId, variable] of Object.entries(target.variables)) {
                if (variable.type === 'broadcast_msg') {
                    // Broadcast messages shouldn't be counted as target variables
                    const broadcastStmts = Object.values(allBlocks)
                        .filter(s => EventFilter.broadcastSend(s) &&
                            Extract.broadcastForStatement(allBlocks, s) === variable.name);
                    const calledBroadcastStmts = [];
                    for (const broadcastStmt of broadcastStmts) {
                        if (traceMap.get(broadcastStmt.id).length) {
                            calledBroadcastStmts.push(broadcastStmt);
                        }
                    }
                    if (calledBroadcastStmts.length) {
                        this.questions.overallQuestions.push(new Question({
                            type: QuestionTypes.DID_CALL_EVENT,
                            target: target,
                            broadcastVariable: variable,
                            broadcastBlocks: calledBroadcastStmts,
                            text: `Why did event ${variable.name} get called?`
                        }));
                    } else {
                        this.questions.overallQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_CALL_EVENT,
                            target: target,
                            broadcastVariable: variable,
                            broadcastBlocks: broadcastStmts,
                            text: `Why didn't event ${variable.name} get called?`
                        }));
                    }

                } else {
                    // Why did sprite’s variable <name> change from <start> to <end>?
                    // Why didn't sprite’s variable <name> change?
                    {
                        let startValue = initialTargetState.variables[variableId].value;
                        let endValue = variable.value;
                        if (!isNaN(startValue)) {
                            startValue = parseInt(startValue, 10);
                        }
                        if (!isNaN(endValue)) {
                            endValue = parseInt(endValue, 10);
                        }

                        if (target.isStage) {
                            if (startValue === endValue) {
                                this.questions.overallQuestions.push(new Question({
                                    type: QuestionTypes.DID_NOT_VARIABLE_CHANGE,
                                    target: target,
                                    variable: variable,
                                    /* eslint-disable-next-line max-len */
                                    text: `Why didn't global variable ${variable.name} change from ${startValue}?`
                                }));
                            } else {
                                this.questions.overallQuestions.push(new Question({
                                    type: QuestionTypes.DID_VARIABLE_CHANGE,
                                    target: target,
                                    variable: variable,
                                    /* eslint-disable-next-line max-len */
                                    text: `Why did global variable ${variable.name} change from ${startValue} to ${endValue}?`
                                }));
                            }
                        } else {
                            /* eslint-disable-next-line no-lonely-if */
                            if (startValue === endValue) {
                                targetQuestions.push(new Question({
                                    type: QuestionTypes.DID_NOT_VARIABLE_CHANGE,
                                    target: target,
                                    variable: variable,
                                    /* eslint-disable-next-line max-len */
                                    text: `Why didn't ${target.sprite.name}'s variable ${variable.name} change from ${startValue}?`
                                }));
                            } else {
                                targetQuestions.push(new Question({
                                    type: QuestionTypes.DID_VARIABLE_CHANGE,
                                    target: target,
                                    variable: variable,
                                    /* eslint-disable-next-line max-len */
                                    text: `Why did ${target.sprite.name}'s variable ${variable.name} change from ${startValue} to ${endValue}?`
                                }));
                            }
                        }
                    }

                    {
                        // Why didn't sprite's variable <name> have value <value> ?
                        const covered = {};
                        const variableSetStmts = Object.values(blocks)
                            .filter(b => VariableFilter.set(b) && b.fields.VARIABLE.id === variableId);
                        for (const setStmt of variableSetStmts) {
                            // Can either be text or a text containing a valid integer
                            let expectedValue = Extract.variableValue(allBlocks, setStmt);
                            let actualValue = variable.value;
                            if (!isNaN(expectedValue)) {
                                expectedValue = parseInt(expectedValue, 10);
                            }
                            if (!isNaN(actualValue)) {
                                actualValue = parseInt(actualValue, 10);
                            }
                            if (expectedValue !== actualValue) {
                                if (covered.hasOwnProperty(expectedValue)) {
                                    covered[expectedValue].push(setStmt);
                                } else {
                                    covered[expectedValue] = [setStmt];
                                }
                            }
                        }
                        for (const [expectedValue, setBlocks] of Object.entries(covered)) {
                            if (target.isStage) {
                                this.questions.overallQuestions.push(new Question({
                                    type: QuestionTypes.DID_NOT_VARIABLE_SPECIFIC_VALUE,
                                    target: target,
                                    variable: variable,
                                    setBlocks: setBlocks,
                                    value: expectedValue,
                                    text: `Why didn't global variable ${variable.name} have value ${expectedValue}?`
                                }));
                            } else {
                                targetQuestions.push(new Question({
                                    type: QuestionTypes.DID_NOT_VARIABLE_SPECIFIC_VALUE,
                                    target: target,
                                    variable: variable,
                                    setBlocks: setBlocks,
                                    value: expectedValue,
                                    /* eslint-disable-next-line max-len */
                                    text: `Why didn't ${target.sprite.name}'s variable ${variable.name} have value ${expectedValue}?`
                                }));
                            }
                        }
                    }
                }
            }

            // Check whether this target played a sound or not
            {
                const targetSounds = target.sprite.sounds;
                if (targetSounds.length) {
                    const soundPlayStmts = Object.values(blocks).filter(SoundFilter.play);
                    if (soundPlayStmts.length) {
                        const soundMap = {};
                        for (const soundStmt of soundPlayStmts) {
                            const soundName = Extract.sound(blocks, soundStmt);
                            if (soundMap.hasOwnProperty(soundName)) {
                                soundMap[soundName].push(soundStmt);
                            } else {
                                soundMap[soundName] = [soundStmt];
                            }
                        }
                        for (const [name, playableBlocks] of Object.entries(soundMap)) {
                            const sound = targetSounds.find(s => s.name === name);
                            const playedBlocks = [];
                            for (const block of playableBlocks) {
                                if (traceMap.get(block.id).length) {
                                    playedBlocks.push(block);
                                }
                            }
                            if (playedBlocks.length) {
                                targetQuestions.push(new Question({
                                    type: QuestionTypes.DID_PLAY_SOUND,
                                    target: target,
                                    sound: sound,
                                    soundBlocks: playedBlocks,
                                    text: `Why did ${target.sprite.name} play sound ${name}?`
                                }));
                            } else {
                                targetQuestions.push(new Question({
                                    type: QuestionTypes.DID_NOT_PLAY_SOUND,
                                    target: target,
                                    sound: sound,
                                    soundBlocks: playableBlocks,
                                    text: `Why didn't ${target.sprite.name} play sound ${name}?`
                                }));
                            }
                        }

                        // TODO Phil 03/04/2020: maybe add QuestionTypes.DID_NOT_PLAY_ANY_SOUND

                        // // Old
                        // const soundStmts = targetTrace.filter(SoundFilter.play);
                        // if (soundStmts.length) {
                        //     anything.sound = true;
                        //     for (const sound of targetSounds) {
                        //         const soundPlayed = soundStmts.some(s => ExtractTrace.sound(s) === sound.name);
                        //         if (soundPlayed) {
                        //             targetQuestions.push(new Question({
                        //                 type: QuestionTypes.DID_PLAY_SOUND,
                        //                 target: target,
                        //                 sound: sound,
                        //                 text: `Why did ${target.sprite.name} play sound ${sound.name}?`
                        //             }));
                        //         } else {
                        //             targetQuestions.push(new Question({
                        //                 type: QuestionTypes.DID_NOT_PLAY_SOUND,
                        //                 target: target,
                        //                 sound: sound,
                        //                 text: `Why didn't ${target.sprite.name} play sound ${sound.name}?`
                        //             }));
                        //         }
                        //     }
                        // } else {
                        //     targetQuestions.push(new Question({
                        //         type: QuestionTypes.DID_NOT_PLAY_ANY_SOUND,
                        //         target: target,
                        //         text: `Why didn't ${target.sprite.name} play any sound?`,
                        //         soundBlocks: soundPlayStmts
                        //     }));
                        // }
                    }
                }
            }

            this.questions.targets[target.id] = targetQuestions;
        }

        // Check anything object for general questions
        if (!anything.move) {
            const containsAnyMoveStmt = Object.values(allBlocks).some(MotionFilter.motionBlock);
            if (containsAnyMoveStmt) {
                this.questions.generalQuestions.push(new Question({
                    type: QuestionTypes.DID_NOTHING_MOVE,
                    text: `Why didn't anything move?`
                }));
            }

        }
        if (!anything.sound) {
            const containsAnySoundStmt = Object.values(allBlocks).some(SoundFilter.play);
            if (containsAnySoundStmt) {
                this.questions.generalQuestions.push(new Question({
                    type: QuestionTypes.DID_NOTHING_SOUND,
                    text: `Why didn't the program play any sound?`
                }));
            }
        }
    }

    generalQuestions () {
        return this.questions.generalQuestions;
    }

    overallQuestions () {
        return this.questions.overallQuestions;
    }

    forTarget (target) {
        if (!this.questions.targets.hasOwnProperty(target.id)) {
            return [];
        }

        return this.questions.targets[target.id];
    }
}

const createTraceMap = vm => {
    const traceMap = new Map();

    const recordedTrace = vm.runtime.traceInfo.tracer.traces;
    const allBlocks = getAllBlocks(vm.runtime.targets);
    for (const block of Object.values(allBlocks)) {
        traceMap.set(block.id, []);
    }
    for (const record of recordedTrace) {
        traceMap.get(record.blockId).push(record);
    }
    return traceMap;
};

const computeQuestions = (vm, traceMap) => {
    const results = {
        empty: false,
        targets: [],
        misc: []
    };
    const recordedTrace = vm.runtime.traceInfo.tracer.traces;
    if (!recordedTrace.length) {
        results.empty = true;
        return results;
    }

    const questionProvider = new QuestionProvider(vm, recordedTrace, traceMap);

    for (const target of vm.runtime.targets) {
        const targetInfo = {
            id: target.id,
            currentCostume: target.currentCostume,
            direction: target.direction,
            isStage: target.isStage,
            isOriginal: target.isOriginal,
            name: target.sprite.name,
            visible: target.visible,
            xPosition: target.x,
            yPosition: target.y
        };
        results.targets.push({
            info: targetInfo,
            questions: questionProvider.forTarget(target)
        });
    }

    results.misc.push({
        info: {name: 'General'},
        questions: questionProvider.generalQuestions()
    });

    results.misc.push({
        info: {name: 'Overall'},
        questions: questionProvider.overallQuestions()
    });

    return results;
};

const whyDidAttributeChangeQuestion = (question, traces, target, blocks,
    filterStatements, extractAttr, textFunction, valMapper, variable) => {
    const changingStatements = [];

    const stmts = traces.filter(t => blocks.hasOwnProperty(t.blockId) && filterStatements(t));
    // If empty, the value was changed manually
    if (!stmts.length) {
        return new Answer({
            type: question.type,
            text: 'No changing statements found, must have been changed manually.',
            startValue: valMapper(extractAttr(traces[0].ti(target.id))),
            endValue: valMapper(extractAttr(target))
        });
    }

    const firstValue = extractAttr(stmts[0].ti(target.id));
    const finalValue = extractAttr(target);

    // Changes between two statements
    let index = 0;
    for (; stmts.length > 1 && index < stmts.length - 1; index++) {
        const ti1 = stmts[index].ti(target.id);
        const ti2 = stmts[index + 1].ti(target.id);
        const startValue = extractAttr(ti1);
        const endValue = extractAttr(ti2);
        if (ti1 && ti2 && startValue !== endValue) {
            changingStatements.push(new ChangingStatement(stmts[index], valMapper(startValue), valMapper(endValue)));
        }
    }
    // Change between second to last and last statement
    const sndLastValue = extractAttr(stmts[index].ti(target.id));
    if (sndLastValue !== finalValue) {
        changingStatements.push(new ChangingStatement(stmts[index], valMapper(sndLastValue), valMapper(finalValue)));
    }

    return new Answer({
        type: question.type,
        text: textFunction(firstValue, finalValue, changingStatements),
        statements: changingStatements,
        startValue: valMapper(firstValue),
        endValue: valMapper(finalValue),
        variable: variable
    });
};

const whyWasntStatementCalled = (statement, traceMap, cdg) => {
    const controlStatements = [];

    let current = statement;
    let controlNode;

    while (current) {
        const preds = cdg.predecessors(current.id);
        const iter = preds.values();
        const directPred = iter.next();
        if (directPred.done) {
            // TODO Phil 03/04/2020: handle finding entry node
            // Probably found the entry node
            break;
        }
        // A node could be control dependency on itself. Time to filter them out to avoid an endless loop.
        if (preds.size > 1) {
            let node = directPred.value;
            while (current === node.block) {
                node = iter.next().value;
            }
            controlNode = node;
        } else {
            controlNode = directPred.value;
        }
        const controlNodeExecutions = traceMap.get(controlNode.id);
        if (controlNodeExecutions.length) {
            // Was executed, but required condition never seemed to be hit
            const values = controlNodeExecutions.map(ExtractTrace.condition);

            controlStatements.push(new CalledButWrongBranchStatement(controlNode.block, values));
            current = null;
        } else {
            // Was never executed, add to list and go one control dependency up
            controlStatements.push(new NotCalledControlStatement(controlNode.block));
            current = controlNode.block;
        }
    }

    return new NotCalledStatement(statement, controlStatements);
};

const whyWerentStatementsCalled = (specificStatements, traceMap, cdg) => {
    const statements = [];
    for (const stmt of specificStatements) {
        const statement = whyWasntStatementCalled(stmt, traceMap, cdg);
        statements.push(statement);
    }
    return statements;
};

const whyWasStatementCalled = (statement, traceMap, cdg) => {
    const controlStatements = [];

    let current = statement;
    let controlNode;

    while (current) {
        const preds = cdg.predecessors(current.id);
        const iter = preds.values();
        const directPred = iter.next();
        if (directPred.done) {
            // Probably found the entry node, abort.
            break;
        }
        // A node could be control dependency on itself. Time to filter them out to avoid an endless loop.
        if (preds.size > 1) {
            let node = directPred.value;
            while (current === node.block) {
                node = iter.next().value;
            }
            controlNode = node;
        } else {
            controlNode = directPred.value;
        }
        const controlNodeExecutions = traceMap.get(controlNode.id);

        if (controlNode.userEvent) {
            controlStatements.push(new UserEventStatement(controlNode.userEvent));
            current = null;
        } else if (controlNode.event) {
            controlStatements.push(new EventStatement(controlNode.event));
            current = null;
        } else {
            const values = controlNodeExecutions.map(ExtractTrace.condition);
            controlStatements.push(new CalledControlStatement(controlNode.block, values));

            current = controlNode.block;
        }
    }

    return new CalledStatement(statement, controlStatements);
};

const whyWereStatementsCalled = (specificStatements, traceMap, cdg) => {
    const statements = [];
    for (const stmt of specificStatements) {
        const statement = whyWasStatementCalled(stmt, traceMap, cdg);
        statements.push(statement);
    }
    return statements;
};

const whyDidntAttributeChangeQuestion = (question, traces, traceMap, cdg, target, blocks, filterStatements, extractAttr,
    containsNoneText, neverCalledText, didChangeText, didntChangeText, valMapper, variable) => {
    const changeBlocks = Object.values(blocks).filter(filterStatements);
    if (!changeBlocks.length) {
        // Code doesn't contain any specific statement
        return new Answer({
            type: question.type,
            text: containsNoneText(),
            variable: variable
        });
    }
    const stmts = traces.filter(t => blocks.hasOwnProperty(t.blockId) && filterStatements(t));
    if (!stmts.length) {
        // Not a single specific statement was ever called
        const reasons = whyWerentStatementsCalled(changeBlocks, traceMap, cdg);
        return new Answer({
            type: question.type,
            text: neverCalledText(),
            statements: reasons
        });
    }

    const changingStatements = [];
    // Changes between two statements
    let index = 0;
    for (; stmts.length > 1 && index < stmts.length - 1; index++) {
        const ti1 = stmts[index].ti(target.id);
        const ti2 = stmts[index + 1].ti(target.id);
        const startValue = extractAttr(ti1);
        const endValue = extractAttr(ti2);
        if (ti1 && ti2 && startValue !== endValue) {
            changingStatements.push(new ChangingStatement(stmts[index], valMapper(startValue), valMapper(endValue)));
        }
    }
    // Change between second to last and last statement
    const sndLastValue = extractAttr(stmts[index].ti(target.id));
    const finalValue = extractAttr(target);
    if (sndLastValue !== finalValue) {
        changingStatements.push(new ChangingStatement(stmts[index], valMapper(sndLastValue), valMapper(finalValue)));
    }

    // Statements that affected the current target's position
    if (changingStatements.length) {
        return new Answer({
            type: question.type,
            text: didChangeText(),
            statements: changingStatements,
            variable: variable
        });
    } else { // eslint-disable-line no-else-return
        return new Answer({
            type: question.type,
            text: didntChangeText(),
            variable: variable
        });
    }
};

const whyNoSpecificValue = (question, traceMap, cdg,
    overwrittenAndNotCalledText, overwrittenText, notCalledText) => {
    const statements = [];

    let overwritten = false;
    let notCalled = false;

    for (const setStmt of question.setBlocks) {
        const executions = traceMap.get(setStmt.id);
        if (executions.length) {
            overwritten = true;
            statements.push(new OverwrittenStatement(setStmt));
        } else {
            notCalled = true;
            statements.push(whyWasntStatementCalled(setStmt, traceMap, cdg));
        }
    }
    let text;
    if (overwritten && notCalled) {
        text = overwrittenAndNotCalledText();
    } else if (overwritten) {
        text = overwrittenText();
    } else if (notCalled) {
        text = notCalledText();
    }

    return new Answer({
        type: question.type,
        text: text,
        statements: statements
    });
};


const computeQuestionAnswer = (question, vm, traceMap, cfg, cdg) => {
    const traces = vm.runtime.traceInfo.tracer.traces;
    const allBlocks = getAllBlocks(vm.runtime.targets);

    const blockId = question.blockId;
    const block = blockId ? allBlocks[blockId] : null;
    const target = question.target;
    const targetBlocks = target ? target.blocks._blocks : [];
    const targetName = target ? target.sprite.name : '';

    switch (question.type) {
    // Movement Questions
    case QuestionTypes.DID_MOVE: {
        const extractAttribute = t => `(${t.x},${t.y})`;
        const textFunction = () => `These statements changed ${targetName}'s position.`;
        const valMapper = val => val;

        return whyDidAttributeChangeQuestion(
            question,
            traces,
            target,
            targetBlocks,
            MotionFilter.positionChange,
            extractAttribute,
            textFunction,
            valMapper
        );
    }
    case QuestionTypes.DID_NOT_MOVE: {
        const extractAttribute = t => `(${t.x},${t.y})`;
        const valMapper = val => val;
        return whyDidntAttributeChangeQuestion(
            question,
            traces,
            traceMap,
            cdg,
            target,
            targetBlocks,
            MotionFilter.positionChange,
            extractAttribute,
            () => `Your code does not contain any move statement for ${targetName}.`,
            () => `${targetName} move statements were never called, here's why.`,
            () => `${targetName} did move, but its start and finish positions are just the same.`,
            () => `${targetName}'s moving statements were called, but never changed its position.`,
            valMapper
        );
    }
    case QuestionTypes.DID_CHANGE_DIRECTION: {
        const extractAttribute = t => t.direction;
        const textFunction = () => `These statements changed ${targetName}'s direction.`;
        const valMapper = val => val;

        return whyDidAttributeChangeQuestion(
            question,
            traces,
            target,
            targetBlocks,
            MotionFilter.directionChange,
            extractAttribute,
            textFunction,
            valMapper
        );
    }
    case QuestionTypes.DID_NOT_CHANGE_DIRECTION: {
        const extractAttribute = t => t.direction;
        const valMapper = val => val;
        return whyDidntAttributeChangeQuestion(
            question,
            traces,
            traceMap,
            cdg,
            target,
            targetBlocks,
            MotionFilter.directionChange,
            extractAttribute,
            () => `Your code does not contain any direction change statements for ${targetName}.`,
            () => `${targetName} direction change statements were never called, here's why.`,
            () => `${targetName} did change its direction, but its start and finish direction are just the same.`,
            () => `${targetName}'s direction change statements were called, but never changed its direction.`,
            valMapper
        );
    }
    case QuestionTypes.DID_NOT_SPECIFIC_POSITION: {
        return whyNoSpecificValue(
            question,
            traceMap,
            cdg,
            // eslint-disable-next-line max-len
            () => `Some statements for setting position to ${question.value} were called, but overwritten. Some were never called `,
            () => `Setting position to ${question.value} was called, but later overwritten.`,
            () => `Setting position to ${question.value} was never called.`
        );
    }
    case QuestionTypes.DID_NOT_SPECIFIC_X: {
        return whyNoSpecificValue(
            question,
            traceMap,
            cdg,
            // eslint-disable-next-line max-len
            () => `Some statements for setting x to ${question.value} were called, but overwritten. Some were never called `,
            () => `Setting x to ${question.value} was called, but later overwritten.`,
            () => `Setting x to ${question.value} was never called.`
        );
    }
    case QuestionTypes.DID_NOT_SPECIFIC_Y: {
        return whyNoSpecificValue(
            question,
            traceMap,
            cdg,
            // eslint-disable-next-line max-len
            () => `Some statements for setting y to ${question.value} were called, but overwritten. Some were never called `,
            () => `Setting y to ${question.value} was called, but later overwritten.`,
            () => `Setting y to ${question.value} was never called.`
        );
    }
    case QuestionTypes.DID_NOT_SPECIFIC_DIRECTION: {
        return whyNoSpecificValue(
            question,
            traceMap,
            cdg,
            // eslint-disable-next-line max-len
            () => `Some statements for setting direction to ${question.value} were called, but overwritten. Some were never called `,
            () => `Setting direction to ${question.value} was called, but later overwritten.`,
            () => `Setting direction to ${question.value} was never called.`
        );
    }

    // Appearance
    case QuestionTypes.DID_CHANGE_COSTUME: {
        const extractAttribute = t => t.currentCostume;
        const valMapper = val => target.sprite.costumes_[val].name;
        if (target.isStage) {
            const textFunction = () => `These statements changed the backdrop.`;

            return whyDidAttributeChangeQuestion(
                question,
                traces,
                target,
                allBlocks,
                LooksFilter.backdropChange,
                extractAttribute,
                textFunction,
                valMapper
            );
        } else { // eslint-disable-line no-else-return
            const textFunction = () => `These statements changed ${targetName}'s costume.`;

            return whyDidAttributeChangeQuestion(
                question,
                traces,
                target,
                targetBlocks,
                LooksFilter.costumeChange,
                extractAttribute,
                textFunction,
                valMapper,
            );
        }
    }
    case QuestionTypes.DID_NOT_CHANGE_COSTUME: {
        const extractAttribute = t => t.currentCostume;
        const valMapper = val => target.sprite.costumes_[val].name;
        if (target.isStage) {
            return whyDidntAttributeChangeQuestion(
                question,
                traces,
                traceMap,
                cdg,
                target,
                allBlocks,
                LooksFilter.backdropChange,
                extractAttribute,
                () => `Your code does not contain any backdrop change statements.`,
                () => `Backdrop change statements were never called, here's why.`,
                () => `The backdrop was changed, but its start and finish values are just the same.`,
                () => `Backdrop change statements were called, but never changed the backdrop.`,
                valMapper
            );
        } else { // eslint-disable-line no-else-return
            return whyDidntAttributeChangeQuestion(
                question,
                traces,
                traceMap,
                cdg,
                target,
                allBlocks,
                LooksFilter.backdropChange,
                extractAttribute,
                () => `Your code does not contain any costume change statements for ${targetName}.`,
                () => `${targetName}'s costume change statements were never called, here's why.`,
                () => `${targetName} did change its costume, but its start and finish costume are just the same.`,
                () => `${targetName}'s costume change statements were called, but never changed its costume.`,
                valMapper
            );
        }
    }
    case QuestionTypes.DID_NOT_SPECIFIC_COSTUME: {
        if (target.isStage) {
            return whyNoSpecificValue(
                question,
                traceMap,
                cdg,
                // eslint-disable-next-line max-len
                () => `Some statements for setting the backdrop to ${question.value} were called, but overwritten. Some were never called `,
                () => `Setting the backdrop to ${question.value} was called, but later overwritten.`,
                () => `Setting the backdrop to ${question.value} was never called.`
            );
        } else { // eslint-disable-line no-else-return
            return whyNoSpecificValue(
                question,
                traceMap,
                cdg,
                // eslint-disable-next-line max-len
                () => `Some statements for setting ${targetName}'s costume to ${question.value} were called, but overwritten. Some were never called `,
                () => `Setting ${targetName}'s costume to ${question.value} was called, but later overwritten.`,
                () => `Setting ${targetName}'s costume to ${question.value} was never called.`
            );
        }
    }
    case QuestionTypes.DID_CHANGE_SIZE: {
        const extractAttribute = t => t.size;
        const textFunction = () => `These statements changed ${targetName}'s size.`;
        const valMapper = val => val;

        return whyDidAttributeChangeQuestion(
            question,
            traces,
            target,
            targetBlocks,
            LooksFilter.sizeChange,
            extractAttribute,
            textFunction,
            valMapper,
        );
    }
    case QuestionTypes.DID_NOT_CHANGE_SIZE: {
        const extractAttribute = t => t.size;
        const valMapper = val => val;

        return whyDidntAttributeChangeQuestion(
            question,
            traces,
            traceMap,
            cdg,
            target,
            allBlocks,
            LooksFilter.sizeChange,
            extractAttribute,
            () => `Your code does not contain any change size statements for ${targetName}.`,
            () => `${targetName}'s size change statements were never called, here's why.`,
            () => `${targetName} did change its size, but its start and finish size are just the same.`,
            () => `${targetName}'s size change statements were called, but never changed its size.`,
            valMapper
        );
    }
    case QuestionTypes.DID_NOT_SPECIFIC_SIZE: {
        return whyNoSpecificValue(
            question,
            traceMap,
            cdg,
            () => `Some statements for setting size to ${question.value} were called, but overwritten. Some were never called `,
            () => `Setting size to ${question.value} was called, but later overwritten.`,
            () => `Setting size to ${question.value} was never called.`
        );
    }
    case QuestionTypes.DID_CHANGE_VISIBILITY: {
        const extractAttribute = t => t.visible;
        const textFunction = () => `These statements changed ${targetName}'s visibility.`;
        const valMapper = val => (val ? 'visible' : 'hidden');

        return whyDidAttributeChangeQuestion(
            question,
            traces,
            target,
            targetBlocks,
            LooksFilter.sizeChange,
            extractAttribute,
            textFunction,
            valMapper,
        );
    }
    case QuestionTypes.DID_NOT_CHANGE_VISIBILITY: {
        const extractAttribute = t => t.visible;
        const valMapper = val => (val ? 'visible' : 'hidden');

        return whyDidntAttributeChangeQuestion(
            question,
            traces,
            traceMap,
            cdg,
            target,
            allBlocks,
            LooksFilter.sizeChange,
            extractAttribute,
            () => `Your code does not contain any change visibility statements for ${targetName}.`,
            () => `${targetName}'s visibility change statements were never called, here's why.`,
            () => `${targetName} did change its visibility, but its start and finish visibility are just the same.`,
            () => `${targetName}'s visibility change statements were called, but never changed its visibility.`,
            valMapper
        );
    }
    case QuestionTypes.DID_NOT_SPECIFIC_VISIBILITY: {
        return whyNoSpecificValue(
            question,
            traceMap,
            cdg,
            () => `Some statements for setting visibility to ${question.value} were called, but overwritten. Some were never called `,
            () => `Setting visibility to ${question.value} was called, but later overwritten.`,
            () => `Setting visibility to ${question.value} was never called.`
        );
    }

    // Variable specific
    case QuestionTypes.DID_VARIABLE_CHANGE: {
        const variable = question.variable;
        const filterStatements = b => VariableFilter.update(b) && b.fields.VARIABLE.id === variable.id;
        const extractAttribute = t => t.variables[variable.id].value;
        const textFunction = (firstValue, finalValue) =>
            `These statements affected ${variable.name}'s change from ${firstValue} to ${finalValue}.`;
        const valMapper = val => val;

        return whyDidAttributeChangeQuestion(
            question,
            traces,
            target,
            target.isStage ? allBlocks : targetBlocks,
            filterStatements,
            extractAttribute,
            textFunction,
            valMapper,
            variable
        );
    }
    case QuestionTypes.DID_NOT_VARIABLE_CHANGE: {
        const variable = question.variable;
        const filterStatements = b => VariableFilter.update(b) && b.fields.VARIABLE.id === variable.id;
        const extractAttribute = t => t.variables[variable.id].value;
        const valMapper = val => val;

        return whyDidntAttributeChangeQuestion(
            question,
            traces,
            traceMap,
            cdg,
            target,
            target.isStage ? allBlocks : targetBlocks,
            filterStatements,
            extractAttribute,
            () => `Your code does not contain any change statements for ${variable.name}.`,
            () => `${variable.name}'s change statements were never called, here's why.`,
            () => `${variable.name} did change its value, but its start and finish value are just the same.`,
            () => `${variable.name}'s change statements were called, but never changed its value.`,
            valMapper,
            variable
        );
    }
    case QuestionTypes.DID_NOT_VARIABLE_SPECIFIC_VALUE: {
        const variable = question.variable;
        return whyNoSpecificValue(
            question,
            traceMap,
            cdg,
            () => `Some statements for ${variable.name}'s value to ${question.value} were called, but overwritten. Some were never called `,
            () => `Setting ${variable.name}'s value to ${question.value} was called, but later overwritten.`,
            () => `Setting ${variable.name}'s value to ${question.value} was never called.`
        );
    }
    case QuestionTypes.DID_VARIABLE_SHOW: {
        break;
    }
    case QuestionTypes.DID_NOT_VARIABLE_SHOW: {
        break;
    }

    // Sound specific
    case QuestionTypes.DID_NOT_PLAY_ANY_SOUND: {
        // TODO Phil 03/04/2020: probably remove it
        break;
    }
    case QuestionTypes.DID_PLAY_SOUND: {
        const sound = question.sound;
        const playedBlocks = question.soundBlocks;

        const reasons = whyWereStatementsCalled(playedBlocks, traceMap, cdg);
        return new Answer({
            type: question.type,
            text: `Sound ${sound.name} was played, here's why.`,
            statements: reasons
        });
    }
    case QuestionTypes.DID_NOT_PLAY_SOUND: {
        const sound = question.sound;
        const soundBlocks = question.soundBlocks;
        const reasons = whyWerentStatementsCalled(soundBlocks, traceMap, cdg);

        return new Answer({
            type: question.type,
            text: `${targetName} never played ${sound.name}, here's why.`,
            statements: reasons
        });
    }

    // Event specific
    case QuestionTypes.DID_CALL_EVENT: {
        const broadcastVariable = question.broadcastVariable;
        const broadcastBlocks = question.broadcastBlocks;
        const reasons = whyWereStatementsCalled(broadcastBlocks, traceMap, cdg);

        return new Answer({
            type: question.type,
            text: `Event ${broadcastVariable.name} was called, here's why.`,
            statements: reasons
        });
    }
    case QuestionTypes.DID_NOT_CALL_EVENT: {
        const broadcastVariable = question.broadcastVariable;
        const broadcastBlocks = question.broadcastBlocks;

        if (broadcastBlocks.length) {
            const reasons = whyWerentStatementsCalled(broadcastBlocks, traceMap, cdg);
            return new Answer({
                type: question.type,
                text: `Event ${broadcastVariable.name} was never called, here's why.`,
                statements: reasons
            });
        } else { // eslint-disable-line no-else-return
            return new Answer({
                type: question.type,
                text: `There is no statement calling event ${broadcastVariable.name}.`
            });
        }
    }

    // General stuff
    case QuestionTypes.DID_NOTHING_MOVE: {
        // TODO Phil 03/04/2020:
        break;
    }
    case QuestionTypes.DID_NOTHING_SOUND: {
        // TODO Phil 03/04/2020:
        break;
    }
    default:
        console.log(`Unrecognized question type: ${forQuestionType(question.type)}`);
        break;
    }
};

export {
    Question,
    Answer,
    createTraceMap,
    computeQuestions,
    computeQuestionAnswer,
    QuestionTypes,
    Statement,
    NotCalledStatement,
    ControlStatement,
    NotCalledControlStatement
};
