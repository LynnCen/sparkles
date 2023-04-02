import { useEffect, useState } from "react";
import { Drawer, Icon, Spin, Progress, Button } from "antd";
import { feature } from "../../Components/Header";
import { templates } from "../../../../config/StrConfig";
import { UniversalDom, TextBox, LineChart, StatisticalInfo, LineChart2, VillageIntroduction } from '../../Components/SyMapComponent'

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vw = px => (px / 3200) * 100 + "vw";
let vh = px => (px / 1344) * 100 + "vh";
let rem = px => px + "rem"
interface Props {
    visible: boolean;
    template: string;
}
export default function SongyangMap8({ visible, template }: Props) {
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
                        <UniversalDom title={config.leftContent.child1.title}>
                            <div style={{
                                display: "flex",
                                padding: ` ${rem(0.08)} ${rem(0.4)} 0 ${rem(0.40)} `,
                                justifyContent: 'space-between',
                                marginBottom: `${rem(0.6)}`
                            }}
                            >
                                <div style={{ width: "33.33%" }}>
                                    {
                                        config.leftContent.child1.content1.map((r, i) => {
                                            return <TextBox
                                                title={r.title}
                                                num={r.num}
                                                textShadow={config.leftContent.child1.textShadow}
                                                key={i}
                                            />
                                        })
                                    }
                                </div>
                                <div>
                                    {
                                        config.leftContent.child1.content2.map((r, i) => {
                                            return <TextBox
                                                title={r.title}
                                                num={r.num}
                                                textShadow={config.leftContent.child1.textShadow}
                                                unit={r.unit ? r.unit : ""}
                                                key={i}
                                            />
                                        })
                                    }
                                </div>
                                <div>
                                    {
                                        config.leftContent.child1.content3.map((r, i) => {
                                            return <TextBox
                                                title={r.title}
                                                num={r.num}
                                                unit={r.unit}
                                                textShadow={config.leftContent.child1.textShadow}
                                                key={i}
                                            />
                                        })
                                    }
                                </div>
                            </div>
                        </UniversalDom>
                        <UniversalDom title={config.leftContent.child2.title}>
                            <div
                                style={{
                                    height: "3.46rem",
                                    paddingTop: " 0.5rem"
                                }}
                            >
                                <VillageIntroduction data={config.leftContent.child2.content} />
                            </div>
                        </UniversalDom>
                        <UniversalDom title={config.leftContent.child3.title}>
                            <div style={{
                                height: "3.3rem",
                                paddingTop: "0.7rem"
                            }}>
                                <div className={scss["insurance"]}>
                                    <div className={scss['insurance_count']}>
                                        {
                                            config.leftContent.child3.data1.map((r, i) => {
                                                return <span key={i}>{r.num} <span>{r.unit}</span></span>
                                            })
                                        }
                                    </div>
                                    <div className={scss['insurance_img2']}></div>
                                    <div className={scss['insurance_text']}>
                                        {
                                            config.leftContent.child3.data2.map((r, i) => {
                                                return <span key={i}>{r}</span>
                                            })
                                        }
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
                        <UniversalDom title={config.rightContent.child1.title}>
                            <div style={{ height: "3.3rem" }}>
                                <LineChart2 data={config.rightContent.child1.content} />
                            </div>
                        </UniversalDom>
                        <UniversalDom title={config.rightContent.child2.title}>
                            <div className={scss['sy-statiscal-info']}>
                                {
                                    config.rightContent.child2.textData.map((r) => {
                                        return <StatisticalInfo data={r} />
                                    })
                                }
                            </div>
                            <div
                                style={{
                                    height: "2.5rem"
                                }}
                            >
                                <LineChart data={config.rightContent.child2.chartData} />
                            </div>
                        </UniversalDom>
                        <UniversalDom title={config.rightContent.child3.title}>
                            <div
                                style={{
                                    height: "3.3rem",
                                    paddingTop: "0.7rem"
                                }}
                            >
                                <div className={scss["insurance"]}>
                                    <div className={scss['insurance_count']}>
                                        {
                                            config.rightContent.child3.data1.map((r, i) => {
                                                return <span key={i}>{r.num} <span>{r.unit}</span></span>
                                            })
                                        }
                                    </div>
                                    <div className={scss['insurance_img3']}></div>
                                    <div className={scss['insurance_text']}>
                                        {
                                            config.rightContent.child3.data2.map((r, i) => {
                                                return <span key={i}>{r}</span>
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </UniversalDom>
                    </> : <Spin size="large" />
                }
            </Drawer>
        </>
    );
}
