import {QuestionTypes} from './ir-questions';

const generateId = () => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array.toString();
};

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

const getAllBlocks = targets => targets.reduce((acc, target) => Object.assign(acc, target.blocks._blocks), {});

const costumeIndexForTargetAndName = (target, name) => {
    for (const [index, costume] of Object.entries(target.sprite.costumes_)) {
        if (costume.name === name) {
            return index;
        }
    }
};

export {
    generateId,
    forQuestionType,
    getTargetVariableValue,
    getVariableValue,
    costumeIndexForTargetAndName,
    getAllBlocks
};
