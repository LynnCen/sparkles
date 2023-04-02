import { useEffect, useState } from "react";
import { Drawer, Icon, Spin, Progress, Button } from "antd";
import { feature } from "../../Components/Header";
import { templates } from "../../../../config/StrConfig";
import { UniversalDom, TextBox, HorizontalBar2, PieChart2, StackedBarChart, ProjectList, PaginationCom } from '../../Components/SyMapComponent'

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vw = px => (px / 3200) * 100 + "vw";
let vh = px => (px / 1344) * 100 + "vh";
let rem = px => px + "rem"
interface Props {
    visible: boolean;
    template: string;
}
export default function SongyangMap9({ visible, template }: Props) {
    const [config, setConfig] = useState(null);
    const [current, setCurrent] = useState(1)
    useEffect(() => {
        fetch(templates[template].configPath)
            .then(r => r.json())
            .then(setConfig)
            .catch(console.table);
    }, []);

    const pagination = {
        current: current,
        total: 30
    }

    const paginationChange = (value) => {
        setCurrent(value)
    }
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
                            <div
                                style={{
                                    height: "3.5rem"
                                }}
                            >
                                <HorizontalBar2 data={config.leftContent.child2.content} />
                            </div>
                        </UniversalDom>
                        <UniversalDom title={config.leftContent.child3.title}>
                            <div
                                style={{
                                    height: '3.85rem'
                                }}
                            >
                                <PieChart2 data={config.leftContent.child3.content} />
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
                            {
                                config.rightContent.child1.listData.map((r, i) => {
                                    return <ProjectList
                                        data={r}
                                        itemIndex={i}
                                        newClassName={'sy-project-list4'}
                                        key={i}
                                    />
                                })
                            }
                            <PaginationCom
                                pagination={pagination}
                                onChange={paginationChange}
                            />
                        </UniversalDom>
                        {/* <UniversalDom title={config.rightContent.child2.title}>
                            <div style={{ height: "3.45rem" }}>
                                <StackedBarChart data={config.rightContent.child2.content} />
                            </div>
                        </UniversalDom> */}
                    </> : <Spin size="large" />
                }
            </Drawer>
        </>
    );
}
