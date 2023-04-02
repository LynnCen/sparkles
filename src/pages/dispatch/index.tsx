import React, {useEffect, useState, Component, useMemo} from "react";
import {Table, Tag, Drawer, Spin, Progress, Popover} from "antd";
import CardLayout, {CardLayoutSuffix} from "components/CardLayout";
import {DataBlock, ProgressBar, TextLabel, LabelItem, InfoWin} from "components/Universal";
import {vh, percentage, render, mergeParams} from "utils/common";
import axios from "axios";
import SearchPopup from "components/SearchPopup";
import map from "utils/TDTMap";
import sxcwms from "config/sxcwms";

interface Props {
    [k: string]: any;

    visible: boolean;
    config: any;
    code: string;
}

interface States {
    config: any;
    managerList: object[];
    unAllocateList: object[];
    allocateList: object[];
    unAllocateClass: { id; name; isAllocate }[];
    allocateClass: { id; name; isAllocate }[];

    [k: string]: any;
}

export default class A extends Component<Props, States> {
    constructor(props) {
        super(props);
        this.state = {
            config: props.config,
            managerList: [],
            unAllocateList: [],
            allocateList: [],
            unAllocateClass: [],
            allocateClass: [],
        };
    }

    componentDidMount() {
        const {config} = this.state;
        if (config) {
            this.getList();
        }
        map.map.addEventListener("click", this.onMapClick);
    }

    componentWillReceiveProps({config, code}) {
        if (config && (!this.state.config || code != this.props.code)) {
            this.setState({config}, this.getList);
        }
    }

    componentWillUnmount() {
        map.map.removeEventListener("click", this.onMapClick);
    }

    onMapClick = ({lnglat}) => {
        if (map.map.getZoom() >= map.CLASS_DETAIL_ZOOM) {
            let [x, y] = [lnglat.getLng(), lnglat.getLat()];
            axios.get(`/task/class_detail`, {params: {x, y}}).then((r) => {
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

    getList = () => {
        const {code} = this.props;
        axios.get("/task/data", {params: {townCode: code}}).then((res) => {
            this.setState({
                managerList: res.data.managerList,
                unAllocateList: res.data.unAllocateList,
                allocateList: res.data.allocateList,
            });
        });
        this.getAllocateClass();
        const {layers} = map.sxcLayer.KR;
        map.sxcLayer.setParams({
            layers: mergeParams(layers, {[sxcwms.layerMap["single_class"]]: true}),
        });
    };

    getAllocateClass = (code = this.props.code, teamId?) => {
        const params = {townCode: code, teamId};
        let url = "/task/list_unallocate_class",
            key = "unAllocateClass";
        if (teamId) {
            url = "/task/list_allocate_class";
            key = "allocateClass";
        }
        axios.get(url, {params}).then((r) => {
            r.data && this.setState({[key]: r.data});
        });
    };
    //点击table行,显示采伐队小班图层
    showTeamLayer = (code, id) => {
        const key = "teamList";
        let {layers, viewparams} = map.sxcLayer.KR;
        let params = `townCode:${code}`,
            showTeam = true,
            showTown = false;
        if (
            !viewparams ||
            !(viewparams.split(";").find((e) => e.includes(key)) || "")
                .slice(key.length + 1)
                .split("\\,")
                .includes(id + "")
        ) {
            params += `;teamList:${id}`;
        } else {
            showTeam = false;
            showTown = !/000/.test(code);
        }
        map.sxcLayer.setParams({
            layers: mergeParams(layers, {
                [sxcwms.layerMap["progress_team"]]: showTeam,
                [sxcwms.townLayer[code]]: showTown,
            }),
            viewparams: params,
        });
    };

    TableTag = (key, record, children) => {
        const [visible, setVisible] = useState(false);
        const {unAllocateClass, allocateClass} = this.state;
        const data = key.includes("un") ? unAllocateClass : allocateClass;
        return (
            <Popover
                placement="leftBottom"
                trigger="click"
                overlayClassName={"popover"}
                visible={visible}
                onVisibleChange={(v) => {
                    setVisible(v);
                    !key.includes("un") && this.getAllocateClass(record.townCode, record.id);
                }}
                content={
                    <SearchPopup
                        title="小班列表"
                        code={record.townCode}
                        columnKey="name"
                        dataSource={data}
                        checkedItems={data.filter((e) => e.isAllocate)}
                        onCheck={(item, checked) => {
                            map.sxcLayer.setParams({viewparams: checked ? `classId:'${item.id}'` : ""});
                            if (checked) {
                                axios.get(`/home/centroid_by_id?classId=${item.id}`).then((r) => {
                                    if (r.data) {
                                        const {x, y} = r.data;
                                        map.map.centerAndZoom(new T.LngLat(x, y), map.CLASS_TITLE_ZOOM);
                                    }
                                });
                            }
                        }}
                        onChange={(checkedItems) => {
                            axios
                                .post(`/task/allocate`, {
                                    classList: checkedItems.map((e) => e.id),
                                    cutTeamId: record.id,
                                })
                                .then(this.getList);
                            setVisible(false);
                        }}
                        onClose={() => setVisible(!visible)}
                        height={350}
                        style={{height: 470, position: "inherit"}}
                    />
                }
            >
                {children === "分配" ? <Tag style={{
                    background: !visible ? "rgba(2, 210, 129, 0.15)" : "#02D281",
                    borderRadius: 4,
                    border: "1px solid #02D281",
                    color: !visible ? "#fff" : "#000"
                }} color="#02D281">分配</Tag> : <Tag style={{
                    background: !visible ? "rgba(57, 244, 232, 0.15)" : "#39F4E8",
                    borderRadius: 4,
                    border: "1px solid #39F4E8",
                    color: !visible ? "#fff" : "#000"
                }} color="#39F4E8">修改</Tag>}
            </Popover>
        );
    };

    render() {
        const {visible, code} = this.props;
        const {
            config,
            managerList,
            unAllocateList,
            allocateList,
            allocateClass,
            unAllocateClass,
        } = this.state;
        const administratorColumns = [
            {
                title: "乡镇/街道",
                key: "town",
                width: 64,
            },
            {
                title: "姓名",
                key: "name",
            },
            {
                title: "职位",
                key: "job",
            },
            {
                title: "联系电话",
                key: "phone",
            },
        ].map((c) => ({...c, dataIndex: c.key}));
        const toBeAssignedColumns = [
            {
                title: "采伐队",
                key: "teamName",
            },
            {
                title: "姓名",
                key: "teamLeader",
                width: 70,
            },
            {
                title: "联系电话",
                key: "phone",
                width: 94,
            },
            {
                title: "操作",
                key: "operating",
                width: 70,
                render: (text, record) => this.TableTag("un", record, "分配"),
            },
        ].map((c) => ({...c, dataIndex: c.key}));
        const allocatedColumns = [
            {
                title: "采伐队",
                key: "teamName",
            },
            {
                title: "姓名",
                key: "teamLeader",
                width: 70,
            },
            {
                title: "联系电话",
                key: "phone",
                width: 94,
            },
            {
                title: "操作",
                key: "operating",
                width: 70,
                render: (text, record) => this.TableTag("", record, "修改"),
            },
        ].map((c) => ({...c, dataIndex: c.key}));
        return (
            <>
                <Drawer
                    placement="right"
                    closable={false}
                    mask={false}
                    className={"drawer drawer-right arial"}
                    visible={visible}
                >
                    <div className={"right"}>
                        {config ? (
                            <>
                                <CardLayout
                                    style={{marginBottom: vh(40)}}
                                    title={config.administrator.title}
                                    enTitle={config.administrator.entitle}
                                    suffix={
                                        <CardLayoutSuffix {...config.administrator.suffix} value={managerList.length}/>
                                    }
                                >
                                    <Table
                                        className={"transparent-table"}
                                        columns={administratorColumns}
                                        scroll={{y: 100}}
                                        pagination={false}
                                        dataSource={managerList}
                                    />
                                </CardLayout>
                                <CardLayout
                                    style={{marginBottom: vh(40)}}
                                    title={config.toBeAssigned.title}
                                    enTitle={config.toBeAssigned.entitle}
                                    suffix={
                                        <CardLayoutSuffix
                                            {...config.toBeAssigned.suffix}
                                            value={unAllocateList.length}
                                        />
                                    }
                                >
                                    <Table
                                        className={"transparent-table"}
                                        columns={toBeAssignedColumns}
                                        scroll={{y: 130}}
                                        pagination={false}
                                        dataSource={unAllocateList}
                                        onRow={(record, rowIndex) => ({
                                            onClick: (e) => this.showTeamLayer(code, record.id),
                                        })}
                                    />
                                </CardLayout>
                                <CardLayout
                                    style={{marginBottom: vh(40)}}
                                    title={config.allocated.title}
                                    enTitle={config.allocated.entitle}
                                    suffix={
                                        <CardLayoutSuffix {...config.allocated.suffix} value={allocateList.length}/>
                                    }
                                >
                                    <Table
                                        className={"transparent-table"}
                                        columns={allocatedColumns}
                                        scroll={{y: 130}}
                                        pagination={false}
                                        dataSource={allocateList}
                                        onRow={(record, rowIndex) => ({
                                            onClick: (e) => this.showTeamLayer(code, record.id),
                                        })}
                                    />
                                </CardLayout>
                            </>
                        ) : (
                            <Spin size="large"/>
                        )}
                    </div>
                </Drawer>
            </>
        );
    }
}
