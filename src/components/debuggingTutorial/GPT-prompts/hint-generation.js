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
                const cleanedJson = hints.testsSuccessfulMessage.replace(/^```json\s*|\s*```$/g, '');
                return JSON.parse(cleanedJson);
            });
    }

    static sendScratchblocksToChatGPTo3mini (scratchblocks, failedTest, passedTests, locale) {
        const apiUrl = 'https://api.openai.com/v1/responses';
        // Configuration Variables
        const apiKey = apiKeyFlo; // Replace with your actual API key
        const systemRole = 'You are an assistant that helps students debug their Scratch programs.\n' +
            'The student has created a Scratch project and attempted to pass several behavior-based tests.\n' +
            'You are given:\n' +
            '\n' +
            '- The current Scratch code (in Scratch text format)\n' +
            '- The test that failed (or is being checked)\n' +
            '- A list of tests that already pass';
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
        const postPrompt = 'Your task:\n' +
            '\n' +
            'Analyze whether the failed test is actually already fulfilled. If it is, set `{finishedHelpFlag}` to `true` and return a short encouraging message.\n' +
            '\n' +
            'If the test is not fulfilled:\n' +
            '- Provide a helpful, short and student-friendly explanation (`{Text}`).\n' +
            '- You can include one or more relevant Scratch blocks as text (in `{Code}`) that you recommend adding or fixing. Only include code that directly relates to the failed behavior.\n' +
            '- Set `{finishedHelpFlag}` to `false`.\n' +
            '- Avoid technical terms like coordinate ranges or logical operators, as the students are about 12 years old.' +
            '- Only give exact Scratch code in {Code} if it is really helpful to get the student started, not to show the entire final answer.' +
            '- If you give Scratch code, you must not name its code in `{Text}`, since the block is already included in `{Code}`.' +
            '' +
            'All output must be formatted as a JSON object with these exact fields (No text before or after the json-object):\n' +
            '\n' +
            '```json\n' +
            '{\n' +
            '  "Text": "...",\n' +
            '  "Code": "...",\n' +
            '  "finishedHelpFlag": true/false\n' +
            '}\n\n';

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
        const fullPrompt = `${prePromptStudentSolution}\n
            ${scratchblocks}\n
            ${prePromptFailedTest}\n
            ${failedTest}\n
            ${prePromptMasterSolution}\n
            ${passedTests}\n
            ${postPrompt}\n
            ${prompts[locale].helpText}\n
            ${languagePrompt}`;

        const requestBody = {
            model: "o3-mini",
            reasoning: { effort: "low" },
            input: [
                { role: "system", content: systemRole },
                { role: "user", content: fullPrompt }
            ],
            max_output_tokens: 700,
        };

        return fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        })
            .then(res => {
                if (!res.ok) throw new Error(`Error: ` + JSON.stringify(res));
                return res.json();
            })
            .then(data => data.output.find(o => o.type === "message").content[0].text);
    }

    static sendScratchblocksToChatGPT5 (scratchblocks, failedTest, passedTests, locale) {
        const apiUrl = 'https://api.openai.com/v1/responses';
        // Configuration Variables
        const apiKey = apiKeyFlo; // Replace with your actual API key
        const systemRole = 'You are an assistant that helps students debug their Scratch programs.\n' +
            'The student has created a Scratch project and attempted to pass several behavior-based tests.\n' +
            'You are given:\n' +
            '\n' +
            '- The current Scratch code (in Scratch text format)\n' +
            '- The test that failed (or is being checked)\n' +
            '- A list of tests that already pass';
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
        const postPrompt = 'Your task:\n' +
            '\n' +
            'Analyze whether the failed test is actually already fulfilled. If it is, set `{finishedHelpFlag}` to `true` and return a short encouraging message.\n' +
            '\n' +
            'If the test is not fulfilled:\n' +
            '- Provide a helpful, short and student-friendly explanation (`{Text}`).\n' +
            '- You can include one or more relevant Scratch blocks as text (in `{Code}`) that you recommend adding or fixing. Only include code that directly relates to the failed behavior.\n' +
            '- Set `{finishedHelpFlag}` to `false`.\n' +
            '- Avoid technical terms like coordinate ranges or logical operators, as the students are about 12 years old.' +
            '- Only give exact Scratch code in {Code} if it is really helpful to get the student started, not to show the entire final answer.' +
            '- If you give Scratch code, you must not name its code in `{Text}`, since the block is already included in `{Code}`.' +
            '' +
            'All output must be formatted as a JSON object with these exact fields (No text before or after the json-object):\n' +
            '\n' +
            '```json\n' +
            '{\n' +
            '  "Text": "...",\n' +
            '  "Code": "...",\n' +
            '  "finishedHelpFlag": true/false\n' +
            '}\n\n';

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
        const fullPrompt = `${prePromptStudentSolution}\n
            ${scratchblocks}\n
            ${prePromptFailedTest}\n
            ${failedTest}\n
            ${prePromptMasterSolution}\n
            ${passedTests}\n
            ${postPrompt}\n
            ${prompts[locale].helpText}\n
            ${languagePrompt}`;

        const requestBody = {
            model: "gpt-5.1",
            reasoning: { effort: "medium" },
            input: [
                { role: "system", content: systemRole },
                { role: "user", content: fullPrompt }
            ],
            max_output_tokens: 1000,
        };

        return fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        })
            .then(res => {
                if (!res.ok) throw new Error(`Error: ` + JSON.stringify(res));
                return res.json();
            })
            .then(data => data.output.find(o => o.type === "message").content[0].text);
    }

    static sendScratchblocksToChatGPT (scratchblocks, failedTest, passedTests, locale, fastMode) {
        const apiUrl = 'https://api.openai.com/v1/responses';
        // Configuration Variables
        const apiKey = apiKeyFlo; // Replace with your actual API key
        const systemRole = 'You are an assistant that helps students debug their Scratch programs.\n' +
            'The student has created a Scratch project and attempted to pass several behavior-based tests.\n' +
            'You are given:\n' +
            '\n' +
            '- The current Scratch code (in Scratch text format)\n' +
            '- The test that failed (or is being checked)\n' +
            '- A list of tests that already pass';
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
        const postPrompt = 'Your task:\n' +
            '\n' +
            'Analyze whether the failed test is actually already fulfilled. If it is, set `{finishedHelpFlag}` to `true` and return a short encouraging message.\n' +
            '\n' +
            'If the test is not fulfilled:\n' +
            '- Provide a helpful, short and student-friendly explanation (`{Text}`).\n' +
            '- You can include one or more relevant Scratch blocks as text (in `{Code}`) that you recommend adding or fixing. Only include code that directly relates to the failed behavior.\n' +
            '- Set `{finishedHelpFlag}` to `false`.\n' +
            '- Avoid technical terms like coordinate ranges or logical operators, as the students are about 12 years old.' +
            '- Only give exact Scratch code in {Code} if it is really helpful to get the student started, not to show the entire final answer.' +
            '- If you give Scratch code, you must not name its code in `{Text}`, since the block is already included in `{Code}`.' +
            '' +
            'All output must be formatted as a JSON object with these exact fields (No text before or after the json-object):\n' +
            '\n' +
            '```json\n' +
            '{\n' +
            '  "Text": "...",\n' +
            '  "Code": "...",\n' +
            '  "finishedHelpFlag": true/false\n' +
            '}\n\n';

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
        const fullPrompt = `${prePromptStudentSolution}\n
            ${scratchblocks}\n
            ${prePromptFailedTest}\n
            ${failedTest}\n
            ${prePromptMasterSolution}\n
            ${passedTests}\n
            ${postPrompt}\n
            ${prompts[locale].helpText}\n
            ${languagePrompt}`;

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
                return response.json();
            })
            .then(data => data.output.find(o => o.type === "message").content[0].text);
    }

    static getRequestBody (fastMode, systemRole, fullPrompt) {
        if (fastMode) {
            return {
                    model: "o3-mini",
                    reasoning: { effort: "low" },
                    input: [
                        { role: "system", content: systemRole },
                        { role: "user", content: fullPrompt }
                    ],
                    max_output_tokens: 700,
                }
        } else {
            return {
                model: "gpt-5.1",
                reasoning: { effort: "medium" },
                input: [
                    { role: "system", content: systemRole },
                    { role: "user", content: fullPrompt }
                ],
                max_output_tokens: 1000,
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
        this.convertScratchJsonToScratchblocks(JSON.parse(projectJson)).then(e => console.log("JSON: " + JSON.stringify(e)))
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
