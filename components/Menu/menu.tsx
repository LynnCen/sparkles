import { FC } from "react";
import Styles from "./menu.module.scss";
import Search from "../search/search";
import { RenderMenu, RenderSearchItem } from "../renderMenu/renderMenu";
import { useEffect, useState, useMemo } from "react";
import React, { useContext } from "react";
import Sotre from "../utils/context";

interface MenuTitle {
  subtitle: string;
  subPath: string;
  [k: string]: string;
}
interface MenuProps {}
const Menu: FC<MenuProps> = (props) => {
  const { searchStore, headerKey, store } = useContext(Sotre);
  const { menuwrapper } = Styles;
  const [searchItemData, setSearchItemData] = useState<
    { subtitle: string; subPath: string }[]
  >([]);

  //fetching title date from current pages
  const menuTitle: Array<MenuTitle> = store.menuData
    .map((item, index) =>
      item.subData.map((it: any, index) => (it.depData ? it.depData : it))
    )
    .flat(2);
  const onSearch = (value: string) => {
    const searchValue = [];
    menuTitle.forEach((item, index) => {
      if (item.subtitle.includes(value)) searchValue.push(item);
    });
    setSearchItemData(searchValue);
  };
  return (
    <div className={menuwrapper}>
      <Search />
      {searchStore.searchState ? <RenderSearchItem /> : <RenderMenu />}
    </div>
  );
};
export default React.memo(Menu);
