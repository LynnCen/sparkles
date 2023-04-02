import { Component } from "react";
import { Button, PageHeader, Input, Pagination, message } from "antd";
import { debounce } from "../../utils/common";
import SiltBlock, { SiltSetData } from "./SiltBlock";
import SiltService from "../../services/SiltService";
import Config from "../../config/Config";
import { ExcelData, ExcelFile } from "../../components/model/CAD";
import { Rush } from "../../components/model/Rush";

const pStyles = require("../../styles/scss/public.scss");
const styles = require("../../styles/scss/silt.scss");

const Search = Input.Search;

export interface SiltData {
  coordinate: string;
  id: number;
  name: string;
  sampledDataList: SiltFile[]
}

interface SiltFile {
  id: number;
  fileName: string;
  type: string;
  jsonUrl: string;
}

interface Props {

}

interface States {
  blockList: Rush[];
  siltList: SiltData[];//项目冲淤线资源列表（剖面线
}

// class BlockObj {
//   onLocation;
//   isCurrentVisualAngle;
//   name;
//   terrainSetList;
//   lineSetList;
//   sectionLine;
//   configData;
//
//   constructor() {
//     this.onLocation = false;
//     this.isCurrentVisualAngle = false;
//     this.name = "";
//     this.terrainSetList = [
//       { value: [], terrain: undefined, setData:[] }
//     ];
//     this.lineSetList = [{ value: [], line: undefined, setData: [] }];
//     this.sectionLine = { value: [], line: undefined };
//     this.configData = {
//       width: 0,
//       deep: 0,
//       high: [{ name: "", height: 0 }],
//       centerLine: [],
//     }
//   }
//
// }

export default class extends Component<Props, States> {
  constructor(props) {
    super(props);
    this.state = {
      blockList: [new Rush({})],
      siltList: []
    }
  }

  componentWillMount() {
    this.setState({
      blockList: Rush.rushs
    })
  }

  handleSearch = (value) => {
    console.log(value);
  };

  handleAdd = () => {
    const block = new Rush({});
    block.isNew = true;
    const { blockList } = this.state;
    blockList.push(block);
    console.log(blockList)
    this.setState({
      blockList
    })
  };

  onSave = (index, data) => {
    const { blockList } = this.state;
    blockList[index] = data;
    console.log(data);
    this.setState({
      blockList
    })
  };

  onDelete = (index) => {
    const { blockList } = this.state;
    blockList.splice(index, 1);
    this.setState({
      blockList
    })
  };

  render() {
    const { blockList } = this.state;
    // const blockList = Rush.rushs;
    if (!blockList.length) {
      const rush = new Rush({});
      Rush.addRush(rush);
    }
    return (
      <div className={styles['silt']}>
        <PageHeader title={"冲淤计算"} />
        <div className={styles['content']}>
          <div className={pStyles['flex-center-between']}>
            <Search
              placeholder="请输入查询内容"
              onChange={e =>
                debounce(this.handleSearch.bind(this, e.target.value), 500)()
              }
            />
            <Button type="primary" className={pStyles['m-l-sm']} onClick={this.handleAdd}>
              添加
            </Button>
          </div>
          <div className={styles['line']} />
          {
            blockList.map((item, index) => {
              return <SiltBlock key={index} blockIndex={index} rush={item} onSave={this.onSave}
                onDelete={this.onDelete} />
            })
          }

        </div>
        <footer className={styles['footer']}>
          <Pagination size={'small'} />
        </footer>
      </div>
    )
  }

}
