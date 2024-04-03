import React from "react";
import classes from "../../pages/Nav/style.less";
import MemberInfoCard from "components/MemberInfoCard";
import { Popover } from "antd";
import { inject, observer } from "mobx-react";
import Avatar from "../Avatar";
import getUserList from "@newSdk/service/api/getUserListInfo";

import defaultAvatar from "images/user-fallback.png";
import "./style.global.less";

@observer
export default class UserInfo extends React.Component {
    state = { visible: false };

    get styleObj() {
        const { size = 44, noAvatar = false, style = {} } = this.props;

        return !noAvatar
            ? {
                  borderRadius: "50%",
                  width: size,
                  height: size,
                  ...style,
              }
            : {};
    }

    onClose = () => {
        this.setState({ visible: false });
    };

    onToggleVisible = () => {
        this.setState({ visible: !this.state.visible });
        getUserList([this.props.userInfo.uid]);
    };

    render() {
        const {
            size = 44,
            style = {},
            userInfo,
            uid,
            noAvatar = false,
            children,
            placement,
            ...rest
        } = this.props;
        const { avatarPath, avatar: avatarOb } = userInfo || {};
        const path = avatarPath;
        const avatar = typeof avatarOb === "string" ? avatarOb || path : path;

        return (
            <Popover
                trigger="click"
                visible={this.state.visible}
                overlayClassName={classes.userPopCard}
                placement={placement || "rightTop"}
                content={<MemberInfoCard userInfo={userInfo} {...rest} onClose={this.onClose} />}
                onVisibleChange={(visible) => {
                    this.setState({ visible });
                }}
            >
                <div style={this.styleObj} onClick={this.onToggleVisible}>
                    {!noAvatar && (
                        <Avatar style={{ cursor: "pointer" }} avatar={avatar} size={size} />
                    )}
                    {children}
                </div>
            </Popover>
        );
    }
}
