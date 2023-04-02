import { Component } from "react";
import { Button } from "antd";
import VrpModal from "../../components/VrpModal";
import { records } from "../../models/MonitorModel";

const css = require("../../styles/custom.css");

/**
 * @name RecordsModal
 * @create: 2019/3/20
 * @description: 录像列表
 */

interface RecordsModalProps {
  closeModal: () => void;
  list: records[];
  channelCode: string;
}

interface RecordsModalStates {

}

class RecordsModal extends Component<RecordsModalProps, RecordsModalStates> {
  constructor(props: RecordsModalProps) {
    super(props);
  }

  playBack = (item?) => {
    const { channelCode } = this.props;
    const { beginTime, endTime, location } = item;
    const data = { channelCode, beginTime, endTime, location };

  };

  render() {
    const { list } = this.props;
    // todo 时间转换显示
    // todo 分页
    return (
      <VrpModal defaultPosition={{ x: 460, y: 95 }}
        title={"查看录像"}
        style={{ width: 360 }}
        baseBoxStyle={{ top: -95, left: -30 }}
        onClose={this.props.closeModal}>
        <ul>
          {list.map((item, i) => {
            return <li key={i}>{item.beginTime}-{item.endTime}
              <Button size="small" onClick={() => this.playBack(item)}>播放</Button></li>
          })}
          <li className={css['border-list']}>2019-10-10 10:10:20-2019-10-10 10:10:20
            <Button size="small" className={css['m-l-sm']}
              onClick={() => this.playBack()}>播放</Button></li>
        </ul>

      </VrpModal>
    );
  }
}

export default RecordsModal;

