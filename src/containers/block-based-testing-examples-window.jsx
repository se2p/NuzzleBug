import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import ScratchBlocks from 'scratch-blocks';
import ReactDOMServer from 'react-dom/server';
import BBTExamplesWindowComponent from '../components/block-based-testing/examples-window/bbt-examples-window.jsx';
import {toggleExamplesWindowVisibility} from '../reducers/block-based-testing';
import testScripts from '../components/block-based-testing/examples-window/test-scripts.jsx';

class BBTExamplesWindow extends React.Component {

    constructor (props) {
        super(props);

        bindAll(this, []);
    }

    handleClickExample (exampleID) {
        // get xml of a test:
        // console.log(ScratchBlocks.Xml.blockToDom(ScratchBlocks.getMainWorkspace().topBlocks_[0], true).outerHTML);

        ScratchBlocks.Xml.domToBlock(
            ScratchBlocks.Xml.textToDom(
                ReactDOMServer.renderToStaticMarkup(testScripts[exampleID])), ScratchBlocks.getMainWorkspace());
    }

    render () {
        return this.props.isExamplesWindowVisible ? (
            <BBTExamplesWindowComponent
                onClose={this.props.handleToggleExamplesWindowVisibility}
                onClickExample={this.handleClickExample}
            />
        ) : null;
    }
}

BBTExamplesWindow.propTypes = {
    isExamplesWindowVisible: PropTypes.bool.isRequired,
    handleToggleExamplesWindowVisibility: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    isExamplesWindowVisible: state.scratchGui.blockBasedTesting.examplesWindowVisible
});

const mapDispatchToProps = dispatch => ({
    handleToggleExamplesWindowVisibility: () => dispatch(toggleExamplesWindowVisibility())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BBTExamplesWindow);
