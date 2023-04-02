import {Popover, Icon} from "antd";

const css = require("../styles/custom.css");

/**
 * @name LabelTips
 * @author: bubble
 * @create: 2018/11/8
 */

interface ILabelTipsProps {
  labelText?: string;
  tipsText: string | React.ReactNode;
}

const VrpLabelTips = ({labelText, tipsText}: ILabelTipsProps) => {

  return (
    <span>
      {labelText}
      <Popover content={tipsText}>
        <Icon type="question-circle" theme="outlined" className={css['m-l-sm']}/></Popover>
      </span>
  );
};

export default VrpLabelTips
