import { useEffect, useState } from "react";
import { Drawer, Icon, Spin, Progress, Button } from "antd";
import { feature } from "../../Components/Header";
import { templates } from "../../../../config/StrConfig";
import { TitleName, UniversalDom, BarChart2, HorizontalBar3, BarChart } from '../../Components/SyMapComponent'

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vw = px => (px / 3200) * 100 + "vw";
let vh = px => (px / 1344) * 100 + "vh";
let rem = px => px + "rem"
interface Props {
    visible: boolean;
    template: string;
}
export default function SongyangMap5({ visible, template }: Props) {
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
                        <UniversalDom title={config.content1.title} >
                            <div className={scss['important']}>
                                {
                                    config.content1.data.map((r, i) => {
                                        return <div key={i}>
                                            <span>{r.title}</span>
                                            <span>{r.num}<span>{r.unit}</span></span>
                                        </div>
                                    })
                                }
                            </div>
                        </UniversalDom>
                        <UniversalDom title={config.content2.title} >
                            <div className={scss["person"]}>
                                {
                                    config.content2.data.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <span>{item.count}</span>
                                                <span>{item.text}</span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </UniversalDom>
                        <div className={scss['special-title']}>
                            <div>
                                <img src={config.content2.child.icon} alt="" />
                            </div>
                            <span>{config.content2.child.title}</span>
                        </div>
                        {/* <img src={config.content2.child.url} style={{ width: `${rem(5.225)}`, marginLeft: `${rem(0.50)}` }} alt="" /> */}
                        <div style={{ height: "3rem", padding: ` 0 0 0 ${rem(0.40)} ` }}>
                            <HorizontalBar3 datas={config.content2.child.data} />
                        </div>
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
                        <UniversalDom title={config.content3.title} >
                            {/* <img src={config.content3.url} style={{ width: `${rem(5.4791)}`, padding: `${rem(0.10)} 0 ${rem(0.31)}` }} alt="" /> */}
                            <div style={{ height: "2.7rem" }}>
                                <BarChart data={config.content3.chartData} />
                            </div>
                        </UniversalDom>
                        <UniversalDom title={config.content4.title} >
                            {/* <img src={config.content4.url} style={{ width: `${rem(5.2305)}`, padding: `${rem(0.15)} 0 ${rem(0.23)}`, marginLeft: `${rem(0.20)}` }} alt="" /> */}
                            <div style={{
                                height: "3rem",
                                padding: `${rem(0.15)} 0 ${rem(0.23)}`
                            }}>
                                <BarChart2 data={config.content4.chartData} rotate={0} />
                            </div>
                        </UniversalDom>
                        <UniversalDom title={config.content5.title} >
                            <div className={scss["personSex"]}>
                                <div className={scss['personSex_count']}>
                                    {
                                        config.content5.data.map((r, i) => {
                                            return <span key={i}>{r.num}<span>{r.unit}</span></span>
                                        })
                                    }
                                </div>
                                <img src={config.content5.url} style={{ width: `${rem(5.245)}` }} alt="" />
                            </div>
                        </UniversalDom>
                    </> : <Spin size="large" />
                }
            </Drawer>
        </>
    );
}
