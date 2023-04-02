import { useEffect, useState } from "react";
import { Drawer, Icon, Spin, Progress, Button } from "antd";
import { feature } from "../../Components/Header";
import { templates } from "../../../../config/StrConfig";
import { TitleName, UniversalDom, TextBox, LineChart1, Chart4, PieChart3, ComTabs, BarChart2, ScenicSpot, SimplePicChart, StatisticalInfo } from '../../Components/SyMapComponent'

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
  const [config, setConfig] = useState(null);
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
              <div
                style={{
                  padding: ` ${rem(0.2)} ${rem(0.3)} ${rem(0.40)} `,
                }}
              >
                <div className={scss['sy-statiscal-info']}>
                  {
                    config.leftContent.child2.statistical.map((r) => {
                      return <StatisticalInfo data={r} />
                    })
                  }
                </div>
                <div className={scss['sy-statiscal-info']} style={{ height: `${rem(2.5)}` }}>
                  {
                    config.leftContent.child2.chartData.map((item, index) => {
                      return (
                        <div style={{ width: "40%", height: '2.5rem' }}>
                          <SimplePicChart data={item.data} color={item.color} key={index} lineFeedIndex={5} />
                        </div>
                      )
                    })
                  }
                </div>
              </div>

            </UniversalDom>
            <UniversalDom title={config.leftContent.child3.title}>
              <ScenicSpot datas={config.leftContent.child3.ecologicalProtection} />
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
              <div style={{ height: "2.5rem" }}>
                <PieChart3
                  datas={config.rightContent.child1.data}
                  title={config.rightContent.child1.title1}
                  total={config.rightContent.child1.total}
                  color={config.rightContent.child1.color}
                  titleStyle={config.rightContent.child1.titleStyle}
                  legendStyle={config.rightContent.child1.legendStyle}
                  seriesRadius={config.rightContent.child1.seriesRadius}
                  seriesCenter={config.rightContent.child1.seriesCenter}
                  intervalVal={config.rightContent.child1.intervalVal}
                ></PieChart3>
              </div>
            </UniversalDom>
            <UniversalDom title={config.rightContent.child2.title}>
              <div style={{ height: "3.5rem" }}>
                <Chart4 datas={config.rightContent.child2.data} color={config.rightContent.child2.color} showBarLabel={true}></Chart4>
              </div>

            </UniversalDom>
            <UniversalDom title={config.rightContent.child3.title}>
              <div style={{ height: "3.5rem" }}>
                <LineChart1
                  datas={config.rightContent.child3.data}
                  colors={config.rightContent.child3.colors}
                  legendStyle={config.rightContent.child3.legendStyle}
                  areaStyleOpacity={config.rightContent.child3.areaStyleOpacity}></LineChart1>
              </div>
            </UniversalDom>


          </> : <Spin size="large" />
        }
      </Drawer>
    </>
  );
}
