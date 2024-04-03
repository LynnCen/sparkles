import React from "react";
import { injectIntl } from "react-intl";
import Editor from "../BlockEditor";
import { CloseIconBolder } from "../../../icons";
import ThemeModal from "components/Tmm_Ant/ThemeModal";

import styles from "./index.less";

function ModalOfEditor({ onSend, toggleEditor, name, intl, shouldUseDarkColors }) {
    return (
        <ThemeModal
            wrapClassName={styles.comment_custom_modal}
            visible
            centered
            width={600}
            footer={null}
            closable={false}
        >
            <div className={`${styles.comment_modal_wrapper}`}>
                <div className={`${styles.comment_label} dark-theme-border_normal`}>
                    <div className={`${styles.comment_title} dark-theme-color_lighter`}>
                        @{name} {intl.formatMessage({ id: "reply" })}
                    </div>
                </div>
                <Editor send={onSend} shouldUseDarkColors={shouldUseDarkColors} />
                <div className={styles.comment_modal_close} onClick={toggleEditor}>
                    <CloseIconBolder overlayClass="dark-theme-color_lighter" />
                </div>
            </div>
        </ThemeModal>
    );
}

export default injectIntl(ModalOfEditor);
