class HintsResponse {
    testsSuccessful = false;
    testsSuccessfulMessage = null;
    hints = null;

    static from (json) {
        return Object.assign(new HintsResponse(), json);
    }
}

class ActorHints {
    actorName = null
    comments = null

    static from (json) {
        return Object.assign(new ActorHints(), json);
    }
}

class ActorName {
    value = '';
}

class Comment {

}

export {
    HintsResponse,
    ActorHints,
    ActorName,
    Comment
};
