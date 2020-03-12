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

const isBackdropChangeStatement = statement =>
    statement.opcode === 'looks_switchbackdroptoandwait' ||
    statement.opcode === 'looks_nextbackdrop' ||
    statement.opcode === 'looks_switchbackdropto';

const isBackdropSetStatement = statement =>
    statement.opcode === 'looks_switchbackdroptoandwait' ||
    statement.opcode === 'looks_switchbackdropto';

const isCostumeChangeStatement = statement =>
    statement.opcode === 'looks_switchcostumeto' ||
    statement.opcode === 'looks_nextcostume';

const isCostumeSetStatement = statement =>
    statement.opcode === 'looks_switchcostumeto';

const isDirectionChangeStatement = statement =>
    statement.opcode === 'motion_pointindirection' ||
    statement.opcode === 'motion_pointtowards' ||
    statement.opcode === 'motion_pointtowards_menu';

const isDirectionSetStatement = statement =>
    statement.opcode === 'motion_pointindirection';

const isMoveChangeStatement = statement =>
    statement.opcode === 'motion_movesteps' ||
    statement.opcode.startsWith('motion_goto') ||
    statement.opcode.startsWith('motion_glide') ||
    statement.opcode.startsWith('motion_change') || // covers changex & changey
    statement.opcode.startsWith('motion_set'); // covers setx & sety

const isPositionSetStatement = statement =>
    statement.opcode === 'motion_gotoxy' ||
    statement.opcode === 'motion_glidesecstoxy';

const isSizeChangeStatement = statement =>
    statement.opcode === 'looks_changesizeby' ||
    statement.opcode === 'looks_setsizeto';

const isSizeSetStatement = statement =>
    statement.opcode === 'looks_setsizeto';

const isSoundStatement = statement =>
    statement.opcode === 'sound_play' ||
    statement.opcode === 'sound_playuntildone';

const isUpdateVariableStatement = statement =>
    statement.opcode === 'data_setvariableto' ||
    statement.opcode === 'data_changevariableby';

const isVisibilitySetStatement = statement =>
    statement.opcode === 'looks_show' ||
    statement.opcode === 'looks_hide';
const isXSetStatement = statement =>
    statement.opcode === 'motion_setx';

const isYSetStatement = statement =>
    statement.opcode === 'motion_sety';

export {
    generateId,
    forQuestionType,
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
};
