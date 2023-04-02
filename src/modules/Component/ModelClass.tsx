import React, {Component} from 'react';
import {Collapse, Tag} from "antd";
import ModelService from "../../services/ModelService";
import Config from "../../config/Config";

const Panel = Collapse.Panel;

interface ModelClassProps {
  getList: (fId, sId) => void;
  children;
}

interface ModelClassStates {
  classData: object;
  activeParentId: string;
  selectChildId: number | undefined;
}

class ModelClass extends Component<ModelClassProps, ModelClassStates> {
  state = {
    classData: {},
    activeParentId: Config.isManager() ? "type2" : "type1",
    selectChildId: undefined
  };

  componentWillMount() {
    this.getTypeData();
  }

  getTypeData = () => {
    ModelService.getLevelList((flag, res) => {
      if (flag) {
        const data = res.data;
        const child = {};
        data.map((it) => {
          child[it.id] = it
        });
        this.setState({
          classData: child
        })
      }
    })
  };

  selectTag = (id) => {
    this.setState({
      selectChildId: id
    });
    this.props.getList(this.state.activeParentId, id)
  };

  handleChange = key => {
    this.setState({
      activeParentId: key
    });
    if (key) {
      this.props.getList(key, undefined)
    }
  };

  render() {
    const {} = this.props;
    const {classData, activeParentId, selectChildId} = this.state;
    const isManager = Config.isManager();
    console.log(isManager)
    return (
      <Collapse
        accordion
        defaultActiveKey={activeParentId}
        bordered={false}
        onChange={this.handleChange}>
        <Panel header={`${isManager ? "用户模型" : "我的模型"}`} key={"type1"}>
          {this.props.children}
        </Panel>
        {isManager && <Panel header="待分类" key={"type2"}>
          {this.props.children}
        </Panel>}
        {Object.keys(classData).map(key => {
          return (
            <Panel header={classData[key].name} key={classData[key].id}>
              {
                classData[activeParentId] &&
                <div style={{margin:"5px 0"}}>
                  <Tag color={selectChildId === undefined ? "blue" : ""}
                       onClick={() => this.selectTag(undefined)}>全部</Tag>
                  {classData[activeParentId].list.map((child, i) => {
                    return <Tag key={i} color={selectChildId === child.id ? "blue" : ""}
                                onClick={() => this.selectTag(child.id)}>{child.name}</Tag>
                  })}
                </div>
              }
              {this.props.children}
            </Panel>)
        })}
      </Collapse>

    );
  }
}

export default ModelClass;
