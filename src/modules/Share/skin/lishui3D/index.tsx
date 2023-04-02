import { useEffect, useState } from "react";
import { Drawer, Icon, Spin, Progress, Table, Tag } from "antd";
import { templates } from "../../../../config/StrConfig";
import Mark from "../../../../components/model/Mark";
import Lishui3DChart1 from "./Lishui3DChart1";
import Lishui3DChart2 from "./Lishui3DChart2";
import Lishui3DChart3 from "./Lishui3DChart3";
import Lishui3DChart4 from "./Lishui3DChart4";
import Lishui3DChart5 from "./Lishui3DChart5";

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  visible: boolean;
  template: string;
}
export default function lishui3D({ visible, template }: Props) {
  const [config, setConfig] = useState(null);
  const [state, setState] = useState({});
  useEffect(() => {
    fetch(templates[template].configPath)
      .then(r => r.json())
      .then(setConfig)
      .catch(console.table);
  }, []);

  const {} = state;
  const columns = [
    {
      title: "类型",
      key: "type",
      dataIndex: "type",
      render: type => (
        <Tag color={type == "治安" ? "#EC9623" : "#2389FD"}>{type}</Tag>
      )
    },
    {
      title: "时间",
      dataIndex: "time",
      key: "time"
    },
    {
      title: "事件描述",
      dataIndex: "describe",
      key: "describe"
    },
    {
      title: "处理情况",
      dataIndex: "processing",
      key: "processing"
    }
  ];
  const pagination = {
    hideOnSinglePage: true
  };
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
        width={480}
        className={
          scss["drawer-content"] +
          " " +
          scss["drawer-left"] +
          " " +
          scss["lishui3DL"]
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
                <img className={scss["title"]} src={config.renkou.title} />
                <div className={scss["leftTop"]}>
                  <div className={scss["chartsBox1"]}>
                    <div>
                      <div>房屋信息</div>
                      <Lishui3DChart1
                        data={config.renkou.chartData1}
                        colors_pie={[
                          "#00baff",
                          "#02d281",
                          "#f8ca4f",
                          "#ff5000"
                        ]}
                      />
                    </div>
                    <div>
                      <div>实有人口</div>
                      <Lishui3DChart2
                        data={config.renkou.chartData2}
                        colors_pie={["#00baff", "#02d281"]}
                      />
                    </div>
                  </div>
                  <div className={scss["childtext"]}>
                    <div>特殊人群</div>
                    <div>
                      {config.renkou.content.map(item => {
                        return (
                          <div>
                            <div className={scss["blue"]}>{item.number}</div>
                            <div>{item.name}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className={scss["chartsBox2"]}>
                    <div>
                      <div>年龄结构</div>
                      {/* <Lishui3DChart3
                        data={config.renkou.chartData3}
                        colors_pie={["#2BD4EE", "#2389FD", "#EC9623"]}
                      /> */}
                      <img src={config.renkou.chartData3} alt="" />
                    </div>
                    <div>
                      <div>重点观察人群</div>
                      <Lishui3DChart4
                        data={config.renkou.chartData4}
                        colors_pie={["#2BD4EE", "#2389FD", "#EC9623"]}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <img className={scss["title"]} src={config.xiaoqu.title} />
                <div className={scss["leftBottom"]}>
                  <div className={scss["child1"]}>
                    <div className={scss["childTitle"]}>小区概况</div>
                    <div>
                      <div>
                        <img src={config.xiaoqu.content.imgurl2} alt="" />
                      </div>
                      <div>
                        <img src={config.xiaoqu.content.imgurl3} alt="" />
                      </div>
                    </div>
                    <div>
                      <img src={config.xiaoqu.content.imgurl} alt="" />
                      <span>{config.xiaoqu.content.place}</span>
                    </div>
                  </div>
                  <div className={scss["child2"]}>
                    <div className={scss["childTitle"]}>基础设施</div>
                    <div>
                      {config.xiaoqu.content.facilities.map(item => {
                        return (
                          <div key={item.name}>
                            <img src={item.imgurl} alt="" />
                            <span>{item.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className={scss["child3"]}>
                    {config.xiaoqu.content.information.map(item => {
                      return (
                        <div>
                          <div className={scss["child3Title"]}>
                            {item.profession}
                          </div>
                          <div className={scss["content"]}>
                            <img src={item.imgUrl} alt="" />
                            <div>
                              <div>姓名:{item.name}</div>
                              <div>手机号:{item.phone}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
        width={480}
        style={{ width: "auto" }}
        className={
          scss["drawer-content"] +
          " " +
          scss["drawer-right"] +
          " " +
          scss["lishui3DR"]
          // +" " +
          // scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["right"]}>
          {config ? (
            <>
              <div>
                <img
                  src={config.pingan.title}
                  className={scss["title"]}
                  alt=""
                />
                <div className={scss["rightTop"]}>
                  <div>平安指数</div>
                  <div>
                    <Progress
                      className={scss["progress"]}
                      type="dashboard"
                      percent={60}
                      gapDegree={150}
                      showInfo={false}
                    />
                    <div className={scss["rightTopChild1"]}>
                      {config.pingan.content.map(item => {
                        return (
                          <div>
                            <img src={item.url} alt="" />
                            <div>
                              <div>{item.number}</div>
                              <div>{item.name}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <div>
                      <span>事件（本月3起）</span>
                      <span style={{ marginLeft: "20px" }}>同比 1.3%</span>
                      <span style={{ marginLeft: "20px" }}>环比 0.8%</span>
                    </div>
                    <Table
                      columns={columns}
                      pagination={pagination}
                      dataSource={config.pingan.data}
                    />
                  </div>
                </div>
              </div>
              <div>
                <img
                  src={config.shengtai.title}
                  className={scss["title"]}
                  alt=""
                />
                <div className={scss["rightConter"]}>
                  <div>
                    {config.shengtai.data1.map(item => {
                      return (
                        <div>
                          <div className={scss["childtitle"]}>{item.name}</div>
                          <Progress
                            className={scss["progress"]}
                            type="circle"
                            percent={item.number}
                            format={percent => `${percent}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    {config.shengtai.data2.map(item => {
                      return (
                        <div key={item.name}>
                          <div className={scss["childtitle"]}>{item.name}</div>
                          <div className={scss["childcontent"]}>
                            <span className={scss["blue"]}>{item.number1}</span>
                            <span>/{item.number2}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div>
                <img
                  src={config.wenming.title}
                  className={scss["title"]}
                  alt=""
                />
                <div className={scss["rightBottom"]}>
                  <div className={scss["childL"]}>
                    <div style={{ marginBottom: "10px" }}>
                      <div className={scss["childtitle"]}>志愿服务情况</div>
                      <div className={scss["childLcontent"]}>
                        {config.wenming.data1.map(item => {
                          return (
                            <div>
                              <div className={scss["blue"]}>{item.number}</div>
                              <div>{item.title}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <div className={scss["childtitle"]}>不文明行为</div>
                      <div>
                        <Lishui3DChart5 data={config.wenming.data2} />
                      </div>
                    </div>
                  </div>
                  <div className={scss["childR"]}>
                    <div className={scss["childtitle"]}>不文明行为抓拍</div>
                    <img src={config.wenming.data2Img} alt="" />
                    <div>
                      <div>姓名：王*文</div>
                      <div>身份证信息：3321********8934</div>
                      <div>行为描述：乱踩草坪</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Spin size="large" />
          )}
        </div>
      </Drawer>
      <div className={scss["lishui3DC"] + " pe-auto"}>
        {visible ? (
          config ? (
            <>
              <img
                src={config.bianmin.title}
                className={scss["title"]}
                alt=""
              />
              <div>
                {config.bianmin.content.map(item => {
                  return (
                    <div
                      onClick={e => showData(item.dataId)}
                      style={{ cursor: "pointer" }}
                    >
                      <img src={item.imgUrl} alt="" />
                      <div>{item.title}</div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <Spin size="large" style={{ margin: "auto", width: "100%" }} />
          )
        ) : null}
      </div>
    </>
  );
}
