import { Component, CSSProperties } from "react";
import { message, Pagination, Input, Spin, Icon, Button, Popover } from "antd";
import { default as DataService } from "../../services/DataService";
import ImageShow from "../../components/ImageShow";
import Config from "../../config/Config";

const pCss = require("../../styles/scss/public.scss");

/**
 * @name IconSelector
 * @create: 2019/4/24
 * @author: bubble
 * @description: 图标选择
 */

interface IconSelectorProps {
  classType: string; //1
  onSelect: (url) => void;
  value: string; //Input placeholder
  width?: string;
  type?: "input" | "circle" | "square" | "square22";
  color?: string;
  style?: CSSProperties;
  className?: string;
}

interface IconSelectorStates {
  classList: any[];
  loading: boolean;
  iconList: any[];
  page: number;
  classId: any;
  total: number;
  name: string;
  visible: boolean;
  url: string;
}

class IconSelector extends Component<IconSelectorProps, IconSelectorStates> {
  size = 30;
  keyword = "";
  static defaultProps = {
    type: "input",
    width: "auto",
    color: "",
    style: { width: "auto" },
    className: ""
  };

  constructor(props: IconSelectorProps) {
    super(props);
    this.state = {
      classList: [],
      loading: false,
      iconList: [],
      page: 1,
      classId: undefined,
      total: 0,
      name: "",
      visible: false,
      url: ""
    };
  }

  componentDidMount() {
    this.setState({ name: this.props.value });
    this.getAllClass();
    this.getIconList(1);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value != nextProps.value) {
      this.setState({ name: nextProps.value });
    }
  }

  getOptions = list => {
    const classList: any[] = [];
    for (const item of list) {
      const classObj = {};
      classObj["value"] = item.id;
      classObj["label"] = item.name;
      classList.push(classObj);
    }
    this.setState({ classList });
  };

  /**
   * @description 获取分类列表
   */
  getAllClass = () => {
    const { classType } = this.props;
    const data = { type: classType };
    DataService.getAllClass(data, (flag, res) => {
      if (flag) {
        this.getOptions(res.data);
      } else {
        message.error(res.message);
      }
    });
  };

  /**
   * @description 选中类别变化重新获取列表
   */
  classChange = value => {
    this.getIconList(1, value);
  };

  /**
   * @description 获取图标列表
   * @param page
   * @param classId
   */
  getIconList = (page, classId?) => {
    this.setState({
      loading: true
    });
    const base = {
      page,
      type: this.props.classType,
      size: this.size,
      key: this.keyword
    };
    const data = classId ? { ...base, classId } : base;
    DataService.findIcon(data, (flag, res) => {
      if (flag) {
        this.setState({
          iconList: res.data.list,
          loading: false,
          page,
          classId: classId ? classId : undefined,
          total: res.data.count
        });
      } else {
        message.error(res.message);
      }
    });
  };

  paginationChange = page => {
    this.getIconList(page);
  };

  onSelect = item => {
    this.setState({
      visible: false,
      name: item.url
    });
    this.props.onSelect(item.url);
  };

  render() {
    const { iconList, page, total, loading, name } = this.state;
    const { value, width, style, className, type, color } = this.props;

    return (
      <div style={{ ...style, width, lineHeight: 0 }} className={className}>
        {type == "input" ? (
          <Input
            disabled={true}
            addonAfter={
              <IconPopover
                loading={loading}
                page={page}
                total={total}
                iconList={iconList}
                pageSize={this.size}
                paginationChange={this.paginationChange}
                onSelect={this.onSelect}
              >
                <Icon type="more" style={{ transform: "rotate(90deg)" }} />
              </IconPopover>
            }
            placeholder={name}
          />
        ) : type == "circle" || type == "square" || type == "square22" ? (
          <IconPopover
            loading={loading}
            page={page}
            total={total}
            iconList={iconList}
            pageSize={this.size}
            paginationChange={this.paginationChange}
            onSelect={this.onSelect}
          >
            <div
              className={[pCss[`icon-${type}`], pCss["flex"]].join(" ")}
              style={{ backgroundColor: color || "rgba(0,0,0,0.80)" }}
            >
              <div
                style={{
                  backgroundImage: value
                    ? `url(${Config.apiHost + (name ? name : value)})`
                    : "none",
                  height: type == "circle" ? "75%" : "95%",
                  width: type == "circle" ? "75%" : "95%",
                  margin: "auto",
                  backgroundSize: "contain"
                }}
              />
            </div>
          </IconPopover>
        ) : null}
      </div>
    );
  }
}

export default IconSelector;
const IconPopover = ({
  loading,
  iconList,
  page,
  total,
  pageSize,
  paginationChange,
  onSelect,
  children
}) => {
  return (
    <Popover
      title="选择图标"
      placement="bottomRight"
      trigger={"click"}
      content={
        <div style={{ width: 200 }} className={pCss["text-center"] + " " + pCss["m-y-sm"]}>
          <Spin spinning={loading}>
            {iconList.map((item, i) => {
              return (
                <ImageShow
                  imgUrl={item.url}
                  key={i}
                  title={item.name}
                  icon={true}
                  onClick={e => {
                    onSelect(item);
                    e.stopPropagation();
                  }}
                  check={null}
                />
              );
            })}
          </Spin>
          <div className={pCss["text-center"]} onClick={e => e.stopPropagation()}>
            <Pagination
              defaultCurrent={1}
              current={page}
              pageSize={pageSize}
              total={total}
              size="small"
              onChange={paginationChange}
            />
          </div>
        </div>
      }
    >
      <Button
        style={{
          position: "relative",
          padding: 0,
          margin: 0,
          height: "auto",
          border: "none",
          backgroundColor: "transparent"
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </Button>
    </Popover>
  );
};
