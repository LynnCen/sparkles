import { message } from "antd";
import Config from "../../config/Config";
import MapService from "../../services/MapService";
import { loadScript } from "../../utils/common";

const X_PI = 3.14159265358979324 * 3000.0 / 180.0;
const PI = 3.1415926535897932384626;
const R = 6378245.0;
const E = 0.00669342162296594323;

export default class TransCoordinate {
  /**
   * 墨卡托坐标转84坐标
   * @param geo 坐标（vrplanner.GeoLocation()）
   */
  public static MercatorToWGS84(geo) {
    const lon = geo.x() / 20037508.34 * 180;
    let lat = geo.y() / 20037508.34 * 180;
    lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
    return {
      lon,
      lat,
      alt: geo.z()
    };
  }

  /**
   * 84坐标转墨卡托坐标
   * @param geo{x,y,z} 坐标（vrplanner.GeoLocation()）
   */
  public static WGS84ToMercator(geo) {
    const lon = Number(geo.x) * 20037508.34 / 180;
    let lat = Math.log(Math.tan((90 + Number(geo.y)) * Math.PI / 360)) / (Math.PI / 180);
    lat = lat * 20037508.34 / 180;

    return new Config.vrPlanner.GeoLocation(lon, lat, Number(geo.z || 0));
  }

  /**
   * @description 获取中心点坐标
   * @param FirstGeo 首点坐标（vrplanner.GeoLocation()）
   * @param EndGeo 次点坐标（vrplanner.GeoLocation()）
   */
  public static getMidPoint(FirstGeo, EndGeo) {
    return new Config.vrPlanner.GeoLocation((FirstGeo.getLongitude() + EndGeo.getLongitude()) / 2, (FirstGeo.getLatitude() + EndGeo.getLatitude()) / 2, (FirstGeo.getAltitude() + EndGeo.getAltitude()) / 2);
  }

  /**
   * @description 两点间距离计算
   * @param FirstGeo 首点坐标（vrplanner.GeoLocation()）
   * @param EndGeo 次点坐标（vrplanner.GeoLocation()）
   */
  public static getDistance(FirstGeo, EndGeo) {
    FirstGeo = this.MercatorToWGS84(FirstGeo);
    EndGeo = this.MercatorToWGS84(EndGeo);
    const R = 6371e3;
    const φ1 = FirstGeo.lat * Math.PI / 180;
    const φ2 = EndGeo.lat * Math.PI / 180;
    const Δφ = (EndGeo.lat - FirstGeo.lat) * Math.PI / 180;
    const Δλ = (EndGeo.lon - FirstGeo.lon) * Math.PI / 180;

    let a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    a = R * c;
    const b = Math.abs(FirstGeo.alt - EndGeo.alt);
    c = Math.sqrt(a * a + b * b);
    return { a, b, c };
  };

  /**
   * @description 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
   * 即 百度 转 谷歌、高德
   * @param lon
   * @param lat
   */
  public static bd09togcj02(lon, lat) {
    const x = lon - 0.0065;
    const y = lat - 0.006;
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
    const gg_lng = z * Math.cos(theta);
    const gg_lat = z * Math.sin(theta);
    return [gg_lng, gg_lat]
  }

  /**
   * @description  火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
   * 即谷歌、高德 转 百度
   * @param lng
   * @param lat
   */
  public static gcj02tobd09(lng, lat) {
    const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * X_PI);
    const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * X_PI);
    const bd_lng = z * Math.cos(theta) + 0.0065;
    const bd_lat = z * Math.sin(theta) + 0.006;
    return [bd_lng, bd_lat]
  }


  /**
   * @description WGS84转GCj02
   * @param lng
   * @param lat
   */

  public static wgs84togcj02(lng, lat) {
    if (TransCoordinate.out_of_china(lng, lat)) {
      return [lng, lat]
    }
    else {
      let dlat = TransCoordinate.transformlat(lng - 105.0, lat - 35.0);
      let dlng = TransCoordinate.transformlng(lng - 105.0, lat - 35.0);
      const radlat = lat / 180.0 * PI;
      let magic = Math.sin(radlat);
      magic = 1 - E * magic * magic;
      const sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / ((R * (1 - E)) / (magic * sqrtmagic) * PI);
      dlng = (dlng * 180.0) / (R / sqrtmagic * Math.cos(radlat) * PI);
      const mglat = lat + dlat;
      const mglng = lng + dlng;
      return [mglng, mglat]
    }
  }

  /**
   * @description GCj02 转 WGS84
   * @param lng
   * @param lat
   */
  public static gcj02towgs84(lng, lat) {
    if (TransCoordinate.out_of_china(lng, lat)) {
      return [lng, lat]
    }
    else {
      let dlat = TransCoordinate.transformlat(lng - 105.0, lat - 35.0);
      let dlng = TransCoordinate.transformlng(lng - 105.0, lat - 35.0);
      const radlat = lat / 180.0 * PI;
      let magic = Math.sin(radlat);
      magic = 1 - E * magic * magic;
      const sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / ((R * (1 - E)) / (magic * sqrtmagic) * PI);
      dlng = (dlng * 180.0) / (R / sqrtmagic * Math.cos(radlat) * PI);
      const mglat = lat + dlat;
      const mglng = lng + dlng;
      return [lng * 2 - mglng, lat * 2 - mglat]
    }
  }


  private static transformlat(lng, lat) {
    let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
    return ret
  }

  private static transformlng(lng, lat) {
    let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
    return ret
  }

  /**
   * @description 判断是否在国内，不在国内则不做偏移
   * @param lng
   * @param lat
   */
  private static out_of_china(lng, lat) {
    return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
  }

  /**
   * @description 获取当前视觉范围的城市信息
   */
  public static getLocation(data, content: (addressComponent) => void) {
    MapService.getLocal(data, Config.regeoHost, (success, res) => {
      if (success) {
        content(res.regeocode.addressComponent)
      } else {
        message.error(res.info)
      }
    });
  }

  /**@description 根据输入的信息获取经纬度
   * @param city 当前城市
   * @param keywords 输入的地址
   * @param {(pois) => void} callback
   */
  static getGeoLocation(city, keywords, callback: (pois) => void) {
    MapService.getLocal({
      keywords,
      city,
      offset: 5
    }, Config.textHost, (success, res) => {
      if (success) {
        callback(res.pois);
      } else {
        message.error(res.info)
      }
    });
  }

  static searchNear(location, callback: (pois) => void) {
    MapService.getLocal({
      location,
      radius: 100,
      types: "050000|060000|120000|990000"
    }, Config.aroundHost, (success, res) => {
      if (success) {
        callback(res.pois);
      }
      else {
        message.error(res.info)
      }
    });
  }

  public static getUnitVector(startGeo, endGeo) {
    const o = startGeo.asDouble3();
    const t = endGeo.asDouble3();
    const vector = t.sub(o);
    const dis = vector.magnitude();
    const unit = vector.div(dis);
    return { dis, unit };
  }

}

