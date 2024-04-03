import { CloseIconBolder, ForwardIcon } from "../../../../icons";
import React, { Component, Fragment } from "react";
import { inject, observer } from "mobx-react";
import { ThemeModal } from "components/Tmm_Ant/ThemeModal";
import ForwardMoments from "./view/ForwardMoments";
import styles from "./view/styles.less";
import MediaDownloadProxy from "../../store/mediaDownloadProxy";
import { message } from "antd";
import { injectIntl } from "react-intl";

/**
 * @Author Pull
 * @Date 2021-10-29 15:20
 * @project ForwardItem
 */

// export const ForwardItem = ({ forward, forwardInfo }) => {
//     // const { handleShow } = useForwardMoments(forwardInfo);
//     return (
//         <span
//             className="cr-p"
//             onClick={(e) => {
//                 e.stopPropagation();
//                 // handleShow();
//             }}
//         >
//             {/*<ForwardIcon overlayClassName="dark-theme-color_lighter" />{" "}*/}
//             {/*{forward && <span className="dark-theme-color_lighter">{forward}</span>}*/}
//         </span>
//     );
// };

@inject(({ ForwardMoments, MediaDownloadProxy }) => ({
    visible: ForwardMoments.visible,
    closeModal: ForwardMoments.closeModal,
    forwardInfo: ForwardMoments.forwardInfo,
    displayInfo: ForwardMoments.displayInfo,
    proxyMediaInfo: MediaDownloadProxy.getProxyInfo,
}))
@observer
export class ForwardItem extends Component {
    render() {
        const { visible, closeModal, forwardInfo, proxyMediaInfo, displayInfo, intl } = this.props;
        const renderMedia = proxyMediaInfo(displayInfo.media);
        return (
            <Fragment>
                <ThemeModal
                    footer={null}
                    width={600}
                    maskStyle={{
                        backgroundColor: "#0006",
                    }}
                    closeIcon={
                        <span onClick={closeModal}>
                            <CloseIconBolder
                                overlayClass="dark-theme-color_lighter"
                                bodyStyle={{ width: 30, height: 30 }}
                            />
                        </span>
                    }
                    title={"share"}
                    maskClosable={false}
                    wrapClassName={`${styles.modal} electron_drag-able`}
                    visible={visible}
                    onCancel={closeModal}
                >
                    <ForwardMoments
                        displayInfo={{ ...displayInfo, media: renderMedia }}
                        forwardInfo={forwardInfo}
                        handleClose={closeModal}
                    />
                </ThemeModal>
            </Fragment>
        );
    }
}

export default injectIntl(ForwardItem);
