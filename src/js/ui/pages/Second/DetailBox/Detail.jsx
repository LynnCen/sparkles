import React, { Component } from "react";
import { observer } from "mobx-react";
import contactsStore from "../stores";
import classNames from "classnames";
import styles from "./styles.less";
import ImageIcon from "components/_N_ImageIcon/ImageIcon";
import UserDetail from "./components/UserDetail";
import GroupDetail from "./components/GroupDetail";

@observer
export class Detail extends Component {
    render() {
        const {
            focusItemInfo: { type, info },
            TabEnum: { contacts, newFriend, groups },
        } = contactsStore;

        if (!type)
            return (
                <aside className={classNames(styles.empty, styles.container)}>
                    <ImageIcon enumType={ImageIcon.supportEnumType.TMMLogoIcon} />
                </aside>
            );

        return <UserDetail />;
    }
}

export default Detail;
