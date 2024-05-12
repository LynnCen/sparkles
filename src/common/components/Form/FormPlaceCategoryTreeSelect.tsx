import { getCategoryRes } from '@/common/api/category';
import { useMethods } from '@lhb/hook';
import { TreeSelectProps } from 'antd';
import React, { useEffect, useState } from 'react';
import FormTreeSelect from './FormTreeSelect';

interface FormPlaceCategoryTreeSelectProps {
  type: 0 | 1; //
  name?: string;
  label?: string;
  placeholder?: string;
  onChange?: Function;
  config?: TreeSelectProps;
}

const FormPlaceCategoryTreeSelect: React.FC<FormPlaceCategoryTreeSelectProps> = ({ config, name, label, placeholder, type = 0 }) => {
  const [placeCategory, setPlaceCategory] = useState([]);

  const { loadData } = useMethods({
    loadData: async (type) => {
      setPlaceCategory(await getCategoryRes({ resourcesType: type }) || []);
    }
  });

  useEffect(() => {
    loadData(type);
  }, [loadData, type]);

  return (
    <FormTreeSelect
      name={name}
      label={label}
      placeholder={placeholder}
      treeData={placeCategory}
      config={config}
    />
  );
};

export default FormPlaceCategoryTreeSelect;
