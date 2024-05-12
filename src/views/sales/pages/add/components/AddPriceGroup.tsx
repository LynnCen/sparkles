import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { FC, useEffect, useState } from 'react';
import AddPrice from './AddPrice';

interface AddPriceGroupProps {
  value?: any;
  onChange?: any;
}


const AddpriceGroup: FC<AddPriceGroupProps> = ({ value, onChange }) => {
  const [data, setData] = useState<any[]>([{ date: '', number: undefined }]);

  const onAdd = () => {
    // @ts-ignore
    const newData = [...data];
    newData.push({ date: '', amount: undefined });
    setData(newData);
    onChange?.(newData);
  };

  useEffect(() => {
    if (!value) {
      setData([{ date: '', amount: undefined }]);
      return;
    }
    setData(value as any);
  }, [value]);

  return (
    <>
      {data.map((value, index) => {

        const onDelete = () => {
          const newData = [...data];
          newData.splice(index, 1);
          setData(newData);
          onChange?.(newData);
        };

        const onPriceChange = (values: any) => {
          const newData = [...data];
          newData.splice(index, 1, values);
          setData(newData);
          onChange?.(newData);
        };
        return (
          <Space style={{ marginTop: index !== 0 ? 14 : 0 }} size={0} key={index}>
            <AddPrice onChange={onPriceChange} value={value}/>
            <Space size={0}>
              <Button disabled={index === 0} size='small' type='link' icon={<DeleteOutlined />} onClick={onDelete}>删除</Button>
              { index === data.length - 1 && <Button size='small' icon={<PlusCircleOutlined />} type='link' onClick={onAdd}>添加</Button>}
            </Space>
          </Space>
        );
      })}
    </>
  );
};

export default AddpriceGroup;
