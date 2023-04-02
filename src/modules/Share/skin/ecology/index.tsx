import { Component } from "react";
import { Drawer, Spin } from "antd";
import AvatarCard from "../../Components/AvatarCard";
import AvatarFlexCard from "../../Components/AvatarFlexCard";
import DonutChart from "../../Components/DonutChart";
import CardLayout from "../../Components/CardLayout";
import ProgressLineCard from "../../Components/ProgressLineCard";
import MonitorCard from "../../Components/MonitorCard";
import { loadScript } from "../../../../utils/common";
import Config from "../../../../config/Config";
const scss = require("../../../../styles/scss/sharepage.scss");
let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  visible: boolean;
  template: string;
}
interface States {
  config?: object;
}
export default class EcologySkin extends Component<Props, States> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentWillMount() {
    let config = window["__esModule__ecology"];
    if (!config) {
      config = await fetch(
        `${process.env.publicPath}js/share/ecology/index.json`
      )
        .then(r => r.json())
        .catch(console.error);
    }
    if (config) {
      window["__esModule__ecology"] = config;
      this.setState({ config }, this.fetchWeather.bind(this, "丽水"));
      const modules = ["atmosphere", "site", "sewage", "conservancy"];
      const results: { config; zhongtai; name }[] = [];
      for (let i = 0; i < modules.length; i++) {
        let m = window[`__esModule__${modules[i]}`];
        if (m) {
          modules.splice(i, 1);
          results.push(m);
          i--;
        }
      }
      results.push(
        ...(await Promise.all(
          modules.map(e =>
            loadScript(
              `${process.env.publicPath}js/share/ecology/${e}.js`,
              e,
              "module"
            )
          )
        ))
      );
      results.forEach(({ config: c, zhongtai, name }, i) => {
        config[name].monitors = (Config.PLANID === 2300
          ? zhongtai
          : c
        ).monitors;
      });
      this.setState({ config });
      console.log(config);
    }
  }
  fetchWeather = addr => {
    const { config } = this.state;
    fetch(
      "https://www.tianqiapi.com/api/?version=v1&city=" +
        addr +
        "&appid=52329359&appsecret=iSWTX5pP"
    )
      .then(res => res.json())
      .then(res => {
        const data = res.data[0];
        console.log(data);
        config.atmosphere.data[0].value = data.tem;
        config.atmosphere.data[1].value = data.humidity;
        config.atmosphere.data[2].value = data.air + data.air_level;
        config.atmosphere.data[4].value = data.win_speed;
        this.setState({ config });
      });
  };

  render() {
    const { visible } = this.props;
    const { config } = this.state;
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
            scss["ecologySkin"] +
            " " +
            scss["pe-auto"]
          }
          visible={visible}
        >
          {config ? (
            <div className={scss["left"]}>
              <AvatarFlexCard
                title={config.atmosphere.title}
                enTitle={config.atmosphere.enTitle}
                data={config.atmosphere.data}
                style={{ marginBottom: vh(24) }}
                suffixIcon={
                  <div
                    className={scss["transparent"]}
                    style={{ display: "flex", alignItems: "end" }}
                  >
                    <span>{config.atmosphere.suffix.name}：</span>
                    <span className={scss["value"]}>
                      {config.atmosphere.suffix.value}
                    </span>
                    <span>{config.atmosphere.suffix.unit}</span>
                  </div>
                }
              />
              {config.atmosphere.monitors && (
                <MonitorCard
                  title={config.monitors.title}
                  enTitle={config.monitors.enTitle}
                  prefixIcon={<img src={config.monitors.icon} />}
                  data={config.atmosphere.monitors.reduce(
                    (r, item) => r.concat(item.data),
                    []
                  )}
                  mask={false}
                  style={{ marginBottom: vh(40) }}
                />
              )}

              <ProgressLineCard
                title={config.site.title}
                enTitle={config.site.enTitle}
                suffixIcon={
                  <div className={scss["transparent"]}>
                    <span>{config.site.suffix.name}：</span>
                    <span className={scss["value"]}>
                      {config.site.suffix.value}
                    </span>
                    <span>{config.site.suffix.unit}</span>
                  </div>
                }
                data={config.site.data}
                strokeColor={{ "0%": "#87d068", "100%": "#108ee9" }}
                style={{ marginBottom: "27px" }}
              />
              {config.site.monitors && (
                <MonitorCard
                  title={config.monitors.title}
                  enTitle={config.monitors.enTitle}
                  prefixIcon={<img src={config.monitors.icon} />}
                  data={config.site.monitors.reduce(
                    (r, item) => r.concat(item.data),
                    []
                  )}
                  mask={false}
                />
              )}
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
            scss["ecologySkin"] +
            " " +
            scss["pe-auto"]
          }
          visible={visible}
        >
          {config ? (
            <div className={scss["right"]}>
              <AvatarCard
                title={config.sewage.title}
                enTitle={config.sewage.enTitle}
                suffixIcon={
                  <div
                    className={scss["transparent"]}
                    style={{ display: "flex", alignItems: "end" }}
                  >
                    <span>{config.sewage.suffix.name}：</span>
                    <span className={scss["value"]}>
                      {config.sewage.suffix.value}
                    </span>
                    <span>{config.sewage.suffix.unit}</span>
                  </div>
                }
                imgHeight={32}
                data={config.sewage.data}
                flex={true}
                style={{ marginBottom: vh(24) }}
              />
              {config.sewage.monitors && (
                <MonitorCard
                  title={config.monitors.title}
                  enTitle={config.monitors.enTitle}
                  prefixIcon={<img src={config.monitors.icon} />}
                  data={config.sewage.monitors[0].data}
                  mask={false}
                  style={{ marginBottom: vh(40) }}
                />
              )}

              <CardLayout
                title={config.conservancy.title}
                enTitle={config.conservancy.enTitle}
                suffixIcon={
                  <div
                    className={scss["transparent"]}
                    style={{ display: "flex", alignItems: "end" }}
                  >
                    <span>{config.conservancy.suffix.name}：</span>
                    <span className={scss["value"]}>
                      {config.conservancy.suffix.value}
                    </span>
                    <span>{config.conservancy.suffix.unit}</span>
                  </div>
                }
                style={{}}
                className={""}
              >
                <div className={scss["flex"]}>
                  {config.conservancy.data.map((item, i) => (
                    <DonutChart
                      data={item}
                      colors_pie={["#00baff", "#02d281", "#f8ca4f", "#ff5000"]}
                      style={{ marginTop: "-5px" }}
                    />
                  ))}
                </div>
              </CardLayout>
              {config.conservancy.monitors && (
                <MonitorCard
                  title={config.monitors.title}
                  enTitle={config.monitors.enTitle}
                  prefixIcon={<img src={config.monitors.icon} />}
                  data={config.conservancy.monitors.reduce(
                    (r, item) => r.concat(item.data),
                    []
                  )}
                  mask={false}
                />
              )}
            </div>
          ) : (
            <Spin size="large" style={{ margin: "auto", width: "100%" }} />
          )}
        </Drawer>
      </>
    );
  }
}
