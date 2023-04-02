import { useState, useEffect } from "react";
import { Popover, Slider, DatePicker, Empty, message } from "antd";
import VrpIcon from "../../../components/VrpIcon";
import moment from "moment";
import { connect } from "dva";
import Config from "../../../config/Config";
import {
  Terrain,
  GPSAnimation,
  Geometry,
  PipeLine,
  Model
} from "../../../components/model/";
import { CadModuleData } from "../../../components/model/CAD";
import SvgIcon from "../../../components/SvgIcon";
const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");

export const LayerKit = connect(({ layerModel, cadModel }, ownProps) => ({
  cadSource: cadModel.cadSource,
  layers: layerModel.panels.filter(e => e.isOpen)
}))(({ cadSource, layers: _layers, children, active, ...rest }) => {
  const dataSource = {
    terrain: Terrain.terrains,
    cad: CadModuleData.datas,
    gps: GPSAnimation.animations,
    area: Geometry.geometrys,
    line: PipeLine.pipes,
    build: Model.models
  };
  const [firstOpen, setFirstOpen] = useState(false);
  const [layers, setLayers] = useState([]);
  const [activeIdx, setActiveIdx] = useState(undefined);

  useEffect(
    () => {
      if (firstOpen && _layers.length) {
        setLayers(
          _layers.map(e => {
            return {
              ...e,
              title: e.data.map(c => (c.title ? c.title.toString() : ""))
            };
          })
        );
      }
    },
    [_layers.length, firstOpen]
  );
  return (
    <Popover
      content={
        <div>
          {layers.length ? (
            <ul
              className={scss["sidebar-menu"] + " " + scss["sidebar-layerkit"]}
              onClick={e => {
                let t;
                if (e.target.nodeName == "LI") t = e.target;
                else if (
                  (e.target.nodeName == "I" || e.target.nodeName == "SPAN") &&
                  e.target.parentNode.nodeName == "LI"
                ) {
                  t = e.target.parentNode;
                }
                if (t && "i" in t.dataset) {
                  setActiveIdx(
                    activeIdx == t.dataset.i ? undefined : t.dataset.i
                  );
                }
              }}
            >
              {layers.map((e, i) => {
                let ids = e.data.map(e => e.id);
                return (
                  <LayerRow
                    key={i}
                    i={i}
                    {...e}
                    active={i == activeIdx}
                    data={dataSource[e.type].filter(e => ids.includes(e.id))}
                  />
                );
              })}
            </ul>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
      }
      getPopupContainer={triggerNode => triggerNode}
      placement="topRight"
      trigger="click"
      visible={active}
      overlayClassName={scss["sidebar-menu-wrapper"]}
    >
      {{
        ...children,
        props: {
          ...rest,
          ...children.props,
          onClick: e => !firstOpen && setFirstOpen(true)
        }
      }}
    </Popover>
  );
});

const LayerRow = ({ i, active, data, type, title, icon, ...rest }) => {
  const layer = (type => {
    const l = {
      focus: () => {
        data.forEach(e => e.setVisible(!e.isVisible()));
      }
    };
    if (type == "gps") {
      return {
        bar: ({ ...props }) => {
          const onChange = time => {
            data.forEach(e =>
              e.getTimeDisplay(...time.map(e => e.format("YYYY-MM-DD HH:mm")))
            );
          };
          return (
            <>
              <DatePicker.RangePicker
                size="small"
                showTime
                format={"MM/DD HH:mm"}
                defaultValue={[moment().subtract(1, "day"), moment()]}
                onChange={(date, dateString) => {
                  onChange(date);
                }}
                onOk={time => {
                  onChange(time);
                }}
                getCalendarContainer={trigger => trigger.parentNode}
              />
              {/* &nbsp;─&nbsp;
            <DatePicker
              showTime
              format={"MM/DD HH:mm"}
              onChange={(date, dateString) => {
                console.log("Selected", date);
                console.log("Formatted", dateString);
              }}
              onOk={time => console.log("time", time)}
              getCalendarContainer={trigger => trigger.parentNode}
            /> */}
            </>
          );
        },
        focus: () => {
          data.forEach(ga => ga.setAllVisible(!ga.getGPSVisible()));
          if (process.env.NODE_ENV != "production") {
            data[0].models.length
              ? data[0].models[0].focus()
              : message.warn("未添加船只");
          }
        }
      };
    } else if (type == "terrain") {
      return {
        ...l,
        bar: ({ opacity }) => {
          const [_opacity, setOpacity] = useState(opacity);
          const opacityChange = (opacity: number) => {
            setOpacity(opacity);
            data.forEach(e => e.setOpacity(opacity));
          };
          return (
            <Slider
              min={0.01}
              max={1}
              step={0.01}
              formatter={val => (val * 100).toFixed(0) + "%"}
              value={_opacity}
              onChange={opacityChange}
              style={{ width: 250 }}
            />
          );
        }
      };
    } else return l;
  })(type);
  return (
    <li
      data-i={i}
      className={`${css["flex-center-left"]}  ${active ? scss["active"] : ""}`}
      style={{
        padding: "0 10px",
        cursor: "pointer"
      }}
      onClick={e => {
        let t;
        if (e.target.nodeName == "LI") t = e.target;
        else if (
          (e.target.nodeName == "I" || e.target.nodeName == "SPAN") &&
          e.target.parentNode.nodeName == "LI"
        ) {
          t = e.target.parentNode;
        }
        if (t) {
          layer.focus();
        }
      }}
    >
      {/\.(svg|png|jpe?g|gif)/.test(icon) ? (
        /\.svg/.test(icon) ? (
          <SvgIcon src={Config.apiHost + icon} />
        ) : (
          <img src={Config.apiHost + icon} />
        )
      ) : (
        <VrpIcon
          iconName={layer.icon}
          style={{ background: layer.icon ? "none" : "#333" }}
        />
      )}
      <span className="ellipsis" title={title} style={{ maxWidth: "3.6rem" }}>
        {title}
      </span>
      {active && (
        <div
          className={css["vrp-second-menu"]}
          style={{ right: "100%" }}
          onClick={e => e.stopPropagation()}
        >
          {layer.bar && <layer.bar {...rest} />}
        </div>
      )}
    </li>
  );
};
