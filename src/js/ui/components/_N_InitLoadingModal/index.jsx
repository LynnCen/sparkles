/**
 * @Author Pull
 * @Date 2021-08-26 15:36
 * @project index
 */
import React, { useEffect, useState, Fragment, useRef } from "react";
import { Modal } from "antd";
import classes from "./styles.less";
import { CuLoading, CuFail } from "../../icons";
import { InitLoadingStatus } from "@newSdk/model/UserInfo";
import { login as tmmSdkLogin } from "@newSdk/service/api";
import UserInfoModel from "@newSdk/model/UserInfo";
import nc, { Event } from "@newSdk/notification";
import { initPercentChange } from "@newSdk/logic/initScript/firstInitLoadingPercent";
import usePercentByStep from "../../hooks/usePercentByStep";
import localeFormat from "utils/localeFormat";

export const InitLoadingModal = () => {
    const [status, setStatus] = useState(UserInfoModel.loading);
    const { setPercent, displayPercent } = usePercentByStep(1);

    const isVisible = (status) => {
        return [InitLoadingStatus.LOADING, InitLoadingStatus.LOADING_FAIL].includes(status);
    };
    const [visible, setVisible] = useState(() => isVisible(UserInfoModel.loading));

    useEffect(() => {
        const isVis = isVisible(status);

        if (visible && !isVis) {
            // 动画延续
            setTimeout(() => setVisible(false), 100);
        } else {
            setVisible(isVis);
        }
    }, [status, visible]);

    useEffect(() => {
        nc.on(Event.TmmInit, handleStatusChange);
        initPercentChange.addObserver(handlerPercent);
        return () => {
            nc.off(Event.TmmInit, handleStatusChange);
            initPercentChange.removeAllListeners();
        };
    }, []);

    const handlerPercent = (progress) => {
        const { total, ratio } = progress;
        const percent = Number(((ratio / total) * 100).toFixed(2));
        setPercent(percent);
    };

    const handleStatusChange = (status) => setStatus(status);

    const handleReTryPull = () => {
        tmmSdkLogin(UserInfoModel, true);
    };

    const renderContent = () => {
        switch (status) {
            case InitLoadingStatus.LOADING:
            case InitLoadingStatus.DONE:
            case InitLoadingStatus.LOADED:
                return (
                    <div className={classes.loading}>
                        <span className={classes.loadingIcon}>
                            <CuLoading />
                        </span>
                        <p className={classes.loadingText}>
                            {localeFormat({ id: "init_loading_percent" })}{" "}
                            <span className={classes.percent}>({displayPercent}%)</span>
                        </p>
                    </div>
                );

            case InitLoadingStatus.LOADING_FAIL:
                return (
                    <div className={classes.loadFail}>
                        <span className={classes.loadingIcon}>
                            <CuFail />
                        </span>
                        <p className={classes.loadingText}>
                            {localeFormat({ id: "init_loading_fail" })}
                        </p>
                        <aside className={classes.btn} onClick={handleReTryPull}>
                            {localeFormat({ id: "init_loading_retry" })}
                        </aside>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <section>
            <Modal
                width={250}
                centered
                closable={false}
                visible={visible}
                wrapClassName={classes.initLoading}
                className={classes.initLoading}
                footer={null}
                maskStyle={{ WebkitAppRegion: "drag", backgroundColor: "#0009" }}
            >
                {renderContent()}
            </Modal>
        </section>
    );
};

export default InitLoadingModal;
