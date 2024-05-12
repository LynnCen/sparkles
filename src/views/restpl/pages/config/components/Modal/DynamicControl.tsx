/**
 * @Description 模版动态属性限制配置
 */
import { ControlType } from '@/common/enums/control';
import React from 'react';
import InputConfig from '@/views/ressetting/pages/property/components/Config/InputConfig';
import InputNumberConfig from '@/views/ressetting/pages/property/components/Config/InputNumberConfigTemp';
import UploadConfig from '@/views/ressetting/pages/property/components/Config/UploadConfig';
import OptionsConfigTemp from '@/views/ressetting/pages/property/components/Config/OptionsConfigTemp';

const DynamicControl: React.FC<any> = ({ controlType }) => {

  switch (controlType) {
    case ControlType.INPUT.value:
    case ControlType.TEXT_AREA.value:
      return <InputConfig csName='templateRestriction' />;
    case ControlType.UPLOAD.value:
      return <UploadConfig csName='templateRestriction' />;
    case ControlType.INPUT_NUMBER.value:
      return <InputNumberConfig csName='templateRestriction' />;
    case ControlType.CHECK_BOX.value:
      return <OptionsConfigTemp csName='templateRestriction' />;
    default:
      return <></>;
  }
};
export default DynamicControl;
