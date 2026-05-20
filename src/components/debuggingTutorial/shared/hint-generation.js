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
        return this.requestTutorialHint(projectJson, failedBehaviour, passedBehaviours, locale, partial => onPartialUpdate(partial))
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

    static async requestTutorialHint (projectJson, failedBehaviour, passedBehaviours, locale, onPartialUpdate) {

        // LitterBox-Web übersetzt das Projekt intern in ScratchBlocks, baut den Prompt
        // und leitet den Request an den serverseitig konfigurierten LLM-Anbieter weiter.
        const apiUrl = `${process.env.LITTERBOX_BASE_URL}/llm/tutorial`;

        const res = await fetch(apiUrl, {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream'
            },
            body: JSON.stringify({
                program: projectJson,
                failedBehaviour,
                passedBehaviours,
                locale
            })
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
}

export default HintGenerator;
