import { Component } from "react";
import { Icon, Input, Switch, Button, Popconfirm, Select, Tooltip } from "antd";
import MenuData from "./MenuData";
import VrpIcon from "../../components/VrpIcon";
import { templates } from "../../config/StrConfig";
import { warnHandler } from "../Modal/MarkerModal";
import { SavingIcon } from "./FatherMenuPanel";
import { method, sortMenuParams } from "./mixin";

const css = require("../../styles/custom.css");
const newCss = require("../../styles/new.css");
const scss = require("../../styles/scss/ppttab.scss");
const feature = {
  type: "balloon",
  dataId: [],
  data: null,
  time: 8,
  title: "标签"
};

interface ChildMenuProps {
  className: string;
  menu: any;
  isEdit: boolean;
  isLast: boolean;
  isFirst: boolean;
  isChange: boolean;
  onChange: (save?: boolean, update?: boolean) => void;
  onDelete: () => void;
  preview: () => void;
  moveUp: () => void;
  moveDown: () => void;
  onEdit: (isEdit: boolean) => void;
}

interface ChildMenuStates {
  menu: {
    id?: number;
    icon?: string;
    title: string;
    isOpen: boolean;
    feature: Array<any>;
  };
  isChange: boolean;
  movingId?: number;
  showTemplate: boolean;
  isSaving?: boolean;
  warn?: boolean;
}
@method("sortMenu")
export default class ChildMenu extends Component<ChildMenuProps, ChildMenuStates> {
  sortMenu: (args: sortMenuParams) => Promise<any>;
  constructor(props: ChildMenuProps) {
    super(props);
    this.state = {
      menu: props.menu,
      isChange: false,
      showTemplate: false
    };
    if (!props.menu.feature.length) props.menu.feature = [{ ...feature }];
  }
  componentWillReceiveProps(props) {
    const { menu } = props;
    if (menu) {
      if (!menu.feature.length) menu.feature = [{ ...feature }];
      this.setState({ menu });
    }
  }

  handleChange = (isChange = true) => this.setState({ isChange });
  handleMenu = (key, value, save = false, update = false) => {
    if (!save && update) update = false;
    const { menu } = this.state;
    menu[key] = value;
    this.setState({ menu, isChange: !save });
    this.props.onChange(save, update);
  };
  handleSave = () => {
    this.props.onChange(true);
    setTimeout(() => this.handleChange(false));
  };

  insertFeature = (list, i?) =>
    typeof i == "number" ? list.splice(i + 1, 0, { ...feature }) : list.push({ ...feature });

  addFeature = (i?) => {
    const { menu } = this.props;
    if (!menu.feature.filter(e => e.id !== null).every(e => e.id)) warnHandler(this);
    else {
      this.insertFeature(menu.feature, i);
      this.setState({ menu, isChange: true });
      this.props.onEdit(true);
      this.props.onChange();
      warnHandler(this, false);
    }
  };

  delFeature = i => {
    const { menu } = this.props;
    const { feature } = menu;
    const id = feature[i].id;
    let save = false;
    if (id) {
      if (!("featureList" in menu)) menu.featureList = [];
      menu.featureList.push(id);
      save = true;
    }
    feature.splice(i, 1);
    if (!feature.length) {
      this.insertFeature(feature);
    }
    this.setState({ menu }, this.props.onChange.bind(this, save));
  };

  /**
   * @param move 1 up | -1 down
   */
  move = (index, move) => {
    const { menu } = this.state;
    const { id } = menu.feature[index];
    this.sortMenu({ type: 3, fatherId: menu.id!, list: this.props.menu.feature, index, move }).then(
      r => {
        this.setState({ menu: { ...menu, feature: r }, movingId: id });
        setTimeout(() => this.setState({ movingId: void 0 }), 500);
      }
    );
  };

  render() {
    const { isEdit, isFirst, isLast, className } = this.props;
    const { menu, showTemplate, warn, movingId, isChange } = this.state;
    return isEdit ? (
      <div className={className}>
        <div className={scss["childMenu"]}>
          <div
            style={{ position: "relative" }}
            className={css["flex-center-between"] + " " + css["p-sm"]}
          >
            <Input
              onChange={e => this.handleMenu("title", e.target.value)}
              placeholder="类别名称"
              // value={menu.title}
              {...(isChange ? {} : { value: menu.title })}
              {...(menu.title ? { defaultValue: menu.title } : {})}
              className={scss["menu-title"]}
            />
            <div className={css["flex-center"]}>
              <VrpIcon
                iconName="icon-daping"
                style={{
                  fontSize: 16,
                  marginRight: ".5rem",
                  color: showTemplate ? "#1890FF" : "#CDCDCD"
                }}
                onClick={e => this.setState({ showTemplate: !showTemplate })}
              />
              <Switch
                checkedChildren="显"
                unCheckedChildren="隐"
                defaultChecked={Boolean(menu.isOpen)}
                onChange={(checked, e) => this.handleMenu("isOpen", Number(checked))}
              />
            </div>
          </div>
          {showTemplate && (
            <div>
              <div className={[css["p-x-sm"], scss["feature-header"]].join(" ")}>数据大屏</div>
              <div
                style={{ display: "flex", alignItems: "center" }}
                className={"ppt-input " + css["p-sm"]}
              >
                <Select
                  value={menu.template || ""}
                  style={{ width: "100%" }}
                  onChange={val => this.handleMenu("template", val)}
                >
                  {[{ value: "", name: "不选择" }, ...Object.values(templates)].map(e => {
                    return (
                      <Select.Option key={e.value} value={e.value} title={e.name}>
                        {e.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
            </div>
          )}
          <div>
            {menu.feature.map((item, i) => (
              <MenuData
                key={i}
                index={i}
                className={`${!item.id && warn ? scss["warn"] : ""} ${
                  typeof movingId == "number" && item.id == movingId ? scss["moving"] : ""
                }`}
                isFirst={i === 0}
                isLast={i === menu.feature.length - 1}
                feature={item}
                addFeature={() => this.addFeature(i)}
                delFeature={() => this.delFeature(i)}
                onChange={this.handleChange}
                moveUp={() => this.move(i, 1)}
                moveDown={() => this.move(i, -1)}
              />
            ))}
          </div>
        </div>
        <div
          style={{
            // height: "100%",
            overflow: "hidden",
            borderBottom: this.props.isLast ? "none" : "1px dotted rgb(232,232,232)"
          }}
        >
          <div className={css["flex-center"] + " " + css["p-y-sm"] + " " + scss["buttonGroup"]}>
            <Button onClick={this.props.preview} type="primary">
              预览
            </Button>
            <Button onClick={this.handleSave} type="primary" disabled={!isChange}>
              保存
            </Button>
            <Button onClick={e => this.props.onEdit(false)}>返回</Button>
          </div>
        </div>
      </div>
    ) : (
      <div
        className={[
          css["flex-center-between"],
          css["p-y-sm"],
          css["m-x-sm"],
          scss["content-header"],
          className
        ].join(" ")}
      >
        <div style={{ position: "relative" }}>
          <Input
            onChange={e => this.handleMenu("title", e.target.value, true, false)}
            placeholder="名称"
            // value={menu.title}
            {...(isChange ? {} : { value: menu.title })}
            {...(menu.title ? { defaultValue: menu.title } : {})}
            style={{ marginLeft: "32px", paddingRight: "46px" }}
            className={scss["menu-title"]}
          />
          <Switch
            checkedChildren="显"
            unCheckedChildren="隐"
            checked={Boolean(menu.isOpen)}
            onChange={(checked, e) => this.handleMenu("isOpen", Number(checked), true, true)}
          />
        </div>
        <div>
          <SavingIcon isSaving={this.state.isSaving} />
          <Tooltip
            placement="left"
            title={
              <>
                {menu.feature.length > 0 && (
                  <Icon
                    type="caret-right"
                    className={newCss["vrp-btn-icon"]}
                    title={"预览"}
                    onClick={this.props.preview}
                  />
                )}
                {!isFirst && menu.id && (
                  <Icon
                    type="arrow-up"
                    onClick={this.props.moveUp}
                    className={newCss["vrp-btn-icon"]}
                    title={"上移"}
                  />
                )}
                {!isLast && menu.id && (
                  <Icon
                    type="arrow-down"
                    onClick={this.props.moveDown}
                    className={newCss["vrp-btn-icon"]}
                    title={"下移"}
                  />
                )}
                {menu.id && (
                  <Icon
                    type="plus"
                    title={"添加子级"}
                    className={newCss["vrp-btn-icon"]}
                    onClick={e => {
                      e.stopPropagation();
                      this.addFeature();
                    }}
                  />
                )}
                <Popconfirm
                  title="确认是否删除"
                  onConfirm={e => this.props.onDelete()}
                  okText="确定"
                  cancelText="取消"
                >
                  <Icon type="close" className={newCss["vrp-btn-icon"]} title={"删除"} />
                </Popconfirm>
              </>
            }
            getPopupContainer={triggerNode => triggerNode}
            overlayClassName={scss["drawer-tooltip"]}
          >
            <Icon type="ellipsis" className={css["m-r-sm"]} />
          </Tooltip>
          <Icon type="form" onClick={e => this.props.onEdit(true)} />
        </div>
      </div>
    );
  }
}
