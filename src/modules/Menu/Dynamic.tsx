import { Component } from "react";
import Config from "../../config/Config";
import { Button } from "antd";

const css = require("../../styles/custom.css");

/**
 * @name Dynamic
 * @create: 2019/3/13
 * @description: 动态模拟
 */

interface DynamicProps {}

interface DynamicStates {}

const url = "http://www.vrplanner.cn:1239/API/res/image/gif/";

const imgList = [
  { imgUrl: `${url}f-2.gif` },
  { imgUrl: `${url}f-4.gif` },
  { imgUrl: `${url}f-5.gif` },
  { imgUrl: `${url}f-6.gif` },
  { imgUrl: `${url}f-7.gif` },
  { imgUrl: `${url}f-8.gif` },
  { imgUrl: `${url}f-9.gif` },
  { imgUrl: `${url}f-11.gif` },
  { imgUrl: `${url}f-12.gif` }
];

class Dynamic extends Component<DynamicProps, DynamicStates> {
  constructor(props: DynamicProps) {
    super(props);
    this.state = {};
  }

  handleClick = url => {
    const { maps, vrPlanner } = Config;
    maps.unbindEvent("click");
    maps.bindEvent("click", event => {
      const geo = event.getGeoLocation();
      if (event.isLeftClick()) {
        const point = new vrPlanner.Feature.Point(geo);
        const layer =
          maps.getLayerById("dynamic_layer") ||
          new vrPlanner.Layer.FeatureLayer("dynamic_layer");
        layer.addFeature(point);
        const balloon = new vrPlanner.Balloon(`<img src='${url}'/>`);
        balloon.setOffsetY(-30);
        point.setBalloon(balloon);
        maps.addLayer(layer);
      } else if (event.isRightClick()) {
        maps.unbindEvent("click");
      }
    });
  };

  clearFire = () => {
    const { maps } = Config;
    const layer = maps.getLayerById("dynamic_layer");
    if (layer) {
      layer.clearFeatures();
    }
  };

  render() {
    return (
      <div>
        <h3 className={css["m-sm"]}>动态模拟库</h3>
        <ul className={css["vrp-dynamic-list"]}>
          {imgList.map((item, i) => {
            return (
              <li
                key={i}
                className={css["vrp-li"]}
                onClick={() => {
                  this.handleClick(item.imgUrl);
                }}
              >
                <img src={item.imgUrl} className={css["vrp-img"]} />
              </li>
            );
          })}
        </ul>
        <div className={css["text-center"]}>
          <Button onClick={this.clearFire}>清空</Button>
        </div>
      </div>
    );
  }
}

export default Dynamic;
