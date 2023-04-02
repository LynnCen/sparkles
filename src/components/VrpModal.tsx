import { Component, ReactNode } from "react";
import { createPortal } from "react-dom";
import Draggable from "react-draggable";
import VrpIcon from "./VrpIcon";
import * as React from "react";

const css = require("../styles/scss/modal.scss");

/**
 * @name VrpModal
 * @author: bubble
 * @create: 2018/12/6
 * @description: 功能描述
 */

interface VrpModalProps {
  defaultPosition: { x: number; y: number };
  title: string | ReactNode;
  children: ReactNode;
  footer?: ReactNode | null;
  onClose?: (e?) => void;
  className?: string;
  height?: number; // 弹窗高度 当高度计算错误时 需传入
  style?: React.CSSProperties;
  baseBoxStyle?: React.CSSProperties;
  isDraggable?: any;
  fixed?: boolean;
}

interface VrpModalStates {
  offsetWidth: number;
  offsetHeight: number;
  clientWidth: number;
  clientHeight: number;
}

class VrpModal extends Component<VrpModalProps, VrpModalStates> {
  constructor(props) {
    super(props);
    const { clientWidth, clientHeight } = document.documentElement;
    this.state = {
      offsetWidth: 250,
      offsetHeight: 360,
      clientWidth,
      clientHeight
    };
  }

  /**
   * @description 获取元素大小
   * @param dom
   */
  getModal = dom => {
    if (dom) {
      this.setState({
        offsetWidth: dom.offsetWidth,
        offsetHeight: this.props.height ? this.props.height : dom.offsetHeight
      });
    }
  };

  /**
   * @description 重新获取视口的大小
   */
  getClient = () => {
    const { clientWidth, clientHeight } = document.documentElement;
    this.setState({
      clientWidth,
      clientHeight
    });
  };

  componentDidMount() {
    // 监听窗口大小变化
    window.addEventListener("resize", this.getClient);
  }

  componentWillUnmount() {
    // 移除监听
    window.removeEventListener("resize", this.getClient);
  }

  render() {
    const isEdit = window.location.hash.indexOf("#/edit") < 0;
    const {
      defaultPosition,
      baseBoxStyle,
      className,
      style,
      title,
      onClose,
      children,
      footer,
      isDraggable,
      fixed
    } = this.props;
    const modalClass = css["vrp-modal"] + " " + className || "";
    const { clientWidth, clientHeight, offsetWidth, offsetHeight } = this.state;
    const right = fixed && isEdit ? clientWidth - offsetWidth : clientWidth - offsetWidth - 42;
    const Modal = (
      <div className={css["custom-modal-box"]} style={fixed ? { position: "fixed" } : baseBoxStyle}>
        <Draggable
          defaultClassName="DraggableModal"
          onStart={() => (isDraggable ? isDraggable : true)}
          defaultPosition={defaultPosition}
          bounds={{
            top: 50,
            left: 0,
            right: right,
            bottom: clientHeight - offsetHeight - 2
          }}
          cancel={".no-cursor"}
        >
          <div className={modalClass} style={style} ref={this.getModal}>
            <div className={"modal-header " + css["vrp-modal-header"]}>
              {title}
              <VrpIcon
                iconName={"icon-quit"}
                className={css["vrp-modal-close"]}
                onClick={e => {
                  e.stopPropagation();
                  onClose(e);
                }}
              />
            </div>
            <div className={"no-cursor " + css["vrp-modal-body"]}>{children}</div>
            {footer ? (
              <div
                className={css["vrp-modal-footer"]}
                // style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 0px 3px 0px" }}
              >
                {footer}
              </div>
            ) : null}
          </div>
        </Draggable>
      </div>
    );
    return createPortal(Modal, document.querySelector("#modal-container")!);
  }
}

export default VrpModal;
