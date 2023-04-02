import { useEffect, useState } from "react";
import { Drawer, Spin } from "antd";
import { templates } from "../../../../config/StrConfig";
import WeatherCard from "../../Components/WeatherCard";
import Mark from "../../../../components/model/Mark";
import AvatarFlexCard from "../../Components/AvatarFlexCard";
import { MonitorBox, BarGraph } from "./components";

// const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");
// let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  visible: boolean;
  address: string;
  template: string;
}
export default function GrassrootsGovernance({
  visible,
  address,
  template
}: Props) {
  const [config, setConfig] = useState(null);
  const [state, setState] = useState({});
  useEffect(() => {
    fetch(templates[template].configPath)
      .then(r => r.json())
      .then(setConfig)
      .catch(console.table);
  }, []);
  const showData = (dataId: number[]) => {
    Mark.marks.filter(
      e => dataId.includes(e.id) && e.setVisible(!e.point.isVisible())
    );
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
          scss["grassrootsGovernanceL"]
          //  +
          // " " +
          // scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["left"]}>
          {config ? (
            <>
              <div className={scss["child1"]}>
                <WeatherCard
                  title={"天气预报"}
                  enTitle={"Weather forecast"}
                  address={address}
                />
                <AvatarFlexCard data={config.environment} />
              </div>
              <div className={scss["child2"]}>
                <div className={scss["childTitle"]}>
                  <div className={scss["titleL"]}>
                    <div>{config.parking.title}</div>
                    <div>{config.parking.engTitle}</div>
                  </div>
                </div>
                <div className={scss["childContent"]}>
                  <div>
                    <img src={config.parking.imgUrl1} alt="" />
                    <div className={scss["text"]}>
                      <div>今日累计到访车辆</div>
                      <div>{config.parking.number1}</div>
                    </div>
                  </div>
                  <div>
                    <img src={config.parking.imgUrl2} alt="" />
                    <div className={scss["text"]}>
                      <div>剩余车位数量</div>
                      <div>{config.parking.number2}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={scss["child3"]}>
                <div className={scss["childTitle"]}>
                  <div className={scss["titleL"]}>
                    <div>{config.passenger.title}</div>
                    <div>{config.passenger.engTitle}</div>
                  </div>
                  <div className={scss["titleR"]}>
                    单位：<span>{config.passenger.typeNum}</span> 人
                  </div>
                </div>
                <BarGraph data={config.passenger.data} />
              </div>
            </>
          ) : (
            <Spin size="large" />
          )}
        </div>
      </Drawer>
      <Drawer
        placement="right"
        closable={false}
        mask={false}
        width={420}
        style={{ width: "auto" }}
        className={
          scss["drawer-content"] +
          " " +
          scss["drawer-right"] +
          " " +
          scss["grassrootsGovernanceR"]
          // +" " +
          // scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["right"]}>
          {config ? (
            <>
              <div className={scss["child4"]}>
                <div className={scss["childTitle"]}>
                  <div className={scss["titleL"]}>
                    <div>{config.distribution.title}</div>
                    <div>{config.distribution.engTitle}</div>
                  </div>
                  <div className={scss["titleR"]}>
                    场所类型：<span>{config.distribution.typeNum}</span> 类
                  </div>
                </div>
                <div className={scss["childContent"]}>
                  {config.distribution.data.map(item => {
                    return (
                      <div
                        onClick={e => showData(item.dataId)}
                        key={item.index}
                      >
                        <img src={item.imgUrl} alt="" />
                        <div>{item.title}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={scss["child5"]}>
                <MonitorBox
                  title={"视频监控"}
                  engTitle={"Video Surveillance"}
                  data={config.videoData}
                />
              </div>
              <div className={scss["child6"]}>
                <div className={scss["childTitle"]}>
                  <div className={scss["titleL"]}>
                    <div>{config.population.title}</div>
                    <div>{config.population.engTitle}</div>
                  </div>
                  <div className={scss["titleR"]}>
                    类型数量：<span>{config.population.typeNum}</span> 类
                  </div>
                </div>
                <div className={scss["childContent"]}>
                  {config.population.data.map(item => {
                    return (
                      <div key={item.index}>
                        <div>{item.number}</div>
                        <div>{item.title}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <Spin size="large" />
          )}
        </div>
      </Drawer>
    </>
  );
}
