/**
 * @Author Pull
 * @Date 2021-11-02 10:53
 * @project reportContent
 */
import React, { useState } from "react";
import { Input, message, Spin } from "antd";

import styles from "../modal.less";
import report from "@newSdk/service/api/moments/report";
import NoFrameModal from "components/_N_noFrameModal/NoFrameModal";
import localeFormat from "utils/localeFormat";
import { LoadingOutlined } from "@ant-design/icons";

const MaxSize = 500;
export const ReportContent = ({ mid, onClose = () => {}, ...props }) => {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if (input && input.length) {
            setLoading(true);
            report(mid, input)
                .then((res) => {
                    onClose();
                    setInput("");
                    message.success(localeFormat({ id: "reportSuccess" }));
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    return (
        <NoFrameModal
            width={540}
            onClose={onClose}
            centered
            footer={null}
            title={localeFormat({ id: "report" })}
            {...props}
        >
            <section className={styles.reportModal} onMouseDown={(e) => e.stopPropagation()}>
                <Input.TextArea
                    maxLength={MaxSize}
                    autoSize={false}
                    bordered={false}
                    // showCount
                    allowClear
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={localeFormat({ id: "reportPlaceholder" })}
                />

                <aside className={styles.count}>
                    {input.length}/{MaxSize}
                </aside>

                <aside className={styles.submit}>
                    <button className={styles.btn} onClick={handleSubmit}>
                        {loading && (
                            <Spin indicator={<LoadingOutlined />} style={{ marginRight: 4 }} />
                        )}
                        {localeFormat({ id: "ConfirmTranslate" })}
                    </button>
                </aside>
            </section>
        </NoFrameModal>
    );
};

export default ReportContent;
