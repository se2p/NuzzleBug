import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './help-menu-owl.css';
import owl1 from './owl-a.svg';
import owl2 from './owl-b.svg';
import {FormattedHTMLMessage} from 'react-intl';

const HelpMenuOwlComponent = function (props) {
    const {
        message,
        lookRight,
        buttonText,
        onSubmit,
        enabled,
        injected
    } = props;

    let owl = owl1;
    if (!lookRight){
        owl = owl2;
    }

    /* const [show, setShow] = useState(false);
    useEffect(() => {
        setTimeout(() => setShow(true), 300);
    }, []);*/

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
                {/* <CSSTransition
                    in={show}
                    timeout={200}
                    unmountOnExit
                    classNames="my-node"
                >*/}
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
                            <FormattedHTMLMessage
                                tagName="span"
                                {...message}
                            />
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
    lookRight: PropTypes.bool,
    message: PropTypes.string,
    buttonText: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    enabled: PropTypes.bool.isRequired,
    injected: PropTypes.bool
};

HelpMenuOwlComponent.defaultProps = {
    buttonText: 'OK',
    onSubmit: null,
    message: 'No Text available',
    lookRight: true,
    enabled: false
};

export default HelpMenuOwlComponent;
