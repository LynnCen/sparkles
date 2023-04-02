import { useEffect, useState } from "react";
import { Drawer, Icon, Spin, Progress } from "antd";
import { feature } from "../../Components/Header";
import { templates } from "../../../../config/StrConfig";
import Play from "../../../../components/tools/Play";

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  menu: any[];
  visible: boolean;
  template: string;
}
export default function Peibiao1({ menu, visible, template }: Props) {
  const [config, setConfig] = useState(null);
  const [state, setState] = useState({});
  useEffect(() => {
    fetch(templates[template].configPath)
      .then(r => r.json())
      .then(setConfig)
      .catch(console.table);
  }, []);
  const onclick = (key1, key2) => {
    for (let i in menu) {
      const id1 = menu[i].id;
      const sub = menu[i].sub;
      if (id1 == key1) {
        for (let j in sub) {
          const id2 = sub[j].id;
          if (id2 == key2) {
            Play.play(sub[j].feature);
          }
        }
      }
    }
  };
  return (
    <>
      {/* <Drawer
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
          scss["peibiaoL"]
          //  +
          // " " +
          // scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["left"]}>
          {config ? (
            <>
              <div className={scss["peibiao1"]}>
                <img src={config.left.imgUrl} alt="" />
              </div>
            </>
          ) : (
            <Spin size="large" />
          )}
        </div>
      </Drawer> */}
      <div className={scss["peibiaoL"]}>
        {config ? (
          <div className={scss["peibiao1"]}>
            <img src={config.left.imgUrl} alt="" />
          </div>
        ) : (
          <Spin size="large" />
        )}
      </div>
      <div className={scss["peibiaoR"]}>
        {config ? (
          <>
            <div className={scss["peibiao1"]}>
              <img src={config.right.imgUrl} alt="" />
            </div>
          </>
        ) : (
          <Spin size="large" />
        )}
      </div>
      <div className={scss["peibiaoC"] + " pe-auto"}>
        {visible ? (
          config ? (
            <>
              <div className={scss["box"]}>
                <img src={config.content.imgUrl} alt="" />
                <div onClick={() => onclick(1307, 1670)} />
                <div onClick={() => onclick(1239, 1672)} />
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
