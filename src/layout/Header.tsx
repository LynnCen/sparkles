import React, { CSSProperties, useState, useMemo, useEffect, FC, useContext } from "react";
import { RouteComponentProps, withRouter, NavLink } from "react-router-dom";
import UnorderedListOutlined from "@ant-design/icons";
import { Button, Select, message } from "antd";
import routes from "config/routes";
import context from "./context";
import Icon from "components/Icon";
import { vw } from "utils/common";

interface IMenu {
  id: number;
  icon: string | null;
  isOpen: number | boolean;
  title: string;
}

interface HeaderProps extends RouteComponentProps {
  title: string;
  enTitle?: string;
  bg?: boolean; //显示背景
  template?: string;
  style?: CSSProperties;
  className?: string;
}

const calcMenuGroupMarginX = (title: string, menuList: { title: string }[]) => {
  // home-32,
  const menuWidth =
    (menuList || []).reduce(
      (w: number, item) => (w += item.title.length > 2 ? Math.min(6, item.title.length) * 14 : 32),
      0
    ) + 32;
  return Math.min(
    Math.floor(
      (1920 - (40 + 80 + 18 + title.length * 38) - menuWidth - 10) /
      ((menuList || []).length + 2) /
      2
    ),
    32
  );
};

const Header: FC<HeaderProps> = function ({ title, enTitle, bg, style, className = "", ...rest }) {
  const { store, setStore } = useContext(context);
  // console.log(rest);
  const marginX = useMemo(() => calcMenuGroupMarginX(title, routes), [routes]);
  const renderMenuItem = (item: any, i: number) => (
    <li
      key={i}
      className={"pointer"}
      style={{ margin: `0 ${vw(marginX)}`, paddingBottom: 4 }}
      onClick={() => {
        if (item.title == '打孔注药') {
          message.warning('功能开发中...')
        }
      }}
    >
      {item.icon ? <Icon src={item.icon} /> : <UnorderedListOutlined />}
      <div>{item.title}</div>
    </li>
  );
  // const homeLi = (
  //   <li key={0} className={"pointer"} style={{ margin: `0 ${vw(marginX)}` }} onClick={(e) => {}}>
  //     <img src={require("assets/icon/icon_home.png")} />
  //     <div>{"首页"}</div>
  //   </li>
  // );
  return (
    <div
      style={style}
      className={["header", className, "flex-start-between", bg && "radial-bg pe-none"]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={"header-left ellipsis flex mr-sm pe-auto"}>
        <div className={"header-left-wrapped"}>
          <div>
            <a
              className={"header-title pointer"}
              style={{
                fontSize:
                  (38 * title.length) / 1920 > 0.5 ? (0.5 * 1920) / title.length + "px" : "38px",
              }}
              href="/home"
              onClick={(e) => { }}
            >
              <>
                {title.split(" ")[0]}
                <span className="big">
                  &nbsp;{title.split(" ")[1]}&nbsp;
                </span>
                {title.split(" ")[2]}
              </>
            </a>
            {enTitle ? <h4 className={"header-subTitle"}>{enTitle}</h4> : null}
          </div>
          <Button
            size="small"
            type="text"
            style={{ color: "#fff", border: "1px solid #fff", marginLeft: vw(30) }}
          >
            2020
          </Button>
          {/* <Select
            // allowClear
            defaultValue={2020}
            // options={[new Date().getFullYear()].map((e) => ({ label: e + "年", value: e }))}
            // onChange={(val) => {
            //   console.log(val);
            // }}
            size="small"
            getPopupContainer={(node) => node.parentNode.parentNode}
            dropdownClassName={"black-bg-white-font"}
            className="pe-auto"
            style={{ marginLeft: vw(30) }}
          ></Select> */}
        </div>
      </div>
      <ul className={"header-right flex text-center pe-auto"}>
        {routes.map(({ key, path, ...rest }, i) => (
          <NavLink
            to={{ pathname: path, state: { key } }}
            activeStyle={{ color: "#02D281" }}
            key={i}
            exact
          >
            {renderMenuItem(rest, i)}
          </NavLink>
        ))}
      </ul>
    </div>
  );
};

export default withRouter(Header);
