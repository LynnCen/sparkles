import { Component } from "react";
import { Input, Icon, Table, Select, Popover } from "antd";
import VrpModal from "../../../components/VrpModal";
import { connect } from "dva";
import { Dispatch } from "redux";
import { surveyItems } from "../../../config/StrConfig";
import Config from "../../../config/Config";
const { Option } = Select;

const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/markerModal.scss");

/**
 * @name DragTable
 * @create: 2019/8/13
 * @description: 表格
 */
interface Props {
  title: string;
  // placeholder: string;
  // i: number;
  // index: number;
  // value?: { id?; monitor?; addr?; type?; unit? };
  value: string;
  pageSize?: number;
  surveyList: Array<any>;
  surveyListCount: number;
  // waterElemList: Array<any>;
  dispatch: Dispatch<object>;
  onChange: (value) => void;
  closeModal: () => void;
}

interface States {
  // list: any[];
  visible: boolean;
  // placeholder: string;
  selectedRowKeys: [];
  // page: number;
  // count: number;
  pagination: {
    total: number;
    current: number;
  };
  // name: string;
  loading: boolean;
  hoverItem: any;
}
@connect(({ markerModel } /*, ownProps*/) => ({
  surveyList: markerModel.surveyList,
  surveyListCount: markerModel.surveyListCount
}))
export default class DragTable extends Component<Props, States> {
  keyword = "";
  echart;
  dateRange = 3;
  interval;
  static defaultProps = {
    pageSize: 10
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      visible: false,
      // placeholder: this.props.placeholder || "",
      selectedRowKeys: [],
      pagination: {
        total: props.surveyListCount,
        current: 1
      },
      loading: false,
      hoverItem: null
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.surveyListCount != nextProps.surveyListCount) {
      this.setState(state => ({
        pagination: { ...state.pagination, total: nextProps.surveyListCount }
      }));
    }
  }
  showModal = visible => {
    if (visible) {
      this.props.dispatch({
        type: "markerModel/getSurveyList",
        payload: { page: 1, size: this.props.pageSize, planId: Config.PLANID }
      });
    }
    this.setState({ visible });
  };
  onTableChange = (pager, filters, sorter) => {
    this.setState(state => ({
      pagination: { ...state.pagination, current: pager.current }
    }));
    this.props.dispatch({
      type: "markerModel/getSurveyList",
      payload: {
        page: pager.current,
        size: this.props.pageSize,
        planId: Config.PLANID
      }
    });
  };
  onRowChange = row => {
    // console.log(row);
    let value = JSON.stringify({
      id: row.id,
      type: row.type,
      monitor: row.monitor,
      addr: row.addr,
      unit: row.unit,
      itemName: surveyItems.monitors[row.monitor].type.find(
        e => e.value == row.type
      ).name
    });
    // this.setState({ placeholder: value });
    this.props.onChange(value);
  };

  render() {
    const { title, surveyList, value, pageSize, dispatch } = this.props;
    const { visible, placeholder, pagination } = this.state;
    let source = {};
    try {
      source = JSON.parse(value);
    } catch (e) {
      console.warn("非表格数据源");
    }
    const selectedSurveyIdx = surveyList.findIndex(
      e => e.id == (source && source.id)
    );
    const rowSelection = {
      fixed: true,
      selectedRowKeys: [selectedSurveyIdx],
      onChange: (selectedRowKeys, selectedRows) =>
        this.onRowChange(selectedRows[0]),
      hideDefaultSelections: true,
      type: "radio" as "radio"
    };
    return (
      <>
        {
          <VrpModal
            defaultPosition={{ x: 300, y: 100 }}
            title={title}
            style={{ width: "max-content" }}
            // height={500}
            footer={null}
            fixed={true}
            onClose={this.props.closeModal}
          >
            <Table
              bordered={true}
              rowSelection={rowSelection}
              pagination={{ ...pagination, pageSize }}
              onChange={this.onTableChange}
              columns={Object.keys(surveyItems.columns).map(key => ({
                key,
                dataIndex: key,
                title: surveyItems.columns[key],
                render: (text, record, idx) => {
                  const monitor = surveyItems.monitors[record.monitor];
                  return key == "addr" ? (
                    monitor.addr[record.addr]
                  ) : key == "monitor" ? (
                    monitor.value
                  ) : key == "type" ? (
                    <Select
                      value={selectedSurveyIdx == idx ? text : "D101"}
                      style={{}}
                      onChange={val => {
                        console.log(val, text, record, idx);
                        const unit = surveyItems.monitors[
                          surveyList[idx].monitor
                        ].type.find(t => t.value == val).unit;
                        dispatch({
                          type: "markerModel/setSurveyProp",
                          payload: {
                            i: idx,
                            type: val,
                            unit
                          }
                        });
                        this.onRowChange({
                          ...(JSON.stringify(source) == "{}"
                            ? record
                            : surveyList.find(e => e.id == source.id)),
                          type: val,
                          unit
                        });
                      }}
                    >
                      {surveyItems.monitors[surveyList[idx].monitor].type.map(
                        (t, i) => (
                          <Option key={i} value={t.value}>
                            {t.name}
                          </Option>
                        )
                      )}
                    </Select>
                  ) : (
                    text
                  );
                }
              }))}
              onRow={(record, index) => {
                return {
                  onClick: e => {
                    console.log(record);
                  },
                  onDoubleClick: e => {},
                  onContextMenu: e => {},
                  onMouseEnter: e => {}, // 鼠标移入行
                  onMouseLeave: e => {}
                };
              }}
              dataSource={surveyList.map((item, i) => {
                const monitor = surveyItems.monitors[item.monitor];
                return {
                  ...item,
                  key: i,
                  index: (pagination.current - 1) * pageSize + i + 1,
                  type: selectedSurveyIdx == i ? source!.type : "D101",
                  unit:
                    selectedSurveyIdx == i
                      ? source!.unit
                      : monitor.type.find(t => t.value == "D101").unit
                };
              })}
            />
          </VrpModal>
        }
        {/* <Input
          disabled={true}
          addonAfter={
            <Icon
              type="more"
              style={{ transform: "rotate(90deg)" }}
              onClick={e => this.showModal(true)}
            />
          }
          placeholder={placeholder}
        /> */}
      </>
    );
  }
}
