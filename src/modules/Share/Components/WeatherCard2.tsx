import { CSSProperties, useState, useEffect } from "react";
import CardLayout from "./CardLayout";
import AvatarFlexCard2 from "./AvatarFlexCard2";

const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");
let vh = px => (px / 1080) * 100 + "vh";
const weatherIcons = {
  云: `${process.env.publicPath}images/drinkingWaterProtection/tianqi-yun.png`,
  阴: `${process.env.publicPath}images/drinkingWaterProtection/tianqi-yin.png`,
  雨: `${process.env.publicPath}images/drinkingWaterProtection/tianqi-yu.png`,
  雷: `${process.env.publicPath}images/drinkingWaterProtection/tianqi-lei.png`
};
interface WeatherCardProps {
  title?: string;
  enTitle?: string; //"Weather forecast"
  address?: string;
  setWeatherData?: (data: Array<any>) => void;
  style?: CSSProperties;
  className?: string;
}

export default function WeatherCard2({
  title,
  enTitle,
  address = "丽水",
  style = undefined,
  setWeatherData,
  className = ""
}: WeatherCardProps) {
  const [weaData, setWeaData] = useState(null);
  const [data, setData] = useState(null);
  const [clickOdd, setClickOdd] = useState(false);
  useEffect(
    () => {
      fetchWeather();
      setInterval(() => {
        fetchWeather();
      }, 1000 * 60 * 30);
    },
    [address]
  );
  const fetchWeather = () => {
    const addr = address.includes("市") ? address.replace("市", "") : address;
    fetch(
      "https://www.tianqiapi.com/api/?version=v1&city=" +
        addr +
        "&appid=52329359&appsecret=iSWTX5pP"
    )
      .then(res => res.json())
      .then(res => {
        const data = res.data.slice(1, 5).map((item, i) => ({
          city: res.city,
          day: item.day.slice(0, 2),
          date: item.date,
          wea: item.wea,
          air: item.air,
          air_level: item.air_level,
          hours: item.hours,
          tem: item.tem.replace("℃", ""),
          maxTem: item.tem1,
          minTem: item.tem2,
          humidity: item.humidity,
          win: item.win[0],
          week: item.week,
          icon: (() => {
            let url =
              weatherIcons[
                Object.keys(weatherIcons).find(
                  key => item.wea.lastIndexOf(key) > -1
                )!
              ];
            return Array.isArray(url) ? (i ? url[0] : url[1]) : url;
          })(),
          icon1: weatherIcons["雨"][2]
        }));
        const data2 = {
          week: res.data[0].week,
          day: res.data[0].day,
          data: [
            {
              name: "温度(℃)",
              value: res.data[0].tem.replace("℃", ""),
              avatar: `${
                process.env.publicPath
              }images/drinkingWaterProtection/icon_sun.png`
            },
            {
              name: "湿度(%)",
              value: res.data[0].humidity,
              avatar: `${
                process.env.publicPath
              }images/drinkingWaterProtection/icon_shidu.png`
            },
            {
              name: "pm2.5",
              value: res.data[0].air,
              avatar: `${
                process.env.publicPath
              }images/drinkingWaterProtection/icon_pm.png`
            },
            {
              name: "风向",
              value: res.data[0].win[0],
              avatar: `${
                process.env.publicPath
              }images/drinkingWaterProtection/icon_fengxiang.png`
            }
          ]
        };
        setData(data2);
        setWeaData(data);
        setWeatherData && setWeatherData(data);
      });
  };
  // const date = moment(new Date()).format("YYYY-MM-DD");
  const onClick = e => {
    setClickOdd(!clickOdd);
  };
  return (
    <CardLayout
      title={
        <div className={scss["flex-between"]}>
          <div>{title || "天气预报"}</div>
          <div>
            <img src={require("../../../assets/weizhi.png")} alt={address} />
            <span>{address}</span>
          </div>
        </div>
      }
      enTitle={enTitle}
      style={style}
      className={scss["weather-card"] + " pe-auto " + className}
    >
      {data && data != null ? <AvatarFlexCard2 data={data} /> : null}
      <div className={scss["flex"]} style={{ margin: "0 0 7px 0" }}>
        {weaData &&
          weaData.map((item, i) => {
            return (
              <div className={scss["futureItem"]} key={i + 1}>
                <div className={scss["icon"]}>
                  <img src={item.icon} onClick={onClick} />
                  <div>
                    <div>{item.maxTem}</div>
                    <div>{item.minTem}</div>
                  </div>
                </div>
                <div className={scss["day"]}>
                  {item.week} <span>({item.day})</span>
                </div>
              </div>
            );
          })}
      </div>
    </CardLayout>
  );
}
