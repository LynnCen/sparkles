import { Component } from "react";
import VrpIcon from "../../components/VrpIcon";
import FilterModal from "../Modal/FilterModal";
import ErrorBoundary from "../../components/ErrorBoundary";

const css = require("../../styles/custom.css");

/**
 * @name Filter
 * @create: 2019/2/25
 * @description: 滤镜功能
 */

interface FilterProps {}

interface FilterStates {
  isFilter: boolean;
}

class Filter extends Component<FilterProps, FilterStates> {
  constructor(props: FilterProps) {
    super(props);
    this.state = {
      isFilter: false
    };
  }

  FilterClick = () => {
    this.setState(
      {
        isFilter: !this.state.isFilter
      },
      () => {}
    );
  };

  closeModal = () => {
    this.setState({
      isFilter: false
    });
  };

  render() {
    return (
      <div>
        <VrpIcon
          className={css["vrp-menu-icon"]}
          onClick={this.FilterClick}
          iconName={"icon-filter"}
        />
        {this.state.isFilter ? (
          <ErrorBoundary msgContent={"请使用鼠标拖拽滑块"}>
            <FilterModal closeModal={this.closeModal} />
          </ErrorBoundary>
        ) : null}
      </div>
    );
  }
}

export default Filter;
