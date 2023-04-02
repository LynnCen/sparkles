import React, { Component } from "react";
import ModelService from "../../services/ModelService";
import Config from "../../config/Config";
import ModelList from "../List/ModelList";
// import UploadModelModal from "../Modal/UploadModelModal";
import ModelClass from "../Component/ModelClass";

/**
 * @name ModelLibrary
 * @create: 2018/12/29
 * @description: 模型库
 */

interface ModelLibraryProps {

}

interface ModelLibraryStates {
  modelType: string;
  modelData: any;
  showUpload: boolean;
  type: number | undefined,
  firstId: number | undefined,
  secondId: number | undefined,
  loading: boolean
}

class ModelLibrary extends Component<ModelLibraryProps, ModelLibraryStates> {
  isManager = Config.isManager();

  constructor(props: ModelLibraryProps) {
    super(props);
    this.state = {
      modelType: "Customize",
      modelData: {},
      showUpload: false,
      type: 2,
      firstId: undefined,
      secondId: undefined,
      loading: false
    };
  }

  componentWillMount() {
    this.getModel();
  }

  toggleModelClass = (firstId, secondId) => {
    const isDefault = firstId === "type1" || firstId === "type2";
    this.setState({
      type: isDefault ? Number(firstId.substr(4, 1)) : undefined,
      firstId: isDefault ? undefined : firstId,
      secondId
    }, () => {
      this.getModel()
    })
  };


  getModel = () => {
    const { modelData, modelType, type, firstId, secondId } = this.state;
    const data = {
      planId: Config.PLANID,
      modelType: modelType,
      type,
      firstId,
      secondId
    };
    for (const key in data) {
      if (data[key] === undefined) {
        delete data[key]
      }
    }
    ModelService.getModel(
      data,
      (flag, res) => {
        if (flag) {
          modelData[modelType] = res.data;
          this.setState({
            modelData,
            type,
            firstId,
            secondId
          });
        }
      }
    );
  };

  // delModel = id => {
  //   const {type} = this.state;
  //   const data = type === 1 ? {id, type: 1} : {id};
  //   ModelService.del(data, (flag, res) => {
  //     if (flag) {
  //       this.getModel();
  //     } else {
  //       message.error(res.message);
  //     }
  //   });
  // };

  handleChange = key => {
    this.setState({
      modelType: key,
      type: key === "Customize" ? 1 : undefined,
      firstId: undefined,
      secondId: undefined
    }, () => {
      this.getModel();
    });
  };

  showModal = () => {
    this.setState({ showUpload: true });
  };

  closeModal = () => {
    this.setState({ showUpload: false });
  };


  render() {
    // const panel = [
    //   { header: "常规建筑", key: "Build" },
    //   { header: "植被灌木", key: "Plant" },
    //   { header: "公共设施", key: "Device" },
    //   { header: "其他", key: "Other" },
    //   { header: "自定义模型库", key: "Customize" }
    // ];
    const { modelData } = this.state;
    return (
      <ModelClass getList={this.toggleModelClass}>
        <ModelList picker={false}
                   modelList={modelData["Customize"]} />
      </ModelClass>
    );
  }
}

export default ModelLibrary;
