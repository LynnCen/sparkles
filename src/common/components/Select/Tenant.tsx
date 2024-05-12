import { FC, useEffect, useRef } from 'react';
import Fuzzy from '@/common/components/Select/Fuzzy';
import { tenantList } from '@/common/api/common';
import { isNotEmptyAny } from '@lhb/func';

const Tenant: FC<any> = (props) => {
  const fuzzyRef = useRef<any>();

  useEffect(() => {
    if (isNotEmptyAny(props.defaultValue)) {
      fuzzyRef.current.reload();
    }
  }, [props.defaultValue]);

  const loadData = async (keyword?: string) => {
    const params = {
      keyword: keyword,
      page: 1,
      size: 50,
    };
    let data = await tenantList(params);
    if (isNotEmptyAny(props.defaultValue)) {
      data = data.filter((item: any) => item.id !== props.defaultValue.id);
      data.unshift({ id: props.defaultValue.id, name: props.defaultValue.name });
    }
    return Promise.resolve(data);
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

export default Tenant;
