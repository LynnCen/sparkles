import { useEffect, useState } from "react";
import { Drawer, Icon, Spin, Progress, Button } from "antd";
import { feature } from "../../Components/Header";
import { templates } from "../../../../config/StrConfig";
import { UniversalDom, TextBox, Personnel, SimplePicChart, PieChart3D, BarChart2, PicChart, ContrastChart, LegendCom } from '../../Components/SyMapComponent'

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let rem = px => px + "rem"

interface Props {
    visible: boolean;
    template: string;
}
export default function SongyangMap1({ visible, template }: Props) {
    const [config, setConfig] = useState(null);
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
                        <UniversalDom title={config.content1.title} >
                            {
                                config.content1.child.map((r, i) => {
                                    return <div key={i} className={scss['content-text']}>
                                        <div
                                            className={i == 0 ? scss['blue-box'] : scss['yellow-box']}
                                            style={{ textShadow: `0 0 ${rem(0.07)} ${r.textShadow}` }}>
                                            <span>{r.title.substring(0, 2)}</span>
                                            <span>{r.title.substring(2, 4)}</span>
                                        </div>
                                        <div>{
                                            r.data.map((res, index) => {
                                                return <TextBox key={index} title={res.title} textShadow={r.textShadow} num={res.num} unit={res.unit} />
                                            })
                                        }
                                        </div>
                                    </div>
                                })
                            }
                        </UniversalDom>
                        <UniversalDom title={config.content2.title}>
                            <div className={scss['content-personnel']}>
                                {
                                    config.content2.data.map((r, i) => {
                                        return <div key={i} className={scss['personnel-box']}>
                                            <div>
                                                <img src={config.content2.imageUrl} style={{ width: "100%" }} alt="" />
                                            </div>
                                            <Personnel key={i} name={r.name} position={r.position} />
                                        </div>
                                    })
                                }
                            </div>
                        </UniversalDom>
                        <UniversalDom title={config.content3.title}>
                            <div style={{
                                padding: `${rem(0.)} ${rem(0.4)} ${rem(0.1)} ${rem(0.2)}`,
                                display: 'flex',
                                alignItems: 'center',
                                height: '2.34rem'
                            }}>
                                {/* <img src={config.content3.url} style={{ width: `${rem(5)}` }} alt="" /> */}
                                {/* <LegendCom data={config.content3.chartData} /> */}
                                <div className={scss["sy-piechart-3d-legend-w"]}>
                                    <div className={scss["sy-contradiction-text"]}>矛盾解纷数：</div>
                                    <div className={scss["sy-contradiction-div"]}>
                                        <span className={scss["sy-contradiction-data"]}>{config.content3.problem}</span>
                                        <span className={scss["sy-contradiction-unit"]}>件</span>
                                    </div>
                                    <LegendCom data={config.content3.chartData}></LegendCom>
                                </div>
                                <div className={scss["sy-piechart-3d-chart-w2"]}>
                                    <PieChart3D datas={config.content3.chartData}></PieChart3D>
                                </div>
                            </div>
                        </UniversalDom>
                        <UniversalDom title={config.content4.title}>
                            <div className={scss['carousel-box']} style={{ backgroundImage: `url(${config.content4.background})` }}>
                                <div>
                                    <img src={config.content4.image} alt="" />
                                </div>
                            </div>
                        </UniversalDom>
                    </> : (
                        <Spin size="large" />
                    )
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
                        <UniversalDom title={config.content5.title} >
                            <div style={{ display: 'flex', padding: ` 0 ${rem(0.3)}`, justifyContent: 'space-between' }}>
                                {
                                    config.content5.data.map((res, index) => {
                                        return <TextBox key={index} title={res.title} textShadow={config.content5.textShadow} num={res.num} unit={res.unit} />
                                    })
                                }
                            </div>
                            <div style={{
                                height: "1.6rem"
                            }}>
                                <ContrastChart data={config.content5.chartData} />
                            </div>
                            {/* <img src={config.content5.url} style={{ width: `${rem(5.2178)}`, marginBottom: `${rem(0.18)}`, marginLeft: `${rem(0.2)}` }} alt="" /> */}
                        </UniversalDom>
                        <UniversalDom title={config.content6.title} >
                            <div
                                style={{
                                    height: "2.05rem"
                                }}
                            >
                                <PicChart
                                    data={config.content6.chartData}
                                    total={config.content6.total}
                                    color={config.content6.color}
                                />
                            </div>
                            {/* <img src={config.content6.url} style={{ width: `${rem(4.9554)}`, margin: `${rem(0.15)} 0  ${rem(0.2)} ${rem(0.3)}` }} alt="" /> */}
                        </UniversalDom>
                        <UniversalDom title={config.content7.title} >
                            <div
                                style={{
                                    display: "flex",
                                    height: "2rem"
                                }}
                            >
                                {
                                    config.content7.chartData.map((r, i) => {
                                        return <div style={{ width: "33.33%" }}>
                                            <SimplePicChart data={r.data} color={r.color} key={i} />
                                        </div>
                                    })
                                }
                            </div>
                            {/* <img src={config.content7.url} style={{ width: `${rem(5.14)}`, marginLeft: `${rem(0.3)}` }} alt="" /> */}
                        </UniversalDom>
                        <UniversalDom title={config.content8.title} >
                            <div style={{
                                height: "2.2rem"
                            }}>
                                <BarChart2 data={config.content8.chartData} rotate={0} />
                            </div>
                            {/* <img src={config.content8.url} style={{ width: `${rem(5.0088)}`, marginLeft: `${rem(0.3)}` }} alt="" /> */}
                        </UniversalDom>
                    </> : (
                        <Spin size="large" />
                    )
                }
            </Drawer>
        </>
    );
}
