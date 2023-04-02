import Link from "next/link";
import utilStyles from "./header.module.scss";
import { useRouter } from "next/router";
import { Popover, Button } from "antd";
import Search from "../search/search";
import Image from "next/image";
import React, { useEffect, useCallback, useContext, FC } from "react";
import Sotre from "../utils/context";
import logo1 from "../../public/images/logo.png";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";

interface HeaderProps {
  Data: any;
  setdrawerVisible: (e: boolean) => void;
  drawerVisible: boolean;
}
const Header: FC<HeaderProps> = (props) => {
  const {
    searchStore,
    setSearchStore,
    setDefaultActiveKey,
    store,
    setStore,
    drawerVisible,
    setdrawerVisible,
  } = useContext(Sotre);
  const {
    navigator_container,
    logo,
    navigator,
    isActive,
    language_change,
    language_change_icon,
    language_choose_icon,
    language_change_text,
    pop,
    searchWrapper,
  } = utilStyles;
  const { pathname, locale } = useRouter();

  const content: JSX.Element = (
    <div className={pop}>
      <Link href={`${pathname}`} locale={"zh"}>
        <p>Chinese</p>
      </Link>
      <Link href={`${pathname}`} locale={"tr"}>
        <p>Turkish</p>
      </Link>
    </div>
  );

  return (
    <header className={navigator_container}>
      {/* <div className={logo}></div> */}
      <div className={logo}>
        <Link href={"/"}>
          <Image src={logo1} width={227} height={48} quality={100} />
        </Link>
      </div>

      <nav className={navigator}>
        {props.Data.map((item, index) => {
          return (
            <Link href={item.path} key={index}>
              <a
                className={store.headerKey == item.key ? isActive : ""}
                onClick={() => {
                  setSearchStore({
                    searchState: false,
                    // searchItemData: searchStore.searchItemData,
                  });
                  setDefaultActiveKey(["1"]);
                  setStore({ headerKey: item.key, menuData: item.menuData });
                }}
              >
                {item.title}
              </a>
            </Link>
          );
        })}
      </nav>
      {/* <Link href={"/post/first/first-comment"}>
        <a >testBlog</a>
      </Link> */}
      <div className={language_change}>
        <div className={language_change_icon}></div>
        <div className={language_change_text}>
          {locale == "tr" ? "Turkish" : "Chinese"}
        </div>
        {/* <Popover placement="bottom" content={content} trigger="hover">
          <div className={language_choose_icon}></div>
        </Popover> */}
      </div>
      <div className={searchWrapper}>
        <Search />
        {searchStore.searchState ? (
          <Button
            type="text"
            onClick={() => setSearchStore({ searchState: false })}
          >
            cancel
          </Button>
        ) : (
          <Button
            icon={drawerVisible ? <CloseOutlined /> : <MenuOutlined />}
            type="text"
            onClick={() => setdrawerVisible(!drawerVisible)}
          />
        )}
      </div>
    </header>
  );
};

export default React.memo(Header);
