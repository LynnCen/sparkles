import { Component } from "react";
import Terrain from "../services/TerrainService";
import Config from "../config/Config";
import { Progress, Icon, message } from "antd";
import VrpIcon from "../components/VrpIcon";
import DataService from "../services/DataService";
import TerrainService from "../services/TerrainService";
import { debounce } from "../utils/common";

const css = require("../styles/custom.css");
const { maps, vrPlanner } = Config;

/**
 * @name PreviewPage
 * @author: bubble
 * @create: 2018/12/27
 * @description: 预览页面
 */
interface PreviewPageProps {
  match;
}
interface PreviewPageStates {
  percent: number;
  isFirst: boolean;
  showBar: boolean;
  imgUrl: string;
  down: boolean;
  showThumbnail: boolean;
}
class PreviewPage extends Component<PreviewPageProps, PreviewPageStates> {
  id: number;
  canvas = document.createElement("canvas") as HTMLCanvasElement;
  ctx = this.canvas.getContext("2d");
  rect = { width: 264, height: 176 };
  terrain: object | null;

  constructor(props: PreviewPageProps) {
    super(props);
    this.id = Number(this.props.match.params.id);
    this.state = {
      percent: 0,
      isFirst: true,
      showBar: true,
      imgUrl: "",
      down: true,
      showThumbnail: true
    };
  }
  componentDidMount() {
    this.loadTerrain(this.id, this.cameraMove);
  }
  loadTerrain = (id, callback) => {
    this.setState({ percent: 20 });
    Terrain.getTerrain({ id }).then(res => {
      this.setState({ percent: 20 });
      const data = res.data[0];
      Object.keys(data).filter(k => data[k] == null && delete data[k]);
      this.terrain = data;
      document.title = data.title;
      const terrain = new vrPlanner.Layer.A3XTerrainLayer(
        "terrain" + data.id,
        data.dataUrl
      );
      maps.addLayer(terrain);
      if (this.state.isFirst) {
        this.setState({ isFirst: false }, () => {
          terrain.bindEvent("loadingStarted", () => {
            this.setState({
              percent: 50
            });
            terrain.unbindEvent("loadingStarted");
          });
          terrain.bindEvent("loadingTileCompleted", () => {
            this.setState({ percent: 90 });
          });
          terrain.bindEvent("loadingCompleted", () => {
            terrain.unbindEvent("loadingTileCompleted");
            this.setState({ percent: 100 }, () => {
              this.setState({ showBar: false });
              callback();
            });
            terrain.unbindEvent("loadingCompleted");
          });
        });
      }
    });
  };
  cameraMove = (bind = true) => {
    if (Config.loggedIn) {
      let camera = maps.getCamera();
      if (!this.state.imgUrl) this.takeScreenShot();
      camera.unbindEvent("move");
      bind && camera.bindEvent("move", debounce(this.takeScreenShot, 13));
    }
  };
  takeScreenShot = () => {
    maps
      .takeScreenshot(this.rect.width * 2, this.rect.height * 2)
      .done(imgData => {
        this.canvas.width = imgData.width;
        this.canvas.height = imgData.height;
        this.ctx.putImageData(imgData, 0, 0);
        const imgUrl = this.canvas.toDataURL("image/png", 0.1);
        this.setState({ imgUrl });
      });
  };
  setTerrainCover = () => {
    this.canvas.toBlob(blob => {
      const formData = new FormData();
      formData.append("file", blob);
      DataService.upload(formData, "/Terrain/UploadImg", (flag, res) => {
        flag
          ? TerrainService.UpdateTerrain(
              { ...this.terrain, thumbnail: res.data },
              (f, r) => message[f ? "success" : "error"](r.message)
            )
          : message.error(res.message);
      });
    });
  };
  render() {
    const { showBar, imgUrl, percent, down, showThumbnail } = this.state;
    return (
      <div
        style={{
          position: "absolute",
          top: "0px",
          width: "100%",
          height: "100%"
        }}
        className="pe-none"
      >
        {showBar && <Progress percent={percent} showInfo={false} />}
        {Config.loggedIn && !showBar && showThumbnail && (
          <div
            className={
              css["vrp-shot-img"] + " pe-auto " + (down ? "" : css["hide"])
            }
            style={{ width: "100%", right: 0 }}
          >
            <div
              className={css["img-action"]}
              onClick={e => {
                this.cameraMove(!this.state.down);
                this.setState({ down: !this.state.down });
              }}
            >
              <Icon type={down ? "down" : "up"} />
            </div>
            <div className={css["shot-img-item"]}>
              <img src={imgUrl} className={css["shot-img"]} />
              <div>
                <VrpIcon
                  className={css["vrp-menu-icon"]}
                  iconName={"icon-tupian"}
                  title="设置为地貌封面"
                  onClick={this.setTerrainCover}
                />
                <VrpIcon
                  className={css["vrp-menu-icon"]}
                  iconName={"icon-quit"}
                  title="关闭"
                  onClick={() => {
                    this.cameraMove(false);
                    this.setState({ showThumbnail: false });
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default PreviewPage;
