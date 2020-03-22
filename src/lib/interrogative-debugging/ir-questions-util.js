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

const getTargetVariableValue = (trace, targetId, variableId) =>
    trace.targetsInfo[targetId]
        .variables[variableId].value;

const getVariableValue = (trace, variableId) =>
    Object.values(trace.targetsInfo)
        .find(target => target.variables.hasOwnProperty(variableId))
        .variables[variableId].value;

const getAllBlocks = targets => targets.reduce((acc, target) => Object.assign(acc, target.blocks._blocks), {});

const costumeIndexForTargetAndName = (target, name) => {
    for (const [index, costume] of Object.entries(target.sprite.costumes_)) {
        if (costume.name === name) {
            return index;
        }
    }
};

const getBranchStart = statement => statement.inputs.SUBSTACK.block;

const getElseBranchStart = statement => statement.inputs.SUBSTACK2.block;

const Extract = {
    broadcastForBlock: block =>
        block.fields.BROADCAST_OPTION.value,
    broadcastForStatement: (blocks, statement) =>
        Extract.broadcastForBlock(blocks[statement.inputs.BROADCAST_INPUT.block]),
    direction: (blocks, statement) =>
        parseInt(blocks[statement.inputs.DIRECTION.block].fields.NUM.value, 10),
    xPosition: (blocks, statement) =>
        parseInt(blocks[statement.inputs.X.block].fields.NUM.value, 10),
    yPosition: (blocks, statement) =>
        parseInt(blocks[statement.inputs.Y.block].fields.NUM.value, 10),
    sizeValue: (blocks, statement) =>
        parseInt(blocks[statement.inputs.SIZE.block].fields.NUM.value, 10),
    costume: (blocks, statement) =>
        blocks[statement.inputs.COSTUME.block].fields.COSTUME.value,
    backdrop: (blocks, statement) =>
        blocks[statement.inputs.BACKDROP.block].fields.BACKDROP.value,
    variableValue: (blocks, statement) =>
        blocks[statement.inputs.VALUE.block].fields.TEXT.value,
    stopOption: block =>
        block.fields.STOP_OPTION.value
};

export {
    generateId,
    forQuestionType,
    getTargetVariableValue,
    getVariableValue,
    costumeIndexForTargetAndName,
    getAllBlocks,
    getBranchStart,
    getElseBranchStart,
    Extract
};
