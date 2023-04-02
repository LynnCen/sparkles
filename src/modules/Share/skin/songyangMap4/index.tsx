import { useEffect, useState } from "react";
import { Drawer, Icon, Spin, Progress, Button } from "antd";
import { feature } from "../../Components/Header";
import { templates } from "../../../../config/StrConfig";
import { TitleName, UniversalDom, BarChart2, Chart1, NumberList, LineChart } from '../../Components/SyMapComponent'

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vw = px => (px / 3200) * 100 + "vw";
let vh = px => (px / 1344) * 100 + "vh";
let rem = px => px + "rem"

interface Props {
    visible: boolean;
    template: string;
}
export default function SongyangMap4({ visible, template }: Props) {
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
                        <UniversalDom title={'重点指标'} >
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
                        <UniversalDom title={config.content2.title} >
                            <NumberList description={config.content2.description} data={config.content2.data} />
                        </UniversalDom>
                        <UniversalDom title={config.content3.title} >
                            <div className={scss["insurance"]}>
                                <div className={scss['insurance_count']}>
                                    {
                                        config.content3.data1.map((r, i) => {
                                            return <span key={i}>{r.num} <span>{r.unit}</span></span>
                                        })
                                    }
                                </div>
                                <div className={scss['insurance_img']}></div>
                                <div className={scss['insurance_text']}>
                                    {
                                        config.content3.data2.map((r, i) => {
                                            return <span key={i}>{r}</span>
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
                        <UniversalDom title={config.content4.title} >
                            {/* <img src={config.content4.url} style={{ width: `${rem(5.4791)}`, padding: `${rem(0.10)} 0 ${rem(0.31)}` }} alt="" /> */}
                            <div style={{
                                height: '2.5rem',
                                marginTop: '0.1rem'
                            }}>
                                <LineChart data={config.content4.chartData} />
                            </div>
                        </UniversalDom>
                        <UniversalDom title={config.content5.title} >
                            {/* <img src={config.content5.url} style={{ width: `${rem(5.2305)}`, padding: `${rem(0.15)} 0 ${rem(0.23)}` }} alt="" /> */}
                            <div style={{
                                height: "3rem"
                            }}>
                                <BarChart2 data={config.content5.chartData} rotate={0} />
                            </div>
                        </UniversalDom>
                        <UniversalDom title={config.content6.title} >
                            {/* <img src={config.content6.url} style={{ width: `${rem(5.5234)}`, padding: `${rem(0.01)} 0 0` }} alt="" /> */}
                            <div style={{
                                height: "2.8rem"
                            }}>
                                <Chart1 datas={config.content6.chartData.data} total={config.content6.chartData.total} />
                            </div>
                        </UniversalDom>
                    </> : <Spin size="large" />
                }
            </Drawer>
        </>
    );
}
