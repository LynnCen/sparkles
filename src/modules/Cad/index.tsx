import { Component } from "react";
import { PageHeader, Input, Button, Pagination, Empty, message } from "antd";
import { connect } from "dva";
import { Dispatch } from "redux";
import { Panel, CadSourceDto, defaultPanel } from "../../stores/cadModel";
import CadCollapse from "./CadCollapse";
import Config from "../../config/Config";
import CADService from "../../services/CadService";
import { debounce } from "../../utils/common";
import { CadModuleData } from "../../components/model/CAD";
import StrConfig from "../../config/StrConfig";
const { Search } = Input;

const css = require("../../styles/custom.css");
const scss = require("../../styles/scss/cad.scss");

interface Props {
  panels: Panel[];
  cadSource: CadSourceDto[];
  backups: Panel[];
  dispatch: Dispatch<Object>;
}
interface States {
  keyword?: string;
  current: number;
  total: number;
  warn?: boolean;
  newId?: number | undefined;
}
@connect(({ cadModel }) => ({
  panels: cadModel.panels,
  backups: cadModel.backups,
  cadSource: cadModel.cadSource
}))
export default class extends Component<Props, States> {
  pageSize = process.env.NODE_ENV != "production" ? 2 : 10;
  searchedIndices: number[] = [];

  constructor(props) {
    super(props);
    this.state = {
      // keyword: ""
      current: 1,
      total: props.panels.length,
      warn: false
    };
  }
  componentWillMount() {
    !this.props.cadSource.length && console.log(this.props.cadSource);
    // CADService.getSelectionList({ planId: Config.PLANID }, (flag, res) => {
    //   flag
    //     ? this.props.dispatch({
    //         type: "cadModel/setProp",
    //         payload: { cadSource: res.data.list }
    //       })
    //     : message.error(res.message);
    // });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: "cadModel/setProp",
      payload: { panels: this.props.backups }
    });
  }
  componentWillReceiveProps(nextProps) {
    const panels = nextProps.panels;
    const { total } = this.state;
    if (panels.length !== this.props.panels.length || panels.length != total) {
      this.setState({ total: panels.length });
    }
    if (
      panels[0] &&
      panels[0].id &&
      this.props.panels[0] &&
      !this.props.panels[0].id
    ) {
      this.setState({ newId: panels[0].id }); //新增id
      setTimeout(() => this.setState({ newId: undefined }), 500);
    }
  }
  handleSearch = (keyword: string) => {
    // this.searchedIndices = [];
    // const panels = this.props.backups.filter((e, i) => {
    //   let f = e.title.indexOf(keyword) > -1 || keyword.indexOf(e.title) > -1;
    //   f && this.searchedIndices.push(i);
    //   return f;
    // });
    const panels = this.props.backups.filter(
      (e, i) => e.title.indexOf(keyword) > -1 || keyword.indexOf(e.title) > -1
    );
    this.props.dispatch({ type: "cadModel/setProp", payload: { panels } });
    this.setState({ current: 1 });
  };
  handleAdd = e => {
    if (!this.props.panels.filter(e => e.id !== null).every(e => e.id))
      this.warnHandler();
    else {
      this.props.dispatch({ type: "cadModel/addPanel" });
      const cadModel = new CadModuleData({
        position: [],
        lookAt: [],
        list: []
      });
      this.props.panels[0].data = cadModel;
      this.setState({ current: 1 });
    }
  };
  pageChange = (page: number, pageSize: number) => {
    if (!this.props.panels.every(e => e.id)) this.warnHandler();
    else this.setState({ current: page });
  };
  warnHandler = (msg = StrConfig.unsavedWarnMsg) => {
    this.setState({ warn: true });
    setTimeout(() => this.setState({ warn: false }), 500);
    message.warn(msg);
  };
  render() {
    const { panels } = this.props;
    const { current, total, warn, newId } = this.state;
    return (
      <div className={scss["container"]}>
        <div className={scss["header"]}>
          <PageHeader title={"CAD数据"} />
          <div className={scss["header-operation"]}>
            <div className={css["flex"]}>
              <Search
                placeholder="请输入查询内容"
                onChange={e =>
                  debounce(this.handleSearch.bind(this, e.target.value), 500)()
                }
              />
              <Button type="primary" className={""} onClick={this.handleAdd}>
                添加
              </Button>
            </div>
            <hr />
          </div>
        </div>
        <div className={scss["list-container"]}>
          {panels.length ? (
            panels
              .filter(e => e.id !== null)
              .slice((current - 1) * this.pageSize, current * this.pageSize)
              .map((item, i) => (
                // this.searchedIndices.length && (_i = this.searchedIndices[_i]);(
                // this.searchedIndices.length && (_i = this.searchedIndices[_i]);
                // console.log(item.id, newId, !item.id || newId === item.id),
                <CadCollapse
                  key={item.id || i}
                  i={(current - 1) * this.pageSize + i}
                  unfold={!item.id || newId === item.id}
                  className={!item.id && warn ? scss["warn"] : ""}
                  warnHandler={this.warnHandler}
                />
              ))
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
        <div className={scss["footer"] + " " + css["flex-center"]}>
          <Pagination
            defaultCurrent={1}
            pageSize={this.pageSize}
            current={current}
            total={total}
            size="small"
            onChange={this.pageChange}
          />
        </div>
      </div>
    );
  }
}
