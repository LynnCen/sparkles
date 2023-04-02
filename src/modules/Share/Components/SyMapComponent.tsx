import React, { Component, useState } from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import { Carousel, Pagination } from 'antd';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highcharts3d from 'highcharts/highcharts-3d';
highcharts3d(Highcharts);
const scss = require("../../../styles/scss/sharepage.scss");
let vh = px => (px / 1344) * 100 + "vh";
let rem = px => px + "rem"
const FontChart = (res: number) => {
    //获取到屏幕的宽度
    var clientWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
    if (!clientWidth) return; //报错拦截：
    let fontSize = 100 * (clientWidth / 3200);
    return res * fontSize;
}
/**
 * @description 大标题
 */

interface titleNameProps {
    name: string
}

export const TitleName = ({ name }: titleNameProps) => {
    return <div className={scss['title-name']}>{name}</div>
}

/**
 * @description 通用标题样式 
 */

interface universalDomProps {
    title: string;
    children?: any
}

export const UniversalDom = ({ title, children }: universalDomProps) => {
    return <div className={scss['universal-dom']}>
        <div className={scss['universal-title']}>{title}</div>
        {children}
    </div>
}

/**
 * @description 文本模块
 */

interface textBoxProps {
    title: string;
    textShadow: string;
    num: number | string;
    unit?: string
}

export const TextBox = ({ title, textShadow, num, unit }: textBoxProps) => {
    return <div className={scss['text-box']}>
        <div>{title}</div>
        <div style={{ textShadow: `0 0 0.07rem ${textShadow}` }}>{num}<span>{unit}</span></div>
    </div>
}

/**
 * @description 成员信息
 */

interface personnelProps {
    name: string;
    position: string
}

export const Personnel = ({ name, position }: personnelProps) => {
    return <div className={scss['personnel']}>
        <div>{name}</div>
        <div>{position}</div>
    </div>
}

/**
 * @description 数据列表
 */

interface numberListProps {
    description: any[];
    data: any[]
}

export const NumberList = ({ description, data }: numberListProps) => {
    return <div className={scss['number-list']}>
        <div className={scss['number-list-title']}>
            {
                description.map((r, i) => {
                    return <div key={i}>{r}</div>
                })
            }
        </div>
        <div className={scss['number-list-content']}>
            {
                data.map((r, i) => {
                    return <div key={i} className={scss['content-child']}>
                        <div>{r.title}</div>
                        <div>{r.num}</div>
                    </div>
                })
            }
        </div>
    </div>
}

interface textLineProps {
    title: string;
    content: string,
}

export const TextLine = ({ title, content }: textLineProps) => {
    return <div className={scss['text-line']}>{title}<span>{content}</span></div>
}

interface IChartItem {
    value: number,
    name: string,
    unit?: string
}
interface IChartObj {
    data: IChartItem[],
    option?: {},
    rotate?: number,
    img?: string
}

/**
 *@description 工业企业  乡镇亩均税收排名
 */

export const HorizontalBar = (props: IChartObj) => {
    let Idata: IChartItem[] = [...props.data];
    const getOption = () => {
        let getSymbolData = (data: IChartItem[]) => {
            let arr: any = [];
            for (var i = 0; i < data.length; i++) {
                arr.push({
                    value: data[i].value,
                    symbolPosition: 'end'
                })
            }
            return arr;
        }
        let maxArr = (new Array(Idata.length)).fill(100);
        let option = {
            tooltip: {
                show: false
            },
            grid: {
                top: '10%',
                bottom: '5%',
                left: 0,
                right: '15%'
            },
            legend: {
                show: false
            },
            xAxis: {
                show: false,
                type: 'value'

            },
            yAxis: [{
                type: 'category',
                inverse: true,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisPointer: {
                    label: {
                        show: true,
                        margin: FontChart(0.3)
                    }
                },
                data: Idata.map(item => item.name),
                axisLabel: {
                    margin: FontChart(1),
                    fontSize: FontChart(0.2),
                    align: 'left',
                    color: '#fff',
                    padding: [0, 0, FontChart(0.4), FontChart(1)],
                    rich: {
                        b: {
                            color: '#03FBEE',
                            backgroundColor: "rgba(3,251,238,0.3)",
                            width: FontChart(0.32),
                            height: FontChart(0.18),
                            align: 'center',
                            borderRadius: 2
                        }
                    },
                    formatter: function (params: any) {
                        var index = Idata.map(item => item.name).indexOf(params);
                        index = index + 1;
                        return [
                            '{b|' + index + '}' + '  ' + params
                        ].join('\n')
                    }
                }
            }, {
                type: 'category',
                inverse: true,
                axisTick: 'none',
                axisLine: 'none',
                show: true,
                data: Idata.map(item => item.value),
                axisLabel: {
                    show: true,
                    fontSize: FontChart(0.2),
                    color: '#fff',
                    formatter: '{value}' + Idata[0].unit
                }
            }],
            series: [{
                name: 'XXX',
                type: 'pictorialBar',
                symbol: 'rect',
                symbolSize: [FontChart(0.04), FontChart(0.12)],
                symbolOffset: [FontChart(0.02), 0],
                z: 12,
                itemStyle: {
                    normal: {
                        color: '#02D2DA'
                    }
                },
                data: getSymbolData(Idata)
            }, {
                z: 2,
                name: 'value',
                type: 'bar',
                barWidth: FontChart(0.06),
                zlevel: 1,
                itemStyle: {
                    normal: {
                        barBorderRadius: 2,
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: 'rgba(2, 210, 218, 0.1)'
                        }, {
                            offset: 1,
                            color: '#02D2DA'
                        }]),
                    },
                },
                data: Idata.map((item, i) => {
                    return {
                        value: item.value
                    };
                }),
                label: {
                    show: false,
                    position: 'right',
                    color: '#333333',
                    fontSize: FontChart(0.14),
                    offset: [10, 0]
                }
            },
            {
                name: '背景',
                type: 'bar',
                barWidth: FontChart(0.06),
                barGap: '-100%',
                itemStyle: {
                    normal: {
                        color: 'rgba(118, 111, 111, 0.55)'
                    }
                },
                data: maxArr,
            }

            ]
        }
        return option
    };
    return <ReactEcharts
        style={{ height: '100%' }}
        option={getOption()}
    />
}

/**
 *@description 工业企业  行业分布
 */

export const PieChart = (props: IChartObj) => {
    let pieSeriesData = props.data;
    let legendArr = pieSeriesData.map(v => v.name);
    let unit = pieSeriesData.length > 0 ? pieSeriesData[0].unit : null;
    const imgSrc = `${process.env.publicPath}images/songyangMap/image/hc-project-bg.svg`
    const getOption = () => {
        let placeHolderStyle = {
            normal: {
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                color: "rgba(0, 0, 0, 0)",
                borderColor: "rgba(0, 0, 0, 0)",
                borderWidth: 0
            }
        };

        let data: any = [];
        for (let i = 0; i < pieSeriesData.length; i++) {
            data.push(
                {
                    data: pieSeriesData[i].value,
                    value: pieSeriesData[i].value,
                    name: pieSeriesData[i].name
                },
                {
                    value: 20,
                    name: "",
                    itemStyle: placeHolderStyle
                }
            );
        }
        let chartData = data;
        let option = {
            backgroundColor: '',
            tooltip: {
                trigger: 'item',
                formatter: '{b}: <br/>{c} ({d}%)'
            },
            color: ["#5045F5", "#11BC8E", "#EAE41C", "#03A5FF", "#11C9F4", "#FE4343"],
            legend: {
                orient: 'vertical',
                y: 'center',
                x: '52%',
                right: FontChart(0.3),
                icon: 'rect',
                itemWidth: FontChart(0.13),
                itemHeight: FontChart(0.13),
                itemGap: FontChart(0.2),
                data: legendArr,
                formatter: (parmars: any) => {
                    for (let i = 0; i < pieSeriesData.length; i++) {
                        if (pieSeriesData[i].name === parmars) {
                            if (parmars.length > 7) {
                                let text1 = parmars.substring(0, 7);
                                let text2 = parmars.substring(7);
                                return `{a|${text1}}{b|${pieSeriesData[i].value}}{b|${unit}}\n{a|${text2}}`;
                            } else {
                                return `{a|${parmars}}{b|${pieSeriesData[i].value}}{b|${unit}}`;
                            }
                        }
                    }
                },
                textStyle: {
                    rich: {
                        a: {
                            fontSize: FontChart(0.2),
                            lineHeight: FontChart(0.24),
                            width: FontChart(1.6),
                            color: '#fff'
                        },
                        b: {
                            fontSize: FontChart(0.2),
                            color: '#fff',
                            lineHeight: FontChart(0.24)
                        }
                    }
                }
            },
            graphic: {
                elements: [{
                    type: "image",
                    z: 6,
                    style: {
                        image: props.img,
                        width: FontChart(1.48),
                        shadowBlur: 0,
                        shadowColor: '#000',
                        shadowOffsetX: '1',
                        shadowOffsetY: '1',
                    },
                    left: '8.6%',
                    top: "30.5%"
                }]
            },
            series: [
                {
                    type: 'pie',
                    radius: ['46%', '52%'],
                    center: ['22%', '50%'],
                    label: {
                        show: false
                    },
                    emphasis: {
                        label: {
                            show: false
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: chartData
                }
            ]
        };
        return option
    };

    return <ReactEcharts
        style={{ height: '100%' }}
        option={getOption()}
    />
}

/**
 *@description 工业企业  企业产值发展趋势
 */

export const LineChart = (props: IChartObj) => {
    let chartData = props.data;
    const getOption = () => {
        let xData = chartData.map(v => v.name);
        let sData = chartData.map(v => v.value);
        let yUnit = chartData.length > 0 ? chartData[0].unit : '';

        let lineOption = {
            lineStyle: {
                color: 'rgba(42, 248, 236, 0.5)',
                type: 'dashed'
            }
        }
        let option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: '{b}: {c}' + yUnit
            },
            grid: {
                top: '25%',
                right: '0',
                left: '0',
                bottom: '8%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: xData,
                axisLine: {
                    lineStyle: {
                        color: '#1EC3CDFF'
                    }
                },
                axisLabel: {
                    margin: FontChart(0.1),
                    color: '#fff',
                    textStyle: {
                        fontSize: FontChart(0.2)
                    },
                },
            }],
            yAxis: [{
                name: yUnit,
                nameTextStyle: {
                    fontSize: FontChart(0.16),
                    color: '#fff'
                },
                nameGap: FontChart(0.2),
                axisLabel: {
                    formatter: '{value}',
                    color: '#fff',
                    fontSize: FontChart(0.2)
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                // formatter: function (name) {
                //   return '{a|' + name + '}' + '{b|50%}'
                // },
                splitLine: lineOption
            }, {
                axisLine: lineOption,
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }],
            series: [
                {
                    type: 'line',
                    symbolSize: FontChart(0.12),
                    symbol: 'circle',
                    showAllSymbol: true,
                    lineStyle: {
                        normal: {
                            width: 1,
                            color: "#02D2DA",
                        },
                    },
                    itemStyle: {
                        color: "#fff",
                        borderColor: "#02D2DA",
                        borderWidth: 1,
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(2, 210, 218, 0.6)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(2, 210, 218, 0)'
                            }
                            ], false)
                        }
                    },
                    label: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: '#03ECFFFF',
                            fontSize: FontChart(0.2),
                            fontWeight: 100
                        }
                    },
                    data: sData,
                }]
        };
        return option
    };

    return (
        <ReactEcharts
            style={{ height: '100%' }}
            option={getOption()}
        />
    );
};

/**
 *@description 工业企业  企业税收发展趋势
 */

export const BarChart = (props: IChartObj) => {
    let chartData: IChartItem[] = props.data;
    const getOption = () => {
        let xData = chartData.map(v => v.name);
        let sData = chartData.map(v => v.value);
        let yUnit = chartData.length > 0 ? chartData[0].unit : "";
        let lineOption = {
            lineStyle: {
                color: '#1EC3CDFF',
                type: 'dashed'
            }
        }

        let option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: '{b}: {c}' + yUnit
            },
            grid: {
                top: '25%',
                right: '0',
                left: '0',
                bottom: '10',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: xData,
                axisLine: {
                    lineStyle: {
                        color: '#1EC3CDFF'
                    }
                },
                axisLabel: {
                    margin: 10,
                    color: '#fff',
                    textStyle: {
                        fontSize: FontChart(0.2)
                    },
                },
            }],
            yAxis: [{
                name: yUnit,
                nameTextStyle: {
                    fontSize: FontChart(0.16),
                    color: '#fff'
                },
                nameGap: FontChart(0.2),
                axisLabel: {
                    formatter: '{value}',
                    color: '#fff',
                    fontSize: FontChart(0.2)
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                splitLine: lineOption
            }, {
                axisLine: lineOption,
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }],
            series: [{
                type: 'bar',
                data: sData,
                barWidth: FontChart(0.36),
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#02D2DA'
                        }, {
                            offset: 0.34,
                            color: 'rgba(8, 196, 220, 0.82)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(23, 163, 228, 0.36)'
                        }, {
                            offset: 1,
                            color: 'rgba(36, 137, 234, 0)'
                        }], false)
                    }
                }
            },
            {
                type: 'line',
                symbolSize: FontChart(0.12),
                symbol: 'circle',
                lineStyle: {
                    normal: {
                        width: 1,  //线条粗细
                        color: "#02D2DA",
                    },
                },
                itemStyle: {
                    color: "#fff",
                    borderColor: "#02D2DA",
                    borderWidth: 1,
                },
                label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                        color: '#03ECFFFF',
                        fontSize: FontChart(0.2),
                        fontWeight: 100
                    }
                },
                data: sData,
            }
            ]
        };
        return option
    };

    return (
        <ReactEcharts
            style={{ height: '100%' }}
            option={getOption()}
        />
    );
};

/**
 * @description 传统村落  村落收入
 */

interface IProps {
    data: any[]
}

export const LineChart2 = (props: IProps) => {
    let chartData = props.data;
    let unit: string;

    const getOption = () => {
        let fontColor = '#fff';
        let size12 = FontChart(0.12);
        let size20 = FontChart(0.2);
        let size16 = FontChart(0.16);


        let xData: string[] = [];
        let yData: any[] = [];
        chartData.map((value, index) => {
            xData.push(value.year);
            let arr: number[] = []
            value.data.map(item => {
                arr.push(item.value);
                unit = item.unit;
            })
            yData.push(arr);
        })

        let legend = chartData[0].data.map(v => v.name);

        let lineOption = {
            lineStyle: {
                color: 'rgba(42, 248, 236, 0.5)',
                type: 'dashed'
            }
        }

        let option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: legend,
                itemWidth: size12,
                itemHeight: size12,
                textStyle: {
                    fontSize: size16,
                    color: '#fff',
                },
                top: "5%"
            },
            grid: {
                top: '30%',
                right: '0',
                left: '0',
                bottom: '8%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: xData,
                axisLine: {
                    lineStyle: {
                        color: '#1EC3CD'
                    }
                },
                axisLabel: {
                    margin: 10,
                    color: fontColor,
                    textStyle: {
                        fontSize: size20
                    },
                },
            }],
            yAxis: [{
                name: unit,
                nameTextStyle: {
                    fontSize: size20,
                    color: '#fff'
                },
                nameGap: size20,
                axisLabel: {
                    formatter: '{value}',
                    color: fontColor,
                    fontSize: size20
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                splitLine: lineOption
            }, {
                axisLine: lineOption,
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }],
            series: [
                {
                    name: legend[0],
                    type: 'line',
                    symbolSize: size12,
                    symbol: 'circle',
                    showAllSymbol: true,
                    lineStyle: {
                        normal: {
                            width: 1,  //线条粗细
                            color: "rgba(44, 255, 132, 1)",
                        },
                    },
                    itemStyle: {
                        color: "rgba(44, 255, 132, 1)",
                        borderColor: "rgba(44, 255, 132, 1)",
                        borderWidth: 1,
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(44, 255, 132, 0.54)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(44, 255, 132, 0)'
                            }
                            ], false)
                        }
                    },
                    label: {
                        show: false,
                        position: 'top',
                        textStyle: {
                            color: 'rgba(44, 255, 132, 1)',
                            fontSize: size20,
                            fontWeight: 100
                        }
                    },
                    data: yData[0]
                },
                {
                    name: legend[1],
                    type: 'line',
                    symbolSize: size12,
                    symbol: 'circle',
                    showAllSymbol: true,
                    lineStyle: {
                        normal: {
                            width: 1,
                            color: "rgba(38, 230, 219,1)",
                        },
                    },
                    itemStyle: {
                        color: "rgba(38, 230, 219,1)",
                        borderColor: "rgba(38, 230, 219,1)",
                        borderWidth: 1,
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(38, 230, 219,1)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(38, 230, 219, 0)'
                            }
                            ], false)
                        }
                    },
                    label: {
                        show: false,
                        position: 'top',
                        textStyle: {
                            color: '#03ECFFFF',
                            fontSize: size20,
                            fontWeight: 100
                        }
                    },
                    data: yData[1]
                },
                {
                    name: legend[2],
                    type: 'line',
                    symbolSize: size12,
                    symbol: 'circle',
                    showAllSymbol: true,
                    lineStyle: {
                        normal: {
                            width: 1,  //线条粗细
                            color: "rgba(253, 127, 6, 1)",
                        },
                    },
                    itemStyle: {
                        color: "rgba(253, 127, 6, 1)",
                        borderColor: "rgba(253, 127, 6, 1)",
                        borderWidth: 1,
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(253, 127, 6, 0.93)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(253, 127, 6, 0)'
                            }
                            ], false)
                        }
                    },
                    label: {
                        show: false,
                        position: 'top',
                        textStyle: {
                            color: '#03ECFFFF',
                            fontSize: size12,
                            fontWeight: 100
                        }
                    },
                    data: yData[2]
                }]
        };
        return option
    };

    return (
        <ReactEcharts
            style={{ height: '100%' }}
            option={getOption()}
        />
    );
};

/**
 * @description 传统村落 
 */

export const VillageIntroduction = ({ data }: any) => {
    const [activeIndex, setActiveIndex] = useState(0)
    return <div className={scss['sy-village-box']}>
        <div className={scss['sy-village-left']}>
            <Carousel afterChange={(current) => setActiveIndex(current)} autoplay>
                {
                    data.map((item, index) => {
                        return (
                            <div key={index}>
                                <img className={scss["village-carousel-box"]} src={item.img} alt="" />
                            </div>
                        )
                    })
                }
            </Carousel>
        </div>
        <div className={scss['sy-village-right']}>
            <div className={scss['sy-village-title']}>简介：</div>
            <div className={scss['sy-village-text']}>{data[activeIndex].text}</div>
        </div>
    </div>
}

/**
 * @description 传统村落 游客接待量
 */

interface StatisticalProps {
    data: {
        name?: string,
        value: number,
        unit?: string
    }
}

export const StatisticalInfo = ({ data }: StatisticalProps) => {
    return (<div className={scss['sy-statiscal-item']}>
        <div>
            <span className={scss['sy-statiscal-item-value']}>{data.value}</span>
            <span className={scss['sy-statiscal-item-unit']}>{data.unit}</span>
        </div>
        <div className={scss['sy-statiscal-item-text']}>{data.name}</div>
    </div>)
}


/**
 * @description 民生工程  项目进度
 */

interface msgcProps {
    data: any[]
}

export const HorizontalBar2 = (props: msgcProps) => {
    let [dataArr1, dataArr2] = props.data;
    let sDataArr1: number[] = [];
    let sDataArr2: number[] = [];
    let yAxisArr: string[] = [];
    let yAxisTextArr1: string[] = [];
    let yAxisTextArr2: string[] = [];
    sDataArr1 = dataArr1.map(item => item.value).reverse();
    sDataArr2 = dataArr2.map(item => item.value).reverse();
    yAxisArr = dataArr2.map(item => item.name).reverse();
    yAxisTextArr1 = dataArr1.map(item => item.text).reverse();
    yAxisTextArr2 = dataArr2.map(item => item.text).reverse();

    const getOption = () => {
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            color: [new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
                offset: 0,
                color: '#CC3A3A'
            },
            {
                offset: 1,
                color: 'rgba(204, 58, 58, 0.2)'
            }]), new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
                offset: 0,
                color: '#02D2DA'
            },
            {
                offset: 1,
                color: 'rgba(36, 137, 234, 0)'
            }])],
            grid: {
                left: '0',
                right: '0',
                top: '8%',
                bottom: '8%',
                containLabel: true,
                show: false
            },
            xAxis: {
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: 'rgba(33,207,219,0.5)'
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: yAxisArr,
                axisLabel: {
                    color: '#FFFFFF',
                    fontSize: FontChart(0.2),
                    formatter: (parmars: any) => {
                        let text1 = parmars.substring(0, 2);
                        let text2 = parmars.substring(2);
                        return `${text1}\n${text2}`;
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(5, 207, 219, 1)'
                    }
                },
            },
            series: [
                {
                    name: '',
                    type: 'bar',
                    label: {
                        show: true,
                        color: 'white',
                        fontSize: FontChart(0.2),
                        formatter: (parmars: any) => {
                            return parmars.data > 0 ? yAxisTextArr1[parmars.dataIndex] : '';
                        },
                        position: "insideLeft"
                    },
                    data: sDataArr1
                },
                {
                    name: '',
                    type: 'bar',
                    label: {
                        show: true,
                        color: 'white',
                        fontSize: FontChart(0.2),
                        formatter: (parmars: any) => {
                            return parmars.data > 0 ? yAxisTextArr2[parmars.dataIndex] : '';
                        },
                        position: "insideLeft"
                    },
                    data: sDataArr2
                }
            ]
        }
        return option
    };
    return <ReactEcharts
        style={{ height: '100%' }}
        option={getOption()}
    />
}

/**
 * @description   类型占比
 */

export const PieChart2 = (props: IChartObj) => {
    let pieSeriesData = props.data;
    let legendArr = pieSeriesData.map(v => v.name);
    let unit = pieSeriesData.length > 0 ? pieSeriesData[0].unit : null;

    const getOption = () => {
        let placeHolderStyle = {
            normal: {
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                color: "rgba(0, 0, 0, 0)",
                borderColor: "rgba(0, 0, 0, 0)",
                borderWidth: 0
            }
        };

        let data: any[] = [];
        for (let i = 0; i < pieSeriesData.length; i++) {
            data.push(
                {
                    data: pieSeriesData[i].value,
                    value: pieSeriesData[i].value,
                    name: pieSeriesData[i].name
                },
                {
                    value: 2,
                    name: "",
                    itemStyle: placeHolderStyle
                }
            );
        }
        let chartData = data;
        let option = {
            backgroundColor: '',
            title: [{
                text: "项目总数",
                subtext: 386,
                textStyle: {
                    fontSize: FontChart(0.29),
                    color: "#fff",
                    fontWeight: 100,
                    textShadowColor: '0px 0px 7px #31B0F7'
                },
                subtextStyle: {
                    fontSize: FontChart(0.35),
                    color: "#F3FCFF",
                },
                textAlign: "center",
                x: '49%',
                y: '25%',
            }],
            tooltip: {
                trigger: 'item',
                formatter: '{b}: <br/>{c} ({d}%)'
            },
            color: ["#03A5FF", "#21CFD7", "#1160BC", "#11BC8E", "#F8B04E", "#FF0808", "#11C9F4", "#1CFFC2", "#F97B26", "#F6FF19"],
            legend: {
                data: legendArr,
                x: 'center',
                bottom: '10',
                icon: 'rect',
                itemWidth: FontChart(0.13),
                itemHeight: FontChart(0.13),
                itemGap: FontChart(0.1),
                textStyle: {
                    color: '#fff',
                    fontSize: FontChart(0.2)
                },
                formatter: (parmars: any) => {
                    for (let i = 0; i < pieSeriesData.length; i++) {
                        if (pieSeriesData[i].name === parmars) {
                            return `${parmars}  ${pieSeriesData[i].value}${unit}`;
                        }
                    }
                },
            },
            series: [
                {
                    type: 'pie',
                    radius: ['46%', '50%'],
                    center: ['50%', '33%'],
                    label: {
                        show: false
                    },
                    emphasis: {
                        label: {
                            show: false
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: chartData
                },
                {
                    type: 'pie',
                    radius: ['38%', '0%'],
                    center: ['50%', '33%'],
                    z: 0,
                    tooltip: {
                        show: false
                    },
                    data: [{
                        hoverOffset: 1,
                        value: 100,
                        itemStyle: {
                            color: 'rgba(114, 209, 216, 0.16)',
                        },
                        label: {
                            show: false
                        },
                        labelLine: {
                            normal: {
                                smooth: true,
                                lineStyle: {
                                    width: 0
                                }
                            }
                        },
                        hoverAnimation: false,
                    },]
                },
            ]
        };
        return option
    };

    return (
        <ReactEcharts
            style={{ height: '100%' }}
            option={getOption()}
        />
    );
};

/**
 * @description 民生工程 项目清单
 */

interface projectListProps {
    data: {
        name: string,
        type: string,
        location: string,
        text: string,
        status?: number,
        result?: number,
    },
    itemIndex: number,
    newClassName?: string
}

export const ProjectList = ({ data, itemIndex, newClassName = "" }: projectListProps) => {
    return <div className={scss['sy-project-list'] + " " + scss[`sy-project-list${data.result}`] + " " + scss[newClassName]} >
        <div className={scss['sy-project-list-top']}>
            <div className={scss['sy-project-list-top-order']}>{itemIndex + 1}</div>
            <div className={scss['sy-project-list-top-content']}>{data.name}</div>
            {
                data.result ? <div className={scss['sy-project-list-top-btn']}>发起处置</div> : null
            }
        </div>
        <div className={scss['sy-project-list-bottom'] + " " + scss['sy-project-list-police']}>
            <div className={scss['sy-project-list-police-left']}>
                {
                    data.status ? <div>[{['未处置', '已处置'][data.status - 1]}]</div> : null
                }
                <div>{data.type}</div>
                <div>{data.location}</div>
            </div>
            <div className={scss['sy-project-list-police-right']}>
                <div>{data.text}</div>
            </div>
        </div>
    </div>
}

interface PaginationProps {
    pagination: {
        current: number;
        total: number
    };
    onChange: (value) => void;
}

export const PaginationCom = (props: PaginationProps) => {
    return <div className={scss['sy-pagination-com']}>
        <Pagination
            current={props.pagination.current}
            onChange={(page, pageSize) => props.onChange(page)}
            total={props.pagination.total}
            pageSize={6}

        />
    </div>
}

/**
 * @description 民生工程  各乡镇项目情况
 */

interface msgcProps2 {
    data: {
        plan: {
            text: string,
            data: IChartItem[]
        },
        started: {
            text: string,
            data: IChartItem[]
        },
        complete: {
            text: string,
            data: IChartItem[]
        },
    }
}

export const StackedBarChart = (props: msgcProps2) => {
    let planData: any[] = [];
    planData = props.data.plan.data.map(item => item.value);
    let startedData: any[] = [];
    startedData = props.data.started.data.map(item => item.value);
    let completeData: any[] = [];
    completeData = props.data.complete.data.map(item => item.value);

    let xAxis = props.data.plan.data.map(item => item.name)

    let planName = props.data.plan.text;
    let startedName = props.data.started.text;
    let completeName = props.data.complete.text;
    let legendArr = [planName, startedName, completeName];

    const getOption = () => {
        let fontSize = FontChart(0.2);
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: legendArr,
                bottom: '0',
                left: 'center',
                itemWidth: FontChart(0.13),
                itemHeight: FontChart(0.13),
                textStyle: {
                    color: 'white',
                    fontSize: fontSize
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                top: '15%',
                bottom: '12%',
                containLabel: true
            },
            color: [new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
                offset: 0,
                color: 'rgba(36, 137, 234, 0)'
            }, {
                offset: 0.42,
                color: 'rgba(21, 169, 226, 0.44)'
            }, {
                offset: 0.82,
                color: 'rgba(7, 198, 220, 0.84)'
            }, {
                offset: 1,
                color: '#02D2DA'
            }]), new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
                offset: 0,
                color: 'rgba(234, 164, 7, 0.2)'
            }, {
                offset: 1,
                color: '#EAA407'
            }]), new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
                offset: 0,
                color: 'rgba(39, 186, 4, 0.2)'
            }, {
                offset: 1,
                color: '#27BA04'
            }])],
            xAxis: [
                {
                    type: 'category',
                    data: xAxis,
                    axisLabel: { interval: 0, rotate: 30, color: '#FFFFFF', fontSize: FontChart(0.18) },
                    axisLine: {
                        lineStyle: {
                            color: '#05CFDB'
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: { color: '#FFFFFF', fontSize: fontSize },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: 'rgba(33,207,219,0.5)'
                        }
                    }
                }
            ],
            series: [
                {
                    name: planName,
                    type: 'bar',
                    emphasis: {
                        focus: 'series'
                    },
                    // label: {
                    //   show: true,
                    //   position: 'top',
                    //   color: '#03ECFF',
                    //   fontSize: fontSize
                    // },
                    data: planData
                },
                {
                    name: startedName,
                    type: 'bar',
                    stack: '实际',
                    emphasis: {
                        focus: 'series'
                    },
                    data: startedData
                },
                {
                    name: completeName,
                    type: 'bar',
                    stack: '实际',
                    emphasis: {
                        focus: 'series'
                    },
                    data: completeData
                },
            ]
        };
        return option
    };
    return (
        <ReactEcharts
            style={{ height: '100%' }}
            option={getOption()}
        />
    );
};

/**
 * @description 动态事件 
 */

interface comTabsProps {
    data: string[];
    activeIndex: number;
    longBtnIndex?: number[],
    [propsName: string]: any
}

export const ComTabs = ({ ...props }: comTabsProps) => {
    return <div className={scss["sy-tabs-box"]}>
        {
            props.data.map((r, i) => {
                return <div
                    className={
                        scss['sy-tabs-item'] + " " +
                        (props.activeIndex === i && scss['sy-tabs-active']) + " " +
                        (props.longBtnIndex && props.longBtnIndex.includes(i) && scss['sy-tabs-item-long'])
                    }
                    key={i}
                    onClick={() => props.onClick(i)}
                >
                    {r}
                </div>
            })
        }
    </div >
}

export const BarChart2 = (props: IChartObj) => {
    let chartData: IChartItem[] = props.data;
    const getOption = () => {
        let xData = chartData.map(v => v.name);
        let sData = chartData.map(v => v.value);
        let yUnit = chartData.length > 0 ? chartData[0].unit : "";
        let rotate = props.rotate !== undefined ? props.rotate : 30
        console.log(props.rotate, rotate);


        let size20 = FontChart(0.2);
        let size36 = FontChart(0.36);

        var getSymbolData = (data: IChartItem[]) => {
            let arr: any = [];
            for (var i = 0; i < data.length; i++) {
                arr.push({
                    value: data[i].value,
                    symbolPosition: 'end'
                })
            }
            return arr;
        }

        let lineOption = {
            lineStyle: {
                color: 'rgba(33, 207, 219, 0.5)',
                type: 'dashed'
            }
        }

        let option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                top: '18%',
                right: '0',
                left: '0',
                bottom: '10',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: xData,
                axisLine: {
                    lineStyle: {
                        color: '#1EC3CDFF'
                    }
                },
                axisLabel: {
                    interval: 0,
                    rotate: rotate,
                    color: '#fff',
                    textStyle: {
                        fontSize: FontChart(0.18)
                    },
                },
            }],
            yAxis: [{
                name: yUnit,
                nameTextStyle: {
                    fontSize: FontChart(0.16),
                    color: '#fff'
                },
                nameGap: size20,
                axisLabel: {
                    formatter: '{value}',
                    color: '#fff',
                    fontSize: size20
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                splitLine: lineOption
            }, {
                axisLine: lineOption,
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }],
            series: [{
                name: 'XXX',
                type: 'pictorialBar',
                symbol: 'rect',
                symbolSize: [size36, FontChart(0.06)],
                symbolOffset: [0, 0],
                z: 12,
                itemStyle: {
                    normal: {
                        color: '#00F8ECFF'
                    }
                },
                data: getSymbolData(chartData)
            }, {
                type: 'bar',
                data: sData,
                barWidth: size36,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#02D2DA'
                        }, {
                            offset: 0.34,
                            color: 'rgba(8, 196, 220, 0.82)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(23, 163, 228, 0.36)'
                        }, {
                            offset: 1,
                            color: 'rgba(36, 137, 234, 0)'
                        }], false)
                    }
                },
                label: {
                    show: true,
                    position: 'top',
                    // margin: 10,
                    textStyle: {
                        color: '#03ECFFFF',
                        fontSize: FontChart(0.2),
                        fontWeight: 100
                    }
                },
            }]
        };
        return option
    };

    return (
        <ReactEcharts
            style={{ height: '100%' }}
            option={getOption()}
        />
    );
}


/**
 * @description 简易环形图 
 */

interface simpleProps {
    data: IChartItem[],
    color: string[][],
    lineFeedIndex?: number
}

export const SimplePicChart = ({ data, color, lineFeedIndex }: simpleProps) => {
    let size20 = FontChart(0.2);

    const getOption = () => {
        let item: IChartItem = { name: "", value: 0, unit: "" };

        if (data.length > 1) {
            item = data[0]
        }

        let dataFormat: IChartItem[] = [];
        data.map(value => {
            let newVla = { ...value };
            dataFormat.push(newVla);
        });
        let title = item.name;
        if (lineFeedIndex) {
            let titleArr = item.name.split("");
            for (let i = 1; i * lineFeedIndex - 1 < titleArr.length; i++) {
                titleArr[i * lineFeedIndex - 1] += '\n';
            }
            title = titleArr.join("");
        }

        let option = {
            backgroundColor: '',
            title: [{
                text: title,
                textAlign: 'center',
                x: '45%',
                y: '75%',
                textStyle: {
                    color: '#FAFFFF',
                    fontSize: size20,
                    fontWeight: 'normal',
                    textShadowBlur: 10,
                    textShadowColor: color[1][1],
                    lineHeight: FontChart(0.24)
                }
            }],
            legend: {
                show: false
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    hoverAnimation: false,
                    legendHoverLink: false,
                    radius: ['60%', '75%'],
                    center: ['50%', '45%'],
                    color: color[0],
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false,
                    },
                    tooltip: {
                        show: false,
                    },
                    data: dataFormat
                },
                {
                    name: item.name,
                    type: 'pie',
                    radius: ['70%', '75%'],
                    center: ['50%', '45%'],
                    color: color[1],
                    label: {
                        normal: {
                            formatter: function () {
                                return `{a|${item.value}}{c|\n}{c|/${item.unit}}`;
                            },
                            position: 'center',
                            show: true,
                            textStyle: {
                                rich: {
                                    a: {
                                        fontSize: FontChart(0.36),
                                        color: '#fff',
                                        textShadowBlur: 7,
                                        textShadowColor: color[1][1]
                                    },
                                    c: {
                                        fontSize: size20,
                                        color: '#fff',
                                        textShadowBlur: 7,
                                        textShadowColor: color[1][1]
                                    }
                                }
                            }
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: data
                }
            ]
        };
        return option
    };

    return <ReactEcharts
        style={{ height: '100%' }}
        option={getOption()}
    />
}

/**
 * @description 环形图 
 */

interface PicChartProps {
    data: IChartItem[],
    color?: string[],
    total: IChartItem,
    showLegend?: boolean
}

export const PicChart = ({ data, color, total, showLegend }: PicChartProps) => {
    const getOption = () => {
        let size20 = FontChart(0.2);
        let size28 = FontChart(0.28);
        let size32 = FontChart(0.32);

        let option = {
            title: {
                text: total.name,
                subtext: total.value,
                left: 'center',
                top: '34%',
                textStyle: {
                    fontSize: size28,
                    color: '#FFFFFF',
                    fontWeight: 500
                },
                subtextStyle: {
                    color: '#FFFFFF',
                    fontSize: size32,
                    textShadowColor: '#31B0F7',
                    textShadowBlur: 7,
                    fontWeight: "bold"
                },
            },
            legend: {
                show: showLegend,
                x: 'center',
                bottom: '10',
                icon: 'rect',
                itemWidth: FontChart(0.13),
                itemHeight: FontChart(0.13),
                itemGap: size28,
                textStyle: {
                    color: '#fff',
                    fontSize: FontChart(0.2)
                },
                formatter: (parmars: any) => {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].name === parmars) {
                            return `${parmars}`;
                        }
                    }
                },
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: <br/>{c} ({d}%)'
            },
            color: color,
            series: [
                {
                    name: '',
                    type: 'pie',
                    avoidLabelOverlap: false,
                    radius: ["68%", "75%"],
                    center: ["50%", "55%"],
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: "outside",
                                padding: [FontChart(showLegend ? -0.4 : -0.8), FontChart(-1.2), 0, FontChart(-1.2)],
                                formatter: (params: any) => {
                                    if (!showLegend) {
                                        return `{b|${params.data.name}:}\n {c|${params.data.value}}{d|${params.data.unit}}`
                                    } else {
                                        return `{c|${params.data.value}}{d|${params.data.unit}}`
                                    }
                                },
                                rich: {
                                    b: {
                                        fontSize: size20,
                                        color: "#fff",
                                        lineHeight: size28
                                    },
                                    c: {
                                        fontSize: size28,
                                        color: "#fff",
                                        textShadowColor: 'rgba(49, 176, 247, 1)',
                                        textShadowBlur: 7
                                    },
                                    d: {
                                        color: '#F3FCFF',
                                        fontSize: size20,
                                        textShadowColor: 'rgba(49, 176, 247, 1)',
                                        textShadowBlur: 7,
                                    }
                                }
                            },
                            labelLine: {
                                length: size20,
                                length2: FontChart(1.4),
                                show: true
                            }
                        }
                    },
                    data: data
                },
                {
                    type: 'pie',
                    radius: ['55%', '0%'],
                    center: ['50%', '55%'],
                    z: 0,
                    tooltip: {
                        show: false
                    },
                    data: [{
                        hoverOffset: 1,
                        value: 100,
                        itemStyle: {
                            color: 'rgba(114, 209, 216, 0.16)',
                        },
                        label: {
                            show: false
                        },
                        hoverAnimation: false,
                    },]
                }
            ]

        };
        return option
    };
    return <ReactEcharts
        style={{ height: '100%' }}
        option={getOption()}
    />
}

/**
 * @description 对比图
 */

interface ContrastChartItem {
    text: string,
    data: IChartItem[]
}

interface ContrastChartProps {
    data: ContrastChartItem[]
}

export const ContrastChart = ({ data }: ContrastChartProps) => {
    const getOption = () => {
        let xData = []
        let sData: any[] = [];
        let legend: string[] = [];

        for (let i = 0; i < data.length; i++) {
            let arr = [];
            for (let j = 0; j < data[i].data.length; j++) {
                if (i == 0) {
                    xData.push(data[i].data[j].name);
                }
                arr.push(data[i].data[j].value)
            }
            legend.push(data[i].text);
            sData.push(arr);
        }

        let colors = [{
            borderColor: "rgba(2, 210, 218, 1)",
            start: "rgba(2, 210, 218, 1)",
            end: "rgba(2, 210, 218, 0.1)"
        },
        {
            borderColor: "rgba(2, 210, 218, 1)",
            start: "rgba(2, 210, 218, 0.1)",
            end: "rgba(2, 210, 218, 1)"
        }];

        let size20 = FontChart(0.2);
        let size6 = FontChart(0.06);
        let size4 = FontChart(0.04);
        let size12 = FontChart(0.12);

        let getSymbolData = (data: number[]) => {
            let arr: any = [];
            for (let i = 0; i < data.length; i++) {
                arr.push({
                    value: data[i],
                    symbolPosition: 'end'
                })
            }
            return arr;
        }

        let option = {
            baseOption: {
                backgroundColor: '',
                timeline: {
                    show: false,
                    top: 0,
                    data: []
                },
                legend: {
                    "icon": "none",
                    top: '-2%',
                    left: 'center',
                    itemWidth: size20,
                    itemHeight: 5,
                    itemGap: FontChart(1),
                    textStyle: {
                        color: '#03FBEE',
                        fontWeight: "bold",
                        fontSize: size20,
                    },
                    data: legend
                },
                grid: [{
                    show: false,
                    left: '0',
                    top: '10%',
                    bottom: '8%',
                    containLabel: true,
                    width: '37%'
                }, {
                    show: false,
                    left: '54%',
                    top: '10%',
                    bottom: '8%',
                    width: '0%'
                }, {
                    show: false,
                    right: '0',
                    top: '10%',
                    bottom: '8%',
                    containLabel: true,
                    width: '37%'
                }],
                xAxis: [{
                    type: 'value',
                    inverse: true,
                    splitLine: {
                        show: false,
                    },
                    axisLabel: {
                        show: false
                    },
                }, {
                    gridIndex: 1,
                    show: false
                }, {
                    gridIndex: 2,
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                }],
                yAxis: [{
                    type: 'category',
                    inverse: true,
                    position: 'right',
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    data: xData
                }, {
                    gridIndex: 1,
                    type: 'category',
                    inverse: true,
                    position: 'left',
                    axisLabel: {
                        show: true,
                        padding: [30, 0, 0, 0],
                        textStyle: {
                            color: '#ffffff',
                            fontSize: size20
                        },
                        align: "center"

                    },
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false
                    },
                    data: xData.map(function (value) {
                        return {
                            value: value,
                            textStyle: {
                                align: 'center'
                            }
                        }
                    })
                }, {
                    gridIndex: 2,
                    type: 'category',
                    inverse: true,
                    position: 'left',
                    axisLine: {
                        show: false,
                    },
                    axisLabel: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    data: xData
                }],
                series: []

            },
            options: [{
                series: [{
                    name: legend[0],
                    type: "bar",
                    barWidth: size6,
                    stack: "1",
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: colors[0].start
                            },
                            {
                                offset: 1,
                                color: colors[0].end
                            }
                            ]),
                        }
                    },
                    label: {
                        normal: {
                            show: false,
                        }
                    },
                    data: sData[0],
                    animationEasing: "elasticOut"
                },
                {
                    name: 'XXX',
                    type: 'pictorialBar',
                    symbol: 'rect',
                    symbolSize: [size4, size12],
                    symbolOffset: [0, 0],
                    z: 10,
                    itemStyle: {
                        normal: {
                            color: colors[1].borderColor
                        }
                    },
                    data: getSymbolData(sData[0])
                },
                {
                    name: legend[1],
                    type: "bar",
                    stack: "2",
                    barWidth: size6,
                    xAxisIndex: 2,
                    yAxisIndex: 2,
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: colors[1].start
                            },
                            {
                                offset: 1,
                                color: colors[1].end
                            }
                            ]),
                        }
                    },
                    label: {
                        normal: {
                            show: false,
                        }
                    },
                    data: sData[1],
                    animationEasing: "elasticOut"
                },
                {
                    name: 'XXX',
                    type: 'pictorialBar',
                    symbol: 'rect',
                    symbolSize: [size4, size12],
                    symbolOffset: [0, 0],
                    z: 12,
                    xAxisIndex: 2,
                    yAxisIndex: 2,
                    itemStyle: {
                        normal: {
                            color: colors[1].borderColor
                        }
                    },
                    data: getSymbolData(sData[1]),
                },
                ]
            }]
        }

        return option
    }

    return <ReactEcharts
        style={{ height: '100%' }}
        option={getOption()}
    />
}

/**
 * @description 
 */

interface legendComObj {
    name: string;
    y: number;
    unit: string;
}

interface legendComProps {
    data: legendComObj[]
}

export const LegendCom = ({ data }: legendComProps) => {
    let colorList = ["#11BC8E", "#03A5FF", "#E2D71A"]
    return <div
        className={scss['sy-chart-legend']}
    >
        {
            data.map((r, i) => {
                return <div className={scss['sy-chart-legend-item']}>
                    <div className={scss['sy-chart-legend-icon']} style={{ background: colorList[i] }}></div>
                    <span className={scss['sy-chart-legend-name']}>{r.name}</span>
                    <span className={scss['sy-chart-legend-data']}>{r.y}</span>
                    <span className={scss['sy-chart-legend-unit']}>{r.unit}</span>
                </div>
            })
        }
    </div>
}
/**
 * @description 生态资源 生态保护情况
 */
interface IItem {
    name: string,
    value: number,
    unit: string
}

interface IObj {
    img: string,
    data: IItem[]
}

interface IProps {
    datas: IObj
}

export const ScenicSpot = (props: IProps) => {
    let { img, data } = props.datas;
    const syimg = `${process.env.publicPath}images/songyangMap/image/${img}.svg`
    console.log(syimg);

    return (
        <div className={scss["sy-scenic-spot"]}>
            <div className={scss["sy-scenic-spot-list"]}>
                {
                    data.map((item, index) => {
                        return (
                            <div className={scss["sy-scenic-spot-item"]} key={index}>
                                <span className={scss["sy-scenic-spot-item-data"]}>{item.value}</span>
                                <span className={scss["sy-scenic-spot-item-unit"]}>{item.unit}</span>
                            </div>
                        )
                    })
                }
            </div>
            <img className={scss["sy-img"]} src={syimg} />
            <div className={scss["sy-scenic-spot-list"]}>
                {
                    data.map((item, index) => {
                        return (
                            <div className={scss["sy-scenic-spot-text"]} key={index}>{item.name}</div>
                        )
                    })
                }
            </div>
        </div>
    )
}
/**
 * @description 生态资源 
 */
export interface IChartItem1 {
    value: number,
    name: string,
    unit?: string
}
/**
 * titleStyle:标题样式
 * legendStyle:图例样式 、位置等
 * seriesRadius：环形饼状图 圈大小
 * seriesCenter：环形饼状图 圈位置
 * intervalVal: 饼图间隔空隙大小
 */
export interface IChartObj1 {
    datas: IChartItem1[],
    title: string,
    total: number,
    titleStyle?: {},
    color?: string[],
    legendStyle?: {},
    seriesRadius?: string[][],
    seriesCenter?: string[],
    intervalVal?: number
}
export const PieChart3 = (props: IChartObj1) => {
    let pieSeriesData = props.datas;
    let legendArr = pieSeriesData.map(v => v.name);
    let unit = pieSeriesData.length > 0 ? pieSeriesData[0].unit : null;

    let colors: string[] = ["#03A5FF", "#21CFD7", "#1160BC", "#11BC8E", "#F8B04E", "#FF0808", "#11C9F4", "#1CFFC2", "#F97B26", "#F6FF19"];
    if (props.color) {
        colors = props.color;
    }

    let defaultLegend: {} = {
        data: legendArr,
        orient: 'horizontal',
        x: 'center',
        y: 'bottom',
        icon: 'rect',
        itemWidth: FontChart(0.13),
        itemHeight: FontChart(0.13),
        itemGap: FontChart(0.1),
        textStyle: {
            color: '#fff',
            fontSize: FontChart(0.2)
        },
        formatter: (parmars: any) => {
            for (let i = 0; i < pieSeriesData.length; i++) {
                if (pieSeriesData[i].name === parmars) {
                    return `${parmars}  ${pieSeriesData[i].value}${unit}`;
                }
            }
        },
    }

    let defaultTitle = {
        text: props.title,
        subtext: props.total,
        textStyle: {
            fontSize: FontChart(0.29),
            color: "#fff",
            fontWeight: 100,
            textShadowColor: '0px 0px 7px #31B0F7'
        },
        subtextStyle: {
            fontSize: FontChart(0.35),
            color: "#F3FCFF",
        },
        textAlign: "center",
        x: '49%',
        y: '25%',
    }

    let titleStyle = {};
    let legendStyle = {};
    let seriesRadius = [['46%', '50%'], ['38%', '0%']];
    let seriesCenter = ['50%', '33%'];

    if (props.legendStyle) {
        legendStyle = Object.assign({}, defaultLegend, props.legendStyle)
    } else {
        legendStyle = defaultLegend;
    }
    if (props.titleStyle) {
        titleStyle = Object.assign({}, defaultTitle, props.titleStyle)
    } else {
        titleStyle = defaultTitle;
    }
    if (props.seriesRadius) {
        seriesRadius = props.seriesRadius
    }
    if (props.seriesCenter) {
        seriesCenter = props.seriesCenter
    }
    const getOption = () => {
        let placeHolderStyle = {
            normal: {
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                color: "rgba(0, 0, 0, 0)",
                borderColor: "rgba(0, 0, 0, 0)",
                borderWidth: 0
            }
        };

        let data = [];
        for (let i = 0; i < pieSeriesData.length; i++) {
            data.push(
                {
                    data: pieSeriesData[i].value,
                    value: pieSeriesData[i].value,
                    name: pieSeriesData[i].name
                },
                {
                    value: props.intervalVal || 2,
                    name: "",
                    itemStyle: placeHolderStyle
                }
            );
        }
        let chartData = data;
        let option = {
            backgroundColor: '',
            title: titleStyle,
            tooltip: {
                trigger: 'item',
                formatter: '{b}: <br/>{c} ({d}%)'
            },
            color: colors,
            legend: legendStyle,
            series: [
                {
                    type: 'pie',
                    radius: seriesRadius[0],
                    center: seriesCenter,
                    label: {
                        show: false
                    },
                    emphasis: {
                        label: {
                            show: false
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: chartData
                },
                {
                    type: 'pie',
                    radius: seriesRadius[1],
                    center: seriesCenter,
                    z: 0,
                    tooltip: {
                        show: false
                    },
                    data: [{
                        hoverOffset: 1,
                        value: 100,
                        itemStyle: {
                            color: 'rgba(114, 209, 216, 0.16)',
                        },
                        label: {
                            show: false
                        },
                        labelLine: {
                            normal: {
                                smooth: true,
                                lineStyle: {
                                    width: 0
                                }
                            }
                        },
                        hoverAnimation: false,
                    },]
                },
            ]
        };
        return option
    };

    return (
        <ReactEcharts
            style={{ height: '100%' }}
            option={getOption()}
        />
    );
};
/**
 * @description 生态资源  耕、林地发展趋势
 */
interface Chart4Obj {
    value: number,
    name: string,
    unit?: string,
    text: string,
}
interface Chart4Props {
    datas: Chart4Obj[][],
    color?: string[][],
    showyAxisLabel?: boolean,
    lineFeedIndex?: number,
    showBarLabel?: boolean
}
export class Chart4 extends Component<Chart4Props>{
    static defaultProps = {
        color: [
            ["rgba(2, 210, 218, 0)", "rgba(2, 210, 218, 1)"],
            ["rgba(232, 255, 0, 0)", "rgba(232, 255, 0, 1)"],
            ["rgba(204, 58, 58, 0)", "rgba(204, 58, 58, 1)"],
            ["rgba(17, 188, 142, 0)", "rgba(17, 188, 142, 1)"],
        ],
        showyAxisLabel: true
    }

    getOption = () => {
        let fontSize = FontChart(0.2);
        let size16 = FontChart(0.16);

        let series: any[] = [];
        let obj = {};
        let legend = "";
        let legendArr: string[] = [];
        let showBarLabel = false;
        if (this.props.showBarLabel) {
            showBarLabel = true
        }
        let colorArr: [][] = [];
        this.props.datas.map((item, index) => {
            let color = colorArr[index]
            legend = item[index].text;
            obj = {
                name: legend,
                type: 'bar',
                barWidth: size16,
                data: this.props.datas[index],
                label: {
                    show: showBarLabel,
                    position: 'top',
                    textStyle: {
                        color: this.props.color ? this.props.color[index][1] : "",
                        fontSize: FontChart(0.2),
                        fontWeight: 100
                    }
                },
            }
            series.push(obj);
            legendArr.push(legend);
        })
        let xAxis = this.props.datas[0].map(item => item.name);
        let unit = this.props.datas[0][0].unit;



        let newColors: any[] = [];
        if (this.props.color) {
            for (let i = 0; i < this.props.color.length; i++) {
                let arr: any[] = [];
                let obj = {};
                for (let j = 0; j < this.props.color[i].length; j++) {
                    obj = {
                        offset: j,
                        color: this.props.color[i][j]
                    }
                    arr.push(obj);
                }
                let item = new echarts.graphic.LinearGradient(1, 1, 0, 0, arr)
                newColors.push(item);
            }
        }

        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                bottom: '0',
                left: 'center',
                itemWidth: FontChart(0.13),
                itemHeight: FontChart(0.13),
                textStyle: {
                    color: 'white',
                    fontSize: fontSize
                },
            },
            grid: {
                left: '4%',
                right: '0',
                top: '20%',
                bottom: '15%',
                containLabel: true
            },
            color: newColors,
            xAxis: [
                {
                    type: 'category',
                    data: xAxis,
                    axisLabel: {
                        color: '#FFFFFF',
                        fontSize: FontChart(0.18),
                        interval: 0,
                        formatter: (parmars: any) => {
                            let text = parmars;
                            if (this.props.lineFeedIndex) {
                                let titleArr = parmars.split("");
                                for (let i = 1; i * this.props.lineFeedIndex - 1 < titleArr.length; i++) {
                                    titleArr[i * this.props.lineFeedIndex - 1] += '\n';
                                }
                                text = titleArr.join("");
                            }
                            return text;
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#05CFDB'
                        }
                    }
                }
            ],
            yAxis: [
                {
                    name: unit,
                    nameTextStyle: {
                        fontSize: size16,
                        color: '#fff',
                        padding: [0, 0, 0, FontChart(-0.16)]
                    },
                    type: 'value',
                    axisLabel: {
                        color: '#FFFFFF',
                        fontSize: fontSize,
                        show: this.props.showyAxisLabel
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: 'rgba(33,207,219,0.5)'
                        }
                    }
                }
            ],
            series: series
        };
        return option
    };
    render() {
        return (
            <ReactEcharts
                style={{ height: '100%' }}
                option={this.getOption()}
            />
        );
    }

};

/**
 * @description 生态资源  产业发展资源
 */

interface LineChart1ChartItem {
    value: number,
    name: string,
    unit: string,
    year: string | number
}
/**
 * legendStyle 图例样式
 * areaStyleOpacity 面积渐变 默认展示面积渐变透明度0.54，0时不展示
 */
interface LineChart1Props {
    datas: LineChart1ChartItem[][],
    colors?: string[],
    legendStyle?: {},
    areaStyleOpacity?: number
}

export const LineChart1 = (props: LineChart1Props) => {
    let chartData = props.datas;
    let unit: string;

    const getOption = () => {
        let fontColor = '#fff';
        let size12 = FontChart(0.12);
        let size20 = FontChart(0.2);
        let size16 = FontChart(0.16);

        let legend = chartData.map(v => v[0].name);
        let colors = ["rgba(44, 255, 132, 1)", "rgba(38, 230, 219,1)", "rgba(253, 127, 6, 1)", "rgba(2, 207, 215, 1)", "rgba(245, 212, 74, 1)", "rgba(29, 188, 142, 1)", "rgba(249, 123, 38, 1)", "rgba(193, 56, 57, 1)"]

        if (props.colors) {
            colors = props.colors;
        }

        let xData: any[] = [];
        let xArr: any = [];
        let series: any[] = [];
        let areaStyleOpacity = 0.54
        if (typeof (props.areaStyleOpacity) != "undefined") {
            areaStyleOpacity = props.areaStyleOpacity;
        }
        chartData.map((value, index) => {
            value.map(item => {
                xArr.push(item.year);
            })
            let color1 = colors[index];
            let color2 = "";

            if (color1.indexOf("rgba") != -1) {
                let colorArr = colors[index].split("(")[1].split(")")[0].split(",");
                colorArr.pop();
                let colorString = colorArr.join(",");
                color2 = `rgba(${colorString},${areaStyleOpacity})`
            } else if (color1.indexOf("#") != -1) {
                var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
                var color = colors[index].toLowerCase();
                if (reg.test(color)) {
                    if (color.length === 4) {
                        var colorNew = "#";
                        for (var i = 1; i < 4; i += 1) {
                            colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
                        }
                        color = colorNew;
                    }
                    var colorChange = [];
                    for (var i = 1; i < 7; i += 2) {
                        colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
                    }
                    color2 = "RGB(" + colorChange.join(",") + "," + areaStyleOpacity + ")";
                }
            }

            let seriesItem = {
                name: legend[index],
                type: 'line',
                symbolSize: size12,
                symbol: 'circle',
                showAllSymbol: true,
                lineStyle: {
                    normal: {
                        width: 1,  //线条粗细
                        color: color1,
                    },
                },
                itemStyle: {
                    color: color1,
                    borderColor: color1,
                    borderWidth: 1,
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: color2
                        },
                        {
                            offset: 1,
                            color: 'rgba(44, 255, 132, 0)'
                        }
                        ], false)
                    }
                },
                label: {
                    show: false,
                    position: 'top',
                    textStyle: {
                        color: color1,
                        fontSize: size20,
                        fontWeight: 100
                    }
                },
                data: value
            }
            series.push(seriesItem);
        })
        xData = Array.from(new Set(xArr));

        let defaultLegend: {} = {
            data: legend,
            itemWidth: size12,
            itemHeight: size12,
            textStyle: {
                fontSize: size16,
                color: '#fff',
            },
            top: "5%"
        }
        let legendStyle = {};
        if (props.legendStyle) {
            legendStyle = Object.assign({}, defaultLegend, props.legendStyle)
        } else {
            legendStyle = defaultLegend;
        }

        let lineOption = {
            lineStyle: {
                color: 'rgba(42, 248, 236, 0.5)',
                type: 'dashed'
            }
        }

        let option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: legendStyle,
            grid: {
                top: '22%',
                right: '0',
                left: '0',
                bottom: '8%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: xData,
                axisLine: {
                    lineStyle: {
                        color: '#1EC3CD'
                    }
                },
                axisLabel: {
                    margin: 10,
                    color: fontColor,
                    textStyle: {
                        fontSize: size20
                    },
                },
            }],
            yAxis: [{
                name: unit,
                nameTextStyle: {
                    fontSize: size20,
                    color: '#fff'
                },
                nameGap: size20,
                axisLabel: {
                    formatter: '{value}',
                    color: fontColor,
                    fontSize: size20
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                splitLine: lineOption
            }, {
                axisLine: lineOption,
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }],
            series: series
        };
        return option
    };

    return (
        <ReactEcharts
            className="a-hongcheng"
            style={{ height: '100%' }}
            option={getOption()}
        />
    );
};

/**
 * @description 村庄规划  用地类别分析
 */

interface PieChartGHIChartItem {
    value: number,
    name: string,
    unit?: string
}
/**
 * titleStyle:标题样式
 * legendStyle:图例样式 、位置等
 * seriesRadius：环形饼状图 圈大小
 * seriesCenter：环形饼状图 圈位置
 * intervalVal: 饼图间隔空隙大小
 */
interface PieChartGHIChartObj {
    datas: PieChartGHIChartItem[],
    color?: string[],
}

export const PieChartGH = (props: PieChartGHIChartObj) => {
    let pieSeriesData = props.datas;
    let legendArr = pieSeriesData.map(v => v.name);
    let legendArr1 = legendArr.slice(0, 5);
    let legendArr2 = legendArr.slice(5, legendArr.length);
    let unit = pieSeriesData.length > 0 ? pieSeriesData[0].unit : null;

    let colors: string[] = ["#24E1FF", "#1EC5FF", "#1BB7FF", "#16A5FF", "#1395FF", "#4AFDC7", "#1FC49D", "#169A7E"];
    if (props.color) {
        colors = props.color;
    }

    let seriesRadius = [['56%', '60%'], ['48%', '0%']];
    let seriesCenter = ['50%', '50%'];

    const getOption = () => {
        let option = {
            backgroundColor: '',
            tooltip: {
                trigger: 'item',
                formatter: '{b}: <br/>{c} ({d}%)'
            },
            color: colors,
            legend: [{
                data: legendArr1,
                orient: 'vertical',
                left: 'left',
                top: 'center',
                icon: 'rect',
                itemWidth: FontChart(0.13),
                itemHeight: FontChart(0.13),
                itemGap: FontChart(0.1),
                textStyle: {
                    color: '#fff',
                    fontSize: FontChart(0.2)
                },
                formatter: (parmars: any) => {
                    for (let i = 0; i < 5; i++) {
                        if (pieSeriesData[i].name === parmars) {
                            return `${parmars}\n${pieSeriesData[i].value}${unit}`;
                        }
                    }
                },
            },
            {
                data: legendArr2,
                orient: 'vertical',
                right: '0',
                top: 'center',
                icon: 'rect',
                itemWidth: FontChart(0.13),
                itemHeight: FontChart(0.13),
                itemGap: FontChart(0.1),
                textStyle: {
                    color: '#fff',
                    fontSize: FontChart(0.2)
                },
                formatter: (parmars: any) => {
                    for (let i = 5; i < pieSeriesData.length; i++) {
                        if (pieSeriesData[i].name === parmars) {
                            return `${parmars}\n${pieSeriesData[i].value}${unit}`;
                        }
                    }
                },
            }],
            series: [
                {
                    type: 'pie',
                    radius: seriesRadius[0],
                    center: seriesCenter,
                    startAngle: 90,
                    clockwise: false, //生长方向，是否顺时针

                    label: {
                        show: false
                    },
                    emphasis: {
                        label: {
                            show: false
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: pieSeriesData,
                },
                {
                    type: 'pie',
                    radius: seriesRadius[1],
                    center: seriesCenter,
                    startAngle: 90,
                    clockwise: false, //生长方向，是否顺时针
                    label: {
                        show: false
                    },
                    emphasis: {
                        label: {
                            show: false
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: pieSeriesData
                },
            ]
        };
        return option
    };

    return (
        <ReactEcharts
            style={{ height: '100%' }}
            option={getOption()}
        />
    );
};


/**
 * @description 村庄规划  人均用地面积情况
 */

interface HorizontalBar3IChartItem {
    value: number,
    name: string,
    unit?: string
}

interface HorizontalBar3IChartObj {
    datas: HorizontalBar3IChartItem[],
    option?: {}
}

export const HorizontalBar3 = (props: HorizontalBar3IChartObj) => {
    let datas: IChartItem[] = [...props.datas];
    const getOption = () => {
        let getSymbolData = (data: IChartItem[]) => {
            let arr = [];
            for (var i = 0; i < data.length; i++) {
                arr.push({
                    value: data[i].value,
                    symbolPosition: 'end'
                })
            }
            return arr;
        }
        let maxArr = (new Array(datas.length)).fill(100);
        let option = {
            tooltip: {
                show: false
            },
            grid: {
                top: '10%',
                bottom: '5%',
                left: 0,
                right: '15%'
            },
            legend: {
                show: false
            },
            xAxis: {
                show: false,
                type: 'value'

            },
            yAxis: [{
                type: 'category',
                inverse: true,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisPointer: {
                    label: {
                        show: true,
                        margin: FontChart(0.3)
                    }
                },
                data: datas.map(item => item.name),
                axisLabel: {
                    margin: FontChart(1),
                    fontSize: FontChart(0.2),
                    align: 'left',
                    color: '#fff',
                    padding: [0, 0, FontChart(0.4), FontChart(1)],
                    rich: {
                        b: {
                            color: '#03FBEE',
                            backgroundColor: "rgba(3,251,238,0.3)",
                            width: FontChart(0.32),
                            height: FontChart(0.18),
                            align: 'center',
                            borderRadius: 2
                        }
                    },
                    formatter: function (params: any) {
                        var index = datas.map(item => item.name).indexOf(params);
                        index = index + 1;
                        return [
                            '{b|' + index + '}' + '  ' + params
                        ].join('\n')
                    }
                }
            }, {
                type: 'category',
                inverse: true,
                axisTick: 'none',
                axisLine: 'none',
                show: true,
                data: datas.map(item => item.value),
                axisLabel: {
                    show: true,
                    fontSize: FontChart(0.2),
                    color: '#fff',
                    formatter: '{value}' + datas[0].unit
                }
            }],
            series: [{
                name: 'XXX',
                type: 'pictorialBar',
                symbol: 'rect',
                symbolSize: [FontChart(0.04), FontChart(0.12)],
                symbolOffset: [FontChart(0.02), 0],
                z: 12,
                itemStyle: {
                    normal: {
                        color: '#02D2DA'
                    }
                },
                data: getSymbolData(datas)
            }, {
                z: 2,
                name: 'value',
                type: 'bar',
                barWidth: FontChart(0.06),
                zlevel: 1,
                itemStyle: {
                    normal: {
                        barBorderRadius: 2,
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: 'rgba(2, 210, 218, 0.1)'
                        }, {
                            offset: 1,
                            color: '#02D2DA'
                        }]),
                    },
                },
                data: datas.map((item, i) => {
                    return {
                        value: item.value
                    };
                }),
                label: {
                    show: false,
                    position: 'right',
                    color: '#333333',
                    fontSize: FontChart(0.14),
                    offset: [10, 0]
                }
            },
            {
                name: '背景',
                type: 'bar',
                barWidth: FontChart(0.06),
                barGap: '-100%',
                itemStyle: {
                    normal: {
                        color: 'rgba(118, 111, 111, 0.55)'
                    }
                },
                data: maxArr,
            }

            ]
        }
        return option
    };

    return (
        <ReactEcharts
            style={{ height: '100%' }}
            option={getOption()}
        />
    );
};

/**
 * @description 村情民情  3d
 */
interface PieChart3DIObj {
    name: string,
    y: number,
    unit: string,
    [propsName: string]: any
}

interface PieChart3DIProps {
    datas: PieChart3DIObj[]
}
export class PieChart3D extends Component<PieChart3DIProps> {
    getOption() {

        let data = [...this.props.datas];
        data[0].sliced = true;
        data[0].selected = true;
        const options: Highcharts.Options = {
            chart: {
                type: "pie",
                backgroundColor: "rgba(0,0,0,0)",  //透明背景
                options3d: {
                    enabled: true,
                    alpha: 67,  //旋转角度
                    beta: 0
                }
            },
            title: {
                text: ""
            },
            legend: {
                layout: "horizontal", //vertical
                align: "left",
                verticalAlign: "bottom",
                borderWidth: 0,
                itemStyle: {
                    color: '#fff',
                    fontWeight: 'noraml',
                    fontSize: '20px'
                }
            },
            tooltip: {
                pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
                style: {
                    fontSize: "20px",
                }
            },
            colors: ["#11BC8E", "#03A5FF", "#E2D71A"],
            credits: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    size: 240,
                    innerSize: 150,
                    allowPointSelect: true,
                    cursor: "pointer",
                    depth: 45, //高度
                    dataLabels: {
                        distance: 20,
                        style: {
                            fontSize: "40px",
                            textOutline: "none" //去掉文字白色描边
                        },
                        formatter: function () {
                            return (
                                '<p style="fontSize:40px;color:' +
                                this.color + //文字展示对应颜色
                                '">' +
                                this.percentage.toFixed(1) + //展示百分比
                                "%</p>"
                            );
                        }
                    },
                    showInLegend: false
                }
            },
            series: [
                {
                    type: "pie",
                    name: "",
                    data: data
                }
            ]
        }
        return options
    }
    render() {
        return (
            <HighchartsReact
                style={{ height: '100%' }}
                highcharts={Highcharts}
                options={this.getOption()}
                {...this.props}
            />
        )
    }
}
/**
 * @description 智慧帮扶 问题解决
 */

interface Chart1IChartItem {
    value: number,
    name: string,
    unit?: string
}
interface Chart1IProps {
    datas: Chart1IChartItem[],
    color?: string[],
    total: IChartItem,
    showLegend?: boolean
}
export class Chart1 extends Component<Chart1IProps> {
    static defaultProps = {
        color: ['#EAE41C', '#11BC8E', "#BC5E0D"],
        showLegend: false
    };


    getOption = () => {
        let size20 = FontChart(0.2);
        let size36 = FontChart(0.36);
        let size30 = FontChart(0.3);

        let option = {
            title: {
                text: this.props.total.name,
                subtext: this.props.total.value,
                left: 'center',
                top: '38%',
                textStyle: {
                    fontSize: size30,
                    color: '#FFFFFF',
                },
                subtextStyle: {
                    color: '#FFFFFF',
                    fontSize: size36,
                    textShadowColor: '#31B0F7',
                    textShadowBlur: 7
                },
            },
            legend: {
                show: this.props.showLegend,
                x: 'center',
                bottom: '10',
                icon: 'rect',
                itemWidth: FontChart(0.13),
                itemHeight: FontChart(0.13),
                itemGap: size36,
                textStyle: {
                    color: '#fff',
                    fontSize: FontChart(0.2)
                },
                formatter: (parmars: any) => {
                    for (let i = 0; i < this.props.datas.length; i++) {
                        if (this.props.datas[i].name === parmars) {
                            return `${parmars}`;
                        }
                    }
                },
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: <br/>{c} ({d}%)'
            },
            color: this.props.color,
            series: [
                {
                    name: '',
                    type: 'pie',
                    avoidLabelOverlap: false,
                    radius: ["50%", "55%"],
                    center: ["50%", "50%"],
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: "outside",
                                padding: [FontChart(this.props.showLegend ? -0.4 : -0.8), FontChart(-1.2), 0, FontChart(-1.2)],
                                formatter: (params: any) => {
                                    if (!this.props.showLegend) {
                                        return `{b|${params.data.name}:}\n {c|${params.data.value}}{d|${params.data.unit}}`
                                    } else {
                                        return `{c|${params.data.value}}{d|${params.data.unit}}`
                                    }
                                },
                                rich: {
                                    b: {
                                        fontSize: size20,
                                        color: "#fff",
                                        lineHeight: size36
                                    },
                                    c: {
                                        fontSize: size36,
                                        color: "#fff",
                                        textShadowColor: 'rgba(49, 176, 247, 1)',
                                        textShadowBlur: 7
                                    },
                                    d: {
                                        color: '#F3FCFF',
                                        fontSize: size20,
                                        textShadowColor: 'rgba(49, 176, 247, 1)',
                                        textShadowBlur: 7,
                                    }
                                }
                            },
                            labelLine: {
                                length: size20,
                                length2: FontChart(1.4),
                                show: true
                            }
                        }
                    },
                    data: this.props.datas
                },
                {
                    type: 'pie',
                    radius: ['44%', '0%'],
                    center: ['50%', '50%'],
                    z: 0,
                    tooltip: {
                        show: false
                    },
                    data: [{
                        hoverOffset: 1,
                        value: 100,
                        itemStyle: {
                            color: 'rgba(114, 209, 216, 0.16)',
                        },
                        label: {
                            show: false
                        },
                        hoverAnimation: false,
                    },]
                }
            ]

        };
        return option
    };

    render() {
        return (
            <ReactEcharts
                style={{ height: '100%' }}
                option={this.getOption()}
            />
        );
    }

};

