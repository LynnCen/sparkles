import { Component } from "react";
import { Select, message } from "antd";
import MenuData from "./MenuData";
import Handle from "../../components/tools/Handle";
import UserService from "../../services/UserService";

const css = require("../../styles/custom.css");
const newCss = require("../../styles/new.css");
const { Option } = Select;

interface Compared {
  id: number;
  title: string;
}

interface ComparedProps {
  compared: Compared[];
  handleCompared: (compared) => void;
}

interface ComparedStates {
  data: any[];
  value: any;
  isEnter: boolean;
}
class ComparedData extends Component<ComparedProps, ComparedStates> {
  constructor(props: ComparedProps) {
    super(props);
    this.state = {
      data: [],
      value: props.compared || [],
      isEnter: false
    };
  }

  handleSearch = value => {
    if (value) {
      const data = { page: 1, size: 20, key: value };
      UserService.getMyTerrain(data, (flag, res) => {
        if (flag) {
          this.setState({ data: res.data.list });
        } else message.error("服务器延迟，请刷新页面后重试");
      });
    } else this.setState({ data: [] });
  };

  handleChange = (value, option) => {
    if (value.length < 3) {
      value = value.map((id, i) => ({ id, title: option[i].props.children }));
      this.setState({ value });
      this.props.handleCompared(value);
    }
  };
  render() {
    const { value, data } = this.state;
    return (
      <div style={{}}>
        <Select
          mode="multiple"
          showSearch
          placeholder="请输入对比地形"
          onSearch={this.handleSearch}
          onChange={this.handleChange}
          value={value.map(item => item.id)}
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          notFoundContent={null}
          style={{ width: "100%" }}
        >
          {(data.length ? data : value).map(d => (
            <Option key={d.id} value={d.id}>
              {d.title}
            </Option>
          ))}
        </Select>
      </div>
    );
  }
}

export default ComparedData;
