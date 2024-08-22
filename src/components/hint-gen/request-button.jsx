import React from 'react';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';
import Button from '../button/button.jsx';

import styles from '../menu-bar/community-button.css';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import VirtualMachine from 'scratch-vm';

class Comment {
    constructor (blockId, commentId) {
        this.blockId = blockId;
        this.commentId = commentId;
    }
}

class RequestHintButton extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleOnClick',
            'requestHints',
            'showHints',
            'createComment',
            'createBlockAnnotations',
            'deleteOldBlockAnnotations',
            'fetchServerAddress',
            'fetchTaskId',
            'setupStartProgram'
        ]);
        this.state = {
            enabled: true,
            blockCommentIds: []
        };
        this.fetchServerAddress();
        this.fetchTaskId();
        this.setupStartProgram();
    }

    fetchServerAddress () {
        /*
        const url = window.location.href;
        fetch(`${url}server-info.txt`)
            .then(res => res.text())
            .catch(() => 'http://localhost:9000')
            .then(res => {
                this.server = res;
            });
         */
        // alternative for constant server URL
        this.server = 'http://localhost:9000';
    }

    fetchTaskId () {
        const params = new URLSearchParams(window.location.search);
        this.taskId = params.get('task');
    }

    setupStartProgram () {
        if (!this.taskId) {
            return;
        }

        fetch(`${this.server}/startProgram?taskId=${this.taskId}`, {
            method: 'GET',
            referrerPolicy: 'origin-when-cross-origin'
        }).then(response => response.blob())
            .then(blob => blob.arrayBuffer())
            .then(sb3 => {
                this.props.loadProjectSb3(sb3);
            });
    }

    handleOnClick () {
        if (!this.state.enabled) {
            return;
        }

        this.setState({enabled: false});
        this.props.hintsExplanationCard.content = 'Fetching Hints...';
        this.props.vm.emitWorkspaceUpdate();

        const enable = () => this.setState({enabled: true});

        // this.requestHints()
        //     .then(h => this.showHints(h))
        //     .then(enable())
        //     .catch(() => enable());

        this.getGPTHints()
            .then(hints => this.showHints(hints))
            .then(enable())
            .catch(() => enable());
    }

    /**
     * Contacts the server to fetch new hints for the current program.
     *
     * Also deletes old block comments beforehand.
     * @return {*} the hints object fetched from the server.
     */
    requestHints () {
        this.deleteOldBlockAnnotations();

        return this.props.saveProjectSb3()
            .then(blob => fetch(`${this.server}/hints?taskId=${this.taskId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': blob.type
                },
                body: blob,
                referrerPolicy: 'origin-when-cross-origin'
            }))
            .then(response => response.json());
    }

    showHints (hintsResponse) {
        const {testsSuccessFul, testsSuccessfulMessage, hints} = hintsResponse;

        if (testsSuccessFul) {
            this.props.hintsExplanationCard.content = testsSuccessfulMessage;
        } else if (hints.hints.length === 0) {
            this.props.hintsExplanationCard.content = 'No hints found. You program seems to already be correct.';
        } else {
            this.props.hintsExplanationCard.content = hints;
            this.createBlockAnnotations(hints.hints);
        }

        this.props.hintsExplanationCard.visible = true;
        this.props.vm.emitWorkspaceUpdate();
    }

    createBlockAnnotations (hints) {
        const formatHintIds = hintIds => hintIds.map(hintId => hintId.value)
            .join(', ');

        this.props.vm.runtime.targets.forEach(actor => {
            const currentActor = actor.getName();
            const currentActorHints = hints.find(ah => ah.actorName.name === currentActor);

            if (currentActorHints) {
                for (const commentId in currentActorHints.comments) {
                    const comment = currentActorHints.comments[commentId];
                    const blockId = comment.blockId.id;
                    const hintIds = formatHintIds(comment.hintIds);
                    const remarks = comment.additionalRemarks;
                    let commentText;
                    if (remarks) {
                        commentText = `${hintIds}: ${remarks}`;
                    } else {
                        commentText = `${hintIds}`;
                    }
                    this.createComment(actor, commentText, blockId);
                }
            }
        });
    }

    deleteOldBlockAnnotations () {
        const targets = this.props.vm.runtime.targets;
        this.state.blockCommentIds.forEach(comment => {
            targets.forEach(target => {
                // adapted from blocks.js -> case 'comment_delete'
                // see also target.js -> createComment
                delete target.comments[comment.commentId];
                const block = target.blocks.getBlock(comment.blockId);
                if (block) {
                    delete block.comment;
                }
            });
        });
        this.props.vm.runtime.emitProjectChanged();
        this.props.vm.emitWorkspaceUpdate();

        this.setState({
            blockCommentIds: []
        });
    }

    /**
     * Creates a new comment on the current sprite, either tied to a block or standalone.
     * @param {!Target} actor in which the comment should be added.
     * @param {!string} text the content of the comment.
     * @param {?string} blockId the optional id of the block the comment should belong to.
     */
    createComment (actor, text, blockId = null) {
        const block = blockId ? actor.blocks.getBlock(blockId) : null;

        const x = block ? block.x + 100 : (Math.random() * 100) + 300;
        const y = block ? block.y : (Math.random() * 100) + 300;

        // from https://github.com/LLK/scratch-vm/blob/develop/src/util/uid.js
        const soup_ = '!#%()*+,-./:;=?@[]^_`{|}~' +
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const uid = function () {
            const length = 20;
            const soupLength = soup_.length;
            const id = [];
            for (let i = 0; i < length; i++) {
                id[i] = soup_.charAt(Math.random() * soupLength);
            }
            return id.join('');
        };

        const blockCommentId = uid();
        actor.createComment(
            blockCommentId,
            blockId,
            text,
            x,
            y,
            150,
            100,
            true
        );
        this.state.blockCommentIds.push(new Comment(blockId, blockCommentId));

        this.props.vm.emitWorkspaceUpdate();
    }

    async convertScratchJsonToScratchblocks (projectJson) {
        const url = 'https://scratch.fim.uni-passau.de/litterbox-api/converter/scratchblocks';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: projectJson
            });

            if (!response.ok) {
                throw new Error('Litterbox was not able to transform the provided project');
            }

            return await response.text();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error converting Scratch project JSON to Scratchblocks:', error);
            throw error;
        }
    }

    getGPTHints () {
        const projectJson = this.props.toJson();

        return this.convertScratchJsonToScratchblocks(projectJson)
            .then(scratchblocks => ({
                testsSuccessFul: 'success',
                testsSuccessfulMessage: scratchblocks
            }))
            .catch(error => {
                // eslint-disable-next-line no-console
                console.error('Failed to convert Scratch project JSON to Scratchblocks:', error);
                return {
                    testsSuccessFul: 'failure',
                    testsSuccessfulMessage: 'Conversion failed'
                };
            });
    }

    generateRandomHint () {
        return {HintId: Math.floor(Math.random())};
    }

    render () {
        return (<Button
            className={styles.communityButton}
            iconClassName={styles.communityButtonIcon}
            onClick={this.handleOnClick}
        >
            <FormattedMessage
                defaultMessage="Hinweise"
                description="Label for request hints button"
                id="gui.hint-gen.request-hints"
            />
        </Button>);
    }
}

RequestHintButton.propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    enabled: PropTypes.bool,
    vm: PropTypes.instanceOf(VirtualMachine),
    hintsExplanationCard: PropTypes.shape({
        visible: PropTypes.bool,
        content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        x: PropTypes.number,
        y: PropTypes.number,
        expanded: PropTypes.bool,
        dragging: PropTypes.bool
    }),
    saveProjectSb3: PropTypes.func,
    loadProjectSb3: PropTypes.func,
    toJson: PropTypes.func
};

RequestHintButton.defaultProps = {
    enabled: true
};

const mapStateToProps = state => ({
    enabled: state.enabled,
    vm: state.scratchGui.vm,
    hintsExplanationCard: state.scratchGui.hintsExplanationCard,
    saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm),
    loadProjectSb3: state.scratchGui.vm.loadProject.bind(state.scratchGui.vm),
    toJson: state.scratchGui.vm.toJSON.bind(state.scratchGui.vm)
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(RequestHintButton);
