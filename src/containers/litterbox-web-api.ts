type ScratchBlocksCode = string;
type ScratchProjectJson = string;

export interface LitterBoxHint {
    id: number;
    type: IssueType;
    name: string;
    translatedFinderName: string;
    hint: string;
    sprite: string;
    hatBlockId: string | undefined;
    blockId: string | undefined;
    costume: string | undefined;
    scratchBlocksCode: ScratchBlocksCode;
}

export type IssueType = 'BUG' | 'SMELL' | 'PERFUME' | 'QUESTION';

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
const postJsonWithJsonResponse = <T, R>(endpoint: string, body: T, urlParams?: UrlParams): Promise<R> => {
    const queryParams = urlParams ? `?${cleanURLSearchParams(urlParams).toString()}` : '';
    return fetch(`${baseUrl}/${endpoint}${queryParams}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        referrerPolicy: 'origin-when-cross-origin'
    }).then(res => {
        if (res.ok) {
            return res.json() as unknown as R;
        }

        throw res;
    });
};

interface LitterBoxAnalysisRequest {
    program: ScratchProjectJson;
    language: string | undefined;
    detectors: string | undefined;
}

/**
 * Runs the LitterBox analysis for a program.
 * @param program - A Scratch program.
 * @param detectors - The kinds of LitterBox analyses to run.
 * @param language - The language of the hint text in the response.
 * @returns A list of LitterBox-generated warnings.
 */
export const runLitterBoxAnalysis = async (
    program: ScratchProjectJson, detectors?: string, language?: string
): Promise<LitterBoxHint[]> => {
    const body: LitterBoxAnalysisRequest = {language: language, detectors: detectors, program: program};
    const hints = await postJsonWithJsonResponse<LitterBoxAnalysisRequest, LitterBoxHint[]>('linter/analyze', body);
    hints.sort((a, b) => a.id - b.id);

    return hints;
};

interface IssueExplainRequest {
    program: string;
    issue: LitterBoxHint;
}

/**
 * Asks for a more detailed explanation for the issue.
 *
 * @param program - The current program.
 * @param issue - The LitterBox warning.
 * @returns The same issue, but with an updated `issueHint`.
 */
export const explainIssue = (program: ScratchProjectJson, issue: LitterBoxHint): Promise<LitterBoxHint> => {
    const body: IssueExplainRequest = {program: program, issue: issue};
    return postJsonWithJsonResponse('llm/issue/explain', body);
};
