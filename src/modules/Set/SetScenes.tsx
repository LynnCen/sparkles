import React, { Component } from "react";
import { Button, Slider, Radio, Divider } from 'antd';
import Config from '../../config/Config';
import VrpLabelTips from "../../components/VrpLabelTips";
import ErrorBoundary from "../../components/ErrorBoundary";

const css = require("../../styles/scss/custom.scss");
const RadioGroup = Radio.Group;

/**
 * @name SetScenes
 * @create: 2019/1/29
 * @description: 场景设置
 */

interface SetScenesProps {
}

interface SetScenesStates {
  minLevel: number;
  maxLevel: number;
  windowSize: number;
  sharpness: number;
  isDisabled: boolean;
}

class SetScenes extends Component<SetScenesProps, SetScenesStates> {
  constructor(props: SetScenesProps) {
    super(props);
    this.state = {
      minLevel: 6,
      maxLevel: 22,
      windowSize: 1,
      sharpness: 1,
      isDisabled: true,
    }
  }

  save = () => {
    this.setState({
      isDisabled: true
    }, () => {
      const { minLevel, maxLevel, windowSize, sharpness } = this.state;
      const setData = { minLevel, maxLevel, windowSize, sharpness };
      Config.ScenesSetData = JSON.stringify(setData);
    });
  };

  sizeChange = (e) => {
    const windowSize = e.target.value;
    this.setState({
      windowSize,
      isDisabled: false
    }, () => {
      this.setTerrain();
    })
  };


  levelChange = (value) => {
    const minLevel = value[0] > 10 ? 10 : value[0];
    const maxLevel = value[1] < 10 ? 10 : value[1];
    this.setState({
      minLevel,
      maxLevel,
      isDisabled: false
    }, () => {
      this.setTerrain();
    });
  };


  reset = () => {
    this.setState({
      minLevel: 6,
      maxLevel: 22,
      windowSize: 1,
      sharpness: 1,
      isDisabled: false
    }, () => {
      this.setTerrain();
    });
  };

  setTerrain = () => {
    const { maps, vrPlanner } = Config;
    const list = maps.getLayerList();
    for (const item of list) {
      if (item.includes("terrain")) {
        const terrain = maps.getLayerById(item);
        terrain.setLodMaxLevel(this.state.maxLevel);
        terrain.setLodMinLevel(this.state.minLevel);
        terrain.setLodWindowSize(256 * (this.state.windowSize + 1));
        switch (this.state.sharpness) {
          case 0:
            terrain.setLodHeight(vrPlanner.Layer.LOD_HEIGHT_CAMERA);
            break;
          case 1:
            terrain.setLodHeight(vrPlanner.Layer.LOD_HEIGHT_MIN);
            break;
        }
      }
    }
  };
  sharpnessChange = (e) => {
    const sharpness = e.target.value;
    this.setState({
      sharpness,
      isDisabled: false
    }, () => {
      this.setTerrain();
    })
  };

  setStateData = () => {
    if (Config.ScenesSetData.length > 0) {
      const { minLevel, maxLevel, windowSize, sharpness } = JSON.parse(Config.ScenesSetData);
      this.setState({
        minLevel: parseInt(minLevel),
        maxLevel: parseInt(maxLevel),
        windowSize: parseInt(windowSize),
        sharpness: parseInt(sharpness)
      })
    }
  };

  componentWillMount() {
    this.setStateData();
  }

  render() {
    const distance = [
      { value: 0, text: "远" },
      { value: 1, text: "中" },
      { value: 2, text: "近" }
    ];
    const sharpnessType = [
      { value: 0, text: "高" },
      { value: 1, text: "低" }
    ];
    const { minLevel, maxLevel, windowSize, sharpness, isDisabled } = this.state;
    return (
      <div>
        <div className={css["flex-center-between"] + " " + css["m-y-md"]}>
          <label className={css['set-label']}>加载层级
            <VrpLabelTips tipsText={<ul>
              <li>设置最大、最小层级</li>
              <li>层级越高模型越清晰</li>
            </ul>} /></label>
          <ErrorBoundary msgContent={"请使用鼠标拖拽滑块"}>
            <Slider className={css['flex-auto']} min={1} max={30}
              value={[minLevel, maxLevel]} onChange={this.levelChange}
              range={true} />
          </ErrorBoundary>
        </div>
        <Divider />
        <div className={css["flex-center-between"] + " " + css["m-y-md"]}>
          <label className={css['set-label']}>可视范围</label>
          <RadioGroup value={windowSize} size={'small'} onChange={this.sizeChange}>
            {distance.map((item, i) => {
              return <Radio key={i} value={item.value}>{item.text}</Radio>
            })}
          </RadioGroup>
        </div>
        <Divider />
        <div className={css["flex-center-between"] + " " + css["m-y-md"]}>
          <label className={css['set-label']}>纹理质量</label>
          <RadioGroup value={sharpness} size={'small'} onChange={this.sharpnessChange}>
            {sharpnessType.map((item, i) => {
              return <Radio key={i} value={item.value}>{item.text}</Radio>
            })}
          </RadioGroup>
        </div>
        <Divider />
        <div className={css['text-center'] + " " + css['m-t-lg']}>
          <Button className={css['m-l-md']}
            type="primary"
            onClick={this.save} disabled={isDisabled}>保存</Button>
          <Button className={css['m-l-md']}
            onClick={this.reset}>恢复默认设置</Button>
        </div>
      </div>
    );
  }
}

export default SetScenes;

