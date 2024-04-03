import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import Avatar from "components/Avatar";

import { MaleIcon, FemaleIcon } from "../../../icons";

import cs from "./index.less";
import { Button } from "antd";
import { getNameWeight } from "utils/nameWeight";

@inject((stores) => ({
    shouldUseDarkColors: stores.Common.shouldUseDarkColors,
}))
@observer
class MemberInfoCard extends Component {
    state = {
        loading: false,
    };

    render() {
        const { userInfo: info = {}, shouldUseDarkColors, intl } = this.props;
        // console.log(info);
        if (!info.id) return null;
        return (
            <section className={`${cs.container} fix dark-theme-bg_lighter `}>
                <header className={cs.header}>
                    <aside className={cs.avatar}>
                        <Avatar size={60} src={info.avatarPath || info.avatar} />
                        {!!info.gender && (
                            <span className={cs.gender}>
                                {info.gender === 1 ? (
                                    <MaleIcon bodyStyle={{ width: 10, height: 10 }} />
                                ) : (
                                    <FemaleIcon bodyStyle={{ width: 10, height: 10 }} />
                                )}
                            </span>
                        )}
                    </aside>

                    <aside className={cs.nameInfo}>
                        <p className={`${cs.name} dark-theme-color_lighter`} title={info.name}>
                            {getNameWeight({
                                name: info.name,
                                friendAlias: info.friendAlias,
                                alias: info.alias,
                                uid: info.uid,
                                status: info.status,
                            })}
                        </p>
                    </aside>

                    {info.signature && (
                        <aside className={`${cs.tmmdesc} dark-theme-color_lighter`}>
                            {info.signature}
                        </aside>
                    )}

                    <div className={cs.action}>
                        <Button
                            type={"primary"}
                            shape={"round"}
                            onClick={() =>
                                this.props.history.push(`/user/moments/${info.id}/moments`)
                            }
                        >
                            {intl.formatMessage({ id: "moments" })}
                        </Button>
                    </div>
                </header>
            </section>
        );
    }
}

export default injectIntl(withRouter(MemberInfoCard));
