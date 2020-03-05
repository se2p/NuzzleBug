import {
    forQuestionType,
    generateId,
    getTargetVariableValue,
    getVariableValue,
    isMoveStatement,
    isUpdateVariableStatement,
    isSoundStatement
} from './ir-questions-util';

const QuestionTypes = Object.freeze({
    // Target specific
    DID_MOVE: 0,
    DID_NOT_MOVE: 1,
    DID_CHANGE_COSTUME: 2,
    DID_NOT_CHANGE_COSTUME: 3,

    // Sound specific
    DID_PLAY_SOUND: 100,
    DID_NOT_PLAY_SOUND: 101,
    DID_NOT_PLAY_ANY_SOUND: 102,

    // Variable specific
    DID_VARIABLE_CHANGE: 200,
    DID_NOT_VARIABLE_CHANGE: 201,
    HAS_VARIABLE_VALUE: 202,
    HAS_NOT_VARIABLE_VALUE: 203,

    // Block specific
    DID_EXECUTE: 300,
    DID_NOT_EXECUTE: 301,

    // General stuff
    DID_NOTHING_MOVE: 400,
    DID_NOTHING_SOUND: 401,

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
        for (const target of targets) {
            const askableQuestions = [];

            const initialTargetState = trace[0].targetsInfo[target.id];
            const blocks = target.blocks._blocks;

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
                if (initialTargetState.x !== target.x || initialTargetState.y !== target.y) {
                    anything.move = true;
                    askableQuestions.push(new Question({
                        type: QuestionTypes.DID_MOVE,
                        target: target,
                        text: `Why did ${target.sprite.name} move?`
                    }));
                } else {
                    askableQuestions.push(new Question({
                        type: QuestionTypes.DID_NOT_MOVE,
                        target: target,
                        text: `Why didn't ${target.sprite.name} move?`
                    }));
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
            //         const updateStatements = traces.filter(t => isUpdateVariableStatement(t) && (t.fields.VARIABLE.id === variable.id));
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

            // Check whether the stage backdrop or target costume has changed
            if (target.isStage) {
                const firstBackdrop = initialTargetState.currentCostume;
                const finalBackDrop = target.currentCostume;
                if (firstBackdrop === finalBackDrop) {
                    askableQuestions.push(new Question({
                        type: QuestionTypes.DID_NOT_CHANGE_COSTUME,
                        target: target,
                        text: `Why didn't ${target.sprite.name}'s backdrop change?`
                    }));
                } else {
                    askableQuestions.push(new Question({
                        type: QuestionTypes.DID_CHANGE_COSTUME,
                        target: target,
                        text: `Why did ${target.sprite.name}'s backdrop change?`
                    }));
                }
            } else {
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

            // TODO Phil 01/03/2020: continue here
            //  implement every question sequentially
            //  Questions for global variables
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
        info: {name: 'General Questions'},
        questions: questionProvider.generalQuestions()
    });

    return results;
};

// TODO Phil 03/03/2020: May make async
const computeQuestionAnswer = (question, vm) => {
    const traces = vm.runtime.traceInfo.tracer.traces;
    const allBlocks = vm.runtime.targets.flatMap(tar => tar.blocks._blocks);

    const blockId = question.blockId;
    const block = blockId ? allBlocks[blockId] : null;
    const target = question.target;
    const targetBlocks = target ? target.blocks._blocks : [];

    switch (question.type) {
    case QuestionTypes.DID_MOVE: {
        const changingStatements = [];

        const tracedMoveStatements = traces.filter(t => targetBlocks.hasOwnProperty(t.blockId) && isMoveStatement(t));

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
        const containsMoveStatements = Object.values(targetBlocks).some(b => isMoveStatement(b));
        if (containsMoveStatements) {
            const tracedMoveStatements =
                traces.filter(t => targetBlocks.hasOwnProperty(t.blockId) && isMoveStatement(t));
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
        } else {
            // TODO Phil 03/03/2020: How to handle global variables? Currently, they're not traced? Are they?
        }

        return new Answer({
            type: question.type,
            text: `These statements affected ${variable.name}'s change from ${startValue} to ${endValue}.`,
            statements: changingStatements,
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
