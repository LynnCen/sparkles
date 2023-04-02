import { useEffect, useState } from "react";
import { Drawer, Icon, Spin, Progress, Input, Table } from "antd";
import { feature } from "../../Components/Header";
import { templates } from "../../../../config/StrConfig";

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

const { Search } = Input;

let vh = px => (px / 1080) * 100 + "vh";

const columns = [
  {
    title: "车牌号码",
    dataIndex: "plate",
    key: "plate"
  },
  {
    title: "占用时间",
    dataIndex: "time",
    key: "time"
  },
  {
    title: "通知状态",
    dataIndex: "state",
    key: "state",
    align: "center"
  }
];

interface Props {
  visible: boolean;
  template: string;
}
export default function ChannelManagement({ visible, template }: Props) {
  const [config, setConfig] = useState(null);
  const [state, setState] = useState({});
  useEffect(() => {
    fetch(templates[template].configPath)
      .then(r => r.json())
      .then(setConfig)
      .catch(console.table);
  }, []);

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
          scss["channelManagementL"]
          //  +
          // " " +
          // scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["left"]}>
          {config ? (
            <>
              <div className={scss["child"]}>
                <div className={scss["title"]}>{config.left.child1.title}</div>
                <div>
                  {config.left.child1.content.map(item => {
                    return (
                      <div key={item.name} className={scss["childContent"]}>
                        <img src={item.imgurl} alt="" />
                        <div>
                          <div className={scss["contentName"]}>{item.name}</div>
                          <div className={scss["contentNum"]}>
                            {item.number}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={scss["child"] + " " + scss["child2"]}>
                <div className={scss["title"]}>{config.left.child2.title}</div>
                <div>
                  {config.left.child2.content.map(item => {
                    return (
                      <div key={item.name} className={scss["childContent"]}>
                        <img src={config.left.child2.imgurl} alt="" />
                        <div>
                          <div className={scss["contentName"]}>
                            {item.name}{" "}
                            {item.key ? (
                              <Icon type="down" className={scss["icon"]} />
                            ) : null}
                          </div>
                          <div className={scss["contentNum"]}>
                            {item.number}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={scss["child"]}>
                <div className={scss["title"]}>{config.left.child3.title}</div>
                <div>
                  {config.left.child3.content.map(item => {
                    return (
                      <div key={item.name} className={scss["childContent"]}>
                        <img src={config.left.child3.imgurl} alt="" />
                        <div>
                          <div className={scss["contentName"]}>{item.name}</div>
                          <div className={scss["contentNum"]}>
                            {item.number}
                          </div>
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
          scss["channelManagementR"]
          // +" " +
          // scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["right"]}>
          {config ? (
            <>
              <Search
                className={scss["search"]}
                placeholder="请输入关键字查找"
                enterButton
              />
              <div className={scss["rightChild"]}>
                <div className={scss["title"]}>
                  <div className={scss["titleL"]}>
                    <div>{config.right.table1.title}</div>
                    <div>{config.right.table1.subtitle}</div>
                  </div>
                  <div className={scss["titleR"]}>
                    总数: <span>{config.right.table1.number}</span> 条
                  </div>
                </div>
                <Table
                  dataSource={config.right.table1.data}
                  columns={columns}
                  pagination={{ hideOnSinglePage: true }}
                  onRow={record => ({
                    style: {
                      background: config.colors[record.key]
                    }
                  })}
                />
                <div className={scss["check"]}>查看更多</div>
              </div>
              <div className={scss["rightChild"]}>
                <div className={scss["title"]}>
                  <div className={scss["titleL"]}>
                    <div>{config.right.table2.title}</div>
                    <div>{config.right.table2.subtitle}</div>
                  </div>
                  <div className={scss["titleR"]}>
                    总数: <span>{config.right.table2.number}</span> 条
                  </div>
                </div>
                <Table
                  dataSource={config.right.table2.data}
                  columns={columns}
                  pagination={{ hideOnSinglePage: true }}
                  onRow={record => ({
                    style: {
                      background: config.colors[record.key]
                    }
                  })}
                />
                <div className={scss["check"]}>查看更多</div>
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
