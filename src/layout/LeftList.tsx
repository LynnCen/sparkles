import React, { PureComponent, useState, useEffect } from "react";
import { MoreOutlined } from "@ant-design/icons";
import axios from "axios";
import map from "utils/TDTMap";
import { message } from "antd";
import sxcwms from "config/sxcwms";
import context from "layout/context";
import Service from "utils/Service";

interface LeftListProps {
  selectKey: string;
  buttonKey?: boolean;
  clickChange: ({ code, townName }) => void;
  popupVisibleChange?: () => void;
}

interface LeftListStates {
  data: any[];
}

export default class LeftList extends PureComponent<LeftListProps, LeftListStates> {
  static contextType = context;
  state = {
    data: [],
  };
  componentDidMount() {
    Promise.all([axios.get("/home/list_town"), axios.get("/home/list_town_centroid")]).then(
      ([r1, r2]) => {
        if (r1.data && r2.data) {
          let data = r1.data.map((e) => {
            let cent = r2.data.find((cent) => cent.townName == e.townName);
            return cent ? { ...e, ...cent } : e;
          });
          this.setState({ data });
          this.context.setStore({ townList: data });
          data.forEach((item) => {
            !/莲都/.test(item.townName) &&
              map.addLabel({
                lng: item.x,
                lat: item.y,
                text: item.townName,
                contentType: "town",
                className: "tdt-label label-town",
                style: { fontSize: (/白云|万象/.test(item.townName) ? 16 : 18) + "px" },
              });
          });
          map.map.addEventListener("click", this.onMapClick);
        }
      }
    );
  }
  componentWillUnmount() {
    map.map.removeEventListener("click", this.onMapClick);
  }
  onMapClick = ({ lnglat: { lng, lat } }) => {
    if (map.map.getZoom() <= map.TOWN_TITLE_ZOOM) {
      Service.getTownName({ x: lng, y: lat }).then((r) => {
        r.data && this.onTownChange(r.data);
      });
    }
  };
  onTownChange = (townName) => {
    let town = this.context.getTown({ townName });
    console.log(town)
    if (town) {
      this.context.setTownLayerAndCode(town);
      this.context.centerTown(town);
    }
  };
  render() {
    const { buttonKey, selectKey, popupVisibleChange } = this.props;
    const { data } = this.state;
    return (
      <div>
        {data.map((item) => {
          return (
            <div
              key={item.code}
              className={"list-child" + (item.code == selectKey ? " child-select" : "")}
              onClick={() => this.onTownChange(item.townName)}
            >
              <div className={"list-child-L"}>{item.townName}</div>
              {/* <div className={"list-child-R"}> */}
              <div className={"child-text"}>
                <span>{item.area}</span>
                <span>万亩</span>
              </div>
              <div className={"child-text"}>
                <span>{item.plant}</span>
                <span>万株</span>
              </div>
              {buttonKey && item.code == selectKey ? (
                <div
                  className={"open-button"}
                  onClick={(e) => {
                    e.stopPropagation();
                    popupVisibleChange();
                  }}
                >
                  <MoreOutlined />
                </div>
              ) : null}
            </div>
            // </div>
          );
        })}
      </div>
    );
  }
}
