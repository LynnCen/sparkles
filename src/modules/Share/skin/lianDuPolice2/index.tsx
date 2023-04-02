import { useEffect, useState } from "react";
import { Drawer, Icon, Spin, Progress } from "antd";
import { feature } from "../../Components/Header";
import { templates } from "../../../../config/StrConfig";
// import { ProgressBar, ContentBox, Child1Chart, Child2Chart, Child3Table } from './compoents'

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  visible: boolean;
  template: string;
  ldStartMonth: string;
  ldEndMonth: string;
  ldPoliceId: number
}
export default function LDPolice({ visible, template, ldStartMonth, ldEndMonth, ldPoliceId }: Props) {
  const [config, setConfig] = useState(null);
  const [detailList, setDetailList] = useState([])
  useEffect(() => {
    fetch(templates[template].configPath)
      .then(r => r.json())
      .then(setConfig)
      .catch(console.table);

  }, []);

  useEffect(() => {
    fetch(`http://dtcity.cn:8077/api/basis_with/total_count/${ldPoliceId}`)
      .then(res => res.json())
      .then(res => setDetailList(res.data))
  }, [ldPoliceId])

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
          scss["ldPolice-left"]
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
                {
                  detailList.map((r, i) => {
                    return <div key={i} className={scss['left-content-box']}>
                      <img src={config.leftContent.imgList[r.typeName]} alt="" />
                      <div className={scss['ld-content-text']}>
                        <div>
                          <span>
                            {r.count}
                          </span>
                        </div>
                        <div>
                          {r.typeName} ({r.type === 1 ? '人' : r.type === 4 ? '件' : '个'})
                        </div>
                      </div>
                    </div>
                  })
                }
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
        width={440}
        style={{ width: "auto" }}
        className={
          scss["drawer-content"] +
          " " +
          scss["drawer-right"] +
          " " +
          scss["ldPolice-right"]
          // +" " +
          // scss["pe-none"]
        }
        visible={visible}
      >
        <div className={scss["right"]}>
          {config ? (
            <>
              <img src={config.rightUrl} alt="" />
            </>
          ) : (
            <Spin size="large" />
          )}
        </div>
      </Drawer>
    </>
  );
}
