import React from 'react';

const Explanation = ({ questionType }) => {
    return (explanationContent[questionType]);
};

const explanationContent= {
    SINGLE_CHOICE: (
        <p>
            Die aktuelle Frage ist <strong>Single-Choice</strong>. Das heißt, du kannst genau eine Antwort auswählen,
            indem du auf den kleinen Knopf unter einem der Bilder klickst.
        </p>
    ),
    MULTIPLE_CHOICE: (
        <p>
            Die aktuelle Frage ist <strong>Multiple-Choice</strong>. Das heißt, du kannst mehrere Antworten auswählen,
            indem du auf die kleinen Knöpfe unter den Bildern klickst.
        </p>
    ),
    GAP_TEXT: (
        <p>
            Erklärung für <strong>Gap-Text</strong> Fragen.
        </p>
    ),
    MARK: (
        <p>
            Erklärung für <strong>Mark</strong>-Fragen.
        </p>
    ),
    MARK_CHOICE: (
        <p>
            Erklärung für <strong>Mark</strong>-Fragen.
        </p>
    ),
    DROPDOWN: (
        <p>
            Diese Frage ist ein <strong>Dropdown</strong>. Klicke auf den kleinen Pfeil am rechten Rand des grauen
            Elements und wähle eine der möglichen Optionen aus.
        </p>
    ),
    MESSAGE: (
        <p>
            Hierbei handelt es sich um eine <strong>Message</strong>, ohne jegliche Interaktionsmöglichkeit. Wenn du bereit bist,
            klicke einfach unten rechts auf den "weiter"-Pfeil.
        </p>
    ),
};

export default Explanation;
