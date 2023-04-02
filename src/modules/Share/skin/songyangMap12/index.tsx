import { useEffect, useState } from "react";
import { Drawer, Icon, Spin, Progress, Button } from "antd";
import { feature } from "../../Components/Header";
import { templates } from "../../../../config/StrConfig";
import { LineChart1, UniversalDom, TextBox, PieChartGH, Chart4, PieChart3, ComTabs, HorizontalBar3, ScenicSpot, SimplePicChart, StatisticalInfo } from '../../Components/SyMapComponent'

const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");

let vw = px => (px / 3200) * 100 + "vw";
let vh = px => (px / 1344) * 100 + "vh";
let rem = px => px + "rem"
interface Props {
  visible: boolean;
  template: string;
}
interface configProps {
  leftContent: any,
  rightContent: any
}
export default function SongyangMap10({ visible, template }: Props) {
  const [config, setConfig] = useState<any>(null);
  const [tabsKey1, setTabsKey1] = useState(0)
  useEffect(() => {
    fetch(templates[template].configPath)
      .then(r => r.json())
      .then(setConfig)
      .catch(console.table);
  }, []);
  // const { title, content1, content2, textShadow } = config.leftContent.child1
  return (
    <>
      <Drawer
        placement="left"
        closable={false}
        maskClosable={false}
        mask={false}
        width={rem(8.67)}
        className={
          scss["sy-drawer-content"] +
          " " +
          scss["sy-drawer-left"]
        }
        visible={visible}
      >
        {
          config ? <>
            <UniversalDom title={config.leftContent.child1.title}>
              <div style={{
                display: "flex",
                padding: ` ${rem(0.08)} ${rem(0.8)} 0 ${rem(0.40)} `,
                justifyContent: 'space-between',
                marginBottom: `${rem(0.3)}`
              }}>
                <div>
                  {
                    config.leftContent.child1.content1.map((r, i) => {
                      return <TextBox
                        title={r.title}
                        num={r.num}
                        unit={r.unit}
                        textShadow={config.leftContent.child1.textShadow}
                        key={i}
                      />
                    })
                  }
                </div>
                <div>
                  {
                    config.leftContent.child1.content2.map((r, i) => {
                      return <TextBox
                        title={r.title}
                        num={r.num}
                        unit={r.unit}
                        textShadow={config.leftContent.child1.textShadow}
                        key={i}
                      />
                    })
                  }
                </div>
              </div>
            </UniversalDom>
            <UniversalDom title={config.leftContent.child2.title}>
              <div style={{ marginTop: '0.34rem' }}>
                <ComTabs
                  data={config.leftContent.child2.tabs}
                  activeIndex={tabsKey1}
                  longBtnIndex={[2]}
                  onClick={setTabsKey1}
                />
                <div className={scss['sy-czgh-author-hc-box']} style={{ height: "3.6rem" }}>
                  <PieChartGH datas={config.leftContent.child2.chartData} />
                </div>
              </div>

            </UniversalDom>
            <UniversalDom title={config.leftContent.child3.title}>
              <div style={{ height: "2.5rem" }}>
                <PieChart3
                  datas={config.leftContent.child3.data}
                  title={config.leftContent.child3.entitle}
                  total={config.leftContent.child3.total}
                  color={config.leftContent.child3.color}
                  titleStyle={config.leftContent.child3.titleStyle}
                  legendStyle={config.leftContent.child3.legendStyle}
                  seriesRadius={config.leftContent.child3.seriesRadius}
                  seriesCenter={config.leftContent.child3.seriesCenter}
                  intervalVal={config.leftContent.child3.intervalVal}
                ></PieChart3>
              </div>
            </UniversalDom>
          </> : <Spin size="large" />
        }
      </Drawer>
      <Drawer
        placement="right"
        closable={false}
        mask={false}
        width={rem(6.80)}
        style={{ width: "auto" }}
        className={
          scss["sy-drawer-content"] +
          " " +
          scss["sy-drawer-right"]
        }
        visible={visible}
      >
        {
          config ? <>
            <UniversalDom title={config.rightContent.child1.title}>
              <div style={{ height: "3rem" }}>
                <Chart4 datas={config.rightContent.child1.data} color={config.rightContent.child1.color} showBarLabel={true}></Chart4>
              </div>
            </UniversalDom>
            <UniversalDom title={config.rightContent.child2.title}>
              <div style={{ height: "3.5rem" }}>
                <LineChart1
                  datas={config.rightContent.child2.data}
                  colors={config.rightContent.child2.colors}
                  legendStyle={config.rightContent.child2.legendStyle}
                  areaStyleOpacity={config.rightContent.child2.areaStyleOpacity} />
              </div>

            </UniversalDom>
            <UniversalDom title={config.rightContent.child3.title}>
              <div style={{ height: "3rem" }}>
                <HorizontalBar3 datas={config.rightContent.child3.data} />
              </div>
            </UniversalDom>


          </> : <Spin size="large" />
        }
      </Drawer>
    </>
  );
}
