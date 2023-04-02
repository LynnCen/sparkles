import React, {Component} from "react";
import {Drawer, Spin, Table, Tag, Row, DatePicker, Popover, Col, message, Empty} from "antd";
import CardLayout, {CardLayoutSuffix} from "components/CardLayout";
import {percentage, vh} from "utils/common";
import Axios from "axios";
import moment from "moment";
import map from "utils/TDTMap";
import {VirtualTable, withConfigProvider} from "components/Universal";

const {RangePicker} = DatePicker;
const TableWithConfig = withConfigProvider(Table);
const renderEmpty = (loading?: boolean) => () =>
    loading ? (
        <p className="ant-empty-description">
            加载中&nbsp;
            <Spin size="small"/>
        </p>
    ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
    );

interface Props {
    [k: string]: any;

    visible: boolean;
    config: any;
    code: string;
    townName: string;
}

interface States {
    config: any;
    dates: string[];
    carActionLoading: boolean;
}

const dateFormat = "YYYYMMDDHHmmss";
export default class A extends Component<Props, States> {
    defaultDates: [moment.Moment, moment.Moment] = [moment().subtract(3, "day"), moment()];
    dates: string[] = this.defaultDates.map((m) => m.format(dateFormat));
    prevDates = this.dates;

    constructor(props) {
        super(props);
        this.state = {config: props.config, dates: [], carActionLoading: false};
    }

    componentDidMount() {
        if (this.state.config) {
            this.getData();
        }
    }

    componentWillReceiveProps({code, config}) {
        if (config && (!this.state.config || code != this.props.code)) {
            this.setState({config}, this.getData);
        }
    }

    componentWillUnmount() {
        ["overlayPane", "infoWindowPane"].forEach((pane, i) => {
            map[pane].forEach((lay) => {
                if (lay.options.contentType == "factory") {
                    lay[`${i ? "closeInfoWindow" : "hide"}`]();
                }
            });
        });
    }

    getData = () => {
        const {code} = this.props;
        const {config} = this.state;
        ["cost", "clock", "car"].forEach((k) => (config[k].loading = true));
        Axios.get(`/cost/list?townCode=${code}`).then((r) => {
            if (r.data) {
                config.cost.data = r.data.map((e) => ({
                    ...e,
                    branchProportion: percentage(e.branchProportion),
                }));
                config.cost.loading = false;
                this.setState({config});
            }
        });
        fetch('./config/injection.json', {mode: "cors"})
            .then((r) => r.json())
            .then((r) => {
                config.injection.data = r.map((e) => ({
                    ...e,
                }));
                config.injection.loading = false;
                this.setState({config});
            });
        Axios.get(`/clock/list?townCode=${code}`).then((r) => {
            if (r.data) {
                config.clock.data = r.data;
                config.clock.loading = false;
                this.setState({config});
            }
        });
        Axios.get(`/car/list`, {params: {townCode: code}}).then((r) => {
            if (r.data) {
                config.car.data = r.data;
                config.car.loading = false;
                this.setState({config});
            }
        });
        this.getFactory();
    };

    getFactory = () => {
        const {config} = this.state;
        Axios.get(`/home/list_factory`).then((r) => {
            if (r.data) {
                r.data
                    .filter((e) => e.x && e.y)
                    .forEach((e, i) => {
                        const label = map.addLabel({
                            lng: e.x,
                            lat: e.y,
                            text: e.abbreviation,
                            id: e.id,
                            className: "tdt-label label-factory",
                            contentType: "factory",
                            data: config.factory.map((item) => ({...item, value: e[item.key]})),
                        });
                        label.removeEventListener("click", map.onFactoryLabelClick);
                        label.addEventListener("click", map.onFactoryLabelClick);
                    });
            }
        });
    };
    //点击定位
    handleLocation = async (carPlate) => {
        let lay = map.markerPane.find((lay) => lay.options.id == carPlate);
        if (!lay) {
            this.getLocation(carPlate);
        } else if (lay.isHidden()) {
            lay.show();
            map.map.centerAndZoom(lay.getLngLat(), 13);
        } else {
            lay.hide();
        }
    };

    injectionLocation = async (lon, lat, trunkId) => {
        console.log(map.markerPane)
        let lay = map.markerPane.find((lay) => lay.options.id == trunkId);
        if (!lay) {
            if (lon && lat) {
                // let lay = map.addMarker(lon, lat, {
                //     iconUrl: require("../../assets/position.svg"),
                //     iconSize: [45, 40],
                //     id: trunkId,
                // });
                // map.map.centerAndZoom(new T.LngLat(lon, lat), 13);
                // return lay
            } else {
                message.warn('暂无点位信息')
            }
            console.log(lay, '打点');
        } else if (lay.isHidden()) {
            lay.show();
            map.map.centerAndZoom(lay.getLngLat(), 13);
            console.log(lay, '显示');
        } else {
            console.log(lay, '隐藏');
            lay.hide();
        }
    }

    //获取汽车位置
    getLocation = (carPlate) => {
        this.setState({carActionLoading: true});
        return Axios.get(`/car/location?carPlate=${carPlate}`).then((r: any) => {
            const {data} = r;
            let lay;
            if (data) {
                const {config} = this.state;
                const {car} = config;
                car.data = car.data.map((c) => (c.carPlate == carPlate ? {...c, ...data} : c));
                this.setState({config});
                lay = map.addMarker(data.longitude, data.latitude, {
                    iconUrl: require("../../assets/car.svg"),
                    iconSize: [48, 24],
                    id: carPlate,
                });
                map.map.centerAndZoom(new T.LngLat(data.longitude, data.latitude), 13);
            } else message.warn(r.message);
            this.setState({carActionLoading: false});
            return lay;
        });
    };
    //点击轨迹
    handleTrajectory = (carPlate) => {
        let lay = map.polylinePane.find((lay) => lay.options.id == carPlate);
        if (!lay || this.prevDates.some((d, i) => d != this.dates[i])) {
            this.setState({carActionLoading: true});
            this.getTrajectory(carPlate, this.dates).then((data) => {
                if (Array.isArray(data) && data.length) {
                    if (!lay) {
                        map.addPolyline(
                            data.map((e) => [e.longitude, e.latitude]),
                            {
                                color: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
                                opacity: 0.8,
                                id: carPlate,
                            }
                        );
                    } else lay.setLngLats(data.map((e) => new T.LngLat(e.longitude, e.latitude)));
                } else if (lay) {
                    map.map.removeOverLay(lay);
                }
                this.setState({carActionLoading: false});
            });
        } else if (lay.isHidden()) {
            lay.show();
        } else {
            lay.hide();
        }
        this.prevDates = this.dates;
    };
    //更新汽车轨迹
    updateTrajectory = (cars, dates) => {
        if (dates[0] != dates[1]) {
            this.setState({carActionLoading: true});
            Promise.all(cars.map((c) => this.getTrajectory(c, dates))).then((datas) => {
                datas.forEach((data: any[], i) => {
                    if (data.length) {
                        let lay = map.polylinePane.find((lay) => lay.options.id == cars[i]);
                        if (lay) {
                            lay.setLngLats(data.map((e) => new T.LngLat(e.longitude, e.latitude)));
                        } else {
                            map.addPolyline(
                                data.map((e) => [e.longitude, e.latitude]),
                                {
                                    color: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
                                    opacity: 0.8,
                                    id: cars[i],
                                }
                            );
                        }
                    }
                });
                this.setState({carActionLoading: false});
            });
        }
    };
    //获取汽车轨迹
    getTrajectory = (carPlate, dates = this.defaultDates.map((m) => m.format(dateFormat))) => {
        return Axios.get(`/car/trajectory`, {
            params: {
                carPlate,
                startTime: dates[0],
                endTime: dates[1],
            },
        }).then((r: any) => (r.data ? r.data : message.warn(r.message)));
    };

    render() {
        const {visible, code, townName} = this.props;
        const {config, carActionLoading} = this.state;
        if (config) {
            let {cost,injection, clock, car} = config;
            return (
                <Drawer
                    placement="right"
                    closable={false}
                    mask={false}
                    className={"drawer drawer-right arial"}
                    visible={visible}
                >
                    <div className={"right"}>
                        {/*<CardLayout*/}
                        {/*    {...cost}*/}
                        {/*    className={" pe-auto"}*/}
                        {/*    suffix={<CardLayoutSuffix {...cost.suffix} value={cost.data.length}/>}*/}
                        {/*    style={{marginBottom: vh(30)}}*/}
                        {/*>*/}
                        {/*    <TableWithConfig*/}
                        {/*        config={{renderEmpty: renderEmpty.bind(this, cost.loading)}}*/}
                        {/*        scroll={{y: 105}}*/}
                        {/*        columns={cost.columns.map((c, i) => ({*/}
                        {/*            ...c,*/}
                        {/*            dataIndex: c.key,*/}
                        {/*            width: c.key == "payee" ? "30%" : c.key == "detail" ? "16%" : "",*/}
                        {/*            render: (item, record) => {*/}
                        {/*                return c.key == "paymentAmount" ? (*/}
                        {/*                    <span>{"￥" + item}</span>*/}
                        {/*                ) : c.key == "time" ? (*/}
                        {/*                    item.split(" ")[0]*/}
                        {/*                ) : c.key == "detail" ? (*/}
                        {/*                    <Popover*/}
                        {/*                        placement="left"*/}
                        {/*                        trigger="click"*/}
                        {/*                        overlayClassName={"popover"}*/}
                        {/*                        content={*/}
                        {/*                            <div className="pop-stripe">*/}
                        {/*                                {config.cost.pop.data.map((p) => (*/}
                        {/*                                    <Row justify={"space-between"}>*/}
                        {/*                                        <Col>{p.label}</Col>*/}
                        {/*                                        <Col>{record[p.key] + (p.unit || "")}</Col>*/}
                        {/*                                    </Row>*/}
                        {/*                                ))}*/}
                        {/*                            </div>*/}
                        {/*                        }*/}
                        {/*                    >*/}
                        {/*                        <Tag color="#007DDC">{c.title}</Tag>*/}
                        {/*                    </Popover>*/}
                        {/*                ) : (*/}
                        {/*                    item*/}
                        {/*                );*/}
                        {/*            },*/}
                        {/*        }))}*/}
                        {/*        dataSource={cost.data}*/}
                        {/*        pagination={false}*/}
                        {/*        getPopupContainer={(node) => node}*/}
                        {/*        className={"transparent-table"}*/}
                        {/*    />*/}
                        {/*</CardLayout>*/}
                        <CardLayout
                            {...injection}
                            className={" pe-auto"}
                            suffix={<CardLayoutSuffix {...injection.suffix} value={39542} value2={123} unit2={"升"}/>}
                            style={{marginBottom: vh(30)}}
                        >
                            <TableWithConfig
                                config={{renderEmpty: renderEmpty.bind(this, injection.loading)}}
                                scroll={{y: 130}}
                                columns={injection.columns.map((c, i) => ({
                                    ...c,
                                    dataIndex: c.key,
                                    render: (item, record) => {
                                        return c.key == "action" ? (
                                            <div className="flex-center"
                                            >
                                                <Tag style={{
                                                    background: "rgba(2, 210, 129, 0.15)",
                                                    borderRadius: 4,
                                                    border: "1px solid #02D281"
                                                }}
                                                >
                                                    {c.values[0]}
                                                </Tag>
                                                <Tag
                                                    style={{
                                                        background: "rgba(57, 244, 232, 0.15)",
                                                        borderRadius: 4,
                                                        border: "1px solid #39F4E8"
                                                    }}>
                                                    {c.values[1]}
                                                </Tag>
                                            </div>
                                        ) : (
                                            item
                                        );
                                    },
                                }))}
                                dataSource={injection.data}
                                pagination={false}
                                getPopupContainer={(node) => node}
                                className={"transparent-table"}
                            />
                        </CardLayout>
                        <CardLayout
                            {...car}
                            className={" pe-auto"}
                            suffix={
                                <RangePicker
                                    style={{width: 185}}
                                    className={"bg_white_25 border-none"}
                                    defaultValue={this.defaultDates}
                                    format={"M月D日"}
                                    onChange={(dates, dateString) => {
                                        this.dates = dates ? dates.map((m) => m.format(dateFormat)) : [];
                                        // this.updateTrajectory(
                                        //   car.data.map((d) => d.carPlate),
                                        //   dates.map((m) => m.format(dateFormat))
                                        // );
                                    }}
                                    inputReadOnly={true}
                                />
                            }
                        >
                            <TableWithConfig
                                config={{renderEmpty: renderEmpty.bind(this, car.loading)}}
                                scroll={{y: 130 }}
                                columns={car.columns.map((c, i) => ({
                                    ...c,
                                    dataIndex: c.key,
                                    title:
                                        c.key == "action" && car.data && car.data.length && carActionLoading ? (
                                            <>
                                                {c.title}&nbsp;
                                                <Spin size="small"/>
                                            </>
                                        ) : (
                                            c.title
                                        ),
                                    width: c.key == "teamName" ? "30%" : "",
                                    render: (item, record) => {
                                        return c.key == "action" ? (
                                            <div
                                                className="flex-center"
                                                // onClick={(e) => {
                                                //   let target = e.target as HTMLElement;
                                                //   if (target.nodeName == "SPAN") {
                                                //     let empty = target.style.opacity == "";
                                                //     target.style.opacity = empty ? "0.6" : "";
                                                //   }
                                                // }}
                                            >
                                                <Tag style={{
                                                    background: "rgba(2, 210, 129, 0.15)",
                                                    borderRadius: 4,
                                                    border: "1px solid #02D281"
                                                }}

                                                     onClick={(e) => {
                                                         this.handleLocation(record.carPlate);
                                                     }}
                                                >
                                                    {c.values[0]}
                                                </Tag>
                                                <Tag
                                                    style={{
                                                        background: "rgba(57, 244, 232, 0.15)",
                                                        borderRadius: 4,
                                                        border: "1px solid #39F4E8"
                                                    }}
                                                    onClick={(e) => {
                                                        this.handleTrajectory(record.carPlate);
                                                    }}
                                                >
                                                    {c.values[1]}
                                                </Tag>
                                            </div>
                                        ) : (
                                            item
                                        );
                                    },
                                }))}
                                dataSource={car.data}
                                pagination={false}
                                getPopupContainer={(node) => node}
                                className={"transparent-table"}
                            />
                        </CardLayout>
                        <CardLayout
                            {...clock}
                            className={" pe-auto"}
                            suffix={<CardLayoutSuffix {...clock.suffix} value={clock.data.length}/>}
                            style={{marginBottom: vh(30)}}
                        >
                            <TableWithConfig
                                config={{renderEmpty: renderEmpty.bind(this, clock.loading)}}
                                scroll={{y: 130}}
                                columns={clock.columns.map((c, i) => ({
                                    ...c,
                                    dataIndex: c.key,
                                    width: c.key == "teamName" ? "30%" : "",
                                    render: (item, record) => {
                                        return c.key == "time" ? (
                                            item.split(" ")[0]
                                        ) : c.key == "detail" ? (
                                            <Popover
                                                placement="left"
                                                trigger="click"
                                                overlayClassName={"popover"}
                                                content={
                                                    <div className="pop-stripe">
                                                        {config.clock.pop.data.map((p) => (
                                                            <Row justify={"space-between"}>
                                                                <Col>{p.label}</Col>
                                                                <Col>{record[p.key] + (p.unit || "")}</Col>
                                                            </Row>
                                                        ))}
                                                    </div>
                                                }
                                            >
                                                <Tag style={{
                                                    background: "rgba(57, 244, 232, 0.15)",
                                                    borderRadius: 4,
                                                    border: "1px solid #39F4E8"
                                                }} color="#007DDC">{c.title}</Tag>
                                            </Popover>
                                        ) : (
                                            item
                                        );
                                    },
                                }))}
                                dataSource={clock.data}
                                pagination={false}
                                getPopupContainer={(node) => node}
                                className={"transparent-table"}
                            />
                        </CardLayout>
                    </div>
                </Drawer>
            );
        }
        return null;
    }
}
