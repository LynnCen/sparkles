import { CSSProperties, useEffect, useState } from "react";
import { Radio } from "antd";
// import CardLayout from "../../Components/CardLayout";
// import DateCardLayout from "../../Components/DateCardLayout";
// import moment from "moment";
// const { Option } = Select;
// const css = require("../../../../styles/custom.css");
const scss = require("../../../../styles/scss/sharepage.scss");
let vh = px => (px / 1080) * 100 + "vh";

// const data = {
//   学生: [
//     {
//       name: "食堂消费",
//       value: 6589,
//       icon: require("../../../../assets/lsms/icon_shitang.png")
//     },
//     {
//       name: "超市消费",
//       value: 955,
//       icon: require("../../../../assets/lsms/icon_chaoshi.png")
//     },
//     {
//       name: "其他消费",
//       value: 233,
//       icon: require("../../../../assets/lsms/icon_qita.png")
//     }
//   ],
//   教师: [],
//   职工: []
// };

// const dateRange = new Array(15).fill(1).map((e, i) => e + i);
// const timeFormat = "HH:mm";

interface Props {
  title?: string;
  enTitle?: string;
  href?: string;
  datePicker?: boolean;
  range?: boolean;
  data: Array<any>;
  arrowIcon: boolean;
  style?: CSSProperties;
  className?: string;
}

export default function RadioCard({
  title,
  enTitle,
  href,
  datePicker = true,
  range = false,
  data,
  arrowIcon = false,
  style = undefined,
  className = ""
}: Props) {
  // const Component = datePicker ? DateCardLayout : CardLayout;
  // const leftGroup = ["学生", "教师", "职工"];
  // const rightGroup = ["次数(次)", "金额(元)"];
  const [_data, setData] = useState(data);
  // const [leftRadio, setLeftRadio] = useState("3");
  // const [rightRadio, setRightRadio] = useState("frequency");
  // const [timeRange, setTimeRange] = useState(1);

  // const changeRange = value => {
  //   setTimeRange(value);
  // };

  const getByAllPayOnline = (type, inittime = "", endtime = "") => {
    let url = `${
      process.env.lizhongAPI
    }/Pertypeamount/getByAllPayOnline?pertype=${type}&=inittime=${inittime}&endtime=${endtime}`;
    fetch(url)
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          setData(data.map(item => ({ ...item, value: res.data[item.type] })));
        } else setData(data);
      })
      .catch(e => console.error(e));
  };
  const changeLeftRadio = e => {
    // setLeftRadio(e.target.value);
    getByAllPayOnline(e.target.value);
    // if (e.target.value == "all") {
    //   setData(data[e.target.value][rightRadio]);
    // } else setData(data[e.target.value]);
  };
  // const changeRightRadio = e => {
  //   setRightRadio(e.target.value);
  //   setData(data[leftRadio][e.target.value]);
  // };
  useEffect(() => {
    getByAllPayOnline(3);
  }, []);
  return (
    <div
      style={style}
      className={scss["card-layout"] + " " + scss["radio-card"]}
    >
      <div className={scss["flex-between"]}>
        <div>
          {title ? (
            <a href={href} className={scss["pe-auto"]} target="_blank">
              <h1 style={{ marginBottom: enTitle ? "auto" : vh(24) }}>
                {title}
              </h1>
            </a>
          ) : null}
          {enTitle ? (
            <h5 className={scss["sub-title"]} style={{ marginBottom: vh(10) }}>
              {enTitle}
            </h5>
          ) : null}
        </div>
      </div>
      <div className={scss["flex-center-around"] + " " + scss["center"]}>
        {_data.map((item, i) => (
          <div className="item center" key={i}>
            <img src={item.icon} alt="" />
            <h4 className={""}>{item.name}</h4>
            <h1 className={""}>{item.value}</h1>
          </div>
        ))}
      </div>
      <div className={scss["flex-between"] + " " + scss["radio-group"]}>
        <div className={scss["pe-auto"]} key={0}>
          <Radio.Group
            defaultValue="3"
            buttonStyle="solid"
            onChange={changeLeftRadio}
          >
            <Radio.Button key={0} value="3">
              全部
            </Radio.Button>
            <Radio.Button key={1} value="1">
              学生
            </Radio.Button>
            <Radio.Button key={2} value="2">
              教师
            </Radio.Button>
          </Radio.Group>
        </div>
        <div className={scss["pe-auto"]} key={1}>
          <Radio.Button value="amount">单位(元)</Radio.Button>
          {/* {leftRadio == "all" ? (
            <Radio.Group
              defaultValue="frequency"
              buttonStyle="solid"
              onChange={changeRightRadio}
            >
              <Radio.Button key={0} value="frequency">
                次数(次)
              </Radio.Button>
              <Radio.Button key={1} value="amount">
                金额(元)
              </Radio.Button>
            </Radio.Group>
          ) : (
            <Radio.Button key={0} value="num">
              单位(人)
            </Radio.Button>
          )} */}
        </div>
      </div>
    </div>
  );
}
