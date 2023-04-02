import { useEffect, useState } from "react";
import { Drawer, Icon, Spin, Progress, Button } from "antd";
import { feature } from "../../Components/Header";
import { templates } from "../../../../config/StrConfig";
import { TitleName, UniversalDom, TextBox, LineChart, ProjectList, ComTabs, BarChart2, StatisticalInfo } from '../../Components/SyMapComponent'

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vw = px => (px / 3200) * 100 + "vw";
let vh = px => (px / 1344) * 100 + "vh";
let rem = px => px + "rem"
interface Props {
    visible: boolean;
    template: string;
}
export default function SongyangMap10({ visible, template }: Props) {
    const [config, setConfig] = useState(null);
    const [tabsKey1, setTabsKey1] = useState(0)
    const [tabsKey2, setTabsKey2] = useState(0)
    useEffect(() => {
        fetch(templates[template].configPath)
            .then(r => r.json())
            .then(setConfig)
            .catch(console.table);
    }, []);

    console.log(tabsKey1);

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
                                padding: ` ${rem(0.08)} ${rem(0.8)} 0 ${rem(0.40)} `,
                                justifyContent: 'space-between',
                                marginBottom: `${rem(0.3)}`
                            }}>
                                <div>
                                    {
                                        config.leftContent.child1.content1.map((r, i) => {
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
                                <div>
                                    {
                                        config.leftContent.child1.content2.map((r, i) => {
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
                            <ComTabs
                                data={config.leftContent.child2.tabs}
                                activeIndex={tabsKey1}
                                longBtnIndex={[2]}
                                onClick={setTabsKey1}
                            />
                            <div style={{
                                height: '2.5rem',
                                marginTop: '0.1rem'
                            }}>
                                <LineChart data={config.leftContent.child2.chartData} />
                            </div>
                        </UniversalDom>
                        <UniversalDom title={config.leftContent.child3.title}>
                            <ComTabs
                                data={config.leftContent.child3.tabs}
                                activeIndex={tabsKey2}
                                longBtnIndex={[1]}
                                onClick={setTabsKey2}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    margin: "0.2rem 0"
                                }}
                            >
                                {
                                    config.leftContent.child3.textData.map((r, i) => {
                                        return <StatisticalInfo data={r} key={i} />
                                    })
                                }
                            </div>
                            <div style={{
                                height: '2.5rem',
                                marginTop: '0.1rem'
                            }}>
                                <BarChart2 data={config.leftContent.child3.chartData} />
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
                        <UniversalDom title={config.rightContent.title}>
                            {
                                config.rightContent.content.map((r, i) => {
                                    return <ProjectList
                                        data={r}
                                        itemIndex={i}
                                        key={i}
                                    />
                                })
                            }
                        </UniversalDom>
                    </> : <Spin size="large" />
                }
            </Drawer>
        </>
    );
}
