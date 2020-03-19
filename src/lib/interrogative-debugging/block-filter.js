const MotionFilter = {
    directionChange: statement =>
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
        statement.opcode === 'motion_sety'

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
        statement.opcode === 'looks_hide'

};

const SoundFilter = {
    play: statement =>
        statement.opcode === 'sound_play' ||
        statement.opcode === 'sound_playuntildone'
};

const EventFilter = {
    greenFlag: statement =>
        statement.opcode === 'event_whenflagclicked',

    hatEvent: statement =>
        statement.opcode === 'event_whenthisspriteclicked' ||
        statement.opcode === 'event_whenstageclicked' ||
        statement.opcode === 'event_whenbackdropswitchesto' ||
        statement.opcode === 'event_whengreaterthan' ||
        statement.opcode === 'event_whenkeypressed',

    broadcastSend: statement =>
        statement.opcode === 'event_broadcast' ||
        statement.opcode === 'event_broadcastandwait',

    broadcastReceive: statement =>
        statement.opcode === 'event_whenbroadcastreceived' ||
        statement.opcode === 'event_broadcastandwait'
};

const VariableFilter = {
    set: statement =>
        statement.opcode === 'data_setvariableto',
    update: statement =>
        statement.opcode === 'data_setvariableto' ||
        statement.opcode === 'data_changevariableby'

};

export {
    MotionFilter,
    LooksFilter,
    SoundFilter,
    EventFilter,
    VariableFilter
};
