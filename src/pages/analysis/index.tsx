import React, {useEffect, useState, Component} from "react";
import {Drawer, Spin, Breadcrumb, Popover, Row} from "antd";
import {DataBlock, TextLabel, LabelItem, InfoWin} from "components/Universal";
import CardLayout, {CardLayoutSuffix} from "components/CardLayout";
import {Chart, Coord, Geom, Axis} from "bizcharts";
import DataSet from "@antv/data-set";
import {StackChart} from "components/Stack";
import scss from "./style.module.scss";
import {vh, render, mergeParams} from "utils/common";
import axios from "axios";
import map from "utils/TDTMap";
import {sxcother} from "config/sxcwms";
import context from "layout/context";

interface Props {
    [k: string]: any;

    visible: boolean;
    config: any;
    code: string;
    checkedItems: { id; name; area? }[];
}

interface States {
    config: any;
    classTotal: number;
}

export default class A extends Component<Props, States> {
    static contextType = context;

    constructor(props) {
        super(props);
        this.state = {
            config: props.config,
            classTotal: 0
        };
    }

    componentDidMount() {
        const {config} = this.state;
        if (config) {
            this.getData();
        }
        map.map.addEventListener("click", this.onMapClick);
        map.map.addEventListener("contextmenu", this.onMapContextmenu);
    }

    componentWillReceiveProps({config, code, checkedItems}) {
        if (config && (!this.state.config || code != this.props.code)) {
            this.setState({config}, this.getData);
        } else if (config && this.state.config) {
            this.getClass();
        }
    }

    componentWillUnmount() {
        map.map.removeEventListener("click", this.onMapClick);
        map.map.removeEventListener("contextmenu", this.onMapContextmenu);
    }

    onMapClick = ({lnglat}) => {
        if (map.map.getZoom() >= map.CLASS_DETAIL_ZOOM) {
            let [x, y] = [lnglat.getLng(), lnglat.getLat()];
            axios.get(`/analysis/class_detail`, {params: {x, y}}).then((r) => {
                if (r.data) {
                    const {config} = this.state;
                    config.mapInfo.forEach((e) => (e.value = r.data[e.key]));
                    let selector = `tdt-infowindow-custom${r.data.classId || 0}`;
                    map.addInfoWin({lnglat, content: `<div id="${selector}"></div>`, id: r.data.classId});
                    render(<InfoWin data={config.mapInfo}/>, "#" + selector);
                    //不显示小班疫木图层
                    if (map.getLayer(sxcother["analysis0"].id)) {
                        map.sxcLayerMap["analysis0"].setParams({layers: ""});
                        map.map.removeLayer(map.sxcLayerMap["analysis0"]);
                    }
                }
            });
        }
    };
    /**
     * 显示小班疫木图层
     */
    onMapContextmenu = ({lnglat}) => {
        let [x, y] = [lnglat.getLng(), lnglat.getLat()];
        axios.get(`/analysis/class_detail`, {params: {x, y}}).then((r) => {
            if (r.data) {
                const {viewparams} = map.sxcLayerMap["analysis0"].KR;
                if (!map.getLayer(sxcother["analysis0"].id)) {
                    map.map.addLayer(map.sxcLayerMap["analysis0"]);
                } else {
                    map.map.removeLayer(map.sxcLayerMap["analysis0"]);
                }
                map.sxcLayerMap["analysis0"].setParams({
                    layers: sxcother["analysis0"].layerMap["plague_tree"],
                    viewparams: mergeParams(viewparams, `classId:'${r.data.classId}'`, {separator: ";"}),
                });
            }
        });
    };

    getData = () => {
        const {code, checkedItems, keyword} = this.props;
        const {config} = this.state;
        const params = {level: keyword ? 2 : 1, townCode: code};
        keyword && Object.assign(params, {key: keyword});
        axios.get("/analysis/data", {params}).then((r) => {
            if (r.data) {
                config.range.above.forEach((e) => (e.number = r.data[e.key]));
                Object.keys(config.range.data).forEach(
                    (k) => k in r.data && (config.range.data[k] = r.data[k])
                );
                ["priority", "difficulty"].forEach((k) => {
                    config.division[k].data.forEach((e) => (e.value = r.data[e.key]));
                });
                config.budget.content.forEach((e) => {
                    e.key in r.data && (e.value = r.data[e.key]);
                });
                this.setState({config});
            }
        });
        this.getClass();
    };

    getClass = () => {
        const {checkedItems} = this.props;
        const {config} = this.state;
        // if (checkedItems.length) {
        //   config.suffix.value = checkedItems.length;
        // } else {
        axios.get(`/home/list_class?townCode=${this.props.code}&page=1&size=1`).then((r) => {
            this.setState({
                classTotal: r.data.total
            })
        });
        // }
    };

    onChartSelectedChange = (selected, item) => {
        if (item.value) {
            const layer =
                sxcother["analysis1"].layerMap[`${item.type.includes("未") ? "un" : ""}infection`];
            if (selected) {
                if (!map.getLayer(sxcother["analysis1"].id)) {
                    map.map.addLayer(map.sxcLayerMap["analysis1"]);
                }
                map.sxcLayerMap["analysis1"].setParams({
                    layers: layer,
                    viewparams: "townCode:" + this.props.code,
                });
                this.context.centerTownBy({code: this.props.code});
            } else map.map.removeLayer(map.sxcLayerMap["analysis1"]);
        }
    };

    onStackItemClick = (checked, item, {key, index}) => {
        const {code} = this.props;
        if (item && item.value) {
            if (!map.getLayer(sxcother["analysis2"].id)) {
                map.map.addLayer(map.sxcLayerMap["analysis2"]);
            }
            const {layers, styles} = map.sxcLayerMap["analysis2"].KR;
            let layer;
            if (item.key == "rectifyLevelZero") {
                layer = sxcother["analysis2"].layerMap["none"];
                if (layers.includes(layer)) {
                    map.sxcLayerMap["analysis2"].setParams({layers: ""});
                    map.map.removeLayer(map.sxcLayerMap["analysis2"]);
                } else {
                    map.sxcLayerMap["analysis2"].setParams({
                        styles: "",
                        layers: layer,
                        viewparams: "townCode:" + code,
                    });
                }
            } else {
                layer = sxcother["analysis2"].layerMap[key];
                let style = `sxc_css_analysis_${key}_` + item.style;
                if (layers.includes(layer) && styles == style) {
                    map.sxcLayerMap["analysis2"].setParams({styles: ""});
                    map.map.removeLayer(map.sxcLayerMap["analysis2"]);
                } else {
                    map.sxcLayerMap["analysis2"].setParams({
                        styles: style,
                        layers: layer,
                        viewparams: `townCode:${code};level:${item.status}`,
                    });
                }
            }
            this.context.centerTownBy({code});
        }
    };


    render() {
        const {visible, code, townName, checkedItems} = this.props;
        const {config, classTotal} = this.state;
        if (config) {
            const {range, division, budget, suffix, keyText} = config;
            return (
                <Drawer
                    placement="right"
                    closable={false}
                    mask={false}
                    className={"drawer drawer-right  arial"}
                    visible={visible}
                >
                    <div className={"right"}>
                        <CardLayout
                            style={{marginBottom: vh(40)}}
                            title={range.title}
                            enTitle={range.entitle}
                            suffix={<CardLayoutSuffix {...suffix} />}
                        >
                            <Row justify="space-between" style={{marginBottom: vh(26)}}>
                                {config.range.above.map((item, i) => (
                                    <DataBlock
                                        key={i}
                                        imgUrl={item.imgUrl}
                                        title={keyText[item.key]}
                                        number={item.key === "total" ? classTotal : item.number}
                                    />
                                ))}
                            </Row>
                            <Row justify="space-between" align="middle">
                                <DataBlock
                                    title={keyText["infection" + range.data.key]}
                                    number={range.data["infection" + range.data.key]}
                                    numStyle={{
                                        color: "#F7B500",
                                        fontSize: `${Math.min(
                                            2,
                                            (4 * 2) / String(range.data["infection" + range.data.key]).length
                                        )}rem`,
                                    }}
                                />
                                <DataBlock
                                    title={keyText["unInfection" + range.data.key]}
                                    number={range.data["unInfection" + range.data.key]}
                                    numStyle={{
                                        color: "#02D281",
                                        height: 33,
                                        fontSize: `${Math.min(
                                            1.5,
                                            (5 * 2) / String(range.data["unInfection" + range.data.key]).length
                                        )}rem`,
                                    }}
                                />
                                <SliderChart
                                    data={["infection", "unInfection"].map((k) => ({
                                        type: keyText[k + range.data.key],
                                        value: range.data[k + range.data.key],
                                    }))}
                                    color={range.data.color}
                                    onItemSelectedChange={this.onChartSelectedChange}
                                />
                                <DataBlock
                                    title={keyText["census" + range.data.key]}
                                    number={range.data["census" + range.data.key]}
                                    numStyle={{
                                        fontSize: `${Math.min(
                                            1.5,
                                            (4 * 2) / String(range.data["census" + range.data.key]).length
                                        )}rem`,
                                    }}
                                    unit={range.data.unit}
                                />
                            </Row>
                        </CardLayout>
                        <CardLayout
                            style={{marginBottom: vh(40)}}
                            title={division.title}
                            enTitle={division.entitle}
                            suffix={<CardLayoutSuffix label={"单位："} unit={"个"}/>}
                        >
                            {["priority", "difficulty"].map((key, i) => (
                                <StackChart
                                    {...division[key]}
                                    data={division[key].data.slice(1).map((e) => ({
                                        ...e,
                                        type: division[key].prefix,
                                    }))}
                                    color={division[key].color.slice(1)}
                                    legend={{
                                        onClick: (ev) => {
                                            const nodeList = document.querySelectorAll(".g2-legend-list");
                                            Array.from(nodeList[1 - i]["children"]).forEach((el) => {
                                                el["classList"].remove("unChecked");
                                                el["classList"].add("checked");
                                            });
                                            let index;
                                            const item = division[key].data.find(
                                                (e, idx) => e.status == ev["item"].value && ((index = idx), 1)
                                            );
                                            this.onStackItemClick(!ev["checked"], item, { key, index });
                                        },
                                    }}
                                />
                            ))}
                            {/* <Stack
                {...division.priority}
                data={division.priority.data.map((e, i) => ({ ...e, index: i }))}
                onItemClick={(item) => this.onStackItemClick("priority", item)}
              /> */}
                            {/* <Stack
                {...division.difficulty}
                data={division.difficulty.data.map((e, i) => ({ ...e, index: i }))}
                onItemClick={(item) => this.onStackItemClick("difficulty", item)}
              /> */}
                        </CardLayout>
                        <CardLayout
                            style={{marginBottom: vh(40)}}
                            title={budget.title}
                            enTitle={budget.entitle}
                            suffix={<CardLayoutSuffix label={"单位："} unit={"元 / 株"} />}
                        >
                            <LabelItem text={"计费对象"}>
                                <Breadcrumb className={scss["breadcrumb"]}>
                                    <Breadcrumb.Item>
                                        <span className={scss["green"]}>{townName}</span>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        <Popover
                                            placement="top"
                                            trigger="click"
                                            overlayClassName={"popover"}
                                            content={
                                                <div className="pop-stripe">
                                                    <table>
                                                        <thead>
                                                        <tr>
                                                            <th>{"小班列表(" + checkedItems.length + ")"}</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {checkedItems.map((e) => (
                                                            <tr>
                                                                <td className="px-md" style={{textAlign: "left"}}>
                                                                    {e.name}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            }
                                        >
                                            <a style={{color: "#00BAFF"}} className={"font_16"}>
                                                {"小班列表(" + checkedItems.length + ")"}
                                            </a>
                                        </Popover>
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                            </LabelItem>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <TextLabel
                                    title={budget.content[0].label}
                                    number={budget.content[0].value}
                                    unit={budget.content[0].unit}
                                    style={{marginRight: 10}}
                                />
                                <TextLabel
                                    title={budget.content[1].label}
                                    number={budget.content[1].value}
                                    unit={budget.content[1].unit}
                                />
                            </div>
                            <TextLabel
                                title={budget.content[2].label}
                                number={budget.content[2].value}
                                unit={budget.content[2].unit}
                            />
                        </CardLayout>
                    </div>
                </Drawer>
            );
        }
        return null;
    }
}

const SliderChart = ({
                         data, color, onItemSelectedChange = (...args) => {
    }
                     }) => {
    const {DataView} = DataSet;
    const dv = new DataView();
    dv.source(data).transform({
        type: "percent",
        field: "value",
        dimension: "type",
        as: "percent",
    });
    return (
        <Chart
            className={scss["analysis-chart"]}
            data={dv}
            width={84}
            height={84}
            padding={3}
            onIntervalClick={({data, shape}) => {
                onItemSelectedChange(shape._cfg.selected, data._origin);
            }}
        >
            <Coord type="theta" radius={0.9} innerRadius={0.65}/>
            <Axis visible={false}/>
            {/* <Tooltip showTitle={false} /> */}
            <Geom type="intervalStack" position="value" color={["type", color]}/>
        </Chart>
    );
};
