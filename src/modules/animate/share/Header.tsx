import { CSSProperties, useState, ReactNode, useMemo, useEffect } from "react";
import {
  Popover,
  Icon
} from "antd";
import { RouteComponentProps, Link, withRouter } from "react-router-dom";
import Handle from "../../components/tools/Handle";
import VrpIcon from "../../components/VrpIcon";
import Config from "../../config/Config";
import { CadModuleData } from "../../components/model/CAD";
import Mark from "../../components/model/Mark";
import Model from "../../components/model/Model";
import Geometry from "../../components/model/Geometry";
import Push from "../../components/model/Push";
import PipeLine from "../../components/model/PipeLine";

const css = require("../../styles/custom.css");
const scss = require("../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";
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
  renderToolMenu?: () => ReactNode;
  play: (feature: Array<feature>, isMenu?: boolean) => void;
  style?: CSSProperties;
  className?: string;
}

const cameraInit = () => {
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
  for (const key in CadModuleData.datas) {
    const data = CadModuleData.datas[key];
    data.setFontVisible(Boolean(data.attr.font.isShare));
    data.setLineVisible(Boolean(data.attr.line.isShare));
    data.setBlockVisible(Boolean(data.attr.block.isShare));
  }
  Handle.HomeHandle();
};

const withTitle = WrappedComponent => props => {
  const { bg, style, className = "", title, en, logoUrl } = props;
  return (
    <div
      style={style}
      className={[
        scss["header"],
        className,
        scss["flex-start-between"],
        bg && scss["back"]
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          scss["header-left"],
          "ellipsis",
          scss["flex"],
          css["m-r-sm"]
        ].join(" ")}
      >
        {logoUrl && logoUrl != "null" ? (
          <img src={Config.apiHost + logoUrl} />
        ) : null}
        <div>
          <span
            className={scss["title"] + " " + scss["pointer"]}
            style={{
              fontSize:
                (38 * title.length) / 1920 > 0.5
                  ? (0.5 * 1920) / title.length + "px"
                  : "38px"
            }}
            title="重置视角"
            onClick={e => cameraInit()}
          >
            {title}
          </span>
          {en ? (
            <h4
              className={scss["sub-title"]}
              style={{ fontSize: "14px", fontFamily: "arial" }}
            >
              {en}
            </h4>
          ) : null}
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
  renderToolMenu,
  play,
  match
}: HeaderProps) {
  const [popoverVisible, setPopoverVisible] = useState(false);
  useEffect(
    () => {
      if (!/\/\d$/.test(match.url) && menu.length) {
        window.currentMenu = {
          sub: new Array(menu.length)
            .fill(0)
            .map((e, i) => e + i)
            .reduce((sub, n) => sub.concat(menu[n].sub), [])
        };
      }
    },
    [menu, match]
  );
  console.log(menu);
  const marginX = useMemo(
    () => {
      const menuWidth =
        menu.reduce(
          (w, item) =>
            (w += item.title.length > 2 ? item.title.length * 14 : 32),
          0
        ) +
        32 +
        3 * 14;
      return Math.min(
        Math.floor(
          (1920 - (40 + 80 + 18 + title.length * 38) - menuWidth) /
          (menu.length + 2) /
          2
        ),
        32
      );
    },
    [menu]
  );
  const renderMenuItem = (item: MenuItem, i: number) => (
    <Link to={` `}>
      <li
        key={i}
        className={scss["pointer"]}
        style={{ margin: `0 ${vw(marginX)}` }}
        onClick={() => {
          cameraInit();
        }}
      >
        {item.icon ? (
          <img src={Config.apiHost + item.icon} />
        ) : (
            <Icon type="unordered-list" />
          )}
        <div style={{ width: `${14 * item.title.length}px` }}>{item.title}</div>
      </li>
    </Link>
  );
  return (
    <>
      <ul
        className={[
          scss["header-right"],
          scss["flex"],
          scss["center"],
          scss["pe-auto"]
        ].join(" ")}
      >
        <Link to={match.url}>
          <li
            key={0}
            className={scss["pointer"]}
            style={{ margin: `0 ${vw(marginX)}` }}
            onClick={e => cameraInit()}
          >
            <img src={require("../../assets/icon/icon_home.png")} />
            <div>{"首页"}</div>
          </li>
        </Link>
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
                      {(template === "edu" && item.sub.length > 1
                        ? item.sub.slice(1)
                        : item.sub
                      ).map((item, index) => {
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
                              window.currentMenu &&
                                (window.currentMenu.title = menu[i].title);
                              play && play(item.feature!);
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
        {hasTool ? (
          <Popover
            content={
              <div className={css["share-menu"]}>
                <ul className={css["first-menu"]}>
                  {renderToolMenu ? renderToolMenu() : null}
                </ul>
              </div>
            }
            trigger="click"
            visible={popoverVisible}
            overlayClassName={
              scss["popover-menu"] + " " + scss["popover-menu-tools"]
            }
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
                  iconClassName={css[""]}
                />
                {/* <img src={require("../../../assets/head_menu04.png")} /> */}
                <div style={{ width: 14 * 3 }}>工具箱</div>
              </li>
            ) : null}
          </Popover>
        ) : null}
      </ul>
    </>
  );
}

export default withRouter(withTitle(CommonNav));
