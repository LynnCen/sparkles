import { ReactNode, CSSProperties, useRef, useEffect } from "react";
// const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");
let vh = px => (px / 1080) * 100 + "vh";

export const Suffix = ({ name, value, unit }) => (
  <div
    className={scss["transparent"]}
    style={{ display: "flex", alignItems: "end" }}
  >
    <span>{name}</span>
    <span className={scss["value"]}>{value}</span>
    <span>{unit}</span>
  </div>
);

interface CardLayoutProps {
  triggerRef?: (ref) => void;
  title?: string | ReactNode;
  enTitle?: string;
  href?: string;
  placement?: "horizontal" | "vertical";
  children: ReactNode;
  style?: CSSProperties;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  className?: string;
  onClick?: (e) => void;
}

export default function CardLayout({
  triggerRef,
  title,
  enTitle,
  href = "",
  placement = "vertical",
  children,
  prefixIcon = null,
  suffixIcon = null,
  className,
  ...rest
}: CardLayoutProps) {
  const _ref = useRef();
  useEffect(() => {
    triggerRef && triggerRef(_ref.current);
  }, []);
  const verticalTitle = (
    <>
      {title ? (
        href ? (
          <a href={href} className={scss["pe-auto"]} target="_blank">
            <h1>{title}</h1>
          </a>
        ) : (
          <h1>{title}</h1>
        )
      ) : null}
      {enTitle ? <h5 className={scss["sub-title"]}>{enTitle}</h5> : null}
    </>
  );
  return (
    <div className={scss["card-layout"] + " " + className} {...rest} ref={_ref}>
      <div style={{ marginBottom: vh(enTitle ? 16 : title ? 24 : 0) }}>
        {placement == "vertical" ? (
          suffixIcon ? (
            <div className={scss["flex-between"]}>
              <div className={prefixIcon ? scss["flex"] : ""}>
                {prefixIcon ? (
                  <>
                    <div className={scss["prefixIcon"]}>{prefixIcon}</div>
                    <div>{verticalTitle}</div>
                  </>
                ) : (
                  verticalTitle
                )}
              </div>
              <div className={scss["suffixIcon"] + " " + scss["pe-auto"]}>
                {suffixIcon}
              </div>
            </div>
          ) : (
            verticalTitle
          )
        ) : (
          <div className={scss["flex"]}>
            {suffixIcon ? (
              <>
                <div>
                  {title ? <h1>{title}</h1> : null}
                  {enTitle ? (
                    <h5 className={scss["sub-title"]}>{enTitle}</h5>
                  ) : null}
                </div>
                <div>{suffixIcon}</div>
              </>
            ) : (
              <>
                {title ? <h1>{title}</h1> : null}
                {enTitle ? (
                  <h5
                    className={scss["sub-title"]}
                    style={{ lineHeight: "inherit" }}
                  >
                    {enTitle}
                  </h5>
                ) : null}
              </>
            )}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
