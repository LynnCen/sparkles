import { Component } from "react";
import VrpIcon from "../../components/VrpIcon";
import DrawInit from "../../components/tools/DrawInit";
import Config from "../../config/Config";
import Draw from "../../components/tools/DrawInit";
import SelectModal from "../Modal/SelectModal";
import PlanService from "../../services/PlanService";
import CustomFun from "../../config/CustomFun";
import Mark from "../../components/model/Mark";
import Coordinate from "../../components/tools/Coordinate";

const css = require("../../styles/custom.css");

/**
 * @name Select
 * @create: 2018/12/27
 * @description: 框选
 */

interface SelectProps {}

interface SelectStates {
  isModal: boolean;
  data: any;
}

class Select extends Component<SelectProps, SelectStates> {
  constructor(props: SelectProps) {
    super(props);
    this.state = {
      isModal: false,
      data: {}
    };
  }
  handleKeyDown = e => {
    CustomFun.onKeyDown(e, 27, () => {
      DrawInit.DrawInit();
      window.removeEventListener("keydown", this.handleKeyDown);
    });
  };

  handlerClick = () => {
    window.addEventListener("keydown", this.handleKeyDown);
    this.setState({
      isModal: false
    });
    DrawInit.DrawInit();
    const { maps, vrPlanner } = Config;
    const STATE_CREATE_NEW_AREA: string = "create";
    const STATE_ADD_TO_AREA: string = "add";
    let stateCurrent = STATE_CREATE_NEW_AREA;
    const polygonLayer =
      maps.getLayerById("selectLayer") ||
      Draw.PolygonLayerInit("selectLayer", new vrPlanner.Color("FFFFFFAA"));
    const lineLayer =
      maps.getLayerById("auxiliary") ||
      Draw.LineLayerInit(
        "auxiliary",
        2.0,
        false,
        new vrPlanner.Color("#FF0000FF"),
        vrPlanner.Style.LineStyle.APPEARANCE_FLAT_2D
      );
    let polygon;
    let NewLine;
    maps.addLayer(lineLayer);
    maps.addLayer(polygonLayer);
    let firstClick = false;
    maps.bindEvent("click", event => {
      const geo = event.getGeoLocation();
      switch (stateCurrent) {
        case STATE_CREATE_NEW_AREA:
          if (geo != null && event.isLeftClick()) {
            NewLine = new Config.vrPlanner.Feature.Line();
            lineLayer.addFeature(NewLine);
            polygon = new vrPlanner.Feature.Polygon();
            polygonLayer.addFeature(polygon);
            for (let i = 0; i < 5; i++) {
              polygon.addVertex(geo);
              NewLine.addVertex(geo);
            }
            maps.bindEvent("mousemove", mouseEvent => {
              if (!firstClick) {
                firstClick = true;
                Config.maps.getGeoLocationAtScreenPos(
                  mouseEvent.getPageX(),
                  mouseEvent.getPageY(),
                  geoLocation => {
                    if (geoLocation.getGeoLocation()) {
                      const g = geoLocation.getGeoLocation();
                      /**
                       * 3个点：临边x 对角x,y 临边y
                       */
                      const geos = [
                        [g.x(), geo.y(), geo.z()],
                        [g.x(), g.y(), geo.z()],
                        [geo.x(), g.y(), geo.z()]
                      ].map(v => new vrPlanner.GeoLocation(...v));
                      polygon.clearVertices();
                      polygon.addVertex(geo);
                      geos.forEach((g, i) => {
                        NewLine.setVertex(i + 1, g);
                        polygon.addVertex(g);
                      });
                      polygon.addVertex(geo);
                    }
                    firstClick = false;
                  }
                );
              }
            });
            stateCurrent = STATE_ADD_TO_AREA;
          }
          break;
        case STATE_ADD_TO_AREA:
          if (geo != null) {
            if (event.isLeftClick() && polygon.getNumVertices() >= 2) {
              const listId: any = [];
              Mark.marks.forEach(mark => {
                const pos = mark.geo;
                if (polygon.contains(pos.x(), pos.y())) {
                  listId.push(mark.id);
                  mark.setVisible(true);
                }
              });
              // const aabb = polygon.getAABB();
              // const minX = aabb.getMinX();
              // const minY = aabb.getMinY();
              // const maxX = aabb.getMaxX();
              // const maxY = aabb.getMaxY();
              // const geoBotLeft = new vrPlanner.GeoLocation(minX, minY);
              // const geoTopRight = new vrPlanner.GeoLocation(maxX, maxY);
              // const posBotLeft = Coordinate.MercatorToWGS84(geoBotLeft);
              // const posTopRight = Coordinate.MercatorToWGS84(geoTopRight);
              // console.log(posBotLeft, posTopRight);
              if (listId.length !== 0) {
                PlanService.getData(
                  { id: Config.PLANID, dataIdList: listId.join(",") },
                  (flag, res) => {
                    flag && this.setState({ data: res.data, isModal: true });
                  }
                );
              }
              maps.unbindEvent("click");
              maps.unbindEvent("mousemove");
              // lineLayer.removeFeature(NewLine);
              stateCurrent = STATE_CREATE_NEW_AREA;
            }
          }
          break;
      }
    });
  };

  closeModal = () => {
    this.setState({
      isModal: false
    });
    DrawInit.DrawInit();
  };

  render() {
    return (
      <div>
        <VrpIcon
          className={css["vrp-menu-icon"]}
          iconName={"icon-region"}
          title="框选"
          onClick={this.handlerClick}
        />
        {this.state.isModal ? (
          <SelectModal closeModal={this.closeModal} data={this.state.data} />
        ) : null}
      </div>
    );
  }
}

export default Select;
