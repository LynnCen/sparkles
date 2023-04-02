import { Component } from "react";
import { ChromePicker } from "react-color";
const css = require("../styles/scss/color.scss");
const scss = require("../styles/scss/markerModal.scss");

/**
 * @name ColorSelect
 * @create: 2019/8/9
 * @description: ChromePicker颜色选择器
 */

interface Props {
  color: string;
  colorChange: (color: string) => void;
  coverStyle?: React.CSSProperties;
  // onClear?: () => void;
}

interface States {
  color: string;
  showColor: string;
  isShowPicker: boolean;
}

class ColorSelect extends Component<Props, States> {
  antCard: HTMLDivElement;
  constructor(props: Props) {
    super(props);
    this.state = {
      color: props.color,
      showColor: props.color,
      isShowPicker: false
    };
  }

  showPicker = e => {
    this.setState({ isShowPicker: !this.state.isShowPicker });
    if (!this.antCard) {
      let node = e.target;
      while (node.className.indexOf("ant-card") == -1) {
        if (node.nodeName == "BODY") return;
        node = node.parentNode;
      }
      if (node.nodeName !== "BODY") {
        this.antCard = node;
        node.style.height = "-webkit-fill-available";
      }
    } else {
      this.antCard.style.height = "-webkit-fill-available";
    }
  };

  handleChange = color => {
    this.setState({ color: color.hex, showColor: color.rgb });
    this.props.colorChange(color.hex);
  };

  handleClose = () => {
    this.setState({ isShowPicker: false });
    if (this.antCard) {
      this.antCard.style.height = "auto";
    }
  };

  // checkColor = color => {
  //   this.setState({ color });
  //   this.props.colorChange(color);
  // };

  render() {

    let cover: React.CSSProperties = {
      position: "absolute",
      top: "0px",
      right: "0px",
      bottom: "0px",
      left: "0px",
      height: "100%"
    };
    const { coverStyle } = this.props;
    coverStyle && (cover = { ...cover, ...coverStyle });
    const { color, showColor } = this.state;
    return (
      <div className={css["vrp-color-picker"]}>
        <div className={css["vrp-color-select"]}>
          <div
            style={{ backgroundColor: color }}
            className={`${css["color-circle"]}`}
            onClick={this.showPicker}
          />
        </div>
        {this.state.isShowPicker ? (
          <div>
            <div
              style={cover}
              onClick={this.handleClose}
            />
            <ChromePicker
              className={scss["color-picker"]}
              color={showColor}
              // disableAlpha={true}
              onChange={this.handleChange}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default ColorSelect;
