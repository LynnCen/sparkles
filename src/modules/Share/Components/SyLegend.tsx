import React, { Component } from 'react';
import { Mark } from '../../../components/model';
import Config from '../../../config/Config';
import DataService from '../../../services/DataService';
import LegendSelected from '../../../assets/legendSelected.svg'
import VideoPlayer from './VideoPlayer';
import DragModal from '../../../components/DragModal';
import Play from '../../../components/tools/Play';
import VideoPopup from './VideoPopup';
import { data4 } from '../skin/songyangMap4/data';

let vw = px => (px / 3200) * 100 + "vw";
let vh = px => (px / 1344) * 100 + "vh";
let rem = px => px + 'rem'

const scss = require("../../../styles/scss/sharepage.scss");
const { maps, vrPlanner } = Config;


interface Props {
    data: any,
    tempData: {},
    type: string,
    promptVisible: boolean,
    syLegendSelectedList: any[],
    changePrompt: (value, _name) => void,
    changePopupVisible: (key, value) => void,
    syChangeSelected: (value) => void
}

interface State {
    isMonitor: boolean
}


class SyLegend extends Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            isMonitor: false
        }
    }

    componentDidMount() {
    }



    onClick = (r, i) => {
        const { tempData, type } = this.props;
        const _data = tempData[type]
        if (_data[i] && _data[i].length > 0) {
            _data[i].forEach(item => {
                item.setVisible(!item.getVisible());
                if (item.getVisible()) {
                    maps.getCamera().flyTo(item.geo.add((Math.random() + 1) * 100, (Math.random() + 1) * 100, (Math.random() + 1) * 150), item.geo)
                    if (type === "songyangMap1" && i == 7) {
                        const pos = new vrPlanner.GeoLocation(13317758.958005015, 3292554.546964383, 682.3554507012482);
                        const lookAt = new vrPlanner.GeoLocation(13317774.511800008, 3292497.524993564, 601.6921114124697);
                        maps.getCamera().flyTo(pos, lookAt);
                    }
                }
            })
        } else {
            _data[i] = [];
            let layer = maps.getLayerById("balloonLayer")
            if (!layer) {
                layer = new vrPlanner.Layer.FeatureLayer("balloonLayer");
                maps.addLayer(layer);
            }
            if (r.inline && r.requestUrl) {
                fetch(r.requestUrl, {
                    method: "get",
                    headers: { "Content-Type": "application/json" }
                })
                    .then(res => res.json())
                    .then(res => {
                        const { data } = res;
                        if (type !== "songyangMap6")
                            data.forEach(people => {
                                DataService.getPlanDataById({ planDataString: people.planDataId }, (bool, _res) => {
                                    if (bool) {
                                        const { data } = _res;
                                        data.forEach((planData, index) => {
                                            const isCustom = type === "songyangMap1" && i == 7;
                                            const squareBezier = (p0, p1, p2, t) => {
                                                var k = 1 - t;
                                                return Math.pow(k, 2) * p0 + 2 * (1 - t) * t * p1 + Math.pow(t, 2) * p2;
                                            }
                                            const { position } = planData;
                                            const mark = new Mark({
                                                geo: new vrPlanner.GeoLocation(JSON.parse(position)[0], JSON.parse(position)[1], JSON.parse(position)[2]),
                                                title: (isCustom ? `${people.name}(${people.familyCount}人)` : `${people.name}`),
                                                lineVisible: true,
                                                height: (Math.random() + 1) * 20,
                                                icon: isCustom ? "images/songyang/bg.png" : r.icon,
                                                isCustom,
                                            });
                                            mark.point.data = people;
                                            mark.point.template = type;
                                            mark.point.name = r.name
                                            layer.addFeature(mark.point);
                                            layer.addFeature(mark.line);
                                            _data[i].push(mark);
                                            if (mark.getVisible() && index == 0) {
                                                if (isCustom) {
                                                    const pos = new vrPlanner.GeoLocation(13317758.958005015, 3292554.546964383, 682.3554507012482);
                                                    const lookAt = new vrPlanner.GeoLocation(13317774.511800008, 3292497.524993564, 601.6921114125146);
                                                    maps.getCamera().flyTo(pos, lookAt);
                                                } else {
                                                    if (type === "songyangMap3" && i === 8) {
                                                        const pos = new vrPlanner.GeoLocation(13318183.23942103, 3292545.124105395, 564.2437178818411);
                                                        const lookAt = new vrPlanner.GeoLocation(13318131.789845487, 3292493.674529852, 495.6442838248376);
                                                        maps.getCamera().flyTo(pos, lookAt);
                                                    } else {
                                                        maps.getCamera().flyTo(mark.geo.add(150, 150, 200), mark.geo);
                                                    }
                                                }
                                            }
                                            mark.renderBalloon({
                                                click: () => {
                                                    // mark.showBalloonData()]
                                                    this.props.changePopupVisible(true, mark.point)
                                                    if (type === "songyangMap3" && i === 8) {
                                                        let layer = maps.getLayerById("helpLayer");
                                                        if (!layer) {
                                                            layer = new vrPlanner.Layer.FeatureLayer("helpLayer");
                                                            maps.addLayer(layer)
                                                        }
                                                        layer.clearFeatures();
                                                        const { helpPersons } = people;
                                                        if (helpPersons) {
                                                            helpPersons.forEach(helpPerson => {
                                                                console.log(helpPerson);
                                                                DataService.getPlanDataById({ planDataString: helpPerson.planDataId }, (bool, _res) => {
                                                                    if (bool) {
                                                                        const { data } = _res;
                                                                        data.forEach(planData => {
                                                                            const { position } = planData;
                                                                            const _mark = new Mark({
                                                                                geo: new vrPlanner.GeoLocation(JSON.parse(position)[0], JSON.parse(position)[1], JSON.parse(position)[2]),
                                                                                title: `${helpPerson.name}`,
                                                                                lineVisible: true,
                                                                                height: (Math.random() + 1) * 20,
                                                                                icon: data4[0].icon
                                                                            });

                                                                            fetch(`http://dtcity.cn:8088/api/peoples/queryByID/${helpPerson.id}`, {
                                                                                method: "get",
                                                                                headers: { "Content-Type": "application/json" }
                                                                            }).then(res => res.json()).then(
                                                                                res => {
                                                                                    console.log(res)
                                                                                    _mark.point.data = res.data;
                                                                                    _mark.point.template = "songyangMap1";
                                                                                    _mark.point.name = r.name
                                                                                    _mark.renderBalloon({
                                                                                        click: () => {
                                                                                            this.props.changePopupVisible(true, _mark.point)
                                                                                        }
                                                                                    })
                                                                                }
                                                                            )

                                                                            const line = new vrPlanner.Feature.Line();
                                                                            const style = new vrPlanner.Style.LineStyle();
                                                                            style.setColor(new vrPlanner.Color("#ffec3d"));
                                                                            style.setWidth(1);
                                                                            style.setAppearance(vrPlanner.Style.LineStyle.APPEARANCE_FLAT_2D);
                                                                            style.setDepthTest(false)
                                                                            line.setStyle(style)

                                                                            const x = (_mark.geo.x() - mark.geo.x()) / 4 + mark.geo.x();
                                                                            const y = (_mark.geo.y() - mark.geo.y()) / 4 + mark.geo.y();
                                                                            let z = mark.geo.z() > _mark.geo.z() ? (2 * mark.geo.z() - _mark.geo.z() + 20) : (2 * _mark.geo.z() - mark.geo.z() + 20)
                                                                            for (let i = 0; i <= 100; i++) {
                                                                                let t = i / 100;
                                                                                const _x = squareBezier(mark.geo.x(), x, _mark.geo.x(), t)
                                                                                const _y = squareBezier(mark.geo.y(), y, _mark.geo.y(), t)
                                                                                const _z = squareBezier(mark.geo.z(), z, _mark.geo.z(), t)
                                                                                line.addVertex(new vrPlanner.GeoLocation(_x, _y, _z))
                                                                            }
                                                                            layer.addFeature(_mark.point);
                                                                            layer.addFeature(_mark.line);
                                                                            layer.addFeature(line);
                                                                        })
                                                                    }
                                                                })
                                                            })
                                                        }
                                                    }
                                                }
                                            })
                                        })
                                    }
                                })
                            })
                        else {
                            Play.play(data[0].feature)
                            if (data[0].feature[0].data == 0 && data[0].feature[0].type != 'view') {
                                this.props.changePrompt(this.props.promptVisible, r.name)
                            }
                        }
                    })

            }
            if (!r.inline) {
                const { data, icon, name } = r;
                if (type === "songyangMap1" && i == 6) {
                    const pos = new vrPlanner.GeoLocation(13318110.406509822, 3292897.6780513646, 164.22551285285834);
                    const lookAt = new vrPlanner.GeoLocation(13318041.13262122, 3292959.345769733, 126.83272118042717);
                    maps.getCamera().flyTo(pos, lookAt);
                    this.setState({
                        isMonitor: !this.state.isMonitor
                    })
                } else
                    if (data.length > 0) {
                        data.forEach(item => {
                            DataService.getPlanDataById({ planDataString: item.planDataId }, (bool, res) => {
                                if (bool) {
                                    const { data } = res;
                                    data.forEach((planData, index) => {
                                        const { position } = planData;
                                        const mark = new Mark({
                                            geo: new vrPlanner.GeoLocation(JSON.parse(position)[0], JSON.parse(position)[1], JSON.parse(position)[2]),
                                            title: item.post ? item.post + `${name}` : `${name}`,
                                            lineVisible: true,
                                            icon,
                                            height: (Math.random() + 1) * 20
                                        });
                                        layer.addFeature(mark.point);
                                        layer.addFeature(mark.line);
                                        mark.point.data = item;
                                        mark.point.template = type;
                                        mark.point.name = r.name
                                        _data[i].push(mark);
                                        if (mark.getVisible() && index == 0) {
                                            maps.getCamera().flyTo(mark.geo.add((Math.random() + 1) * 100, (Math.random() + 1) * 100, (Math.random() + 1) * 150), mark.geo)
                                        }
                                        mark.renderBalloon({
                                            click: () => {
                                                this.props.changePopupVisible(true, mark.point)
                                                // mark.showBalloonData()
                                            }
                                        })
                                    })
                                }
                            })
                        })
                    }
                    else {
                        this.props.changePrompt(this.props.promptVisible, name)
                    }
            }
        }
        this.props.syChangeSelected(i)
    }

    render() {
        const { data, tempData, syLegendSelectedList } = this.props;

        return (
            <div className={scss['sy-legend']}>
                <div className={scss['sy-legend-title']}>图例</div>
                <div>
                    <div className={scss['sy-legend-content']}>
                        {
                            data.map((r, i) => {
                                return <div
                                    key={i}
                                    onClick={() => r.click && this.onClick(r, i)}
                                    className={!r.click && scss['optional']}
                                    title={!r.click ? "暂无数据" : ""}
                                >
                                    <div className={scss['sy-checkbox']}>
                                        {
                                            syLegendSelectedList.includes(i) && <img src={LegendSelected} style={{ width: rem(0.25) }} alt="" />
                                        }
                                    </div>
                                    <img src={r.icon} alt="" />
                                    {r.name}
                                </div>
                            })
                        }
                    </div>
                </div>
                {
                    this.state.isMonitor ? <VideoPopup close={() => {
                        this.setState({ isMonitor: false })
                        this.props.syChangeSelected(6)
                    }} /> : null
                }
            </div >
        );
    }
}

export default SyLegend;