/**
 * @Author Pull
 * @Date 2021-03-31 20:00
 * @project jsx
 */

import { Progress } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import React from "react";
import { useIntl } from "react-intl";
import NewVersion from "./newVersion";
import Failed from "./Failed";
import { CloseIconBolder } from "../../icons";
export default ({ show, percent, options, handleCancle, forceUpdate }) => {
    console.log({ show, percent, options, handleCancle, forceUpdate });
    const { formatMessage } = useIntl();
    function renderContent() {
        switch (options.type) {
            case "loading":
                return (
                    <LoadingOutlined
                        style={{
                            fontSize: 30,
                            color: "#1890ff",
                            position: "relative",
                            left: "50%",
                            marginLeft: -16,
                        }}
                    />
                );
            case "version":
                return <NewVersion versions={options.info} />;
            case "downloading":
                return (
                    <Progress
                        strokeColor="#0BCADE"
                        status="active"
                        percent={parseFloat(percent.toFixed(1))}
                    />
                );
            case "error":
                return <Failed />;
        }
    }
    return (
        <Modal
            visible={show}
            centered
            title={options.title}
            footer={null}
            width={options.type === "version" ? 640 : 520}
            onCancel={forceUpdate === 1 ? null : handleCancle}
            maskClosable={false}
            closeIcon={
                forceUpdate === 1 ? <div style={{ pointerEvents: "none" }} /> : <CloseIconBolder />
            }
        >
            {/* {percent > 0 ? (
                <Progress
                    strokeColor="#0BCADE"
                    status="active"
                    percent={parseFloat(percent.toFixed(1))}
                />
            ) : (
                <LoadingOutlined
                    style={{
                        fontSize: 30,
                        color: "#1890ff",
                        position: "relative",
                        left: "50%",
                        marginLeft: -16,
                    }}
                />
            )} */}
            {renderContent()}
        </Modal>
    );
};
