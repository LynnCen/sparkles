import { Component, useEffect, useState } from "react";
import { Icon, Popover, Button, message } from "antd";
import { SketchPicker, ChromePicker } from "react-color";
import StrConfig from "../config/StrConfig";
import Config from "../config/Config";
import CustomFun from "../config/CustomFun";

const css = require("../styles/scss/color.scss");
const pCss = require("../styles/scss/public.scss");

/**
 * @name ColorPicker
 * @create: 2019/1/21
 * @description: 颜色选择器
 */

interface ColorPickerProps {
  colorChange: (color: string) => void;
  currentColor: string;
  onClear?: () => void;
  pickerClassName?: string;
  colorNum?: number;
}

interface ColorPickerStates {
  color: string;
  isShowPicker: boolean;
  isPickColor: boolean;
}

export default class ColorPicker extends Component<ColorPickerProps, ColorPickerStates> {
  constructor(props: ColorPickerProps) {
    super(props);
    this.state = {
      color: props.currentColor || "#FFF",
      isShowPicker: false,
      isPickColor: false
    };
  }

  /**
   * @description 地块绑定点击事件
   * @param bind
   */
  bindClick = bind => {
    const { maps } = Config;
    if (bind) {
      maps.bindEvent("click", e => {
        if (e.isLeftClick()) {
          maps.takeScreenshot(window.innerWidth, window.innerHeight).done(imgData => {
            const canvas = document.createElement("canvas");
            canvas.width = imgData.width;
            canvas.height = imgData.height;
            const ctx: any = canvas.getContext("2d");
            ctx.putImageData(imgData, 0, 0);
            const x = e.getPageX();
            const y = e.getPageY();
            const target = ctx.getImageData(x, y, 1, 1);
            const { data } = target;
            const color = CustomFun.hexify(data[0], data[1], data[2], data[3]);
            this.setState({ color });
            this.props.colorChange(color);
          });
        } else if (e.isRightClick()) {
          maps.unbindEvent("click");
          this.closeOpenPickColor(false);
        }
      });
    } else {
      maps.unbindEvent("click");
      this.closeOpenPickColor(false);
    }
  };

  /**
   * @description 开启或关闭地块取色 选中、鼠标状态修改
   */
  closeOpenPickColor = isOpen => {
    this.setState({ isPickColor: isOpen }, () => {
      document.getElementById("map_container-canvas")!.style.cursor = isOpen
        ? "crosshair"
        : "default";
    });
  };

  /**
   * @description 开启取色工具
   */
  togglePickColor = isPick => {
    const { isPickColor } = this.state;
    if (isPick && !isPickColor) {
      // this.bindClick(true);
      Config.maps.unbindEvent("click");
      // this.closeOpenPickColor(false);
      message.info("单击右键结束取色", 3);
      this.closeOpenPickColor(true);
      this.bindClick(true);
    } else {
      this.bindClick(false);
    }
  };

  /**
   * @description 显示更多颜色面板
   */
  showMoreColor = () => {
    this.togglePickColor(false);
    this.setState({ isShowPicker: !this.state.isShowPicker });
  };

  /**
   * @description 选择面板中的颜色事件
   * @param color
   */
  handleChange = color => {
    const { hex } = color;
    this.togglePickColor(false);
    this.setState({ color: hex });
    this.props.colorChange(hex);
  };

  /**
   * @description 选择预设颜色
   * @param color
   */
  checkColor = color => {
    this.togglePickColor(false);
    this.setState({ color });
    this.props.colorChange(color);
  };

  componentWillUnmount(): void {
    if (this.state.isPickColor) {
      this.bindClick(false);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentColor != this.props.currentColor)
      this.setState({ color: nextProps.currentColor });
  }

  render() {
    const { color, isPickColor } = this.state;
    const { colorNum, pickerClassName } = this.props;
    return (
      <div className={css["vrp-color-picker"]} id={"color-picker-id"}>
        <ul className={pCss["flex-center"]}>
          {color ? (
            <div className={css["current"]}>
              <li
                title={"当前颜色"}
                className={css["color-item"]}
                style={{ backgroundColor: color }}
              />
            </div>
          ) : null}

          {StrConfig.ColorSelect.slice(0, colorNum).map((item, i) => {
            return (
              <li
                key={i}
                className={css["color-item"]}
                style={{ backgroundColor: item }}
                onClick={() => this.checkColor(item)}
              />
            );
          })}
          <Icon
            className={css["color-item"] + " " + css["icon-plus"]}
            style={{ borderColor: isPickColor ? "#FF5722" : "#ddd" }}
            type={"highlight"}
            title={"地块取色"}
            onClick={() => this.togglePickColor(true)}
          />
          <Popover
            placement={"bottomRight"}
            trigger={"hover"}
            content={
              <div onMouseDown={e => e.stopPropagation()}>
                <SketchPicker
                  className={pickerClassName}
                  color={color}
                  disableAlpha={true}
                  onChange={this.handleChange}
                />
              </div>
            }
          >
            <Button
              style={{
                position: "relative",
                padding: 0,
                margin: "0 2px",
                width: 16,
                lineHeight: 1,
                height: "auto",
                border: "none",
                backgroundColor: "transparent"
              }}
              onClick={this.showMoreColor}
            >
              <Icon
                className={css["color-item"] + " " + css["icon-plus"]}
                type={"plus"}
                title={"更多颜色"}
              />
            </Button>
          </Popover>

          {this.props.onClear ? (
            <Icon
              className={css["color-item"]}
              type="minus-circle"
              style={{ color: "rgb(195, 16, 3)", borderColor: "transparent" }}
              title={"取消颜色"}
              onClick={this.props.onClear}
            />
          ) : null}
        </ul>
      </div>
    );
  }
}

/**
 * @description 只显示一个当前色块 点击触发
 * @param onChange
 * @param selected
 * @constructor
 */
export const SingleColorPick = ({ onChange, selected }) => {
  const [color, onSetColor] = useState(selected);

  useEffect(
    () => {
      onSetColor(selected);
    },
    [selected]
  );

  function handleChange(color) {
    onSetColor(color.hex);
    onChange(color.hex);
  }

  return (
    <>
      <Popover
        placement="bottomRight"
        trigger={"click"}
        style={{ padding: 0 }}
        content={<ChromePicker color={color} onChange={handleChange} />}
      >
        <div className={css["single-color-selector"]} style={{ backgroundColor: color }} />
      </Popover>
    </>
  );
};
