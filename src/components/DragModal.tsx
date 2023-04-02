import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { findDOMNode } from "react-dom";
import VrpIcon from "./VrpIcon";
const css = require("../styles/custom.css");

export default function DragModal({
  title,
  centered,
  defaultPosition,
  bounds: _bounds,
  children,
  fixed = true,
  style: _style,
  className = "",
  onClose,
  ...rest
}) {
  const [position, setPosition] = useState(defaultPosition || { x: 0, y: 0 });
  const [bounds, setBounds] = useState(
    _bounds || { left: 0, top: 0, right: 0, bottom: 0 }
  );
  const ref = useRef({});
  const containerStyle = {
    position: fixed ? "fixed" : "absolute",
    top: 0,
    left: 0,
    width: 0,
    pointerEvents: "none"
  };
  const style = { width: 520, pointerEvents: "auto", ..._style };

  useEffect(
    () => {
      window.addEventListener("resize", resize);
      if (ref.current) {
        let rect = getRect();
        if (centered) {
          setPosition({
            x: document.body.clientWidth / 2 - rect.width / 2,
            y: document.body.clientHeight / 2 - rect.height / 2
          });
        }
        setBounds({
          ...bounds,
          right: document.body.clientWidth - rect.width,
          bottom: document.body.clientHeight - rect.height
        });
      }
      return () => window.removeEventListener("resize", resize);
    },
    [!!ref.current]
  );

  const getRect = () =>
    ref.current
      ? findDOMNode(ref.current).getBoundingClientRect()
      : { width: 0, height: 0 };

  const onControlledDrag = (e, position) => {
    const { x, y } = position;
    setPosition({ x, y });
  };

  const resize = e => {
    let rect = getRect();
    setBounds({
      ...bounds,
      right: document.body.clientWidth - rect.width,
      bottom: document.body.clientHeight - rect.height
    });
  };

  return (
    <div style={containerStyle}>
      <Draggable
        {...rest}
        {...(centered ? { position, onDrag: onControlledDrag } : {})}
        defaultPosition={position}
        bounds={bounds}
        ref={ref}
      >
        <div style={style} className={css["vrp-modal"] + " " + className}>
          <div className={"modal-header " + css["vrp-modal-header"]}>
            {title}
            <VrpIcon
              iconName={"icon-quit"}
              className={css["vrp-modal-close"]}
              onClick={e => (
                e.stopPropagation(),
                ref.current && findDOMNode(ref.current).remove(),
                onClose && onClose(e)
              )}
            />
          </div>
          <div className={css["vrp-modal-body"]} style={{ padding: 0 }}>
            {children}
          </div>
        </div>
      </Draggable>
    </div>
  );
}
