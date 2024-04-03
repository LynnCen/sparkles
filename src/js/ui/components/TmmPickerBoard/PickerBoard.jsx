import React, { Component, Fragment, createRef } from "react";
import ThemeModal from "components/Tmm_Ant/ThemeModal";
import styles from "./styles.less";
import { BackIcon2, SearchIcon, ContactsAdd, PublishContactsIcon } from "../../icons";
import { Button, Input } from "antd";
import { injectIntl, FormattedMessage } from "react-intl";
import { observer } from "mobx-react";
import { pickerStore } from "./pickerStore";
import RowItem from "components/TmmPickerBoard/RowItem";
import Avatar from "components/Avatar";
import classNames from "classnames";
import ImageIcon from "components/_N_ImageIcon/ImageIcon";
import LoadingButton from "components/Tmm_Ant/LoadingButton";
import TmmSearch from "components/TmmSearch/TmmSearch";
import Empty from "./Empty";

// const statusLineRef = createRef();

@observer
class TmmPickerBoard extends Component {
    state = {
        loading: false,
    };
    statusLineRef = createRef();

    renderTabIcon = (type) => {
        switch (type) {
            case pickerStore.TabEnum.Groups:
                return (
                    <div className={styles.groupIcon}>
                        <PublishContactsIcon />
                    </div>
                );
            case pickerStore.TabEnum.Recent:
                return (
                    <div className={styles.recentIcon}>
                        <ContactsAdd />
                    </div>
                );
            case pickerStore.TabEnum.Contacts:
                return (
                    <div className={styles.recentIcon}>
                        <ContactsAdd />
                    </div>
                );
            default:
                return null;
        }
    };

    renderList = ({ list = [], type, groupByKeys = {} }) => {
        if (pickerStore.searchText) {
            if (pickerStore.forward) {
                if (!list.length) return <Empty />;
                return list.map((item) => (
                    <RowItem
                        info={item}
                        type={type}
                        key={item.id || item.chatId}
                        selected={pickerStore.assertSelect("Forward", item)}
                    />
                ));
            }
            if (!list.length) return <Empty />;
            return list.map((item) => (
                <RowItem
                    info={item}
                    type={type}
                    key={item.id || item.chatId}
                    selected={pickerStore.assertSelect(type, item)}
                />
            ));
        }
        if (type !== pickerStore.TabEnum.Contacts) {
            if (!list.length) return <Empty />;
            return list.map((item) => (
                <RowItem
                    info={item}
                    type={type}
                    key={item.id || item.chatId}
                    selected={pickerStore.assertSelect(type, item)}
                />
            ));
        }

        const { keys, space } = groupByKeys;
        if (!keys.length) return <Empty />;
        return keys.map((key) => {
            const items = space[key] || [];
            return (
                <Fragment key={key}>
                    <div className={styles.anchor}>{key.toUpperCase()}</div>
                    {items.map((item) => (
                        <RowItem
                            info={item}
                            type={type}
                            key={item.id || item.chatId}
                            selected={pickerStore.assertSelect(type, item)}
                        />
                    ))}
                </Fragment>
            );
        });
    };

    // shouldComponentUpdate(nextProps, nextState, nextContext) {
    //
    // }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const on = (element, event, handler) => {
            if (element && event && handler) {
                element.addEventListener(event, handler, false);
            }
        };

        // const off = (
        //     element,
        //     event,
        //     handler
        // ) => {
        //     if (element && event) {
        //         element.removeEventListener(event, handler, false);
        //     }
        // };

        let targetDrag = {
            isDown: false,
            coord: {
                x: 0,
                y: 0,
            },
        };

        const scrollMousedown = (event) => {
            targetDrag.isDown = true;
            targetDrag.coord.x = event.pageX;
            targetDrag.coord.y = event.pageY;
        };
        const scrollMouseup = () => {
            if (targetDrag.isDown === true) {
                targetDrag.coord.x = 0;
                targetDrag.coord.y = 0;
                targetDrag.isDown = false;
            }
        };

        const scrollMousemove = (event) => {
            let movX = targetDrag.coord.x - event.pageX;
            targetDrag.coord.x = event.pageX;
            if (targetDrag.isDown) {
                this.statusLineRef.current.scrollLeft =
                    this.statusLineRef.current.scrollLeft + movX;
            }
        };

        if (this.statusLineRef.current) {
            on(this.statusLineRef.current, "mousedown", scrollMousedown);
            on(this.statusLineRef.current, "mouseup", scrollMouseup);
            on(this.statusLineRef.current, "mousemove", scrollMousemove);
        }
    }

    render() {
        const {
            intl: { formatMessage },
        } = this.props;
        const {
            selectedMap,
            activeTab,
            TabEnum: { Contacts, Recent, Groups },
        } = pickerStore;
        const selectedCount = Object.keys(selectedMap).length;
        return (
            <ThemeModal
                title={null}
                closeIcon={null}
                closable={false}
                footer={null}
                mask={false}
                width={360}
                visible={pickerStore.visible}
                wrapClassName={styles.customStyle}
            >
                <header className={styles.title}>
                    {pickerStore.title && formatMessage({ id: pickerStore.title })}

                    {activeTab.type !== pickerStore.initialTab && (
                        <span
                            className={styles.back}
                            onClick={() => {
                                pickerStore.searchText = "";
                                pickerStore.toggleTab(Recent);
                            }}
                        >
                            <BackIcon2 />
                        </span>
                    )}
                </header>

                <main className={styles.main}>
                    <section className={styles.fixed}>
                        <div className={styles.searchContainer}>
                            <TmmSearch
                                handleChange={(e) => {
                                    pickerStore.onSearch(e);
                                    this.setState({
                                        loading: true,
                                    });
                                    setTimeout(() => {
                                        this.setState({
                                            loading: false,
                                        });
                                    }, 100);
                                }}
                                value={pickerStore.searchText}
                            />
                        </div>
                        {selectedCount ? (
                            <div
                                className={styles.selected}
                                draggable="false"
                                ref={this.statusLineRef}
                            >
                                {Object.entries(pickerStore.selectedMap).map(([key, v], index) => (
                                    <div
                                        className={styles.avatar}
                                        title={v.name}
                                        key={v.avatar + index}
                                    >
                                        <i
                                            className={styles.removeIcon}
                                            onClick={() => pickerStore.removeSelect(key, v)}
                                        >
                                            <ImageIcon
                                                enumType={ImageIcon.supportEnumType.RemoveItemIcon}
                                            />
                                        </i>
                                        <Avatar src={v.avatar} size={32} />
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </section>

                    <section className={styles.list}>
                        {this.state.loading ? (
                            <ImageIcon
                                enumType={ImageIcon.supportEnumType.SEARCHLOADING}
                                overlayStyle={{
                                    width: "24px ",
                                    height: "24px ",
                                    minWidth: "unset",
                                    minHeight: "unset",
                                }}
                            />
                        ) : (
                            <React.Fragment>
                                {activeTab.type === Recent &&
                                    !pickerStore.searchText &&
                                    pickerStore.tabs.map((item, index) =>
                                        item.type === Recent ? null : (
                                            <div
                                                className={styles.tabItem}
                                                onClick={() => pickerStore.toggleTab(item.type)}
                                                key={index}
                                            >
                                                {this.renderTabIcon(item.type)}
                                                {item.title && formatMessage({ id: item.title })}
                                            </div>
                                        )
                                    )}
                                {pickerStore.searchText ? null : (
                                    <div
                                        className={classNames(styles.activeTab, {
                                            [styles.showBorder]: !selectedCount,
                                        })}
                                    >
                                        {pickerStore.activeTab.title &&
                                            formatMessage({ id: pickerStore.activeTab.title })}
                                    </div>
                                )}

                                {this.renderList(pickerStore.renderListInfo)}
                            </React.Fragment>
                        )}
                    </section>
                </main>

                <footer className={styles.footer}>
                    <Button onClick={pickerStore.onCancel}>
                        <FormattedMessage id="Cancel" />
                    </Button>
                    <LoadingButton disabled={!pickerStore.isSelected} onClick={pickerStore.onOk}>
                        {pickerStore.okText}
                        {selectedCount ? `(${selectedCount})` : null}
                    </LoadingButton>
                </footer>
            </ThemeModal>
        );
    }
}

export default injectIntl(TmmPickerBoard);
