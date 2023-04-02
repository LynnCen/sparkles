import React, { Component, useEffect, useState } from 'react'
import {
    G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape, Facet, Util
} from "bizcharts";
import { Table } from 'antd'

const scss = require("../../../../styles/scss/sharepage.scss");
const fetchUrl = 'http://dtcity.cn:8077/api'
// const fetchUrl = 'http://192.168.1.148:8077/api'
const buttonList = ["盗窃", "电诈", "伤害", "涉赌", "涉黄", "矛盾纠纷"]
const colorList = ["#32BBFF", "#00FFFE", "#00E950", "#F7B500", "#FA6400", "#E02020"]


/**
 * @description 右侧通用头部 
 */

export const ContentBox = ({ children, title, entitle }) => {
    return <div className={scss['ld-content-box']}>
        <div className={scss['ld-right-title']}>
            <div className={scss['title-text-box']}>
                <div className={scss['chinese-title']}>{title}</div>
                <div className={scss['english-title']}>{entitle}</div>
            </div>
            <div className={scss['title-suffix']}>单位：<span>件</span></div>
        </div>
        {children}
    </div>
}

interface child1Props {
    ldStartMonth: string;
    ldEndMonth: string;
    ldPoliceId: number
}

interface child1State {
    total: number,
    activeKey: number,
    contentList: any[]
}

export class Child1Chart extends Component<child1Props, child1State> {

    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            activeKey: 0,
            contentList: []
        }
    }


    componentDidMount() {
        const { ldStartMonth, ldEndMonth, ldPoliceId } = this.props
        const { activeKey } = this.state
        fetch(`${fetchUrl}/caseInfo/currentMonthCount?policeStationId=${ldPoliceId}&startMonth=${ldStartMonth}&endMonth=${ldEndMonth}`)
            .then(res => res.json())
            .then(res => {
                let newData: any[] = []
                res.data.detail.map((r, i) => {
                    r.percent = r.count / res.data.total
                    r.color = i == activeKey ? '#32C5FF' : i % 2 == 0 ? "#1F3749" : '#546D81'
                    newData.push(r)
                })
                this.setState({
                    total: res.data.total,
                    contentList: newData
                })
                this.init(newData, 66)
            })
    }

    init = (data, outr) => {
        let drawing: any = document.getElementById('canvas')
        let ctx = drawing.getContext("2d")
        let ox = (drawing.width - outr * 2) / 2 + outr;
        let oy = (drawing.height - outr * 2) / 2 + outr;
        let startAngle = 0
        let endAngle = 0
        for (var i = 0, len = data.length; i < len; i++) {
            ctx.beginPath();
            endAngle += data[i].percent * 2 * Math.PI;
            ctx.lineWidth = 6
            ctx.strokeStyle = data[i].color
            ctx.arc(ox, oy, outr, startAngle, endAngle);
            ctx.stroke();
            startAngle = endAngle//更新起始弧度
        }
    }

    changeButtonList = (value) => {
        const { contentList } = this.state
        const newList = contentList
        newList.map((r, i) => {
            if (i == value) {
                newList[value].color = '#32C5FF'
            } else {
                newList[i].color = i % 2 == 0 ? "#1F3749" : '#546D81'
            }
        })
        this.setState({
            activeKey: value,
            contentList: newList
        }, () => {
            var c: any = document.getElementById("canvas");
            var cxt = c.getContext("2d");
            c.height = c.height;
            this.init(newList, 66)
        })
    }
    render() {
        const { activeKey, total, contentList } = this.state
        return (
            <div className={scss['ld-child1-box']}>
                <div className={scss['child1-button-box']}>
                    {
                        buttonList.map((r, i) => {
                            return <div
                                key={i}
                                className={scss['ld-button'] + " " + (i == activeKey && scss['ld-button-active'])}
                                onClick={() => this.changeButtonList(i)}
                            >
                                {r}
                            </div>
                        })
                    }
                </div>
                <div className={scss['child1-canvas-box']}>
                    <div className={scss['child-canvas']}>
                        <canvas width={154} height={154} id={'canvas'} />
                    </div>
                    <div className={scss['total-text']}>{total}</div>
                    <div className={scss['circle1']} />
                    <div className={scss['circle2']} />
                    {
                        contentList.map((r, i) => {
                            return <div
                                key={i}
                                className={scss['contentLine'] + " " + scss[`contentLine${i}`] + " " + (i == activeKey && scss['contentLine-active'])}
                            >
                                <div>
                                    {r.count}
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
        )
    }
}

interface Child2ChartProps {
    ldStartMonth: string;
    ldEndMonth: string;
    ldPoliceId: number
}

export const Child2Chart = ({ ldStartMonth, ldEndMonth, ldPoliceId }: Child2ChartProps) => {
    const [buttonKey, setButtonKey] = useState(0)
    const [chartData, setChartData] = useState({})
    useEffect(() => {
        fetch(`${fetchUrl}/caseInfo/caseTrend?policeStationId=${ldPoliceId}&startMonth=${ldStartMonth}&endMonth=${ldEndMonth}`)
            .then(res => res.json())
            .then(res => {
                let data = res.data
                let newData = {
                    0: [],
                    1: [],
                    2: [],
                    3: [],
                    4: [],
                    5: [],
                }
                data.map((r, i) => {
                    r.caseTypeCounts.map((item, index) => {
                        let a = {
                            country: "",
                            month: "",
                            count: 0
                        }
                        a.country = item.typeName
                        a.month = r.month
                        a.count = item.count
                        newData[index].push(a)
                    })
                })
                setChartData(newData)

            })
    }, [ldEndMonth, ldPoliceId])

    return <div>
        <Chart
            width={400}
            height={140}
            data={chartData[buttonKey]}
            padding={[20, 20, 20, 35]}
            forceFit
        >
            <Axis name="month"
                label={{
                    textStyle: {
                        fill: "#fff"
                    }
                }}
            />
            <Axis name="count"
                label={{
                    textStyle: {
                        fill: "#fff"
                    }
                }}
            />
            <Geom type="areaStack" tooltip={false} position="month*count" color={['country', ['l (0) 0:rgba(32, 226, 175, 0.5) 1:rgba(12, 172, 225,0.5)']]} />
            <Geom type="lineStack" position="month*count" size={1} color={['country', ['l (0) 0:rgba(32, 226, 175, 1) 1:rgba(12, 172, 225,1)']]} />
            <Geom type="point" position="month*count" size={5} />
        </Chart>
        <div className={scss['ld-button-box']}>
            {
                buttonList.map((r, i) => {
                    return <div
                        key={i}
                        className={scss['ld-button'] + " " + (i === buttonKey && scss['ld-button-active'])}
                        onClick={() => setButtonKey(i)}
                    >
                        {r}
                    </div>
                })
            }
        </div>
    </div>
}

interface Child3TableProps {
    ldStartMonth: string;
    ldEndMonth: string;
    ldPoliceId: number
}

export const Child3Table = ({ ldStartMonth, ldEndMonth, ldPoliceId }: Child3TableProps) => {
    const [tableData, setTableData] = useState([[], [], [], [], [], []])
    const [tableKey, setTableKey] = useState(0)
    const columns = [
        {
            title: "类别",
            dataIndex: "typeName",
            key: "typeName",
            align: 'center',
            render: (text) => (
                <div style={{ width: "50px" }}>{text}</div>
            )
        },
        {
            title: "案件名称",
            dataIndex: "name",
            key: "name",
            render: (text) => (
                <div style={{ width: "75px" }} title={text}>{text}</div>
            ),
            align: 'center'
        },
        {
            title: "发案地点",
            dataIndex: "address",
            key: "address",
            render: (text) => (
                <div style={{ width: "70px" }} title={text}>{text}</div>
            ),
            align: 'center'
        },
        {
            title: "发案时间",
            dataIndex: "dateTime",
            key: "dateTime",
            align: 'center',
            render: (text) => (
                <div style={{ width: "90px" }}>{text}</div>
            ),
        },
        {
            title: "管辖单位",
            dataIndex: "policeStation",
            key: "policeStation",
            align: 'center',
            render: (text) => (
                <div style={{ width: "60px" }}>{text}</div>
            ),
        },

    ]
    useEffect(() => {
        fetch(`${fetchUrl}/caseInfo/dangerCases?policeStationId=${ldPoliceId}&startMonth=${ldStartMonth}&endMonth=${ldEndMonth}`)
            .then(res => res.json())
            .then(res => {
                let newData = [[], [], [], [], [], []]
                newData[0] = res.data.splice(0, 5)
                newData[1] = res.data.splice(0, 5)
                newData[2] = res.data.splice(0, 5)
                newData[3] = res.data.splice(0, 5)
                newData[4] = res.data.splice(0, 5)
                newData[5] = res.data.splice(0, 5)
                setTableData(newData)
            })
        setTimeout(() => {
            let a = tableKey + 1
            if (a >= 6) {
                setTableKey(0)
            }
            else {
                setTableKey(a)
            }
        }, 2000)
    }, [ldEndMonth, ldPoliceId])
    useEffect(() => {
        setTimeout(() => {
            let a = tableKey + 1
            if (a >= 6) {
                setTableKey(0)
            }
            else {
                setTableKey(a)
            }
        }, 2000)
    }, [tableKey])

    return <Table
        rowKey={(record) => record.id.toString()}
        dataSource={tableData[tableKey]}
        columns={columns}
        pagination={false}
    />
}
