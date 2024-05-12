import { usePlace } from '@/common/hook';
import { Select } from 'antd';
import { FC } from 'react';

interface PositionSelectProps {
  value?: any;
  onChange?: (value: any) => void;
  placeId?: string
}

const PlaceSelect: FC<PositionSelectProps> = ({ placeId, ...props }) => {
  const { onSearch, options } = usePlace(placeId!);

  return (
    <Select
      onSearch={onSearch}
      filterOption={false}
      showSearch options={options}
      placeholder='请选择场地'
      {...props}/>
  );
};

export default PlaceSelect;
