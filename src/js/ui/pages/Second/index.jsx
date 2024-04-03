import React, { useLayoutEffect } from "react";
import styles from "./styles.less";
import ListSection from "./ListSection/ListSection";
import contactsStore from "./stores";
import Detail from "./DetailBox/Detail";
import SearchMember from "./ListSection/Components/searchMember";
import initGroupCache from "@newSdk/logic/initScript/initGroupCache";
import getContactsIds from "@newSdk/service/api/getContactsIds";
import updateUserInfo from "@newSdk/logic/updateFriendsInfo";

const initContact = async () => {
    initGroupCache();
    const items = await getContactsIds();
    updateUserInfo(items, { isInit: false });
};
export const Contacts = () => {
    useLayoutEffect(() => {
        contactsStore.init();
        initContact();
        return () => {
            contactsStore.clear();
        };
    }, []);
    return (
        <section className={styles.layout}>
            <aside className={styles.left}>
                <ListSection />
            </aside>
            <article className={styles.right}>
                <Detail />
            </article>

            <SearchMember />
        </section>
    );
};

export default Contacts;
