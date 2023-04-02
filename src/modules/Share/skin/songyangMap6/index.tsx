import { useEffect, useState } from "react";
import { Drawer, Icon, Spin, Progress, Button } from "antd";
import { feature } from "../../Components/Header";
import { templates } from "../../../../config/StrConfig";
import { BarChart, UniversalDom, TextBox, Personnel, NumberList, TextLine, Chart4, LineChart } from '../../Components/SyMapComponent'

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vw = px => (px / 3200) * 100 + "vw";
let vh = px => (px / 1344) * 100 + "vh";
let rem = px => px + "rem"
interface Props {
    visible: boolean;
    template: string;
}
export default function SongyangMap6({ visible, template }: Props) {
    const [config, setConfig] = useState<any>();
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
                            <div style={{ display: "flex", padding: ` ${rem(0.08)} ${rem(0.8)} 0 ${rem(0.40)} `, justifyContent: 'space-between' }}>
                                <div>
                                    {config.content1.data1.map((res, index) => {
                                        return <TextBox key={index} textShadow={config.content1.textShadow} title={res.title} num={res.num} unit={res.unit} />
                                    })}
                                </div>
                                <div>
                                    {config.content1.data2.map((res, index) => {
                                        return <TextBox key={index} textShadow={config.content1.textShadow} title={res.title} num={res.num} unit={res.unit} />
                                    })}
                                </div>
                            </div>
                        </UniversalDom>
                        <UniversalDom title={config.content2.title}>
                            <NumberList description={config.content2.description} data={config.content2.data} />
                        </UniversalDom>
                        <UniversalDom title={config.content3.title}>
                            <div style={{ marginLeft: `${vw(36)}`, marginBottom: `${vh(23)}` }}>
                                <TextLine title={config.content3.signal.title} content={config.content3.signal.text} />
                            </div>
                            <div style={{ marginLeft: `${vw(10)}` }}>
                                <div className={scss['leadership-personnel']}>
                                    {
                                        config.content3.leadership.map((r, i) => {
                                            return <div className={scss['personnel-box']}>
                                                <div>
                                                    <img src={config.content3.imageUrl} style={{ width: "100%" }} alt="" />
                                                </div>
                                                <Personnel key={i} name={r.name} position={r.position} />
                                            </div>
                                        })
                                    }
                                </div>
                                <div className={scss['member-personnel']}>
                                    {
                                        config.content3.member.map((r, i) => {
                                            return <div className={scss['personnel-box'] + " " + scss['member-personnel-box']}>
                                                <div>
                                                    <img src={config.content3.imageUrl} style={{ width: "100%" }} alt="" />
                                                </div>
                                                <Personnel key={i} name={r.name} position={r.position} />
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                        </UniversalDom>
                    </> : <Spin size="large" />
                }
            </Drawer>
            <Drawer
                placement="right"
                closable={false}
                mask={false}
                width={rem(6.80)}
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
                        <UniversalDom title={config.content4.title}>
                            {/* <img src={config.content4.url} style={{ width: `${rem(5.4355)}`, padding: `${rem(0.14)} 0 ${rem(0.26)}` }} alt="" /> */}
                            <div style={{ height: "3rem" }}>
                                <Chart4 datas={config.content4.chartData} lineFeedIndex={5}></Chart4>
                            </div>
                        </UniversalDom>
                        <UniversalDom title={config.content5.title}>
                            {/* <img src={config.content5.url} style={{ width: `${rem(5.2305)}`, padding: `${rem(0.11)} 0 ${rem(0.17)}`, marginLeft: `${rem(0.20)}` }} alt="" /> */}
                            <div style={{ height: "2.7rem" }}>
                                <BarChart data={config.content5.chartData} />
                            </div>
                        </UniversalDom>
                        <UniversalDom title={config.content6.title}>
                            {/* <img src={config.content6.url} style={{ width: `${rem(5.3191)}`, padding: `${rem(0.17)} 0 0` }} alt="" /> */}
                            <div style={{
                                height: '2.5rem',
                                marginTop: '0.1rem'
                            }}>
                                <LineChart data={config.content6.chartData} />
                            </div>
                        </UniversalDom>
                    </> : <Spin size="large" />
                }
            </Drawer>
        </>
    );
}
