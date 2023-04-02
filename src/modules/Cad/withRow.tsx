import React from "react";
const css = require("../../styles/custom.css");

export function withRow(WrappedComponent) {
  return function({ className = "", style = {}, label = "", ...rest }) {
    return (
      <div className={css["flex-center-left"] + " " + className} style={style}>
        <label className={css["flex-none-label"]}>{label}</label>
        <WrappedComponent {...rest} />
      </div>
    );
  };
}
