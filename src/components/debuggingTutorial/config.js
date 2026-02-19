export const tutorialConfig = {
    selection: {
        enableTutorialSelectionHelp: true, //Ob in der Tutorial-Auswahl (sowohl klassische als auch debug-tutorials) eine kurze Erklärung zu den beiden Tutorial Arten angezeigt wird.
    },
    classic: {
        hintSystemEnabled: true, //Ob bei nicht bestandenen Tests die Hilfestellung geöffnet werden kann.
        llmHintsEnabled: true, //Ob in der Hilfestellung LLM-Hints angezeigt werden.
    },
    debugging: {
        enableResetButton: true, //Ob die Möglichkeit besteht, dass der Nutzer im debug-tutorial seinen Code auf Schrittanfang zurücksetzen kann.
        enableTodoButton: true, //Ob im debug-tutorial eine Erklärung angezeigt wird, wie das Tutorial-System aufgebaut ist und bedient wird.
    },
};
