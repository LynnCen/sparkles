/**
 * @Author Pull
 * @Date 2021-10-26 10:06
 * @project UserSelect
 */
import React, {
    Fragment,
    useCallback,
    useEffect,
    useState,
    forwardRef,
    useImperativeHandle,
} from "react";
import styles from "./styles.less";
import classNames from "classnames";
import { Button, Input, Modal, Spin } from "antd";
import { SearchIcon } from "../../icons";
import { splitFstName } from "utils/sn_utils";
import { UserItem, SplitLine } from "./UserItem";
import { FormattedMessage, injectIntl } from "react-intl";
import commonStore from "../../stores_new/common";
import MemberModal from "@newSdk/model/Members";
import localeFormat from "utils/localeFormat";
import { getNameWeight } from "utils/nameWeight";

export const UserSelect = forwardRef(({ initSelect = [], handleSubmit }, ref) => {
    const [friendsList, setFriendsList] = useState([]);
    const [renderList, setRenderList] = useState([]);
    const [search, setSearch] = useState("");

    const [isSelect, setIsSelect] = useState(false);
    useImperativeHandle(
        ref,
        () => ({
            getSelectUser,
        }),
        [renderList]
    );

    useEffect(() => {
        MemberModal.getAllMyFriends().then((list) => {
            setFriendsList(list);

            const initSelectIds = initSelect.map((item) => item.id);
            if (initSelectIds.length) setIsSelect(true);
            setRenderList(
                list.map((item) => ({
                    ...item,
                    isSelect: !!initSelectIds.includes(item.id),
                }))
            );
        });
    }, []);

    useEffect(() => {
        const i = renderList.findIndex((item) => item.isSelect);
        if (i !== -1) setIsSelect(true);
        else setIsSelect(false);
    }, [renderList]);

    useEffect(() => {
        if (!search) setRenderList(friendsList);
        const list = friendsList.filter((item) =>
            getNameWeight({
                alias: item.alias,
                name: item.name,
                uid: item.uid,
                status: item.status,
            }).includes(search)
        );
        setRenderList(list);
    }, [search]);

    const getSelectUser = () => {
        return renderList.filter((item) => item.isSelect).map((item) => item);
    };

    const sort = useCallback(() => {
        const spaceMap = {};
        renderList.forEach((item) => {
            const name = (item.friendAlias || item.name || "")[0];
            splitFstName(spaceMap, item, name);
        });

        // sort：
        Object.entries(spaceMap).forEach(([k, v]) => {
            v.sort((item1, item2) => {
                const aName = item1.friendAlias || item1.name || "";
                const bName = item2.friendAlias || item2.name || "";

                if (aName === bName) return 0;
                return aName > bName ? -1 : 1;
            });
        });
        const keys = Object.keys(spaceMap).sort();
        if (keys[0] === "#") keys.push(keys.shift());

        return {
            sortKeysArr: keys,
            spaceMap,
        };
    }, [renderList]);

    const onSelect = (id) => {
        const item = renderList.find((item) => item.id === id);
        if (item) {
            item.isSelect = !item.isSelect;

            setRenderList([...renderList]);
        }
    };

    const renderSourceList = () => {
        const { sortKeysArr, spaceMap } = sort();
        return sortKeysArr.map((item) => (
            <Fragment key={item}>
                <SplitLine title={item} />
                {spaceMap[item].map(
                    ({
                        isSelect,
                        friendAlias,
                        initSelected,
                        name,
                        id,
                        avatarPath,
                        status,
                        uid,
                    }) => (
                        <UserItem
                            key={id}
                            isSelected={isSelect}
                            initSelected={initSelected}
                            name={getNameWeight({
                                alias: friendAlias,
                                name: name,
                                uid: uid,
                                status: status,
                            })}
                            src={avatarPath}
                            onSelect={() => onSelect(id)}
                        />
                    )
                )}
            </Fragment>
        ));
    };

    const handleSearch = (value) => setSearch(value);

    const { shouldUseDarkColors } = commonStore;
    return (
        <Fragment>
            <section
                className={classNames(styles.mask, {
                    [styles.dark]: shouldUseDarkColors,
                })}
            >
                <section className={styles.container}>
                    <article>
                        <section className={styles.leftBox}>
                            <div className={styles.search}>
                                <Input
                                    prefix={
                                        <SearchIcon
                                            bodyStyle={
                                                shouldUseDarkColors ? { color: "#595959" } : {}
                                            }
                                        />
                                    }
                                    onChange={(e) => handleSearch(e.target.value)}
                                    value={search}
                                    placeholder={localeFormat({ id: "Search" })}
                                />
                            </div>
                            <div className={styles.list}>{renderSourceList()}</div>
                        </section>
                    </article>
                </section>
            </section>
            <footer className={`${styles.footer} dark-theme-bg_darkness`}>
                <Button
                    type="primary"
                    disabled={!isSelect}
                    className={classNames({
                        [`dark-theme-color_dark dark-theme-bg_light`]: !isSelect,
                    })}
                    shape="round"
                    onClick={handleSubmit}
                >
                    {localeFormat({ id: "ConfirmTranslate" })}
                </Button>
            </footer>
        </Fragment>
    );
});
export default UserSelect;
