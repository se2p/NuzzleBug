import bindAll from 'lodash.bindall';
import React from 'react';
import {injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import styles from './tutorial_creation.css';

// Utils class for pop up dialogs
class PopUp extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [

        ]);
        this.state = {
            isPopupOpen: false
        };
    }

    // this just renders the supplied content in an "elevated" panel and dims the background
    render () {
        return (
            <div>

                {this.props.open && (
                    <div
                        className={styles.popup}
                    >
                        <h2>{this.props.name}</h2>
                        {this.props.content}
                    </div>
                )}

                {/* Background overlay */}
                {this.props.open && (
                    <div
                        className={styles.popupCatcher}
                    />
                )}
            </div>
        )
        ;
    }
}

PopUp.propTypes = {
    name: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    content: PropTypes.object,
    open: PropTypes.bool
};


export default injectIntl(PopUp);
