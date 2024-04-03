/**
 * @Author Pull
 * @Date 2021-11-10 14:59
 * @project ThemeModal
 */
import { Modal } from "antd";
import { observer } from "mobx-react";
import React, { Component } from "react";
import styles from "./styles.less";
import common from "../../stores_new/common";
import classNames from "classnames";

/**
 *
 * @typedef {import('antd/es/modal/Modal').ModalFuncProps} ModalFnProps
 */

/**
 * @typedef {import('antd/es/modal/Modal').ModalProps} ModalProps
 */

/**
 * @typedef {Object} ThemeExtra
 * @property {string} wrapClassName
 */

/**
 * @extends {React.Component<ModalProps & ThemeExtra>}
 * @property confirm()
 */
@observer
export class ThemeModal extends Component {
    /**
     *
     * @param {ModalFnProps} props
     */
    static confirm = ({ className, ...props }) => {
        return Modal.confirm({
            icon: null,
            ...props,
            className: `${styles.cuModalFn} ${className}`,
        });
    };
    /**
     * @param {{ a: string }} props
     */
    constructor(props) {
        super(props);
    }
    render() {
        const { children, wrapClassName, ...props } = this.props;
        return (
            <Modal
                wrapClassName={classNames(styles.cuModal, wrapClassName)}
                {...props}
                zIndex={10000}
            >
                {children}
            </Modal>
        );
    }
}

export default ThemeModal;
