import {QuestionTypes} from './ir-questions';

const forQuestionType = value => {
    for (const [k, v] of Object.entries(QuestionTypes)) {
        if (value === v) return k;
    }
};

const getTargetVariableValue = (trace, targetId, variableId) => {
    return trace
        .targetsInfo[targetId]
        .variables[variableId].value;
};

const getVariableValue = (trace, variableId) => {
    return Object
        .values(trace.targetsInfo)
        .find(target => target.variables.hasOwnProperty(variableId))
        .variables[variableId].value;
};

const isMoveStatement = statement => statement.opcode === 'motion_movesteps' ||
    statement.opcode.startsWith('motion_goto') ||
    statement.opcode.startsWith('motion_glide') ||
    statement.opcode.startsWith('motion_change') || // covers changex & changey
    statement.opcode.startsWith('motion_set'); // covers setx & sety

const isSoundStatement = statement => statement.opcode === 'sound_play' ||
    statement.opcode === 'sound_playuntildone';

const isUpdateVariableStatement = statement => statement.opcode === 'data_setvariableto' ||
    statement.opcode === 'data_changevariableby';

const generateId = () => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array.toString();
};


export {
    forQuestionType,
    getTargetVariableValue,
    getVariableValue,
    isMoveStatement,
    isUpdateVariableStatement,
    isSoundStatement,
    generateId
};
