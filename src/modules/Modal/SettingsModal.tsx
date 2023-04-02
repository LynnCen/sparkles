import React, {Component} from 'react'
import VrpModal from '../../components/VrpModal';
import {Collapse, Button, message} from 'antd';
import SetCamera from "../Set/SetCamera";
import SetScenes from "../Set/SetScenes";
import Config from "../../config/Config";
import PlanService from "../../services/PlanService";
import Handle from '../../components/tools/Handle';
import SetData from '../Set/SetDataLimit';

const {Panel} = Collapse;
const css = require("../../styles/scss/custom.scss");

interface SettingsModalProps {
  closeModal: () => void;
}

interface SettingsModalStates {
}

export class SettingsModal extends Component<SettingsModalProps, SettingsModalStates> {
  constructor(props) {
    super(props);
  }

  initCamera = () => {
    const {maps} = Config;
    const camera = maps.getCamera();
    const cameraPosition = `[${camera.getPosition().x()},${camera.getPosition().y()},${camera.getPosition().z()}]`;
    const cameraLook = `[${camera.getLookAt().x()},${camera.getLookAt().y()},${camera.getLookAt().z()}]`;
    const cameraPos = {cameraPosition, cameraLook};
    Config.CameraPosition = JSON.stringify(cameraPos);
    PlanService.initCamera({planId: Config.PLANID, cameraLook, cameraPosition}, (flag, res) => {
      if (flag) {
        message.success("设置成功")
      }
    })
  };

  goSetPosition = () => {
    Handle.HomeHandle();
  };


  render() {
    return (
      <VrpModal defaultPosition={{x: 30, y: 95}}
                title={"设置"}
                style={{width: 450}}
                footer={null}
                fixed={true}
                onClose={this.props.closeModal}>
        <Collapse className={css["set-collapse"] + " " + css["set-modal"]} expandIconPosition={"right"}
                  defaultActiveKey={['1']}
                  accordion={true}>
          <Panel header="相机设置" key="1" forceRender={false}>
            <SetCamera/>
          </Panel>
          <Panel header="场景设置" key="2" forceRender={false}>
            <SetScenes/>
          </Panel>
          <Panel header="初始视角设置" key="3" forceRender={false}>
            <p className={css["default-text"]}>在地图上选择合适角度，点击设置按钮即可</p>
            <div className={css['text-center']}>
              <Button type="primary" className={css['m-r-md']}
                      onClick={this.initCamera}>设置</Button>
              <Button type="primary" ghost onClick={this.goSetPosition}>查看当前视角</Button>
            </div>
          </Panel>
          <Panel header="数据可视距离设置" key="4" forceRender={false}>
            <SetData/>
          </Panel>
        </Collapse>
      </VrpModal>
    )
  }
}

export default SettingsModal
