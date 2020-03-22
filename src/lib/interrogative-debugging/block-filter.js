const MotionFilter = {
    directionChange: statement =>
        statement.opcode === 'motion_turnright' ||
        statement.opcode === 'motion_turnleft' ||
        statement.opcode === 'motion_pointindirection' ||
        statement.opcode === 'motion_pointtowards' ||
        statement.opcode === 'motion_pointtowards_menu',

    directionSet: statement =>
        statement.opcode === 'motion_pointindirection',

    positionChange: statement =>
        statement.opcode === 'motion_movesteps' ||
        statement.opcode.startsWith('motion_goto') ||
        statement.opcode.startsWith('motion_glide') ||
        statement.opcode.startsWith('motion_change') || // covers changex & changey
        statement.opcode.startsWith('motion_set'), // covers setx & sety

    positionSet: statement =>
        statement.opcode === 'motion_gotoxy' ||
        statement.opcode === 'motion_glidesecstoxy',

    xSet: statement =>
        statement.opcode === 'motion_setx',

    ySet: statement =>
        statement.opcode === 'motion_sety',

    motionStatement: block =>
        block.opcode.startsWith('motion_') && !(
            block.opcode === 'motion_xposition' ||
            block.opcode === 'motion_yposition' ||
            block.opcode === 'motion_direction'
        )
};
const LooksFilter = {
    backdropChange: statement =>
        statement.opcode === 'looks_switchbackdroptoandwait' ||
        statement.opcode === 'looks_nextbackdrop' ||
        statement.opcode === 'looks_switchbackdropto',

    backdropSet: statement =>
        statement.opcode === 'looks_switchbackdroptoandwait' ||
        statement.opcode === 'looks_switchbackdropto',

    costumeChange: statement =>
        statement.opcode === 'looks_switchcostumeto' ||
        statement.opcode === 'looks_nextcostume',

    costumeSet: statement =>
        statement.opcode === 'looks_switchcostumeto',

    sizeChange: statement =>
        statement.opcode === 'looks_changesizeby' ||
        statement.opcode === 'looks_setsizeto',

    sizeSet: statement =>
        statement.opcode === 'looks_setsizeto',

    visibilitySet: statement =>
        statement.opcode === 'looks_show' ||
        statement.opcode === 'looks_hide',

    looksStatement: block =>
        block.opcode.startsWith('looks_') && !(
            block.opcode === 'looks_backdropnumbername' ||
            block.opcode === 'looks_costumenumbername' ||
            block.opcode === 'looks_size'
        )
};

const SoundFilter = {
    play: statement =>
        statement.opcode === 'sound_play' ||
        statement.opcode === 'sound_playuntildone',

    soundStatement: block =>
        block.opcode.startsWith('sound_') && !(
            block.opcode === 'sound_volume'
        )
};

const EventFilter = {
    greenFlag: statement =>
        statement.opcode === 'event_whenflagclicked',

    hatEvent: statement =>
        statement.opcode === 'event_whenflagclicked' ||
        statement.opcode === 'event_whenthisspriteclicked' ||
        statement.opcode === 'event_whenstageclicked' ||
        statement.opcode === 'event_whenbackdropswitchesto' ||
        statement.opcode === 'event_whengreaterthan' ||
        statement.opcode === 'event_whenkeypressed',

    broadcastSend: statement =>
        statement.opcode === 'event_broadcast' ||
        statement.opcode === 'event_broadcastandwait',

    broadcastReceive: statement =>
        statement.opcode === 'event_whenbroadcastreceived',

    eventStatement: block =>
        block.opcode.startsWith('event_') &&
        block.opcode !== 'event_touchingobjectmenu'
};

const ControlFilter = {
    controlStatement: block =>
        block.opcode.startsWith('control_')
};

const SensingFilter = {
    sensingStatement: block =>
        block.opcode === 'sensing_askandwait' ||
        block.opcode === 'sensing_setdragmode' ||
        block.opcode === 'sensing_resettimer'
};

const VariableFilter = {
    set: statement =>
        statement.opcode === 'data_setvariableto',
    update: statement =>
        statement.opcode === 'data_setvariableto' ||
        statement.opcode === 'data_changevariableby',
    variableStatement: block =>
        block.opcode === 'data_setvariableto' ||
        block.opcode === 'data_changevariableby' ||
        block.opcode === 'data_showvariable' ||
        block.opcode === 'data_hidevariable'

};

const StatementFilter = {
    isStatementBlock: block => {
        if (block.topLevel) {
            return true;
        }
        if (block.opcode.endsWith('_menu')) {
            return false;
        }
        const result = MotionFilter.motionStatement(block) ||
            LooksFilter.looksStatement(block) ||
            SoundFilter.soundStatement(block) ||
            EventFilter.eventStatement(block) ||
            ControlFilter.controlStatement(block) ||
            SensingFilter.sensingStatement(block) ||
            VariableFilter.variableStatement(block);
        return result;
    }
};

export {
    ControlFilter,
    MotionFilter,
    LooksFilter,
    SoundFilter,
    EventFilter,
    VariableFilter,
    StatementFilter
};
