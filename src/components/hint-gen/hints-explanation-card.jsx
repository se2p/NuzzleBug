import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import {loadImageData} from '../../lib/libraries/decks/translate-image';
import HintsExplanationCardComponent from './hints-explanation-card-component.jsx';
import {closeCards, dragCard, endDrag, shrinkExpandCards, startDrag} from '../../reducers/cards';

class HintsExplanationCard extends React.Component {
    componentDidMount () {
        if (this.props.locale !== 'en') {
            loadImageData(this.props.locale);
        }
    }
    componentDidUpdate (prevProps) {
        if (this.props.locale !== prevProps.locale) {
            loadImageData(this.props.locale);
        }
    }
    render () {
        return (
            <HintsExplanationCardComponent {...this.props} />
        );
    }
}

HintsExplanationCard.propTypes = {
    locale: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
    visible: state.scratchGui.hintsExplanationCard.visible,
    content: state.scratchGui.hintsExplanationCard.content,
    locale: state.locales.locale,
    dragging: state.scratchGui.hintsExplanationCard.dragging,
    expanded: state.scratchGui.hintsExplanationCard.expanded,
    x: state.scratchGui.hintsExplanationCard.x,
    y: state.scratchGui.hintsExplanationCard.y
});

const mapDispatchToProps = dispatch => ({
    onCloseCards: () => dispatch(closeCards()),
    onShrinkExpandCards: () => dispatch(shrinkExpandCards()),
    onDrag: (e_, data) => dispatch(dragCard(data.x, data.y)),
    onStartDrag: () => dispatch(startDrag()),
    onEndDrag: () => dispatch(endDrag())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(HintsExplanationCard);
