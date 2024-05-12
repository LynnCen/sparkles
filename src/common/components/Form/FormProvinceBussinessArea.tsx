
import { getLabels } from '@/common/api/place';
import { useMethods } from '@lhb/hook';
import { TreeSelectProps } from 'antd';
import React, { useEffect, useState } from 'react';
import FormTreeSelect from './FormTreeSelect';

interface FormProvinceBussinessAreaSelectProps {
  channelCode: 'RESOURCES'|'KA';
  name?: string;
  label?: string;
  placeholder?: string;
  onChange?: Function;
  config?: TreeSelectProps;
}

const FormProvinceBussinessAreaSelect: React.FC<FormProvinceBussinessAreaSelectProps> = ({ config, name, label, placeholder, channelCode = 'KA' }) => {
  const [cityAndBussinessArea, setCityAndBussinessArea] = useState([]);

  const { loadData } = useMethods({
    loadData: async () => {
      setCityAndBussinessArea(await getLabels({ type: 'city', channelCode: channelCode }) || []);
    }
  });

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormTreeSelect
      name={name}
      label={label}
      placeholder={placeholder}
      treeData={cityAndBussinessArea}
      config={config}
    />
  );
};

export default FormProvinceBussinessAreaSelect;
