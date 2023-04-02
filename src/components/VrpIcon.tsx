import { forwardRef } from "react";

const css = require("../styles/custom.css");

/**
 * @name VrpIcon
 * @author: bubble
 * @create: 2018/11/30
 */

interface VrpIconProps {
  iconName: string;
  className?: string;
  title?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default forwardRef(
  ({ iconName, className, children, ...rest }: VrpIconProps, ref) => {
    return (
      <i
        className={
          css["vrp-icon"] + ` icon font_family ${iconName} ${className}`
        }
        ref={ref}
        {...rest}
      >
        {children}
      </i>
    );
  }
);
