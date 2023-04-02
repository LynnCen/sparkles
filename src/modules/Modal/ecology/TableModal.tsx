import {
  Component,
  createRef,
  useEffect,
  useState,
  CSSProperties
} from "react";
import Config from "../../../config/Config";
import VideoPlayer from "../../Share/Components/VideoPlayer";
import { config } from "../../Share/skin/ecology/atmosphereConfig";
import {
  Tabs,
  Icon,
  Carousel,
  Select,
  Table,
  Modal,
  Collapse,
  message
} from "antd";
import { Panel } from "../../../stores/markerModel";
const { TabPane } = Tabs;
const { Option } = Select;
import { DatePicker } from "antd";
import moment from "moment";
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const dateFormat = "YYYY/MM/DD";
const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/markerBox.scss");
let vh = px => (px / 1080) * 100 + "vh";

const detailTableColumns = [
  // { title: "设备名称", dataIndex: "devicename", key: "devicename" },
  // { title: "探测器", dataIndex: "detectorname", key: "detectorname" },
  // {
  //   title: "报警地址",
  //   dataIndex: "companyaddress",
  //   key: "companyaddress"
  // },
  { title: "报警时间", dataIndex: "starttime", key: "starttime" },
  {
    title: "报警类型",
    dataIndex: "alarmTypeName",
    key: "alarmTypeName"
  },
  { title: "是否确认", dataIndex: "eventstatus", key: "eventstatus" },
  {
    title: "确认人",
    dataIndex: "confirmusername",
    key: "confirmusername"
  },
  { title: "确认时间", dataIndex: "systemtime", key: "systemtime" },
  {
    title: "确认结果",
    dataIndex: "eventtypeName",
    key: "eventtypeName"
  },
  { title: "复位状态", dataIndex: "resetStatus", key: "resetStatus" }
];

interface Props {
  address: string;
  tabs: [Panel] | null;
}
interface States {
  modalProps: any;
  deviceList: Array<any>;
  alarmLogList: { [key: string]: Array<any> };
  panelKey: string | number;
  loading: boolean;
}
export default class TableModal extends Component<Props, States> {
  videoRef = createRef();
  slider = createRef();
  fetchPostConfig = {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      modalProps: {
        visible: false,
        title: ""
      },
      deviceList: [],
      alarmLogList: {},
      panelKey: 0,
      loading: true
    };
    // this.getYangchenYujing("望城岭公寓");
  }

  componentWillMount() {}
  componentDidMount() {}
  componentWillUnmount() {
    if (this.videoRef.current && this.videoRef.current.player.hasStarted()) {
      this.videoRef.current.player.pause();
      // videoRef.current.player.dispose();
    }
  }
  showModal = companyId => this.getDeviceListByRegion(companyId);
  getDeviceListByRegion = companyId => {
    fetch(
      `${
        process.env.proxyUrl
      }/http://116.62.119.86:9085/IFCS/ElectricFireAction/getDeviceListByRegion.xhtml?companyId=` +
        companyId,
      {
        ...this.fetchPostConfig,
        body:
          "order=asc&offset=0&limit=10&statuscategoryId=2&fireSystemId=2&curpage=5"
      }
    )
      .then(res => res.json())
      .then(res => {
        // console.log(res);
        this.getAlarmLogList(res.data.rows[0].deviceId);
        this.setState({
          modalProps: {
            visible: true
          },
          deviceList: res.data.rows.map(item => ({
            deviceId: item.deviceId,
            deviceName: item.deviceName,
            channelNo: item.channelNo
          }))
        });
      })
      .catch(err => {
        console.table(err);
        message.error("登录信息已过期，请联系管理员~");
      });
  };
  getAlarmLogList = deviceId => {
    const { alarmLogList } = this.state;
    if (!Object.keys(alarmLogList).includes(deviceId)) {
      this.setState({ loading: true });
      fetch(
        `${
          process.env.proxyUrl
        }/http://116.62.119.86:9085/IFCS/AlarmLogAction/alarmLog_list.xhtml`,
        {
          ...this.fetchPostConfig,
          body:
            "order=asc&offset=0&limit=10&isOperateCompany=1&companyId=&deviceNameSearch=&searchStart=&searchEnd=&resetStatus=&confirmStatus=&confirmResult=&confirmSystem=&alarmTypeId=&categoryId=2&isNb=0&deviceId=" +
            deviceId
        }
      )
        .then(res => res.json())
        .then(res => {
          // console.log(res);
          this.setState({
            modalProps: {
              visible: true,
              title: res.data.rows[0].companyname + "-报警详情"
            },
            alarmLogList: {
              ...alarmLogList,
              [deviceId]: res.data.rows.map(item => ({
                // devicename: item.devicename,
                // companyname: item.companyname,
                // detectorname: item.detectorname,
                // companyaddress: item.companyaddress,
                alarmTypeName: item.alarmTypeName,
                eventstatus: item.eventstatus ? "已确认" : "未确认",
                starttime: item.starttime,
                confirmusername: item.confirmusername,
                systemtime: item.systemtime,
                eventtypeName: item.eventtypeName,
                resetStatus: item.resetStatus ? "已复位" : "未复位"
              }))
            },
            loading: false
          });
        })
        .catch(err => console.table(err));
    }
  };
  getYangchenYujing = projectname => {
    fetch(
      `${
        process.env.proxyUrl
      }/http://112.15.69.165:8003/szjsframegl/rest/frame/huanjingjc/yangchenyujing/yujingyangchenlistaction/page_load?isCommondto=true`,
      {
        ...this.fetchPostConfig,
        body: `commonDto=[
            {
              "id": "datagrid",
              "type": "datagrid",
              "action": "getDataGridData",
              "idField": "rowguid",
              "pageIndex": 0,
              "sortField": "",
              "sortOrder": "desc",
              "columns": [
                { "fieldName": "projectname" },
                { "fieldName": "yujingtype" },
                { "fieldName": "YujingPM" },
                { "fieldName": "yujingdate", "format": "yyyy-MM-dd HH:mm:dd" },
                { "fieldName": "caiqucuoshi" },
                { "fieldName": "zhenggaidate", "format": "yyyy-MM-dd HH:mm:ss" },
                { "fieldName": "note" },
                { "fieldName": "wcqingkuang" }
              ],
              "pageSize": 10,
              "url": "getDataGridData"
            },{
              "id": "search_projectname",
              "bind": "dataBean.projectname",
              "type": "textbox",
              "action": "",
              "value": "${projectname}",
              "text": "${projectname}"
            }
          ]`
      }
    )
      .then(res => res.json())
      .then(res => {
        console.log(res);
      });
  };
  render() {
    const { address, tabs } = this.props;
    const {
      modalProps,
      deviceList,
      alarmLogList,
      panelKey,
      loading
    } = this.state;
    let style = {};
    const hasMonitor = tabs.find(item => item.type == "monitor");
    if (!hasMonitor) {
      Object.assign(style, { gridTemplateColumns: "100%" });
    }
    // console.log(tabs);
    return (
      <div className={scss["grid"]} style={style}>
        <div>
          <table style={{ marginBottom: "12px" }}>
            <tbody>
              <tr>
                <td>监测类型</td>
                <td>{window.currentMenu.title}</td>
                <td>位置</td>
                <td>{address}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ position: "relative" }}>
            <Tabs onChange={e => e} animated={false}>
              {tabs
                .filter(item => item.type == "monitorData")
                .map((item, i) => (
                  <TabPane tab={item.name} key={i + ""} style={{}}>
                    <Table
                      pagination={{
                        pageSize: 3,
                        // showPageSize: true,
                        itemRender: (page, type, originalElement) =>
                          type === "prev" ? (
                            <a>上一页</a>
                          ) : type === "next" ? (
                            <a>下一页</a>
                          ) : (
                            originalElement
                          )
                      }}
                      // columns={columns}
                      columns={item.items.map(e => ({
                        title: e.itemName,
                        dataIndex: JSON.parse(e.source).key!,
                        key: JSON.parse(e.source).key!,
                        align: "center",
                        render: text =>
                          e.itemName.indexOf("报警设备") > -1 && text > 0 ? (
                            <a
                              onClick={e =>
                                this.showModal(
                                  JSON.parse(item.items[0].source).companyId
                                )
                              }
                            >
                              {text}
                            </a>
                          ) : (
                            text
                          )
                      }))}
                      // dataSource={dataSource}
                      dataSource={[
                        item.items.reduce((result, item) => {
                          if (item.source) {
                            let source = JSON.parse(item.source);
                            result[source.key] = source.value;
                          }
                          return result;
                        }, {})
                      ]}
                    />
                  </TabPane>
                ))}
            </Tabs>
            <div
              className={scss["flex-center-between"] + " " + scss["themeBlue"]}
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                lineHeight: "44px",
                marginRight: "6px"
              }}
            >
              <div />
              <div className={""}>
                {/* <label>点位名称:</label>
              <Select defaultValue="白云001">
                <Option key={1} value={"白云001"}>
                  白云001
                </Option>
                <Option key={2} value={"白云002"}>
                  白云002
                </Option>
                <Option key={3} value={"白云003"}>
                  白云003
                </Option>
              </Select> */}
                {/* <label>监测时间:</label>
                <DatePicker
                  defaultValue={moment(new Date(), dateFormat)}
                  format={dateFormat}
                /> */}
                {/* <RangePicker
                defaultValue={[
                  moment("2015/01/01", dateFormat),
                  moment("2019/01/01", dateFormat)
                ]}
                format={dateFormat}
              /> */}
              </div>
            </div>
          </div>
        </div>
        {hasMonitor ? (
          <div
            style={{
              display: "grid",
              // gridTemplateRows: "5fr 3fr",
              height: "100%"
            }}
          >
            <div style={{ minWidth: "200px", height: "350px" }}>
              <Carousel
                dots={false}
                infinite={true}
                speed={500}
                arrows={true}
                slidesToShow={1}
                swipeToSlide={true}
                slidesToScroll={1}
                prevArrow={<img src={"./images/ecology/icon_arrowleft.png"} />}
                nextArrow={<img src={"./images/ecology/icon_arrowright.png"} />}
              >
                {tabs
                  .filter(item => item.type == "monitor")
                  .map((item, i) => (
                    <div key={i}>
                      <VideoPlayer
                        sources={[{ src: item.str! }]}
                        triggerRef={ref => (this.videoRef.current = ref)}
                        style={{ height: "100%", width: "100%" }}
                      />
                    </div>
                  ))}
              </Carousel>
            </div>
            {/* <div style={{ width: "380px", margin: "10px auto 15px" }}>
              <CarouselCard data={config.monitors[0].data} onClick={e => e} />
            </div> */}
          </div>
        ) : null}
        <Modal
          {...modalProps}
          footer={null}
          centered
          mask={false}
          destroyOnClose={true}
          onCancel={e =>
            this.setState({
              modalProps: { ...modalProps, visible: false }
            })
          }
          className={scss["ecology-modal-table"]}
        >
          <div>
            <Collapse
              accordion
              defaultActiveKey={["0"]}
              onChange={(key: string) => {
                if (key) {
                  this.setState({ panelKey: key });
                  this.getAlarmLogList(deviceList[Number(key)].deviceId);
                }
              }}
              expandIconPosition="right"
            >
              {deviceList.map((item, i) => (
                <Panel header={item.deviceName} key={i}>
                  {i == panelKey ? (
                    <Table
                      pagination={{ pageSize: 5 }}
                      columns={detailTableColumns}
                      align="center"
                      dataSource={alarmLogList[deviceList[i].deviceId]}
                      loading={loading}
                    />
                  ) : (
                    ""
                  )}
                </Panel>
              ))}
            </Collapse>
          </div>
        </Modal>
        {/* <TableDetailModal {...modalProps} /> */}
      </div>
    );
  }
}

// export const TableDetailModal = ({
//   visible,
//   data,
//   onClick,
//   style = undefined
// }: {
//   visible;
//   data?: Array<{
//     code?: string;
//     thumbnail: string;
//     name?: string;
//     url?: string;
//   }>;
//   onClick?: (e) => void;
//   style?: CSSProperties;
// }) => {
//   return (
//     <Modal
//       visible={visible}
//       footer={null}
//       centered
//       destroyOnClose={true}
//       onCancel={e => this.setState({ modalVisible: false })}
//       className={scss["grid"]}
//       style={style}
//     >
//       sdfh
//       {/* <Table
//         pagination={{ pageSize: 6 }}
//         // columns={columns}
//         columns={item.items.map(item => ({
//           title: item.itemName,
//           dataIndex: item.source && JSON.parse(item.source).key!,
//           key: item.source && JSON.parse(item.source).key!,
//           render: text =>
//             item.itemName.indexOf("报警设备") > -1 && text > 0 ? (
//               <a>{text}</a>
//             ) : (
//               text
//             )
//         }))}
//         align="center"
//         // dataSource={dataSource}
//         dataSource={[
//           item.items.reduce((result, item) => {
//             if (item.source) {
//               let source = JSON.parse(item.source);
//               result[source.key] = source.value;
//             }
//             return result;
//           }, {})
//         ]}
//       /> */}
//     </Modal>
//   );
// };

export const CarouselCard = ({
  data,
  onClick,
  style = undefined
}: {
  data: Array<{
    code?: string;
    thumbnail: string;
    name?: string;
    url?: string;
  }>;
  onClick?: (e) => void;
  style?: CSSProperties;
}) => {
  const [time, setTime] = useState("");
  useEffect(() => {
    setInterval(() => {
      setTime(moment(new Date()).format("HH:mm:ss"));
    });
  }, []);
  return (
    <Carousel
      // ref={this.slider}
      dots={false}
      infinite={true}
      speed={1000}
      arrows={true}
      slidesToShow={2}
      swipeToSlide={true}
      slidesToScroll={1}
      prevArrow={<img src={"./images/ecology/icon_arrowleft.png"} />}
      nextArrow={<img src={"./images/ecology/icon_arrowright.png"} />}
      style={style}
    >
      {data.map((item, i) => (
        <div
          key={i}
          className={scss["pointer"] + " " + scss["monitor-item"]}
          onClick={e => {}}
        >
          {item.code ? <h5>{item.code}</h5> : null}
          <div
            className={scss["bg-item"]}
            style={{
              backgroundImage: `url(${item.thumbnail})`,
              height: vh(92)
            }}
          />
          <div className={scss["flex"] + " " + scss["meta"]}>
            <div className={scss["flex"]}>
              <span className={scss["mark"]} />
              <h5>{item.name}</h5>
            </div>
            <h5 style={{ fontFamily: "arial" }}>{time}</h5>
          </div>
        </div>
      ))}
    </Carousel>
  );
};
