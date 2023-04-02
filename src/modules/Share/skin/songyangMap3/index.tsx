import { useEffect, useState } from "react";
import { Drawer, Icon, Spin, Progress, Button } from "antd";
import { feature } from "../../Components/Header";
import { templates } from "../../../../config/StrConfig";
import { TitleName, UniversalDom, LineChart, Chart4, NumberList, PieChart } from '../../Components/SyMapComponent'

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vw = px => (px / 3200) * 100 + "vw";
let vh = px => (px / 1344) * 100 + "vh";
let rem = px => px + "rem"

interface Props {
    visible: boolean;
    template: string;
}
export default function SongyangMap3({ visible, template }: Props) {
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
                        <UniversalDom title={config.content1.title}>
                            <div className={scss['important']}>
                                {
                                    config.content1.data.map((r, i) => {
                                        return <div key={i}>
                                            <span>{r.title}</span>
                                            <span>
                                                {r.num}
                                                <span>{r.unit}</span>
                                            </span>
                                        </div>
                                    })
                                }

                            </div>
                        </UniversalDom>
                        <UniversalDom title={config.content2.title}>
                            <NumberList description={config.content2.description} data={config.content2.data} />
                        </UniversalDom>
                        <UniversalDom title={config.content3.title}>
                            <div style={{ padding: `${rem(0.3)} ${rem(0.2)}` }}>
                                <div className={scss['party-organization']}>
                                    <div> {config.content3.text1.title}</div>
                                    <div>{config.content3.text1.text}</div>
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <div className={scss['party-organization']}>
                                        <div>
                                            {config.content3.text2.title}
                                        </div>
                                        <div>{config.content3.text2.text}</div>
                                    </div>
                                    <div className={scss['party-organization']}>
                                        <div>
                                            {config.content3.text3.title}
                                        </div>
                                        <div>{config.content3.text3.text} <span>{config.content3.text3.unit}</span></div>
                                    </div>
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
                        <UniversalDom title={config.content4.title} >
                            {/* <img src={config.content4.url} style={{ width: `${rem(5.2305)}`, padding: `${rem(0.09)} 0 ${rem(0.26)}`, marginLeft: `${rem(0.2)}` }} alt="" /> */}
                            <div style={{
                                height: '2.5rem',
                                marginTop: '0.1rem'
                            }}>
                                <LineChart data={config.content4.chartData} />
                            </div>
                        </UniversalDom>
                        <UniversalDom title={config.content5.title} >
                            {/* <img src={config.content5.url} style={{ width: `${rem(5.1921)}`, padding: `${rem(0.15)} 0 ${rem(0.15)}`, marginLeft: `${rem(0.20)}` }} alt="" /> */}
                            <div style={{ height: "3rem" }}>
                                <Chart4 datas={config.content5.data} showBarLabel={true}></Chart4>
                            </div>
                        </UniversalDom>
                        <UniversalDom title={config.content6.title} >
                            {/* <img src={config.content6.url} style={{ width: `${rem(4.4109)}`, padding: `${rem(0.30)} 0 0`, marginLeft: `${rem(0.20)}` }} alt="" /> */}
                            <div style={{ height: "3.74rem" }}>
                                <PieChart data={config.content6.data} img={config.content6.img} />
                            </div>
                        </UniversalDom>
                    </> : <Spin size="large" />
                }
            </Drawer>
        </>
    );
}
