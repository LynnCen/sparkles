import { useEffect, useState } from "react";
import CardLayout, { Suffix } from "../../Components/CardLayout";
import { Drawer, Icon, Spin, Progress, Button, Table } from "antd";
import { feature } from "../../Components/Header";
import { templates } from "../../../../config/StrConfig";
import { columns } from "../geologicHazard";
import { IndustrialLabel1, IndustrialLabel2 } from './components'

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

interface Props {
    visible: boolean;
    template: string;
}
export default function DigitalFarm({ visible, template }: Props) {
    const [config, setConfig] = useState(null);
    const [listNum, setListNum] = useState(1);
    const [listVisible, setListVisible] = useState(false);
    const [selectKey, setSelectKey] = useState(0)
    useEffect(() => {
        fetch(templates[template].configPath)
            .then(r => r.json())
            .then(setConfig)
            .catch(console.table);
    }, []);

    const letf = () => {
        let box = document.querySelector('[id*="child-box"]')
        const newNum = listNum - 1
        if (newNum > 0) {
            box.style.left = '0px'
            setListNum(newNum)
        }
        else {
            setListNum(1)
        }
    }

    const right = () => {
        let box = document.querySelector('[id*="child-box"]')
        const newNum = listNum + 1
        if (newNum <= 2) {
            box.style.left = '-390px'
            setListNum(newNum)
        }
        else {
            setListNum(2)
        }
    }
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
                    scss["digitalFarm"]
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
                                title={config.atmosphere.title2}
                                enTitle={config.atmosphere.enTitle2}
                                style={{ marginBottom: vh(24) }}
                                className={"pe-auto"}
                            >
                                <div
                                    className={css["flex-center-between"] + " " + scss["center"]}
                                >
                                    {config.atmosphere.data.map((item, i) => (
                                        <div className={scss["item"]} key={i}>
                                            <div className={scss["icon"]}>
                                                <span>
                                                    <img src={item.avatar} style={{ height: 32 }} />
                                                </span>
                                            </div>
                                            <div>
                                                <h2
                                                    className={scss["arial"] + " " + scss["white"]}
                                                    style={{
                                                        lineHeight: "17px",
                                                        marginBottom: "5px",
                                                        fontSize: i == 0 ? 16 : 24
                                                    }}
                                                >
                                                    {item.value || ""}
                                                    <span style={{ fontSize: 14 }}>{item.unit || ""}</span>
                                                </h2>
                                                <h4 style={{ opacity: 0.8 }}>{item.name}</h4>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardLayout>
                            <CardLayout
                                title={config.industrial.title}
                                enTitle={config.industrial.entitle}
                                style={{ marginBottom: vh(24) }}
                                className={"pe-auto"}
                                suffixIcon={
                                    <div className={scss['subtitle']}>
                                        类别数量:<span>{config.industrial.subtitleNum}</span>类
                                </div>
                                }
                            >
                                <div className={scss['label-box']}>
                                    {
                                        config.industrial.listData.map((item, index) => {
                                            return <IndustrialLabel1 key={index} title={item.title} imageUrl={item.imageUrl} />
                                        })
                                    }
                                </div>
                            </CardLayout>
                            <CardLayout
                                title={config.production.title}
                                enTitle={config.production.entitle}
                                style={{ marginBottom: vh(24) }}
                                className={"pe-auto"}
                                suffixIcon={
                                    <div className={scss['subtitle']}>
                                        类别数量:<span>{config.production.subtitleNum}</span>类
                                </div>
                                }
                            >
                                <div className={scss['label-box']}>
                                    {
                                        config.production.listData.map((item, index) => {
                                            return <IndustrialLabel2
                                                key={index}
                                                title={item.title}
                                                imageUrl={item.imageUrl}
                                                number={item.number}
                                            />
                                        })
                                    }
                                </div>
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
                    scss["digitalFarm"]
                    // +" " +
                    // scss["pe-none"]
                }
                visible={visible}
            >
                <div className={scss["right"]}>
                    {config ? (
                        <>
                            <CardLayout
                                title={config.internet.title}
                                enTitle={config.internet.entitle}
                                style={{ marginBottom: vh(24) }}
                                className={"pe-auto"}
                                suffixIcon={
                                    <>
                                        <div className={scss['df-pagination']}>
                                            <div onClick={() => letf()}><Icon type="left" /></div>
                                            <div>{listNum}/2</div>
                                            <div onClick={() => right()}><Icon type="right" /></div>
                                            <div onClick={() => {
                                                setListVisible(!listVisible)
                                                !listVisible && setSelectKey(0)
                                            }}
                                            >
                                                <Icon type="dash" /></div>
                                        </div>
                                        {
                                            listVisible &&
                                            <div className={scss['df-list']}>
                                                {
                                                    config.internet.listData.map(item => {
                                                        return <>
                                                            {
                                                                item.map((j) => {
                                                                    return <div
                                                                        className={j.key === selectKey && scss['list-select']}
                                                                        key={j.key}
                                                                        onClick={() => setSelectKey(j.key)}
                                                                    >
                                                                        {j.title}
                                                                    </div>
                                                                })
                                                            }
                                                        </>
                                                    })
                                                }
                                            </div>
                                        }
                                    </>
                                }
                            >
                                <div className={scss['card-box']}>
                                    <div id={scss['child-box']}>
                                        {
                                            config.internet.listData.map((i, index) => {
                                                return <div key={index}>
                                                    {
                                                        i.map((j, j_index) => {
                                                            return <div key={j_index}>
                                                                <div className={scss['child1']}>
                                                                    <img src={j.imageUrl} alt="" />
                                                                    <div>
                                                                        <div>
                                                                            <span className={scss['redPoint']}></span>
                                                                            <span>{j.title}</span>
                                                                        </div>
                                                                        <img src={config.internet.pointImg} alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className={scss['child2']}>
                                                                    <div>温度: <span className={scss['font-green']}>{j.temperature}℃</span></div>
                                                                    <div>湿度: <span className={scss['font-blue']}>{j.humidity}%</span></div>
                                                                </div>
                                                                <div className={scss['child3']}>
                                                                    <div className={j.switch1 && scss['bg-green']} >遮阳伞: {j.switch1 ? "开" : '关'}</div>
                                                                    <div className={j.switch2 && scss['bg-blue']} >喷淋系统: {j.switch2 ? "开" : '关'}</div>
                                                                </div>
                                                            </div>
                                                        })
                                                    }
                                                </div>
                                            })
                                        }
                                    </div>
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
