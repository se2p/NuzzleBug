class HintGenerator {

    /**
     * @param projectJson Das aktuelle Projekt des Schülers
     * @param failedBehaviour Die LLM-Beschreibung des nicht bestandenen, behaviour-driven Test, auf den sich der Hinweis bezieht.
     * @param passedBehaviours Die LLM-Beschreibungen aller bereits bestandenen behaviour-driven Test.
     * @param locale Das akutelle locale. Bisher nur de und en.
     * @param fastMode Reserviert für zukünftige Backend-seitige Geschwindigkeitswahl (wird momentan ignoriert).
     * @param onPartialUpdate Diese Methode wird aufgerufen, um partielle Updates an die UI zu übertragen.
     * @returns {Promise<{problemText: string, solutionOptions: [{code: string, id: string, explanation: string, isCorrect: boolean},{code: string, id: string, explanation: string, isCorrect: boolean},{code: string, id: string, explanation: string, isCorrect: boolean}]}>}
     */
    static generateHint (projectJson, failedBehaviour, passedBehaviours, locale, fastMode, onPartialUpdate) {
        return this.convertScratchJsonToScratchblocks(JSON.parse(projectJson))
            .then(scratchBlocks =>
                this.sendScratchblocksToLLM(scratchBlocks, failedBehaviour, passedBehaviours, locale, partial => onPartialUpdate(partial))
            )
            .catch(error => {
                console.error('Failed to get GPT hints:', error);
                return {
                    problemText: 'Achtung: Ich konnte gerade keinen Hinweis erzeugen.',
                    solutionOptions: [
                        {id: 'A', code: '', isCorrect: true, explanation: ''},
                        {id: 'B', code: '', isCorrect: false, explanation: ''},
                        {id: 'C', code: '', isCorrect: false, explanation: ''}
                    ]
                };
            });
    }

    static async sendScratchblocksToLLM (scratchBlocks, failedBehaviour, passedBehaviours, locale, onPartialUpdate) {

        // LitterBox-Web leitet den Request an den serverseitig konfigurierten LLM-Anbieter weiter
        // (z.B. OpenAI Responses API oder InnKube Chat Completions).
        // Das Frontend sendet nur den Inhalt – welcher Anbieter genutzt wird, entscheidet der Server.
        const apiUrl = `${process.env.LITTERBOX_BASE_URL}/llm/raw`;

        const systemPrompt = `You are an assistant for a Scratch debugging learning system (students ~12).
            STRICT OUTPUT:
            - Output ONLY NDJSON. Exactly 5 lines:
              1) {"type":"problemText","value":<string>}
              2) {"type":"solutionOption","id":"A","code":<string>,"isCorrect":true,"explanation":<string>}
              3) {"type":"solutionOption","id":"B","code":<string>,"isCorrect":false,"explanation":<string>}
              4) {"type":"solutionOption","id":"C","code":<string>,"isCorrect":false,"explanation":<string>}
              5) {"type":"done"}
            - Valid JSON per line. No unescaped newlines (use \\n).

            TASK:
            - problemText starts with "Problem:" and describes only the visible wrong behaviour (no hints, no tests, no block names).
            - Generate 3 candidates: exactly ONE fixes the behaviour, TWO are plausible beginner mistakes.
            - Do not break passed behaviours.

            PATCH/SNIPPET MODE (MOST IMPORTANT):
            - Output ONLY the minimal relevant block snippet (not a full script).
            - Do NOT include setup/movement blocks unless they contain the bug or are needed for the fix to make sense.
            - Do NOT add a hat block unless the change is at the very start of a script.
            - Keep as close as possible to the student's code (same structure/names/values).
            - Prefer the fix with the fewest edits.
            - Max 6 lines per option. No comments or "Sprite:" markers.

            CRITICAL SCRATCH SYNTAX (MUST FOLLOW):
            - ALL dropdown values MUST be written as [value v]
            - NEVER write dropdowns as plain text
            - ALL strings MUST be in double quotes
            - NEVER output unquoted text inside ()
            - For touching color [#RRGGBB] ? never add v inside the color brackets, since colors are never dropdowns.
            Examples:
            say ("Hallo")
            switch costume to [normal v]
            stop [all v]

            IMPORTANT FOR STUDENT TEXT:
            - Do NOT mention hex codes, RGB values, or color numbers in explanations.
            - Refer to colors only by simple, descriptive, student-friendly names.

            LANGUAGE:
            - Explanations in LOCALE language.
            - Code in English Scratchblocks text.
            - German wording: "Wiederholungen", "Falls-Bedingung".
            - Explanations: max 2 short sentences, only visible effect.`;

        const userPrompt =
            `LOCALE: ${locale}
            STUDENT CODE: ${scratchBlocks}
            FAILED BEHAVIOUR: ${failedBehaviour}
            PASSED BEHAVIOURS (do not break): ${(passedBehaviours && passedBehaviours.trim().length > 0) ? passedBehaviours : 'none'}`;


        const res = await fetch(apiUrl, {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream'
            },
            body: JSON.stringify({systemPrompt, userPrompt})
        });

        if (!res.ok || !res.body) {
            throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        // Live-State (wird inkrementell befüllt)
        const state = {
            problemText: '',
            solutionOptions: [
                {id: 'A', code: '', isCorrect: true, explanation: ''},
                {id: 'B', code: '', isCorrect: false, explanation: ''},
                {id: 'C', code: '', isCorrect: false, explanation: ''}
            ]
        };

        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');

        let sseBuffer = ''; // Buffer für SSE-Rahmen
        let textBuffer = ''; // Buffer für zusammengebauten NDJSON-Text

        const applyNdjsonLine = lineObj => {
            if (lineObj.type === 'problemText') {
                state.problemText = String(lineObj.value ?? '');
                onPartialUpdate(structuredClone(state));
                return;
            }

            if (lineObj.type === 'solutionOption') {
                const idx = ['A', 'B', 'C'].indexOf(lineObj.id);
                if (idx >= 0) {
                    state.solutionOptions[idx] = {
                        id: lineObj.id,
                        code: String(lineObj.code ?? ''),
                        isCorrect: Boolean(lineObj.isCorrect),
                        explanation: String(lineObj.explanation ?? '')
                    };
                    onPartialUpdate(structuredClone(state));
                }
                return;
            }

            if (lineObj.type === 'done') {
                // optional: final callback
                onPartialUpdate(structuredClone(state));
            }
        };

        const handleDelta = delta => {
            textBuffer += delta;

            // NDJSON: jede Zeile endet mit \n
            let newlineIndex;
            while ((newlineIndex = textBuffer.indexOf('\n')) >= 0) {
                const line = textBuffer.slice(0, newlineIndex).trim();
                textBuffer = textBuffer.slice(newlineIndex + 1);

                if (!line) continue;

                try {
                    const obj = JSON.parse(line);
                    applyNdjsonLine(obj);
                } catch (e) {
                    // Wenn die Zeile noch nicht vollständig war, wieder zurück in Buffer:
                    // (sollte bei korrektem NDJSON selten vorkommen)
                    textBuffer = `${line}\n${textBuffer}`;
                    break;
                }
            }
        };

        // SSE lesen: Events sind durch \n\n getrennt, payload steht in data:
        while (true) {
            const {value, done} = await reader.read();
            if (done) break;

            sseBuffer += decoder.decode(value, {stream: true});

            let eventBoundary;
            while ((eventBoundary = sseBuffer.indexOf('\n\n')) !== -1) {
                const rawEvent = sseBuffer.slice(0, eventBoundary);
                sseBuffer = sseBuffer.slice(eventBoundary + 2);

                const lines = rawEvent.split('\n');
                for (const l of lines) {
                    if (!l.startsWith('data:')) continue;

                    const dataStr = l.slice(5).trim();
                    if (!dataStr || dataStr === '[DONE]') continue;

                    let evt;
                    try {
                        evt = JSON.parse(dataStr);
                    } catch {
                        continue;
                    }

                    // Unterstützt mehrere SSE-Formate: OpenAI Responses API und Chat Completions (InnKube)
                    const delta =
                        evt?.choices?.[0]?.delta?.content ||  // Chat Completions
                        (typeof evt?.delta === 'string' && evt.delta) ||
                        evt?.delta?.text ||
                        evt?.output_text?.delta ||
                        evt?.data?.delta?.text ||
                        '';

                    if (typeof delta === 'string' && delta) handleDelta(delta);
                }
            }
        }

        return state;
    }

    static convertScratchJsonToScratchblocks (projectJson) {
        const url = `${process.env.LITTERBOX_BASE_URL}/litterbox-api/converter/scratchblocks`;

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectJson)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Litterbox was not able to transform the provided project');
                }
                return response.text();
            });
    }
}

export default HintGenerator;
