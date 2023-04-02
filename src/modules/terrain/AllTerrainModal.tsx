import { Component } from "react";
import { Button, Input, Row, Col, message, Pagination } from "antd";
import VrpModal from "../../components/VrpModal";
import UserService from "../../services/UserService";
import Config from "../../config/Config";
import VrpIcon from "../../components/VrpIcon";
import { TerrainModel } from "../../models/PlanModel";
import { UserTerrainModel } from "../../models/UserModel";
import PlanService from "../../services/PlanService";

const css = require("../../styles/scss/terrainmodal.scss");
const Search = Input.Search;

/**
 * @name AllTerrainModal
 * @author: bubble
 * @create: 2018/12/7
 * @description: 所有地块列表
 */

interface AllTerrainModalProps {
  haveTerrainList: TerrainModel[];
  closeModal: () => void;
  addNewTerrain: () => void;
}

interface AllTerrainModalStates {
  allTerrainList: UserTerrainModel[];
  checkedTerrain: any;
  page: number;
  total: number;
}

class AllTerrainModal extends Component<
  AllTerrainModalProps,
  AllTerrainModalStates
> {
  addTerrainIds: number[] = [];
  delTerrainIds: number[] = [];
  // haveTerrainId: any;
  size = 12;
  keyword = "";

  constructor(props: AllTerrainModalProps) {
    super(props);
    this.state = {
      allTerrainList: [],
      checkedTerrain: {},
      page: 1,
      total: 0
    };
  }

  componentDidMount() {
    this.getAllTerrain(1);
    this.getCheckedList(this.props.haveTerrainList);
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.haveTerrainList.length !== this.props.haveTerrainList.length ||
      !nextProps.haveTerrainList.every((e, i) =>
        this.props.haveTerrainList.find(t => t.id == e.id)
      )
    ) {
      this.getCheckedList(nextProps.haveTerrainList);
    }
  }

  /**
   * @description 添加|删除 地块
   */
  saveTerrain = async () => {
    const data = {
      planId: Config.PLANID
    };
    if (this.addTerrainIds.length)
      await new Promise((resolve, reject) =>
        PlanService.addTerrain(
          { ...data, terrainId: this.addTerrainIds.join(",") },
          (flag, res) =>
            flag
              ? resolve(1)
              : (message.error(res.Message), reject(res.Message))
        )
      );
    if (this.delTerrainIds.length)
      await new Promise((resolve, reject) =>
        PlanService.delTerrain(
          { ...data, terrainId: this.delTerrainIds.join(",") },
          (flag, res) =>
            flag
              ? resolve(1)
              : (message.error(res.Message), reject(res.Message))
        )
      );
    this.props.addNewTerrain();
  };

  /**
   * @description 搜索地块
   * @param value
   */
  onSearch = value => {
    this.keyword = value;
    this.getAllTerrain(1);
  };

  /**
   * @description 获取所有地块
   */
  getAllTerrain = page => {
    const data = { page, size: this.size, key: this.keyword };
    UserService.getMyTerrain(data, (flag, res) => {
      if (flag) {
        const { list, count } = res.data;
        this.setState({
          allTerrainList: list,
          page,
          total: count
        });
      } else message.error("获取地块失败");
    });
  };

  /**
   * @description 得到当前方案已存在的地块数据
   */
  getCheckedList = haveTerrainList => {
    const terrain = {};
    for (const item of haveTerrainList) {
      terrain[item.id] = true;
    }
    // this.haveTerrainId = CustomFun.copy(terrain);
    this.setState({ checkedTerrain: terrain });
  };

  /**
   * @description 点击地块判断是否选择
   * @param id
   */
  checkChange = id => {
    if (this.state.checkedTerrain[id]) {
      this.state.checkedTerrain[id] = false;
      if (this.addTerrainIds.includes(id)) {
        this.addTerrainIds.splice(this.addTerrainIds.indexOf(id), 1);
      } else this.delTerrainIds.push(id);
    } else {
      this.state.checkedTerrain[id] = true;
      this.addTerrainIds.push(id);
    }
    this.setState({
      checkedTerrain: this.state.checkedTerrain
    });
  };

  paginationChange = page => {
    this.getAllTerrain(page);
  };

  render() {
    const { allTerrainList, checkedTerrain } = this.state;

    const btnGroup = (
      <div className={css["text-center"]}>
        <Button type="primary" onClick={this.saveTerrain}>
          添加
        </Button>
        <Button className={css["m-l-md"]} onClick={this.props.closeModal}>
          关闭
        </Button>
      </div>
    );

    return (
      <VrpModal
        defaultPosition={{ x: 330, y: 95 }}
        title={"请选择要导入的地块"}
        className={css["custom-terrain-modal"]}
        footer={btnGroup}
        onClose={this.props.closeModal}
      >
        <div>
          <Search
            placeholder={"请输入地块名称"}
            style={{ width: 250 }}
            onSearch={this.onSearch}
          />
          <ul className={css["vrp-terrain-list"]}>
            <Row>
              {allTerrainList.map((item, index) => {
                return (
                  <Col span={8} key={index}>
                    <li
                      className={
                        css["vrp-terrain-item"] +
                        " " +
                        (checkedTerrain[item.id] ? css["active"] : "")
                      }
                      onClick={() => this.checkChange(item.id)}
                    >
                      <div className={css["item-title"]}>{item.title}</div>
                      <div className={css["item-icons"]}>
                        {checkedTerrain[item.id] ? (
                          <VrpIcon
                            iconName={"icon-ok"}
                            style={{ display: "block" }}
                          />
                        ) : null}
                      </div>
                    </li>
                  </Col>
                );
              })}
            </Row>
          </ul>
          <div className={css["text-center"] + " " + css["m-y-md"]}>
            <Pagination
              defaultCurrent={1}
              current={this.state.page}
              pageSize={this.size}
              total={this.state.total}
              size="small"
              onChange={this.paginationChange}
            />
          </div>
        </div>
      </VrpModal>
    );
  }
}

export default AllTerrainModal;
