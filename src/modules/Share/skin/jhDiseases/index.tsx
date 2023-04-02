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
export default function jhDiseases({ visible, template }: Props) {
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
          scss["jhDiseases-left"]
          //  +
          // " " +
          // scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["left"]}>
          {config ? (
            <>
              <img src={config.leftContent.imgUrl} alt="" />
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
        width={440}
        style={{ width: "auto" }}
        className={
          scss["drawer-content"] +
          " " +
          scss["drawer-right"] +
          " " +
          scss["jhDiseases-right"]
          // +" " +
          // scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["right"]}>
          {config ? (
            <>
              <img src={config.rightContent.imgUrl} alt="" />
            </>
          ) : (
            <Spin size="large" />
          )}
        </div>
      </Drawer>
    </>
  );
}
