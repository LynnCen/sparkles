import Config from "../../../config/Config";
import Mark from "../Mark";

/**
 * @description 轨迹动画
 */
export default class TrackAnimation {
  id: number;
  title: string;
  isReverse: boolean; //反向播放
  createTime: string;
  fontSize: number; //标签字号
  fontColor: string; //标签字体颜色
  iconUrl: string; //标签图片地址
  balloonHeight: number;
  balloonBottom: number;
  titleVisible: boolean;
  iconVisible: boolean;
  balloonTitle: string;
  shareIcon: string;
  showVerticalLine: boolean; //是否显示垂线
  verticalLine: any; //垂线
  verticalLineColor: any; //垂线颜色
  balloon: Mark;

  constructor({
    id = 0,
    title = "",
    isReverse = false,
    createTime = "",
    fontSize = 16,
    fontColor = "#fff",
    balloonBottom = 0,
    balloonHeight = 0,
    iconVisible = true,
    titleVisible = true,
    type = "animation",
    iconUrl = "/res/image/icon/admin/22011565592416553.png",
    balloonTitle = "标签",
    shareIcon = "/res/image/icon/admin/24971571971028404.png",
    showVerticalLine = true,
    verticalLineColor = "#ffffff"
  }) {
    this.id = id;
    this.title = title;
    this.isReverse = isReverse;
    this.createTime = createTime;
    this.fontSize = fontSize;
    this.fontColor = fontColor;
    this.balloonHeight = balloonHeight;
    this.iconVisible = iconVisible;
    this.titleVisible = titleVisible;
    this.iconUrl = iconUrl;
    this.shareIcon = shareIcon;
    this.balloonBottom = balloonBottom;
    this.balloonTitle = balloonTitle;
    this.verticalLine = new Config.vrPlanner.Feature.Line();
    this.verticalLineColor = verticalLineColor;
    this.showVerticalLine = showVerticalLine;
  }

  setVerticalLineColor(color: string) {
    this.verticalLine.getStyle().setColor(new Config.vrPlanner.Color(color));
  }

  removeBalloon() {
    const { vrPlanner, maps } = Config;
    let balloonLayer =
      maps.getLayerById("balloonLayer") || new vrPlanner.Layer.FeatureLayer("balloonLayer");
    if (this.balloon) {
      balloonLayer.removeFeature(this.balloon.point);
    }
  }
}
