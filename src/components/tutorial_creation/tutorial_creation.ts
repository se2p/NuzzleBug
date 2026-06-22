// eslint-disable-next-line no-undef

export const Language = {
    ENGLISH: {fullName: 'English', shortCode: 'EN', hint: 'Hint'},
    GERMAN: {fullName: 'Deutsch', shortCode: 'DE', hint: 'Tipp'},
    FRENCH: {fullName: 'Francais', shortCode: 'FR', hint: 'Pourboire'}
};

export const Difficulty = {
    EASY: {name: 'easy', message: 'easy'},
    MEDIUM: {name: 'medium', message: 'medium'},
    HARD: {name: 'hard', message: 'hard'}
};

export class TestMessage {
    id : string;
    markdown : string;

    constructor (id: string, markdown = '') {
        this.id = id;
        this.markdown = markdown;
    }
}

export class StepMessage {
    id: string;
    name : string;
    failureMessage : TestMessage;
    description : string


    constructor (id: string, name:string, description:string, failureMessage:string) {
        this.id = id;
        this.failureMessage = new TestMessage(id, failureMessage);
        this.name = name;
        this.description = description;
    }
}

// Help texts appended to the warnings for malformed tests so the creator
// immediately sees the expected format.
// Test name: <step>_<index> (e.g. 1_2).
// Comment per language: <lang>$Name$Description$FailureMessage, multiple
// languages joined with '&'.
const TEST_NAME_FORMAT_HELP =
    '\n\nExpected test name format: <step>_<index> (e.g. 1_2).';
const COMMENT_FORMAT_HELP =
    '\n\nExpected comment format per language:\n' +
    '<lang>$Name$Description$FailureMessage\n' +
    'Join multiple languages with "&", e.g.:\n' +
    'DE$Titel$Beschreibung$Fehlermeldung&EN$Title$Description$FailureMessage';

export class BBT {
    name:string;
    comment = {};
    names = {};
    failureMessages = {};
    id:string;
    number: number = 0;
    index: number = 0;
    spriteId: string;


    constructor (name: string, comment: string, id: string, sprite: string) {
        if (name === null || !name || name.length === 0){
            alert(`There are Tests without names${TEST_NAME_FORMAT_HELP}`); // eslint-disable-line
        }
        this.name = name;
        this.comment = comment;
        this.id = id;
        this.spriteId = sprite;
        // set number and index
        const parts = name.split('_');
        if (parts.length > 0 && !isNaN(
            parseFloat(parts[0]))){
            this.number = Number(parts[0]);
        } else {
            alert(`Test ${name} seems to have no Step number${TEST_NAME_FORMAT_HELP}`); // eslint-disable-line
        }
        if (parts.length > 1 && !isNaN(
            parseFloat(parts[1]))){
            this.index = Number(parts[1]);
        } else {
            alert(`Test ${name} seems to have no Index number${TEST_NAME_FORMAT_HELP}`); // eslint-disable-line
        }
        this.name = `step_${this.number}_${this.index}`;
        // deconstruct comment
        this.comment = {};
        this.names = {};
        this.failureMessages = {};
        if (typeof comment !== 'undefined'){
            const commentParts = comment.split('&');
            for (const commentPart of commentParts){
                const keys = commentPart.split('$');
                // Normalize the language key so the parser accepts both 'DE' and
                // 'de'. Lookups later use the uppercase shortCode (e.g. lang.shortCode),
                // so we store everything uppercased to avoid a case mismatch.
                const langKey = (keys[0] || '').trim().toUpperCase();
                if (keys.length > 1){
                    this.names[langKey] = keys[1].trim();
                } else {
                    alert(`Test ${name} is missing a Name in comment${COMMENT_FORMAT_HELP}`); // eslint-disable-line
                    break;
                }
                if (keys.length > 2){
                    this.comment[langKey] = keys[2].trim();
                } else {
                    alert(`Test ${name} is missing a Description in comment${COMMENT_FORMAT_HELP}`); // eslint-disable-line
                    break;
                }
                if (keys.length > 3){
                    this.failureMessages[langKey] = keys[3].trim();
                } else {
                    alert(`Test ${name} is missing a Failure Message in comment${COMMENT_FORMAT_HELP}`); // eslint-disable-line
                    break;
                }
            }
        }
    }
}

export class TutorialTest {


    constructor (languages: any[], number:number, emptyImage: any) {
        this.messageBottom = languages.map(lang =>
            new TestMessage(`messageStepX|${lang.shortCode}`, 'Description'));
        this.solutionMessages = languages.map(lang =>
            new TestMessage(`solutionMessageStepX|${lang.shortCode}`, 'Solution Message'));
        this.names = languages.map(() => `Step ${number}`);
        this.test = [];
        this.number = number;
        this.image = emptyImage;
        this.solutionImages = languages.map(() => emptyImage);
    }
    // name for internal usage
    name!:string;
    // thumbnail
    image: any;

    // -------- Block Based Test -----------
    test: BBT[];
    number: number;


    // -------- Messages -----------
    // titles in different languages
    names: string[] = [];
    // ([["Erster Schritt","Zweiter Schritt"],["First Step", ...]])
    messageBottom: TestMessage[] = [];
    // actual whisker test messages
    // ([["Bootsposition ...","Bootsrichtung ..."],[Boat Position", ...]])
    whiskerMessages : StepMessage[][] = []

    // -------- Solutions -----------
    // solution images ordered by language
    solutionImages: any[] = [];
    // Solution Messages
    solutionMessages:TestMessage[] = [];


    initWhiskerMessages (languages: any[]){
        this.whiskerMessages = languages.map(lang => this.test.map(bbt => new StepMessage(bbt.id,
            bbt.names[lang.shortCode] || '', bbt.comment[lang.shortCode] || '', bbt.failureMessages[lang.shortCode])));
    }

}

export class TutorialCreation {


    constructor (emptyImage: any) {
        this.thumbnail = emptyImage;
    }

    // internal name
    name!:string;
    thumbnail: any;
    // eslint-disable-next-line no-undef
    languages= [Language.GERMAN];
    downloads = [];
    // actual name
    names = [];
    // difficulty
    difficulty = Difficulty.EASY;
    // Download Message in different languages
    downloadMessages: TestMessage[] = [new TestMessage('downloadMessageDE')];
    tests : TutorialTest[] = [];
    testsLoaded = false;
    // solution titles ordered by language
    endCardTitles = [];
    // solution messages ordered by language
    endCardMessages = [];
    // scratch vm
    vm: any;
    // all block based tests
    blockBasedTests: {[id:string]: BBT;} = {};
    // sprite as json format
    sprites: {[id:string]: any;} = {};

    // toJSON function for json parsing (ignores vm because not needed)
    toJSON (): any {
        return {
            name: this.name,
            thumbnail: this.thumbnail,
            languages: this.languages,
            downloads: this.downloads,
            names: this.names,
            difficulty: this.difficulty,
            downloadMessages: this.downloadMessages,
            tests: this.tests,
            testsLoaded: this.testsLoaded,
            endCardTitles: this.endCardTitles,
            endCardMessages: this.endCardMessages,
            blockBasedTests: this.blockBasedTests,
            sprites: this.sprites
        };
    }
}
