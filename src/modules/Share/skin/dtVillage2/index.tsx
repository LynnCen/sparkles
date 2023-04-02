import { useEffect, useState } from "react";
import CardLayout, { Suffix } from "../../Components/CardLayout";
import { Drawer, Icon, Spin, Progress, Button, Table } from "antd";
import { templates } from "../../../../config/StrConfig";
import { SliderChart1, BarChart, SliderChart2, Stacked, Basic } from '../dtVillage/charts'
import { LeftLabel, RightLabel, RightLabel2 } from '../dtVillage/components'
import MonitorCard from "../../Components/MonitorCard";

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

interface Props {
    visible: boolean;
    template: string;
}
export default function DtVillage2({ visible, template }: Props) {
    const [config, setConfig] = useState(null);
    const [listNum, setListNum] = useState(1);
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
                    scss["dtVillage"]
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
                                title={config.leftContent.title}
                                enTitle={config.leftContent.entitle}
                                style={{ marginBottom: vh(24) }}
                                className={"pe-auto"}
                            >
                                <div className={scss['dtVillage2L']}>
                                    <div>
                                        {
                                            config.leftContent.content1.map((item, index) => {
                                                return <LeftLabel
                                                    key={index}
                                                    data={item}
                                                    content={
                                                        <div className={scss['label-number']}>{item.number}</div>
                                                    }
                                                />
                                            })
                                        }
                                    </div>
                                    <div>
                                        {
                                            config.leftContent.content3.map((item, index) => {
                                                return <LeftLabel
                                                    key={index}
                                                    data={item}
                                                    content={
                                                        <div className={scss['label-number']}>{item.number}</div>
                                                    }
                                                />
                                            })
                                        }
                                    </div>
                                </div>
                                {
                                    config.leftContent.content2.map((item, index) => {
                                        return <LeftLabel
                                            key={index}
                                            data={item}
                                            content={
                                                // <div>{item.number}</div>
                                                <Stacked data={item.data} color={item.color} fields={item.fields} width={280} />
                                            }
                                        />
                                    })
                                }
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
                    scss["dtVillage"]
                    // +" " +
                    // scss["pe-none"]
                }
                visible={visible}
            >
                <div className={scss["right"]}>
                    {config ? (
                        <>
                            <CardLayout
                                title={config.rightContent.content1.title}
                                enTitle={config.rightContent.content1.entitle}
                                style={{ marginBottom: vh(24) }}
                                className={"pe-auto"}
                                suffixIcon={
                                    <div className={scss['text-suffix2']}>
                                        类别数量:<span>4</span>类
                                    </div>
                                }
                            >
                                <div className={scss['label-box']}>
                                    {
                                        config.rightContent.content1.data.map((item, index) => {
                                            return <RightLabel
                                                key={index}
                                                data={item}
                                                content={
                                                    <div className={scss['label-number']}>{item.number}</div>
                                                }
                                            />
                                        })
                                    }
                                </div>
                            </CardLayout>
                            <CardLayout
                                title={config.video.title}
                                enTitle={config.video.entitle}
                                style={{ marginBottom: vh(24) }}
                                className={"pe-auto"}
                            >
                                <MonitorCard
                                    className={scss['video-box']}
                                    data={config.video.data}
                                    mask={false}
                                    style={{ marginBottom: "60px" }} />
                            </CardLayout>
                            <CardLayout
                                title={config.rightContent.content2.title}
                                enTitle={config.rightContent.content2.entitle}
                                style={{ marginBottom: vh(24) }}
                                className={"pe-auto"}
                                suffixIcon={
                                    <div className={scss['text-suffix2']}>
                                        类别数量:<span>4</span>类
                                    </div>
                                }
                            >
                                <div className={scss['label-box']}>
                                    {
                                        config.rightContent.content2.data1.map((item, index) => {
                                            return <RightLabel
                                                key={index}
                                                data={item}
                                                content={
                                                    <div className={scss['label-number']}>{item.number}</div>
                                                }
                                            />
                                        })
                                    }
                                    <RightLabel2 data={config.rightContent.content2.data2} />
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
