import React, {Component} from 'react';
import {Cascader, Button, Popover, Icon} from "antd";
import ModelService from "../services/ModelService";
import Config from "../config/Config";
import ModelList from "../modules/List/ModelList";
// import VrpModal from "./VrpModal";

const pStyles = require("../styles/scss/public.scss");

interface ModelPickerProps {
  onChange: (data) => void;
  children?
  onClose?: () => void;
}

interface ModelPickerStates {
  typeList: any[];
  dataList: any[];
  showList: boolean;
  checkedValues: any[];
  checkedNames: string;
}

class ModelPicker extends Component<ModelPickerProps, ModelPickerStates> {
  constructor(props) {
    super(props);
    this.state = {
      typeList: [],
      dataList: [],
      showList: !props.children,
      checkedValues: Config.isManager() ? ["type2"] : ["type1"],
      checkedNames: Config.isManager() ? "待分类" : "我的模型",
    };

  }

  componentWillMount() {
    this.getTypeData();
    this.getModelList(this.state.checkedValues[0])
  }

  getTypeData = () => {
    ModelService.getLevelList((flag, res) => {
      if (flag) {
        const list = res.data;
        list.map((it) => {
          const all = {id: undefined, name: "全部"};
          it.list.unshift(all);
        });
        const type1 = {id: "type1", name: Config.isManager() ? "用户自定义" : "我的模型"};
        const type2 = {id: "type2", name: "待分类"};
        Config.isManager() ? list.unshift(type1, type2) : list.unshift(type1)
        this.setState({
          typeList: list
        })
      }
    })
  };

  handleChange = (keys, selectedOptions) => {
    if (keys) {
      this.getModelList(keys[0], keys[1])
      this.setState({
        showList: true,
        checkedValues: keys,
        checkedNames: selectedOptions.map(o => o.name).join('-'),
      })
    }
  };

  getModelList = (firstId, secondId?) => {
    const isDefault = firstId === "type1" || firstId === "type2";
    const data = {
      type: isDefault ? Number(firstId.substr(4, 1)) : undefined,
      firstId: isDefault ? undefined : firstId,
      secondId,
      planId: Config.PLANID, modelType: "Customize",
    };
    for (const key in data) {
      if (data[key] === undefined) {
        delete data[key]
      }
    }
    ModelService.getModel(data, (flag, res) => {
      if (flag) {
        this.setState({dataList: res.data})
      }
    })
  };

  modelClick = (data) => {
    this.setState({
      showList: false
    });
    this.props.onChange(data);
  };

  onClose = () => {
    if (this.props.children) {
      this.setState({
        showList: !this.state.showList
      })
    } else {
      this.props.onClose()
    }
  };

  render() {
    const {typeList, dataList, showList, checkedValues, checkedNames} = this.state;
    const {children} = this.props;
    return (
      <span className={pStyles['pointer']}>
        <span onClick={this.onClose}>{children}</span>
        {showList ?
          <Popover arrowPointAtCenter={true} getPopupContainer={triggerNode => triggerNode} visible={true}
                   placement={"right"} trigger={"click"}
                   overlayStyle={{width: 216}}
                   title={<div className={pStyles['flex-center-between']}>
                     <Cascader className={pStyles['pointer']} size="small" defaultValue={checkedValues}
                               fieldNames={{label: 'name', value: 'id', children: 'list'}}
                               options={typeList} onChange={this.handleChange}>
                       <Button size={"small"}>{checkedNames}</Button>
                     </Cascader>
                     <Icon type={"close"} onClick={this.onClose}/>
                   </div>}
                   content={<div style={{
                     height: 240,
                     overflow: "auto"
                   }}>
                     <ModelList onClick={this.modelClick} modelList={dataList} picker={true} small={true}/></div>}/>

          //   <VrpModal
          //   defaultPosition={{x: 10, y: 50}}
          //   title={<Cascader className={pStyles['pointer']} size="small" defaultValue={checkedValues}
          //                    fieldNames={{label: 'name', value: 'id', children: 'list'}}
          //                    options={typeList} onChange={this.handleChange}>
          //     <Button size={"small"}>{checkedNames}</Button>
          //   </Cascader>}
          //   style={{width: 267, height: 420}}
          //   onClose={this.toggleModal}>
          //   <div style={{height: 350, overflow: "auto"}}>
          //     <ModelList onClick={this.modelClick} modelList={dataList} picker={true} small={true}/>
          //   </div>
          // </VrpModal>
          : null}
      </span>
    );
  }
}

export default ModelPicker;
