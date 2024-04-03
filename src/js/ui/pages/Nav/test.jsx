/**
 * @Author Pull
 * @Date 2021-08-06 14:31
 * @project test
 */

import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import UserInfoModel from "@newSdk/model/UserInfo";
import { ipcRenderer, remote } from "../../../platform";
import { injectIntl } from "react-intl";
import messageModal from "@newSdk/model/Message";

@observer
class Test extends Component {
    handleClick = async () => {};
    render() {
        return (
            <div style={{ WebkitAppRegion: "no-drag" }}>
                <a href="javascript:void(0)" onClick={this.handleClick}>
                    click
                </a>
            </div>
        );
    }
}

export default injectIntl(Test);
