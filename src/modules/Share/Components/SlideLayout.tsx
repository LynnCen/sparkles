import { useState, useRef, useEffect, CSSProperties, ReactNode } from "react";
import { Carousel, Icon, Select } from "antd";
import CardLayout from "./CardLayout";
const { Option } = Select;

const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");
let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  title?: string;
  enTitle?: string;
  // placement?: "horizontal" | "vertical";
  children: ReactNode;
  style?: CSSProperties;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  className?: string;
  slidesToShow?: number;
  dropdownData?: Array<any>;
  onItemClick?: (e, i, item) => void;
}

export default function SlideLayout({
  title,
  enTitle,
  // placement = "vertical",
  children,
  style = undefined,
  className = "",
  prefixIcon = null,
  suffixIcon = null,
  slidesToShow = 2,
  dropdownData = [],
  onItemClick
}: Props) {
  const slider = useRef();
  const [boxVisible, setBoxVisible] = useState(false);
  const [boxWidth, setBoxWidth] = useState(376);
  const [total, setTotal] = useState(Math.ceil(dropdownData.length / 2));
  const [pages, setPages] = useState(1);
  const cardLayout = useRef();
  const dropdownBtn = useRef();
  const previous = () => {
    slider.current.slick.slickPrev();
    let num = pages - 1;
    if (num <= 0) {
      num = total;
    }
    setPages(num);
  };
  const next = () => {
    slider.current.slick.slickNext();
    let num = pages + 1;
    if (num > total) {
      num = 1;
    }
    setPages(num);
  };
  const handleBtnClick = e => {
    setBoxWidth(cardLayout.current.offsetWidth);
    setBoxVisible(!boxVisible);
  };
  const suffix = () => {
    if (!suffixIcon)
      return (
        <div className={scss["pagination"]}>
          <span onClick={previous} data-previous>
            <img src={require("../../../assets/icon/icon_left1.png")} alt="" />
          </span>
          <span className={scss["pages"]}>
            {pages}/{total}
          </span>
          <span onClick={next} data-next>
            <img src={require("../../../assets/icon/icon_right1.png")} alt="" />
          </span>
          <span data-dropdown-btn onClick={handleBtnClick} ref={dropdownBtn}>
            <Icon
              type="more"
              style={{ transform: "rotate(90deg)", margin: "auto" }}
            />
          </span>
          <div
            className={scss["dropdown-box"]}
            style={{
              display: boxVisible ? "block" : "none",
              width: boxWidth + "px"
            }}
          >
            <div>
              {dropdownData.map((item, i) => (
                <div
                  className={
                    scss["flex-center-between"] + " " + scss["pointer"]
                  }
                  onClick={e => {
                    onItemClick(e, i, item);
                    setBoxVisible(false);
                  }}
                  key={i}
                >
                  <h5>{item.name}</h5>
                  <Icon type="right" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    else {
      if (suffixIcon.props.children) {
        if (Array.isArray(suffixIcon.props.children)) {
          return {
            ...suffixIcon,
            props: {
              ...suffixIcon.props,
              children: suffixIcon.props.children.map(el => ({
                ...el,
                props: { ...el.props, onPrevious: previous, onNext: next }
              }))
            }
          };
        }
      }
      return {
        ...suffixIcon,
        props: { ...suffixIcon.props, onPrevious: previous, onNext: next }
      };
    }
  };
  return (
    <CardLayout
      triggerRef={ref => (cardLayout.current = ref)}
      title={title}
      enTitle={enTitle}
      prefixIcon={prefixIcon}
      suffixIcon={suffix()}
      style={style}
      className={scss["slide-layout"] + " " + className}
    >
      <Carousel
        ref={slider}
        dots={false}
        infinite={true}
        speed={500}
        slidesToShow={
          Array.isArray(children) && children.length ? slidesToShow : 1
        }
        swipeToSlide={true}
        slidesToScroll={
          Array.isArray(children) && children.length ? slidesToShow : 1
        }
      >
        {children}
      </Carousel>
    </CardLayout>
  );
}
