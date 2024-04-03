import React, { Fragment } from "react";
import { Badge, Dropdown } from "antd";
import Details from "./Details";
import propTypes from "prop-types";
import { NotificationIcon } from "../../../../icons";
import { inject, observer } from "mobx-react";

import cx from "./index.less";
import ThemeDropdown from "components/Tmm_Ant/ThemeDropdown";

@inject((store) => ({
    initNotifications: store.Notification.initNotifications,
    unReadCounts: store.Notification.counts,
    setCounts: store.Notification.setCounts,
}))
@observer
class MomentsNotification extends React.Component {
    state = {
        visible: false,
    };

    render() {
        const { size, overlayStyle, unReadCounts } = this.props;
        const { visible } = this.state;
        return (
            <ThemeDropdown
                trigger={"click"}
                onVisibleChange={(visible) => {
                    this.setState({ visible });
                }}
                overlay={<Details visible={visible} />}
                overlayClassName={cx.tmmtmm_dropdown}
            >
                <aside
                    className={cx.tmmtmm_dropdown_icon}
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <header
                        className={cx.win_header_mask}
                        style={{ display: visible ? "block" : "none" }}
                    />
                    <Badge
                        count={unReadCounts}
                        size={size}
                        style={{
                            fontSize: 12,
                            lineHeight: "15px",
                            minWidth: 15,
                            height: 15,
                            borderRadius: "15px",
                            padding: "0 3px",
                        }}
                    >
                        <NotificationIcon
                            bodyStyle={{ color: "#000", ...overlayStyle }}
                            overlayClassNames="dark-theme-color_lighter"
                        />
                    </Badge>
                </aside>
            </ThemeDropdown>
        );
    }
}

MomentsNotification.propTypes = {
    count: propTypes.number,
    size: propTypes.oneOf(["default", "small"]),
    dark: propTypes.bool,
};

export default MomentsNotification;
