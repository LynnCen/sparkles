import React, { forwardRef, useEffect, useState } from "react";
import { createFromIconfontCN } from "@ant-design/icons";

interface IconProps {
  type?: string;
  src?: string; // svg
  className?: string;
  title?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const I = forwardRef(
  ({ type, src, className, children, ...rest }: IconProps, ref: (instance) => void) => {
    const [svg, setSvg] = useState(undefined);
    useEffect(() => {
      if (!type && src) {
        fetch(src)
          .then((r) => r.text())
          .then((r) => {
            setSvg(r);
          });
      }
    }, []);
    return (
      <i
        className={`pointer font_family ${type || ""} ${className}`}
        ref={ref}
        {...rest}
        {...(svg ? { dangerouslySetInnerHTML: { __html: svg } } : { children })}
      ></i>
    );
  }
);
// const Icon = createFromIconfontCN({
//   scriptUrl: "//at.alicdn.com/t/font_1062797_jhbb61ukng.js",
// });
export default I;
