import { Component, Fragment } from "react";
import AnimateModelList from "./AnimateModelList";
import AnimationService from "../../services/AnimationService";
import Config from "../../config/Config";
import { message } from "antd";

const css = require("../../styles/scss/animate.scss");

interface AnimateModelItemProps {
  animation: any;
  model: any;
  lineData: any;
  reloadList: (searchValue) => void;
  searchValue: any;
  closeModelFrame: () => void;
  setInitialUrl?: (modelUrl, imgUrl) => void;
}
interface AnimateModelItemStates {
  ModelList: boolean;
  modelListType: string;
  replacedModel: any;
  point: any;
}
class AnimateModelItem extends Component<
  AnimateModelItemProps,
  AnimateModelItemStates
> {
  constructor(props: AnimateModelItemProps) {
    super(props);
    this.state = {
      ModelList: false,
      modelListType: "REPLACE-MODEL",
      replacedModel: null,
      point: 0
    };
  }
  //更换模型
  replaceModel = value => {
    this.setState({
      ModelList: true,
      replacedModel: value
    });
    this.props.reloadList(this.props.searchValue);
  };
  //删除模型
  deleteModel = value => {
    const { lineData, animation } = this.props;

    this.setState({
      point: 0
    });
    AnimationService.delAModel({ id: value.id }, (flag, _) => {
      if (flag) {
        animation.removeModel(value);

        this.props.reloadList(this.props.searchValue);
      } else {
        message.error("删除失败");
      }
    });
  };

  //关闭模型页面
  closeModelFrame = () => {
    this.setState({
      ModelList: false
    });
    this.props.closeModelFrame();
    //this.setLineForm(this.props.data);
  };

  render() {
    const { model, lineData } = this.props;
    let num = model.imgurl.indexOf("/");
    return (
      <Fragment>
        <li
          className={css["vrp-animate-model-li"]}
          style={{
            //  backgroundImage: `url(${Config.apiHost + model["imgurl"]})`
            backgroundImage:
              num > 1
                ? `url(${process.env.publicPath + model.imgurl})`
                : `url(${Config.apiHost + model["imgurl"]})`
          }}
        >
          <div className={css["vrp-animate-model-li-operate"]}>
            <div className={css["vrp-animate-model-change"]}>
              <span onClick={this.replaceModel.bind(this, model)}>更换</span>
            </div>
            <div className={css["vrp-animate-model-delete"]}>
              <span onClick={this.deleteModel.bind(this, model)}>删除</span>
            </div>
          </div>
        </li>
        {this.state.ModelList ? (
          <AnimateModelList
            animation={this.props.animation}
            closeModal={this.closeModelFrame}
            lineData={lineData}
            type={this.state.modelListType}
            key={lineData.id}
            replacedModel={this.state.replacedModel}
            reloadList={this.props.reloadList}
            setInitialUrl={this.props.setInitialUrl}
          />
        ) : null}
      </Fragment>
    );
  }
}

export default AnimateModelItem;
