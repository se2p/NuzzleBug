type ScratchBlocksCode = string;
type ScratchProjectJson = string;

interface TutorialHint {
    title: string;
    description: string;
    sprite: string;
    costume: string;
    type: string;
    codeSnippet: ScratchBlocksCode;
}

interface RawLitterBoxTutorialHint {
    name: string;
    hint: string;
    sprite: string;
    costume: string;
    type: string;
    scratchBlocksCode: ScratchBlocksCode;
}

const baseUrl = process.env.LITTERBOX_BASE_URL;

/**
 * Sends a POST request to LitterBox with a JSON body and a JSON response.
 *
 * @param endpoint - The REST endpoint of LitterBox-Web.
 * @param body - The body sent to LitterBox-Web.
 * @returns The decoded JSON response.
 */
const postJsonWithJsonResponse = async <T, R>(endpoint: string, body: T): Promise<R> => {
    const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        referrerPolicy: 'origin-when-cross-origin'
    });

    return await response.json() as unknown as R;
};

/**
 * Runs the LitterBox analysis for a program.
 * @param program - A Scratch program.
 * @param detectors - The kinds of LitterBox analyses to run.
 * @param language - The language of the hint text in the response.
 * @returns A list of LitterBox-generated warnings.
 */
export const getTutorialFeedback = async (
    program: ScratchProjectJson, detectors: string, language: string
): Promise<TutorialHint[]> => {
    const body = {language: language, detectors: detectors, program: program};
    const problems: RawLitterBoxTutorialHint[] =
        await postJsonWithJsonResponse('tutorial-system/generate-feedback', body);

    return problems.map(hint => ({
        title: hint.name,
        description: hint.hint,
        sprite: hint.sprite,
        costume: hint.costume,
        type: hint.type,
        codeSnippet: hint.scratchBlocksCode
    }));
};
