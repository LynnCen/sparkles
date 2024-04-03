/**
 * @Author Pull
 * @Date 2021-10-31 11:11
 * @project MomentActions
 */

import React, { Fragment } from "react";
import { ActionAuth, ActionRole, tabs } from "./constants";
import { Popover } from "antd";
import { GreyMoreActionIcon } from "../../../../../icons";
import styles from "../moments.module.less";
import classNames from "classnames/bind";
import useAction from "./useAction";
import tmmUserInfo from "@newSdk/model/UserInfo";
import ReportModal from "../../modals/report/ReportContent";
import ThemePopover from "components/Tmm_Ant/ThemePopover";
import { AuthType } from "@newSdk/model/moments/instance/MomentsNormalContent";
import localeFormat from "utils/localeFormat";
const cx = classNames.bind(styles);

export const MomentActions = ({ momentInfo }) => {
    const { uid, id, authType } = momentInfo;
    const {
        handleClick,
        reportModal,
        hideReportModal,
        popVis,
        show,
        hide,
        disableShare,
    } = useAction(momentInfo);

    const renderTabs =
        uid === tmmUserInfo._id ? tabs : tabs.filter(({ auth }) => auth === ActionAuth.All);

    return (
        <Fragment>
            <div onMouseDown={(e) => e.stopPropagation()}>
                <ThemePopover
                    placement="leftTop"
                    visible={popVis}
                    trigger="click"
                    overlayClassName={cx("user-action-list", "dark-theme-bg_darkness")}
                    onVisibleChange={(visible) => {
                        if (!visible) hide();
                    }}
                    content={() => (
                        <ul className={cx("list")}>
                            {renderTabs.map(({ Icon, label, role }) => (
                                <li
                                    className={cx(
                                        "item",
                                        disableShare && role === ActionRole.SEND && "disable"
                                    )}
                                    key={role}
                                    onClick={() =>
                                        handleClick(role, disableShare && role === ActionRole.SEND)
                                    }
                                >
                                    <span className={cx("icon")}>
                                        <Icon overlayClass="dark-theme-color_lighter" />
                                    </span>
                                    <span className={cx("label", "dark-theme-color_lighter")}>
                                        {localeFormat({ id: label })}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                >
                    <aside className={cx("user-action")} onClick={show}>
                        <GreyMoreActionIcon />
                    </aside>
                </ThemePopover>
            </div>

            <ReportModal mid={id} visible={reportModal} onClose={hideReportModal} />
        </Fragment>
    );
};

export default MomentActions;
