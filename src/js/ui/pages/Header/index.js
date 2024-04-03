import React, { Component, Fragment } from "react";
import { remote, ipcRenderer, isElectron } from "../../../platform";
import { HeaderResizeMinIcon, HeaderResizeToggleIcon, HeaderCloseIcon } from "../../icons";
import classes from "./style.less";
import { inject, observer } from "mobx-react";
import ImageIcon, { supportEnumType } from "components/_N_ImageIcon/ImageIcon";
import { device } from "utils/tools";
import classNames from "classnames";

export const LocationEnum = {
    Chat: "chat",
    Contacts: "contacts",
    Moments: "moments",
};

@inject((store) => ({
    focusSessionId: store.NewSession.focusSessionId,
}))
@observer
export class Header extends Component {
    // close window
    close() {
        ipcRenderer.send("close-window");
    }

    // min window
    min() {
        ipcRenderer.send("min-window");
    }

    // toggle window size
    toggle() {
        ipcRenderer.send("toggle-max");
    }

    render() {
        const isMac = device.isMac();
        return (
            <Fragment>
                <section
                    className={classNames(classes.container, {
                        [classes.win]: !isMac,
                    })}
                >
                    <ImageIcon enumType={supportEnumType.TMMIcon} />
                    <h2 className={classes.title}>TMMTMM</h2>

                    {!isMac && (
                        <section className={classes.action}>
                            {[
                                { Icon: HeaderResizeMinIcon, handler: this.min },
                                { Icon: HeaderResizeToggleIcon, handler: this.toggle },
                                { Icon: HeaderCloseIcon, handler: this.close },
                            ].map(({ Icon, handler }, index) => (
                                <div onClick={handler} className={classes.item} key={index}>
                                    <Icon />
                                </div>
                            ))}
                        </section>
                    )}
                </section>
            </Fragment>
        );
    }
}
export default Header;
