import { message } from "antd";
import Axios from "axios";
import sxcwms from "config/sxcwms";
import { Component } from "react";
import { getPosition } from "utils/common";
import Service from "utils/Service";
import map from "utils/TDTMap";

// 移动端右下角点击定位
export function positionHandler() {
  console.assert(this instanceof Component, "`this` must be an instance of `Component`");
  getPosition().then(({ coords }) => {
    const { longitude: x, latitude: y } = coords;
    // console.log(coords);s
    Service.getTownName({ x, y }).then((r) => {
      if (r.data) {
        // let X = x + Math.random() * 0.1,
        //   Y = y + Math.random() * 0.1;
        let lay = map.addMarker(x, y, {
          iconUrl: require("assets/position-marker.svg"),
          iconSize: [36, 36],
          id: "position-marker",
        });
        let town = this.context.getTown({ townName: r.data });
        if (town) {
          this.context.setTownLayerAndCode(town);
          map.map.centerAndZoom(new T.LngLat(x, y), map.CLASS_TITLE_ZOOM);
        }
      }
    });
  });
}

function getTown(filter: object) {
  filter = Object.entries(filter);
  const store = this.store || this.context?.store;
  return store?.townList.find((t) => (filter as Array<any>).every(([k, v]) => t[k] == v));
}

function centerTown(town: any) {
  if (town && town.x) {
    map.map.centerAndZoom(
      new T.LngLat(town.x, town.y),
      /000/.test(town.code) ? map.defaultZoom : map.TOWN_TITLE_ZOOM
    );
  }
}

function centerTownBy(filter: object) {
  let town = getTown.call(this, filter);
  return centerTown.call(this, town);
}
// 设置乡镇小班图层
function setTownLayer(town: any) {
  if (town && town.x) {
    let { layers } = map.sxcLayer.options;
    //update layer of town
    map.sxcLayer.setParams({
      layers: layers + (!/000/.test(town.code) ? "," + sxcwms.townLayer[town.code] : ""),
      viewparams: `townCode:${town.code}`,
    });
    map.sxcLayer.setZIndex(99)
  }
}

function setTownLayerBy(filter: object) {
  let town = getTown.call(this, filter);
  return setTownLayer.call(this, town);
}

export default { getTown, centerTown, centerTownBy, setTownLayer, setTownLayerBy };
