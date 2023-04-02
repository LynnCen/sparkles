import React, { useState, useEffect } from 'react'
import {
    G2,
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label,
    Legend,
    View,
    Guide,
    Shape,
    Facet,
    Util
} from "bizcharts";
import DataSet from "@antv/data-set";

const scss = require("../../../../styles/scss/sharepage.scss");


export const SliderChart1 = ({ data, color }) => {
    const { DataView } = DataSet;
    const dv = new DataView();
    dv.source(data).transform({
        type: "percent",
        field: "count",
        dimension: "item",
        as: "percent",
    });
    return <Chart
        data={dv}
        width={84}
        height={84}
        padding={3}
    >
        <Coord type="theta" radius={0.9} innerRadius={0.65} />
        <Axis visible={false} />
        <Geom type="intervalStack" position="count" color={["item", color]} />
    </Chart>
}

export const BarChart = ({ data }) => {
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
        type: "fold",
        fields: ["0~20", "20~40", "40~60", "60~80", "80~100", ">100"],
        // // 展开字段集
        key: "年龄",
        // key字段
        value: "人数" // value字段
    });
    return <Chart
        height={140}
        data={dv}
        forceFit
        padding={[18, 10, 20, 30]}
    >
        <Axis name="年龄"
            label={{
                textStyle: {
                    fill: 'rgba(255,255,255,0.8)'
                }
            }}
            line={{
                stroke: '#fff'
            }}
        />
        <Axis name="人数"
            line={{
                stroke: '#fff'
            }}
            label={{
                textStyle: {
                    fill: 'rgba(255,255,255,0.8)'
                }
            }}
            grid={{
                lineStyle: {
                    stroke: 'rgba(255,255,255,0.2)',
                    lineWidth: 1,
                }
            }}
        />
        <Geom
            type="intervalStack"
            position="年龄*人数"
            color={["name", ['rgba(255,255,255,0.2)', 'l(90) 0:#02D281 1:#00BAFF']]}
        />
    </Chart>
}

export const SliderChart2 = ({ data, color, text }) => {
    const { DataView } = DataSet;
    const { Html } = Guide;
    const dv = new DataView();
    dv.source(data).transform({
        type: "percent",
        field: "count",
        dimension: "item",
        as: "percent",
    });
    return <Chart
        data={dv}
        width={180}
        height={150}
        padding={[10, 35, 10, 30]}
    >
        <Coord type="theta" radius={0.9} innerRadius={0.8} />
        <Axis visible={false} />
        <Guide>
            <Html
                position={["50%", "50%"]}
                html={`<div style="color:#fff;font-size:14px;text-align:center;width:56px;font-weight:600">${text[0]}<br />${text[1]}</div>`}
                alignX="middle"
                alignY="middle"
            />
        </Guide>
        <Geom type="intervalStack" position="count" color={["item", color]} >
            <Label
                content="percent"
                htmlTemplate={(text, item, index) => {
                    let newVal = text * 100
                    // 自定义 html 模板
                    return '<div style="color:rgba(255,255,255,0.8);font-weight:400;font-size:12px;width:36px">' + item.point.item + '<br/>' + newVal + '%' + '</div>';
                }}
                textStyle={{
                    fill: "#fff"
                }}
                offset={10}
            />
        </Geom>
    </Chart>
}


export const Stacked = ({ data, color, fields, width }) => {
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
        type: "fold",
        fields,
        // 展开字段集
        key: "type",
        // key字段
        value: "percent",
        // value字段
        retains: ["state"] // 保留字段s集，默认为除fields以外的所有字段
    });
    const cols = {
        percent: {
            formatter(val) {
                return val + "%";
            }
        }
    }
    return <Chart
        width={width}
        height={30}
        data={dv}
        padding={[-8, 0, -2, 0]}
        forceFit
        scale={cols}
    >
        {/* <Legend
            offsetY={-15}
            textStyle={{ fill: "rgba(255,255,255,.8)" }}
        /> */}
        <Coord transpose />
        <Axis name="state" visible={false} />
        <Axis name="percent" visible={false} />
        <Tooltip />
        <Geom
            type="intervalStack"
            position="state*percent"
            color={["type", color]}
        >
            <Label content='percent' position='middle' offset={-5} />
        </Geom>
    </Chart>
}

export const Basic = ({ data, valueKey }) => {
    return <Chart
        height={140}
        data={data}
        padding={[10, 15, 20, 25]}
        scale={{
            value: {
                min: 0,
                max: valueKey == 1 ? 50 : 10
            },
            year: {
                range: [0, 1]
            }
        }}
        forceFit
    >
        <Axis name="year"
            label={{
                textStyle: {
                    fill: 'rgba(255,255,255,0.8)'
                }
            }}
            line={{
                stroke: '#fff'
            }}
        />
        <Axis name="value"
            label={{
                textStyle: {
                    fill: 'rgba(255,255,255,0.8)'
                }
            }}
            grid={{
                lineStyle: {
                    stroke: 'rgba(255,255,255,0.2)',
                    lineWidth: 1,
                }
            }}
            line={{
                stroke: '#fff'
            }}
        />
        <Tooltip />
        <Geom type="area" position="year*value" color={'l(90) 0:#02D28140 1:#00BAFF40'} />
        <Geom type="line" position="year*value" color={'l(90) 0:#02D281 1:#00BAFF'} size={2} />
        <Geom type="point" position="year*value" color={'#CCCCCC'} />
    </Chart>
}

