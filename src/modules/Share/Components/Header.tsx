import { CSSProperties, useState, ReactNode, useMemo, useEffect, useRef } from "react";
import { Popover, Icon, Select, message, Button, Modal, Carousel, Menu, Dropdown, DatePicker } from "antd";
import { RouteComponentProps, Link, withRouter } from "react-router-dom";
import Handle from "../../../components/tools/Handle";
import VrpIcon from "../../../components/VrpIcon";
import Config from "../../../config/Config";
import { CadModuleData } from "../../../components/model/CAD";
import { templates } from "../../../config/StrConfig";
import Play from "../../../components/tools/Play";
import TransCoordinate from "../../../components/tools/Coordinate";
import ShowData from "../../../components/tools/showData";
import { getDisasterSiteSort } from "../skin/geologicHazard/util";
import Mark from "../../../components/model/Mark";
import Model from "../../../components/model/Model";
import Animation from "../../../components/model/Animate/Animation";
import PipeLine from "../../../components/model/PipeLine";
import Push from "../../../components/model/Push";
import Geometry from "../../../components/model/Geometry";
import Layer from "../../../components/model/Layer";
import Tools from "../../../components/tools/Tools";
import { PineModal } from "../../Menu/Pine";
import LSGY from "../skin/industrial/LSGY";
import moment from "moment";
import LdTimePicker from './ldTimePicker'

const { maps, vrPlanner } = Config;
const { Option } = Select
const { RangePicker } = DatePicker

const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");

let vw = px => (px / 1920) * 100 + "vw";

export interface feature {
  data: Array<any>;
  dataId: string; //"[6174]"
  id: number;
  index: number;
  time: number;
  title: string;
  type: string;
}

interface MenuItem {
  icon: string | null;
  id: number;
  index: number;
  isOpen: number | boolean;
  title: string;
  sub: Array<SubMenuItem>;
}

interface SubMenuItem extends MenuItem {
  feature: Array<feature> | null;
}

interface HeaderProps extends RouteComponentProps {
  title: string;
  enTitle?: string;
  menu: Array<MenuItem> | null;
  bg?: boolean; //显示背景
  template?: string;
  hasTool?: boolean;
  renderEleMenu?: () => ReactNode;
  genTemplateSkin: (template: string, fromPPT?: boolean) => void;
  drawer: { visible: boolean; click: () => void };
  style?: CSSProperties;
  className?: string;
}

const cameraInit = () => {
  clearTimeout(Play.timer as NodeJS.Timeout);
  Mark.marks.forEach(mark => {
    mark.setVisible(mark.whethshare);
  });
  Model.models.forEach(model => {
    model.setVisible(model.whethshare);
  });
  Geometry.geometrys.forEach(geometry => {
    geometry.setVisible(geometry.whethshare);
  });
  Push.pushs.forEach(push => {
    push.setVisible(push.whethshare);
  });
  PipeLine.pipes.forEach(pipe => {
    pipe.setVisible(pipe.whethshare);
  });
  Animation.animations.forEach(animation => {
    animation.setAnimation("finish");
    animation.setVisible(false);
  });
  for (const key in CadModuleData.datas) {
    const data = CadModuleData.datas[key];
    data.setFontVisible(Boolean(data.attr.font.isShare));
    data.setLineVisible(Boolean(data.attr.line.isShare));
    data.setBlockVisible(Boolean(data.attr.block.isShare));
  }
  Tools.setPPTDayNight(0);
  Tools.setPipeline();
  Tools.setSun();
  Handle.HomeHandle();
};

const withTitle = WrappedComponent => props => {
  const {
    bg,
    style,
    className = "",
    title,
    en,
    logoUrl,
    template,
    menu,
    genTemplateSkin,
    titleSuffix = null
  } = props;
  return (
    <div
      style={style}
      className={[
        scss["header"],
        className,
        scss["flex-start-between"],
        bg && scss["back"],
        "pe-none"
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[scss["header-left"], "ellipsis", scss["flex"], css["m-r-sm"], "pe-auto"].join(
          " "
        )}
      >
        {logoUrl && logoUrl != "null" ? <img src={Config.apiHost + logoUrl} /> : null}
        <div className={scss["header-left-wrapped"]}>
          <div>
            <span
              className={scss["title"] + " " + scss["pointer"]}
              style={{
                fontSize:
                  (38 * title.length) / 1920 > 0.5 ? (0.5 * 1920) / title.length + "px" : "38px"
              }}
              title="重置视角"
              onClick={e => {
                cameraInit();
              }}
            >
              {title}
            </span>
            {en ? (
              <h4 className={scss["sub-title"]} style={{ fontSize: "12px", fontFamily: "arial" }}>
                {en}
              </h4>
            ) : null}
          </div>
          {titleSuffix && {
            ...titleSuffix,
            props: { ...titleSuffix.props, template, genTemplateSkin, menu }
          }}
        </div>
      </div>
      <WrappedComponent {...props} />
    </div>
  );
};

function CommonNav({
  title,
  menu,
  template = "",
  hasTool = false,
  renderEleMenu,
  genTemplateSkin,
  match
}: HeaderProps) {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [pine, setPine] = useState(false);
  useEffect(
    () => {
      if (!/\/\d$/.test(match.url) && menu.length) {
        self["currentMenu"] = {
          sub: new Array(menu.length)
            .fill(0)
            .map((e, i) => e + i)
            .reduce((sub, n) => sub.concat(menu[n].sub), [])
        };
      }
    },
    [menu, match]
  );
  const marginX = useMemo(
    () => {
      // home-32, toolkit-3*14,
      const menuWidth =
        menu.reduce(
          (w, item) => (w += item.title.length > 2 ? Math.min(6, item.title.length) * 14 : 32),
          0
        ) +
        32 +
        3 * 14;
      return Math.min(
        Math.floor(
          (1920 - (40 + 80 + 18 + title.length * 38) - menuWidth - 10) / (menu.length + 2) / 2
        ),
        32
      );
    },
    [menu]
  );

  const renderMenuItem = (item: MenuItem, i: number) => (
    <li
      key={i}
      className={scss["pointer"]}
      style={{ margin: `0 ${vw(marginX)}` }}
      onClick={() => {
        if (template != "ecology") {
          item.sub.length && item.sub[0].feature!.length && Play.play(item.sub[0].feature!);
        } else {
          cameraInit();
        }
      }}
    >
      {item.icon ? <img src={Config.apiHost + item.icon} /> : <Icon type="unordered-list" />}
      <div>{item.title}</div>
    </li>
  );
  const homeLi = (
    <li
      key={0}
      className={scss["pointer"]}
      style={{ margin: `0 ${vw(marginX)}` }}
      onClick={e => {
        cameraInit();
        genTemplateSkin(self["template"]);
      }}
    >
      <img src={require("../../../assets/icon/icon_home.png")} />
      <div>{template == "putianEcology" ? "运维大屏" : "首页"}</div>
    </li>
  );
  return (
    <>
      <ul className={[scss["header-right"], scss["flex"], scss["center"], "pe-auto"].join(" ")}>
        {template == "ecology" ? <Link to={match.url}>{homeLi}</Link> : homeLi}
        {menu.length > 0 &&
          menu.map((item, i) =>
            !item.sub || !item.sub.length ? (
              template == "ecology" ? (
                <Link to={`${match.url}${i}`}>{renderMenuItem(item, i + 1)}</Link>
              ) : (
                renderMenuItem(item, i + 1)
              )
            ) : (
              <Popover
                key={i}
                placement="bottom"
                content={
                  <ul className={scss["expand-content"]}>
                    {(template === "edu" && item.sub.length > 1 ? item.sub.slice(1) : item.sub).map(
                      (item, index) => {
                        return (
                          <li
                            className={scss["menu-item"] + " " + scss["pointer"]}
                            style={{
                              color: item.feature.length
                                ? "rgba(0, 0, 0, 0.65)"
                                : "rgba(0, 0, 0, 0.25)"
                            }}
                            key={index}
                            onClick={() => {
                              self["currentMenu"] && (self["currentMenu"].title = menu[i].title);
                              Layer.hideAll();
                              if (item.layerId) {
                                const layer = Layer.getById(item.layerId);
                                layer && layer.showData();
                              }
                              Play.play(item.feature!);
                              item.template && genTemplateSkin(item.template);
                              if (Config.PLANID == 2347 && item.title == "疫木普查") setPine(true);
                            }}
                          >
                            {item.title}
                          </li>
                        );
                      }
                    )}
                  </ul>
                }
                trigger="hover"
                overlayClassName={scss["popover-menu"]}
              >
                {renderMenuItem(item, i)}
              </Popover>
            )
          )}
        {hasTool && renderEleMenu ? (
          <Popover
            content={
              <div className={css["share-menu"]}>
                <ul className={css["first-menu"]}>{renderEleMenu()}</ul>
              </div>
            }
            trigger="click"
            visible={popoverVisible}
            getPopupContainer={triggerNode => triggerNode}
            placement="bottomLeft"
            overlayClassName={scss["popover-menu"] + " " + scss["popover-menu-tools"]}
          >
            <li
              key={menu.length + 1}
              className={scss["pointer"]}
              style={{ margin: `0 ${vw(marginX)}` }}
              onClick={e => setPopoverVisible(!popoverVisible)}
            >
              <VrpIcon
                iconName={"icon-menu-module"}
                title={"工具箱"}
                style={{ fontSize: "32px", lineHeight: "32px" }}
                className={css[""]}
              />
              <div style={{ width: 14 * 3 }}>工具箱</div>
            </li>
          </Popover>
        ) : null}
        {pine && <PineModal onClose={() => setPine(false)} />}
      </ul>
    </>
  );
}

// const withCommonNavPrefix = WrappedPrefix => props => {
//   console.log(props);
//   return (
//     <div
//       className={[
//         scss["flex-start-between"],
//         css["flex-auto"],
//         scss["header-right-wrapped"]
//       ].join(" ")}
//     >
//       <WrappedPrefix {...props} />
//       <CommonNav {...props} />
//     </div>
//   );
// };

function IndustrialNav({
  menu,
  template = "",
  hasTool = false,
  renderEleMenu,
  match
}: HeaderProps) {
  const [lsgy, setLsgy] = useState<any>(null);
  useEffect(
    () => {
      template != "null" &&
        fetch(templates[template].configPath)
          .then(r => r.json())
          .then(r => (setLsgy(r), (self["lsgy"] = r)))
          .catch(console.error);
    },
    [template]
  );
  useEffect(
    () => {
      if (lsgy && !self["lsgy"].companys.length) {
        LSGY.getAuth().then(r => {
          LSGY.getComcount().then(res => {
            lsgy.menu.forEach((e, i) => {
              e.value = res.data[i].count;
            });
            setLsgy({ ...lsgy });
          });
          LSGY.getCompany().then(data => {
            self["lsgy"].companys = data;
          });
        });
      }
    },
    [!!lsgy]
  );

  const [popoverVisible, setPopoverVisible] = useState(false);
  const renderMenuItem = (item, i: number) => (
    <li key={i} className={scss["flex"]} style={{ marginRight: vw(58) }}>
      {item.icon ? (
        <img style={{ height: "42px" }} src={item.icon} />
      ) : (
        <Icon type="unordered-list" />
      )}
      <div style={{ padding: 0, textAlign: "left", margin: "-4px 0 0 12px" }}>
        <div style={{ fontSize: "16px" }}>{item.title}</div>
        <div style={{ fontSize: "22px", lineHeight: "28px" }} className={scss["arial"]}>
          {item.value}
        </div>
      </div>
    </li>
  );
  const renderRightMenuItem = (item, i: number) => (
    <li
      key={i}
      style={{}}
      onClick={() => {
        Play.play(item.sub[0].feature!, true);
      }}
    >
      <a className={scss["pointer"] + " " + scss["flex-center"] + " " + scss["right-menu-item"]}>
        {item.icon ? (
          <img style={{ height: "20px", marginLeft: "12px" }} src={Config.apiHost + item.icon} />
        ) : (
          <Icon type="unordered-list" />
        )}
        <div style={{ padding: 0, textAlign: "left", margin: "0 0 0 9px" }}>
          <div style={{ fontSize: "16px" }}>{item.title}</div>
          <div style={{ fontSize: "22px" }} className={scss["arial"]}>
            {item.value}
          </div>
        </div>
      </a>
    </li>
  );
  return (
    <>
      <ul
        className={
          scss["header-right"] + " " + scss["flex"] + " " + scss["center"] + " " + scss["pe-auto"]
        }
        style={{ height: "42px" }}
      >
        {lsgy && lsgy.menu.map((item, i) => renderMenuItem(item, i))}
        {hasTool && renderEleMenu && (
          <Popover
            content={
              <div className={css["share-menu"]}>
                <ul className={css["first-menu"]}>{renderEleMenu()}</ul>
              </div>
            }
            trigger="click"
            visible={popoverVisible}
            overlayClassName={scss["popover-menu"] + " " + scss["popover-menu-tools"]}
          >
            {menu ? (
              <li
                key={menu.length + 1}
                className={scss["pointer"] + " " + scss["flex-center"]}
                style={{ margin: `0 ${vw(24)} 0 0` }}
                onClick={e => setPopoverVisible(!popoverVisible)}
              >
                {/* <img src={require("../../../assets/head_menu04.png")} /> */}
                <VrpIcon
                  iconName={"icon-tool"}
                  title={"工具箱"}
                  style={{ fontSize: "42px", color: "#ffd800" }}
                  className={css[""]}
                />
                <div style={{ marginLeft: "6px", padding: 0 }}>工具箱</div>
              </li>
            ) : null}
          </Popover>
        )}
      </ul>
      <div className={scss["right-menu"] + " pe-auto"}>
        <ul>
          {menu &&
            menu.map((item, i) =>
              item.sub && item.sub[0].feature.length
                ? renderRightMenuItem(item, i + 1)
                : message.warn(`第${i + 1}个导航未添加动画元素~~`)
            )}
        </ul>
      </div>
    </>
  );
}

function ZhongtaiNav({
  title,
  menu,
  template = "",
  hasTool = false,
  renderEleMenu,
  match
}: HeaderProps) {
  const [config, setConfig] = useState(null);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [mark, setMark] = useState(null);
  useEffect(() => {
    fetch("./js/share/zhongtai.json")
      .then(r => r.json())
      .then(setConfig)
      .catch(console.table);
  }, []);
  const marginX = useMemo(
    () => {
      const menuWidth =
        menu.reduce(
          (w, item) => (w += item.title.length > 2 ? Math.min(6, item.title.length) * 14 : 32),
          0
        ) +
        32 +
        3 * 14;
      return Math.min(
        Math.floor((1920 - (40 + 80 + 18 + title.length * 38) - menuWidth) / (menu.length + 2) / 2),
        32
      );
    },
    [menu]
  );
  const onSearch = value => {
    const filtered =
      value.trim() === ""
        ? []
        : Mark.marks.filter(e => e.title.includes(value) || value.includes(e.title));
    setDataSource(filtered);
  };
  const onChange = (value, options) => {
    if (!value) {
      mark && mark.setVisible(false);
    } else {
      const _mark = Mark.marks.find(e => e.id === value.key);
      _mark && (_mark.focus(), _mark.setVisible(true), setMark(_mark));
    }
  };
  const renderMenuItem = (item, i: number) => (
    <a href={item.href || "javascript:void(0);"} target={item.href ? "__blank" : "_self"}>
      <li
        key={i}
        className={scss["pointer"]}
        style={{ margin: `0 ${vw(marginX)}` }}
        onClick={() => {
          item.sub &&
            item.sub.length &&
            item.sub[0].feature!.length &&
            Play.play(item.sub[0].feature!);
        }}
      >
        {item.icon ? (
          <img style={{ height: "32px" }} src={Config.apiHost + item.icon} />
        ) : (
          <Icon type="unordered-list" />
        )}
        <div>{item.title}</div>
      </li>
    </a>
  );
  return (
    <>
      <div
        className={[css["flex-center-between"], css["flex-auto"], scss["zhongtai-header-l"]].join(
          " "
        )}
      >
        {config && (
          <Select
            showArrow={false}
            defaultValue="中泰街道"
            size="small"
            getPopupContainer={triggerNode => triggerNode}
            className={scss["pe-auto"]}
          >
            {config.streets.map(e => (
              <Select.Option value={e}>{e}</Select.Option>
            ))}
          </Select>
        )}
        <ul
          className={[scss["header-right"], scss["flex"], scss["center"], scss["pe-auto"]].join(
            " "
          )}
        >
          <li
            key={0}
            className={scss["pointer"]}
            style={{ margin: `0 ${vw(marginX)}` }}
            onClick={e => {
              cameraInit();
            }}
          >
            <img src={require("../../../assets/icon/icon_home.png")} />
            <div>{"首页"}</div>
          </li>
          {menu &&
            menu.map((item, i) =>
              !item.sub || !item.sub.length ? (
                renderMenuItem(item, i + 1)
              ) : (
                <Popover
                  key={i}
                  placement="bottom"
                  content={
                    <ul className={scss["expand-content"]}>
                      {item.sub.map((item, index) => {
                        return (
                          <li
                            className={scss["menu-item"] + " " + scss["pointer"]}
                            style={{
                              color: item.feature.length
                                ? "rgba(0, 0, 0, 0.65)"
                                : "rgba(0, 0, 0, 0.25)"
                            }}
                            key={index}
                            onClick={() => {
                              self["currentMenu"] && (self["currentMenu"].title = menu[i].title);
                              Play.play(item.feature!);
                            }}
                          >
                            {item.title}
                          </li>
                        );
                      })}
                    </ul>
                  }
                  trigger="hover"
                  overlayClassName={scss["popover-menu"]}
                >
                  {renderMenuItem(item, i)}
                </Popover>
              )
            )}

          {hasTool && renderEleMenu && (
            <Popover
              content={
                <div className={css["share-menu"]}>
                  <ul className={css["first-menu"]}>{renderEleMenu()}</ul>
                </div>
              }
              trigger="click"
              visible={popoverVisible}
              overlayClassName={scss["popover-menu"] + " " + scss["popover-menu-tools"]}
            >
              {menu ? (
                <li
                  key={menu.length + 1}
                  className={scss["pointer"]}
                  style={{ margin: `0 ${vw(marginX)}` }}
                  onClick={e => setPopoverVisible(!popoverVisible)}
                >
                  <VrpIcon
                    iconName={"icon-menu-module"}
                    title={"工具箱"}
                    style={{ fontSize: "32px", lineHeight: "32px" }}
                    className={css[""]}
                  />
                  <div style={{ width: 14 * 3 }}>工具箱</div>
                </li>
              ) : null}
            </Popover>
          )}
          {config && renderMenuItem(config.menu, menu.length + 2)}
        </ul>
      </div>
      <div className={scss["zhongtai-header-b"] + " " + scss["pe-auto"]}>
        {config && (
          <Select defaultValue="all">
            {config.categories.map(e => (
              <Select.Option value={e.value}>{e.name}</Select.Option>
            ))}
          </Select>
        )}
        <Select
          allowClear
          showSearch
          labelInValue={true}
          placeholder={"请输入搜索信息"}
          filterOption={false}
          onSearch={onSearch}
          onChange={onChange}
          onFocus={() => setDataSource([])}
          style={{ width: 310 }}
          suffixIcon={
            <Button
              className="search-btn"
              style={{
                marginRight: -12,
                borderRadius: `0 4px 4px 0`,
                marginTop: -10
              }}
              size="default"
              type="primary"
            >
              <Icon type="search" />
            </Button>
          }
        >
          {dataSource.map(e => (
            <Select.Option key={e.id} value={e.id}>
              {e.title}
            </Select.Option>
          ))}
        </Select>
      </div>
    </>
  );
}

export const GeologicHazardPrefix = ({ template, genTemplateSkin, menu, ...props }) => {
  const tpl = "geologicHazard";
  const [config, setConfig] = useState(self[tpl]);
  const [options, setOptions] = useState([]);
  useEffect(
    () => {
      if (template != "null" && !self[tpl])
        fetch(templates[template].configPath)
          .then(r => r.json())
          .then(r => {
            if (!self[tpl]) {
              self[tpl] = r;
              setConfig(self[tpl]);
              fetch(`${process.env.disasterAPI}/disaster_site/list_county_town`)
                .then(r => r.json())
                .then(res => {
                  self[tpl].regions = res.data;
                  setConfig({ ...self[tpl] });
                })
                .catch(console.table);
            }
          })
          .catch(message.error);
    },
    [self["template"]]
  );
  useEffect(
    () => {
      if (config && config.regions.length) {
        let ops = [
          {
            value: config.region,
            label: config.region,
            children: []
          },
          ...config.regions.map(d => {
            const m = menu.filter(m => m.title.includes(d.name));
            return {
              label: d.name,
              value: d.name,
              children: [
                { value: "", label: config.town },
                ...d.townList.map(e => ({
                  label: e.name,
                  value: e.name
                }))
              ]
            };
          })
        ];
        setOptions(ops);
      }
    },
    [menu, config ? config.regions : 0]
  );
  const onRegionChange = val => {
    const isLS = val == "丽水市";
    self[tpl]["region"] = val;
    self[tpl]["town"] = !isLS ? options.find(op => op.value == val).children[0].value : "";
    genAddr(val);
    genTemplateSkin(self["template"], false);
  };
  const onTownChange = val => {
    self[tpl]["town"] = val;
    genAddr(!val ? self[tpl]["region"] : val);
    genTemplateSkin(self["template"], false);
  };

  return config && self[tpl] ? (
    <>
      <Select
        // showArrow={false}
        allowClear={false}
        value={self[tpl].region}
        options={options}
        onChange={onRegionChange}
        size="small"
        getPopupContainer={triggerNode => triggerNode.parentNode}
        dropdownClassName={scss["black-bg-white-font"]}
        // popupClassName={scss["black-bg-white-font"]}
        className="pe-auto"
        style={{ marginLeft: vw(40), maxWidth: 150 }}
      >
        {options.map((e, i) => (
          <Select.Option key={i} value={e.value} disabled={e.disabled}>
            {e.label}
          </Select.Option>
        ))}
      </Select>
      {process.env.NODE_ENV != "production" &&
        options.length > 0 &&
        self[tpl].region != self[tpl].city && (
          <Select
            // showArrow={false}
            allowClear={false}
            value={self[tpl].town}
            options={options}
            onChange={onTownChange}
            size="small"
            getPopupContainer={triggerNode => triggerNode.parentNode}
            dropdownClassName={scss["black-bg-white-font"]}
            // popupClassName={scss["black-bg-white-font"]}
            className="pe-auto"
            style={{ marginLeft: 10 }}
          >
            {options
              .find(op => op.value == self[tpl].region)
              .children.map((e, i) => (
                <Select.Option key={i} value={e.value} disabled={e.disabled}>
                  {e.label}
                </Select.Option>
              ))}
          </Select>
        )}
    </>
  ) : null;
};

export function GeologicHazardNav({
  title,
  menu = [],
  template = "",
  hasTool = false,
  renderEleMenu,
  genTemplateSkin,
  match,
  drawer,
  ...rest
}: HeaderProps) {
  const tpl = "geologicHazard";
  const [config, setConfig] = useState(self[tpl]);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [_menu, setMenu] = useState(null);
  const [modalProps, setModalProps] = useState({ visible: false });
  const navRef = useRef();
  const [showMenu, setShowMenu] = useState(true);
  const [style, setStyle] = useState({});
  useEffect(
    () => {
      setShowMenu(drawer.visible);
      setStyle({ right: !drawer.visible ? "-100%" : 0 });
    },
    [drawer.visible]
  );
  useEffect(
    () => {
      if (template != "null") {
        if (!self[tpl]) {
          fetch(templates[tpl].configPath)
            .then(r => r.json())
            .then(r => {
              self[tpl] = self[tpl] || r;
              setConfig(self[tpl]);
            })
            .catch(message.error);
        }
      }
    },
    [template]
  );
  useEffect(
    () => {
      //县市区分级隐患点
      const conf = self[tpl];
      if (conf) {
        if (!conf.countyDisaster.data.length) {
          getDisasterSiteSort().then(r => {
            const m = {
              ...conf.menu,
              sub: r.data.countyDisasterVOList.map(e => ({
                ...e,
                ...Object.keys(conf.countyDisaster.types).reduce(
                  (r, k) => (
                    (r[k] = e[k].map(site => {
                      // console.log(site.name, site.uniqueId);
                      const u = menu.find(u => u.title.includes(site.uniqueId));
                      return {
                        ...site,
                        ...u,
                        title: u ? u.title.replace(/['\d]+/g, "") : ""
                      };
                    })),
                    r
                  ),
                  {}
                )
              }))
            };
            self[tpl].menu = m;
            setConfig({ ...self[tpl] });
            setMenu(m);
          });
        }
      }
    },
    [menu, config]
  );
  const marginX = useMemo(
    () => {
      // home-32, toolkit-3*14,
      if (config && menu) {
        const ms = [
          config.menu,
          ...menu.filter(e => !/\d+/.test(e.title)),
          config.link,
          config.intro
        ];
        const menuWidth =
          ms
            .filter(e => !/\d+/.test(e.title))
            .reduce(
              (w, item) => (w += item.title.length > 2 ? Math.min(6, item.title.length) * 14 : 32),
              0
            ) +
          32 +
          3 * 14;
        return Math.min(
          Math.floor(
            (1920 - (40 + 80 + 18 + title.length * 38) - menuWidth - 10) /
            (ms.filter(e => !/\d+/.test(e.title)).length + 2) /
            2
          ),
          32
        );
      } else return 0;
    },
    [menu, config && config.link]
  );
  const renderMenuItem = (item: MenuItem, i: number) => (
    <li
      key={i}
      className={scss["pointer"]}
      style={{ margin: `0 ${vw(marginX)}` }}
      onClick={() => {
        if (item.sub && item.sub.length && item.sub[0].feature) {
          item.sub[0].feature!.length && Play.play(item.sub[0].feature!);
        } else if (item.modal) {
          setModalProps({
            ...modalProps,
            visible: true,
            width: item.modal.width
          });
        }
      }}
    >
      {item.icon ? <img src={Config.apiHost + item.icon} /> : <Icon type="unordered-list" />}
      <div>{item.title}</div>
    </li>
  );
  const homeLi = (
    <li
      key={0}
      className={scss["pointer"]}
      style={{ margin: `0 ${vw(marginX)}` }}
      onClick={e => {
        cameraInit();
        genTemplateSkin(self["template"], false);
        self[tpl].region = "丽水市";
        self[tpl].town = "";
        setConfig({ ...self[tpl] });
      }}
    >
      <img src={require("../../../assets/icon/icon_home.png")} />
      <div>首页</div>
    </li>
  );
  const menuItem = (county, site, idx, type) => (
    <Menu.Item
      key={idx}
      onClick={() => {
        if (!drawer.visible) drawer.click();
        Layer.hideAll();
        if (site.layerId) {
          const layer = Layer.getById(site.layerId);
          layer && layer.showData();
        }
        genTemplateSkin("geologicHazard2", type > 1);
        const nav = self[tpl].pointInfo.nav;
        self[tpl].geohazard = site.name;
        self[tpl].uniqueId = site.uniqueId;
        self[tpl].menu.geohazard = site.title;
        self[tpl].region = county;
        self[tpl].forecastEquipmentVOList.data.forEach(e => {
          let m = Mark.getById("forecastEquipment" + e.deviceId);
          m && m.setVisible(false);
        });
        nav.data = nav.data.map((e, j) => {
          Array.isArray(e.feature) && e.feature.forEach(f => Play.setFeatureVisible(f, false));
          return {
            ...e,
            feature: site.sub && site.sub[j] ? site.sub[j].feature : []
          };
        });
      }}
    >
      {site.title || site.name}
    </Menu.Item>
  );
  return (
    <>
      <ul
        className={[scss["header-right"], scss["flex"], scss["center"], "pe-auto"].join(" ")}
        style={style}
        ref={navRef}
      >
        {homeLi}
        {config && renderMenuItem(config.intro, -2)}
        {_menu ? (
          <Dropdown
            overlay={
              <Menu>
                {_menu.sub.map((sub, i) => {
                  let keys = Object.keys(config.countyDisaster.types);
                  keys.splice(1, 0, "divider");
                  keys.splice(3, 0, "divider");
                  return (
                    <Menu.SubMenu title={sub.county}>
                      {keys.map((key, j) => {
                        return key == "divider" ? (
                          <Menu.Divider />
                        ) : (
                          sub[key].map((site, k) => {
                            return menuItem(sub.county, site, k, j + 1);
                          })
                        );
                      })}
                    </Menu.SubMenu>
                  );
                })}
              </Menu>
            }
            placement="bottomCenter"
          >
            {renderMenuItem(_menu, 0)}
          </Dropdown>
        ) : null}
        {[...menu.filter(e => !/\d+/.test(e.title))].map((item, i) => (
          <Popover
            placement="bottom"
            trigger="hover"
            overlayClassName={scss["popover-menu"]}
            content={
              <ul className={scss["expand-content"]}>
                {item.sub.map((sub, index) => {
                  return (
                    <li
                      className={scss["menu-item"] + " " + scss["pointer"]}
                      style={{ color: "rgba(0, 0, 0, 0.65)" }}
                      key={index}
                      onClick={() => {
                        Play.play(sub.feature!);
                      }}
                    >
                      {i ? sub.title : sub.title.replace("-", "")}
                    </li>
                  );
                })}
              </ul>
            }
          >
            {renderMenuItem(item, 0)}
          </Popover>
        ))}
        {config && (
          <a href={config.link.href} target={config.link.target}>
            {renderMenuItem(config.link, -1)}
          </a>
        )}
      </ul>

      <div
        className={scss["right-btn"]}
        onClick={e => {
          setShowMenu(!showMenu);
          setStyle({ right: showMenu ? "-100%" : 0 });
        }}
      >
        <VrpIcon iconName={`icon-${showMenu ? "right" : "left"}-slim`} />
      </div>

      {config && modalProps.visible && (
        <Modal
          {...modalProps}
          onCancel={() => setModalProps({ ...modalProps, visible: false })}
          destroyOnClose={true}
          centered
          footer={null}
          closable={false}
          getContainer={() => navRef.current}
        >
          <Carousel
            slidesToShow={1}
            draggable={true}
            slidesToScroll={1}
            arrows={true}
            prevArrow={<img src={"./images/ecology/icon_arrowleft.png"} />}
            nextArrow={<img src={"./images/ecology/icon_arrowright.png"} />}
          >
            {config.intro.modal.data.map((e, i) => (
              <div key={i}>
                <div style={{ background: `url(${e})` }} data-carousel-photo />
              </div>
            ))}
          </Carousel>
        </Modal>
      )}
    </>
  );
}

export const FolkMap = ({ template, genTemplateSkin, ...props }) => {
  const tpl = "folkMap1";
  const [config, setConfig] = useState(self[tpl]);
  const [options, setOptions] = useState([
    { value: "1", label: "松阳县" },
    { value: "2", label: "四都乡-西坑村" }
  ]);
  const onRegionChange = val => {
    genTemplateSkin(val == "1" ? "folkMap1" : "folkMap2");
  };

  return (
    <>
      <Select
        // showArrow={false}
        allowClear={false}
        options={options}
        onChange={onRegionChange}
        defaultValue={"1"}
        size="small"
        getPopupContainer={triggerNode => triggerNode.parentNode}
        dropdownClassName={scss["folk-map"]}
        // popupClassName={scss["black-bg-white-font"]}
        className="pe-auto"
        style={{ marginLeft: vw(40), width: 125 }}
      >
        {options.map((e, i) => (
          <Select.Option key={i} value={e.value}>
            {e.label}
          </Select.Option>
        ))}
      </Select>
    </>
  );
};

export const DigtalFarm = ({ template, genTemplateSkin, ...props }) => {
  const tpl = "digtalFarm";
  const [config, setConfig] = useState(self[tpl]);
  const [options, setOptions] = useState([{ value: "1", label: "上虞区" }]);
  const onRegionChange = val => {
    genTemplateSkin(val == "1" ? "digtalFarm" : "digtalFarm");
  };

  return (
    <>
      <Select
        // showArrow={false}
        allowClear={false}
        options={options}
        onChange={onRegionChange}
        defaultValue={"1"}
        size="small"
        getPopupContainer={triggerNode => triggerNode.parentNode}
        dropdownClassName={scss["folk-map"]}
        // popupClassName={scss["black-bg-white-font"]}
        className="pe-auto"
        style={{ marginLeft: vw(40), width: 100 }}
      >
        {options.map((e, i) => (
          <Select.Option key={i} value={e.value}>
            {e.label}
          </Select.Option>
        ))}
      </Select>
    </>
  );
};
export const DtVillage = ({ template, genTemplateSkin, ...props }) => {
  const tpl = "dtVillage";
  const [config, setConfig] = useState(self[tpl]);
  const [options, setOptions] = useState([{ value: "1", label: "东坑镇-东坑自然村" }]);
  const onRegionChange = val => {
    genTemplateSkin(val == "1" ? "dtVillage" : "dtVillage");
  };

  return (
    <>
      <Select
        // showArrow={false}
        allowClear={false}
        options={options}
        onChange={onRegionChange}
        defaultValue={"1"}
        size="small"
        getPopupContainer={triggerNode => triggerNode.parentNode}
        dropdownClassName={scss["folk-map"]}
        // popupClassName={scss["black-bg-white-font"]}
        className="pe-auto"
        style={{ marginLeft: vw(40), width: 155 }}
      >
        {options.map((e, i) => (
          <Select.Option key={i} value={e.value}>
            {e.label}
          </Select.Option>
        ))}
      </Select>
    </>
  );
};
export const DtVillage2 = ({ template, genTemplateSkin, ...props }) => {
  const tpl = "dtVillage2";
  const [config, setConfig] = useState(self[tpl]);
  const [options, setOptions] = useState([{ value: "1", label: "大坑村" }]);
  const onRegionChange = val => {
    genTemplateSkin(val == "1" ? "dtVillage2" : "dtVillage2");
  };

  return (
    <>
      <Select
        // showArrow={false}
        allowClear={false}
        options={options}
        onChange={onRegionChange}
        defaultValue={"1"}
        size="small"
        getPopupContainer={triggerNode => triggerNode.parentNode}
        dropdownClassName={scss["folk-map"]}
        // popupClassName={scss["black-bg-white-font"]}
        className="pe-auto"
        style={{ marginLeft: vw(40), width: 155 }}
      >
        {options.map((e, i) => (
          <Select.Option key={i} value={e.value}>
            {e.label}
          </Select.Option>
        ))}
      </Select>
    </>
  );
};
export const DtVillage3 = ({ template, genTemplateSkin, ...props }) => {
  const tpl = "dtVillage3";
  const [config, setConfig] = useState(self[tpl]);
  const [options, setOptions] = useState([{ value: "1", label: "西坑村" }]);
  const onRegionChange = val => {
    genTemplateSkin(val == "1" ? "dtVillage3" : "dtVillage3");
  };

  return (
    <>
      <Select
        // showArrow={false}
        allowClear={false}
        options={options}
        onChange={onRegionChange}
        defaultValue={"1"}
        size="small"
        getPopupContainer={triggerNode => triggerNode.parentNode}
        dropdownClassName={scss["folk-map"]}
        // popupClassName={scss["black-bg-white-font"]}
        className="pe-auto"
        style={{ marginLeft: vw(40), width: 155 }}
      >
        {options.map((e, i) => (
          <Select.Option key={i} value={e.value}>
            {e.label}
          </Select.Option>
        ))}
      </Select>
    </>
  );
};

export const FusionCommand = ({ template, genTemplateSkin, ...props }) => {
  const tpl = "fusionCommand";
  const [config, setConfig] = useState(self[tpl]);
  const [options, setOptions] = useState([{ value: "1", label: "丽水市" }]);
  const onRegionChange = val => {
    genTemplateSkin(val == "1" ? "fusionCommand" : "fusionCommand");
  };

  return (
    <>
      <Select
        // showArrow={false}
        allowClear={false}
        options={options}
        onChange={onRegionChange}
        defaultValue={"1"}
        size="small"
        getPopupContainer={triggerNode => triggerNode.parentNode}
        dropdownClassName={scss["folk-map"]}
        // popupClassName={scss["black-bg-white-font"]}
        className="pe-auto"
        style={{ marginLeft: vw(40), width: 80 }}
      >
        {options.map((e, i) => (
          <Select.Option key={i} value={e.value}>
            {e.label}
          </Select.Option>
        ))}
      </Select>
    </>
  );
};


export const SongyangMapHeader = ({ template, genTemplateSkin, ...props }) => {

  const goPath = (value) => {
    genTemplateSkin(value)
    props.syChangeVisible()
    props.hideDrawer();
    let id = 0;
    switch (value) {
      case "songyangMap1":
        id = 2402
        break;
      case "songyangMap2":
        id = 2401
        break;
      case "songyangMap3":
        id = 2400
        break;
      case "songyangMap4":
        id = 2399
        break;
      case "songyangMap5":
        id = 2398
        break;
      case "songyangMap6":
        id = 2397
        break;
    }
    fetch(Config.apiHost + `/Share/getSubMenu?subId=${id}`, {
      method: "get",
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(res => {
        Play.play(res.data[0].feature)
      })
    maps.getLayerById("balloonLayer").clearFeatures();
  }
  return (
    <div className={scss['songyangMap-header']}>
      {/* <div>
        <img src={`${process.env.publicPath}images/songyangMap/image/header-left.svg`} />
      </div>
      <div>
        {
          routerList.map((r, i) => {
            return <div
              key={i}
              onClick={() => goPath(r.path)}
              className={scss['unselected-router'] + " " + (r.path === template && scss['selected-router'])}
            >
              <div
                className={scss['router-icon']}
                style={{ background: `url(${r.path === template ? r.selectedImage : r.image})` }}
              />
              <div>{r.title}</div>
            </div>
          })
        }
      </div> */}
      <div>
        <div className={scss['header-time']}>
          <img src={`${process.env.publicPath}images/songyangMap/icon/time.svg`} />
          <Time />
        </div>
      </div>
    </div>
  )
}
export const LianDuPoliceHeader = ({ template, genTemplateSkin, ...props }) => {
  Tools.addMaps(18, [
    "http://t0.tianditu.com/DataServer?T=img_w&tk=be8b387b76fa3e010851a08134961271",
    "http://t1.tianditu.com/DataServer?T=img_w&tk=be8b387b76fa3e010851a08134961271",
    "http://t2.tianditu.com/DataServer?T=img_w&tk=be8b387b76fa3e010851a08134961271",
    "http://t3.tianditu.com/DataServer?T=img_w&tk=be8b387b76fa3e010851a08134961271",
    "http://t4.tianditu.com/DataServer?T=img_w&tk=be8b387b76fa3e010851a08134961271",
    "http://t5.tianditu.com/DataServer?T=img_w&tk=be8b387b76fa3e010851a08134961271",
    "http://t6.tianditu.com/DataServer?T=img_w&tk=be8b387b76fa3e010851a08134961271",
    "http://t7.tianditu.com/DataServer?T=img_w&tk=be8b387b76fa3e010851a08134961271"
  ], false, true);
  const [visible, setVisible] = useState(false)
  const [list, setList] = useState([])
  const [yearList, setYearList] = useState([])
  const routerList = [
    {
      path: "lianDuPolice",
      title: "警情监控",
      icon: `${process.env.publicPath}images/ldPolice/重点警情icon.svg`
    },
    {
      path: "lianDuPolice2",
      title: "基础集控",
      icon: `${process.env.publicPath}images/ldPolice/基础集控icon.svg`
    },
    {
      path: "lianDuPolice3",
      title: "多维管控",
      icon: `${process.env.publicPath}images/ldPolice/多维管控icon.svg`
    },
    {
      path: "lianDuPolice4",
      title: "联动作战",
      icon: `${process.env.publicPath}images/ldPolice/联动作战icon.svg`
    }
  ]
  useEffect(() => {
    fetch('http://dtcity.cn:8077/api/common/query_areas')
      .then(res => res.json())
      .then(res => setList(res.data))
    fetch('http://dtcity.cn:8077/api/common/get_years')
      .then(res => res.json())
      .then(res => setYearList(res.data))

  }, [])
  const goPath = (value, key) => {
    // if (key != 3) {
    //   console.log(value);
    // }
    let layer = maps.getLayerById("1111");
    genTemplateSkin(value)
    layer.clearFeatures();
    props.ldChangVisible()
  }
  const changeVisible = () => {
    setVisible(!visible)
  }
  return (
    <div className={scss['ld-custom-header']}>
      <div className={scss['ld-header-left']}>
        <div className={scss['big-title']}>{props.title}</div>
        <div className={scss['min-title']}>{props.en}</div>
        <Select
          defaultValue={props.ldYear}
          getPopupContainer={triggerNode => triggerNode}
          style={{ width: "80px", right: '-110px' }}
          onChange={props.ldYearChange}
        >
          {
            yearList.map((r, i) => {
              return <Option key={i} value={r}>{r}</Option>
            })
          }
        </Select>
        <div style={{
          position: 'absolute',
          right: "-205px",
          bottom: "8px"
        }}>
          <LdTimePicker
            ldFirstMonth={props.ldFirstMonth}
            ldLastMonth={props.ldLastMonth}
            ldClearMonth={props.ldClearMonth}
            ldSelectMonth={props.ldSelectMonth}
          />
        </div>
        <Select
          defaultValue={0}
          getPopupContainer={triggerNode => triggerNode}
          style={{ width: "120px", right: '-330px' }}
          onChange={(value) => props.ldPoliceChange(list[value])}
        >
          {
            list.map((r, i) => {
              return <Option key={i} value={i} >{r.name}</Option>
            })
          }
        </Select>
      </div>
      <div className={scss['ld-header-right']}>
        <div className={scss['ld-router-box'] + " " + (visible && scss['ld-router-box-hide'])}>
          {
            routerList.map((r, i) => {
              return <div
                key={i}
                className={scss['ld-header-router']}
                onClick={() => goPath(r.path, i)}
              >
                <img src={r.icon} alt="" />
                <div className={r.path === template && scss['ld-header-router-active']}>
                  <span>{r.title}</span>
                </div>
              </div>
            })
          }
        </div>
        <img
          src={`${process.env.publicPath}images/ldPolice/导航收缩图标.svg`}
          className={scss['shrink'] + " " + (visible && scss['shrink-active'])}
          onClick={() => changeVisible()}
        />
      </div>
    </div>
  )
}

const Time = ({ format = "YYYY-MM-DD HH:mm", step = "s", ...rest }) => {
  const [time, setTime] = useState(moment().format(format));
  const _step = {
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    m: 60 * 1000,
    s: 1000
  }[step];
  useEffect(() => {
    setInterval(() => setTime(moment().format(format)), _step || 1000);
  }, []);
  return <span {...rest}>{time}</span>;
};

function Peibiao1({ }) {
  return (
    <div style={{ position: "fixed", zIndex: "99" }}>
      <img
        style={{ width: "100%" }}
        src={`${process.env.publicPath}images/peibiao/peibiao1_2.png`}
        alt=""
      />
    </div>
  );
}

function Peibiao2({ }) {
  return (
    <div style={{ position: "fixed", zIndex: "99" }}>
      <img
        style={{ width: "100%" }}
        src={`${process.env.publicPath}images/peibiao/peibiao2_1.png`}
        alt=""
      />
    </div>
  );
}

export default withRouter(withTitle(CommonNav));
export const IndustrialHeader = withRouter(withTitle(IndustrialNav));
export const ZhongtaiHeader = withRouter(withTitle(ZhongtaiNav));
export const GeologicHazardHeader = withRouter(withTitle(GeologicHazardNav));
export const Peibiao1Header = Peibiao1;
export const Peibiao2Header = Peibiao2;
// export const GeologicHazardHeader = withRouter(
//   withTitle(withCommonNavPrefix(GeologicHazardPrefix))
// );
const genAddr = keyword => {
  const camera = maps.getCamera();
  const geo = TransCoordinate.MercatorToWGS84(camera.getLookAt());
  TransCoordinate.getLocation(
    { location: TransCoordinate.wgs84togcj02(geo.lon, geo.lat) },
    addr => {
      TransCoordinate.getGeoLocation(addr.city, keyword, pois => {
        const { location } = pois[0];
        const loc = location.split(",");
        const geo = TransCoordinate.WGS84ToMercator({
          x: loc[0],
          y: loc[1],
          z: 0
        });
        camera.setPosition(geo.add(new vrPlanner.Math.Double3(0, -7000, 7000)), geo);
        const layer =
          maps.getLayerById("MapSearch") || new vrPlanner.Layer.FeatureLayer("MapSearch");
        layer.clearFeatures();
        let point = ShowData.renderMapTag({ geo, title: keyword });
        layer.addFeature(point);
        layer.addFeature(point.line);
        layer.setLodWindowSize(1);
        layer.setRenderTileTree(false);
        maps.addLayer(layer);
      });
    }
  );
};
