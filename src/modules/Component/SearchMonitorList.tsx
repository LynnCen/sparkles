import { Component } from "react";
import MonitorService from "../../services/MonitorService";
import { Input, Pagination, message, Button } from "antd";
import { PassagewayModel } from "../../models/MonitorModel";
import VrpIcon from "../../components/VrpIcon";

const Search = Input.Search;
const css = require("../../styles/custom.css");

/**
 * @name SearchMonitorList
 * @author: bubble
 * @create: 2019/3/7
 * @create: 监控搜索结果列表
 */

interface SearchMonitorListProps {
  searchResult: (isShow) => void;
}

interface SearchMonitorListStates {
  page: number;
  keyword: string;
  data: PassagewayModel[];
  total: number;
  isShowCancel: boolean;
}

class SearchMonitorList extends Component<
  SearchMonitorListProps,
  SearchMonitorListStates
> {
  size: number = 20;
  searchNode;

  constructor(props: SearchMonitorListProps) {
    super(props);
    this.state = {
      page: 1,
      keyword: "",
      data: [],
      total: 0,
      isShowCancel: false
    };
  }

  getList = page => {
    const data = { page, size: this.size, key: this.state.keyword };
    MonitorService.searchChannel(data, (flag, res) => {
      if (flag) {
        this.setState({
          page,
          data: res.data.list,
          total: res.data.count,
          isShowCancel: true
        });
        this.props.searchResult(true);
      } else {
        message.error(res.message);
      }
    });
  };

  onSearch = value => {
    this.setState(
      {
        keyword: value
      },
      () => {
        this.getList(1);
      }
    );
  };

  onChange = e => {
    this.setState({
      keyword: e.target.value
    });
  };

  cancelSearch = () => {
    this.setState({
      keyword: "",
      data: [],
      isShowCancel: false
    });
    this.props.searchResult(false);
  };

  paginationChange = page => {
    this.getList(page);
  };

  render() {
    const { data, total, page, keyword, isShowCancel } = this.state;
    return (
      <div className={css["vrp-monitor-list"]}>
        <div className={css["flex-center-between"] + " " + css["m-b-sm"]}>
          <Search
            placeholder={"输入关键词查找通道"}
            ref={node => (this.searchNode = node)}
            value={keyword}
            onChange={this.onChange}
            onSearch={this.onSearch}
          />
          {isShowCancel ? (
            <Button className={css["m-l-md"]} onClick={this.cancelSearch}>
              取消
            </Button>
          ) : null}
        </div>
        <div className={css["vrp-list"]}>
          {data.length > 0 && (
            <div>
              <ul>
                {data.map((item, index) => {
                  return (
                    <li
                      title={item.name}
                      key={index}
                      className={css["vrp-list-item"]}
                    >
                      <VrpIcon
                        iconName={"icon-vidicon"}
                        className={css["m-r-sm"]}
                      />
                      {item.name}
                    </li>
                  );
                })}
              </ul>
              <div className={css["text-center"] + " " + css["m-t-md"]}>
                <Pagination
                  current={page}
                  pageSize={this.size}
                  total={total}
                  size="small"
                  onChange={this.paginationChange}
                />
              </div>
            </div>
          )}
        </div>
        {isShowCancel && data.length == 0 && (
          <div>暂无匹配数据，换个关键词试试吧</div>
        )}
      </div>
    );
  }
}

export default SearchMonitorList;
