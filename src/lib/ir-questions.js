import {
    forQuestionType,
    generateId,
    getTargetVariableValue,
    getVariableValue,
    costumeIndexForTargetAndName,
    getAllBlocks,

    isBackdropChangeStatement,
    isBackdropSetStatement,
    isCostumeChangeStatement,
    isCostumeSetStatement,
    isDirectionChangeStatement,
    isDirectionSetStatement,
    isMoveChangeStatement,
    isPositionSetStatement,
    isSizeChangeStatement,
    isSizeSetStatement,
    isSoundStatement,
    isUpdateVariableStatement,
    isVisibilitySetStatement,
    isXSetStatement,
    isYSetStatement
} from './ir-questions-util';

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
    DID_NOT_SPECIFIC_COSTUME: 51,
    DID_CHANGE_SIZE: 60,
    DID_NOT_CHANGE_SIZE: 61,
    DID_NOT_SPECIFIC_SIZE: 62,
    DID_CHANGE_VISIBILITY: 70,
    DID_NOT_CHANGE_VISIBILITY: 71,
    DID_NOT_SPECIFIC_VISIBILITY: 72,

    // Variable specific
    DID_VARIABLE_CHANGE: 100,
    DID_NOT_VARIABLE_CHANGE: 101,
    DID_VARIABLE_SPECIFIC_VALUE: 102,
    DID_NOT_VARIABLE_SPECIFIC_VALUE: 103,
    DID_VARIABLE_SHOW: 104,
    DID_NOT_VARIABLE_SHOW: 105,

    // Sound specific
    DID_NOT_PLAY_ANY_SOUND: 150,
    DID_PLAY_SOUND: 151,
    DID_NOT_PLAY_SOUND: 152,

    // General stuff
    DID_NOTHING_MOVE: 400,
    DID_NOTHING_SOUND: 401,

    // Block specific
    DID_EXECUTE: 200,
    DID_NOT_EXECUTE: 201,

    DID_LAST_QUESTION: 9999
});

class Question {
    constructor (props) {
        this.id = generateId();

        this.type = props.type;
        this.target = props.target;
        this.blockId = props.blockId;
        this.text = props.text;
        this.variable = props.variable;
        this.sound = props.sound;
    }
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
    // TODO Phil 19/02/2020: Required for `why` questions
    //   Query trace for sprites
    //   Many more

    // TODO Phil 19/02/2020: Required for `why not` questions
    //   Get AST for each target
    //   Compute full AST
    constructor (vm, trace) {
        this.vm = vm;
        this.trace = trace;

        this.questions = {
            targets: {},
            globalVariables: {},
            generalQuestions: []
        };


        this.generateQuestions();
    }

    generateQuestions () {
        const trace = this.trace;
        const anything = {
            move: false,
            sound: false
        };

        const targets = this.vm.runtime.targets;
        const allBlocks = getAllBlocks(targets);
        for (const target of targets) {
            const askableQuestions = [];

            const initialTargetState = trace[0].targetsInfo[target.id];
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
            //     askableQuestions.push(new Question({
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
                    const containedMoveStmts = targetTrace.some(isMoveChangeStatement);
                    if (containedMoveStmts) {
                        if (initialTargetState.x === target.x && initialTargetState.y === target.y) {
                            askableQuestions.push(new Question({
                                type: QuestionTypes.DID_NOT_MOVE,
                                target: target,
                                text: `Why didn't ${target.sprite.name} move?`
                            }));
                        } else {
                            anything.move = true;
                            askableQuestions.push(new Question({
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
                    const positionSetStmts = Object.values(blocks).filter(isPositionSetStatement);
                    for (const setStmt of positionSetStmts) {
                        const xPos = parseInt(blocks[setStmt.inputs.X.block].fields.NUM.value, 10);
                        const yPos = parseInt(blocks[setStmt.inputs.Y.block].fields.NUM.value, 10);
                        if (xPos !== target.x || yPos !== target.y) {
                            const coordinate = `(${xPos},${yPos})`;
                            if (covered.hasOwnProperty(coordinate)) {
                                covered[coordinate].push(setStmt);
                            } else {
                                covered[coordinate] = [setStmt];
                            }
                        }
                    }
                    for (const coordinate of Object.keys(covered)) {
                        askableQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_SPECIFIC_POSITION,
                            target: target,
                            blocks: Object.values(covered),
                            text: `Why didn't ${target.sprite.name}'s have position ${coordinate}?`
                        }));
                    }
                }

                {
                    // Why didn't sprite’s x coordinate have value <x> ?
                    const covered = {};
                    const xSetStmts = Object.values(blocks).filter(isXSetStatement);
                    for (const setStmt of xSetStmts) {
                        const xPos = parseInt(blocks[setStmt.inputs.X.block].fields.NUM.value, 10);
                        if (xPos !== target.x) {
                            if (covered.hasOwnProperty(xPos)) {
                                covered[xPos].push(setStmt);
                            } else {
                                covered[xPos] = [setStmt];
                            }
                        }
                    }
                    for (const xPos of Object.keys(covered)) {
                        askableQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_SPECIFIC_X,
                            target: target,
                            blocks: Object.values(covered),
                            text: `Why didn't ${target.sprite.name}'s x coordinate have value ${xPos}?`
                        }));
                    }
                }

                {
                    // Why didn't sprite’s y coordinate have value <y> ?
                    const covered = {};
                    const ySetStmts = Object.values(blocks).filter(isYSetStatement);
                    for (const setStmt of ySetStmts) {
                        const yPos = parseInt(blocks[setStmt.inputs.Y.block].fields.NUM.value, 10);
                        if (yPos !== target.y) {
                            if (covered.hasOwnProperty(yPos)) {
                                covered[yPos].push(setStmt);
                            } else {
                                covered[yPos] = [setStmt];
                            }
                        }
                    }
                    for (const yPos of Object.keys(covered)) {
                        askableQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_SPECIFIC_X,
                            target: target,
                            blocks: Object.values(covered),
                            text: `Why didn't ${target.sprite.name}'s y coordinate have value ${yPos}?`
                        }));
                    }
                }
            }

            // Check whether the sprite direction did change or not?
            if (!target.isStage) {
                // Why did sprite’s direction change?
                // Why didn't sprite’s direction change?
                const containedDirectionStmt = targetTrace.some(isDirectionChangeStatement);
                if (containedDirectionStmt) {
                    if (initialTargetState.direction === target.direction) {
                        askableQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_CHANGE_DIRECTION,
                            target: target,
                            text: `Why didn't ${target.sprite.name}'s direction change?`
                        }));
                    } else {
                        askableQuestions.push(new Question({
                            type: QuestionTypes.DID_CHANGE_DIRECTION,
                            target: target,
                            text: `Why did ${target.sprite.name}'s direction change?`
                        }));
                    }
                }

                // Why didn't sprite’s direction have value <direction> ?
                const covered = {};
                const directionSetStmts = Object.values(blocks).filter(isDirectionSetStatement);
                for (const setStmt of directionSetStmts) {
                    const directionValue = parseInt(blocks[setStmt.inputs.DIRECTION.block].fields.NUM.value, 10);
                    if (directionValue !== target.direction) {
                        if (covered.hasOwnProperty(directionValue)) {
                            covered[directionValue].push(setStmt);
                        } else {
                            covered[directionValue] = [setStmt];
                        }
                    }
                }
                for (const direction of Object.keys(covered)) {
                    askableQuestions.push(new Question({
                        type: QuestionTypes.DID_NOT_SPECIFIC_DIRECTION,
                        target: target,
                        blocks: Object.values(covered),
                        text: `Why didn't ${target.sprite.name}'s direction have value ${direction}?`
                    }));
                }
            }

            // Check whether the stage backdrop or target costume did change or not?
            if (target.isStage) {
                const containedBackdropChange = trace.some(isBackdropChangeStatement);
                if (containedBackdropChange) {
                    const firstBackdrop = initialTargetState.currentCostume;
                    const finalBackDrop = target.currentCostume;
                    if (firstBackdrop === finalBackDrop) {
                        askableQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_CHANGE_COSTUME,
                            target: target,
                            text: `Why didn't stage's backdrop change?`
                        }));
                    } else {
                        askableQuestions.push(new Question({
                            type: QuestionTypes.DID_CHANGE_COSTUME,
                            target: target,
                            text: `Why did stage's backdrop change?`
                        }));
                    }
                }
                {
                    // Why didn't stage's backdrop have value <costume> ?
                    const covered = {};
                    const backdropSetStmts = Object.values(allBlocks).filter(isBackdropSetStatement);
                    for (const setStmt of backdropSetStmts) {
                        // Only the name, but we need the index
                        const backdrop = allBlocks[setStmt.inputs.BACKDROP.block].fields.BACKDROP.value;
                        const costumeIndex = costumeIndexForTargetAndName(target, backdrop);
                        if (costumeIndex && parseInt(costumeIndex, 10) !== target.currentCostume) {
                            if (covered.hasOwnProperty(backdrop)) {
                                covered[backdrop].push(setStmt);
                            } else {
                                covered[backdrop] = [setStmt];
                            }
                        }
                    }
                    for (const costume of Object.keys(covered)) {
                        askableQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_SPECIFIC_COSTUME,
                            target: target,
                            blocks: Object.values(covered),
                            text: `Why didn't stage's backdrop have value ${costume}?`
                        }));
                    }
                }
            } else {
                const containedCostumeStmt = targetTrace.some(isCostumeChangeStatement);
                if (containedCostumeStmt) {
                    const firstCostume = initialTargetState.currentCostume;
                    const finalCostume = target.currentCostume;
                    if (firstCostume === finalCostume) {
                        askableQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_CHANGE_COSTUME,
                            target: target,
                            text: `Why didn't ${target.sprite.name}'s costume change?`
                        }));
                    } else {
                        askableQuestions.push(new Question({
                            type: QuestionTypes.DID_CHANGE_COSTUME,
                            target: target,
                            text: `Why did ${target.sprite.name}'s costume change?`
                        }));
                    }
                }
                {
                    // Why didn't sprite’s costume have value <costume> ?
                    const covered = {};
                    const costumeSetStmts = Object.values(blocks).filter(isCostumeSetStatement);
                    for (const setStmt of costumeSetStmts) {
                        // Only the name, but we need the index
                        const costume = blocks[setStmt.inputs.COSTUME.block].fields.COSTUME.value;
                        const costumeIndex = costumeIndexForTargetAndName(target, costume);
                        if (costumeIndex && parseInt(costumeIndex, 10) !== target.currentCostume) {
                            if (covered.hasOwnProperty(costume)) {
                                covered[costume].push(setStmt);
                            } else {
                                covered[costume] = [setStmt];
                            }
                        }
                    }
                    for (const costume of Object.keys(covered)) {
                        askableQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_SPECIFIC_COSTUME,
                            target: target,
                            blocks: Object.values(covered),
                            text: `Why didn't ${target.sprite.name}'s costume have value ${costume}?`
                        }));
                    }
                }
            }

            // Check whether the sprite size change
            if (!target.isStage) {
                // Why did sprite’s size change?
                // Why didn't sprite’s size change?
                const containedSizeStmt = targetTrace.some(isSizeChangeStatement);
                if (containedSizeStmt) {
                    if (initialTargetState.size === target.size) {
                        askableQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_CHANGE_SIZE,
                            target: target,
                            text: `Why didn't ${target.sprite.name}'s size change?`
                        }));
                    } else {
                        askableQuestions.push(new Question({
                            type: QuestionTypes.DID_CHANGE_SIZE,
                            target: target,
                            text: `Why did ${target.sprite.name}'s size change?`
                        }));
                    }
                }
                {
                    // Why didn't sprite’s size have value <size> ?
                    const covered = {};
                    const sizeSetStmts = Object.values(blocks).filter(isSizeSetStatement);
                    for (const setStmt of sizeSetStmts) {
                        const size = parseInt(blocks[setStmt.inputs.SIZE.block].fields.NUM.value, 10);
                        if (size !== target.size) {
                            if (covered.hasOwnProperty(size)) {
                                covered[size].push(setStmt);
                            } else {
                                covered[size] = [setStmt];
                            }
                        }
                    }
                    for (const size of Object.keys(covered)) {
                        askableQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_SPECIFIC_SIZE,
                            target: target,
                            blocks: Object.values(covered),
                            text: `Why didn't ${target.sprite.name}'s size have value ${size}?`
                        }));
                    }
                }
            }

            // Check whether the sprite visibility change
            if (!target.isStage) {
                const containedVisibilityStmt = targetTrace.some(isVisibilitySetStatement);
                if (containedVisibilityStmt) {
                    if (initialTargetState.visible === target.visible) {
                        askableQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_CHANGE_VISIBILITY,
                            target: target,
                            text: `Why didn't ${target.sprite.name}'s visibility change?`
                        }));
                    } else {
                        askableQuestions.push(new Question({
                            type: QuestionTypes.DID_CHANGE_VISIBILITY,
                            target: target,
                            text: `Why did ${target.sprite.name}'s visibility change?`
                        }));
                    }
                }
                {
                    // Why didn't sprite’s visibility have value <visibility> ?
                    const covered = {};
                    const visibilitySetStmts = Object.values(blocks).filter(isVisibilitySetStatement);
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
                    for (const visibility of Object.keys(covered)) {
                        const visibleString = visibility ? 'shown' : 'hidden';
                        askableQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_SPECIFIC_VISIBILITY,
                            target: target,
                            blocks: Object.values(covered),
                            text: `Why didn't ${target.sprite.name}'s visibility have value ${visibleString}?`
                        }));
                    }
                }
            }

            // Checks target variable values
            for (const variableId in target.variables) {
                const variable = target.variables[variableId];
                if (variable.type === 'broadcast_msg') {
                    // Broadcast messages shouldn't be counted as target variables
                    continue;
                }

                const currValue = variable.value;
                const initialValue = initialTargetState.variables[variableId].value;

                if (initialValue === currValue) {
                    askableQuestions.push(new Question({
                        type: QuestionTypes.DID_NOT_VARIABLE_CHANGE,
                        target: target,
                        variable: variable,
                        text: `Why didn't ${target.sprite.name}'s variable ${variable.name} change?`
                    }));
                } else {
                    askableQuestions.push(new Question({
                        type: QuestionTypes.DID_VARIABLE_CHANGE,
                        target: target,
                        variable: variable,
                        text: `Why did ${target.sprite.name}'s variable ${variable.name} change?`
                    }));
                }
            }

            // // Check why variable has certain value or not?
            // {
            //     if (target) {
            //         // TODO Phil 03/03/2020: filter out update statements for THAT variable
            //         const updateStatements =
            //             traces.filter(t => isUpdateVariableStatement(t) && (t.fields.VARIABLE.id === variable.id));
            //         for (let updateStatement of updateStatements) {
            //             console.log(updateStatement);
            //             const oldValue = updateStatement.argValues.VALUE;
            //             // inputs.keys() -> "VALUE"
            //             // -> argValues["VALUE"] -> actual value
            //         }
            //     }
            // }

            //     askableQuestions.push(new Question({
            //         type: QuestionTypes.HAS_NOT_VARIABLE_VALUE,
            //         target: target,
            //         text: `Why didn't ${target.sprite.name}'s variable speed change to 9000?`
            //     }));

            // Check whether this target played a sound or not
            {
                const targetSounds = target.sprite.sounds;
                if (targetSounds.length) {
                    const soundStmts = trace.filter(s => isSoundStatement(s) && blocks.hasOwnProperty(s.blockId));
                    if (soundStmts.length) {
                        anything.sound = true;
                        for (const sound of targetSounds) {
                            const soundPlayed = soundStmts.some(s => s.argValues.SOUND_MENU === sound.name);
                            if (soundPlayed) {
                                askableQuestions.push(new Question({
                                    type: QuestionTypes.DID_PLAY_SOUND,
                                    target: target,
                                    sound: sound,
                                    text: `Why did ${target.sprite.name} play sound ${sound.name}?`
                                }));
                            } else {
                                askableQuestions.push(new Question({
                                    type: QuestionTypes.DID_NOT_PLAY_SOUND,
                                    target: target,
                                    sound: sound,
                                    text: `Why didn't ${target.sprite.name} play sound ${sound.name}?`
                                }));
                            }
                        }
                    } else {
                        askableQuestions.push(new Question({
                            type: QuestionTypes.DID_NOT_PLAY_ANY_SOUND,
                            target: target,
                            text: `Why didn't ${target.sprite.name} play any sound?`
                        }));
                    }
                }
            }

            this.questions.targets[target.id] = askableQuestions;
        }

        // Check anything object for general questions
        {
            if (!anything.move) {
                this.questions.generalQuestions.push(new Question({
                    type: QuestionTypes.DID_NOTHING_MOVE,
                    text: `Why didn't anything move?`
                }));
            }
            if (!anything.sound) {
                this.questions.generalQuestions.push(new Question({
                    type: QuestionTypes.DID_NOTHING_SOUND,
                    text: `Why didn't the program play any sound?`
                }));
            }
        }
    }

    forTarget (target) {
        if (!this.questions.targets.hasOwnProperty(target.id)) {
            return [];
        }

        return this.questions.targets[target.id];
    }

    generalQuestions () {
        return this.questions.generalQuestions;
    }
}

// TODO Phil 09/03/2020: this function is called way too often...
const computeQuestions = vm => {
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

    const questionProvider = new QuestionProvider(vm, recordedTrace);

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

    return results;
};

// TODO Phil 03/03/2020: May make async
const computeQuestionAnswer = (question, vm) => {
    const traces = vm.runtime.traceInfo.tracer.traces;
    const allBlocks = getAllBlocks(vm.runtime.targets);

    const blockId = question.blockId;
    const block = blockId ? allBlocks[blockId] : null;
    const target = question.target;
    const targetBlocks = target ? target.blocks._blocks : [];

    switch (question.type) {
    case QuestionTypes.DID_MOVE: {
        const changingStatements = [];

        const tracedMoveStatements =
            traces.filter(t => targetBlocks.hasOwnProperty(t.blockId) && isMoveChangeStatement(t));

        // Check whether the target's position was changed between two recorded move statements
        let index = 0;
        for (; tracedMoveStatements.length > 1 && index < tracedMoveStatements.length - 1; index++) {
            const t1 = tracedMoveStatements[index].targetsInfo[target.id];
            const t2 = tracedMoveStatements[index + 1].targetsInfo[target.id];
            if (t1 && t2 && (t1.x !== t2.x || t1.y !== t2.y)) {
                changingStatements.push(tracedMoveStatements[index]);
            }
        }
        // Maybe the last moving statement changed the position?
        // Compare it with current target state
        const lastMoveTargetState = tracedMoveStatements[index].targetsInfo[target.id];
        if (target.x !== lastMoveTargetState.x || target.y !== lastMoveTargetState.y) {
            changingStatements.push(tracedMoveStatements[index]);
        }

        return new Answer({
            type: question.type,
            text: `These statements made ${target.sprite.name} move.`,
            statements: changingStatements
        });
    }
    case QuestionTypes.DID_NOT_MOVE: {
        const containsMoveStatements = Object.values(targetBlocks).some(b => isMoveChangeStatement(b));
        if (containsMoveStatements) {
            const tracedMoveStatements =
                traces.filter(t => targetBlocks.hasOwnProperty(t.blockId) && isMoveChangeStatement(t));
            if (tracedMoveStatements.length) {
                const changingStatements = [];

                // Check whether the target's position was changed between two recorded move statements
                let index = 0;
                for (; tracedMoveStatements.length > 1 && index < tracedMoveStatements.length - 1; index++) {
                    const t1 = tracedMoveStatements[index].targetsInfo[target.id];
                    const t2 = tracedMoveStatements[index + 1].targetsInfo[target.id];
                    if (t1 && t2 && (t1.x !== t2.x || t1.y !== t2.y)) {
                        changingStatements.push(tracedMoveStatements[index]);
                    }
                }
                // Maybe the last moving statement changed the position?
                // Compare it with current target state
                const lastMoveTargetState = tracedMoveStatements[index].targetsInfo[target.id];
                if (target.x !== lastMoveTargetState.x || target.y !== lastMoveTargetState.y) {
                    changingStatements.push(tracedMoveStatements[index]);
                }

                // Statements that affected the current target's position
                if (changingStatements.length) {
                    return new Answer({
                        type: question.type,
                        text: `${target.sprite.name} did move, but its start and finish positions are just the same.`,
                        statements: changingStatements
                    });
                } else {
                    return new Answer({
                        type: question.type,
                        text: `${target.sprite.name}'s moving statements were called, but never changed its position.`
                    });
                }
            } else {
                // Not a single move statement was ever called
                // TODO Phil 02/03/2020: Here we need the full AST to check why existing block statements weren't called
            }
        } else {
            // Code doesn't contain any move statements
            return new Answer({
                type: question.type,
                text: `Your code does not contain any move statement for ${target.sprite.name}.`
            });
        }
        break;
    }
    case QuestionTypes.DID_VARIABLE_CHANGE: {
        const changingStatements = [];
        const variable = question.variable;

        const startValue = getVariableValue(traces[0], variable.id);
        const endValue = variable.value;

        if (target) {
            const updateStatements = traces.filter(t => isUpdateVariableStatement(t) &&
                (t.fields.VARIABLE.id === variable.id));
            let index = 0;
            for (; updateStatements.length > 1 && index < updateStatements.length - 1; index++) {
                const v1 = getTargetVariableValue(updateStatements[index], target.id, variable.id);
                const v2 = getTargetVariableValue(updateStatements[index + 1], target.id, variable.id);

                if (v1 !== v2) {
                    changingStatements.push(updateStatements[index]);
                }
            }
            // Special case for last statement
            if (getTargetVariableValue(updateStatements[index], target.id, variable.id) !== endValue) {
                changingStatements.push(updateStatements[index]);
            }
        }

        return new Answer({
            type: question.type,
            text: `These statements affected ${variable.name}'s change from ${startValue} to ${endValue}.`,
            statements: changingStatements,
            variable: variable,
            startValue: startValue,
            endValue: endValue
        });
    }
    // case QuestionTypes.DID_NOT_VARIABLE_CHANGE: {
    //     // TODO Phil 03/03/2020: following cases
    //     //  no variable change statement
    //     //  not called
    //     //  called but did not affect
    //         break;
    //     }
    // }
    default:
        console.log(`Unrecognized question type: ${forQuestionType(question.type)}`);
        break;
    }
};

export {
    Question,
    Answer,
    computeQuestions,
    computeQuestionAnswer,
    QuestionTypes
};
