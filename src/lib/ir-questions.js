class Question {
    constructor (props) {
        const {id, blockId, text} = props;
        this.id = id;
        this.blockId = blockId;
        this.text = text;
    }
}

// TODO Phil 17/02/2020: Obviously replace this with a QuestionProvider
const defaultQuestions =
    [
        new Question({id: 123, blockId: '12321314', text: 'Why did nothing move?'}),
        new Question({id: 125, blockId: '1324321455', text: 'Why did sprite MJ move so fast?'})
    ];

export {
    Question,
    defaultQuestions
};
