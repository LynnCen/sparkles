import { useEffect, useState } from "react";
import { Drawer, Icon, Spin, Progress, Button, Table } from "antd";
import { feature } from "../../Components/Header";
import { templates } from "../../../../config/StrConfig";
import {
  FolkMapTitle,
  TitleRight,
  ChartGroup,
  BlueCard,
  ContentShow
} from "../../Components/FolkMapComponent";
import { columns } from "../geologicHazard";

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  visible: boolean;
  template: string;
}
export default function FolkMap2({ visible, template }: Props) {
  const [config, setConfig] = useState(null);
  const columns = [
    {
      title: "所属组织",
      dataIndex: "organization",
      key: "organization"
    },
    {
      title: "姓    名",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "职    务",
      dataIndex: "job",
      key: "job"
    },
    {
      title: "联系电话",
      dataIndex: "phone",
      key: "phone"
    }
  ];
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
          scss["FolkMap"]
          //  +
          // " " +
          // scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["left"]}>
          {config ? (
            <>
              <div className={scss["drawer-child"]}>
                <FolkMapTitle
                  title={config.leftData1.title}
                  entitle={config.leftData1.entitle}
                  right={
                    <Button type="link">
                      <span style={{ textDecoration: "underline" }}>
                        查看详情{">"}
                      </span>
                    </Button>
                  }
                />
                <div className={scss["folkMap2-child-content"]}>
                  {config.leftData1.data.map(item => {
                    return (
                      <ContentShow
                        imageUrl={item.image}
                        title={item.title}
                        number={item.number}
                      />
                    );
                  })}
                </div>
              </div>
              <div className={scss["drawer-child"]}>
                <FolkMapTitle
                  title={config.leftData2.title}
                  entitle={config.leftData2.entitle}
                  right={
                    <Button type="link">
                      <span style={{ textDecoration: "underline" }}>
                        查看详情{">"}
                      </span>
                    </Button>
                  }
                />
                <p>{config.leftData2.text}</p>
              </div>
              <div className={scss["drawer-child"]}>
                <FolkMapTitle
                  title={config.leftData3.title}
                  entitle={config.leftData3.entitle}
                  right={
                    <Button type="link">
                      <span style={{ textDecoration: "underline" }}>
                        查看详情{">"}
                      </span>
                    </Button>
                  }
                />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {config.leftData3.data.map(item => {
                    return (
                      <BlueCard
                        key={item.index}
                        number={item.number}
                        title={item.title}
                        unit={item.unit}
                        width={89}
                      />
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
          scss["FolkMap"]
          // +" " +
          // scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["right"]}>
          {config ? (
            <>
              <div className={scss["drawer-child"]}>
                <FolkMapTitle
                  title={config.rightData1.title}
                  entitle={config.rightData1.entitle}
                  right={<TitleRight text={config.rightData1.text} />}
                />
                <Table
                  className={scss["folkMap-table"]}
                  rowKey={record => record.id}
                  columns={columns}
                  dataSource={config.rightData1.data}
                  pagination={false}
                  scroll={{ y: 140 }}
                />
              </div>
              <div className={scss["drawer-child"]}>
                <FolkMapTitle
                  title={config.rightData2.title}
                  entitle={config.rightData2.entitle}
                  right={
                    <TitleRight
                      text={config.rightData2.titleR.text}
                      number={config.rightData2.titleR.number}
                      unit={config.rightData2.titleR.unit}
                    />
                  }
                />
                <ChartGroup
                  data={config.rightData2.content}
                  color={config.rightData2.color}
                />
              </div>
              <div className={scss["drawer-child"]}>
                <FolkMapTitle
                  title={config.rightData3.title}
                  entitle={config.rightData3.entitle}
                  right={
                    <TitleRight
                      text={config.rightData3.titleR.text}
                      number={config.rightData3.titleR.number}
                      unit={config.rightData3.titleR.unit}
                    />
                  }
                />
                <ChartGroup
                  data={config.rightData3.content}
                  color={config.rightData3.color}
                />
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
