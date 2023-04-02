import { Component } from "react";
import {
  PageHeader,
  Input,
  Button,
  Pagination,
  Skeleton,
  Checkbox,
  Popconfirm,
  Empty,
  message
} from "antd";
import Config from "../../config/Config";
import { debounce } from "../../utils/common";
import VrpIcon from "../../components/VrpIcon";
import ContentModal from "../Modal/ContentModal";
import DataService from "../../services/DataService";
import { connect } from "dva";
import LayerService from "../../services/LayerService";
const { Search } = Input;

const css = require("../../styles/custom.css");
const scss = require("../../styles/scss/content.scss");

interface States {
  current: number;
  total: number;
  loading: boolean;
  data: object[];
  showModal: boolean;
  content: object | null;
  checkedIds: { [id: number]: boolean };
}
@connect()
export default class extends Component<{}, States> {
  pageSize = process.env.NODE_ENV === "development" ? 3 : 10;
  key = "";
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      total: 0,
      loading: true,
      data: [],
      showModal: false,
      content: null,
      checkedIds: {}
    };
  }
  componentDidMount() {
    this.getContents();
  }
  onSearch = e => {
    this.key = e.target.value;
    this.setState({ current: 1 });
    debounce(this.getContents, 500)();
  };
  getContents = (page = 1, size = this.pageSize) => {
    this.setState({ loading: true });
    DataService.getContents(
      { planId: Config.PLANID, page, size, key: this.key },
      (f, res) => {
        if (f) {
          this.setState({
            total: res.data.count,
            data: res.data.list,
            loading: false,
            checkedIds: {},
            current: page
          });
        } else message.error(res.message);
      }
    );
  };
  handleAdd = e => {
    this.setState({ content: null });
    if (this.state.content) {
      this.setState({ showModal: false });
      setTimeout(() => this.setState({ showModal: true }), 10);
    } else this.setState({ showModal: true });
  };
  pageChange = (page: number, pageSize: number) => {
    // this.setState({ current: page });
    this.getContents(page);
  };
  onEdit = content => {
    this.setState({ showModal: true, content });
    this.props.dispatch({
      type: "markerModel/setProp",
      payload: { id: content.id }
    });
  };
  onDelete = (item?) => {
    const { data, current, total } = this.state;
    let ids: number[];
    if (item) ids = [item.id];
    else {
      ids = Object.entries(this.state.checkedIds)
        .filter(([id, v]) => v)
        .map(([id, v]) => id);
    }
    DataService.delContent({ id: ids.join(",") }, (f, res) => {
      if (f) {
        ids.forEach(id => data.splice(data.findIndex(e => e.id == id), 1));
        if (data.length == 0 && current > 1) {
          this.getContents(current - 1); //当前页删完, 前一页
        } else if (
          (current == 1 && total <= this.pageSize) ||
          current == Math.ceil((total - ids.length) / this.pageSize)
        ) {
          //仅一页或尾页
          this.setState({
            total: total - ids.length,
            checkedIds: {},
            data
          });
        } else if (
          Math.ceil(total / this.pageSize) ==
          Math.ceil((total - ids.length) / this.pageSize)
        ) {
          this.getContents(current); //当前页未删完
        }
        message.success(res.message);
      } else message.error(res.message);
    });
  };

  /**
   * @description 多选框点击
   * @param e
   * @param id
   */
  checkChange = (e, id) => {
    const { checkedIds } = this.state;
    checkedIds[id] = e.target.checked;
    this.setState({ checkedIds });
  };
  /**
   * @description 全选
   */
  checkAllChange = checked => {
    const { checkedIds, data } = this.state;
    if (checked) {
      data.forEach(e => (checkedIds[e.id] = true));
    } else {
      data.forEach(
        e => (checkedIds[e.id] = e.id in checkedIds ? !checkedIds[e.id] : true)
      );
      console.assert(
        Object.keys(checkedIds).length == data.length,
        "checkdedIds are not completed"
      );
    }
    this.setState({ checkedIds });
  };
  closeModal = (e?) => this.setState({ showModal: false });
  onSubmit = ({ ...item }, close = true) => {
    const { content, data, total } = this.state;
    let idx;
    if (content) {
      idx = data.findIndex(e => e.id === content.id);
      this.setState({ data: data.map((e, i) => (i == idx ? item : e)) });
    } else {
      data.push(item);
      data.length > this.pageSize
        ? this.getContents(Math.ceil((total + 1) / this.pageSize))
        : this.setState({ data, total: total + 1 });
    }
    this.setState({ content: item });
    close && this.closeModal();
  };

  render() {
    const {
      current,
      total,
      data,
      loading,
      showModal,
      content,
      checkedIds
    } = this.state;
    return (
      <div className={scss["container"]}>
        <PageHeader title={"信息栏"} />
        <main>
          <div>
            <div className={css["flex"]} style={{ marginBottom: 8 }}>
              <Search
                placeholder="请输入查询内容"
                onChange={this.onSearch}
                style={{ marginRight: 8 }}
              />
              <Button type="primary" onClick={this.handleAdd}>
                添加
              </Button>
            </div>
            <div className={scss["list-container"]}>
              <Skeleton loading={loading} title={false} active>
                <ul className={css["vrp-list-ul"]}>
                  {data.map((item, i) => (
                    <ContentItem
                      key={item.id}
                      data={item}
                      onEdit={(e?) => this.onEdit(item)}
                      onDelete={(e?) => this.onDelete(item)}
                      checked={checkedIds[item.id]}
                      checkChange={e => this.checkChange(e, item.id)}
                    />
                  ))}
                </ul>
              </Skeleton>
            </div>
            <Pagination
              defaultCurrent={1}
              pageSize={this.pageSize}
              current={current}
              total={total}
              size="small"
              onChange={this.pageChange}
              className={css["flex-center"]}
            />
          </div>
        </main>
        <footer className={css["flex-center-evenly"]}>
          <Button onClick={() => this.checkAllChange(true)}>全选</Button>
          <Button onClick={() => this.checkAllChange(false)}>反选</Button>
          <Popconfirm
            title={"确定删除？"}
            okText={"确定"}
            cancelText={"取消"}
            onConfirm={(e?) => this.onDelete()}
          >
            <Button
              disabled={
                !Object.values(this.state.checkedIds).filter(Boolean).length
              }
            >
              删除所选
            </Button>
          </Popconfirm>
        </footer>
        {showModal && (
          <ContentModal
            data={content}
            closeModal={this.closeModal}
            onSubmit={this.onSubmit}
          />
        )}
      </div>
    );
  }
}
const ContentItem = ({ data, checked, checkChange, onEdit, onDelete }) => {
  return (
    <li className={css["vrp-list-item"]}>
      <div className={css["after-content"]}>
        <Checkbox checked={checked} onChange={checkChange} />
        <div className={css["title"] + " " + css["m-l-sm"]}>{data.title}</div>
      </div>
      <div className={css["item-icons"]}>
        <VrpIcon iconName={"icon-edit"} title={"编辑"} onClick={onEdit} />
        <Popconfirm
          title={"确定删除？"}
          okText={"确定"}
          cancelText={"取消"}
          onConfirm={onDelete}
        >
          <span>
            <VrpIcon iconName={"icon-delete"} title={"删除"} />
          </span>
        </Popconfirm>
      </div>
    </li>
  );
};
