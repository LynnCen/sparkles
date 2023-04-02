import Config from "../../config/Config";
import Draw from "../../modules/Menu/Draw";
import Bulldoze from "../../modules/Menu/Bulldoze";

export default class DrawLines {
  /**
   * @description 初始化点层
   * @param pointId 点层Id  string
   * @param pointSize 点的大小  double
   * @param pointColor 点的颜色 (Config.vrPlanner.Color(0,0,0,0))
   * @returns 返回点层 (该层上的点样式相同)
   */
  static PointLayerInit(pointId, pointSize, pointColor) {
    const _style = new Config.vrPlanner.Style.PointStyle();
    const _layer = new Config.vrPlanner.Layer.FeatureLayer(pointId);
    _style.setDepthTest(false);
    _style.setRadius(pointSize);
    _style.setColor(pointColor);
    _layer.setStyle(_style);
    return _layer;
  }

  /**
   * @description 初始化线层
   * @param lineId 线层Id   string
   * @param lineWidth 线的宽度  double
   * @param lineColor 线的颜色  (Config.vrPlanner.Color(0,0,0,0))
   * @param depthTest 是否穿透
   * @param lineStyle 线的模式
   *                   (Config.vrPlanner.Style.LineStyle.APPEARANCE_FLAT_2D
   *                    Config.vrPlanner.Style.LineStyle.APPEARANCE_CYLINDER
   *                    Config.vrPlanner.Style.LineStyle.APPEARANCE_FLAT (default)
   *                    Config.vrPlanner.Style.LineStyle.APPEARANCE_VECTOR_DATA
   *                    Config.vrPlanner.Style.LineStyle.UNIT_DEFAULT
   *                    Config.vrPlanner.Style.LineStyle.UNIT_PIXELS)
   * @returns 返回线层  (该层上的线样式相同)
   */
  static LineLayerInit(lineId, lineWidth, depthTest, lineColor, lineStyle?) {
    const _style = new Config.vrPlanner.Style.LineStyle();
    const _layer = new Config.vrPlanner.Layer.FeatureLayer(lineId);
    _style.setWidth(lineWidth);
    _style.setDepthTest(depthTest);
    _style.setColor(lineColor);
    _style.setAppearance(
      lineStyle ? lineStyle : Config.vrPlanner.Style.LineStyle.APPEARANCE_FLAT
    );
    _layer.setStyle(_style);
    return _layer;
  }

  /**
   * @description 初始化面 层
   * @param polygonId 面Id string
   * @param polygonColor 面颜色
   * @returns 返回面层 (该层上的面样式相同)
   */
  static PolygonLayerInit(polygonId, polygonColor) {
    const _style = new Config.vrPlanner.Style.ProjectedFeatureStyle();
    const _layer = new Config.vrPlanner.Layer.FeatureLayer(polygonId);
    _style.setPolygonColor(polygonColor);
    _layer.setStyle(_style);
    return _layer;
  }

  /**
   * @description 线添加点
   * @param newLine 线层
   * @param geoLoc 点坐标
   */
  static LineAddVertex(newLine, geoLoc) {
    newLine.addVertex(geoLoc);
    newLine.addVertex(geoLoc.clone());
  }

  /**
   * @description 设置跟踪点
   * @param newLine 线层
   * @param index 点索引
   * @param geoLoc 点坐标
   */
  static SetVertex(newLine, index, geoLoc) {
    newLine.setVertex(index - 1, geoLoc);
  }

  static DrawInit = (isPush?, fun?: () => void) => {
    const { maps } = Config;
    maps.unbindEvent("click");
    maps.unbindEvent("mousemove");
    if (isPush) {
      fun!!();
    }
    DrawLines.RemoveLayer("selectLayer");
    DrawLines.RemoveLayer("polygonLayer");
    DrawLines.RemoveLayer("auxiliary");
    DrawLines.RemoveLayer("pointLayer");
    Draw.closeBlockLayer && Draw.closeBlockLayer();
    Draw.closeLineLayer && Draw.closeLineLayer();
    Bulldoze.closePushLayer && Bulldoze.closePushLayer();
  }
  static RemoveLayer(layerId) {
    const { maps } = Config;
    if (maps.getLayerById(layerId)) {
      maps.removeLayer(layerId);
    }
  }
}
