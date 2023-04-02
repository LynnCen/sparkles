import React, {Component, useEffect, useRef, useState} from "react";
import {Drawer, Spin, Select, DatePicker, Popover, Table, Row, Col} from "antd";
import Image from "rc-image";
import moment from "moment";
import CardLayout, {CardLayoutSuffix} from "components/CardLayout";
import Progress from "components/Progress";
import scss from "./style.module.scss";
import {vh, percentage, render, vw} from "utils/common";
import axios from "axios";
import map from "utils/TDTMap";
import {sxcother} from "config/sxcwms";
import context from "layout/context";
import InfoWin from "./InfoWin";
import {DataBlock, LabelItem} from "../../components/Universal";

interface Props {
    [k: string]: any;

    visible: boolean;
    config: any;
    code: string | number;
}

interface States {
    config: any;
    type: string;
    date: string;
    activeBlockIdx?: undefined | number;
}

export default class A extends Component<Props, States> {
    static contextType = context;
    dateFormat = "YYYY-MM-DD";

    constructor(props) {
        super(props);
        this.state = {config: props.config, type: "", date: moment().format(this.dateFormat), activeBlockIdx: void 0};
    }

    componentDidMount() {
        if (this.state.config) {
            this.getData();
        }
        map.map.addEventListener("click", this.onMapClick);
    }

    componentWillReceiveProps({code, config}) {
        if (config && (!this.state.config || code != this.props.code)) {
            this.setState({config ,activeBlockIdx: void 0 }, this.getData);
        }
    }

    componentWillUnmount() {
        map.map.removeEventListener("click", this.onMapClick);
    }

    onMapClick = ({lnglat}) => {
        if (map.map.getZoom() >= map.CLASS_DETAIL_ZOOM) {
            let [x, y] = [lnglat.getLng(), lnglat.getLat()];
            axios.get(`/verification/class_detail`, {params: {x, y}}).then((r) => {
                if (r.data) {
                    const {config} = this.state;
                    config.mapInfo.forEach((e) => (e.value = r.data[e.key]));
                    let selector = `tdt-infowindow-custom${r.data.classId || 0}`;
                    map.addInfoWin({lnglat, content: `<div id="${selector}"></div>`, id: r.data.classId});
                    render(<InfoWin data={config.mapInfo}/>, "#" + selector);
                }
            });
        }
    };

    getData = () => {
        const {code} = this.props;
        const {config, date} = this.state;
        let type = config.assess.select.defaultValue;
        this.getProgress(type, date);
        axios.get(`/verification/accept_result?townCode=${code}`).then((r) => {
            config.accept.data.forEach((e, i) => {
                e.value = r.data[e.key];
                i < 3 && (e.layer = Object.values(sxcother.verification.layerMap)[i]);
            });
            this.setState({config});
        });
        axios.get(`/verification/list_unqualified?townCode=${code}`).then((r) => {
            config.accept.unqualified.data = r.data;
            this.setState({config});
        });
    };
    getProgress = (type, date) => {
        const {code} = this.props;
        const {config} = this.state;
        axios
            .get(`/verification/progress_data?townCode=${code}&date=${date}&type=${type}`)
            .then((r) => {
                config.assess.data = r.data.map((e) => ({
                    title: e.name,
                    value: code == "000" ? e.value : Math.round(e.value * 10000),
                    percent: e.completed,
                }));
                this.setState({config, type, date});
            });
    };


    showLayer = (it, i) => {
        const {code} = this.props;
        const {activeBlockIdx} = this.state;
        if (it.value) {
            this.setState({activeBlockIdx: activeBlockIdx == i ? void 0 : i});
            const {layers} = map.sxcLayerMap["verification"].KR;
            if (!layers.includes(it.layer) || (typeof activeBlockIdx == "number" && Math.abs(activeBlockIdx - i) == 3)) {
                if (!map.getLayer(sxcother["verification"].id)) {
                    map.map.addLayer(map.sxcLayerMap["verification"]);
                }
                map.sxcLayerMap["verification"].setParams({layers: it.layer});
                this.context.centerTownBy({code});
            } else {
                map.sxcLayerMap["verification"].setParams({layers: ""});
                map.map.removeLayer(map.sxcLayerMap["verification"]);
            }
        }
    };

    render() {
        const {visible, code} = this.props;
        const {config, type, date, activeBlockIdx} = this.state;
        if (config) {
            let {assess, accept} = config;
            return (
                <Drawer
                    placement="right"
                    closable={false}
                    mask={false}
                    className={"drawer drawer-right arial"}
                    visible={visible}
                >
                    <div className={""}>
                        <CardLayout
                            {...assess}
                            style={{marginBottom: vh(40)}}
                            suffix={
                                <>
                                    <Select
                                        className={"bg_white_25 border-none"}
                                        allowClear={false}
                                        {...assess.select}
                                        value={type}
                                        onChange={(val: string) => this.getProgress(val, date)}
                                        size="small"
                                        getPopupContainer={(node) => node.parentNode.parentNode}
                                        dropdownClassName={""}
                                        style={{marginRight: 6}}/>
                                    <DatePicker
                                        picker="week"
                                        className={"bg_white_25 border-none"}
                                        defaultValue={moment()}
                                        value={moment(date)}
                                        format={"M月份-第wo"}
                                        onChange={(date, dateString) => {
                                            this.getProgress(type, date.format(this.dateFormat));
                                        }}
                                        inputReadOnly={true}
                                    />
                                </>
                            }
                        >
                            <ProgressLine
                                style={{maxHeight: vh(495)}}
                                className="overflow-auto"
                                data={assess.data}
                                townCode={code}
                                unit={type ? assess.select.options.find((o) => o.value == type).unit : ""}
                            />
                        </CardLayout>
                        <CardLayout
                            {...accept}
                            suffix={
                                <CardLayoutSuffix label={"单位："} unit={"个"}/>
                            }
                            //     <Popover
                            //         placement="left"
                            //         trigger="click"
                            //         overlayClassName={"popover"}
                            //         content={
                            //             <Table
                            //                 rowKey={(record) => record.id}
                            //                 className="pop-stripe"
                            //                 dataSource={accept.unqualified.data}
                            //                 columns={accept.unqualified.columns.map((e) => ({
                            //                     ...e,
                            //                     dataIndex: e.key,
                            //                 }))}
                            //                 pagination={false}
                            //             />
                            //         }
                            //     >
                            //         <a
                            //             {...accept.suffix}
                            //             onClick={(e) => {
                            //                 console.log(e);
                            //             }}
                            //         />
                            //     </Popover>
                            // }
                        >
                            <Row justify="space-between" style={{marginBottom: vh(26)}}>
                                {accept.data.slice(0, 3).map((it, i) => {
                                    return <DataBlock key={i} title={it.title} number={it.value} imgUrl={it.imgUrl}
                                                      onClick={() => this.showLayer(it, i)}
                                                      hover={true}
                                                      className={(activeBlockIdx == i && "hover-highlight") || ""}/>
                                })}
                            </Row>
                            <div className={"relative"}>
                                <LabelItem text={accept.data[3].title}>
                                    <Progress
                                        strokeWidth={14}
                                        style={{borderRadius: 0}}
                                        percent={percentage(accept.data[3].value)}
                                    />
                                </LabelItem>
                            </div>
                        </CardLayout>
                    </div>
                </Drawer>
            );
        }
        return null;
    }
}
const ProgressLine = ({data, className, townCode, unit, ...rest}) => {
    const maxTLen = data.reduce((r, c) => ((r = Math.max(r, c.title.length)), r), 0);
    const maxVLen = data.reduce((r, c) => ((r = Math.max(r, String(c.value).length)), r), 0);
    const _unit = townCode == "000" ? `万${unit}` : unit;
    const leftPx = maxTLen * 14 + (data.length > 9 ? 24 : 12);
    const rightPx = maxVLen * 8 + _unit.length * 14;
    return (
        <div className={scss["progressLine"] + " " + className} {...rest}>
            {data.map((e, i) => (
                <div key={i} className={scss["progressLine-item"] + " flex-center-v text-left"}>
                    <div className="ellipsis" title={e.title} style={{flex: `0 0 ${leftPx + 6}px`}}>
                        <div className={scss["index-box"]}>{i + 1}</div>
                        <div style={{
                            width: "4em", float: "right",
                            overflow: "hidden",
                            textAlign: "center",
                            marginRight: 4
                        }}>
                            <div style={{
                                textDecoration: "none",
                                letterSpacing: `${(4 - e.title.length) / (e.title.length - 1)}em`,
                                marginRight: `${-((4 - e.title.length) / (e.title.length - 1))}em`
                            }}>{e.title}</div>
                        </div>
                    </div>
                    <Progress
                        strokeWidth={14}
                        style={{
                            flex: `0 0 calc(100% - ${leftPx + 20 + rightPx}px)`,
                            borderRadius: 0,
                        }}
                        percent={e.percent}
                    />
                    <div className="ellipsis" style={{flex: `0 0 ${rightPx}px`, marginLeft: 6}}>
                        {e.value + _unit}
                    </div>
                </div>
            ))}
        </div>
    );
};
const SquareCard = ({data, onItemClick, ...rest}) => {
    return (
        <ul className={"flex-center-between " + scss["square-card"]} {...rest}>
            {data.map((e, i) => {
                return (
                    <li key={i} className="pointer" style={{width: "auto"}} onClick={() => onItemClick(e)}>
                        <div className={"arial " + scss["square-mask"]}>
                            {e.value}
                            <span className={scss["unit"]}>{"个"}</span>
                        </div>
                        <div className={scss["title"]}>{e.title}</div>
                    </li>
                );
            })}
        </ul>
    );
};
