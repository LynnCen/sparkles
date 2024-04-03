import React, { Component, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import ThemeModal from "components/Tmm_Ant/ThemeModal";
import styles from "./styles.less";
import { Button, Spin } from "antd";
import { DelIcon, VideoStart } from "../../icons";
import store, { fileModalStore } from "./fileModalStore";
import { FormattedMessage, injectIntl } from "react-intl";
import { supportFile } from "../../pages/Home/NewChat/components/Message/MessageContent/FileContent/M_FileMessage";
import formatSize from "utils/file_size";
import classNames from "classnames";
import { shell } from "electron";
import renderFileName from "utils/dom/renderFileName";
import ImageIcon from "components/_N_ImageIcon/ImageIcon";

@observer
class TmmFileListModal extends Component {
    render() {
        return (
            <ThemeModal
                width={400}
                title={null}
                closeIcon={null}
                closable={false}
                footer={null}
                visible={store.visible}
                mask={false}
                wrapClassName={styles.customStyle}
            >
                <section className={styles.container}>
                    <header className={styles.header}>select file</header>
                    <article className={styles.content}>
                        <section className={styles.list}>
                            {fileModalStore.isLoading ? (
                                <ImageIcon
                                    enumType={ImageIcon.supportEnumType.SEARCHLOADING}
                                    overlayStyle={{
                                        width: "24px ",
                                        height: "24px ",
                                        minWidth: "unset",
                                        minHeight: "unset",
                                    }}
                                />
                            ) : (
                                store.fileList.map((item, i) => {
                                    return <Item item={item} i={i} key={item.key} />;
                                })
                            )}
                        </section>

                        <footer className={styles.footer}>
                            <button onClick={store.close}>
                                <FormattedMessage id="Cancel" />
                            </button>
                            <button disabled={!store.fileList.length} onClick={store.send}>
                                <FormattedMessage id="SendOut" />
                            </button>
                        </footer>
                    </article>
                </section>
            </ThemeModal>
        );
    }
}

const Item = ({ item, i }) => {
    const renderContent = (info) => {
        const { type, dataset } = info;
        const { Image, File, Video } = fileModalStore.MEDIA_TYPE;
        const handleMap = {
            [Image]: handleRenderImage(dataset),
            [File]: handleRenderFile(dataset),
            [Video]: handleRenderVideo(dataset),
        };
        return handleMap[type];
    };

    const handleRenderImage = (dataset) => {
        return (
            <img
                className={styles.icon}
                src={dataset.localPath}
                alt=""
                onClick={handlePreviewImage}
            />
        );
    };
    const handlePreviewImage = () => {};

    const handleRenderFile = (dataset) => {
        return (
            <img
                className={styles.icon}
                src={`assets/images/filetypes/${
                    supportFile[(dataset.ext || "").toLowerCase()] || "unknown"
                }.png`}
                alt=""
            />
        );
    };
    const handleRenderVideo = (dataset) => {
        return (
            <div className={classNames(styles.icon, styles.video)}>
                <img src={dataset.posterFullPath} alt="" />
                <aside className={styles.mask} onClick={() => shell.openItem(dataset.localPath)}>
                    <VideoStart />
                </aside>
            </div>
        );
    };

    const [name, setName] = useState(item.dataset.name || "");
    const wrap = useRef();
    useEffect(() => {
        if (wrap.current) {
            const width = wrap.current.clientWidth;
            const fontSize = parseInt(getComputedStyle(wrap.current).fontSize, 10);

            const suffixLen = item.dataset.ext.length || 0;
            const str = renderFileName(name, "", {
                MAX_WIDTH: width,
                FONT_SIZE: fontSize,
                RETAIN_LEN: suffixLen + 5,
            });

            setName(str);
        }
    }, []);
    return (
        <section className={styles.item}>
            {renderContent(item)}
            <div className={styles.text} ref={wrap}>
                <span>{name}</span>
                <span>{formatSize(item.dataset.size)}</span>
            </div>
            <span className={styles.del} onClick={() => store.delete(i)}>
                <DelIcon />
            </span>
        </section>
    );
};

export default injectIntl(TmmFileListModal);
