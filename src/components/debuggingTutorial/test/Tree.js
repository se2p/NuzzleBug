export default {
    //Header
    projectCode: "asdad",

    //TUTORIAL Texts
    difficulty: "hard!",
    title: "Tutorial1!",




    //Steps
    step121: {
        text: "STEP1 Durch welche Blockkategorie wird der Fehler sichtbar?",
        questionType: "SINGLE",
        option1: {visible: false, label: "null", next: "step2", img: "Bewegung"},
        option2: {visible: false, label: "a", next: "wrongAnswer", img: "Aussehen"},
        option3: {visible: false, label: "b", next: "wrongAnswer", img: "Klang"},
        option4: {visible: false, label: "c", next: "wrongAnswer", img: "Variablen"},
        option5: {visible: false, label: "d", next: "wrongAnswer", img: "Klone"},
        correctionText: "Bist du dir wirklich sicher?",
        help: "Das Problem ist, dass das Raumschiff nicht nach links und rechts fliegt. Somit ist die BEWEGUNG falsch.",
        before: "step1",
    },

    step2s: {
        text: "STEP 2 Durch welche Blockkategorie wird der Fehler sichtbar?",
        questionType: "SINGLE",
        option1: {visible: false, label: "null", next: "step3", img: "Bewegung"},
        option2: {visible: false, label: "a", next: "wrongAnswer", img: "Aussehen"},
        option3: {visible: false, label: "b", next: "wrongAnswer", img: "Klang"},
        option4: {visible: false, label: "c", next: "wrongAnswer", img: "Variablen"},
        option5: {visible: false, label: "d", next: "wrongAnswer", img: "Klone"},
        correctionText: "Bist du dir wirklich sicher?",
        help: "Das Problem ist, dass das Raumschiff nicht nach links und rechts fliegt. Somit ist die BEWEGUNG falsch.",
        before: "step1",
    },

    step3: {
        text: "STEP3 Durch welche Blockkategorie wird der Fehler sichtbar?",
        questionType: "SINGLE",
        option1: {visible: false, label: "null", next: "step1", img: "Bewegung"},
        option2: {visible: false, label: "a", next: "wrongAnswer", img: "Aussehen"},
        option3: {visible: false, label: "b", next: "wrongAnswer", img: "Klang"},
        option4: {visible: false, label: "c", next: "wrongAnswer", img: "Variablen"},
        option5: {visible: false, label: "d", next: "wrongAnswer", img: "Klone"},
        correctionText: "Bist du dir wirklich sicher?",
        help: "Das Problem ist, dass das Raumschiff nicht nach links und rechts fliegt. Somit ist die BEWEGUNG falsch.",
        before: "step1",
    },
















    step2: {
        text: "Überlege nun, welche Figuren du genauer betrachten solltest:",
        questionType: "MULTIPLE", //MULTIPLE
        option1: {index:0, label: "null", img: "Figur_Katze", width: "50"},
        option2: {index:1,label: "a", img: "Figur_Fledermaus", width: "50"},
        option3: {index:2,label: "b", img: "Figur_Fischmonster", width: "50"},
        solution: [true, false, true, false, false, false],
        next: "step1",
        correctionText: "Bist du dir wirklich sicher?",
        help: null,
        before: "step1"
    },

    step3s: {
        text: "Markiere nun sämtliche mögliche symptomatische Blöcke:",
        questionType: "MARK",
        content: "",
        image: "Anleitung",

        required: {id: "1232123", next:"step_3"},
        allowed1: {id: "1232123", next:"step_3_1"},
        allowed2: {id: "1232123", next:"step_3_1"},
        allowed3: {id: "1232123", next:"step_3_1"},

        help: "Mit rechtsklick auf einen Block kannst du diesen markieren bzw demarkieren.",
        before: "step2"
    },

    step4s: {
        text: "Welchen Block willst du nun genauer untersuchen?",
        questionType: "SINGLE",
        option1: {visible: true, label: "Ändere y um -10", next: "step5_1", img: null},
        option2: {visible: true, label: "Gehe zu x y", next: "step5_2", img: null},
        correctionText: "Bist du dir wirklich sicher?",
        help: null,
        before: "step3"
    },

    step5_1: {
        text: "Welcher Fehlertyp liegt für ÄNDERE Y vor?",
        questionType: "SINGLE",
        option1: {visible: true, label: "wird nicht oft genug ausgeführt", next: "step5_1_1", img: null},
        option2: {visible: true, label: "wird zu oft ausgeführt", next: "step5_1_2", img: null},
        option3: {visible: true, label: "wird mit einem falschen Wert ausgeführt", next: "step5_1_3", img: null},
        correctionText: null,
        help: null,
        before: "step4"
    },

    step5_2: {
        text: "Welcher Fehlertyp liegt für GEHE ZU X Y vor?",
        questionType: "SINGLE",
        option1: {visible: true, label: "wird nicht oft genug ausgeführt", next: "step2", img: null},
        option2: {visible: true, label: "wird zu oft ausgeführt", next: "wrongAnswer", img: null},
        option3: {visible: true, label: "wird mit einem falschen Wert ausgeführt", next: "wrongAnswer", img: null},
        correctionText: null,
        help: null,
        before: "step4"
    },

    step1: {
        text: "Überprüfe deine Vermutung mit dem Debugger.",
        questionType: "TEXT",
        content: "Wie oft sollte der Block ausgeführt werden? Wie oft wurde er ausgeführt?",
        question: "War deine Vermutung richtig?",
        correct: "step6",
        incorrect: "wrongAnswer",
        correctionText: "Es wäre eigentlich correct!",

        help: null
    },

    step5_1_2: {
        text: "Überprüfe deine Vermutung mit dem Debugger.",
        questionType: "TEXT",
        content: "Wie oft sollte der Block ausgeführt werden? Wie oft wurde er ausgeführt?",
        question: "War deine Vermutung richtig?",
        correct: "wrongAnswer",
        incorrect: "step5_1",
        correctionText: "Es wäre eigentlich correct!",

        help: null,
        before: "step5_1"
    },

    step5_1_3: {
        text: "Überprüfe deine Vermutung mit dem Debugger.",
        questionType: "TEXT",
        content: "Mit welchen Werten wurde der Block ausgeführt? Sind diese falsch?",
        question: "War deine Vermutung richtig?",
        correct: "wrongAnswer",
        incorrect: "step5_1",
        correctionText: "Es wäre eigentlich correct!",

        help: null,
        before: "step5_1"
    },

    step6: {
        text: "Wieso wird der Block nicht häufig genug ausgeführt??",
        questionType: "SINGLE",
        option1: {visible: false, label: "Schleife wird nicht oft genug durchlaufen", next: "step2", img: "Bewegung"},
        option2: {visible: false, label: "Skript wird nicht gestartet", next: "wrongAnswer", img: "Aussehen"},
        correctionText: "Bist du dir wirklich sicher?",
        help: "Das Problem ist, dass das Raumschiff nicht nach links und rechts fliegt. Somit ist die BEWEGUNG falsch.",
        before: "step5_1_1"
    },








    SINGLE_CHOICE_BILDER: {
        header: "Durch welche Blockkategorie wird der Fehler sichtbar?",
        questionType: "SINGLE",
        option1: {label: "a", next: "step2", img: "Bewegung", width: 150},
        option2: {label: "b", next: "wrongAnswer", img: "Aussehen", width: 150},
        option3: {label: "c", next: "wrongAnswer", img: "Klang", width: 150},
        option4: {label: "d", next: "wrongAnswer", img: "Variablen", width: 150},
        option5: {label: "e", next: "wrongAnswer", img: "Klone", width: 150},
        correctionText: "Bist du dir wirklich sicher?",
        help: "Das Problem ist, dass das Raumschiff nicht nach links und rechts fliegt. Somit ist die BEWEGUNG falsch."
    },

    SINGLE_CHOICE_TEXT: {
        header: "Durch welche Blockkategorie wird der Fehler sichtbar?",
        questionType: "SINGLE",
        option1: {label: "a", next: "step2"},
        option2: {label: "b", next: "wrongAnswer"},
        option3: {label: "c", next: "wrongAnswer"},
        option4: {label: "d", next: "wrongAnswer"},
        option5: {label: "e", next: "wrongAnswer"},
        correctionText: "Bist du dir wirklich sicher?",
        help: "Das Problem ist, dass das Raumschiff nicht nach links und rechts fliegt. Somit ist die BEWEGUNG falsch."
    },

    TEXT_MIT_QUIZ: {
        header: "Ich bin die Überschrift für Step2_2",
        questionType: "TEXT",

        content: "Wie oft sollte die Schleife wiederholt werden? Wie oft wurde sie wiederholt?",
        question: "War deine Vermutung richtig?",
        questionTrue: "step1",
        questionFalse: "wrongAnswer",

        correctionText: "Es wäre eigentlich correct!",
        help: null,
    },

    MARKIEREN: {
        header: "Ich bin die Überschrift für Step2_2",
        questionType: "MARK",

        question: "Wie oft sollte die Schleife wiederholt werden? Wie oft wurde sie wiederholt?",
        image: "Anleitung",

        required: {id: "1232123", next:"step_3"},
        allowed1: {id: "1232123", next:"step_3_1"},
        allowed2: {id: "1232123", next:"step_3_1"},
        allowed3: {id: "1232123", next:"step_3_1"},

        help: null
    },


    MULTIPLE_CHOICE: {
        header: "Überlege nun, welche Figuren du genauer betrachten solltest:",
        questionType: "MULTIPLE",

        option1: {index:0, label: "null", img: "Figur_Katze", width: "50", isCorrect: true},
        option2: {index:1,label: "a", img: "Figur_Fledermaus", width: "50", isCorrect: false},
        option3: {index:2,label: "b", img: "Figur_Fischmonster", width: "50", isCorrect: true},

        next: "step1",
        correctionText: "Bist du dir wirklich sicher?",
        help: "Hier ist sowieso nur eine Figur involviert."
    },



}
