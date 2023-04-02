import {
  useState,
  useRef,
  useEffect,
  useMemo,
  CSSProperties,
  ReactNode
} from "react";
import { Carousel, Icon } from "antd";
import CardLayout from "./CardLayout";

const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");
let vh = px => (px / 1080) * 100 + "vh";

interface Props {
  title?: string | ReactNode;
  enTitle?: string;
  // placement?: "horizontal" | "vertical";
  children: ReactNode;
  style?: CSSProperties;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  className?: string;
  slidesToShow?: number;
  slidesToScroll?: number;
  sliderRef?: (ref) => void;
  dropdownVisible?: boolean;
  onDropdown?: (e) => void;
  dropdown?: ReactNode;
  onItemClick?: (e, i, item) => void;
}

export default function SlideLayout({
  title,
  enTitle,
  suffixIcon = null,
  // placement = "vertical",
  children,
  style = undefined,
  className = "",
  prefixIcon = null,
  slidesToShow = 2,
  slidesToScroll = 2,
  sliderRef,
  dropdownVisible = false,
  onDropdown = e => e,
  dropdown = null,
  onItemClick
}: Props) {
  const slider = useRef();
  const visible = useMemo(() => dropdownVisible, [dropdownVisible]);
  const [boxWidth, setBoxWidth] = useState(376);
  const [activeSlide, setActiveSlide] = useState(0);
  const cardLayout = useRef();
  const dropdownBtn = useRef();

  useEffect(() => {
    sliderRef && sliderRef(slider.current);
  }, []);

  const next = () => {
    slider.current.next();
  };
  const previous = () => {
    slider.current.prev();
  };
  const handleBtnClick = e => {
    setBoxWidth(cardLayout.current.offsetWidth);
    onDropdown(e);
  };
  return (
    <CardLayout
      triggerRef={ref => (cardLayout.current = ref)}
      title={title}
      enTitle={enTitle}
      prefixIcon={prefixIcon}
      suffixIcon={
        suffixIcon ? (
          suffixIcon
        ) : (
          <>
            <span onClick={previous} data-previous>
              <img
                src={require("../../../assets/icon/icon_left1.png")}
                alt=""
              />
            </span>
            <span style={{ width: "auto" }}>
              <h5 style={{ lineHeight: "inherit", margin: "0 10px" }}>
                {activeSlide + 1}/{(children && children.length) || 0}
              </h5>
            </span>
            <span onClick={next} data-next>
              <img
                src={require("../../../assets/icon/icon_right1.png")}
                alt=""
              />
            </span>
            <span data-dropdown-btn onClick={handleBtnClick} ref={dropdownBtn}>
              <Icon
                type="more"
                style={{ transform: "rotate(90deg)", margin: "auto" }}
              />
            </span>
            {visible ? (
              <div
                className={scss["dropdown-box"]}
                style={{
                  width: boxWidth + "px"
                }}
              >
                <div>{dropdown}</div>
              </div>
            ) : null}
          </>
        )
      }
      style={style}
      className={scss["slide-layout"] + " " + className}
    >
      <Carousel
        ref={slider}
        dots={false}
        infinite={true}
        speed={500}
        slidesToShow={slidesToShow}
        swipeToSlide={true}
        slidesToScroll={slidesToScroll}
        beforeChange={(current, next) => setActiveSlide(next)}
      >
        {children}
      </Carousel>
    </CardLayout>
  );
}
