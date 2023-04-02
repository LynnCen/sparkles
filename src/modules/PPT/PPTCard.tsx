import { Component } from "react";
import { Button, message, Collapse } from "antd";
import FatherMenuPanel from "./FatherMenuPanel";
import ShareService from "../../services/ShareService";
import Search from "antd/lib/input/Search";
import { debounce } from "../../utils/common";
import { warnHandler } from "../Modal/MarkerModal";
import { method, sortMenuParams } from "./mixin";

const css = require("../../styles/custom.css");
const scss = require("../../styles/scss/ppttab.scss");
const oneMenu = {
  title: "一级菜单",
  icon: "",
  isOpen: true,
  sub: []
};

interface Props {
  animationId: number;
  onemenuVos: any[];
}
interface States {
  activeKey?: Array<string | number> | string | number;
  oneMenuList: any[];
  warn: boolean;
}
@method("sortMenu")
export default class extends Component<Props, States> {
  keyword = "";
  sortMenu: (args: sortMenuParams) => Promise<any>;
  constructor(props) {
    super(props);
    this.state = {
      activeKey: "",
      oneMenuList: props.onemenuVos || [],
      warn: false
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ oneMenuList: props.onemenuVos });
  }

  get filteredMenuList() {
    const { onemenuVos } = this.props;
    return this.keyword
      ? onemenuVos.filter(m => m.title.includes(this.keyword) || this.keyword.includes(m.title))
      : onemenuVos;
  }

  onSearch = debounce(val => {
    this.keyword = val;
    this.setState({ oneMenuList: this.filteredMenuList, activeKey: "" });
  }, 500);

  addMenu = () => {
    const { oneMenuList } = this.state;
    if (oneMenuList.some(e => !e.id)) warnHandler(this);
    else {
      this.insertMenu(oneMenuList);
      this.setState({ oneMenuList: this.filteredMenuList });
      warnHandler(this, "");
    }
  };

  delMenu = async index => {
    const { oneMenuList } = this.state;
    const { onemenuVos } = this.props;
    const id = oneMenuList[index].id;
    if (id) {
      await ShareService.delMenu({ id, animationId: this.props.animationId }).then(r => {
        onemenuVos.splice(onemenuVos.findIndex(e => e.id == id), 1);
      });
    } else onemenuVos.splice(onemenuVos.findIndex(e => !e.id), 1);
    if (!onemenuVos.length) {
      this.insertMenu(onemenuVos);
    }
    this.setState({ oneMenuList: this.filteredMenuList, activeKey: "" });
  };

  insertMenu = oneMenuList => oneMenuList.unshift({ ...oneMenu, sub: [] });

  updateMenu = (index, menu) => {
    Object.assign(this.filteredMenuList[index], menu);
    this.setState({ oneMenuList: this.filteredMenuList });
  };

  // handleLayerChange = (index, layerId) => {
  //   const { oneMenuList } = this.state;
  //   oneMenuList[index].layerId = layerId;
  //   this.setState({ oneMenuList });
  // };
  /**
   * @param move 1 up | -1 down
   */
  move(index, move) {
    const { oneMenuList, activeKey: k } = this.state;
    this.sortMenu({
      type: 1,
      fatherId: this.props.animationId,
      list: oneMenuList,
      index,
      move,
      reverse: 1
    }).then(r => {
      this.setState({ oneMenuList: r, activeKey: k ? String(index - move) : k });
    });
  }

  render() {
    const { animationId } = this.props;
    const { activeKey, oneMenuList, warn } = this.state;
    return (
      <div className={scss["tabCard"]}>
        <div className={css["flex-center-between"]}>
          <Search
            placeholder={"请输入查询内容"}
            className={css["m-r-sm"]}
            onSearch={this.onSearch}
            onChange={e => this.onSearch(e.target.value)}
          />
          <Button type="primary" onClick={this.addMenu}>
            添加
          </Button>
        </div>
        <Collapse
          accordion
          expandIconPosition="right"
          defaultActiveKey={String(0)}
          activeKey={String(activeKey)}
          onChange={key => {
            this.setState({ activeKey: key });
          }}
          className={scss["right-collapse"]}
        >
          {oneMenuList.map((item, i) => {
            return (
              item && (
                <FatherMenuPanel
                  key={i}
                  onClick={() => {
                    this.setState({ activeKey: i });
                  }}
                  className={!item.id && warn ? scss["warn"] : ""}
                  onChange={e => this.updateMenu(i, e)}
                  isLast={i === oneMenuList.length - 1}
                  isFirst={i === 0}
                  onDelete={() => this.delMenu(i)}
                  menu={item}
                  animationId={animationId}
                  moveUp={() => this.move(i, 1)}
                  moveDown={() => this.move(i, -1)}
                />
              )
            );
          })}
        </Collapse>
      </div>
    );
  }
}
