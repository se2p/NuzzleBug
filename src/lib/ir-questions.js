class Question {
    constructor (props) {
        const {id, blockId, text} = props;
        this.id = id;
        this.blockId = blockId;
        this.text = text;
    }
}

const qid = () => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array.toString();
};

class QuestionProvider {
    // TODO Phil 19/02/2020: Required for `why` questions
    //   Query trace for sprites
    //   Many more

    // TODO Phil 19/02/2020: Required for `why not` questions
    //   Get AST for each target
    //   Compute full AST
    constructor (vm, trace) {
        this.vm = vm;
        this.trace = trace;
    }

    forTarget (target) {
        const results = [new Question({id: qid(), blockId: '12321314', text: `Why did ${target.sprite.name} move?`})];

        // Skip variables for stage
        if (!target.isStage) {
            results.push(new Question({
                id: qid(),
                blockId: '12321314',
                text: `Why does ${target.sprite.name} have ${Object.values(target.variables).length} variables?`
            }));
        }
        return results;
    }

    forGlobalVariable (variable) {
        return [
            new Question({
                id: qid(),
                blockId: '12321314',
                text: `Why did global variable ${variable.name} change?`
            })
        ];
    }

    generalQuestions () {
        return new Question({id: qid(), blockId: '1324321455', text: 'Why did nothing happen?'});
    }
}

const computeQuestions = vm => {
    const results = {
        targets: [],
        misc: [{info: {name: 'General Questions'}, questions: []}],
        globalVariables: []
    };
    const recordedTrace = vm.runtime.traceInfo.tracer.traces;
    if (!recordedTrace.length) {
        return results;
    }

    const questionProvider = new QuestionProvider(vm, recordedTrace);

    for (const target of vm.runtime.targets) {
        const targetInfo = {
            id: target.id,
            currentCostume: target.currentCostume,
            direction: target.direction,
            isStage: target.isStage,
            isOriginal: target.isOriginal,
            name: target.sprite.name,
            visible: target.visible,
            xPosition: target.x,
            yPosition: target.y
        };
        results.targets.push({
            info: targetInfo,
            questions: questionProvider.forTarget(target)
        });
    }

    // TODO Phil 19/02/2020: Stage doesn't seem to include global variables, so what does?
    for (const [id, variable] of Object.entries(vm.runtime.getTargetForStage().variables)) {
        results.globalVariables.push({
            info: {id: id, name: variable.name},
            questions: questionProvider.forGlobalVariable(variable)
        });
    }

    results.misc[0].questions.push(questionProvider.generalQuestions());

    return results;
};

const computeQuestionAnswer = (question, vm) => {
    // TODO Phil 19/02/2020: Implement me
};

export {
    Question,
    computeQuestions,
    computeQuestionAnswer
};
