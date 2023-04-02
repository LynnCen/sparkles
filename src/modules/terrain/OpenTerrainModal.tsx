import { Component } from "react";
import { Button, Input, message } from "antd";
import VrpModal from "../../components/VrpModal";
import { TerrainModel } from "../../models/PlanModel";
import Config from "../../config/Config";
import { default as PlanService } from "../../services/PlanService";
import TerrainItem from "./TerrainItem";
import Terrain from "../../components/model/Terrain";

const css = require("../../styles/scss/terrainmodal.scss");
const Search = Input.Search;

/**
 * @name OpenTerrainModal
 * @author: bubble
 * @create: 2018/12/6
 * @description: 功能描述
 */

interface OpenTerrainModalProps {
  planTerrainList: TerrainModel[];
  closeModal: () => void;
  openAllTerrainModal: () => void;
  delTerrain: (id: number) => void;
}

interface OpenTerrainModalStates {
  searchTerrainList: Terrain[];
}

class OpenTerrainModal extends Component<
  OpenTerrainModalProps,
  OpenTerrainModalStates
> {
  constructor(props: OpenTerrainModalProps) {
    super(props);
    this.state = {
      searchTerrainList: Terrain.terrains
    };
  }

  /**
   * @description 搜索过滤地块列表
   * @param value
   */
  onSearch = value => {
    const newList: Terrain[] = [];
    for (const item of Terrain.terrains) {
      if (item.title.indexOf(value) >= 0) {
        newList.push(item);
      }
    }
    this.setState({ searchTerrainList: newList });
  };

  /**
   * @description 删除地块
   * @param id
   */
  delTerrain = (terrain: Terrain) => {
    const data = { planId: Config.PLANID, terrainId: terrain.id };
    PlanService.delTerrain(data, (flag, res) => {
      if (flag) {
        terrain.remove();
        this.setState({ searchTerrainList: Terrain.terrains });
        this.props.delTerrain(terrain.id);
        message.config({ top: 100 });
        message.success(res.message);
      } else {
        message.error(res.message);
      }
    });
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.planTerrainList.length !== this.props.planTerrainList.length ||
      !nextProps.planTerrainList.every((e, i) =>
        this.props.planTerrainList.find(t => t.id == e.id)
      )
    ) {
      this.setState({
        searchTerrainList: Terrain.terrains
      });
    }
  }

  render() {
    const btnGroup = (
      <div className={css["text-center"]}>
        <Button type="primary" onClick={this.props.openAllTerrainModal}>
          导入地块
        </Button>
        <Button className={css["m-l-md"]} onClick={this.props.closeModal}>
          关闭
        </Button>
      </div>
    );
    return (
      <VrpModal
        defaultPosition={{ x: 30, y: 95 }}
        title={"地块列表"}
        footer={btnGroup}
        onClose={this.props.closeModal}
      >
        <div>
          <Search placeholder={"请输入地块名称"} onSearch={this.onSearch} />
          <ul className={css["vrp-terrain-list"]}>
            {this.state.searchTerrainList.map((item, index) => {
              return (
                <TerrainItem
                  key={index}
                  terrain={item}
                  delTerrain={this.delTerrain}
                />
              );
            })}
          </ul>
        </div>
      </VrpModal>
    );
  }
}

export default OpenTerrainModal;
