import { Input } from "antd";
import Styles from "./search.module.scss";
import { SearchOutlined } from "@ant-design/icons";
import React, { FC, useContext, useEffect, useRef, useState } from "react";
import Sotre from "../utils/context";
import { useDebounce, useDebounceHook } from '../../hooks/useDebounce'
interface IProps {
  onSearch?: (text: string) => void;
  width?: number;
}
const Search: FC<IProps> = (props) => {
  const { width } = props;
  const [value, setValue] = useState("")
  const debounceText = useDebounceHook(value, 2000);
  const {
    searchStore,
    store,
    onSearch,
    setSearchStore,
    drawerVisible,
    setdrawerVisible,
  } = useContext(Sotre);
  const { search_box, search } = Styles;
  useEffect(() => {
    setValue("")

  }, [store.headerKey])
  useEffect(() => {
    // ...
    console.info("change", debounceText);
  }, [debounceText]);
  const hangeInput = (e) => {
    setValue(e.target.value)
    if (e.target.value) {
      if (drawerVisible) setdrawerVisible(false);
      setSearchStore({
        searchState: true,
        // searchItemData: searchStore.searchItemData,
      });
      onSearch(e.target.value);
    } else {
      setSearchStore({
        searchState: false,
        // searchItemData: searchStore.searchItemData,
      });
    }
  };
  const handleDebounce = () => {
    useDebounce(hangeInput, 300)
  }
  const prefix = () => <><span className={Styles.prefix}></span></>

  return (
    <div className={search_box}>
      <Input
        placeholder="Search..."
        allowClear
        width={width}
        bordered={false}
        value={value}
        prefix={prefix}
        className={search}
        onChange={hangeInput}
        onPressEnter={() => {
          setSearchStore({
            searchState: false,
            // searchItemData: searchStore.searchItemData,
          });
        }}
      />
    </div>
  );
}
export default React.memo(Search);
