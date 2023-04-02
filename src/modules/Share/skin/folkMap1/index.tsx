import { useEffect, useState } from "react";
import { Drawer, Icon, Spin, Progress, Button } from "antd";
import { feature } from "../../Components/Header";
import { templates } from "../../../../config/StrConfig";
import {
  FolkMap1L,
  FolkMapTitle,
  TitleRight,
  ChartGroup,
  BlueCard
} from "../../Components/FolkMapComponent";

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  visible: boolean;
  template: string;
}
export default function FolkMap1({ visible, template }: Props) {
  const [config, setConfig] = useState(null);
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
              <FolkMap1L data={config.folkMap1L} />
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
                  title={config.right1.title}
                  entitle={config.right1.entitle}
                  right={
                    <TitleRight
                      text={config.right1.titleR.text}
                      number={config.right1.titleR.number}
                      unit={config.right1.titleR.unit}
                    />
                  }
                />
                <ChartGroup
                  data={config.right1.content}
                  color={config.right1.color}
                />
              </div>
              <div className={scss["drawer-child"]}>
                <FolkMapTitle
                  title={config.right2.title}
                  entitle={config.right2.entitle}
                  right={
                    <TitleRight
                      text={config.right2.titleR.text}
                      number={config.right2.titleR.number}
                      unit={config.right2.titleR.unit}
                    />
                  }
                />
                <ChartGroup
                  data={config.right2.content}
                  color={config.right2.color}
                />
              </div>
              <div className={scss["drawer-child"]}>
                <FolkMapTitle
                  title={config.right3.title}
                  entitle={config.right3.entitle}
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
                  {config.right3.data.map(item => {
                    return (
                      <BlueCard
                        key={item.index}
                        number={item.number}
                        title={item.title}
                        unit={item.unit}
                        width={180}
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
    </>
  );
}
