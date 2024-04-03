import React, { Component } from "react";
import TmmSearch from "components/TmmSearch/TmmSearch";
import { Button } from "antd";
import styles from "./styles.less";
import { injectIntl } from "react-intl";
import { PlusOutLine } from "../../../icons";
import { observer } from "mobx-react";
import contactsStore from "../stores";
import LineBox from "./LineBox";
import commonStore from "../../../stores_new/common";
import RenderGroups from "./Components/RenderList/RenderGroups";
import RenderUser from "./Components/RenderList/RenderUser";

@observer
export class ListSection extends Component {
    searchTimer = null;
    renderListItem = (type, list) => {
        const { groups, contacts, newFriend } = contactsStore.TabEnum;
        if (type === groups) return <RenderGroups list={list} />;
        if ([contacts, newFriend].includes(type)) return <RenderUser list={list} type={type} />;
    };

    handleSearch = (val) => {
        if (this.searchTimer) clearTimeout(this.searchTimer);

        this.searchTimer = setTimeout(() => {
            contactsStore.searching(val);
            this.searchTimer = null;
        }, 244);
    };

    render() {
        const { intl } = this.props;
        const { groups, contacts, newFriend } = contactsStore.TabEnum;
        return (
            <section className={styles.container}>
                <div className={styles.search}>
                    <TmmSearch handleChange={this.handleSearch} />
                </div>

                <aside className={styles.addFriendBtn} onClick={contactsStore.handleToggleVisible}>
                    <PlusOutLine />
                    <span className={styles.text}>{intl.formatMessage({ id: "AddFriends" })}</span>
                </aside>

                {contactsStore.renderList.map(({ list = [], title, type, isOpen }) => (
                    <LineBox
                        key={type}
                        title={title}
                        type={type}
                        flag={isOpen}
                        onClick={() => contactsStore.handleToggle(type)}
                        isShowBadge={type === newFriend && commonStore.isNewFriend}
                        count={[contacts, groups].includes(type) && list.length}
                    >
                        {isOpen && this.renderListItem(type, list)}
                    </LineBox>
                ))}
            </section>
        );
    }
}

export default injectIntl(ListSection);
