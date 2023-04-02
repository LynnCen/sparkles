import { CSSProperties, useState, useEffect } from "react";
import CardLayout from "./CardLayout";

const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");
let vh = px => (px / 1080) * 100 + "vh";
const weatherIcons = {
  晴: `${process.env.publicPath}images/tianqi-qing1.png`,
  云: `${process.env.publicPath}images/tianqi-yun1.png`,
  阴: [
    `${process.env.publicPath}images/tianqi-yin0.png`,
    `${process.env.publicPath}images/tianqi-yin1.png`
  ],
  雨: [
    `${process.env.publicPath}images/tianqi-yu0.png`,
    `${process.env.publicPath}images/tianqi-yu1.png`,
    `${process.env.publicPath}images/tianqi-yu2.png`
  ]
};
interface WeatherCardProps {
  title?: string;
  enTitle?: string; //"Weather forecast"
  address?: string;
  setWeatherData?: (data: Array<any>) => void;
  style?: CSSProperties;
  className?: string;
}

export default function WeatherCard({
  title,
  enTitle,
  address = "丽水",
  style = undefined,
  setWeatherData,
  className = ""
}: WeatherCardProps) {
  const [weaData, setWeaData] = useState(null);
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
        const data = res.data.slice(0, 4).map((item, i) => ({
          city: res.city,
          day: item.day.replace(/(\d+.)（(.*)）/, (a, b, c) => c + "-" + b),
          date: item.date,
          wea: item.wea,
          air: item.air,
          air_level: item.air_level,
          hours: item.hours,
          tem12: `${item.tem2}~${item.tem1}`,
          tem: item.tem.replace("℃", ""),
          humidity: item.humidity,
          win: item.win[0],
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
      <div className={scss["flex"]} style={{ margin: "0 -16px 7px 0" }}>
        {weaData && (
          <div className={scss["current"] + " " + scss["item"]}>
            <h4>{weaData[0].day}</h4>
            {/* <div className={scss["icon"]}>
              <img src={weaData[0].icon} alt="" />
            </div> */}
            <div
              className={css["flex"]}
              style={{ marginTop: vh(30), width: "100px" }}
            >
              <div>
                <div className={scss["wea"]}>
                  <span>{weaData[0].tem}°</span>
                </div>
                <div className={scss["air-level"]}>
                  {weaData[0].air} {weaData[0].air_level}
                </div>
              </div>
              <h4 style={{ margin: "-5px 0 0 -5px" }}>{weaData[0].wea}</h4>
            </div>
            {/* <div className={scss["wea"]}>
              <span>{weaData[0].tem}°</span>
              <h4>{weaData[0].wea}</h4>
            </div>
            <div className={scss["air-level"]}>
              {weaData[0].air} {weaData[0].air_level}
            </div> */}
          </div>
        )}
        {weaData &&
          weaData.slice(1).map((item, i) => {
            return (
              <div className={scss["item"]} key={i + 1}>
                <h4>{item.day}</h4>
                <div className={scss["icon"]}>
                  <img
                    src={item[`icon${i == 0 && clickOdd ? "1" : ""}`]}
                    onClick={onClick}
                  />
                </div>
                <div
                  className={scss["wea"]}
                  style={{ color: i == 0 && clickOdd ? "red" : "#fff" }}
                >
                  <h4
                    className={scss["ellipsis"]}
                    title={item.wea}
                    style={{ color: i == 0 && clickOdd ? "red" : "#fff" }}
                  >
                    {i == 0 && clickOdd ? "暴雨 72(mm)" : item.wea}
                  </h4>
                  <h4 style={{ color: i == 0 && clickOdd ? "red" : "#fff" }}>
                    {item.tem12}
                  </h4>
                </div>
              </div>
            );
          })}
      </div>
    </CardLayout>
  );
}
