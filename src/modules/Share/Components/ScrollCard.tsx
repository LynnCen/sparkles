import { Component, CSSProperties } from "react";
import CardLayout from "../Components/CardLayout";

const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");

let vh = px => (px / 1080) * 100 + "vh";

// selector:滚动盒子(子节点margin-y:0), prop: state对象属性,
export function scroll(selector, data, callback) {
  let over = false;
  const timeId = setInterval(() => {
    let box = document.querySelector(selector)!;
    let layout = box.parentNode;
    if (box && layout) {
      clearInterval(timeId);
      setInterval(() => {
        if (box) {
          let top = box.offsetTop;
          box.style.top = --top + "px";
          let rect1 = layout.getBoundingClientRect();
          let rect2 = box.children[0].getBoundingClientRect();
          let _data = data;
          if (rect2.y < rect1.y && !over) {
            over = true;
            _data.push(data[0]);
            callback(_data);
          } else if (rect2.bottom <= rect1.y && over) {
            over = false;
            _data.shift();
            callback(_data);
            box.style.top = vh(top + box.children[0].offsetHeight);
          }
        }
      }, 100);
    }
  }, 50);
}

interface ScrollCardProps {
  title?: string;
  enTitle?: string;
  placement?: "horizontal" | "vertical";
  data: Array<Object>;
  style?: CSSProperties;
  className?: string;
}
interface ScrollCardStates {
  data: Array<Object>;
}

export default class ScrollCard extends Component<
  ScrollCardProps,
  ScrollCardStates
> {
  over = false;
  scrollBox: HTMLElement;
  scrollLayout: HTMLElement;
  static defaultProps = {
    data: null,
    style: undefined,
    className: ""
  };
  constructor(props) {
    super(props);
    this.state = { data: props.data };
  }
  componentDidMount() {
    scroll("#scroll-box", this.state.data, data => this.setState({ data }));
  }
  render() {
    const { title, enTitle, style, className, placement } = this.props;
    const { data } = this.state;
    return (
      <CardLayout
        style={style}
        title={title}
        enTitle={enTitle}
        placement={placement}
        className={scss["pe-auto"] + " " + className}
      >
        <div className={scss["hide-scrollbar"]} style={{ height: vh(460) }}>
          <div
            className={""}
            id="scroll-box"
            ref={ref => (this.scrollBox = ref!)}
            style={{
              position: "absolute"
            }}
          >
            {data.map((item, i) => (
              <div
                className={scss["hover-bg-white-dot1"]}
                key={i}
                style={{
                  padding: `${vh(14)} 0`,
                  borderTop: "dashed 1px rgba(255,255,255,0.3)",
                  borderBottom: "dashed 1px rgba(255,255,255,0.3)"
                }}
              >
                <img src={item.thumbnail} alt="" />
              </div>
            ))}
          </div>
        </div>
      </CardLayout>
    );
  }
}
