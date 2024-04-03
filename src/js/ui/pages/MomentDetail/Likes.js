import React from "react";
import { inject, observer } from "mobx-react";
import { injectIntl } from "react-intl";
import Empty from "./Empty";
import { fetchMomentLikes } from "@newSdk/logic/moments/momentLikes";
import UserInfo from "components/UserInfo";
import { getNameWeight } from "utils/nameWeight";
import styles from "./index.less";

@inject((store) => ({
    getBaseUserInfo: store.UserInfoProxy.getBaseInfo,
    getComputedProxyInfo: store.UserInfoProxy.proxyInfo,
    likes: store.MomentLikes.likes,
    updateMomentLikes: store.MomentLikes.onUpdateLikes,
}))
@observer
class Likes extends React.Component {
    componentDidMount() {
        const { likes, momentID, getBaseUserInfo } = this.props;
        const uidArr = likes[momentID];
        uidArr && uidArr.map(({ uid }) => uid).forEach(getBaseUserInfo);
        fetchMomentLikes([momentID]);
    }

    render() {
        const { likes, momentID, intl } = this.props;
        const { getComputedProxyInfo } = this.props;

        const uidArr = likes[momentID];

        if (!uidArr || !uidArr.length)
            return <Empty content={intl.formatMessage({ id: "comment_empty" })} />;

        const users = Array.from(
            uidArr.map(({ uid }) => uid),
            (uid) => {
                return getComputedProxyInfo(uid);
            }
        );
        return (
            <div className={styles.like_container}>
                {users.map((item, index) => (
                    <div key={index} className={styles.like_itemwrapper}>
                        <UserInfo userInfo={item} size={32} />
                        <span className="dark-theme-color_lighter">
                            {getNameWeight({
                                friendAlias: item.friendAlias,
                                alias: item.alias,
                                name: item.name,
                                uid: item.uid,
                                status: item.status,
                            })}
                            {/* {item.friendAlias || item.name} */}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
}

export default injectIntl(Likes);
