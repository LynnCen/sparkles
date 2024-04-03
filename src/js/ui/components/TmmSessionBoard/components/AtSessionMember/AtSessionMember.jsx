import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styles from "./styles.less";
import Avatar from "components/Avatar";
import { getNameWeight } from "utils/nameWeight";
import { sessionBoardStore } from "../../sessionBoardStore";
import MemberItem from "./AtMember";
import { AtAll } from "../../../../icons";
import classNames from "classnames";
import { injectIntl } from "react-intl";
import tmmUserInfo from "@newSdk/model/UserInfo";
import { AT_ALL, TYPE_AT_ALL } from "@newSdk/model/message/AtMessageContent";
import { userStatus } from "@newSdk/consts/userStatus";
/**
 * @typedef { Object } IProps
 * @property { string } uid
 * @property { boolean } removeAble
 */

// @inject((stores) => ({
//     viewAtList: stores.SessionBoardStore.viewAtList,
// }))
/**
 * @extends {React.Component<IProps>}
 */
const fatherRef = React.createRef();
const childrenrRef = React.createRef();
@inject((stores) => ({
    proxyUserBaseInfo: stores.UserProxyEntity.getUserInfo,
    proxyUserInfoInGroup: stores.UserProxyEntity.getUserInfoInGroup,
    getProxyUserInfoInGroup: stores.UserProxyEntity.getProxyUserInGroupInfo,
    focusSessionId: stores.NewSession.focusSessionId,
}))
@observer
export class AtSessionMember extends Component {
    value = 0;
    componentDidMount() {
        this.handleKeyDown({ keyCode: null });
        window.addEventListener("keydown", this.handleKeyDown);
    }
    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown);
    }
    getInfo = (uid) => {
        const { getProxyUserInfoInGroup, focusSessionId } = this.props;
        const info = getProxyUserInfoInGroup(focusSessionId, uid);
        const name = getNameWeight({
            friendAlias: info.friendAlias,
            alias: info.alias,
            name: info.name,
            uid: info.uid,
            status: info.status,
        });
        return {
            info,
            name,
        };
    };
    handleKeyDown = (e) => {
        let { scrollTop, children } = fatherRef.current;
        if (!fatherRef.current) return;
        // up
        if (e.keyCode == 38) {
            //judge the cunrent position
            this.value <= 0 ? (this.value = children.length - 1) : this.value--;
            //Current column position < Rolling distance   Description is currently listed above the visible area  Scroll up
            if (children[this.value].offsetTop < scrollTop) {
                fatherRef.current.scrollTop = children[this.value].offsetTop;
            } else if (children[this.value].offsetTop > scrollTop + 152) {
                fatherRef.current.scrollTop = children[this.value].offsetTop - 152;
            }
        } //down
        else if (e.keyCode == 40) {
            this.value >= children.length - 1 ? (this.value = 0) : this.value++;
            //Current column position > Distance scrolled up + Size of visible area  Indicates that the current column is under the visible area  Scroll down
            if (children[this.value].offsetTop > scrollTop + 152) {
                fatherRef.current.scrollTop = children[this.value].offsetTop - 152;
            } else if (children[this.value].offsetTop < scrollTop) {
                fatherRef.current.scrollTop = children[this.value].offsetTop;
            }
        } else if (e.keyCode == 13) {
            //filter myself
            const filterList = sessionBoardStore.sortedList.filter(
                (uid) =>
                    uid !== tmmUserInfo._id && this.getInfo(uid).info.status !== userStatus.Deleted
            );
            const { intl, hanldeAtMember } = this.props;
            const { formatMessage } = intl;
            const { isOwner, uid } = sessionBoardStore.ownerInfo;
            //Judge whether I am a group leader
            // const isGroupOwner = isOwner && uid === tmmUserInfo._id;
            const isEditAble = this.editAble();
            const currentUid = isEditAble ? filterList[this.value - 1] : filterList[this.value];
            const { name, info } = this.getInfo(currentUid);
            if (isEditAble && this.value == 0) {
                // atAll
                hanldeAtMember(AT_ALL, formatMessage({ id: "AtMentionAll" }));
            } else {
                //others
                hanldeAtMember(currentUid, name);
            }
        }
        //set current backgroundColor
        [...children].forEach((item, index) => {
            if (index == this.value) {
                children[index].style.backgroundColor = "var(--spec-create-chat-btn)";
            } else {
                children[index].style.backgroundColor = null;
            }
        });
    };
    editAble = () => {
        const { ownerInfo, adminsInfo } = sessionBoardStore;
        if (
            ownerInfo.uid === tmmUserInfo._id ||
            adminsInfo.find(({ uid }) => uid === tmmUserInfo._id)
        )
            return true;
        return false;
    };
    render() {
        const { intl, hanldeAtMember, group, viewAtList } = this.props;
        const { formatMessage } = intl;
        const { isOwner, uid } = sessionBoardStore.ownerInfo;
        const filterList = sessionBoardStore.sortedList.filter((uid) => uid !== tmmUserInfo._id);
        return group && viewAtList ? (
            <section className={styles.atWrapper} ref={fatherRef}>
                {
                    // isOwner && uid === tmmUserInfo._id
                    this.editAble() ? (
                        <div
                            className={classNames(styles.atRow, styles.addMember)}
                            onClick={() => {
                                hanldeAtMember(AT_ALL, formatMessage({ id: "AtMentionAll" }));
                            }}
                        >
                            <div className={styles.addIcon}>
                                <AtAll />
                            </div>
                            <span className={styles.name}>
                                {formatMessage({ id: "AtMentionAll" })}
                            </span>
                        </div>
                    ) : null
                }

                {filterList.map((uid) => {
                    return (
                        <MemberItem
                            ref={childrenrRef}
                            key={uid}
                            uid={uid}
                            hanldeAtMember={hanldeAtMember}
                        />
                    );
                })}
            </section>
        ) : null;
    }
}

export default React.memo(injectIntl(AtSessionMember));
