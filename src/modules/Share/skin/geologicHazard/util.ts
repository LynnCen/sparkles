import { message } from "antd";
import TransCoordinate from "../../../../components/tools/Coordinate";
import Handle, { transition } from "../../../../components/tools/Handle";
import Config from "../../../../config/Config";
import moment from "moment";
import { hikItemClick } from ".";
import Mark from "../../../../components/model/Mark";
import ModelBase from "../../../../components/model/ModelBase";
import Model from "../../../../components/model/Model";
import Point from "../../../../components/model/Point";
import SimpleAnimation from "../../../../components/model/SimpleAnimation";
const { vrPlanner, maps } = Config;
const template = "geologicHazard";

const layerConfig = {
  type: 1,
  title: "",
  shadeClose: true,
  shade: false,
  maxmin: true, //开启最大化最小化按钮
  area: ["60%", "30%"],
  skin: "", //样式类名
  content: ""
};

export const openLayer = ({ ...options }) =>
  self["layer"].open({
    ...layerConfig,
    ...options,
    success: (a, i) => {
      console.log(a, i);
    }
  });

export const genBalloon = (
  { id, longitude, latitude, event = { click: false, hover: true }, ...rest },
  changeCamera = false,
  hide = true
): Mark => {
  if (!self["__Mark"]) self["__Mark"] = Mark;
  let geo = TransCoordinate.WGS84ToMercator({
    x: longitude,
    y: latitude,
    z: 0
  });
  let mark = new Mark({
    id,
    geo,
    fontColor: event.hover ? "#000" : "white",
    titleVisible: !event.hover,
    height: 20,
    className: event.hover ? "ant-popover-placement-top tip" : "",
    altitudeMode: vrPlanner.Feature.ALTITUDE_MODE_RELATIVE_TO_GROUND,
    ...rest
  });
  let layer =
    maps.getLayerById("balloonLayer") ||
    new vrPlanner.Layer.FeatureLayer("balloonLayer");
  maps.addLayer(layer);
  layer.addFeature(mark.point);
  mark.point.getStyle().setAutoScaleEnd(5000000);
  mark.renderBalloon(event);
  if (event.hover) {
    mark.point.bindEvent("mouseenter", () =>
      mark.setIcon({ ...mark, titleVisible: true })
    );
    mark.point.bindEvent("mouseleave", () =>
      mark.setIcon({ ...mark, titleVisible: false })
    );
  }
  Mark.set(mark);
  if (changeCamera) {
    focus(mark, hide);
  }
  return mark;
};

const genModel = ({ longitude, latitude, ...rest }): ModelBase => {
  if (!self["__Model"]) self["__Model"] = Model;
  if (!self["__Point"]) self["__Point"] = Point;
  let geo = TransCoordinate.WGS84ToMercator({
    x: longitude,
    y: latitude,
    z: 0
  });
  let model = new Model({
    geo,
    scale: [0.3, 0.3, 1],
    altitudeMode: vrPlanner.Feature.ALTITUDE_MODE_RELATIVE_TO_GROUND,
    ...rest
  });
  let layer =
    maps.getLayerById("buildLayer") ||
    new vrPlanner.Layer.FeatureLayer("buildLayer");
  maps.addLayer(layer);
  layer.addFeature(model.point);
  Model.set(model);
  model.setVisible(true);
  return model;
};

export const focus = (mark, hide = true) => {
  Handle.stopCamera();
  const config = self[template];
  const timeTrans = new vrPlanner.Transition(
    config.fly.time,
    vrPlanner.Interpolation.CubicBezier.EASE
  );
  const pos = new vrPlanner.GeoLocation(...config.fly.position);
  const look = new vrPlanner.GeoLocation(...config.fly.lookAt);
  maps.getCamera().flyTo(pos, look, true, timeTrans);
  setTimeout(() => {
    mark.setVisible(true);
    mark.focus();
    hide &&
      setTimeout(() => {
        mark.setVisible(false);
      }, (config.fly.time + 2) * 1000);
  }, config.fly.time * 1000);
};

export const getWeather = (addr, callback = getWeatherCallback) => {
  const c = self[template];
  const n = process.env.NODE_ENV == "development" ? "" : 1;
  return fetch(
    `https://www.tianqiapi.com/api/?version=${
      c.tianqiapi.version
    }&city=${addr.replace(/区|市|县/, "")}&appid=${
      c.tianqiapi["appid" + n]
    }&appsecret=${c.tianqiapi["appsecret" + n]}`
  )
    .then(res => res.json())
    .then(res => {
      callback(res.data);
      return;
    })
    .catch(message.error);
};

export const getWeatherCallback = data => {
  self[template].atmosphere.data.forEach(e => {
    if (typeof e.key == "string") {
      e.value = data[0][e.key];
      if (typeof e.value == "string") {
        e.value = e.value.replace("℃", "");
        if (e.key == "win_speed") {
          e.value = e.value.slice(0, e.value.indexOf("级"));
        }
      }
    } else if (Array.isArray(e.key)) {
      e.value = data[0][e.key[0]];
      e.unit = data[0][e.key[1]];
    }
    if (e.key == "wea") {
      let k = Object.keys(self[template].atmosphere.icons).find(
        key =>
          data[0]["wea"].lastIndexOf(key) > -1 ||
          key.lastIndexOf(data[0]["wea"]) > -1
      );
      e.avatar = k ? self[template].atmosphere.icons[k] : "";
    }
  });
};

export const areaParams = () => {
  const isCity =
    self[template].region.includes("市") && self[template].region !== "龙泉市";
  const isCounty =
    self[template].town.includes("全") || self[template].town == "";
  return `areaName=${
    isCounty ? self[template].region : self[template].town
  }&areaType=${isCity ? 1 : isCounty ? 2 : 3}`;
};

export const getArea = (callback = () => null) => {
  return fetch(`${process.env.disasterAPI}/area/get_info?${areaParams()}`)
    .then(r => r.json())
    .then(r => {
      getDisasterCallback(r.data);
      callback();
      return r;
    })
    .catch(message.error);
};

export const getDisasterSiteSort = () => {
  return fetch(`${process.env.disasterAPI}/disaster_site/list_sort`)
    .then(r => r.json())
    .then(r => {
      self[template].countyDisaster.data = r.data.countyDisasterVOList;
      return r;
    })
    .catch(message.error);
};

export const getControlObject = (type = 1) => {
  return fetch(
    `${
      process.env.disasterAPI
    }/area/list_control_object?${areaParams()}&controlObjectType=${type}`
  )
    .then(r => r.json())
    .catch(message.error);
};

export const getDisaster = () => {
  return fetch(
    `${process.env.disasterAPI}/disaster_site/get_by_unique_id?uniqueId=${
      self[template].uniqueId
    }`
  )
    .then(r => r.json())
    .catch(message.error);
};

export const getLc = (isHazard = false) => {
  const path = isHazard
    ? `list_by_unique_id?uniqueId=${self[template].uniqueId}`
    : `list_by_area?${areaParams()}`;
  return fetch(`${process.env.disasterAPI}/lc_monitor/${path}`)
    .then(r => r.json())
    .then(r => {
      self[template].video.lc = r.data.filter(Boolean).map((e, i) => {
        let j = e.cameraName.indexOf("乡");
        j < 0 && (j = e.cameraName.indexOf("镇"));
        j < 0 && (j = e.cameraName.indexOf("街道") + 1);
        return {
          ...e,
          name:
            j > 0
              ? `${e.cameraName.slice(
                  j + 1,
                  e.cameraName.indexOf("村") + 1
                )} (${e.cameraName.slice(0, j + 1)})`
              : e.cameraName
        };
      });
      return;
    })
    .catch(message.error);
};

export const getHik = () => {
  const c = self[template];
  const isCity = c.region.includes("市");
  return fetch(
    `${process.env.disasterAPI}/hik_monitor/list_by_county?county=${
      isCity ? "市" : c.region.replace(/区|市|县/, "")
    }`
  )
    .then(r => r.json())
    .then(r => {
      c.video.hik = r.data.list.map((e, i) => ({
        ...e,
        name: e.cameraName
      }));
      if (!timer) {
        getHikInfo();
        clearInterval(timer);
        timer = setInterval(getHikInfo, 5000);
      }
      return;
    })
    .catch(message.error);
};
let timer;
export const getHikInfo = () => {
  const c = self[template];
  c.video.hik.forEach((e, i) => {
    fetch(
      `${process.env.disasterAPI}/hik_monitor/get_info?cameraIndexCode=${
        e.cameraIndexCode
      }`
    )
      .then(r => r.json())
      .then(async res => {
        let { longitude, latitude } = res.data.location || {};
        if (res.data.online) {
          if (!longitude && process.env.NODE_ENV != "production") {
            longitude = c.video.testLoc.longitude;
            latitude = c.video.testLoc.latitude;
          }
          let mark = Mark.getById(e.cameraIndexCode);
          let model = Model.getById(e.cameraIndexCode);
          let animation = SimpleAnimation.animations.find(
            a => a.id == e.cameraIndexCode
          );
          if (longitude && latitude) {
            if (!mark) {
              mark = genBalloon({
                id: e.cameraIndexCode,
                longitude,
                latitude,
                title: e.cameraName,
                icon: c.icon["hik"],
                event: {
                  click: () =>
                    hikItemClick({ cameraIndexCode: e.cameraIndexCode })
                }
              });
              model = genModel({
                id: e.cameraIndexCode,
                longitude,
                latitude,
                url: c.model["hik"]
              });
              let features = [mark.point, mark.line, model.point];
              let points = [mark.geo, mark.geo].map(e => e.asDouble3());
              let keyframes = [0, 0.5, 1.0].map(
                e =>
                  new vrPlanner.Animation.Keyframe({
                    // offset: e,
                    position: e
                  })
              );
              animation = new SimpleAnimation({
                id: e.cameraIndexCode,
                features,
                keyframes,
                points
              });
            } else {
              if (process.env.NODE_ENV != "production") {
                longitude = c.video.testLoc.longitude + Math.random() * 0.0005;
                latitude = c.video.testLoc.latitude + Math.random() * 0.0006;
              }
              let newGeo = TransCoordinate.WGS84ToMercator({
                x: longitude,
                y: latitude,
                z: 0
              });
              if (animation && newGeo.distance(mark.geo) > 0) {
                // mark.setGeoLocation(newGeo);
                let pts = animation.points;
                pts.push(newGeo.asDouble3());
                pts.shift();
                animation.setPoints(pts);
                animation.play();
                if (animation.getPlayState() == "idle") {
                  animation.unbindEvent("animationUpdated");
                  animation.bindEvent("animationUpdated", e => {
                    let g = mark.point.getGeoLocation();
                    mark.setGeoLocation(
                      new vrPlanner.GeoLocation(g.x(), g.y(), 0),
                      3
                    );
                  });
                }
              }
            }
          }
        }
        e.status = res.data.online;
      })
      .catch(message.error);
  });
};

export const getDeviceStatus = (deviceId, second = 2) => {
  const config = self[template];
  const t = setInterval(() => {
    let date = new Date();
    fetch(
      `${
        process.env.disasterAPI
      }/device_status_push/list_by_recent_second?deviceId=${deviceId}&second=${second}&t=${date.getMinutes()}-${date.getSeconds()}`
    )
      .then(r => r.json())
      .then(r => {
        if (r.data.length) {
          let d = config.forecastEquipmentVOList.data.find(
            e => e.deviceId == deviceId
          );
          let status = moment(r.data[0].startTime)
            .add("s", r.data[0].duration + 1)
            .isSameOrAfter(moment())
            ? 2
            : 1;
          if (d.status != status) {
            d.status = status;
            let m = Mark.getById("forecastEquipment" + deviceId);
            if (m) {
              m.setIcon({
                icon: self[template].icon[d.type][status]
              });
              setTimeout(() => {
                m.setIcon({
                  icon: self[template].icon[d.type][1]
                });
              }, (r.data[0].duration + 1) * 1000);
            }
          }
        }
      })
      .catch(message.error);
  }, 1000);
};

export const getDisasterCallback = async data => {
  const config = self[template];
  //防治点
  ["overview", "data"].forEach(k => {
    config.disaster[k].forEach(
      e => e.key in data && ((e.value = data[e.key]), (e.count = data[e.key]))
    );
  });
  //承灾情况
  config.situation.data.forEach(e => e.key in data && (e.value = data[e.key]));
  //设备类别 预警设备 风险类别
  [
    "sensorCountVOList",
    "forecastEquipmentVOList",
    "riskVOList",
    "sensorVOList"
  ].forEach(k => {
    config[k].data = data[k] || [];
    for (let key in config[k].overview) {
      config[k].overview[key].value = 0;
    }
    config[k].data.forEach(e => {
      if (config[k].overview[e.type]) {
        config[k].overview[e.type].value++;
        "status" in e && (config[k].overview[e.type].status = e.status);
      } else {
        config[k].overview[e.type] = {
          name: e.type,
          value: 1,
          status: 0
        };
      }
    });
  });
  //设备类别
  ["sensorCountVOList", "sensorVOList"].forEach(k => {
    config[k].overview = {
      ...config[k].overview,
      ...JSON.parse(JSON.stringify(config["forecastEquipmentVOList"].overview))
    };
  });
  //物资 责任人
  ["suppliesLibraryVOList", "headVO"].forEach(k => {
    config[k].data = data[k]
      ? (Array.isArray(data[k]) ? data[k] : [data[k]]).map((e, i) => {
          return {
            ...config[k].sample,
            ...e
          };
        })
      : [];
  });
  //告警信息
  config.alarm.data = (data.warningRecordVOList || []).reverse().map(e => ({
    ...config.alarm.sample,
    ...e,
    warnType:
      typeof e.warnType == "string" && e.warnType.replace(/(\(.*\))/, ""),
    location: e.location.slice(e.location.lastIndexOf("-") + 1),
    warnTime: new Date(e.warnTime).toLocaleDateString()
  }));
  // config.alarm.data.forEach(e => {
  //   let mark = Mark.getById("sensor" + e.sensorId);
  //   if (!mark) {
  //     mark = genBalloon(
  //       {
  //         id: "sensor" + e.sensorId,
  //         ...e,
  //         title: e.sensorName,
  //         titleVisible: false,
  //         icon: self[template].icon[e.sensorType],
  //         // whethshare: true,
  //         event: {}
  //       },
  //       false
  //     );
  //   }
  // });
  !config.alarm.data.length && (config.alarm.data = config.alarm.empty);
  //基本信息
  config.pointInfo.data.forEach(e => {
    if (e.key && data[e.key] != undefined && data[e.key] != null) {
      e.value =
        e.key == "addressDetails"
          ? data[e.key].slice(data[e.key].lastIndexOf("-") + 1)
          : data[e.key];
    } else if (Array.isArray(e.value)) {
      e.value.forEach(v => {
        if (v.key && data[v.key] != undefined && data[v.key] != null) {
          v.value = data[v.key];
        }
      });
    }
  });
};

export const clearData = () => {
  ["suppliesLibraryVOList", "alarm", "headVO", "sensorVOList"].forEach(
    k => (self[template][k].data = [])
  );
  self[template].pointInfo.data.find(
    e => e.key == "synopsis" && (e.value = [])
  );
  self[template].video.lc = [];
};

export const onTableRow = record => ({
  onClick: e => {
    let m = Mark.getById("sensor" + record.sensorId);
    if (!m) {
      m = genBalloon(
        {
          id: "sensor" + record.sensorId,
          ...record,
          title: record.sensorName,
          visible: true,
          icon: self[template].icon[record.sensorType],
          event: {}
        },
        true,
        false
      );
    } else focus(m, false);
  }, // 点击行
  onMouseEnter: e => e, // 鼠标移入行
  onMouseLeave: e => e,
  style: { background: self[template].alarm.colors[record.warnLevel] }
});
