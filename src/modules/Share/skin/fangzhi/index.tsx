import { useEffect, useState } from "react";
import { Drawer, Icon, Spin, Progress } from "antd";
import { feature } from "../../Components/Header";
import { templates } from "../../../../config/StrConfig";

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  visible: boolean;
  template: string;
}
export default function FangZhi({ visible, template }: Props) {
  const [config, setConfig] = useState(null);
  const [state, setState] = useState({
    leftNum: "1",
    number1: "712.61",
    number2: "70.6"
  });
  useEffect(() => {
    fetch(templates[template].configPath)
      .then(r => r.json())
      .then(setConfig)
      .catch(console.table);
  }, []);

  const setleftNum = (id, number1, number2) => {
    setState({
      leftNum: id,
      number1,
      number2
    });
  };

  const { leftNum, number1, number2 } = state;
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
          scss["fangzhiL"]
          //  +
          // " " +
          // scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["left"]}>
          {config ? (
            <>
              <div>
                {config.leftContent.map(item => {
                  const id = item.id;
                  const name = item.name;
                  const number1 = item.number1;
                  const number2 = item.number2;
                  const progress1 = item.progress1;
                  const progress2 = item.progress2;
                  return (
                    <div
                      key={id}
                      className={
                        scss["leftChild"] +
                        " " +
                        (id == leftNum ? scss["selected"] : "")
                      }
                      onClick={() => setleftNum(id, number1, number2)}
                    >
                      <div>
                        <div className={scss["titleL"]}>{name}</div>
                        <div className={scss["titleR"]}>
                          <div>
                            <span>{number1}</span>
                            <span>万亩</span>
                          </div>
                          <div>
                            <span>{number2}</span>
                            <span>万株</span>
                          </div>
                        </div>
                      </div>
                      <div className={scss["progressBox"]}>
                        <Progress
                          strokeColor={id == leftNum ? "#00FF13" : "#02D281"}
                          percent={progress1}
                          showInfo={false}
                        />
                        <Progress
                          strokeColor={id == leftNum ? "#004BFF" : "#00BAFF"}
                          percent={progress2}
                          showInfo={false}
                        />
                      </div>
                    </div>
                  );
                })}
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
        width={410}
        style={{ width: "auto" }}
        className={
          scss["drawer-content"] +
          " " +
          scss["drawer-right"] +
          " " +
          scss["fangzhiR"]
          // +" " +
          // scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["right"]}>
          {config ? (
            <>
              {config.rightContent.map(item => {
                const unit = item.unit;
                return (
                  <div key={item.index} className={scss["childBox"]}>
                    <div className={scss["childTitle"]}>
                      <div>{item.title}</div>
                      <div>{item.subtitle}</div>
                    </div>
                    <div className={scss["childList"]}>
                      {item.list.map(content => {
                        return (
                          <div key={content.index}>
                            {content.imgUrl ? (
                              <img src={content.imgUrl} alt="" />
                            ) : null}
                            <div className={scss["listText"]}>
                              <div>
                                {content.title == "普查感染面积"
                                  ? number1
                                  : content.title == "普查疫木"
                                  ? number2
                                  : content.number}
                                <span>{unit}</span>
                              </div>
                              <div>{content.title}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className={scss["childText"]}>
                      <div>
                        <div>
                          整治目标：
                          <span className={scss["number"]}>
                            {item.targetNum}
                          </span>
                          <span className={scss["unit"]}>{unit}</span>
                        </div>
                        <div>
                          上报整治：
                          <span className={scss["number"]}>
                            {item.reportNum}
                          </span>
                          <span className={scss["unit"]}>{unit}</span>
                        </div>
                      </div>
                      <div>
                        上报进度：
                        <div
                          className={scss["progressBox"] + " " + scss["style1"]}
                        >
                          <Progress
                            percent={item.schedule1}
                            strokeColor="#02D281"
                            showInfo={false}
                          />
                          <div className={scss["progressText"]}>
                            {item.schedule1}%
                          </div>
                        </div>
                      </div>
                      <div>
                        验收整治：
                        <span className={scss["number"]}>
                          {item.acceptance}
                        </span>
                        <span className={scss["unit"]}>{unit}</span>
                      </div>
                      <div>
                        验收进度：
                        <div className={scss["progressBox"]}>
                          <Progress
                            percent={item.schedule2}
                            strokeColor="#02D281"
                            showInfo={false}
                          />
                          <div className={scss["progressText"]}>
                            {item.schedule2}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <Spin size="large" />
          )}
        </div>
      </Drawer>
    </>
  );
}
