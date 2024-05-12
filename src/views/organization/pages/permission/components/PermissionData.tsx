import { FC, useState, useEffect } from 'react';
import { Radio, Space } from 'antd';
import { PermissionDataProps } from '../ts-config';

const PermissionData: FC<PermissionDataProps> = ({
  treeData,
  checkedKeys,
  changeCheckKeys
}) => {

  const [checkedVal, setCheckedVal] = useState<number>(0);
  useEffect(() => {
    Array.isArray(checkedKeys) && checkedKeys.length && setCheckedVal(checkedKeys[0]);
  }, [checkedKeys]);

  const changeHandle = (e: any) => {
    const val = e.target.value;
    setCheckedVal(val);
    changeCheckKeys('check', [val]);
  };

  return (
    <>
      <Radio.Group value={checkedVal} onChange={changeHandle}>
        <Space direction='vertical'>
          {treeData.map((item) => (
            <Radio value={item.id} key={item.id}>{ item.name }</Radio>
          ))}
        </Space>
      </Radio.Group>
    </>
  );
};

export default PermissionData;
