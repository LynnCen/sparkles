/**
 * @Author Pull
 * @Date 2021-10-26 10:02
 * @project useUserSelect
 */

import React, { useRef, useState } from "react";
import UserSelect from "components/_N_UserSelect/UserSelect";
import { Modal, Button } from "antd";
import styles from "./baseStyle/useUserSelect.less";
import localeFormat from "utils/localeFormat";
import Common from "../stores_new/common";
import common from "../stores_new/common";

export const useUserSelect = (style, selectForce) => {
    const ref = useRef();
    const handleUserSelect = (initSelect) =>
        new Promise((resolve) => {
            const modal = Modal.info({
                header: null,
                footer: null,
                // closable: false,
                maskClosable: true,
                className: `${styles.modalContainer} ${common.shouldUseDarkColors && styles.dark}`,
                style,
                width: 280,
                onCancel: () => {
                    resolve([]);
                },
                content: (
                    <section>
                        <h4
                            style={{ textAlign: "center", paddingTop: 8 }}
                            className="dark-theme-color_lighter"
                        >
                            {localeFormat({ id: "SelectMembers" })}
                        </h4>
                        <UserSelect
                            initSelect={initSelect}
                            handleSubmit={() => {
                                const ids = ref.current.getSelectUser();
                                modal.destroy();
                                resolve(ids);
                            }}
                            ref={ref}
                        />
                    </section>
                ),
            });
        });

    return {
        handleUserSelect,
    };
};
