import { Collapse } from "antd";
import Link from "next/link";
import Styles from "./renderMenu.module.scss";
import { manualmenuData, faqmenuData } from "../../lib/ststicData";
import { useRouter } from "next/router";
import { useTranslation, i18n } from "next-i18next";
import React, { FC, useEffect, useState, useContext } from "react";
import Sotre from "../utils/context";
import { Empty } from "antd";
const { Panel } = Collapse;
interface RenderMenuProps { }
const RenderMenuMemo: FC<RenderMenuProps> = (props) => {
  const { renderMenu_wrapper, catalogue, introduce } = Styles;
  const { defaultActiveKey, store } = useContext(Sotre);
  const { t: f } = useTranslation("faqmenu");
  const { t: u } = useTranslation("user");
  const handlePanel = (e) => {
  };

  return (
    <>
      <h2 className={catalogue}>
        {store.headerKey == 4 ? u("user-mannual") : f("fa")}
      </h2>
      <div className={renderMenu_wrapper}>

        <h3 className={introduce}>
          {store.headerKey == 4 ? <Link href={'/usermanual'}><a style={{ color: "#0d1324" }}>{u("intrudce")}</a></Link> : null}
        </h3>

        <Collapse
          bordered={false}
          defaultActiveKey={defaultActiveKey}
          ghost
          onChange={handlePanel}
        >
          {store.menuData.map((item, index) => {
            return (
              <Panel header={item.title} key={index + 1}>
                <PanelItem data={item.subData} />
              </Panel>
            );
          })}
        </Collapse>
      </div>
    </>

  );
};
interface PanelItemProps {
  data: {
    subtitle: string;
    subPath: string;
    depData?: {
      subtitle: string;
      subPath: string;
    }[];
  }[];
}
const PanelItem: FC<PanelItemProps> = (props) => {
  const { data } = props;
  const { pathname } = useRouter();
  const { subTitle, subTitleWrapper, selectTitle } = Styles;
  const { drawerVisible, setdrawerVisible } = useContext(Sotre);
  return (
    <>
      {data &&
        data.map((item, index) => {
          return item.depData ? (
            <div className={subTitleWrapper} key={index}>
              <Collapse bordered={false} defaultActiveKey={["1"]} ghost>
                <Panel header={item.subtitle} key={index + 1}>
                  <PanelItem data={item.depData} />
                </Panel>
              </Collapse>
            </div>
          ) : (
            <Link href={`${item.subPath}`} key={index} scroll={true}>
              <a
                className={pathname == item.subPath ? selectTitle : subTitle}
                onClick={() => {
                  if (drawerVisible) setdrawerVisible(false);
                }}
              >{`${item.subtitle}`}</a>
            </Link>
          );
        })}
    </>
  );
};
interface SearchProps {
  // data: { subPath: string; subtitle: string }[];
}
const SearchItem: FC<SearchProps> = (props) => {
  // const { data } = props;
  const { searchStore, setSearchStore } = useContext(Sotre);
  const { RenderSearch } = Styles;

  return (
    <div
      onClick={() =>
        setSearchStore({
          searchState: false,
          // searchItemData: searchStore.searchItemData,
        })
      }
    >
      {searchStore.searchItemData.length == 0 ? (
        <Empty />
      ) : (
        searchStore.searchItemData.map((item, index) => {
          return (
            <Link href={item.subPath} key={index}>
              <div key={index} className={RenderSearch}>
                <a>{`${item.subtitle}`}</a>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
};
export const RenderSearchItem = React.memo(SearchItem);
export const RenderMenu = React.memo(RenderMenuMemo);
