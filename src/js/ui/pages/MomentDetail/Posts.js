import React from "react";
import styles from "./Comment/index.less";
import cs from "./index.less";
import MainContent from "./Comment/mainContent";
import Empty from "./Empty";
import { inject, observer } from "mobx-react";
import { groupBy, head, get } from "lodash";
import { getRepostList } from "@newSdk/logic/moments/getRepostLists";
import MomentFromNow from "components/MomentFromNow";

@inject((store) => ({
    getBaseUserInfo: store.UserInfoProxy.getBaseInfo,
    getComputedProxyInfo: store.UserInfoProxy.proxyInfo,
}))
@observer
class Posts extends React.Component {
    state = {
        uidArr: [],
        momentInfos: [],
    };
    componentDidMount() {
        this.getAllUserInfo();
    }

    getAllUserInfo = async () => {
        const { momentID, getBaseUserInfo } = this.props;
        const momentInfos = await getRepostList(momentID);
        const uidArr = (momentInfos || []).map(({ uid }) => uid);

        this.setState({ uidArr, momentInfos });
        uidArr && uidArr.map(({ uid }) => uid).forEach(getBaseUserInfo);
    };

    render() {
        const { getComputedProxyInfo } = this.props;
        const { uidArr, momentInfos } = this.state;

        const users = Array.from(uidArr, (uid) => {
            return getComputedProxyInfo(uid);
        });

        if (!uidArr.length) return <Empty content={"no reposts yet"} />;

        const momentMap = groupBy(momentInfos, "id");
        const usersMap = groupBy(users, "id");

        return (
            <div className={cs.comment_container}>
                {momentInfos.map((item) => {
                    const { uid, text, create_time } = item;
                    return (
                        <MainContent user={head(usersMap[uid])} textContent={text} isCompact>
                            <div className={styles.comment_maindisc}>
                                <div className={styles.comment_timedisplay}>
                                    <MomentFromNow timestamp={create_time} />
                                </div>
                            </div>
                        </MainContent>
                    );
                })}
            </div>
        );
    }
}

export default Posts;
