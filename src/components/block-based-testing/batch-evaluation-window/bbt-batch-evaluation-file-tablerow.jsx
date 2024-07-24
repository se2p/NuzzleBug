import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import runAllIcon from '../icons/icon--start.png';
import loadProjectIcon from '../icons/open_in_browser_FILL0_wght300_GRAD0_opsz48.png';
import closeIcon from '../icons/close_FILL0_wght700_GRAD0_opsz48.png';
import trashIcon from '../icons/trash-icon.svg';

import styles from './bbt-batch-evaluation-file-tablerow.css';
import bbtHeaderStyles from '../bbt-header.css';

const BBTBatchEvaluationFileTableRow = props => (
    <tr>
        <td
            className={classNames(
                {
                    [styles.bold]: props.isCurrentlyLoadedProject
                }
            )}
        >{props.fileName}</td>
        <td>
            <div className={styles.controlDiv}>
                <img
                    className={classNames(
                        styles.tableRowButtons,
                        bbtHeaderStyles.icon,
                        bbtHeaderStyles.iconSmallerPadding,
                        {
                            [bbtHeaderStyles.iconDisabled]: props.iconsDisabled
                        }
                    )}
                    draggable={false}
                    src={runAllIcon}
                    onClick={props.iconsDisabled ? null : () => props.onRunAllTestsOnFile(props.fileId)}
                />
                <img
                    className={classNames(
                        styles.tableRowButtons,
                        bbtHeaderStyles.icon,
                        bbtHeaderStyles.iconSmallerPadding,
                        {
                            [bbtHeaderStyles.iconDisabled]: props.iconsDisabled
                        }
                    )}
                    draggable={false}
                    src={loadProjectIcon}
                    onClick={props.iconsDisabled ? null : () => props.onLoadProject(props.fileId)}
                />
                <img
                    className={classNames(
                        styles.tableRowButtons,
                        bbtHeaderStyles.icon,
                        bbtHeaderStyles.iconNormalPadding,
                        {
                            [bbtHeaderStyles.iconDisabled]: props.iconsDisabled
                        }
                    )}
                    draggable={false}
                    src={trashIcon}
                    onClick={props.iconsDisabled ? null : () => props.onClearAllTestStatus(props.fileId)}
                />
                <img
                    className={classNames(
                        styles.tableRowButtons,
                        bbtHeaderStyles.icon,
                        bbtHeaderStyles.iconSmallerPadding,
                        {
                            [bbtHeaderStyles.iconDisabled]: props.iconsDisabled
                        }
                    )}
                    draggable={false}
                    src={closeIcon}
                    onClick={props.iconsDisabled ? null : () => props.onRemoveFile(props.fileId)}
                />
            </div>

        </td>
        {props.resultTds}
    </tr>
);

BBTBatchEvaluationFileTableRow.propTypes = {
    resultTds: PropTypes.node,
    iconsDisabled: PropTypes.bool.isRequired,
    fileId: PropTypes.number.isRequired,
    fileName: PropTypes.string.isRequired,
    isCurrentlyLoadedProject: PropTypes.bool,
    onRunAllTestsOnFile: PropTypes.func.isRequired,
    onLoadProject: PropTypes.func.isRequired,
    onRemoveFile: PropTypes.func.isRequired,
    onClearAllTestStatus: PropTypes.func.isRequired
};

export default BBTBatchEvaluationFileTableRow;
