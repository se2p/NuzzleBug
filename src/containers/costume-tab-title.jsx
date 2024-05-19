import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl} from 'react-intl';
import {connect} from 'react-redux';

import CostumeTabTitleComponent from '../components/costume-tab-title/costume-tab-title.jsx';

const CostumeTabTitle = props =>
    <CostumeTabTitleComponent targetIsStage={props.targetIsStage} />;

CostumeTabTitle.propTypes = {
    targetIsStage: PropTypes.bool
};

const mapStateToProps = state => ({
    targetIsStage: (
        state.scratchGui.targets.stage &&
        state.scratchGui.targets.stage.id === state.scratchGui.targets.editingTarget
    )
});

export default injectIntl(connect(
    mapStateToProps
)(CostumeTabTitle));
