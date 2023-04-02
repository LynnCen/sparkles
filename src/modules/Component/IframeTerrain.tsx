import React from "react";
import { Select } from "antd";
import Config from "../config/Config";
import ShowData from "./tools/showData";
import ReactDOM from "react-dom";

const Option = Select.Option;

const css = require("../styles/compare.css");

/**
 * @name IframeTerrain
 * @author: bubble
 * @create: 2019/8/23
 * @description: 地块对比
 */

interface IframeTerrainProps {
    drawVisible: boolean;
}

interface IframeTerrainStates {
    isVertical: boolean;
    widthOfOne: string;
    heightOfOne: string;
    widthOfTwo: string;
    heightOfTwo: string;
    containerOneWidth: string;
    containerOneHeight: string;
    containerTwoWidth: string;
    containerTwoHeight: string;
    oneUrl: string;
    twoUrl: string;
    isCompleted: boolean;
}

const maps = function (a, b, c, d) {
    this.m1 = a;
    this.v1 = b;
    this.m2 = c;
    this.v2 = d;
    this.p = null;
    const click = () => {
        const m1 = this.m1;
        const m2 = this.m2;
        const v1 = this.v1;
        const v2 = this.v2;
        const polygon1 = new polygon("polygonLayer", m1, v1);
        const polygon2 = new polygon("polygonLayer", m2, v2);
        const p1 = polygon1.init();
        const p2 = polygon2.init();
        const STATE_CREATE = "create";
        const STATE_ADD = "add";

        m1.bindEvent("click", (e) => {
            const geo = e.getGeoLocation();
            if (e.isLeftClick()) {
                if (geo) {
                    p1.addVertex(geo);
                    const geo1 = new v2.GeoLocation(geo.x(), geo.y(), geo.z());
                    p2.addVertex(geo1);
                }
            } else if (e.isRightClick()) {
                m2.unbindEvent("click");
                m1.unbindEvent("click");
            }
        });
        m2.bindEvent("click", (e) => {
            const geo = e.getGeoLocation();
            if (e.isLeftClick()) {
                if (geo) {
                    const geo1 = new v1.GeoLocation(geo.x(), geo.y(), geo.z());
                    p1.addVertex(geo1);
                    p2.addVertex(geo);
                }
            } else if (e.isRightClick()) {
                m2.unbindEvent("click");
                m2.unbindEvent("click");
            }
        })
    };

    const polygon = function (i, m, v) {
        this.id = i;
        this.m = m;
        this.v = v;
        this.layer = this.m.getLayerById(i) || new this.v.Layer.FeatureLayer(i);
        const getLayerId = () => {
            return this.id;
        };
        const getLayer = () => {
            return this.layer;
        };
        const init = () => {
            const layer = this.layer;
            const v = this.v;
            const m = this.m;
            const polygon = new v.Feature.Polygon();
            const style = new v.Style.ExtrudeStyle();
            style.setColor(new v.Color("#ffffff"));
            style.setOpacity(0.7);
            style.setHeight(40);
            polygon.setStyle(style);
            m.addLayer(layer);
            layer.addFeature(polygon);
            return polygon;
        };
        return {
            getLayerId,
            getLayer,
            init
        }
    };
    return {
        click,
        polygon
    }
};



class CompareTerrain extends React.Component<IframeTerrainProps, IframeTerrainStates> {
    line;
    alignToggle;
    interval;

    constructor(props: IframeTerrainProps) {
        super(props);
        this.state = {
            isVertical: false,
            widthOfOne: window.innerWidth + "px",
            widthOfTwo: window.innerWidth + "px",
            heightOfOne: "100%",
            heightOfTwo: "100%",
            containerOneWidth: window.innerWidth / 2 + "px",
            containerOneHeight: window.innerHeight + "px",
            containerTwoWidth: window.innerWidth / 2 + "px",
            containerTwoHeight: window.innerHeight + "px",
            oneUrl: "https://highdata.oss-cn-hangzhou.aliyuncs.com/20190816chengxi/",
            twoUrl: "http://qiniu.vrplanner.cn/416a3x/",
            isCompleted: false
        }
    }



    render() {
        return (
            <div className={css["containerOne"]} style={{ width: this.state.containerOneWidth, height: this.state.containerOneHeight, backgroundColor: "#555555" }}>
                {/* {this.state.isCompleted ? <Select
            defaultValue={"2019年01月"}
            style={{ position: "absolute", top: "130px", left: "30px", zIndex: 1 }}
          >
            <Option value="2019年01月">2019年01月</Option>
            <Option value="2019年08月">2019年08月</Option>
          </Select> : null} */}
                <iframe name="One"
                    src="../../public/container.html"
                    frameBorder="no" style={{ position: "absolute", top: 0 }} width={this.state.widthOfOne} height={this.state.heightOfOne} />
            </div>
        )
    }
}

export default CompareTerrain
