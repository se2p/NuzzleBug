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
            alert(`There are Tests without names`); // eslint-disable-line
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
            alert(`Test ${name} seems to have no Step number`); // eslint-disable-line
        }
        if (parts.length > 1 && !isNaN(
            parseFloat(parts[1]))){
            this.index = Number(parts[1]);
        } else {
            alert(`Test ${name} seems to have no Index number`); // eslint-disable-line
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
                if (keys.length > 1){
                    this.names[keys[0]] = keys[1].trim();
                } else {
                    alert(`Test ${name} is missing a Name in comment`); // eslint-disable-line
                    break;
                }
                if (keys.length > 2){
                    this.comment[keys[0]] = keys[2].trim();
                } else {
                    alert(`Test ${name} is missing a Description in comment`); // eslint-disable-line
                    break;
                }
                if (keys.length > 3){
                    this.failureMessages[keys[0]] = keys[3].trim();
                } else {
                    alert(`Test ${name} is missing a Failure Message in comment`); // eslint-disable-line
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
