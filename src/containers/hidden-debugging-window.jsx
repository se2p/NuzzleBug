import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';

import {toggleHiddenDebuggingWindowVisibility} from '../reducers/hidden-debugging';
import HiddenDebuggingWindowComponent from '../components/hidden-debugging-window/hidden-debugging-window.jsx';
import VM from 'scratch-vm';

class HiddenDebuggingWindow extends React.Component {
    constructor(props) {
        super(props);

        bindAll(this, []);
    }

    render() {

        const content = (
            <div>
                <div>{'Logging'}</div>
                <br/>
                <div>
                    <button type="button" onClick={() => console.log(this.props.vm)}>
                        {'Log VM to console'}
                    </button>
                </div>
                <br/>
                <div>
                    <button type="button" onClick={() => console.log(this.props.vm.runtime)}>
                        {'Log Runtime to console'}
                    </button>
                </div>
                <br/>
                <div>
                    <button type="button" onClick={() => console.log(process.env.ALL_ENV_FILE_VARIABLES)}>
                        {'Log all variables from .env file to console'}
                    </button>
                </div>
                <br/>
                <div>
                    <button type="button" onClick={() => console.log(this.props.bbtTestStore)}>
                        {'Log BBT teststore to console'}
                    </button>
                </div>

                <br/>
                <br/>

                <div>{'Visual'}</div>
                <br/>
                <div>
                    <button
                        type="button"
                        onClick={() =>
                            document.getElementsByClassName('blocklyMainBackground')[0].style = 'fill: white;'
                        }
                    >
                        {'Set workspace background to pure white'}
                    </button>
                </div>

            </div>
        );

        return this.props.isHiddenDebuggingWindowVisible ? (
            <HiddenDebuggingWindowComponent
                onClose={this.props.onToggleWindowVisibility}
            >
                {content}
            </HiddenDebuggingWindowComponent>
        ) : null;
    }
}

HiddenDebuggingWindow.propTypes = {
    isHiddenDebuggingWindowVisible: PropTypes.bool.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired,
    bbtTestStore: PropTypes.object.isRequired,

    onToggleWindowVisibility: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    isHiddenDebuggingWindowVisible: state.scratchGui.hiddenDebugging.windowVisible,
    vm: state.scratchGui.vm,
    bbtTestStore: state.scratchGui.blockBasedTesting.testStore
});

const mapDispatchToProps = dispatch => ({
    onToggleWindowVisibility: () => dispatch(toggleHiddenDebuggingWindowVisibility())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HiddenDebuggingWindow);
