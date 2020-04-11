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

const targetForBlockId = (targets, blockId) => {
    for (const target of targets) {
        if (target.blocks._blocks.hasOwnProperty(blockId)) {
            return target;
        }
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

const Extract = {
    sound: (blocks, block) =>
        blocks[block.inputs.SOUND_MENU.block].fields.SOUND_MENU.value,
    broadcastForBlock: block =>
        block.fields.BROADCAST_OPTION.value,
    broadcastForStatement: (blocks, block) =>
        Extract.broadcastForBlock(blocks[block.inputs.BROADCAST_INPUT.block]),
    cloneCreateTarget: (blocks, block) =>
        blocks[block.inputs.CLONE_OPTION.block].fields.CLONE_OPTION.value,
    cloneSendTarget: (targets, block) =>
        targetForBlockId(targets, block.id).sprite.name,
    direction: (blocks, block) =>
        parseInt(blocks[block.inputs.DIRECTION.block].fields.NUM.value, 10),
    xPosition: (blocks, block) =>
        parseInt(blocks[block.inputs.X.block].fields.NUM.value, 10),
    yPosition: (blocks, block) =>
        parseInt(blocks[block.inputs.Y.block].fields.NUM.value, 10),
    sizeValue: (blocks, block) =>
        parseInt(blocks[block.inputs.SIZE.block].fields.NUM.value, 10),
    costume: (blocks, block) =>
        blocks[block.inputs.COSTUME.block].fields.COSTUME.value,
    backdrop: (blocks, block) =>
        blocks[block.inputs.BACKDROP.block].fields.BACKDROP.value,
    variableValue: (blocks, block) =>
        blocks[block.inputs.VALUE.block].fields.TEXT.value,
    stopOption: block =>
        block.fields.STOP_OPTION.value,
    clickedSprite: (targets, block) =>
        targetForBlockId(targets, block.id).sprite.name,
    clickedKey: block =>
        block.fields.KEY_OPTION.value
};

const ExtractTrace = {
    condition: record =>
        record.argValues.CONDITION,
    conditionString: record =>
        'Not yet implemented',
    targetVariableValue: (record, targetId, variableId) => {
        return record.targetsInfo[targetId]
            .variables[variableId].value;
    },
    variableValue: (record, variableId) => {
        return Object.values(record.targetsInfo)
            .find(target => target.variables.hasOwnProperty(variableId))
            .variables[variableId].value;
    },
    sound: record => record.argValues.SOUND_MENU
};

export {
    generateId,
    forQuestionType,
    getTargetVariableValue,
    getVariableValue,
    costumeIndexForTargetAndName,
    getAllBlocks,
    Extract,
    ExtractTrace
};
