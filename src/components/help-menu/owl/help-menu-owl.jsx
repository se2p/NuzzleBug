import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './help-menu-owl.css';
import owl1 from './owl-a.svg';
import owl2 from './owl-c.svg';

const HelpMenuOwlComponent = function (props) {
    const {
        text,
        flying,
        buttonText,
        onSubmit,
        enabled,
        injected
    } = props;

    let owl = owl1;
    if (flying){
        owl = owl2;
    }

    return (
        <div>
            <div>
                <img
                    className={styles.owl}
                    style={injected ? {
                        position: 'relative',
                        bottom: '0',
                        left: '410px'
                    } : null}
                    src={owl}
                />
                <div
                    className={classNames(styles.speechBubbleBox, styles.speechBubbleTriangle)}
                    style={injected ? {
                        position: 'relative',
                        bottom: '120px',
                        left: '50px'
                    } : null}
                >
                    <div
                        id="help-messages"
                        className={styles.helpMessages}
                    >
                        <div>
                            {text}
                        </div>
                        {/* Todo languages and css!*/}
                        {enabled ? <button
                            className={styles.owlButton}
                            onClick={onSubmit}
                        >{buttonText}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

HelpMenuOwlComponent.propTypes = {
    flying: PropTypes.bool,
    text: PropTypes.string,
    buttonText: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    enabled: PropTypes.bool.isRequired,
    injected: PropTypes.bool
};

HelpMenuOwlComponent.defaultProps = {
    buttonText: 'OK',
    onSubmit: null,
    text: 'No Text available',
    flying: false,
    enabled: false
};

export default HelpMenuOwlComponent;

