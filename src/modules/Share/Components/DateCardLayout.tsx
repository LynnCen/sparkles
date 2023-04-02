import { ReactNode, CSSProperties, useState, useRef } from "react";
import moment from "moment";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");

interface DateCardLayoutProps {
  title: string;
  enTitle?: string;
  range?: boolean;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;

  onDateChange?: (date, dateString) => void;
}

export default function DateCardLayout({
  title,
  enTitle,
  range = false,
  children,
  style = undefined,
  className = "",
  onDateChange
}: DateCardLayoutProps) {
  const [date, setDate] = useState(moment(new Date()).format("YYYY年MM月DD日"));
  const datePicker = useRef(null);

  return (
    <div style={style} className={className}>
      <div className={scss["flex-between"] + " " + scss["head"]}>
        <div>
          <h1>{title}</h1>
          {enTitle ? <h5 className={scss["sub-title"]}>{enTitle}</h5> : null}
        </div>
        <div
          className={css["flex-center-v"] + " " + scss["pe-auto"]}
          ref={datePicker}
          style={{
            backgroundColor: "rgba(255,255,255,.2)",
            borderRadius: "4px",
            paddingLeft: "7px"
          }}
        >
          <img src={require("../../../assets/icon/icon_rili.png")} alt="" />
          {range ? (
            <RangePicker
              dropdownClassName={scss["calendar-picker"]}
              placeholder={moment(new Date()).format("YYYY-MM-DD")}
              onChange={(date, dateString) => {
                setDate(moment(dateString, "YYYY-MM-DD"));
              }}
              getCalendarContainer={triggerNode =>
                datePicker.current.children[1]!
              }
              popupStyle={{}}
              suffixIcon={
                <img src={require("../../../assets/icon/icon_xiala.png")} />
              }
            />
          ) : (
            <DatePicker
              dropdownClassName={scss["calendar-picker"]}
              placeholder={moment(new Date()).format("YYYY-MM-DD")}
              onChange={(date, dateString) => {
                setDate(moment(dateString, "YYYY-MM-DD"));
              }}
              getCalendarContainer={triggerNode =>
                datePicker.current.children[1]!
              }
              popupStyle={{}}
              suffixIcon={
                <img
                  src={require("../../../assets/icon/icon_xiala.png")}
                  alt=""
                />
              }
            />
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
