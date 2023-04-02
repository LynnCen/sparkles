import { Component } from "react";
import { Tabs } from "antd";
import ResourceList from "../List/ResourceList";
import Mark from "../../components/model/Mark";
import Model from "../../components/model/Model";
import Geometry from "../../components/model/Geometry";
import Push from "../../components/model/Push";
import PipeLine from "../../components/model/PipeLine";

const { TabPane } = Tabs;
/**
 * @name Resource
 * @create: 2018/12/29
 * @description: 资源列表
 */

interface ResourceProps {

}

interface ResourceStates {
  source: any;
  type: string;
  loading: boolean;
}

class Resource extends Component<ResourceProps, ResourceStates> {
  public static ReloadList: () => void;
  MODAL;
  pageSize = 8;
  keyword = "";

  constructor(props: ResourceProps) {
    super(props);
    this.state = {
      source: [],
      type: "balloon",
      loading: false
    };

    Resource.ReloadList = this.getData;
  }
  componentWillMount() {
    this.getData();
  }

  handleClick = key => {
    this.setState({ type: key }, this.getData);
  };

  getData = (value = "") => {
    this.setState({ loading: true });
    const d_list = {
      area: {
        source: Geometry.geometrys,
        total: Geometry.geometrys.length
      },
      line: {
        source: PipeLine.pipes,
        total: PipeLine.pipes.length
      },
      push: {
        source: Push.pushs,
        total: Push.pushs.length
      },
      balloon: {
        source: Mark.marks,
        total: Mark.marks.length
      },
      build: {
        source: Model.models,
        total: Model.models.length
      }
    };
    this.setState({
      source: d_list[this.state.type].source.filter(
        item => String(item.title).indexOf(value) > -1
      ),
      loading: false
    });
  };

  render() {
    const types = [
      { key: "balloon", text: "标签" },
      { key: "build", text: "模型" },
      { key: "push", text: "塌陷" },
      { key: "line", text: "线条" },
      { key: "area", text: "体块" }
      // {key:"water",text:"水淹"},
    ];
    return (
      <div>
        <Tabs onTabClick={this.handleClick}>
          {types.map(item => {
            return <TabPane key={item.key} tab={item.text} />;
          })}
        </Tabs>
        <ResourceList
          data={this.state.source}
          type={this.state.type}
          onSearch={this.getData}
          loading={this.state.loading}
          reloadList={this.getData}
        />
      </div>
    );
  }
}

export default Resource;
