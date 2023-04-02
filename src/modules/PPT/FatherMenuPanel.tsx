import { Component, useRef, useEffect, useState } from "react";
import { Collapse, Icon, Input, Switch, Tooltip, Dropdown, Menu, Popconfirm, message } from "antd";
import { CollapsePanelProps } from "antd/lib/collapse";
import ChildMenu from "./ChildMenu";
import Play from "../../components/tools/Play";
import IconSelector from "../../components/selector/IconSelector";
import Config from "../../config/Config";
import ShareService from "../../services/ShareService";
import VrpIcon from "../../components/VrpIcon";
import { debounce } from "../../utils/common";
import { warnHandler } from "../Modal/MarkerModal";
import { method,sortMenuParams } from "./mixin";

const css = require("../../styles/custom.css");
const newCss = require("../../styles/new.css");
const scss = require("../../styles/scss/ppttab.scss");
const twoMenu = {
  title: "二级菜单",
  isOpen: true,
  template: "",
  feature: []
};

interface FatherMenuProps extends CollapsePanelProps {
  className: string;
  onClick: () => void;
  onChange: (menu: any) => void;
  onDelete: () => void;
  moveUp: () => void;
  moveDown: () => void;
  menu: any;
  isFirst: boolean;
  isLast: boolean;
  animationId: number;
}

interface FatherMenuStates {
  menu: any;
  isChange: boolean;
  isSaving: boolean;
  isEdit: boolean;
  subIndex: number;
  warn?: boolean;
}

const onClickStop = {
  onClick: e => e.stopPropagation(),
  onCancel: e => e.stopPropagation()
};
@method("sortMenu")
export default class extends Component<FatherMenuProps, FatherMenuStates> {
  sortMenu: (args: sortMenuParams) => Promise<any>;
  constructor(props: FatherMenuProps) {
    super(props);
    const { menu } = props;
    this.state = {
      menu,
      isChange: false,
      isSaving: false,
      isEdit: false,
      subIndex: -1
    };
  }

  componentWillReceiveProps(props) {
    const { menu } = props;
    if (!menu.sub.length) menu.sub = [{ ...twoMenu }];
    this.setState({ menu });
  }

  _handleChange = (save = false, update = true): Promise<any> | void => {
    const { menu } = this.state;
    if (save || !menu.id) {
      this.saveMenu(update);
    } else {
      this.setState({ isChange: true });
      this.props.onChange(menu);
    }
  };
  handleChange = debounce(this._handleChange, 1000);

  handleMenu = (key, value, update = true) => {
    const { menu } = this.state;
    menu[key] = value;
    this.setState({ menu }, this.handleChange.bind(this, true, update));
  };

  pushSub = sub => sub.push({ ...twoMenu, feature: [] });

  addSub = () => {
    const { menu } = this.state;
    if (!menu.sub.filter(e => e.id !== null).every(e => e.id)) return warnHandler(this);
    this.pushSub(menu.sub);
    this.setState({ menu, isEdit: false, subIndex: -1 }, this.handleChange);
    warnHandler(this, "");
    this.props.onClick();
  };

  delSub = index => {
    const { menu } = this.state;
    const { sub } = menu;
    let save = false;
    if (sub[index].id) {
      if (!("subList" in menu)) menu.subList = [];
      menu.subList.push(sub[index].id);
      save = true;
    }
    sub.splice(index, 1);
    if (!sub.length) {
      this.pushSub(sub);
    }
    this.setState({ menu }, this.handleChange.bind(this, save));
  };

  /**
   * @param move 1 up | -1 down
   */
  move = (index, move: 1 | -1) => {
    const { menu } = this.state;
    this.sortMenu({ type: 2, fatherId: menu.id, list: this.props.menu.sub, index, move }).then(
      r => {
        this.setState({ menu: { ...menu, sub: r } });
      }
    );
  };

  saveMenu = (update = true) => {
    const { menu } = this.state;
    const data = { planId: Config.PLANID, animationId: this.props.animationId };
    this.setState({ isSaving: true });
    return ShareService.saveMenu({ jsonString: JSON.stringify({ ...data, ...menu }) }).then(r => {
      let updMenu = {};
      update && (updMenu["menu"] = r.data);
      this.setState({ isChange: false, isSaving: false, ...updMenu });
      return this.props.onChange(r.data);
    });
  };

  // layerChange = (value: { checkedLayerId: number; checkedLayerName: string }) => {
  //   this.props.handleLayerChange(value.checkedLayerId);
  //   this.setState({ ...value, menu: this.state.menu, isChange: false });
  // };

  childMenu = (item, i) => (
    <ChildMenu
      key={i}
      className={!item.id && this.state.warn ? scss["warn"] : ""}
      menu={item}
      isEdit={this.state.isEdit}
      isFirst={i === 0}
      isLast={i === this.state.menu.sub.length - 1}
      isChange={this.state.isChange}
      preview={() => Play.preview(this.state.menu.sub, i)}
      onChange={this.handleChange}
      onDelete={() => this.delSub(i)}
      moveUp={() => this.move(i, 1)}
      moveDown={() => this.move(i, -1)}
      onEdit={isEdit => this.setState({ isEdit, subIndex: isEdit ? i : -1 })}
    />
  );

  render() {
    const { menu, isEdit, subIndex, isSaving, isChange } = this.state;
    return (
      <Collapse.Panel
        {...this.props}
        className={scss["tabpanel"] + " " + this.props.className}
        header={
          <div className={css["flex-center-between"]}>
            <IconSelector
              classType={"2"}
              onSelect={url => this.handleMenu("icon", url)}
              value={menu.icon}
              type="circle"
              style={{ width: 24, marginRight: 8 }}
            />
            <Input
              onChange={e => this.handleMenu("title", e.target.value, false)}
              placeholder="名称"
              // value={menu.title}
              {...(isChange ? {} : { value: menu.title })}
              {...(menu.title ? { defaultValue: menu.title } : {})}
              style={{ paddingRight: "46px" }}
              className={scss["menu-title"]}
              {...onClickStop}
            />
            <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              checked={Boolean(menu.isOpen)}
              onChange={(checked, e) => {
                this.handleMenu("isOpen", Number(checked));
              }}
              onClick={(checked, e) => e.stopPropagation()}
            />
          </div>
        }
        extra={
          <>
            <SavingIcon isSaving={isSaving} />
            {/* <LayerMenu
              layers={this.props.layers}
              isShow={true}
              layerChange={(value, clear?) => this.layerChange(value, clear ? -1 : subIndex)}
              selectedKeys={[checkedLayerId]}
            /> */}
            <Tooltip
              placement="left"
              title={
                <div {...onClickStop}>
                  {menu.sub.length > 0 && (
                    <Icon
                      type="caret-right"
                      className={newCss["vrp-btn-icon"]}
                      title={"预览"}
                      onClick={e => {
                        e.stopPropagation();
                        Play.preview(menu.sub);
                      }}
                    />
                  )}
                  {!this.props.isFirst && menu.id && (
                    <Icon
                      type="arrow-up"
                      onClick={e => {
                        e.stopPropagation();
                        this.props.moveUp();
                      }}
                      className={newCss["vrp-btn-icon"]}
                      title={"上移"}
                    />
                  )}
                  {!this.props.isLast && menu.id && (
                    <Icon
                      type="arrow-down"
                      onClick={e => {
                        e.stopPropagation();
                        this.props.moveDown();
                      }}
                      className={newCss["vrp-btn-icon"]}
                      title={"下移"}
                    />
                  )}
                  <Icon
                    type="plus"
                    style={{ fontSize: 17.5 }}
                    onClick={e => {
                      e.stopPropagation();
                      this.addSub();
                    }}
                    className={newCss["vrp-btn-icon"]}
                    title={"添加子级"}
                  />
                  <Popconfirm
                    title="确认是否删除"
                    onConfirm={e => {
                      e.stopPropagation();
                      this.props.onDelete();
                    }}
                    okText="确定"
                    cancelText="取消"
                    {...onClickStop}
                  >
                    <Icon type="close" className={newCss["vrp-btn-icon"]} title={"删除"} />
                  </Popconfirm>
                </div>
              }
              getPopupContainer={triggerNode => document.querySelector(".ant-drawer-body")}
              overlayClassName={scss["drawer-tooltip"]}
            >
              <Icon type="ellipsis" {...onClickStop} />
            </Tooltip>
          </>
        }
      >
        {isEdit ? this.childMenu(menu.sub[subIndex], subIndex) : menu.sub.map(this.childMenu)}
      </Collapse.Panel>
    );
  }
}

export function SavingIcon({ isSaving }) {
  const [completed, setCompleted] = useState(false);
  const prev = usePrevious(isSaving);

  useEffect(
    () => {
      // when prev is true, and now complete saving
      if (prev !== isSaving && prev == true) {
        setCompleted(true);
        let duration = 1000;
        const timer = setTimeout(() => {
          clearInterval(timer);
          setCompleted(false);
        }, duration);
      }
    },
    [isSaving]
  );
  return (
    <>
      {isSaving ? (
        <Icon type="loading" className={css["m-x-sm"]} />
      ) : completed ? (
        <Icon type="check" className={css["m-x-sm"]} />
      ) : null}
    </>
  );
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(
    () => {
      ref.current = value;
    },
    [value]
  );
  return ref.current;
}

export const LayerMenu = ({ layers, isShow, layerChange, selectedKeys = [] }) => {
  const menu = (
    <Menu selectedKeys={selectedKeys.map(String)}>
      {layers.map((item, index) => {
        return (
          item.isOpen && (
            <Menu.Item
              key={item.id}
              onClick={({ key, domEvent }) => {
                domEvent.stopPropagation();
                let checked = selectedKeys.includes(item.id);
                layerChange({
                  checkedLayerId: checked ? 0 : item.id,
                  checkedLayerName: checked ? "" : item.title
                });
              }}
            >
              <span>{item.title}</span>
            </Menu.Item>
          )
        );
      })}
      {/* <Menu.Item
        key={0}
        onClick={() =>
          layerChange({
            checkedLayerId: 0,
            checkedLayerName: "选择图层"
          })
        }
      >
        <span>清除选择</span>
      </Menu.Item> */}
    </Menu>
  );

  return (
    isShow && (
      <Dropdown overlay={menu} trigger={["click"]}>
        <VrpIcon
          iconName={"icon-project-management"}
          className={css["m-r-sm"]}
          title={
            layers
              .filter(e => selectedKeys.includes(e.id))
              .map(e => e.title)
              .toString() || "选择图层"
          }
          {...onClickStop}
        />
      </Dropdown>
    )
  );
};
