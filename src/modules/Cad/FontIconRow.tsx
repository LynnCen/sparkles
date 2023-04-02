import React, { useEffect, useState, useRef } from "react";
import { Pagination, message, Cascader, Switch } from "antd";
import DataService from "../../services/DataService";
import Config from "../../config/Config";
const css = require("../../styles/custom.css");

type IconDto = { id: number; url: string; [key: string]: any };
export function FontIconRow({
  checked = true,
  checkedChange = (v: boolean) => null,
  imageUrl = "",
  imageChange = (url: string) => null,
  pageSize = 14,
  cardStyle = { padding: 10, gap: 8 }
}) {
  const classTypes = { 标签: 1, 动态: 3 };
  const classType = classTypes["标签"];
  const [options, setOptions] = useState(
    Object.entries(classTypes).map(([k, v]) => ({
      value: v,
      label: k + "图标",
      children: []
    }))
  );
  const [icons, setIcons] = useState<Array<IconDto>>([]);
  const [pageProp, setPageProp] = useState({ current: 1, total: 0, pageSize });
  const iconListRef = useRef(null);
  const [_cardStyle, setCardStyle] = useState(cardStyle);

  const genOptions = async () => {
    for (const [i, type] of options.map((e, i) => [i, e.value])) {
      const data = { type };
      DataService.getAllClass(data, (flag, res) => {
        if (flag) {
          options[i].children = res.data.map(e => ({
            value: e.id,
            label: e.name,
            type: e.type
          }));
          i === 1 && setOptions([...options]);
        } else message.error(res.message);
      });
    }
  };
  const getIconList = (page, type: number, classId?: number) => {
    const data = {
      page,
      type,
      size: pageSize,
      ...(classId ? { classId } : null)
    };
    DataService.findIcon(data, (flag, res) => {
      if (flag) {
        setIcons(res.data.list);
        setPageProp({ ...pageProp, current: page, total: res.data.count });
      } else message.error(res.message);
    });
  };
  const genCardStyle = (width: number) => {
    const { padding, gap } = cardStyle;
    const rowCount = pageSize / 2.0;
    const iconsRowRealWidth = width - padding * 2 - gap * (rowCount - 1);
    const iconWidth = iconsRowRealWidth / rowCount;
    setCardStyle({
      ...cardStyle,
      minHeight: icons.length
        ? `${iconWidth * 2 + padding * 2 + gap}px`
        : "unset",
      height: "auto",
      display: "grid",
      gridTemplateColumns: icons.length
        ? `repeat(auto-fill, ${iconWidth}px)`
        : "unset",
      gridTemplateRows: icons.length ? "1fr 1fr" : "unset",
      boxShadow: "0 0 0px 1px #eee"
    });
  };

  useEffect(
    () => {
      if (!icons.length) {
        genOptions();
        getIconList(1, classType);
      } else {
        const iconListNode = iconListRef.current;
        iconListNode && genCardStyle(iconListNode.offsetWidth);
      }
    },
    [icons.length]
  );
  return (
    <>
      <div className={css["flex-center-left"]}>
        <label className={css["flex-none-label"]}>图标</label>
        <Cascader
          options={options}
          expandTrigger="hover"
          onChange={(value: (string | number)[]) =>
            value.length && getIconList(1, ...value)
          }
          placeholder="选择图标"
          className={css["m-r-sm"]}
        />
        <span className={css["m-r-sm"]}>
          <img
            src={
              imageUrl.startsWith("http") ? imageUrl : Config.apiHost + imageUrl
            }
            style={{ width: "24px" }}
          />
        </span>
        <Switch
          checkedChildren="开"
          unCheckedChildren="关"
          checked={Boolean(checked)}
          onChange={checkedChange}
        />
      </div>
      <div
        ref={iconListRef}
        className={css["vrp-icon-list"]}
        style={_cardStyle}
      >
        {icons.length > 0 ? (
          icons.map((item, i) => (
            <div
              className={css["vrp-thumb"] + " "}
              key={i}
              style={{
                margin: 0,
                width: "unset",
                height: "unset",
                backgroundImage: `url(${Config.apiHost + item.url})`,
                backgroundSize: "inherit"
              }}
              onClick={() => imageChange(item.url)}
            />
          ))
        ) : (
          <div className={css["icon-none"]}>该分类暂无图标</div>
        )}
      </div>
      <div className={css["text-center"] + " " + css["m-y-sm"]}>
        <Pagination
          defaultCurrent={1}
          {...pageProp}
          size="small"
          onChange={page => getIconList(page, classType)}
        />
      </div>
    </>
  );
}
