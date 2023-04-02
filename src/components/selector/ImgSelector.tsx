import { Component, CSSProperties } from "react";
import { Input, message, Pagination, Icon, Spin } from "antd";
import DataService from "../../services/DataService";
import ImageShow from "../../components/ImageShow";
import VrpModal from "../../components/VrpModal";

const css = require("../../styles/custom.css");

/**
 * @name ImgSelector
 * @create: 2019/4/23
 * @description: 选择图片
 */

interface ImgSelectorProps {
  onSelect: (url, thumbnail?) => void;
  video?: boolean;
  value: string;
  width: string;
  multi?: boolean;
  inputDisabled?: boolean;
  onChange?: (val) => void | boolean;
  style?: CSSProperties;
}

interface ImgSelectorStates {
  list: any[];
  visible: boolean;
  pageNum: number;
  total: number;
  name: string;
  loading: boolean;
  multiUrls: Array<string>;
}

class ImgSelector extends Component<ImgSelectorProps, ImgSelectorStates> {
  pageSize = 10;
  keyword = "";

  static defaultProps = {
    width: "350px",
    inputDisabled: true,
    style: {}
  };

  constructor(props: ImgSelectorProps) {
    super(props);
    this.state = {
      list: [],
      visible: false,
      pageNum: 1,
      total: 0,
      name: props.value || "",
      loading: false,
      multiUrls: []
    };
  }

  componentDidMount() {
    this.getList(1);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.video != this.props.video) {
      this.getList(1);
    }
    if (prevProps.value != this.props.value) {
      this.setState({ name: this.props.value });
    }
  }

  showModal = () => {
    this.setState({
      visible: !this.state.visible
    });
  };

  /**
   * @description 获取列表
   * @param page
   */
  getList = page => {
    this.setState({
      loading: true
    });
    const data = { page, size: this.pageSize, key: this.keyword };
    const url = this.props.video ? "/Video/getList" : "/Picture/getList";
    DataService.getList(url, data, (flag, res) => {
      if (flag) {
        const { list, count } = res.data;
        // this.props.multi &&
        list.forEach(item => {
          if (
            typeof this.state.name == "string" &&
            this.state.name.indexOf(",") > -1 &&
            this.state.name
              .split(",")
              .find(url => (item.url || item.thumbnail) == url)
          ) {
            item.checked = true;
          }
        });
        this.setState({
          list,
          pageNum: page,
          total: count
        });
      } else {
        message.error(res.message);
      }
      this.setState({
        loading: false
      });
    });
  };

  paginationChange = page => {
    this.getList(page);
  };

  onSelect = i => {
    let item = this.state.list[i];
    const { multi, video } = this.props;
    const { multiUrls } = this.state;
    item.checked = !item.checked;
    let index = multiUrls.indexOf(item.url);
    let urls = item.checked
      ? multiUrls.concat(item.url)
      : multiUrls.slice(0, index).concat(multiUrls.slice(index + 1));

    if (multi) {
      this.setState({
        multiUrls: urls,
        name: urls.toString()
      });
    } else {
      this.setState({
        visible: false,
        name: item.url
      });
    }
    video
      ? this.props.onSelect(item.url, item.thumbnail)
      : this.props.onSelect(urls);
  };
  onChange = e => {
    const { inputDisabled, onChange } = this.props;
    if (!inputDisabled && onChange) {
      this.setState({ name: e.target.value });
      onChange(e.target.value);
    }
  };

  render() {
    const { video, width, inputDisabled, style, onChange } = this.props;
    const { list, visible, pageNum, total, loading, name } = this.state;
    const title = video ? "选择视频" : "选择图片";
    return (
      <>
        {visible ? (
          <VrpModal
            defaultPosition={{ x: 280, y: 200 }}
            title={title}
            style={{ width: 420 }}
            // height={500}
            footer={null}
            fixed={true}
            onClose={this.showModal}
          >
            <div className={"text-center m-y-sm"}>
              <Spin spinning={loading}>
                {" "}
                {list.map((item, i) => {
                  return (
                    <>
                      <ImageShow
                        imgUrl={video ? item.thumbnail : item.url}
                        title={item.name}
                        key={i}
                        icon={false}
                        onClick={() => this.onSelect(i)}
                        check={
                          <div
                            style={{
                              height: "100%",
                              borderRadius: "4px",
                              background: `${
                                item.checked ? "rgba(0,0,0,.5)" : "none"
                              }`
                            }}
                          />
                        }
                      />
                    </>
                  );
                })}
              </Spin>
              <div className={css["text-center"]}>
                <Pagination
                  defaultCurrent={1}
                  current={pageNum}
                  pageSize={this.pageSize}
                  total={total}
                  size="small"
                  onChange={this.paginationChange}
                />
              </div>
            </div>
          </VrpModal>
        ) : null}
        <Input
          style={{ width, ...style }}
          disabled={inputDisabled}
          addonAfter={
            <Icon
              type="more"
              style={{ transform: "rotate(90deg)" }}
              onClick={this.showModal}
            />
          }
          onChange={this.onChange}
          placeholder={name}
          value={name}
        />
      </>
    );
  }
}

export default ImgSelector;
