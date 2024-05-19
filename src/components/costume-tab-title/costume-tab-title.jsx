import PropTypes from 'prop-types';
import {FormattedMessage, injectIntl} from 'react-intl';
import React from 'react';

const CostumeTabTitleComponent = function (props) {
    return (
        <div>
            {props.targetIsStage ? (
                <FormattedMessage
                    defaultMessage="Backdrops"
                    description="Button to get to the backdrops panel"
                    id="gui.gui.backdropsTab"
                />
            ) : (
                <FormattedMessage
                    defaultMessage="Costumes"
                    description="Button to get to the costumes panel"
                    id="gui.gui.costumesTab"
                />
            )}
        </div>
    );
};

CostumeTabTitleComponent.propTypes = {
    targetIsStage: PropTypes.bool
};

export default injectIntl(CostumeTabTitleComponent);
