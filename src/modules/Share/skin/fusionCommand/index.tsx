import { useEffect, useState } from "react";
import CardLayout, { Suffix } from "../../Components/CardLayout";
import { Drawer, Icon, Spin, Progress } from "antd";
import { feature } from "../../Components/Header";
import { templates } from "../../../../config/StrConfig";
import { ProgressBar, GuaranteeData, StatisticsData } from './components'
import MonitorCard from "../../Components/MonitorCard";

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

interface Props {
    visible: boolean;
    template: string;
}
export default function FusionCommand({ visible, template }: Props) {
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
                width={420}
                className={
                    scss["drawer-content"] +
                    " " +
                    scss["drawer-left"] +
                    " " +
                    scss["fusionCommand"]
                    //  +
                    // " " +
                    // scss["pe-none"]
                }
                visible={visible}
            >
                <div className={scss["left"]}>
                    {config ? (
                        <>
                            <CardLayout
                                title={config.Disaster.title}
                                enTitle={config.Disaster.entitle}
                                style={{ marginBottom: vh(38) }}
                            >
                                <>
                                    <div className={scss['text-box']} style={{ marginTop: '20px' }}>
                                        <div>灾害类型:</div>
                                        <div className={scss["text-child1"]}>{config.Disaster.type}</div>
                                    </div>
                                    <div className={scss['text-box']}>
                                        <div>地&emsp;&emsp;点:</div>
                                        <div className={scss["text-child1"]}>{config.Disaster.location}</div>
                                    </div>
                                    <div className={scss['text-box']}>
                                        <div>时&emsp;&emsp;间:</div>
                                        <div className={scss["text-child2"]}>{config.Disaster.time}</div>
                                    </div>
                                    <div className={scss['text-box']}>
                                        <div>灾害情况:</div>
                                        <div className={scss["text-child1"]}>{config.Disaster.situation}</div>
                                    </div>
                                    <div className={scss['text-box']}>
                                        <div>处置情况:</div>
                                        <div className={scss["big-text"]} title={config.Disaster.text} >{config.Disaster.text}</div>
                                    </div>
                                </>
                            </CardLayout>
                            <CardLayout
                                title={config.mapping.title}
                                enTitle={config.mapping.entitle}
                                style={{ marginBottom: vh(38) }}
                            >
                                <>
                                    <div className={scss['text-box']} style={{ marginTop: '25px' }}>
                                        <div>制图面积:</div>
                                        <div className={scss['text-child3']}>
                                            <span>{config.mapping.area}</span>&ensp;{config.mapping.areaUnit}
                                        </div>
                                    </div>
                                    <div className={scss['text-box']}>
                                        <div>制图进度:</div>
                                        <ProgressBar data={config.mapping.schedule1} color={config.mapping.schedule1Color} />
                                    </div>
                                    <div className={scss['text-box']}>
                                        <div>模型进度:</div>
                                        <ProgressBar data={config.mapping.schedule2} color={config.mapping.schedule2Color} />
                                    </div>
                                </>
                            </CardLayout>
                            <CardLayout
                                title={config.responsible.title}
                                enTitle={config.responsible.entitle}
                                style={{ marginBottom: vh(38) }}
                            >
                                <>
                                    <div className={scss['text-box']} style={{ marginTop: '25px' }}>
                                        <div>姓&emsp;&emsp;名:</div>
                                        <div className={scss['text-child1']}>{config.responsible.name}</div>
                                    </div>
                                    <div className={scss['text-box']}>
                                        <div>联系电话:</div>
                                        <div className={scss['text-child2']}>{config.responsible.phone}</div>
                                    </div>
                                    <div className={scss['text-box']}>
                                        <div>岗&emsp;&emsp;位:</div>
                                        <div className={scss['text-child1']}>{config.responsible.position}</div>
                                    </div>
                                </>
                            </CardLayout>
                        </>
                    ) : (
                            <Spin size="large" />
                        )}
                </div>
            </Drawer>
            <Drawer
                placement="right"
                closable={false}
                mask={false}
                width={410}
                style={{ width: "auto" }}
                className={
                    scss["drawer-content"] +
                    " " +
                    scss["drawer-right"] +
                    " " +
                    scss["fusionCommand"]
                    // +" " +
                    // scss["pe-none"]
                }
                visible={visible}
            >
                <div className={scss["right"]}>
                    {config ? (
                        <>
                            <CardLayout
                                title={config.guarantee.title}
                                enTitle={config.guarantee.entitle}
                                style={{ marginBottom: vh(52) }}
                                className={"pe-auto"}
                                suffixIcon={
                                    <div className={scss['text-suffix']}>
                                        类别数量:<span>3</span>类
                                    </div>
                                }
                            >
                                <div>
                                    {
                                        config.guarantee.data.map((item, index) => {
                                            return <GuaranteeData data={item} key={index} />
                                        })
                                    }
                                </div>
                            </CardLayout>
                            <CardLayout
                                title={config.video.title}
                                enTitle={config.video.entitle}
                                style={{ marginBottom: vh(52) }}
                                className={"pe-auto"}
                            >
                                <MonitorCard
                                    className={scss['video-box']}
                                    data={config.video.data}
                                    mask={false}
                                    style={{ marginBottom: "60px" }} />
                            </CardLayout>
                            <CardLayout
                                title={config.statistics.title}
                                enTitle={config.statistics.entitle}
                                style={{ marginBottom: vh(52) }}
                                className={"pe-auto"}
                                suffixIcon={
                                    <div className={scss['text-suffix']}>
                                        类别数量:<span>3</span>类
                                    </div>
                                }
                            >
                                <div>
                                    <StatisticsData data={config.statistics.data} />
                                </div>
                            </CardLayout>
                        </>
                    ) : (
                            <Spin size="large" />
                        )}
                </div>
            </Drawer>
        </>
    );
}
