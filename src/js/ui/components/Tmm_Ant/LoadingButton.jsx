import { Button, Spin } from "antd";
import React, { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = <LoadingOutlined style={{ fontSize: 18, color: "#fff" }} spin />;
/**
 * @typedef {import('antd/es/button').ButtonProps} BtnProps
 */

/**
 *
 * @type { React.FunctionComponent<BtnProps> } props
 */

export const LoadingButton = ({ onClick, children, ...props }) => {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        const res = onClick();

        if (res instanceof Promise) {
            setLoading(true);
        }

        try {
            await res;
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button onClick={handleClick} {...props}>
            {loading && (
                <i style={{ marginRight: 6, fontStyle: "normal" }}>
                    <Spin indicator={antIcon} />
                </i>
            )}
            {children}
        </Button>
    );
};

export default LoadingButton;
