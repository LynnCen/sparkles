import { ControlType } from '@/common/enums/control';
import { Form } from 'antd';
import React from 'react';
import InputConfig from './Config/InputConfig';
import InputNumberConfig from './Config/InputNumberConfig';
import OptionsConfig from './Config/OptionsConfig';
import TimeConfig from './Config/TimeConfig';
import TreeSelectConfig from './Config/TreeSelectConfig';
import UploadConfig from './Config/UploadConfig';

const formItemLayout = {
  wrapperCol: {
    offset: 6,
    span: 12,
  },
};
const DynamicControl: React.FC<any> = ({ controlType }) => {

  switch (controlType) {
    case ControlType.SINGLE_RADIO.value:
      return (
        <Form.Item {...formItemLayout}>
          <OptionsConfig csName={ControlType.SINGLE_RADIO.csName}/>
        </Form.Item>
      );
    case ControlType.CHECK_BOX.value:
      return (
        <Form.Item {...formItemLayout}>
          <OptionsConfig csName={ControlType.CHECK_BOX.csName}/>
        </Form.Item>
      );
    case ControlType.INPUT.value:
      return (
        <Form.Item {...formItemLayout}>
          <InputConfig csName={ControlType.INPUT.csName} />
        </Form.Item>
      );
    case ControlType.TEXT_AREA.value:
      return (
        <Form.Item {...formItemLayout}>
          <InputConfig csName={ControlType.TEXT_AREA.csName} />
        </Form.Item>
      );
    case ControlType.UPLOAD.value:
      return (
        <Form.Item {...formItemLayout}>
          <UploadConfig csName={ControlType.UPLOAD.csName}/>
        </Form.Item>
      );
    case ControlType.RATIO.value:
      return (
        <Form.Item {...formItemLayout}>
          <OptionsConfig />
        </Form.Item>
      );
    case ControlType.INPUT_NUMBER.value:
      return (
        <Form.Item {...formItemLayout}>
          <InputNumberConfig csName={ControlType.INPUT_NUMBER.csName} />
        </Form.Item>
      );
    case ControlType.TIME.value:
      return (
        <Form.Item {...formItemLayout}>
          <TimeConfig csName={ControlType.TIME.csName} />
        </Form.Item>
      );
    case ControlType.TREE_SELECT.value:
      return (
        <Form.Item {...formItemLayout}>
          <TreeSelectConfig csName={ControlType.TREE_SELECT.csName} />
        </Form.Item>
      );
    // case ControlType.COMPUTER.value:
    //   return (
    //     <Form.Item {...formItemLayout}>
    //       <InputNumberConfig csName={ControlType.COMPUTER.csName} />
    //     </Form.Item>
    //   );
    default:
      return <></>;
  }
};
export default DynamicControl;
