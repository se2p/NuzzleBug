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

type UrlParams = {[key: string]: unknown};

/**
 * Filters the URL parameters to include only non-empty, non-null/undefined ones.
 *
 * @param params - A set of URL parameter key/value pairs.
 * @returns Only non-empty, non-null/undefined parameters.
 */
const cleanURLSearchParams = (params: UrlParams): URLSearchParams => {
    const filtered = {};

    Object.keys(params)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .forEach((key, _) => {
            const value = params[key];
            // eslint-disable-next-line no-undefined
            if (value !== '' && value !== null && value !== undefined) {
                filtered[key] = value;
            }
        });

    return new URLSearchParams(filtered);
};

/**
 * Sends a POST request to LitterBox with a JSON body and a JSON response.
 *
 * @param endpoint - The REST endpoint of LitterBox-Web.
 * @param body - The body sent to LitterBox-Web.
 * @param urlParams - Optional request parameters to be added to the URL.
 * @returns The decoded JSON response.
 */
const postJsonWithJsonResponse = async <T, R>(endpoint: string, body: T, urlParams?: UrlParams): Promise<R> => {
    const queryParams = urlParams ? `?${cleanURLSearchParams(urlParams).toString()}` : '';
    const response = await fetch(`${baseUrl}/${endpoint}${queryParams}`, {
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

interface LitterBoxHint {
    id: number,
    blockId: string;
    issueType: string;
    finderName: string;
    translatedFinderName: string;
    issueHint: string;
    sprite: string,
    hatBlockId: string;
}

/**
 * Runs the LitterBox analysis.
 *
 * @param program - A Scratch program.
 * @param detectors - The linters to run in the LitterBox analysis.
 * @param locale - The language for the hint text (`en` or `de`).
 * @returns A list of LitterBox findings.
 */
export const getLitterBoxAnalysis = (
    program: ScratchProjectJson, detectors?: string, locale?: string
): Promise<LitterBoxHint[]> => {
    const urlParams = {locale: locale, detectors: detectors};
    return postJsonWithJsonResponse('linter/analyze', program, urlParams);
};

interface IssueExplainRequest {
    program: string;
    hint: LitterBoxHint;
}

/**
 * Asks for a more detailed explanation for the issue.
 *
 * @param program - The current program.
 * @param hint - The LitterBox warning.
 * @returns The same issue, but with an updated `issueHint`.
 */
export const explainIssue = (program: ScratchProjectJson, hint: LitterBoxHint): Promise<LitterBoxHint> => {
    const body: IssueExplainRequest = {program: program, hint: hint};
    return postJsonWithJsonResponse('llm/issue/explain', body);
};
