export default {
    helpText:
        'Also, here is a list of the specific codes for the Scratch blocks\n' +
        'go to [RANDOM_POSITION v]\n' +
        '\n' +
        'set [VARIABLE_NAME v] to ()\n' +
        'change [VARIABLE_NAME v] by ()\n' +
        'stop [ALL v]\n' +
        '\n' +
        'touching [FIGUR v] ?\n' +
        '\n' +
        'point in direction ()\n' +
        'turn cw () degrees\n' +
        'turn ccw () degrees\n' +
        'move () steps\n' +
        'point towards (TARGET_FIGURE v)\n' +
        'switch costume to (COSTUME_NAME v)\n' +
        '\n' +
        'touching color [#ffffff] ?\n' +
        '\n' +
        'when flag clicked\n' +
        'go to x: () y: ()\n' +
        'change x by ()\n' +
        'change y by ()\n' +
        'set x to ()\n' +
        'set y to ()\n' +
        'say ()\n' +
        'wait until <>\n' +
        'repeat () \n' +
        '  . . .\n' +
        'end\n' +
        '\n' +
        'forever \n' +
        '  . . .\n' +
        'end\n' +
        '\n' +
        'if <> then \n' +
        '  . . .\n' +
        'end' +
        '\n\n' +
        'If a required block is not included in this list, use the corresponding code you know.\n' +
        'If the parameter of a block gets set by a dropDown, the parameter is marked with a "v" at the end. Example: "point towards (TARGET_FIGURE v)" means, that the rotationTarget can be selected via dropdown menu.\n' +

        'IMPORTANT FORMAT RULES:\n' +
        '- String literals (plain text) must ALWAYS be enclosed in double quotes. Example: say ("Hallo").\n' +
        '- If text is not enclosed in double quotes, it is interpreted as a variable.\n' +
        '- Variables and numeric values must NOT be enclosed in double quotes. Example: say (Punkte), set x to (10).\n' +
        '- All dropdown parameters MUST explicitly include the marker "v". Missing "v" is invalid.\n' +

        'IMPORTANT FORMAT RULES (TEXT vs. DROPDOWN):\n' +
        '- String literals (plain text) must ALWAYS be enclosed in double quotes ONLY for text-input blocks (e.g. say, think, ask).\n' +
        '- Dropdown parameters (marked with "v") must NEVER be enclosed in double quotes, even if they look like words.\n' +
        '- Example (text input): say ("Hallo")\n' +
        '- Example (dropdown): switch costume to (normal v)   // NOT ("normal")\n' +

        'IMPORTANT COLOR FORMAT RULES:\n' +
        '- Color inputs must ALWAYS be a 6-digit hex color in the exact form [#RRGGBB] (7 characters including #).\n' +
        '- Do NOT use 3-digit hex (e.g. #fff), color names (e.g. "white"), or RGB formats (e.g. (255,255,255)).\n' +
        '- Example (valid): touching color [#FFFFFF] ?\n' +
        '- Example (invalid): touching color [#fff] ?, touching color (white) ?, touching color (#FFFFFF) ?\n' +

        'Control-Blocks like Loops have unique Code. They consist of 3 parts, each has to be in its own line: header "forever"; ...Multiple CodeBlocks; End "end";\n' +
        'Executable scripts must start with a hat block (e.g. \'when flag clicked\').\n' +

        'Before finalizing Scratch code output, validate:\n' +
        '1) Every text value is enclosed in double quotes.\n' +
        '2) Every dropdown parameter includes the marker "v".\n' +
        '3) No placeholder tokens (e.g. FIGUR, VARIABLE_NAME) remain in the final code.\n' +
        '4) Every color parameter uses exactly [#RRGGBB] (6 hex digits).\n' +

        'Additionally, consider the following language-specific rules for German:\n' +
        '- Loops have to be called "Wiederholungen" instead of "Schleifen".\n' +
        '- Conditions are called "Falls-Bedingung", not "Wenn-Bedingung".'
};
