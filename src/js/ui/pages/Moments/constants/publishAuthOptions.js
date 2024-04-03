/**
 * @Author Pull
 * @Date 2021-10-19 11:36
 * @project publishAuthOptions
 */

import React, { Fragment } from "react";
import {
    PublishContactsIcon,
    PublishDontShareIcon,
    PublishPrivateIcon,
    PublishPublicIcon,
    PublishShareWithIcon,
} from "../../../icons";
import { AuthType } from "@newSdk/model/moments/instance/MomentsNormalContent";
import localeFormat from "utils/localeFormat";

export const AuthIcon = {
    [AuthType.All]: (
        <PublishPublicIcon overlayClass="dark-theme-color_lighter" bodyStyle={{ marginRight: 6 }} />
    ),
    [AuthType.Contacts]: (
        <PublishContactsIcon
            overlayClass="dark-theme-color_lighter"
            bodyStyle={{ marginRight: 6, color: "var(--color-lighter)" }}
        />
    ),
    [AuthType.Private]: (
        <PublishPrivateIcon
            overlayClass="dark-theme-color_lighter"
            bodyStyle={{ marginRight: 6 }}
        />
    ),
    [AuthType.ShareWith]: (
        <PublishShareWithIcon
            overlayClass="dark-theme-color_lighter"
            bodyStyle={{ marginRight: 6 }}
        />
    ),
    [AuthType.DontShare]: (
        <PublishDontShareIcon
            overlayClass="dark-theme-color_lighter"
            bodyStyle={{ marginRight: 6 }}
        />
    ),
};

export const publishAuthOptions = [
    {
        value: AuthType.All,
        Icon: AuthIcon[AuthType.All],
        labelKey: "momentPubAll",
        label: ({ label }) => (
            <Fragment>
                <span className="auth_icon">{AuthIcon[AuthType.All]}</span> {label}
            </Fragment>
        ),
    },
    {
        value: AuthType.Private,
        labelKey: "momentPubPrivate",
        label: ({ label }) => (
            <Fragment>
                <span className="auth_icon">{AuthIcon[AuthType.Private]}</span> {label}
            </Fragment>
        ),
    },
    {
        value: AuthType.Contacts,
        labelKey: "momentPubFriends",
        label: ({ label }) => (
            <Fragment>
                <span className="auth_icon">{AuthIcon[AuthType.Contacts]}</span>
                {label}
            </Fragment>
        ),
    },
    {
        value: AuthType.ShareWith,
        labelKey: "momentPubOnlySelected",
        label: ({ children, label }) => (
            <Fragment>
                <span className="auth_icon">{AuthIcon[AuthType.ShareWith]}</span>
                {children || label}
            </Fragment>
        ),
    },
    {
        value: AuthType.DontShare,
        labelKey: "momentPubWithoutSelected",
        label: ({ children, label }) => (
            <Fragment>
                <span className="auth_icon">{AuthIcon[AuthType.DontShare]}</span>
                {children || label}
            </Fragment>
        ),
    },
];

export const defaultPublishAuthOptions = publishAuthOptions[0].value;
export default publishAuthOptions;
