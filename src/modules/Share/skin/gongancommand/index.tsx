import { useEffect, useState } from "react";
import { Drawer, Icon, Spin } from "antd";
import { feature } from "../../Components/Header";
import { templates } from "../../../../config/StrConfig";

// const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");
// let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  visible: boolean;
  template: string;
}
export default function GonganCommand({ visible, template }: Props) {
  const [config, setConfig] = useState(null);
  const [state, setState] = useState({
    Rchild1: 1,
    Rchild2: 1
  });
  useEffect(() => {
    fetch(templates[template].configPath)
      .then(r => r.json())
      .then(setConfig)
      .catch(console.table);
  }, []);

  const changechild1 = (number1, number2, key) => {
    if (key == 0) {
      setState({ ...state, Rchild1: number1 == 1 ? 1 : number1 - 1 });
    } else {
      setState({
        ...state,
        Rchild1: number1 == number2 ? number2 : number1 + 1
      });
    }
  };
  const changechild2 = (number1, number2, key) => {
    if (key == 0) {
      setState({ ...state, Rchild2: number1 == 1 ? 1 : number1 - 1 });
    } else {
      setState({
        ...state,
        Rchild2: number1 == number2 ? number2 : number1 + 1
      });
    }
  };
  const { Rchild1, Rchild2 } = state;
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
          scss["gonancommandL"]
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
                <div style={{ marginBottom: "70px" }}>
                  <div className={scss["childtitle"]}>
                    {config.leftchild1.title}
                  </div>
                  {config.leftchild1.data.map(item => {
                    return (
                      <div key={item.index} className={scss["childbody"]}>
                        <img src={item.imgurl} alt="" />
                        <div>
                          <div>{item.title}</div>
                          <div className={scss["childbody_value"]}>
                            {item.value}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div>
                  <div className={scss["childtitle"]}>
                    {config.leftchild2.title}
                  </div>
                  {config.leftchild2.data.map(item => {
                    return (
                      <div key={item.index} className={scss["childbody"]}>
                        <img src={item.imgurl} alt="" />
                        <div>
                          <div>{item.title}</div>
                          <div>{item.value}</div>
                        </div>
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
          scss["gonancommandR"]
          // +" " +
          // scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["right"]}>
          {config ? (
            <>
              <div>
                <div className={scss["rightHead"]}>
                  <div className={scss["lefttitle"]}>
                    <div>{config.rightchild1.title}</div>
                    <div>{config.rightchild1.subtitle}</div>
                  </div>
                  <div className={scss["righttitle"]}>
                    <div
                      onClick={() =>
                        changechild1(Rchild1, config.rightchild1.number, 0)
                      }
                    >
                      <Icon type="left" />
                    </div>
                    <div>
                      {Rchild1}/{config.rightchild1.number}
                    </div>
                    <div
                      onClick={() =>
                        changechild1(Rchild1, config.rightchild1.number, 1)
                      }
                    >
                      <Icon type="right" />
                    </div>
                    <div>
                      <Icon type="dash" />
                    </div>
                  </div>
                </div>
                <div className={scss["child1body"]}>
                  {config.rightchild1.data.map(item => {
                    return (
                      <div className={scss["profile"]} key={item.index}>
                        <img src={item.imgurl} alt="" />
                        <div className={scss["information"]}>
                          <div>
                            <div>{item.name}</div>
                            <div>{item.position}</div>
                          </div>
                          <div>{item.from}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className={scss["bodybutton"]}>
                  <div>
                    <img src={config.coordinate} alt="" />
                    {config.rightchild1.position}
                  </div>
                  <Icon type="right" />
                </div>
              </div>

              <div>
                <div className={scss["rightHead"]}>
                  <div className={scss["lefttitle"]}>
                    <div>{config.rightchild2.title}</div>
                    <div>{config.rightchild2.subtitle}</div>
                  </div>
                  <div className={scss["righttitle"]}>
                    <div
                      onClick={() =>
                        changechild2(Rchild2, config.rightchild2.number, 0)
                      }
                    >
                      <Icon type="left" />
                    </div>
                    <div>
                      {Rchild2}/{config.rightchild2.number}
                    </div>
                    <div
                      onClick={() =>
                        changechild2(Rchild2, config.rightchild2.number, 1)
                      }
                    >
                      <Icon type="right" />
                    </div>
                    <div>
                      <Icon type="dash" />
                    </div>
                  </div>
                </div>
                <div className={scss["child2body"]}>
                  {(Rchild2 == 1
                    ? config.rightchild2.data1
                    : Rchild2 == 2
                    ? config.rightchild2.data2
                    : config.rightchild2.data3
                  ).map(item => {
                    return (
                      <div key={item.index} className={scss["profile"]}>
                        <img src={item.imgurl} alt="" />
                        <div>
                          <div>
                            <div>{item.name}</div>
                            <div>{item.position}</div>
                          </div>
                          <div>{item.from}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className={scss["bodybutton"]}>
                  <div>
                    <img src={config.coordinate} alt="" />
                    {Rchild2 == 1
                      ? config.rightchild2.position1
                      : Rchild2 == 2
                      ? config.rightchild2.position2
                      : config.rightchild2.position3}
                  </div>
                  <Icon type="right" />
                </div>
              </div>

              <div>
                <div className={scss["rightHead"]}>
                  <div className={scss["lefttitle"]}>
                    <div>{config.rightchild3.title}</div>
                    <div>{config.rightchild3.subtitle}</div>
                  </div>
                  <div className={scss["righttitle2"]}>
                    总人数:<span>{config.rightchild3.number}</span>人
                  </div>
                </div>
                <div className={scss["child3body"]}>
                  {config.rightchild3.data.map(item => {
                    return (
                      <div key={item.index}>
                        <div>
                          <span>{item.value}</span>人
                        </div>
                        <div>{item.name}</div>
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
