class Question {
    constructor (props) {
        const {id, blockId, text} = props;
        this.id = id;
        this.blockId = blockId;
        this.text = text;
    }
}

class Answer {
    constructor (props) {
        const {id, text, blocks} = props;
        this.id = id;
        this.text = text;
        this.blocks = blocks
    }

}

// TODO Phil 17/02/2020: Obviously replace this with a QuestionProvider
const computeQuestions = vm => {
    return [
        new Question({id: 123, blockId: '12321314', text: 'Why did nothing move?'}),
        new Question({id: 125, blockId: '1324321455', text: 'Why did sprite MJ move so fast?'})
    ];
};


const computeQuestionAnswer = (question, vm) => {
    console.log(question);
    console.log(vm);
};


export {
    Question,
    computeQuestions,
    computeQuestionAnswer
};
