import React from "react";
import sxcwms, { sxcother } from "config/sxcwms";
import { mergeParams, render } from "./common";
import { InfoWinTable } from "components/Universal";

const defaultLngLat = new T.LngLat(119.91028, 28.40652);
const errorTileUrl =
  "http://t2.tianditu.gov.cn/DataServer?T=cva_c&tk=84ad7eefb6467aa205770207b5fce1d6&x=13625&y=2296&l=14";
const zjImgUrl =
  "http://srv2.zjditu.cn/ZJDOM_2D/wmts?layer=ZJDOM_2D&style=default&tilematrixset=TileMatrixSet0&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix={z}&TileCol={x}&TileRow={y}";
const placeNameUrl =
  `http://t7.tianditu.gov.cn/DataServer?T=cva_c&tk=${env.TDTKEY}&x={x}&y={y}&l={z}`;

export default class map {
  static PANE_OVERLAY = 1;
  static PANE_MARKER = 2;
  static PANE_INFOWINDOW = 3;
  static PANE_POLYLINE = 4;

  static defaultZoom = 11;
  static maxZoom = 18;
  // static TOWN_INFECTION_ZOOM = 18;
  static PLAUE_TREE_BIG_ZOOM = 17;
  static TOWN_TITLE_ZOOM = 13;
  static CLASS_DETAIL_ZOOM = 16;
  static CLASS_TITLE_ZOOM = 17;

  static element;
  static map;
  static sxcLayer;
  static sxcLayerMap = {};

  static get markerPane() {
    return map.map.getOverlays().filter((lay) => lay.getType() == map.PANE_MARKER);
  }

  static get overlayPane() {
    return map.map.getOverlays().filter((lay) => lay.getType() == map.PANE_OVERLAY);
  }

  static get infoWindowPane() {
    return map.map.getOverlays().filter((lay) => lay.getType() == map.PANE_INFOWINDOW);
  }

  static get polylinePane() {
    return map.map.getOverlays().filter((lay) => lay.getType() == map.PANE_POLYLINE);
  }

  static init(id = "map-container") {
    let dom = document.getElementById(id);
    if (dom) dom.remove();
    this.element = dom = document.createElement("div");
    dom.id = id;
    document.getElementById("root").appendChild(dom);
    const map = new T.Map(id, { projection: "EPSG:4326"});
    map.centerAndZoom(defaultLngLat, this.defaultZoom);
    map.setMapType(window["TMAP_SATELLITE_MAP"]); //TMAP_HYBRID_MAP:路网卫星
    const placeNameLayer = this.getTileLayer({
      url: placeNameUrl,
      minZoom: 14,
      maxZoom: this.maxZoom,
    });
    map.addLayer(placeNameLayer);
    this.sxcLayer = new T.TileLayer.WMS(env.REACT_APP_WMS_URL, {
      id: sxcwms.id,
      layers: sxcwms.layers,
      version: "1.1.0", //请求服务的版本
      transparent: true, //输出图像背景是否透明
      // styles: "", //每个请求图层的用","分隔的描述样式
      format: "image/png",
      maxZoom: this.maxZoom,
      width: sxcwms.width,
      height: sxcwms.height,
      Te: sxcwms.width,
    });
    map.addLayer(this.sxcLayer);
    Object.entries(sxcother).forEach(([k, v]) => {
      this.sxcLayerMap[k] = new T.TileLayer.WMS(env.REACT_APP_WMS_URL, {
        id: v.id,
        layers: v.layers || "",
        version: "1.1.0",
        transparent: true,
        format: "image/png",
        width: v.width || 256,
        height: v.height || 256,
        Te: v.width || 256,
      });
    });
    map.addEventListener("zoomend", this.onZoomend);
    map.addEventListener("moveend", this.onMovend);
    this.map = map;
  }

  static getTileLayer(opt) {
    return new T.TileLayer(opt.url, { ...opt });
  }

  static getLayer(id) {
    return this.map.getLayers().find((layer) => !!layer.options.id && id == layer.options.id);
  }

  static reset() {
    ["markerPane", "infoWindowPane", "polylinePane"].forEach((k) =>
      this[k].forEach((lay) => map.map.removeOverLay(lay))
    );
    map.overlayPane.forEach((lay) => {
      !/town|class|factory/.test(lay.options.contentType) && map.map.removeOverLay(lay);
    });
    map.sxcLayer.setParams({ layers: sxcwms.layers });
    Object.entries(sxcother).forEach(([k, v]) => {
      let layer = this.getLayer(v.id);
      if (layer) {
        layer.setParams({ styles: "", layers: v.layers || "" });
        !v.layers && map.map.removeLayer(layer);
      }
    });
  }

  static addMarker(
    lng,
    lat,
    { iconUrl = "", iconSize = [30, 30], iconAnchor = [0, 0], id = 0 }: addMarkerOption = {}
  ) {
    let lnglat = new T.LngLat(lng, lat);
    let marker = this.markerPane.find(
      (e) => (!!id && id == e.options.id) || e.getLngLat().equals(lnglat)
    );
    if (!marker) {
      //创建标注对象
      marker = new T.Marker(lnglat, { id });
      if (iconUrl)
        marker.setIcon(
          new T.Icon({
            iconUrl,
            iconSize: new T.Point(...iconSize),
            iconAnchor: new T.Point(...iconAnchor),
          })
        );
      //向地图上添加标注
      this.map.addOverLay(marker);
    } else {
      marker.setLngLat(lnglat);
    }
    return marker;
  }

  static addPolyline(
    points: [number, number][],
    { color = "#0000FF", opacity = 0.8, id = 0 } = {}
  ) {
    let line = this.polylinePane.find((e) => !!id && id == e.options.id);
    if (!line) {
      line = new T.Polyline(
        points.map((p) => new T.LngLat(...p)),
        { color, opacity, id }
      );
      this.map.addOverLay(line);
    }
    return line;
  }

  static polygon() {
    const Data = [];
    const points = Data.map((it) => {
      return new T.LngLat(it.lng, it.lat);
    });
    console.log(points);
    //创建面对象
    const polygon = new T.Polygon(points, {
      color: "#666666",
      weight: 3,
      opacity: 0.5,
      lineStyle: "dashed",
      fillColor: "#FFFFFF",
      fillOpacity: 0.5,
    });
    //向地图上添加面
    this.map.addOverLay(polygon);
  }

  static getOverlay(id) {
    return this.map.getOverlays().find((lay) => !!id && id == lay.options.id);
  }

  static clearInfoWin(e) {
    if (!e.target.closest("[id*=infowin]")) {
      let infoWin = map.infoWindowPane && map.infoWindowPane[0];
      if (infoWin) {
        infoWin.closeInfoWindow(); // this.map.removeOverLay(infoWin);
        infoWin.getElement().remove();
      }
    }
    map.element.removeEventListener("click", this.clearInfoWin);
  }

  static addInfoWin({ lnglat, content, id, ...rest }) {
    // let infoWin = this.infoWindowPane.find((e) => (!!id && id == e.options.id) || e.ET == content);
    let infoWin = new T.InfoWindow(typeof content == "string" ? content : "", { id, ...rest });
    infoWin.setLngLat(lnglat);
    this.map.addOverLay(infoWin);
    this.element.addEventListener("click", this.clearInfoWin);
    queueMicrotask(() => {
      const el = infoWin.getElement();
      el.style.transform += " translateX(-50%)";
      el.style.left = 0;
    });
    return infoWin;
  }

  static addLabel({ lng, lat, text, id = "", style = {}, offsetY = 0, ...rest }) {
    const lnglat = new T.LngLat(lng, lat);
    let label = this.overlayPane.find(
      (e) =>
        (!!id && id == e.options.id) ||
        (e.options.position.equals(lnglat) && e.options.text == text)
    );
    if (!label) {
      label = new T.Label({ id, text, position: lnglat, ...rest });
      this.map.addOverLay(label);
      queueMicrotask(() => {
        label.setOffset(new T.Point(label.getElement().offsetWidth / -2, offsetY));
      });
      const el = label.getElement();
      typeof style == "object" && Object.entries(style).forEach(([k, v]) => (el.style[k] = v));
    } else if (label.isHidden()) {
      label.show();
    }
    return label;
  }

  // static addImage(url, bounds, { opacity = 1, ...rest }) {
  //   const bds = new T.LngLatBounds(bounds.map((bd) => new T.LngLat(...bd)));
  //   const img = new T.ImageOverlay(url, bds, { opacity, ...rest });
  //   this.map.addOverLay(img);
  // }

  // static addCarTrack(
  //   data = [
  //     [116.26802, 39.90623],
  //     [116.28896, 39.90622],
  //   ],
  //   { interval = 5, speed = 10, dynamicLine = true }
  // ) {
  //   let carTrack = new T.CarTrack(this.map, {
  //     interval,
  //     speed,
  //     dynamicLine,
  //     polylinestyle: { color: "#2C64A7", weight: 5, opacity: 0.9 },
  //     Datas: data.map(([...lnglat], i) => {
  //       return new T.LngLat(...lnglat);
  //     }),
  //   });
  //   return carTrack;
  // }

  static getPanes() {
    console.log(this.map.getPanes());
    console.log(this.map.getOverlays());
  }

  private static onZoomend(e) {
    map.controlBoundaryLayer();
    map.infoWindowPane.forEach((info) => {
      const el = info.getElement();
      el.style.transform += " translateX(-50%)";
      el.style.left = 0;
    });
  }

  private static onMovend(e) {
    map.controlBoundaryLayer();
  }

  private static controlBoundaryLayer() {
    const zoom = this.map.getZoom();
    const { layers } = this.sxcLayer.KR;
    let show;
    // console.log("zoom", zoom,layers);
    if (zoom < this.TOWN_TITLE_ZOOM && !layers.includes(sxcwms.layers)) {
      show = true;
    } else if (
      zoom >= this.TOWN_TITLE_ZOOM &&
      layers.includes(sxcwms.layers) &&
      Object.values(sxcwms.townLayer).some((l) => layers.includes(l))
    ) {
      // console.log( Object.values(sxcwms.townLayer).some((l) => layers.includes(l)))
      show = false;
    } else return;
    this.sxcLayer.setParams({
      layers: mergeParams(layers, { [sxcwms.layers]: show }, { insert: "unshift" }),
    });
  }

  static onFactoryLabelClick = (ev) => {
    let { id, data } = ev.target.options;
    let selector = `info-factory-${id}`;
    const info = map.addInfoWin({
      lnglat: new T.LngLat(ev.lnglat.lng, ev.lnglat.lat),
      content: `<div id="${selector}"></div>`,
      id,
      className: "info-factory",
      offset: new T.Point(0, 16),
      contentType: "factory",
    });
    const element = React.createElement(InfoWinTable, { data });
    render(element, "#" + selector);
  };
}
process.env.NODE_ENV == "development" && (window["map"] = map);
