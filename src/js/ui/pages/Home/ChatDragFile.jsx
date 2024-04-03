import React, { Fragment, useEffect, useState } from "react";
import classes from "./style.less";
import session from "../../stores_new/session";
import classNames from "classnames";
import { sendMsgWithDrag } from "utils/file/sendDropFile";
import { fileModalStore } from "components/TmmFileListModal/fileModalStore";

let ref = null;
const KEY = `nativeDragMedia`;
export const ChatDragFile = () => {
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        window.addEventListener("dragenter", handleDragenter);
        window.addEventListener("dragleave", handleHide);
        window.addEventListener("drop", handleDrop);
        // window.ondragend = (e) => {
        //     return false;
        // };

        return () => {
            window.removeEventListener("dragenter", handleDragenter);
            window.removeEventListener("dragleave", handleHide);
            window.removeEventListener("drop", handleDrop);
        };
    }, []);

    const handleDragenter = (e) => {
        if (!session.focusSessionId) return;
        ref = e.target; // 记录最后进入的元素
        setDragging(true);
    };

    const handleHide = (e) => {
        if (ref === e.target) {
            e.stopPropagation();
            e.preventDefault();
            setDragging(false);
        }
    };

    const handleDrop = (e) => {
        setDragging(false);
        if (e.target.dataset.mask === KEY||fileModalStore.visible) {
            sendMsgWithDrag({
                chatId: session.focusSessionId,
                files: e.dataTransfer.files,
            });
        }
    };
    return (
        <Fragment>
            {/* {fileModalStore.dragOutVisible ? null : (
                <aside
                    className={classNames(classes.dragTip, {
                        [classes.dragging]: dragging && !fileModalStore.visible,
                    })}
                >
                    <div className={classes.inner}>
                        <h2>Drop files here</h2>
                        <p>to send them as document</p>
                    </div>
                </aside>
            )} */}

            <aside
                className={classes.mask}
                style={{
                    visibility: dragging ? "visible" : "hidden",
                }}
                data-mask={KEY}
            />
        </Fragment>
    );
};

export default ChatDragFile;
