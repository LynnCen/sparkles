import { Component } from "react";
import { Button, Select, Table } from "antd";
import VrpModal from "../../components/VrpModal";
import MapService from "../../services/MapService";
import moment from "moment";
import TransCoordinate from "../../components/tools/Coordinate";
import Config from "../../config/Config";

const css = require("../../styles/custom.css");

const Option = Select.Option;

/**
 * @name MonitorModal
 * @create: 2019/1/19
 * @description: 监控弹窗
 */

interface GPSModalProps {
    closeModal: (interval) => void;
}

interface GPSModalStates {
    userId: number;
    typeId: number;
    data: any;
    types: any;
    pos: any;
    isFollow: boolean;
    interval: any;
    typeName: string;
}

class GPSModal extends Component<GPSModalProps, GPSModalStates> {
    INTERVAL;
    constructor(props: GPSModalProps) {
        super(props);
        this.state = {
            userId: 0,
            typeId: 0,
            data: [],
            types: [],
            pos: [],
            isFollow: false,
            interval: 0,
            typeName: ""
        }
    }
    componentWillUnmount() {
        if (this.INTERVAL) {
            clearInterval(this.INTERVAL)
        }
        const { maps } = Config;
        const modelLayer = maps.getLayerById("GPSLayer");
        if (modelLayer) {
            modelLayer.clearFeatures();
        }
    }

    componentWillMount() {
        this.getData();
    }

    getData = () => {
        MapService.getUserGPS("https://gps.vrplanner.cn/location/user/allUsers", (success, res) => {
            if (success) {
                if (res.code === 0) {
                    const { data } = res;
                    this.setState({
                        data,
                        userId: data[0].id
                    }, () => {
                        this.getTypes();
                    })
                }
            }
        })
    }

    getTypes = () => {
        MapService.getUserGPS("https://gps.vrplanner.cn/location/user/getTypes", (success, res) => {
            if (success) {
                if (res.code === 0) {
                    const { data } = res;
                    this.setState({
                        types: data,
                        typeId: data.length > 0 ? data[0].id : 0
                    })
                }
            }
        }, { userId: this.state.userId })
    }

    getPos = () => {
        MapService.getUserGPS("https://gps.vrplanner.cn/location/user/getData", (success, res) => {
            if (success) {
                if (res.code === 0) {
                    const { data } = res;
                    this.setState({
                        pos: data
                    })
                }
            }
        }, { typeId: this.state.typeId })
    }

    handleUserChange = (value) => {
        this.setState({
            userId: value
        }, () => {
            this.getTypes();
        })
    }

    handleTypeChange = (value) => {
        this.state.types.forEach(item => {
            if (item.id === value) {
                this.setState({
                    typeName: item.name
                });
                return;
            }
        })
        this.setState({
            typeId: value
        }, () => {
            this.getPos();
        })
    }

    handleClick = (e) => {
        const { maps, vrPlanner } = Config;
        const camera = maps.getCamera();
        const geo = TransCoordinate.WGS84ToMercator({ x: Number(e.longitude), y: Number(e.latitude), z: 40 })
        camera.setPosition(geo.add(new vrPlanner.Math.Double3(0, 0, 650)), geo);
        this.showGPS(geo, moment.unix(e.time).format("YYYY-MM-DD HH:mm:ss"));
        if (this.INTERVAL) {
            clearInterval(this.INTERVAL)
        }
        this.setState({
            isFollow: false
        })
    }

    showGPS = (geo, time) => {
        const { maps, vrPlanner } = Config;
        const modelLayer = maps.getLayerById("GPSLayer") || new vrPlanner.Layer.FeatureLayer("GPSLayer");
        maps.addLayer(modelLayer);
        modelLayer.clearFeatures();
        const modelReader = new vrPlanner.Model.ModelReader();
        const point = new vrPlanner.Feature.Point(geo);
        const balloon = new vrPlanner.Balloon();
        balloon.setMessage(`<div class='gps'>${this.state.typeName},${time}<div class="icon"></div></div>`);
        point.setBalloon(balloon);
        balloon.setOffsetY(10);
        modelLayer.addFeature(point);
        modelReader.read(Config.apiHost + "/res/image/model/pos.a3x").done((model) => {
            const modelStyle = new vrPlanner.Style.ModelStyle();
            modelStyle.setModel(model);
            point.setStyle(modelStyle);
            point.setAltitudeMode(vrPlanner.Feature.ALTITUDE_MODE_ABSOLUTE);
        });
    }

    handleClickHistory = () => {
        this.setState({
            isFollow: !this.state.isFollow
        }, () => {
            const { maps, vrPlanner } = Config;
            const camera = maps.getCamera();
            if (this.state.isFollow) {
                const { pos } = this.state;
                let _index = 0;
                if (pos.length > 0) {
                    const geo = TransCoordinate.WGS84ToMercator({ x: Number(pos[_index].longitude), y: Number(pos[_index].latitude), z: 40 });
                    this.showGPS(geo, moment.unix(pos[_index].time).format("YYYY-MM-DD HH:mm:ss"));
                    camera.setPosition(geo.add(new vrPlanner.Math.Double3(0, 0, 650)), geo);
                    const interval = setInterval(() => {
                        _index++;
                        if (_index >= pos.length) {
                            const modelLayer = maps.getLayerById("GPSLayer");
                            if (modelLayer) {
                                modelLayer.clearFeatures();
                            }
                            clearInterval(interval);
                            this.setState({
                                isFollow: false
                            })
                        } else {
                            const geo = TransCoordinate.WGS84ToMercator({ x: Number(pos[_index].longitude), y: Number(pos[_index].latitude), z: 40 });
                            this.showGPS(geo, moment.unix(pos[_index].time).format("YYYY-MM-DD HH:mm:ss"));
                        }
                    }, 1000);
                    this.INTERVAL = interval;
                } else {
                    if (this.INTERVAL) {
                        clearInterval(this.INTERVAL)
                    }
                    this.setState({
                        isFollow: false
                    })
                }
            } else {
                if (this.INTERVAL) {
                    clearInterval(this.INTERVAL)
                }
                const modelLayer = maps.getLayerById("GPSLayer");
                if (modelLayer) {
                    modelLayer.clearFeatures();
                }
            }
        })
    }


    render() {
        const btnGroup = (
            <div className={css['text-center']}>
                {/* <Button>实时追踪</Button> */}
                <Button onClick={this.handleClickHistory} type="primary">{this.state.isFollow ? "取消" : "历史"}跟踪</Button>
                <Button onClick={() => this.props.closeModal(this.INTERVAL)}>关闭</Button>
            </div>);
        const { data, userId, types, pos } = this.state;
        const columns = [
            {
                title: "经度",
                dataIndex: "longitude",
                key: "longitude",
                align: "center",
            },
            {
                title: "纬度",
                dataIndex: "latitude",
                key: "latitude",
                align: "center",
            },
            {
                title: "时间",
                dataIndex: "time",
                key: "time",
                align: "center",
                render: tags => (
                    moment.unix(tags).format("YYYY-MM-DD HH:mm:ss")
                )
            }
        ]
        return (
            <VrpModal defaultPosition={{ x: 30, y: 95 }}
                title={"用户详情"}
                style={{ width: 550 }}
                height={348}
                footer={btnGroup}
                onClose={() => this.props.closeModal(this.INTERVAL)} >
                <div>
                    <label className={css['flex-none-label']}>用户名</label><Select value={userId} style={{ width: 75 }} onChange={this.handleUserChange}>
                        {
                            data.map(item => {
                                return (<Option key={item.id.toString()} value={item.id}>{item.id}</Option>)
                            })
                        }
                    </Select>
                    <label className={css['flex-none-label']}>类型</label><Select style={{ width: 125 }} onChange={this.handleTypeChange}>
                        {
                            types.map(item => {
                                return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                            })
                        }
                    </Select>
                    <Table onRow={(record) => {
                        return {
                            onClick: () => { this.handleClick(record) }
                        }
                    }} columns={columns} dataSource={pos} pagination={{ simple: true, total: pos.length - 1 }} />
                </div>
            </VrpModal >
        );
    }
}

export default GPSModal;

