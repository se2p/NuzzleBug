import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';

import {toggleHiddenDebuggingWindowVisibility} from '../reducers/hidden-debugging';
import HiddenDebuggingWindowComponent from '../components/hidden-debugging-window/hidden-debugging-window.jsx';
import VM from 'scratch-vm';
import ScratchBlocks from 'scratch-blocks';

class HiddenDebuggingWindow extends React.Component {
    constructor(props) {
        super(props);

        bindAll(this, []);
    }

    render() {

        const params = new URL(window.location.href).searchParams;
        const urlParams = {};

        params.forEach((value, key) => {
            urlParams[key] = value;
        });

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
                    <button type="button" onClick={() => console.log(ScratchBlocks)}>
                        {'Log ScratchBlocks to console'}
                    </button>
                </div>
                <br/>
                <div>
                    <button type="button"
                            onClick={() => console.log(ScratchBlocks.getMainWorkspace().getFlyout().getWorkspace())}>
                        {'Log Flyout Workspace to console'}
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
                <br/>
                <div>
                    <button
                        type="button"
                        onClick={() => {

                            const classNamesToHide = [
                                'blocklyMainWorkspaceScrollbar',
                                'blocklyFlyoutScrollbar',
                                'blocklyZoom'
                            ];

                            for (const cl of classNamesToHide) {
                                const elements = document.getElementsByClassName(cl);

                                for (const element of [...elements]) {
                                    element.style.display = 'none';
                                }
                            }

                            const watermark = document.querySelectorAll('[ class^="gui_watermark" ]');
                            watermark[0].style.display = 'none';
                        }}
                    >
                        {'Hide workspace elements'}
                    </button>
                </div>

                <br/>
                <br/>

                <div>{'Info'}</div>
                <pre>
                    {'.env file variables:\n'}
                    {JSON.stringify(process.env.ALL_ENV_FILE_VARIABLES, null, 2)}
                </pre>
                <pre>
                    {'URL parameters:\n'}
                    {JSON.stringify(urlParams, null, 2)}
                </pre>
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
