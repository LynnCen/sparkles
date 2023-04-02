import Config from "../../../config/Config";
import ModelBase from "../ModelBase";

const {vrPlanner} = Config;
/**
 * @description 轨迹Model
 */
export default class TrackModel extends ModelBase {
  imgurl: string;
  title: string;
  isShow: boolean;
  lineId: number;
  lengthY: number;

  constructor({
                url,
                geo,
                color = "",
                scale = [1, 1, 1],
                opacity = 1,
                rotateX = 0,
                rotateY = 0,
                rotateZ = 0,
                imgurl = "",
                title = "",
                isShow = true,
                lineId,
                lengthY = 0
              }) {
    super({
      geo,
      url,
      color,
      scale,
      opacity,
      rotateX,
      rotateY,
      rotateZ
    });

    this.imgurl = imgurl;
    this.title = title;
    this.isShow = isShow;
    this.lineId = lineId;
    this.lengthY = lengthY;
  }

  //设置模型样式
  setModel(url) {
    const modelReader = new vrPlanner.Model.ModelReader();
    let num = this.url.indexOf("/");
    modelReader
      .read(num > 1 ? `${process.env.publicPath + url}` : Config.apiHost + url)
      .done(model => {
        this.style.setModel(model);
      })
      .fail(function (error) {
        var hasNext;

        do {
          hasNext = error.hasNext();
          error = error.next();
        } while (hasNext);
      });
  }

  //设置模型大小
  setModelScale(modelSize: number) {
    this.scale = [modelSize + 1, modelSize + 1, modelSize + 1];
    this.setScale(this.scale);
  }

  //计算模型y方向上的长度
  calModelSize = () => {
    const aabb = this.point.getAABB();
    const y = aabb.getHalfLengthY();
    this.lengthY = y;
    return y;
  };
  //更改模型
  replace = value => {
    this.imgurl = value.img;
    this.url = value.source;
    this.setModel(value.source);
  };
}
