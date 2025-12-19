import enPrompt from './en/blockList.js';
import dePrompt from './de/blockList.js';

const prompts = {
    en: enPrompt,
    de: dePrompt
};

import {apiKeyFlo} from '../../hint-gen/key.jsx'

class HintGenerator {
    fetchServerAddress () {
        /*
        const url = window.location.href;
        fetch(`${url}server-info.txt`)
            .then(res => res.text())
            .catch(() => 'http://localhost:9000')
            .then(res => {
                this.server = res;
            });
         */
        // alternative for constant server URL
        this.server = 'http://localhost:9000';
    }

    // fastMode = true: Uses a smaller model for the hint generation.
    static generateHint(projectJson, failedTest, passedTests, locale, fastMode) {
        return this.getGPTHints(projectJson, failedTest, passedTests, locale, fastMode)
            .then(hints => {
                console.log("AAAAAAAA: " + hints.testsSuccessfulMessage);
                const cleanedJson = hints.testsSuccessfulMessage
                    .replace(/^```json\s*|\s*```$/g, '');
                return JSON.parse(cleanedJson);
            });
    }

    static sendScratchblocksToChatGPT (scratchblocks, failedTest, passedTests, locale, fastMode) {
        const apiUrl = 'https://api.openai.com/v1/responses';
        // Configuration Variables
        const apiKey = apiKeyFlo; // Replace with your actual API key
        /*const systemRole = 'You are an assistant that helps students debug their Scratch programs.\n' +
            'The student has created a Scratch project and attempted to pass several behavior-based tests.\n' +
            'You are given:\n' +
            '\n' +
            '- The current Scratch code (in Scratch text format)\n' +
            '- The test that failed (or is being checked)\n' +
            '- A list of tests that already pass';*/
        const systemRole =
            `You are an assistant supporting a Scratch debugging learning system for students around 12 years old.

STRICT RULES:
- Output ONLY the JSON object described below
- Do NOT add any text outside the JSON

TASK:
Given student Scratch code, a failed behaviour, and behaviours that already work:
(1) Describe the problem
- Start with "Problem:"
- Describe only what is visibly wrong in the game
- No solution hints, no block names, no tests

(2) Generate EXACTLY three solution candidates
- Based on the student's existing code
- Only minimal changes (add/move/adjust single blocks)
- Do NOT rewrite the program or add sprites
- EXACTLY ONE fixes the behaviour
- TWO are plausible beginner mistakes

(3) Explain each candidate
- Explain the visible effect in the game
- Explain why it is sufficient or not
- No technical terms, for 12-year-olds
- Do NOT mention tests or correctness labels

OUTPUT FORMAT:
{
  "problemText": "Problem: ...",
  "solutionOptions": [
    { "id": "A", "code": "...", "isCorrect": true,  "explanation": "..." },
    { "id": "B", "code": "...", "isCorrect": false, "explanation": "..." },
    { "id": "C", "code": "...", "isCorrect": false, "explanation": "..." }
  ]
}

SCRATCH BLOCK SYNTAX (CANONICAL):
go to [RANDOM_POSITION v]
set [VARIABLE_NAME v] to ()
change [VARIABLE_NAME v] by ()
stop [ALL v]
touching [FIGUR v] ?
point in direction ()
turn cw () degrees
turn ccw () degrees
move () steps
point towards (TARGET_FIGURE v)
switch costume to (COSTUME_NAME v)
touching color [#RRGGBB] ?
when flag clicked
go to x: () y: ()
change x by ()
change y by ()
set x to ()
set y to ()
say ()
wait until <>
repeat ()
  ...
end
forever
  ...
end
if <> then
  ...
end

RULES:
- Scripts MUST start with a hat block (e.g. "when flag clicked")
- Strings MUST be in double quotes (e.g. say ("Hallo"))
- Variables and numbers MUST NOT be in quotes
- Dropdown parameters MUST include "v" and MUST NOT be quoted
- Colors MUST be exactly [#RRGGBB]
- No placeholder tokens may remain

LANGUAGE:
- Code in English
- For german:
- Use "Wiederholungen" (not "Schleifen")
- Use "Falls-Bedingung" (not "Wenn-Bedingung")
`;
        // 'Give the student some creative freedom. ' +
        // 'The order of the blocks does not have to be the same as in the master solution.' +
        // 'If the student solution has the same functionality as the master solution, ' +
        // 'than give a success message!';
        // "Don't be too strict, leave some room for creativity of the students.";
        // leads to hallucinations in the end
        const prePromptStudentSolution = 'This is the student code:';
        const prePromptFailedTest = "This is the test that did fail:";
        const prePromptMasterSolution = 'Tests that already PASS (do not propose changes that would break these):';
        // const prePromptMasterSolution = 'These are the master solutions:';
        const postPrompt =
            'Your task is to support a Scratch debugging learning system for students around 12 years old.\n\n' +

            'You are given:\n' +
            '- The current Scratch code written by the student (in Scratch text format)\n' +
            '- A description of an observed incorrect behaviour in the game\n' +
            '- A list of behaviours that already work correctly\n\n' +

            'Your job has three strictly separated responsibilities:\n\n' +

            '(1) Describe the problem:\n' +
            'Generate ONLY a short, student-friendly description of the incorrect behaviour.\n' +
            'This description must:\n' +
            '- start with the word "Problem:"\n' +
            '- describe what is going wrong in the game\n' +
            '- NOT include any solution hints\n' +
            '- NOT mention Scratch block names\n' +
            '- NOT mention tests, checking, or correctness\n' +
            '- focus only on what the student can observe while playing\n\n' +

            '(2) Generate solution candidates:\n' +
            'Generate EXACTLY three Scratch code snippets as possible fixes.\n' +
            'Rules for the code snippets:\n' +
            '- All snippets must be based on the student\'s existing code\n' +
            '- Only minimal modifications are allowed (move, add or adjust single blocks)\n' +
            '- Do NOT rewrite the program from scratch\n' +
            '- Do NOT introduce new sprites unless absolutely unavoidable\n' +
            '- Exactly ONE snippet must correctly fix the described behaviour\n' +
            '- The other TWO snippets must look plausible to beginners but must NOT fully fix the behaviour\n' +
            '- The incorrect snippets should represent typical beginner mistakes\n' +
            '- Each snippet must be realistic and non-trivial\n\n' +

            '(3) Explain each candidate:\n' +
            'For each code snippet, generate a short explanation explaining:\n' +
            '- what would change in the game if this code is used\n' +
            '- and why this change is sufficient or not sufficient to solve the problem\n\n' +

            'The explanations must:\n' +
            '- focus on the visible effect in the game, not on code structure or syntax\n' +
            '- avoid technical terminology\n' +
            '- be understandable for a 12-year-old student\n' +
            '- NOT mention tests, correctness labels, or evaluation language\n\n' +

            'IMPORTANT:\n' +
            '- Do NOT reveal which solution is correct outside the structured JSON field\n' +
            '- Output ONLY the JSON object described below, with no additional text\n\n' +

            'Output format:\n' +
            '{\n' +
            '  "problemText": "Problem: <short description of the incorrect behaviour>",\n' +
            '  "solutionOptions": [\n' +
            '    {\n' +
            '      "id": "A",\n' +
            '      "code": "<Scratch blocks as text>",\n' +
            '      "isCorrect": true,\n' +
            '      "explanation": "<why this code fixes the behaviour>"\n' +
            '    },\n' +
            '    {\n' +
            '      "id": "B",\n' +
            '      "code": "<Scratch blocks as text>",\n' +
            '      "isCorrect": false,\n' +
            '      "explanation": "<why this code does not fully fix the behaviour>"\n' +
            '    },\n' +
            '    {\n' +
            '      "id": "C",\n' +
            '      "code": "<Scratch blocks as text>",\n' +
            '      "isCorrect": false,\n' +
            '      "explanation": "<why this code does not fully fix the behaviour>"\n' +
            '    }\n' +
            '  ]\n' +
            '}';



        /*
        * 'Your task:\n' +
            '\n' +
            'Analyze whether the failed test is actually already fulfilled. If it is, set `{finishedHelpFlag}` to `true` and return a short encouraging message.\n' +
            '\n' +
            'If the test is not fulfilled:\n' +
            '- Provide a helpful, short and student-friendly explanation (`{Text}`). If you provide `{Code}`, you must not describe the code in (`{Text}`), as the student sees your given `{Code}` directly underneath your (`{Text}`) and we dont want the (`{Text}`) to be bloated.\n' +
            '- You can include one or more relevant Scratch blocks as text (in `{Code}`) that you recommend adding or fixing. Only include code that directly relates to the failed behavior.\n' +
            '- Set `{finishedHelpFlag}` to `false`.\n' +
            '- In your response `{Text}`, the word \'Problem:\' MUST be the first thing inside the Text field. The word \'Lösung:\' MUST appear after it as shown.'+
            '- Try to minimise filler words ond be concise' +
            '- If you want to reference the failed test, dont mention the failed test since this is didactic wrong. So dont use sentences like `To solve this test...`. Instead use a more didactic approach by naming the failed behaviour.' +
            '- Avoid technical terms like coordinate ranges or logical operators, as the students are about 12 years old.' +
            '- Only give exact Scratch code in {Code} if it is really helpful to get the student started, not to show the entire final answer.' +
            '- If you give Scratch code, you must not name its code in `{Text}`, since the block is already included in `{Code}`.' +
            '- If you want to reference a ScratchBlock in `{Text}`, use a student-friendly blockName in the given local instead of the blockCode' +
            '- Structure your answer `{Text}` in two subsections. The header of the first subsections ist always the word "Problem:"(in the given locale). In this first subsection, explain the origin of the error in 1 or 2 sentences. After that, give concrete hints to solve the error in the second subsection, which always has the header "Solution:" (in the given locale). Leave a single line between both subsections.' +
            '- The second subsection in `{Text}` containing your specific hints MUST NOT contain information that is already shown by your generated `{Code}`. (to prevent overbloating of the answer). This means, the second subsection is entirely optional' +
            'All output must be formatted as a JSON object with these exact fields (No text before or after the json-object):\n' +
            '\n' +
            '```json\n' +
            '{\n' +
            '  "Text": "Problem: <1–2 sentence explanation of the origin of the error>\n\nLösung: <concrete steps to fix it>",\n' +
            '  "Code": "<optional Scratch blocks or empty string>",\n' +
            '  "finishedHelpFlag": <true or false>' +
            '}\n\n';*/

        /*'The order of the blocks in the student solution' +
            ' does not have to be the same as in the master solution. ' +
            'If the student solution has the same functionality as the master solution, ' +
            'than give a success message. ' +
            'For complex tasks with multiple sprites focus on clear and simple answers on what sprite to work first. ' +
            'Include hints for creating or adding sprites with clear and simple instructions.';*/
        // 'Give the next step hint. Give only the hint. Do not give a code solution.';
        // const language = 'german';
        const languagePrompt = `Generated "Code" has to be in englisch, the generated "Text" in the language with this locale key: ${locale}`;

        // Construct the full prompt
        /*const fullPrompt = `${prePromptStudentSolution}\n
            ${scratchblocks}\n
            ${prePromptFailedTest}\n
            ${failedTest}\n
            ${prePromptMasterSolution}\n
            ${passedTests}\n
            ${postPrompt}\n
            ${prompts[locale].helpText}\n
            ${languagePrompt}`;*/

        const fullPrompt =
            `LOCALE: ${locale}
            STUDENT CODE: ${scratchblocks}
            FAILED BEHAVIOUR: ${failedTest}
            PASSED BEHAVIOURS (do not break): ${passedTests && passedTests.trim().length > 0 ? passedTests : "none"}`;

        console.log(fullPrompt);

        const requestBody = this.getRequestBody(fastMode, systemRole, fullPrompt);

        return fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                console.log("OUTPUT: " + JSON.stringify(response))
                return response.json();
            }).then(data => {
                console.log("RAW GPT RESPONSE:", JSON.stringify(data, null, 2));
                return data;
            })
            .then(data => {
                const message = data.output.find(o => o.type === "message");
                if (!message) {
                    throw new Error("No output_message found in GPT response");
                }

                const textPart = message.content.find(c => c.type === "output_text");
                if (!textPart) {
                    throw new Error("No output_text inside output_message");
                }

                return textPart.text;
            });
    }

    static getRequestBody (fastMode, systemRole, fullPrompt) {
        if (fastMode) {
            return {
                model: "gpt-5.1",
                reasoning: { effort: "low" },
                input: [
                    { role: "system", content: systemRole },
                    { role: "user", content: fullPrompt }
                ],
                max_output_tokens: 1200,
            };
        } else {
            return {
                model: "gpt-5.1",
                reasoning: { effort: "low" },
                input: [
                    { role: "system", content: systemRole },
                    { role: "user", content: fullPrompt }
                ],
                max_output_tokens: 1200,
            };
        }

        /* Für GPT-4o:

        const apiUrl = 'https://api.openai.com/v1/chat/completions';

        const requestBody = {
            model: 'gpt-4o',
            messages: [
                {role: 'system', content: systemRole},
                {role: 'user', content: fullPrompt}
            ],
            max_tokens: 1000,
            temperature: 0.7
        };

        .then(data => data.choices[0].message.content);




        o3-mini:
        return {
                    model: "o3-mini",gpt-5-mini
                    reasoning: { effort: "medium" },
                    input: [
                        { role: "system", content: systemRole },
                        { role: "user", content: fullPrompt }
                    ],
                    max_output_tokens: 2000,
                }
        */
    }

    static convertScratchJsonToScratchblocks (projectJson) {
        const url = 'https://scratch.fim.uni-passau.de/litterbox-api/converter/scratchblocks';

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

    static getGPTHints (projectJson, failedTest, passedTests, locale, fastMode) {
        return this.convertScratchJsonToScratchblocks(JSON.parse(projectJson))
            .then(scratchblocks =>
                this.sendScratchblocksToChatGPT(scratchblocks, failedTest, passedTests, locale, fastMode)
                    .then(chatGptResponse => ({
                        testsSuccessFul: 'success',
                        testsSuccessfulMessage: chatGptResponse
                    }))
            )
            .catch(error => {
                // eslint-disable-next-line no-console
                console.error('Failed to get GPT hints:', error);
                return {
                    testsSuccessFul: 'failure',
                    testsSuccessfulMessage: 'Conversion or ChatGPT API call failed'
                };
            });
    }
}

export default HintGenerator;
