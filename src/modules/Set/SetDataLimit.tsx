import React, { Component } from "react";
import { Button, Slider, message } from 'antd';
import Config from '../../config/Config';
import ErrorBoundary from "../../components/ErrorBoundary";
import PlanService from "../../services/PlanService";

const css = require("../../styles/scss/custom.scss");

/**
 * @name SetData
 * @create: 2019/1/29
 * @description: 场景设置
 */

interface SetDataProps {
}

interface SetDataStates {
  balloon: number;
  area: number;
  line: number;
  push: number;
  build: number;
  isChange: boolean;
}

class SetData extends Component<SetDataProps, SetDataStates> {
  TYPE = ["balloon", "line", "area", "push", "build"];
  constructor(props: SetDataProps) {
    super(props);
    this.state = {
      balloon: 7,
      area: 7,
      line: 7,
      push: 7,
      build: 7,
      isChange: false,
    }
  }

  save = () => {
    const data = {
      planId: Config.PLANID
    };
    Object.assign(data, this.state);
    PlanService.modDataLimit(data, (success, res) => {
      if (success) {
        this.setState({
          isChange: false
        });
        message.success("保存成功");
      } else {
        message.warning("服务器繁忙，请刷新页面后重新设置")
      }
    });
  };

  setStateData = () => {
    const { maps, vrPlanner } = Config;
    const state = {};
    this.TYPE.map(item => {
      const layer = maps.getLayerById(`${item}Layer`);
      if (layer) {
        state[item] = Math.log(layer.getLodWindowSize()[0]) / Math.LN2 - 1;
      } else {
        state[item] = Math.log(512) / Math.LN2 - 1;
        const _layer = new vrPlanner.Layer.FeatureLayer(`${item}Layer`);
        maps.addLayer(_layer);
        _layer.setLodWindowSize(512);
      }
    })
    this.setState(state);
  };

  handleChange = (value, item) => {
    const state = {};
    state[item] = value;
    state["isChange"] = true;
    this.setState(state, () => {
      const { maps, vrPlanner } = Config;
      const layer = maps.getLayerById(`${item}Layer`);
      if (layer) {
        layer.setLodWindowSize(Math.pow(2, value + 1));
      } else {
        const _layer = new vrPlanner.Layer.FeatureLayer(`${item}Layer`);
        maps.addLayer(_layer);
        _layer.setLodWindowSize(512);
      }
    });
  }

  restData = () => {
    this.TYPE.map(item => {
      const { maps, vrPlanner } = Config;
      const layer = maps.getLayerById(`${item}Layer`);
      if (layer) {
        layer.setLodWindowSize(512);
      } else {
        const _layer = new vrPlanner.Layer.FeatureLayer(`${item}Layer`);
        maps.addLayer(_layer);
        _layer.setLodWindowSize(512);
      }
      const state = {};
      state[item] = 512;
      this.setState(state);
    })
    this.setState({
      isChange: true
    })
  }

  componentWillMount() {
    this.setStateData();
  }

  render() {
    const marks = {
      1: "1",
      2: "2",
      3: "3",
      4: "4",
      5: "5",
      6: "6",
      7: "7",
      8: "8",
      9: "9",
    };
    const typeName = ["标签", "线条", "体块", "塌陷", "模型"];
    return (
      <div>
        {
          this.TYPE.map((item, index) => {
            return (<div className={css["flex-center-between"] + " " + css["m-y-md"]} key={index}>
              <label className={css['set-label']}>{typeName[index]}</label>
              <ErrorBoundary msgContent={"请使用鼠标拖拽滑块"}>
                <Slider
                  className={css["set-slider"]}
                  style={{width:"80%"}}
                  min={1}
                  max={9}
                  marks={marks}
                  step={1}
                  included={true}
                  value={this.state[item]}
                  tipFormatter={null}
                  onChange={(value) => this.handleChange(value, item)}
                />
              </ErrorBoundary>
            </div>)
          })
        }
        <div className={css['text-center'] + " " + css['m-t-lg']}>
          <Button
            className={css['m-l-md']}
            type="primary"
            onClick={this.save}
            disabled={!this.state.isChange}
          >保存</Button>
          <Button
            className={css['m-l-md']}
            onClick={this.restData}
          >恢复默认设置</Button>
        </div>
      </div>
    );
  }
}

export default SetData;

