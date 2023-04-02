import { useEffect, useState, useRef } from "react";
import { Drawer, Spin } from "antd";
import AvatarCardY from "../../Components/AvatarCardY";
import CardLayout from "../../Components/CardLayout";
import MonitorCard from "../../Components/MonitorCard";
import List from "../../Components/List";
import { feature } from "../../Components/Header";
import { loadScript } from "../../../../utils/common";

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  visible: boolean;
  address: string;
}
export default function AtmosphereSkin({ visible, address }: Props) {
  const m = window["__esModule__atmosphere"] || {};
  const c = useRef(m.config);
  const [air_tips, setAirTips] = useState("");
  useEffect(() => {
    if (!m.config) {
      loadScript(
        `${process.env.publicPath}js/share/ecology/atmosphere.js`,
        "atmosphere",
        "module"
      )
        .then(({ config }) => {
          c.current = config;
          fetchWeather("丽水");
        })
        .catch(console.error);
    } else fetchWeather("丽水");
  }, []);
  const fetchWeather = addr => {
    fetch(
      "https://www.tianqiapi.com/api/?version=v1&city=" +
        addr +
        "&appid=52329359&appsecret=iSWTX5pP"
    )
      .then(res => res.json())
      .then(res => {
        const data = res.data[0];
        const win_arr = /(\d-?\d?)?级到?(\d-\d)?/
          .exec(data.win_speed)!
          .filter(e => e);
        console.log(win_arr);
        c.current.leftMenu[0].value = `${data.tem2}-${data.tem1}`;
        c.current.leftMenu[1].value = data.humidity + "%";
        c.current.leftMenu[2].value = win_arr[win_arr.length - 1];
        c.current.leftMenu[2].unit = "级 " + data.win[0];
        c.current.leftMenu[3].value = data.air;
        c.current.leftMenu[3].quality = data.air_level;
        setAirTips(data.air_tips);
      });
  };

  return (
    <>
      <Drawer
        placement="left"
        closable={false}
        maskClosable={false}
        mask={false}
        width={420}
        className={
          scss["drawer-content"] +
          " " +
          scss["drawer-left"] +
          " " +
          scss["pe-auto"]
        }
        visible={visible}
      >
        {c.current ? (
          <div className={scss["left"]}>
            <h4 style={{ margin: "10px 15px 35px" }}>今天{air_tips}</h4>
            <AvatarCardY
              data={c.current.leftMenu}
              rowHeight={105}
              colWidth={[300]}
              imgWidth={42}
            />
          </div>
        ) : (
          <Spin size="large" style={{ margin: "auto", width: "100%" }} />
        )}
      </Drawer>
      <Drawer
        placement="right"
        closable={false}
        mask={false}
        width={416}
        className={
          scss["drawer-content"] +
          " " +
          scss["drawer-right"] +
          " " +
          scss["sewageSkin"] +
          " " +
          scss["pe-auto"]
        }
        visible={visible}
      >
        {c.current ? (
          <div className={scss["right"]}>
            <CardLayout
              title={c.current.sewage.title}
              enTitle={c.current.sewage.enTitle}
              style={{ marginBottom: "0px" }}
            >
              <MonitorCard
                title={c.current.monitors[0].title}
                data={c.current.monitors[0].data}
                mask={false}
                style={{ marginBottom: "50px" }}
                offset={0}
              />
              <MonitorCard
                title={c.current.monitors[1].title}
                data={c.current.monitors[1].data}
                mask={false}
                style={{ marginBottom: "10px" }}
                offset={1}
              />
              <List
                data={window.currentMenu.sub.slice(2).map(item => item.title)}
                offset={2}
                style={{ marginBottom: vh(50), maxHeight: "165px" }}
              />
            </CardLayout>
          </div>
        ) : (
          <Spin size="large" style={{ margin: "auto", width: "100%" }} />
        )}
      </Drawer>
    </>
  );
}
