import {ReactNode, CSSProperties, forwardRef} from "react";
import React from "react";
import {vh} from "utils/common";

export const CardLayoutSuffix = ({label, value = "", unit = "",value2="",unit2=""}) => (
    <div className={"default-suffix"}>
        <span>{label}</span>
        <span className={"value"}>{value}</span>
        <span>{unit}</span>
        <span className={"value"}>{value2}</span>
        <span>{unit2}</span>
    </div>
);

interface CardLayoutProps {
    title?: string | ReactNode;
    enTitle?: string;
    children: ReactNode;
    style?: CSSProperties;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    className?: string;
    onClick?: (e) => void;
}

function CardLayout(
    {title, enTitle, children, prefix, suffix, className = "", ...rest}: CardLayoutProps,
    ref
) {
    const Title = title && <h1 className={"card-layout-title"}>{title}</h1>;
    const EnTitle = enTitle && <h5 className={"card-layout-subTitle"}>{enTitle}</h5>;
    const headerTitle = (
        <>
            {Title}
            {EnTitle}
        </>
    );
    return (
        <div className={"card-layout " + className} {...rest} ref={ref}>
            <div style={{marginBottom: vh(enTitle ? 16 : title ? 24 : 0)}}>
                {suffix ? (
                    <div className={"flex-center-between"}>
                        <div>{headerTitle}</div>
                        <div className={"card-layout-suffix pe-auto"}>{suffix}</div>
                    </div>
                ) : (
                    headerTitle
                )}
            </div>
            {children}
        </div>
    );
}

export default forwardRef(CardLayout);
