import { useEffect, useState } from "react";
import { Drawer, Icon, Spin, Progress, Button } from "antd";
import { feature } from "../../Components/Header";
import { templates } from "../../../../config/StrConfig";
import { LineChart, UniversalDom, TextBox, PieChart3, HorizontalBar3, BarChart2, PieChart3D, LegendCom } from '../../Components/SyMapComponent'

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vw = px => (px / 3200) * 100 + "vw";
let vh = px => (px / 1344) * 100 + "vh";
let rem = px => px + "rem"
interface Props {
    visible: boolean;
    template: string;
}
export default function SongyangMap2({ visible, template }: Props) {
    const [config, setConfig] = useState(null);
    const [moduleKey, setModuleKey] = useState(0)
    useEffect(() => {
        fetch(templates[template].configPath)
            .then(r => r.json())
            .then(setConfig)
            .catch(console.table);
    }, []);

    return (
        <>
            <Drawer
                placement="left"
                closable={false}
                maskClosable={false}
                mask={false}
                width={rem(8.67)}
                className={
                    scss["sy-drawer-content"] +
                    " " +
                    scss["sy-drawer-left"]
                }
                visible={visible}
            >
                {
                    config ? <>
                        <UniversalDom title={config.content1.title}>
                            <div style={{ display: "flex", padding: ` 0 ${rem(0.07)} 0 0`, justifyContent: 'space-around' }}>
                                {
                                    config.content1.data.map((r, i) => {
                                        return <TextBox
                                            key={i}
                                            title={r.title}
                                            num={r.num}
                                            textShadow={config.content1.textShadow}
                                            unit={r.unit}
                                        />
                                    })
                                }
                            </div>
                        </UniversalDom>
                        <UniversalDom title={config.content2.title}>
                            {/* <img src={config.content2.url} style={{ width: `${rem(5.2305)}`, margin: `${rem(0.17)} 0 ${rem(0.18)} ${rem(0.2)}` }} alt="" /> */}
                            <div style={{
                                height: '2.5rem',
                                marginTop: '0.1rem'
                            }}>
                                <LineChart data={config.content2.chartData} />
                            </div>
                        </UniversalDom>
                        <UniversalDom title={config.content3.title}>
                            {/* <img src={config.content3.url} style={{ width: `${rem(5.4205)}`, marginBottom: `${rem(0.3)}`, marginLeft: `${rem(0.2)}` }} alt="" /> */}
                            <div style={{
                                padding: `${rem(0.)} ${rem(0)} ${rem(0.1)} ${rem(0.)}`,
                                display: 'flex',
                                alignItems: 'center',
                                height: '2.34rem'
                            }}>
                                {/* <img src={config.content3.url} style={{ width: `${rem(5)}` }} alt="" /> */}
                                {/* <LegendCom data={config.content3.chartData} /> */}
                                <div className={scss["sy-piechart-3d-chart-w2"]}>
                                    <PieChart3D datas={config.content3.chartData}></PieChart3D>
                                </div>
                                <div className={scss["sy-piechart-3d-legend-w"]} >
                                    <LegendCom data={config.content3.chartData}></LegendCom>
                                </div>

                            </div>
                        </UniversalDom>
                        <UniversalDom title={config.content4.title}>
                            <div style={{ height: "2.5rem" }}>
                                <PieChart3
                                    datas={config.content4.child.data}
                                    title={config.content4.child.title}
                                    total={config.content4.child.total}
                                    color={config.content4.child.color}
                                    titleStyle={config.content4.child.titleStyle}
                                    legendStyle={config.content4.child.legendStyle}
                                    seriesRadius={config.content4.child.seriesRadius}
                                    seriesCenter={config.content4.child.seriesCenter}
                                    intervalVal={config.content4.child.intervalVal}
                                ></PieChart3>
                            </div>
                        </UniversalDom>
                    </> : <Spin size="large" />
                }
            </Drawer>
            <Drawer
                placement="right"
                closable={false}
                mask={false}
                width={rem(6.8)}
                style={{ width: "auto" }}
                className={
                    scss["sy-drawer-content"] +
                    " " +
                    scss["sy-drawer-right"]
                }
                visible={visible}
            >
                {
                    config ? <>
                        <div className={scss["module-top"]}>
                            {
                                config.content5.map((r, i) => {
                                    return <div
                                        onClick={() => setModuleKey(i)} className={scss["module-industry"] + " " + (i === moduleKey && scss['selected'])}>
                                        {r.title}
                                    </div>
                                })
                            }
                        </div>
                        {
                            moduleKey == 0 ? <>
                                <UniversalDom title={config.content5[0].child1.title}>
                                    <div style={{ display: "flex", padding: `${rem(0.2)} ${rem(0.5)} ${rem(0.18)} ${rem(0.25)}`, justifyContent: 'space-between' }}>
                                        <div>
                                            {config.content5[0].child1.data1.map((res, index) => {
                                                return <TextBox textShadow={config.content5[0].textShadow} title={res.title} num={res.num} unit={res.unit} />
                                            })}
                                        </div>
                                        <div>
                                            {config.content5[0].child1.data2.map((res, index) => {
                                                return <TextBox textShadow={config.content5[0].textShadow} title={res.title} num={res.num} unit={res.unit} />
                                            })}
                                        </div>
                                    </div>
                                </UniversalDom>
                                <UniversalDom title={config.content5[0].child2.title}>
                                    <div style={{ display: "flex", padding: `${rem(0.2)} ${rem(0.5)} ${rem(0.22)} ${rem(0.25)}`, justifyContent: 'space-between' }}>
                                        <div>
                                            {config.content5[0].child2.data1.map((res, index) => {
                                                return <TextBox textShadow={config.content5[0].textShadow} title={res.title} num={res.num} unit={res.unit} />
                                            })}
                                        </div>
                                        <div>
                                            {config.content5[0].child2.data2.map((res, index) => {
                                                return <TextBox textShadow={config.content5[0].textShadow} title={res.title} num={res.num} unit={res.unit} />
                                            })}
                                        </div>
                                        <div>
                                            {config.content5[0].child2.data3.map((res, index) => {
                                                return <TextBox textShadow={config.content5[0].textShadow} title={res.title} num={res.num} unit={res.unit} />
                                            })}
                                        </div>
                                    </div>
                                </UniversalDom>
                                <div className={scss['special-title']}>
                                    <div>
                                        <img src={config.content5[0].child3.icon} alt="" />
                                    </div>
                                    <span>{config.content5[0].child3.title}</span>
                                </div>
                                {/* 主要经营收入 */}
                                {/* <img src={config.content5[0].child3.url} style={{ width: `${rem(5.225)}`, marginLeft: `${rem(0.5)}` }} alt="" /> */}
                                <div style={{ height: "3rem", padding: ` 0 0 0 ${rem(0.40)} ` }}>
                                    <HorizontalBar3 datas={config.content5[0].child3.data} />
                                </div>
                            </> :
                                moduleKey == 1 ? <>
                                    <UniversalDom title={config.content5[1].child1.title}>
                                        <div style={{ display: "flex", padding: `${rem(0.2)} ${rem(0.5)} ${rem(0.34)} ${rem(0.3)}`, justifyContent: 'space-between' }}>
                                            {
                                                config.content5[1].child1.data.map((r, i) => {
                                                    return <TextBox key={i} title={r.title} num={r.num} textShadow={config.content5[1].textShadow} unit={r.unit} />
                                                })
                                            }
                                        </div>
                                    </UniversalDom>
                                    <UniversalDom title={config.content5[1].child2.title}>
                                        {/* <img src={config.content5[1].child2.url} style={{ width: `${rem(5.225)}`, padding: `${rem(0.17)} 0 ${rem(0.27)} `, marginLeft: `${rem(0.3)} ` }} alt="" /> */}
                                        <div style={{
                                            height: '2.5rem',
                                            marginTop: '0.1rem'
                                        }}>
                                            <LineChart data={config.content5[1].child2.chartData} />
                                        </div>
                                    </UniversalDom>
                                    <UniversalDom title={config.content5[1].child3.title}>
                                        {/* <img src={config.content5[1].child3.url} style={{ width: `${rem(5.225)}`, padding: `${rem(0.24)}  0 0 `, marginLeft: `${rem(0.3)} ` }} alt="" /> */}
                                        <div style={{ height: "3rem", padding: ` 0 0 0 ${rem(0.40)} ` }}>
                                            <HorizontalBar3 datas={config.content5[1].child3.data} />
                                        </div>
                                    </UniversalDom>
                                </> :
                                    <>
                                        <UniversalDom title={config.content5[2].child1.title}>
                                            <div style={{ display: "flex", padding: `${rem(0.2)} ${rem(0.5)} ${rem(0.34)} ${rem(0.3)}`, justifyContent: 'space-between' }}>
                                                {
                                                    config.content5[2].child1.data.map((r, i) => {
                                                        return <TextBox key={i} title={r.title} num={r.num} textShadow={config.content5[2].textShadow} unit={r.unit} />
                                                    })
                                                }
                                            </div>
                                        </UniversalDom>
                                        <UniversalDom title={config.content5[2].child2.title}>
                                            {/* <img src={config.content5[2].child2.url} style={{ width: `${rem(5.275)}`, padding: `${rem(0.14)}  0 ${rem(0.38)} `, marginLeft: `${rem(0.2)} ` }} alt="" /> */}
                                            <div style={{ height: "2.5rem" }}>
                                                <PieChart3
                                                    datas={config.content5[2].child2.child.data}
                                                    title={config.content5[2].child2.child.title}
                                                    total={config.content5[2].child2.child.total}
                                                    color={config.content5[2].child2.child.color}
                                                    titleStyle={config.content5[2].child2.child.titleStyle}
                                                    legendStyle={config.content5[2].child2.child.legendStyle}
                                                    seriesRadius={config.content5[2].child2.child.seriesRadius}
                                                    seriesCenter={config.content5[2].child2.child.seriesCenter}
                                                    intervalVal={config.content5[2].child2.child.intervalVal}
                                                ></PieChart3>
                                            </div>
                                        </UniversalDom>
                                        <UniversalDom title={config.content5[2].child3.title}>
                                            {/* <img src={config.content5[2].child3.url} style={{ width: `${rem(4.9)}`, padding: `${rem(0.1)}  0 0 `, marginLeft: `${rem(0.2)} ` }} alt="" /> */}
                                            <div style={{
                                                height: "2.2rem"
                                            }}>
                                                <BarChart2 data={config.content5[2].child3.chartData} rotate={0} />
                                            </div>
                                        </UniversalDom>
                                    </>
                        }
                    </> : <Spin size="large" />
                }
            </Drawer>
        </>
    );
}
