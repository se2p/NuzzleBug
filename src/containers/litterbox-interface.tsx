import React from 'react';
import ScratchVM from 'scratch-vm';
import {connect} from 'react-redux';
import {compose} from 'redux';

import Box from '../components/box/box.jsx';
import LitterBoxPane from '../components/litterbox/litterbox-pane.tsx';
import {hideInterface, showInterface} from '../reducers/litterbox.ts';

interface LitterBoxInterfaceProps {
    interfaceVisible: boolean;
    vm: ScratchVM;
}

class LitterBoxInterface extends React.Component<LitterBoxInterfaceProps, never> {

    render () {
        if (!this.props.interfaceVisible) {
            return null;
        }

        return (
            <Box>
                <LitterBoxPane vm={this.props.vm} />
            </Box>
        );
    }
}

const mapStateToProps = state => ({
    interfaceVisible: state.scratchGui.litterBox.interfaceVisible
});

const mapDispatchToProps = dispatch => ({
    handleHideInterface: () => dispatch(hideInterface()),
    handleShowInterface: () => dispatch(showInterface())
});

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(LitterBoxInterface);
