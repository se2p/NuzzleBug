
// Class to create finished tutorials
export class TutorialCreator{

    // data to create the tutorial from
    data;


    constructor (data) {
        // set data
        this.data = data;

        // bind methods
        this.createTutorial = this.createTutorial.bind(this);
        this.createTests = this.createTests.bind(this);
        this.createImages = this.createImages.bind(this);
        this.createGlobalIndexJs = this.createGlobalIndexJs.bind(this);
        this.createMessagesForLanguage = this.createMessagesForLanguage.bind(this);
    }

    // Method to create a new tutorial as zip file
    async createTutorial () {
        // load zip
        const JSZip = require('jszip');
        const zip = new JSZip();
        // tutorials folder
        const tut = zip.folder('tutorials');

        if (tut) {
            // create tutorial folder
            const tutFolder = tut.folder(`${this.data.name === null ? Date.now() : this.data.name.toLowerCase()}`);
            if (tutFolder) {
                // Global index.js
                tutFolder.file('index.js', this.createGlobalIndexJs());

                // Language Messages
                for (let langIndex = 0; langIndex < this.data.languages.length; langIndex++) {
                    const lang = this.data.languages[langIndex];
                    tutFolder.file(`messages${lang.shortCode}.js`,
                        this.createMessagesForLanguage(langIndex, lang.shortCode));
                }

                // Images
                await this.createImages(tutFolder);
            }

        }

        const testcases = zip.folder('testcases');
        if (testcases) {
            // create testcases folder
            const testcasesFolder = testcases.folder(`${this.data.name.toLowerCase()}`);
            if (testcasesFolder){
                this.createTests(testcasesFolder);
            }
        }


        return zip.generateAsync({type: 'blob'});
    }

    createTests (folder){
        // Index JS
        const indexJs = [];

        // Create header
        indexJs.push(
            '/**\n' +
            ' * Step Exports\n' +
            ' */\n');
        indexJs.push('export default {\n');
        indexJs.push('steps : [\n');

        /* --------------- Test Steps ----------------- */
        for (let index = 0; index < this.data.tests.length; index++) {
            for (let stepIndex = 0; stepIndex <
            this.data.tests[index].test.length; stepIndex++) {
                // equates to  {step: 0, index: 0, id: ''} 'step_x_y: id,
                indexJs.push(
                    // Needs long line
                    // eslint-disable-next-line max-len
                    `{step: ${index}, index: ${stepIndex},id:'${this.data.tests[index].test[stepIndex].id}', spriteId: ${this.data.tests[index].test[stepIndex].spriteId}},\n`);
            }
        }
        indexJs.push('],\n');

        /* --------------- Sprites ----------------- */
        indexJs.push('sprites : [\n');
        // export sprites
        for (const spriteIndex in Object.keys(this.data.sprites)) {
            const name = `sprite_${spriteIndex}.json`;
            indexJs.push(`sprite_${spriteIndex} : require('./${name}'),\n`);
            folder.file(name, this.data.sprites[spriteIndex]);
        }
        indexJs.push(']\n');

        // finish indexJs
        indexJs.push('}');
        folder.file('index.js', indexJs.join(''));
    }

    // Method to create the images folder
    async createImages (zip) {
        // create folder
        const imgFolder = zip.folder('images');
        if (imgFolder) {

            // Thumbnail
            const thumbnail = await fetch(this.data.thumbnail);
            const blob = await thumbnail.blob();
            imgFolder.file('thumbnail.png', blob);

            // Step Thumbnails
            for (let stepIndex = 0; stepIndex < this.data.tests.length; stepIndex++) {
                const step = await fetch(this.data.tests[stepIndex].image);
                const stepBlob = await step.blob();
                imgFolder.file(`step${stepIndex + 1}.png`, stepBlob);
            }

            // Solution Images
            for (let languageIndex = 0; languageIndex < this.data.languages.length; languageIndex++) {
                const shortCode = this.data.languages[languageIndex].shortCode;
                for (let stepIndex = 0; stepIndex < this.data.tests.length; stepIndex++) {
                    const step = await fetch(this.data.tests[stepIndex].solutionImages[languageIndex]);
                    const stepBlob = await step.blob();
                    imgFolder.file(`solution${stepIndex + 1}${shortCode}.png`, stepBlob);
                }
            }
        }
    }

    // Method to create the global indeJs file
    createGlobalIndexJs () {
        const indexJs = [];
        /* --------------- BASIC INFOS ----------------- */
        indexJs.push(
            '/**\n' +
           ' * --------- THIS TUTORIAL IS MACHINE GENERATED WITH THE TUTORIAL CREATOR ---------\n' +
           ' * Infos about the tutorial.\n' +
           ' */\n\n\n');
        indexJs.push(`exports.id = '${this.data.name.toLowerCase()}';\n`);
        indexJs.push(`exports.difficulty  = '${this.data.difficulty.name}';\n`);
        indexJs.push(`exports.img  = require('./images/thumbnail.png');\n`);
        indexJs.push(`exports.totalSteps  = ${this.data.tests.length + 1};\n`);
        indexJs.push(`exports.blockBased  = true;\n`);


        /* --------------- Messages ----------------- */
        indexJs.push(
            '/**\n' +
            ' * Messages to the user\n' +
            ' */\n');
        indexJs.push(...this.data.languages.map(lang =>
            `exports.messages${lang.shortCode} = require('./messages${lang.shortCode}.js');\n`));


        /* --------------- Step Images ----------------- */
        indexJs.push(
            '/**\n' +
            ' * Step Images\n' +
            ' */\n');
        indexJs.push(...this.data.tests.map((test, index) =>
            `exports.imageStep${index + 1} = require('./images/step${index + 1}.png');\n`));

        /* --------------- Solution Images ----------------- */
        indexJs.push(
            '/**\n' +
            ' * Solution Images\n' +
            ' */\n');
        indexJs.push(...this.data.languages.map(lang =>
            `exports.messages${lang.shortCode} = require('./messages${lang.shortCode}.js');\n`));
        for (let langIndex = 0; langIndex < this.data.languages.length; langIndex++) {
            const shortCode = this.data.languages[langIndex].shortCode;
            indexJs.push(
                `// -- ${shortCode} --\n`);
            for (let i = 0; i < this.data.tests.length; i++) {
                indexJs.push(
                    `exports.imageSolution${shortCode}${i + 1}= require('./images/solution${i + 1}${shortCode}.png');\n`
                );
            }
        }

        return indexJs.join('');
    }

    // Method to create a language specific file with all outputs
    createMessagesForLanguage (languageIndex, shortCode){
        const messages = [];

        // Header
        messages.push(
            '/**\n' +
            ` * --------- ${shortCode} LANGUAGE FILE ---------` +
            ' */\n\n\n');
        messages.push('export default {\n');

        /* --------------- BASIC INFOS ----------------- */
        messages.push(
            '/**\n' +
            ' * Header\n' +
            ' */\n');
        messages.push(`title: '${this.data.names[languageIndex]}',\n`);
        messages.push(`difficulty: '${this.data.difficulty.name}',\n`);

        /* --------------- Downloads ----------------- */
        messages.push(
            '/**\n' +
            ' * Downloads\n' +
            ' */\n');
        messages.push(`downloadMessage: \`${this.data.downloadMessages[languageIndex].markdown}\`,\n`);
        messages.push(...this.data.downloads.map((download, index) =>
            `download${index + 1}: '${download.names[languageIndex]}',\n`));

        /* --------------- Title Steps ----------------- */
        messages.push(
            '/**\n' +
            ' * Test Steps\n' +
            ' */\n');
        for (let index = 0; index < this.data.tests.length; index++) {
            const tst = this.data.tests[index];
            messages.push(`titleStep${index + 1}: '${tst.names[languageIndex]}',\n`);
            messages.push(`message2Step${index + 1}: \`${tst.messageBottom[languageIndex].markdown}\`,\n`);
            messages.push(`solutionStep${index + 1}: \`${tst.solutionMessages[languageIndex].markdown}\`,\n`);
        }


        /* --------------- Test Steps ----------------- */
        messages.push(
            '/**\n' +
            ' * Test Steps\n' +
            ' */\n');
        for (let index = 0; index < this.data.tests.length; index++) {
            for (let stepIndex = 0; stepIndex <
            this.data.tests[index].whiskerMessages[languageIndex].length; stepIndex++) {
                const msg = this.data.tests[index].whiskerMessages[languageIndex][stepIndex];
                messages.push(`step${index}_${stepIndex}: {\n`);
                messages.push(`name: '${msg.name}',\n`);
                messages.push(`failureMessage: \`${msg.failureMessage.markdown}\`,\n`);
                messages.push(`description: '${msg.description}',\n`);
                messages.push(`},\n`);
            }
        }

        /* --------------- Success Messages ----------------- */
        messages.push(
            '/**\n' +
            ' * Success Messages\n' +
            ' */\n');
        messages.push(`successTitle: '${this.data.endCardTitles[languageIndex]}',\n`);
        messages.push(`successMsg: '${this.data.endCardMessages[languageIndex]}'\n`);

        messages.push('\n};');
        return messages.join('');
    }
}
