import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import VirtualMachine from 'scratch-vm';
import {
    closeCards,
    enableCards,
    disableCards,
    shrinkExpandCards,
    nextStep,
    prevStep,
    dragCard,
    startDrag,
    endDrag
} from '../reducers/ir-cards';
import IRCardsComponent from '../components/interrogative-debugging/ir-cards.jsx';
import {questionMessages, answerMessages} from '../lib/libraries/ir-messages';

import {generateCDG, generateCFG} from 'scratch-analysis';
import {AnswerProvider, computeQuestions, createTraceMap} from 'scratch-ir';

class IRCards extends React.Component {
    constructor (props) {
        super(props);
        if (!this.props.visible) {
            this.cancel = true;
            return;
        }
        const vm = this.props.vm;
        if (this.props.vm.runtime.traceInfo.isEmpty()) {
            this.props.onCloseCards();
            this.props.onDisableCards();
            this.cancel = true;

            return;
        }

        let cfg;
        let cdg;
        let traceMap;
        try {
            cfg = generateCFG(vm);
            cdg = generateCDG(cfg);
            traceMap = createTraceMap(vm);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(new Error('Failed to generate CFG or CDG'), e);
            this.props.onCloseCards();
            this.props.onDisableCards();
            this.cancel = true;
            return;
        }
        this.answerProvider = new AnswerProvider(vm, traceMap, cfg, cdg, answerMessages);

        const content = computeQuestions(vm, traceMap, questionMessages);
        const categories = [];
        for (const category of content.misc) {
            if (category.questions.length) {
                categories.push(category);
            }
        }
        for (const category of content.targets) {
            categories.push(category);
        }
        this.categories = categories;

        this.glowBlock = blockId => () => {
            const glowTimes = 5;
            const glowDuration = 150; // ms
            for (let i = 0; i < glowTimes; i++) {
                setTimeout(() => {
                    vm.runtime.glowBlock(blockId, true);
                    setTimeout(() => {
                        vm.runtime.glowBlock(blockId, false);
                    }, glowDuration);
                }, i * 2 * glowDuration);
            }
        };
    }

    render () {
        if (this.cancel) {
            return null;
        }

        return (
            <IRCardsComponent
                categories={this.categories}
                glowBlock={this.glowBlock}
                computeAnswer={this.answerProvider.computeQuestionAnswer}
                {...this.props}
            />
        );
    }
}

IRCards.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCloseCards: PropTypes.func.isRequired,
    onEnableCards: PropTypes.func.isRequired,
    onDisableCards: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    vm: PropTypes.instanceOf(VirtualMachine).isRequired
};

const mapStateToProps = state => ({
    visible: state.scratchGui.ircards.visible,
    content: state.scratchGui.ircards.content,
    step: state.scratchGui.ircards.step,
    expanded: state.scratchGui.ircards.expanded,
    x: state.scratchGui.ircards.x,
    y: state.scratchGui.ircards.y,
    isRtl: state.locales.isRtl,
    locale: state.locales.locale,
    dragging: state.scratchGui.ircards.dragging
});

const mapDispatchToProps = dispatch => ({
    onCloseCards: () => dispatch(closeCards()),
    onEnableCards: () => dispatch(enableCards()),
    onDisableCards: () => dispatch(disableCards()),
    onShrinkExpandCards: () => dispatch(shrinkExpandCards()),
    onNextStep: () => dispatch(nextStep()),
    onPrevStep: () => dispatch(prevStep()),
    onDrag: (e_, data) => dispatch(dragCard(data.x, data.y)),
    onStartDrag: () => dispatch(startDrag()),
    onEndDrag: () => dispatch(endDrag())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IRCards);
