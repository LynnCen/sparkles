import React from "react";
import {Row} from "antd";
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Legend,
    ChartProps,
    LegendProps,
    GeomProps,
} from "bizcharts";
import DataSet from "@antv/data-set";

type StackItem = {
    label: string;
    key: string;
    value: number;
    color: string;
};

interface StackProps {
    prefix: string;
    suffix: string;
    data: StackItem[];
    color?: string[];
    onItemClick?: (item: StackItem) => void;
}

export const Stack = ({
                          prefix,
                          suffix,
                          data = [],
                          onItemClick = (item) => 0,
                          color = ["#339758", "#d19900"],
                          ...rest
                      }: StackProps) => {
    let total = data.reduce((r, c) => ((r += c.value), r), 0);
    return (
        <div {...rest}>
            <Row justify="space-between">
                <span>{prefix}</span>
                <span style={{opacity: 0.8}}>{suffix}</span>
            </Row>
            <Row style={{marginBottom: 4}}>
                {data.map((e, i) => {
                    console.log((e.value / total) * 100 + "%");
                    return (
                        <span
                            key={i}
                            className="text-center pointer"
                            style={{background: e.color, width: (e.value / total) * 100 + "%"}}
                            onClick={() => onItemClick!(e)}
                        >
              {e.value}
            </span>
                    );
                })}
            </Row>
            <Row justify="center">
                {data.map((e, i) => (
                    <div
                        key={i}
                        className={"flex-center-v pointer"}
                        style={{marginLeft: i ? 18 : 0}}
                        onClick={() => onItemClick!(e)}
                    >
                        <div style={{background: e.color, width: 8, height: 8, marginRight: 6}}></div>
                        <span style={{opacity: 0.8}}>{e.label}</span>
                    </div>
                ))}
            </Row>
        </div>
    );
};

interface StackChartProps extends StackProps {
    chart?: any;
    legend?: LegendProps;
    geom?: GeomProps;
}

export const StackChart = ({
                               prefix,
                               suffix,
                               data = [],
                               color = ["#339758", "#d19900"],
                               chart = {},
                               legend = {},
                               geom = {
                                   tooltip: ["type*status*value", (type, status, value) => ({
                                       name: status,
                                       title: type,
                                       value
                                   })],
                               },
                               ...rest
                           }: StackChartProps) => {
    const ds = new DataSet();
    const dv = ds
        .createView()
        .source(data)
        .transform({
            type: "percent",
            field: "value",
            dimension: "status",
            groupBy: ["type"],
            as: "percent",
        });
    const cols = {percent: {min: 0, formatter: (val) => (val * 100).toFixed(2) + "%"}};
    const chartProps: ChartProps = {height: 50, padding: [0, 0, 20, 0], ...chart};
    const legendProps = {
        offsetY: -15,
        textStyle: { fill: "rgba(255,255,255,.8)" },
        marker: "square",
        useHtml: true,
        ...legend,
        onClick: (ev) => {
            const target = ev.currentTarget;
            target["firstChild"].style.background = target["dataset"].color;
            const parent = target.parentNode;
            if (parent) {
                if (legend.selectedMode != "single") {
                    Array.from(parent.children).forEach((el, i) => {
                        if (el != target) {
                            el["classList"].remove("unChecked");
                            el["classList"].add("checked");
                        }
                    });
                } else {
                    parent.classList.add("g2-legend-list-single");
                }
            }
            (legend.onClick || (() => {}))(ev);
        },
    };
    return (
        <div {...rest}>
            <Row justify="space-between">
                {/*<span>{prefix}</span>*/}
                {/*<span style={{ opacity: 0.8 }}>{suffix}</span>*/}
            </Row>
            <Chart data={dv} scale={cols} forceFit {...chartProps}>
                <Legend {...legendProps} />
                <Coord transpose/>
                <Axis name="type" visible={false}/>
                <Axis name="percent" visible={false}/>
                <Tooltip useHtml/>
                <Geom type="intervalStack" position="type*percent" {...geom} color={["status", color]}/>
            </Chart>
        </div>
    );
};
