import React, { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { Input, Checkbox, Row, Col, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import CheckboxGroup from "antd/lib/checkbox/Group";
import { FixedSizeList } from "react-window";
import unionBy from "lodash/unionBy";
import remove from "lodash/remove";

/**
 *@description 搜索弹窗
 */

interface PopUpProps {
  title;
  code: string;
  columnKey: string; //搜索对应的数据键名
  request?: {
    url?: string;
    pagi?: boolean; //分页
  };
  dataSource?: any[];
  useCheck?: boolean; //左侧选中框
  checkedItems: any[];
  keyword?: string;
  onCheck?: (item, checked) => void; //选中或点击项
  onChange: (checkedItems, key?) => void;
  onClose?: () => void;
  className?: string;
  style?: CSSProperties;
  height?: number;
}

export default function SearchPopup({
  title,
  columnKey,
  request = {},
  dataSource,
  useCheck = true,
  checkedItems,
  keyword: key = "",
  onClose = () => { },
  onCheck,
  onChange,
  code,
  className = "",
  height = 200,
  ...rest
}: PopUpProps) {
  const size = 100;
  const ref = useRef();
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    hasMore: false,
    loading: false,
  });
  const [data, setData] = useState(dataSource || []); //过滤的数据源
  const [items, setCheckedItems] = useState(checkedItems);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const _dataSource = useRef(dataSource || []); //原始数据源
  const [keyword, setKeyword] = useState(key);

  useEffect(() => {
    request.url && getMoreData();
  }, [code]);
  useEffect(() => {
    if (Array.isArray(dataSource)) {
      _dataSource.current = dataSource;
      setData(dataSource);
      setKeyword("");
    }
  }, [dataSource]);
  useEffect(() => {
    if (dataSource && checkedItems) {
      setCheckedItems(checkedItems);
      setCheckState(dataSource, checkedItems);
    }
  }, [checkedItems, dataSource]);

  const onScroll = (e) => {
    const el = ref.current as HTMLElement;
    let toBottom = el.scrollTop + el.offsetHeight + 30 > el.scrollHeight;
    if (toBottom && pagination.hasMore) {
      !pagination.loading && getMoreData(pagination.page + 1);
    }
  };

  const getMoreData = (page = 1, key = keyword) => {
    const isNewKey = keyword != key;
    if (isNewKey) {
      pagination.page = 1;
      setKeyword(key);
    }
    const params = request.pagi ? { page: pagination.page, size, key } : {};
    setPagination({ ...pagination, loading: true });
    // console.log(page, key, pagination.loading);
    axios
      .get(request.url, { params })
      .then((res) => {
        let _data = res.data;
        // console.log(page, key, pagination.loading);
        setPagination({ ...pagination, loading: false });
        if (request.pagi) {
          const { total, list } = res.data;
          setPagination({ ...pagination, total, page, hasMore: total > page * size });
          _data = isNewKey ? list : [...data, ...list];
          // console.log(key);
        } else _dataSource.current = _data;
        setData(_data);
        if (useCheck) {
          setCheckState(_data);
        } else {
          setCheckedItems(_data);
        }
      })
      .catch((e) => {
        if (axios.isCancel(e)) {
          // console.log(e);
        }
      });
  };

  function checkChange(ev, item) {
    const { checked } = ev.target;
    const index = items.findIndex((e) => e.id == item.id);
    if (checked) {
      items.push(item);
    } else items.splice(index, 1);
    setCheckState(data);
    setCheckedItems([...items]);
  }

  const _onCheck = onCheck || (() => { });

  const onCheckAllChange = (e) => {
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    if (e.target.checked) {
      setCheckedItems(keyword ? unionBy(items, data, "id") : [...data]);
    } else {
      remove(items, (o) => data.find((d) => d.id == o.id)); //去除已选项在列表里出现的
      setCheckedItems(keyword ? items : []); //有关键词，则为被过滤的已选项
    }
  };

  const setCheckState = (_data, checks = items) => {
    setIndeterminate(
      _data.length &&
      checks.length &&
      _data.find((o) => checks.find((e) => o.id == e.id)) &&
      !_data.every((o) => checks.find((e) => o.id == e.id))
    );
    console.log(_data, checks);
    setCheckAll(
      _data.length && checks.length && _data.every((o) => checks.find((e) => o.id == e.id))
    );
  };

  const searchData = (val) => {
    if (request.pagi) {
      getMoreData(1, val);
    } else {
      let filtered = _dataSource.current.filter((d) => d[columnKey].indexOf(val) > -1);
      setData(filtered);
      setKeyword(val);
      setCheckState(filtered);
    }
  };

  const CheckboxRow = ({ index, style, data, isScrolling }) => {
    const item = data[index];
    return (
      <Row key={index} justify="space-between" style={style}>
        <Col className="">
          {useCheck ? (
            <>
              <Checkbox
                checked={items.find((e) => e.id == item.id)}
                defaultChecked={checkedItems.find((e) => e.id == item.id)}
                onChange={(e) => checkChange(e, item)}
              ></Checkbox>
              <span style={{ marginLeft: 8 }} onClick={(e) => _onCheck(item, true)}>
                {item[columnKey]}
              </span>
            </>
          ) : (
            <span onClick={(e) => _onCheck(item, true)}>{item[columnKey]}</span>
          )}
        </Col>
        <Col>{index + 1}</Col>
      </Row>
    );
  };
  return (
    <div className={"search-popup " + className} {...rest}>
      <div className={"popup-title"}>
        <Input
          placeholder="请输入关键词搜索"
          prefix={<SearchOutlined />}
          value={keyword}
          onChange={(e) => searchData(e.target.value)}
        />
      </div>

      <div className={"popup-checkbox"}>
        {useCheck && (
          <div className={"checkbox-title"}>
            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
              {title}({data && data.length})
            </Checkbox>
            <div>已选({items.length})</div>
          </div>
        )}
        <div
          className={"checkbox-content"}
          onScroll={request.pagi && !pagination.loading && onScroll}
          ref={ref}
          style={{ height: useCheck ? "calc(100% - 36px)" : "100%" }}
        >
          <CheckboxGroup>
            <FixedSizeList
              itemCount={data.length}
              itemSize={35}
              height={height}
              width="100%"
              itemData={data}
              useIsScrolling
              onScroll={({ scrollDirection, scrollOffset, scrollUpdateWasRequested }) => {
                // console.log(scrollDirection, scrollOffset, scrollUpdateWasRequested);
              }}
            >
              {CheckboxRow}
              {/* {data.map((item, index) => {
                return (
                  <Row key={index} justify="space-between">
                    <Col>
                      <Checkbox
                        data-item={item}
                        checked={items.find((e) => e.id == item.id)}
                        defaultChecked={checkedItems.find((e) => e.id == item.id)}
                        onChange={(e) => checkChange(e, item)}
                      >
                        {item[columnKey]}
                      </Checkbox>
                    </Col>
                    <Col>{index + 1}</Col>
                  </Row>
                );
              })} */}
            </FixedSizeList>
          </CheckboxGroup>
          <Row justify="center" style={{ color: "#000" }}>
            {pagination.loading && <Spin />}
            {request.pagi && !pagination.hasMore && <span>&nbsp;no more ...</span>}
          </Row>
        </div>
      </div>
      <div className={"popup-button"}>
        <div onClick={() => onChange(items, keyword)}>确 定</div>
        <div onClick={onClose}>关 闭</div>
      </div>
    </div>
  );
}
