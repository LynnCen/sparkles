import { useEffect, useRef } from "react";
import { message } from "antd";
const css = require("../styles/custom.css");

export default function IconSvg({
  src = "",
  style = {},
  className = "",
  ...rest
}) {
  const icon = useRef(null);
  useEffect(
    () => {
      src &&
        icon.current &&
        fetch(src)
          .then(r => r.text())
          .then(r => {
            if (/^\<svg/.test(r)) icon.current.innerHTML = r;
            else {
              try {
                let res = JSON.parse(r);
                res.status == 404 && message.error("svg:", res.message);
              } catch (e) {
                console.error(e);
              }
            }
          })
          .catch(console.error);
    },
    [src]
  );
  return (
    <i
      style={style}
      className={css["vrp-icon"] + " " + className}
      ref={icon}
      {...rest}
    />
  );
}
