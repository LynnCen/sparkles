import Config from "../../config/Config";
import TerrainService from "../../services/TerrainService";
import Terrain from "../model/Terrain";
import Line from "../model/Line";
import Polygon from "../model/Polygon";
import TransCoordinate from "./Coordinate";
const { maps, vrPlanner } = Config;

export default class Tools {
  private static STATE_CREATE_NEW_AREA: string = "create";
  private static STATE_ADD_TO_AREA: string = "add";
  static compare = item => {
    return (obj1, obj2) => {
      const val1 = obj1[item];
      const val2 = obj2[item];
      if (val1 > val2) {
        return 1;
      } else if (val1 < val2) {
        return -1;
      } else {
        return 0;
      }
    };
  };
  private static TransFormLat = (lng, lat) => {
    let ret =
      -100.0 +
      2.0 * lng +
      3.0 * lat +
      0.2 * lat * lat +
      0.1 * lng * lat +
      0.2 * Math.sqrt(Math.abs(lng));
    ret +=
      ((20.0 * Math.sin(6.0 * lng * Math.PI) +
        20.0 * Math.sin(2.0 * lng * Math.PI)) *
        2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(lat * Math.PI) +
        40.0 * Math.sin((lat / 3.0) * Math.PI)) *
        2.0) /
      3.0;
    ret +=
      ((160.0 * Math.sin((lat / 12.0) * Math.PI) +
        320 * Math.sin((lat * Math.PI) / 30.0)) *
        2.0) /
      3.0;
    return ret;
  };
  private static TransFormLng = (lng, lat) => {
    let ret =
      300.0 +
      lng +
      2.0 * lat +
      0.1 * lng * lng +
      0.1 * lng * lat +
      0.1 * Math.sqrt(Math.abs(lng));
    ret +=
      ((20.0 * Math.sin(6.0 * lng * Math.PI) +
        20.0 * Math.sin(2.0 * lng * Math.PI)) *
        2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(lng * Math.PI) +
        40.0 * Math.sin((lng / 3.0) * Math.PI)) *
        2.0) /
      3.0;
    ret +=
      ((150.0 * Math.sin((lng / 12.0) * Math.PI) +
        300.0 * Math.sin((lng / 30.0) * Math.PI)) *
        2.0) /
      3.0;
    return ret;
  };
  static addMaps = (level, mapsUrl, isTrans, isMap = true) => {
    const { maps, vrPlanner } = Config;
    const MAX_X = 20037508.342789244;
    if (maps.getLayerById("maps")) {
      maps.removeLayer(maps.getLayerById("maps"));
    }
    console.log(isTrans);
    if (isTrans) {
      const url = Terrain.terrains[0].url;
      TerrainService.getData(url + "/layer_settings.json", (flag, res) => {
        if (flag) {
          const innerBounds = res.innerBounds;
          // EPSG:3875 to wgs84
          let lng = (innerBounds.center[0] / MAX_X) * 180;
          let lat = (innerBounds.center[1] / MAX_X) * 180;
          lat =
            (180 / Math.PI) *
            (2 * Math.atan(Math.exp((lat * Math.PI) / 180)) - Math.PI / 2);
          // wgs84 to gcj02
          if (
            !(lng < 72.004 || lng > 137.8347) ||
            (lat < 0.8293 || lat > 55.8271 || false)
          ) {
            const a = 6378245.0;
            const ee = 0.00669342162296594323;
            let dlat = Tools.TransFormLat(lng - 105.0, lat - 35.0);
            let dlng = Tools.TransFormLng(lng - 105.0, lat - 35.0);
            const radlat = (lat / 180.0) * Math.PI;
            let magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            const sqrtmagic = Math.sqrt(magic);
            dlat =
              (dlat * 180.0) /
              (((a * (1 - ee)) / (magic * sqrtmagic)) * Math.PI);
            dlng =
              (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * Math.PI);
            lat = lat + dlat;
            lng = lng + dlng;
          }
          // gcj02 to EPSG:3875
          lng = (lng * MAX_X) / 180;
          lat =
            Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
          lat = (lat * MAX_X) / 180;
          const deviationX = innerBounds.center[0] - lng;
          const deviationY = innerBounds.center[1] - lat;
          const settings = {
            side: MAX_X * 2,
            center: {
              x: deviationX,
              y: deviationY,
              z: 3
            },
            maxLevel: level
          };
          const layerSettings = new vrPlanner.Layer.LayerSettings(settings);
          const terrain = new vrPlanner.Layer.SlippyMapTerrainLayer(
            "maps",
            layerSettings,
            mapsUrl,
            vrPlanner.Layer.SlippyMap.Layout.GOOGLE
          );
          terrain.setLodWindowSize(512);
          terrain.setVisible(isMap);
          maps.addLayer(terrain, false);
        }
      });
    } else {
      const deviationX = 0;
      const deviationY = 0;
      const TIANDITU_VECTOR_INFO_LAYER_SETTINGS = {
        side: MAX_X * 2, // side length of layer
        center: { x: deviationX, y: deviationY, z: 3 }, // Center location of the SlippyMapTerrainLayer
        maxLevel: 18 // 19 is the most detailed level on the server
      };
      const tiandituVectorInfoLayerSettingsLayerSettings = new vrPlanner.Layer.LayerSettings(
        TIANDITU_VECTOR_INFO_LAYER_SETTINGS
      );
      const terrain = new vrPlanner.Layer.SlippyMapTerrainLayer(
        "maps",
        tiandituVectorInfoLayerSettingsLayerSettings,
        mapsUrl,
        vrPlanner.Layer.SlippyMap.Layout.GOOGLE
      );
      terrain.setLodWindowSize(400);
      maps.addLayer(terrain, false);
    }
  };
  static MonitorType(value) {
    switch (value) {
      case 1:
        return "枪型";
      case 2:
        return "球型";
      case 2:
        return "半球";
    }
  }
  static MonitorFactoryName(value) {
    switch (value) {
      case "1":
        return "海康";
      case "2":
        return "大华";
      case "3":
        return "其他";
    }
  }
  static MapType(value) {
    switch (value) {
      case 1:
        return "高德";
      case 2:
        return "谷歌";
      case 3:
        return "天地图";
    }
  }
  static MonitorPosition(value) {
    const MonitorPosition = [
      { title: "正北方向", value: "1" },
      { title: "东北方向", value: "2" },
      { title: "正东方向", value: "3" },
      { title: "东南方向", value: "4" },
      { title: "正南方向", value: "5" },
      { title: "西南方向", value: "6" },
      { title: "正西方向", value: "7" },
      { title: "西北方向", value: "8" }
    ];
    for (const item of MonitorPosition) {
      if (item.value === value) {
        return item.title;
      }
    }
  }

  static isPointInPolygonBoundary = (point, Points) => {
    for (let i = 0; i < Points.length; i++) {
      const p1 = Points[i];
      const p2 = Points[(i + 1) % Points.length];
      if (point.y() < Math.min(p1.y(), p2.y())) {
        continue;
      }
      if (point.y() > Math.max(p1.y(), p2.y())) {
        continue;
      }
      if (p1.y() === p2.y()) {
        const minX = Math.min(p1.x(), p2.x());
        const maxX = Math.max(p1.x(), p2.x());
        if (point.y() === p1.y() && (point.x() >= minX && point.x() <= maxX)) {
          return true;
        }
      } else {
        const x =
          ((point.y() - p1.y()) * (p2.x() - p1.x())) / (p2.y() - p1.y()) +
          p1.x();
        if (x === point.x()) {
          return true;
        }
      }
    }
    return false;
  };

  static isPolygonContainsPoint = (point, mPoints) => {
    let nCross = 0;
    for (let i = 0; i < mPoints.length; i++) {
      const p1 = mPoints[i];
      const p2 = mPoints[(i + 1) % mPoints.length];
      if (p1.y() === p2.y()) {
        continue;
      }
      if (point.y() < Math.min(p1.y(), p2.y())) {
        continue;
      }
      if (point.y() >= Math.max(p1.y(), p2.y())) {
        continue;
      }
      const x =
        ((point.y() - p1.y()) * (p2.x() - p1.x())) / (p2.y() - p1.y()) + p1.x();
      if (x > point.x()) {
        nCross++;
      }
    }
    return nCross % 2 === 1;
  };
  static Draw(feature, fn?) {
    const { maps, vrPlanner } = Config;
    let stateCurrent = Tools.STATE_CREATE_NEW_AREA;
    let line = new Line({ width: 2, depthTest: false });
    let firstClick = false;
    let lineLayer;
    let altitude;
    let pointArr: any = [];
    let polygon = new Polygon({});
    let polygonLayer;

    switch (feature.type) {
      case "line":
        line = feature.line;
        lineLayer = maps.getLayerById("lineLayer");
        if (!lineLayer) {
          lineLayer = new vrPlanner.Layer.FeatureLayer("lineLayer");
          maps.addLayer(lineLayer);
        }
        lineLayer.addFeature(line);
        break;
      case "animateline":
        line = feature.line;
        lineLayer = maps.getLayerById("animateLineLayer");
        if (!lineLayer) {
          lineLayer = new vrPlanner.Layer.FeatureLayer("animateLineLayer");
          maps.addLayer(lineLayer);
        }
        lineLayer.addFeature(line);
        break;
      case "push":
        polygon = new Polygon({ polygonStyle: "ProjectedFeatureStyle" });
        lineLayer = maps.getLayerById("auxiliary");
        if (!lineLayer) {
          lineLayer = new vrPlanner.Layer.FeatureLayer("auxiliary");
          maps.addLayer(lineLayer);
        }
        lineLayer.addFeature(line.line);
        polygonLayer = maps.getLayerById("polygonLayer");
        if (!polygonLayer) {
          polygonLayer = new vrPlanner.Layer.FeatureLayer("polygonLayer");
          maps.addLayer(polygonLayer);
        }
        polygonLayer.addFeature(polygon.polygon);
        break;
      case "area":
        lineLayer = maps.getLayerById("auxiliary");
        if (!lineLayer) {
          lineLayer = new vrPlanner.Layer.FeatureLayer("auxiliary");
          maps.addLayer(lineLayer);
        }
        lineLayer.addFeature(line.line);
        break;
      case "measurePolygon":
        lineLayer = maps.getLayerById("auxiliary");
        if (!lineLayer) {
          lineLayer = new vrPlanner.Layer.FeatureLayer("auxiliary");
          maps.addLayer(lineLayer);
        }
        lineLayer.addFeature(line.line);
        break;
    }

    maps.bindEvent("click", event => {
      const geo = event.getGeoLocation();
      switch (stateCurrent) {
        case Tools.STATE_CREATE_NEW_AREA:
          if (geo != null && event.isLeftClick()) {
            line.addVertex(geo);
            line.addVertex(geo);
            switch (feature.type) {
              case "push":
                const list = maps.getLayerList();
                for (const item of list) {
                  if (item.indexOf("terrain") >= 0) {
                    const terrain = maps.getLayerById(item);
                    const innerBounds = terrain.getInnerBounds();
                    const points: any = [];
                    if (innerBounds) {
                      points.push(
                        new vrPlanner.GeoLocation(
                          innerBounds[0],
                          innerBounds[1]
                        )
                      );
                      points.push(
                        new vrPlanner.GeoLocation(
                          innerBounds[2],
                          innerBounds[1]
                        )
                      );
                      points.push(
                        new vrPlanner.GeoLocation(
                          innerBounds[2],
                          innerBounds[3]
                        )
                      );
                      points.push(
                        new vrPlanner.GeoLocation(
                          innerBounds[0],
                          innerBounds[3]
                        )
                      );
                      if (
                        this.isPointInPolygonBoundary(geo, points) ||
                        this.isPolygonContainsPoint(geo, points)
                      ) {
                        altitude = terrain.getTranslation().z();
                      }
                    }
                  }
                }
                feature.addVertex(
                  geo.sub(new vrPlanner.Math.Double3(0, 0, altitude))
                );
                polygonLayer.addFeature(polygon.polygon);
                polygon.addVertex(geo);
                feature.setHeight(geo.z() - altitude);
                pointArr.push(
                  geo.sub(new vrPlanner.Math.Double3(0, 0, altitude))
                );
                break;
              case "area":
                feature.addVertex(geo);
                pointArr.push(geo);
                break;
              case "measurePolygon":
                feature.addVertex(geo);
                pointArr.push(geo);
                break;
              case "line":
                pointArr.push(geo);
                break;
              case "animateline":
                pointArr.push(geo);
                break;
            }
            maps.bindEvent("mousemove", mouseEvent => {
              if (!firstClick) {
                firstClick = true;
                maps.getGeoLocationAtScreenPos(
                  mouseEvent.getPageX(),
                  mouseEvent.getPageY(),
                  geoLocation => {
                    if (geoLocation.getGeoLocation()) {
                      line.setVertex(
                        line.getNumVertices() - 1,
                        geoLocation.getGeoLocation()
                      );
                    }
                    firstClick = false;
                  }
                );
              }
            });
            stateCurrent = Tools.STATE_ADD_TO_AREA;
          } else if (geo != null && event.isRightClick()) {
            switch (feature.type) {
              case "animateline":
                feature.line.clearVertices();
                fn(feature);
                break;
            }
          }
          break;
        case Tools.STATE_ADD_TO_AREA:
          if (geo != null) {
            if (event.isLeftClick()) {
              switch (feature.type) {
                case "push":
                  pointArr.push(
                    geo.sub(new vrPlanner.Math.Double3(0, 0, altitude))
                  );
                  feature.addVertex(
                    geo.sub(new vrPlanner.Math.Double3(0, 0, altitude))
                  );
                  polygon.addVertex(geo);
                  break;
                case "area":
                  pointArr.push(geo);
                  feature.addVertex(geo);
                  break;
                case "measurePolygon":
                  pointArr.push(geo);
                  feature.addVertex(geo);
                  break;
                case "line":
                  pointArr.push(geo);
                  break;
                case "animateline":
                  pointArr.push(geo);
                  break;
              }
              line.addVertex(geo);
              line.setVertex(line.getNumVertices() - 1, geo);
            } else if (feature.getNumVertices() >= 3) {
              feature.vertices = pointArr;
              if (feature.type !== "line") lineLayer.removeFeature(line.line);
              maps.unbindEvent("mousemove");
              maps.unbindEvent("click");
              if (fn) {
                fn(feature);
                switch (feature.type) {
                  case "line":
                    feature.tempVertices = pointArr;
                    feature.removeVertex();
                    break;
                  case "animateline":
                    feature.removeVertex(feature.getNumVertices());
                    break;
                }
              }
              stateCurrent = Tools.STATE_CREATE_NEW_AREA;
            } else if (feature.getNumVertices() <= 3) {
              if (fn) {
                fn(feature);
                switch (feature.type) {
                  case "animateline":
                    feature.line.clearVertices();
                    break;
                }
              }
            }
          }
          break;
      }
    });
  }

  static createId() {
    const i = () => {
      return Math.floor((1 + Math.random()) * 65536)
        .toString(16)
        .substring(1);
    };
    return i() + i();
  }

  static setNight(isNight: boolean | number, callback?: Function) {
    let sun = Config.maps.getSun();
    if (isNight) {
      // sun.setDateTime(2020, 6, 27, 23, 10, 0);
      sun.setAmbientLight(new vrPlanner.Color("#070707"));
      sun.setDiffuseLight(new vrPlanner.Color("#000000"));
    } else {
      sun.setDiffuseLight(new vrPlanner.Color("#7f7f7f"));
      sun.setAmbientLight(new vrPlanner.Color("#7f7f7f"));
    }
    callback && callback(sun);
  }

  static setPPTDayNight(opt: 0 | 1 | 2 | 3) {
    let pOption;
    if (opt > 1) {
      opt -= 2;
      pOption = {
        type: "DeferredPipeline",
        quality: vrPlanner.Pipeline.QUALITY_HIGH
      };
    }
    Tools.setPipeline(pOption);
    Tools.setNight(opt);
  }

  static setPipeline(option: any = {}) {
    const defaultOption = {
      type: "DefaultPipeline",
      quality: vrPlanner.Pipeline.QUALITY_MEDIUM,
      effects: [{ type: "ShadowOpacityEffect", opacity: 0.5 }]
    };
    option = {
      ...defaultOption,
      ...option
    };
    let pipeline = maps.getRenderingPipeline();
    if (pipeline.toJson().type != option.type) {
      pipeline = new vrPlanner.Pipeline[option.type].create(option.quality);
    }

    let soe = pipeline.getEffect("ShadowOpacityEffect");
    if (!soe && option.type != "DefaultPipeline") {
      soe = new vrPlanner.Effect.ShadowOpacityEffect();
      pipeline.addEffect(soe);
    }
    if (soe) {
      let soeOpt = option.effects.find(e => e.type == "ShadowOpacityEffect");
      if (soeOpt) soe.setOpacity(soeOpt.opacity);
    }

    maps.setRenderingPipeline(pipeline);
    return pipeline;
  }

  static get shadowOpacityEffect() {
    return maps.getRenderingPipeline().getEffect("ShadowOpacityEffect");
  }

  static setShadowOpacity = opacity => {
    let soe = Tools.shadowOpacityEffect;
    if (!soe) {
      Tools.setPipeline({
        type: "DeferredPipeline",
        quality: vrPlanner.Pipeline.QUALITY_HIGH,
        effects: [{ type: "ShadowOpacityEffect", opacity }]
      });
      return;
    }
    soe.setOpacity(opacity);
  };

  static getSun() {
    let sun = maps.getSun();
    if (!("setDateTime" in sun)) {
      const geo = maps.getCamera().getPosition();
      const { lon, lat } = TransCoordinate.MercatorToWGS84(geo);
      sun = new vrPlanner.SunRT(lon, lat, Math.round(lon / 15));
      maps.setSun(sun);
    }
    return sun;
  }
  // time: Date | h,m | h,m,s | y,m,d,h,m | y,m,d,h,m,s
  static setSun(...time) {
    (time.length == 5 || time.length == 2) && time.push(0);
    const sun = Tools.getSun();
    let d = new Date(),
      dArr = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
    if (time.length == 6 || time.length == 1) {
      sun.setDateTime(...time);
    } else if (time.length == 3) {
      sun.setDateTime(...dArr, ...time);
    } else if (!time.length) {
      sun.setDateTime(...dArr, 12, 0, 0);
      sun.timer && clearTimeout(sun.timer);
    }
  }

  static async simulateSun([startMin, endMin = 1440]) {
    const sun = Tools.getSun();
    const dt = new Date(),
      y = dt.getFullYear(),
      m = dt.getMonth() + 1,
      d = dt.getDate();
    const flr = Math.floor;
    Tools.setSun(y, m, d, flr(startMin / 60), flr(startMin % 60));
    if (endMin - startMin) {
      for (let mins = startMin + 1; mins < endMin; mins++) {
        await new Promise((resolve, reject) => {
          sun.timer = setTimeout(() => {
            Tools.setSun(y, m, d, flr(mins / 60), flr(mins % 60));
            resolve();
          }, 100);
        });
      }
    }
  }
}
