import React from 'react';

const example0 =
    <block type="bbt_testHat" breakpoint="false">
        <value name="testName">
            <shadow type="text" breakpoint="false">
                <field name="TEXT">Spielende</field>
            </shadow>
        </value>
        <next>
            <block type="bbt_triggerGreenFlag" breakpoint="false">
                <next>
                    <block type="control_wait" breakpoint="false">
                        <comment id="8|8X,-v,-X()XSSO{[kj" pinned="true" h="93.33332824707031" w="154.0740966796875"
                                 x="251" y="4.740740740740733" minimized="false">Spielinitialisierung abwarten.
                        </comment>
                        <value name="DURATION">
                            <shadow type="math_positive_number" breakpoint="false">
                                <field name="NUM">0.3</field>
                            </shadow>
                        </value>
                        <next>
                            <block type="bbt_placeMousePointer" breakpoint="false">
                                <value name="X">
                                    <shadow type="math_number" breakpoint="false">
                                        <field name="NUM">0</field>
                                    </shadow>
                                    <block type="operator_subtract" breakpoint="false">
                                        <value name="NUM1">
                                            <shadow type="math_number" breakpoint="false">
                                                <field name="NUM"></field>
                                            </shadow>
                                            <block type="motion_xposition" breakpoint="false"></block>
                                        </value>
                                        <value name="NUM2">
                                            <shadow type="math_number" breakpoint="false">
                                                <field name="NUM">100</field>
                                            </shadow>
                                        </value>
                                    </block>
                                </value>
                                <value name="Y">
                                    <shadow type="math_number" breakpoint="false">
                                        <field name="NUM">0</field>
                                    </shadow>
                                    <block type="operator_add" breakpoint="false">
                                        <value name="NUM1">
                                            <shadow type="math_number" breakpoint="false">
                                                <field name="NUM"></field>
                                            </shadow>
                                            <block type="motion_yposition" breakpoint="false"></block>
                                        </value>
                                        <value name="NUM2">
                                            <shadow type="math_number" breakpoint="false">
                                                <field name="NUM">100</field>
                                            </shadow>
                                        </value>
                                    </block>
                                </value>
                                <next>
                                    <block type="control_wait_until" breakpoint="false">
                                        <value name="CONDITION">
                                            <block type="sensing_touchingcolor" breakpoint="false">
                                                <value name="COLOR">
                                                    <shadow type="colour_picker" breakpoint="false">
                                                        <field name="COLOUR">#ff0000</field>
                                                    </shadow>
                                                </value>
                                            </block>
                                        </value>
                                        <next>
                                            <block type="control_wait" breakpoint="false">
                                                <comment id="wZRbNKp_~i-u)bo]NF_o" pinned="true" h="74.0740966796875"
                                                         w="214.8148193359375" x="358" y="214.5185185185185"
                                                         minimized="false">Sprechblase abwarten.
                                                </comment>
                                                <value name="DURATION">
                                                    <shadow type="math_positive_number" breakpoint="false">
                                                        <field name="NUM">0.1</field>
                                                    </shadow>
                                                </value>
                                                <next>
                                                    <block type="bbt_assertEquals" breakpoint="false">
                                                        <value name="A">
                                                            <shadow type="text" breakpoint="false">
                                                                <field name="TEXT">ABC</field>
                                                            </shadow>
                                                            <block type="operator_letter_of" breakpoint="false">
                                                                <value name="LETTER">
                                                                    <shadow type="math_whole_number" breakpoint="false">
                                                                        <field name="NUM">1</field>
                                                                    </shadow>
                                                                </value>
                                                                <value name="STRING">
                                                                    <shadow type="text" breakpoint="false">
                                                                        <field name="TEXT">Apfel</field>
                                                                    </shadow>
                                                                    <block type="bbt_attributeOf" breakpoint="false">
                                                                        <field name="ATTRIBUTE">saying text</field>
                                                                        <field name="SPRITE">_myself_</field>
                                                                    </block>
                                                                </value>
                                                            </block>
                                                        </value>
                                                        <value name="B">
                                                            <shadow type="text" breakpoint="false">
                                                                <field name="TEXT">S</field>
                                                            </shadow>
                                                        </value>
                                                        <next>
                                                            <block type="control_wait" breakpoint="false">
                                                                <comment id=":ZsSE9DAy@6[Ibt:Re-D" pinned="true"
                                                                         h="94.81475830078125" w="139.2591552734375"
                                                                         x="396" y="368.8888888888889"
                                                                         minimized="false">Ende-Animation abwarten.
                                                                </comment>
                                                                <value name="DURATION">
                                                                    <shadow type="math_positive_number"
                                                                            breakpoint="false">
                                                                        <field name="NUM">1</field>
                                                                    </shadow>
                                                                </value>
                                                                <next>
                                                                    <block type="bbt_assertEquals" breakpoint="false">
                                                                        <comment id="(!g#9MgjevXc$9C+nS8u" pinned="true"
                                                                                 h="74.0740966796875"
                                                                                 w="285.9259033203125" x="257"
                                                                                 y="499.85185185185185"
                                                                                 minimized="false">Wurden alle
                                                                            Spielskripte gestoppt?
                                                                        </comment>
                                                                        <value name="A">
                                                                            <shadow type="text" breakpoint="false">
                                                                                <field name="TEXT">ABC</field>
                                                                            </shadow>
                                                                            <block type="bbt_getNumberOfRunningScripts"
                                                                                   breakpoint="false"></block>
                                                                        </value>
                                                                        <value name="B">
                                                                            <shadow type="text" breakpoint="false">
                                                                                <field name="TEXT">0</field>
                                                                            </shadow>
                                                                        </value>
                                                                        <next>
                                                                            <block type="bbt_testEnd"
                                                                                   breakpoint="false"></block>
                                                                        </next>
                                                                    </block>
                                                                </next>
                                                            </block>
                                                        </next>
                                                    </block>
                                                </next>
                                            </block>
                                        </next>
                                    </block>
                                </next>
                            </block>
                        </next>
                    </block>
                </next>
            </block>
        </next>
    </block>;


const example1 =
    <block type="bbt_testHat" breakpoint="false">
        <value name="testName">
            <shadow type="text" breakpoint="false">
                <field name="TEXT">Test move right</field>
            </shadow>
        </value>
        <next>
            <block type="data_setvariableto" breakpoint="false">
                <field name="VARIABLE" id="jOOCzZ4cqrT.naEXg5A6" variabletype="">x_position_before</field>
                <value name="VALUE">
                    <shadow type="text" breakpoint="undefined">
                        <field name="TEXT">0</field>
                    </shadow>
                    <block type="motion_xposition" breakpoint="false"></block>
                </value>
                <next>
                    <block type="bbt_pressKeyAndHold" breakpoint="false">
                        <field name="KEY">right arrow</field>
                        <value name="DURATION">
                            <shadow type="math_number" breakpoint="false">
                                <field name="NUM">3</field>
                            </shadow>
                        </value>
                        <next>
                            <block type="bbt_waitUntilOtherScriptsAreDone" breakpoint="false">
                                <next>
                                    <block type="bbt_assertNumberCompare" breakpoint="false">
                                        <field name="COMPARATOR">GREATER</field>
                                        <value name="A">
                                            <shadow type="math_number" breakpoint="undefined">
                                                <field name="NUM">1</field>
                                            </shadow>
                                            <block type="motion_xposition" breakpoint="false"></block>
                                        </value>
                                        <value name="B">
                                            <shadow type="math_number" breakpoint="undefined">
                                                <field name="NUM">2</field>
                                            </shadow>
                                            <block type="data_variable" breakpoint="false">
                                                <field name="VARIABLE" id="jOOCzZ4cqrT.naEXg5A6"
                                                       variabletype="">x_position_before
                                                </field>
                                            </block>
                                        </value>
                                        <next>
                                            <block type="bbt_testEnd" breakpoint="false"></block>
                                        </next>
                                    </block>
                                </next>
                            </block>
                        </next>
                    </block>
                </next>
            </block>
        </next>
    </block>;


const didCloneMoveExample =
    <block type="bbt_testHat" breakpoint="false">
        <value name="testName">
            <shadow type="text" breakpoint="false">
                <field name="TEXT">Did clone move</field>
            </shadow>
        </value>
        <next>
            <block type="bbt_triggerGreenFlag" breakpoint="false">
                <next>
                    <block type="control_wait" breakpoint="false">
                        <value name="DURATION">
                            <shadow type="math_positive_number" breakpoint="false">
                                <field name="NUM">1</field>
                            </shadow>
                        </value>
                        <next>
                            <block type="bbt_assertEquals" breakpoint="false">
                                <comment id="XYMx?43pRsd:=5a3Vmh." pinned="true" h="111" w="192" x="855" y="243"
                                         minimized="false">Does a clone of this sprite exist?
                                </comment>
                                <value name="A">
                                    <shadow type="text" breakpoint="undefined">
                                        <field name="TEXT">ABC</field>
                                    </shadow>
                                    <block type="bbt_attributeOf" breakpoint="false">
                                        <field name="ATTRIBUTE">number of clones</field>
                                        <field name="SPRITE">_myself_</field>
                                    </block>
                                </value>
                                <value name="B">
                                    <shadow type="text" breakpoint="false">
                                        <field name="TEXT">1</field>
                                    </shadow>
                                </value>
                                <next>
                                    <block type="bbt_assertNumberCompare" breakpoint="false">
                                        <field name="COMPARATOR">GREATER</field>
                                        <value name="A">
                                            <shadow type="math_number" breakpoint="undefined">
                                                <field name="NUM">1</field>
                                            </shadow>
                                            <block type="bbt_cloneDistanceBetween" breakpoint="false">
                                                <field name="A">_myself_</field>
                                                <field name="B">_myself_</field>
                                                <comment id="GoTnf4cW}ppyB.M5j!2z" pinned="true" h="137" w="200"
                                                         x="1065" y="244" minimized="false">Is there a distance between
                                                    this sprite and the first clone of this sprite?
                                                </comment>
                                                <value name="CLONE_A">
                                                    <shadow type="math_number" breakpoint="false">
                                                        <field name="NUM"></field>
                                                    </shadow>
                                                </value>
                                                <value name="CLONE_B">
                                                    <shadow type="math_number" breakpoint="false">
                                                        <field name="NUM">1</field>
                                                    </shadow>
                                                </value>
                                            </block>
                                        </value>
                                        <value name="B">
                                            <shadow type="math_number" breakpoint="false">
                                                <field name="NUM">0</field>
                                            </shadow>
                                        </value>
                                        <next>
                                            <block type="bbt_testEnd" breakpoint="false"></block>
                                        </next>
                                    </block>
                                </next>
                            </block>
                        </next>
                    </block>
                </next>
            </block>
        </next>
    </block>;

export default [example0, example1, didCloneMoveExample];
