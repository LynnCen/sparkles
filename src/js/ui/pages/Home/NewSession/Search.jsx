import React, { useEffect, useRef, useState } from "react";
import classes from "./style.less";
import { PlusOutLine, SearchIcon } from "../../../icons";
import { FormattedMessage } from "react-intl";
import useDebounce from "../../../hooks/useDebounce";
import { useLocalFormat } from "../../../hooks/useLocalFormat";
import memberModel from "@newSdk/model/Members";
import initFriendsCache from "@newSdk/logic/initScript/initFriendsCache";
import SessionStore from "../../../stores_new/session";
import { pickerStore } from "components/TmmPickerBoard/pickerStore";
import createGroup from "utils/chatController/createGroup";
import { createSingleChatId } from "@newSdk/utils";
import UserInfo from "@newSdk/model/UserInfo";
// import { inject, observer } from "mobx-react";

// @inject((stores) => ({
//     selectSession: stores.NewSession.selectSession,
// }))
// @observer
export const SessionSearch = () => {
    const [value, setValue] = useState("");
    const { formatMessage } = useLocalFormat();
    const cancelCreateRef = useRef(null);
    const update = useDebounce(
        () => {
            SessionStore.updateSearch(value);
        },
        444,
        [value]
    );

    useEffect(() => {
        update();
    }, [value]);

    const handleCreateChat = () => {
        pickerStore.open({
            initialTab: pickerStore.TabEnum.Contacts,
            title: "CreateGroupChat",
            supportTab: [
                {
                    type: pickerStore.TabEnum.Contacts,
                    title: "Contacts",
                },
            ],
            okText: "ok",
            resultHandler: async (selectedTabs) => {
                const list = pickerStore.getTabList(selectedTabs, pickerStore.TabEnum.Contacts);

                const ids = list.map((user) => user.id);
                if (ids.length > 1) {
                    const control = createGroup(ids);
                    const { value: cancel } = await control.next();
                    cancelCreateRef.current = cancel;
                    const { value: res } = await control.next();
                    cancelCreateRef.current = null;
                    return res;
                } else {
                    const chatId = createSingleChatId(ids, UserInfo._id);

                    SessionStore.selectSession(chatId);
                }
            },
            cancelHandler: () => {
                if (cancelCreateRef.current) {
                    cancelCreateRef.current();
                }
            },
        });
    };
    return (
        <div className={classes.top}>
            <div className={classes.searchBar}>
                <SearchIcon
                    title={<FormattedMessage id="Search" />}
                    // bodyStyle={shouldUseDarkColors ? { color: "#595959" } : {}}
                />
                <input
                    id="search"
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={formatMessage({ id: "Search" })}
                    type="text"
                    value={value}
                />
            </div>
            <aside className={classes.createChat} onClick={handleCreateChat}>
                <PlusOutLine />
            </aside>
        </div>
    );
};

export default SessionSearch;
