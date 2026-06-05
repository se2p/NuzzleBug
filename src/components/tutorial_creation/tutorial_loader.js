import emptyImage from '../../lib/assets/empty.png';
import {BBT, TutorialCreation, TutorialTest} from './tutorial_creation';
import {defineMessages} from 'react-intl';

const messages = defineMessages({
    jsonError: {
        id: 'gui.tutorialCreation.jsonError',
        defaultMessage: 'Please upload a valid JSON file.',
        description: 'Please upload a valid JSON file.'
    },
    missingComments: {
        id: 'gui.tutorialCreation.missingComments',
        defaultMessage: 'Some Tests are missing comments, please fix this',
        description: 'Some Tests are missing comments, please fix this'
    },
    noBbtsAvailable: {
        id: 'gui.tutorialCreation.noBbtsAvailable',
        defaultMessage: 'No block based Tests available, please check your Tests',
        description: 'No block based Tests available, please check your Tests'
    }
});

// Utitlity class to handle loading and downloading / saving tutorials
// This is only for tutorial EDITS ! for creating and downloading finished tutorials see "tutorial_creator.js"
export class TutorialLoader{


    // intl for messages
    static intl;

    // method to handle the download of the current edit as a json file
    static handleTutorialDownload (tutorialCreation) {
        this.createDownloadBlob(tutorialCreation).then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'tutorial.json';
            link.click();
            URL.revokeObjectURL(link.href); // Clean up the URL object
        });
    }

    // Method to create a blob out of the supplied tutorial Creation store
    static async createDownloadBlob (tutorialCreation) {
        const data = {};
        // stringify the actual store
        data.file = JSON.stringify(tutorialCreation);
        // stringify images as blobs
        data.images = await this.createImages(tutorialCreation);
        // return json blob
        return new Blob([JSON.stringify(data)], {type: 'application/json'});
    }

    // Method to create an image json object containing all images as blobs
    static async createImages (tutorialCreation) {
        const images = {};
        // Thumbnail
        const thumbnail = await fetch(tutorialCreation.thumbnail);
        images[tutorialCreation.thumbnail] = await this.blobToBase64(await thumbnail.blob());

        // Step Thumbnails
        for (let stepIndex = 0; stepIndex < tutorialCreation.tests.length; stepIndex++) {
            const step = await fetch(tutorialCreation.tests[stepIndex].image);
            images[tutorialCreation.tests[stepIndex].image] = await this.blobToBase64(await step.blob());
        }

        // Solution Images
        for (let languageIndex = 0; languageIndex < tutorialCreation.languages.length; languageIndex++) {
            for (let stepIndex = 0; stepIndex < tutorialCreation.tests.length; stepIndex++) {
                const step = await fetch(tutorialCreation.tests[stepIndex].solutionImages[languageIndex]);
                images[tutorialCreation.tests[stepIndex].solutionImages[languageIndex]] =
                    await this.blobToBase64(await step.blob());
            }
        }

        // return content
        return JSON.stringify(images);
    }

    // Method to upload and edit an already created tutorial
    static handleTutorialUpload (event, vm, tutorialCreation){
        // extract file from upload event
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'application/json') {
            const reader = new FileReader();

            // Return the result
            return new Promise((resolve, reject) => {
                reader.onload = loaded => {
                    try {
                        const json = JSON.parse(loaded.target.result);
                        const data = JSON.parse(json.file);
                        const images = JSON.parse(json.images);

                        // Persist for in-session resume on the (non-serialized) runtime.
                        // NOT as a stage comment: stage comments are serialized into the
                        // project and would corrupt the standard Scratch .sb3 export.
                        vm.runtime.tutorialCreationSaveState = {
                            file: json.file,
                            images: json.images
                        };

                        // Resolve Promise with the result
                        resolve(this.createTests(data, images, true, vm, tutorialCreation));
                    } catch (error) {
                        reject(error);
                    }
                };

                reader.onerror = error => reject(error);
                reader.readAsText(selectedFile);
            });

        }
        // inform user
        alert(this.intl.formatMessage(messages.successfulRead)); // eslint-disable-line
    }

    // Method to create tests in the tutorialCreation store
    static createTests (data, images, shouldReload, vm, tutorialCreation){
        const dict = {};


        // load tutorialCreation from comment if applicable
        if (shouldReload) {
            // construct state
            const casted = new TutorialCreation(URL.createObjectURL(
                this.base64ToBlob(images[data.thumbnail])));
            Object.assign(casted, data);

            // set test images
            for (const test of Object.values(casted.tests)) {
                // load thumbnail image
                test.image = URL.createObjectURL(
                    this.base64ToBlob(images[test.image]));

                // load all solution images
                test.solutionImages = test.solutionImages.map(value => URL.createObjectURL(
                    this.base64ToBlob(images[value])));
            }
            tutorialCreation = casted;
        }


        // load bbts from vm
        for (const target of vm.runtime.targets) {
            const bbtTestHatBlocks = Object.values(target.blocks._blocks)
                .filter(block => block.opcode === 'bbt_testHat');

            // eslint-disable-next-line react/no-direct-mutation-state
            tutorialCreation.sprites[target.id] = vm.toJSON(target.id);

            for (const bbtTestHatBlock of bbtTestHatBlocks) {

                // input block: where the test name can be entered
                const correspondingInputBlock = target.blocks._blocks[bbtTestHatBlock.inputs.testName.block];
                const correspondingComment = target.comments[bbtTestHatBlock.comment];


                const testName = correspondingInputBlock.fields.TEXT.value;
                let testComment;
                if (correspondingComment === null || typeof correspondingComment === 'undefined'){
                    alert(this.intl.formatMessage(messages.missingComments)); // eslint-disable-line
                    testComment = '';
                } else {
                    testComment = correspondingComment.text;

                }
                dict[bbtTestHatBlock.id] =
                    new BBT(testName, testComment, bbtTestHatBlock.id, target.id);

            }
        }

        // Set bbts directly
        tutorialCreation.blockBasedTests = dict;

        // load test messages on re load
        if (tutorialCreation.testsLoaded) {
            const oldTests = tutorialCreation.tests;
            const tests = [];
            for (const [id, bbt] of Object.entries(dict)) {
                if (tests[bbt.number - 1] === null || typeof tests[bbt.number - 1] === 'undefined') {

                    // read values from old step if applicable
                    if (oldTests[bbt.number - 1] === null || typeof oldTests[bbt.number - 1] === 'undefined') {

                        // create new step if no old one exists
                        tests[bbt.number - 1] = new TutorialTest(tutorialCreation.languages, bbt.number,
                            emptyImage);
                        tests[bbt.number - 1].name = bbt.name;
                    } else {

                        // cast to actual object
                        const oldTest = oldTests[bbt.number - 1];
                        const newTest = new TutorialTest(tutorialCreation.languages, bbt.number,
                            oldTests.image);
                        Object.assign(newTest, oldTest);
                        tests[bbt.number - 1] = newTest;
                    }

                }
                tests[bbt.number - 1].test[bbt.index - 1] = bbt;
            }

            // init whisker messages after all tests are assigned
            for (const tst of tests) {
                tst.initWhiskerMessages(tutorialCreation.languages);
            }

            tutorialCreation.tests = tests;
        } else {
            // create messages on first load
            const tests = [];
            // eslint-disable-next-line no-unused-vars
            for (const [id, bbt] of Object.entries(dict)) {
                if (tests[bbt.number - 1] === null || typeof tests[bbt.number - 1] === 'undefined') {
                    tests[bbt.number - 1] = new TutorialTest(tutorialCreation.languages, bbt.number,
                        emptyImage);
                    tests[bbt.number - 1].name = bbt.name;
                }
                tests[bbt.number - 1].test[bbt.index - 1] = bbt;
            }
            // init whisker messages after all tests are assigned
            for (const tst of tests) {
                tst.initWhiskerMessages(tutorialCreation.languages);
            }

            // update respectively
            tutorialCreation.tests = tests;
            tutorialCreation.testsLoaded = true;

        }

        // If no tests were loaded inform user
        if (Object.keys(dict).length === 0){
            alert(this.intl.formatMessage(messages.noBbtsAvailable)); // eslint-disable-line
        }

        tutorialCreation.vm = vm;
        return tutorialCreation;
    }

    // Method to convert an image blob to a base64 string
    static blobToBase64 (blob) {
        return new Promise((resolve, _) => {
            // create new file reader
            const reader = new FileReader();

            // load blob
            reader.onloadend = () => {
                const base64Data = reader.result.split(',')[1];
                resolve(base64Data);
            };

            // return data from file reader
            reader.readAsDataURL(blob);
        });
    }

    // Method to convert a base64 string to an image blob
    static base64ToBlob (base64String) {
        // return empty image if input is invalid
        if (typeof base64String === 'undefined' || base64String === null){
            return emptyImage;
        }

        // convert to byte array
        const byteCharacters = atob(base64String);
        const byteArrays = [];
        for (let i = 0; i < byteCharacters.length; i++) {
            byteArrays.push(byteCharacters.charCodeAt(i));
        }
        const byteArray = new Uint8Array(byteArrays);

        // create and return blob
        return new Blob([byteArray], {type: 'image.png'});
    }
}
