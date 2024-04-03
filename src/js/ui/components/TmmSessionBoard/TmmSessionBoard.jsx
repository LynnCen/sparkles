import React, { Component, Fragment } from "react";
import { Drawer } from "antd";
import styles from "./styles.less";
import SessionInfo from "./components/SessionInfo/SessionInfo";
import SessionMember from "./components/SessionMember/SessionMember";
import SessionConfig from "./components/SessionConfig/SessionConfig";
import SessionManage from "./components/SessionMember/SessionManage";
import { SessionEdit } from "./components/SessionEdit/SessionEdit";
import SessionProfile from "./components/SessionProfile/SessionProfile";
import { observer } from "mobx-react";
import classNames from "classnames";
import { sessionBoardStore, SessionTab } from "components/TmmSessionBoard/sessionBoardStore";
import SessionAction from "./components/SessionAction/SessionAction";

@observer
export class TmmSessionBoard extends Component {
    renderSession = () => {
        switch (sessionBoardStore.viewSubList) {
            case SessionTab.Home:
                return (
                    <Fragment>
                        <SessionInfo />
                        <SessionProfile />
                        <SessionMember />
                        <SessionConfig />
                        <SessionAction />
                    </Fragment>
                );

            case SessionTab.AllMember:
                return <SessionMember />;
            case SessionTab.Manage:
                return <SessionManage />;
            case SessionTab.Edit:
                return <SessionEdit />;
        }
    };
    render() {
        if (!sessionBoardStore.visible) return null;
        return (
            <Fragment>
                <Drawer
                    className={styles.box}
                    closable={false}
                    maskClosable={true}
                    placement="right"
                    width={280}
                    onClose={sessionBoardStore.close}
                    visible={sessionBoardStore.visible}
                >
                    <section className={styles.board}>
                        {this.renderSession()}
                        {/* {sessionBoardStore.viewSubList ? (
                            <SessionMember />
                        ) : (
                            <Fragment>
                                <SessionInfo />
                                <SessionMember />
                                <SessionConfig />
                                <SessionAction />
                            </Fragment>
                        )} */}
                    </section>
                </Drawer>
            </Fragment>
        );
    }
}

export default TmmSessionBoard;
