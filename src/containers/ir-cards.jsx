import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import VirtualMachine from 'scratch-vm';
import {
    closeCards,
    shrinkExpandCards,
    nextStep,
    prevStep,
    dragCard,
    startDrag,
    endDrag
} from '../reducers/ir-cards';
import IRCardsComponent from '../components/interrogative-debugging/ir-cards.jsx';

import {generateCDG, generateCFG} from 'scratch-analysis';
import {computeQuestionAnswer, computeQuestions, createTraceMap} from 'scratch-ir';

class IRCards extends React.Component {
    componentWillMount () {
        if (!this.props.visible) {
            this.cancel = true;
            return;
        }
        const vm = this.props.vm;
        if (this.props.vm.runtime.traceInfo.tracer.traces.length === 0) {
            this.props.onCloseCards();
            this.cancel = true;

            return;
        }

        const cfg = generateCFG(vm);
        const cdg = generateCDG(cfg);
        const traceMap = createTraceMap(vm);

        console.log(cfg.toDot());
        console.log(cdg.toDot());

        const content = computeQuestions(vm, traceMap, cfg, cdg);

        this.firstStep = 0;

        this.glowBlock = blockId => {
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

        this.computeAnswer = question => computeQuestionAnswer(question, vm, traceMap, cfg, cdg);
    }

    render () {
        if (this.cancel) {
            return null;
        }

        return (
            <IRCardsComponent
                categories={this.categories}
                glowBlock={this.glowBlock}
                step={this.firstStep}
                computeAnswer={this.computeAnswer}
                {...this.props}
            />
        );
    }
}

IRCards.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCloseCards: PropTypes.func.isRequired,
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
    onShrinkExpandCards: () => dispatch(shrinkExpandCards()),
    onNextStep: () => dispatch(nextStep()),
    onPrevStep: () => dispatch(prevStep()),
    onDrag: (e_, data) => dispatch(dragCard(data.x, data.y)),
    onStartDrag: () => dispatch(startDrag()),
    onEndDrag: () => dispatch(endDrag()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IRCards);
