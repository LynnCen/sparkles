import React, { Component } from 'react';
import Play from '../../../components/tools/Play';
import Config from "../../../config/Config";

const scss = require('../../../styles/scss/sharepage.scss')

const routerList = [
    {
        path: 'songyangMap1',
        title: "村情民情",
        image: `${process.env.publicPath}images/songyangMap/icon/村情民情1.svg`,
        selectedImage: `${process.env.publicPath}images/songyangMap/icon/村情民情2.svg`,
    },
    {
        path: 'songyangMap2',
        title: "产业发展",
        image: `${process.env.publicPath}images/songyangMap/icon/产业发展1.svg`,
        selectedImage: `${process.env.publicPath}images/songyangMap/icon/产业发展2.svg`,
    },
    {
        path: 'songyangMap3',
        title: "组织关系",
        image: `${process.env.publicPath}images/songyangMap/icon/组织关系1.svg`,
        selectedImage: `${process.env.publicPath}images/songyangMap/icon/组织关系2.svg`,
    },
    {
        path: 'songyangMap4',
        title: "智慧帮扶",
        image: `${process.env.publicPath}images/songyangMap/icon/智慧帮扶1.svg`,
        selectedImage: `${process.env.publicPath}images/songyangMap/icon/智慧帮扶2.svg`,
    },
    {
        path: 'songyangMap5',
        title: "重点人员",
        image: `${process.env.publicPath}images/songyangMap/icon/重点人员1.svg`,
        selectedImage: `${process.env.publicPath}images/songyangMap/icon/重点人员2.svg`,
    },
    {
        path: 'songyangMap6',
        title: "防灾避险",
        image: `${process.env.publicPath}images/songyangMap/icon/防灾避难1.svg`,
        selectedImage: `${process.env.publicPath}images/songyangMap/icon/防灾避难2.svg`,
    },
    // {
    //     path: 'songyangMap7',
    //     title: "工业企业图",
    //     image: `${process.env.publicPath}images/songyangMap/icon/工业企业图1.svg`,
    //     selectedImage: `${process.env.publicPath}images/songyangMap/icon/工业企业图2.svg`,
    // },
    {
        path: 'songyangMap8',
        title: "传统村落",
        image: `${process.env.publicPath}images/songyangMap/icon/传统村落1.svg`,
        selectedImage: `${process.env.publicPath}images/songyangMap/icon/传统村落2.svg`,
    },
    {
        path: 'songyangMap9',
        title: "民生工程",
        image: `${process.env.publicPath}images/songyangMap/icon/民生工程1.svg`,
        selectedImage: `${process.env.publicPath}images/songyangMap/icon/民生工程2.svg`,
    },
    {
        path: 'songyangMap10',
        title: "动态事件",
        image: `${process.env.publicPath}images/songyangMap/icon/动态事件1.svg`,
        selectedImage: `${process.env.publicPath}images/songyangMap/icon/动态事件2.svg`,
    },
    {
        path: 'songyangMap11',
        title: "生态资源",
        image: `${process.env.publicPath}images/songyangMap/icon/生态资源1.svg`,
        selectedImage: `${process.env.publicPath}images/songyangMap/icon/生态资源2.svg`,
    },
    {
        path: 'songyangMap12',
        title: "村庄规划",
        image: `${process.env.publicPath}images/songyangMap/icon/村庄规划.svg`,
        selectedImage: `${process.env.publicPath}images/songyangMap/icon/村庄规划_选中.svg`,
    },
    {
        path: '',
        title: "县政规划",
        image: `${process.env.publicPath}images/songyangMap/icon/县区规划1.svg`,
        selectedImage: `${process.env.publicPath}images/songyangMap/icon/县区规划2.svg`,
    },
    // {
    //     path: '',
    //     title: "物联感知图",
    //     image: `${process.env.publicPath}images/songyangMap/icon/物联感知1.svg`,
    //     selectedImage: `${process.env.publicPath}images/songyangMap/icon/物联感知2.svg`,
    // },

]
const { maps, vrPlanner } = Config;

interface Props {
    [k: string]: any;
    template: string;
    genTemplateSkin: any;
}

interface State { }

class SySelectedRouter extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {

        }
    }

    goPath = (value) => {
        if (value != "") {
            this.props.genTemplateSkin(value)
            this.props.syChangeVisible()
            this.props.hideDrawer();
            // let id = 0;
            // switch (value) {
            //     case "songyangMap1":
            //         id = 2402
            //         break;
            //     case "songyangMap2":
            //         id = 2401
            //         break;
            //     case "songyangMap3":
            //         id = 2400
            //         break;
            //     case "songyangMap4":
            //         id = 2399
            //         break;
            //     case "songyangMap5":
            //         id = 2398
            //         break;
            //     case "songyangMap6":
            //         id = 2397
            //         break;
            // }
            // fetch(Config.apiHost + `/Share/getSubMenu?subId=${id}`, {
            //     method: "get",
            //     headers: { "Content-Type": "application/json" }
            // })
            //     .then(res => res.json())
            //     .then(res => {
            //         Play.play(res.data[0].feature)
            //     })
            maps.getLayerById("balloonLayer").clearFeatures();
        }
    }

    render() {
        const { template } = this.props
        return (
            <div className={scss['sy-selected-router']}>
                <div>
                    {
                        routerList.map((r, i) => {
                            return <div
                                key={i}
                                onClick={() => this.goPath(r.path)}
                                className={scss['unselected-router'] + " " + (r.path === template && scss['selected-router'])}
                            >
                                <div
                                    className={scss['router-icon']}
                                    style={{ background: `url(${r.path === template ? r.selectedImage : r.image})` }}
                                />
                                <div>{r.title}</div>
                            </div>
                        })
                    }
                </div>
            </div>
        );
    }
}

export default SySelectedRouter;