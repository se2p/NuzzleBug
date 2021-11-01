import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';

import VirtualMachine from 'scratch-vm';
import {generateCDG, generateCFG} from 'scratch-analysis';
import {AnswerProvider, computeQuestions, createTraceMap} from 'scratch-ir';

import {
    closeCards,
    disableCards,
    dragCard,
    enableCards,
    endDrag,
    nextStep,
    prevStep,
    resetStep,
    shrinkExpandCards,
    startDrag
} from '../../../reducers/interrogative-debugging/version-1/ir-cards';
import IRCardsComponent from '../../../components/interrogative-debugging/version-1/ir-cards.jsx';
import {answerMessages, StatementFormatter, questionMessages} from '../../../lib/libraries/ir-messages';

const getAllBlocks = targets => targets.reduce((acc, target) => Object.assign(acc, target.blocks._blocks), {});

class IRCards extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'calculateCategories',
            'glowBlock',
            'rerender'
        ]);
        this.cancel = false;
        this.categories = null;
        this.answerProvider = null;

        this.calculateCategories();
    }

    calculateCategories () {
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

        const content = computeQuestions(vm, traceMap, questionMessages);
        const categories = [];
        for (const category of content.misc) {
            if (category.questions.length) {
                categories.push(category);
            }
        }
        for (const category of content.targets) {
            if (category.questions.length) {
                categories.push(category);
            }
        }

        if (this.props.step >= categories.length) {
            this.props.onResetStep(categories.length - 1);
        }

        this.categories = categories;
        this.answerProvider = new AnswerProvider(vm, traceMap, cfg, cdg, answerMessages);
        this.statementFormatter = new StatementFormatter(vm.runtime.targets, getAllBlocks(vm.runtime.targets));
    }

    glowBlock (blockId) {
        return () => {
            const glowTimes = 5;
            const glowDuration = 150; // ms
            for (let i = 0; i < glowTimes; i++) {
                setTimeout(() => {
                    try {
                        this.props.vm.runtime.glowBlock(blockId, true);
                    } catch (ignored) {} // eslint-disable-line no-empty
                    setTimeout(() => {
                        try {
                            this.props.vm.runtime.glowBlock(blockId, false);
                        } catch (ignored) {} // eslint-disable-line no-empty
                    }, glowDuration);
                }, i * 2 * glowDuration);
            }
        };
    }

    rerender () {
        this.calculateCategories();
        this.forceUpdate();
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
                handleRefreshView={this.rerender}
                statementFormatter={this.statementFormatter}
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
    onResetStep: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    step: PropTypes.number.isRequired,
    vm: PropTypes.instanceOf(VirtualMachine).isRequired
};

const mapStateToProps = state => ({
    visible: state.scratchGui.ircards.visible,
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
    onResetStep: step => dispatch(resetStep(step)),
    onDrag: (e_, data) => dispatch(dragCard(data.x, data.y)),
    onStartDrag: () => dispatch(startDrag()),
    onEndDrag: () => dispatch(endDrag())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IRCards);
