import { FC, useEffect, useRef } from 'react';
import Fuzzy from '@/common/components/Select/Fuzzy';
import { isNotEmptyAny } from '@lhb/func';
import { postRequirementList } from '@/common/api/demand-management';

const Demand: FC<any> = (props) => {
  const fuzzyRef = useRef<any>();

  useEffect(() => {
    if (isNotEmptyAny(props.defaultValue)) {
      fuzzyRef.current.reload();
    }
  }, [props.defaultValue]);

  const loadData = async (keyword?: string) => {
    const params = {
      mergeKeyword: keyword,
      page: 1,
      size: 50,
      oneLevelTab: '1'
    };
    const data = await postRequirementList(params);
    if (isNotEmptyAny(props.defaultValue)) {
      data.objectList = data.objectList.filter((item: any) => item.id !== props.defaultValue.id);
      data.objectList.unshift({ id: props.defaultValue.id, name: props.defaultValue.name });
    }
    return Promise.resolve(data.objectList);
  };
  return (
    <Fuzzy
      ref={fuzzyRef}
      loadData={loadData}
      fieldNames={{
        value: 'id',
        label: 'name',
      }}
      {...props}
    />
  );
};

export default Demand;
