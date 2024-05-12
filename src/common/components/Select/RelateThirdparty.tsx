/**
 * 云盯列表
 */
import { FC, useEffect, useRef } from 'react';
import { thirdpartyList } from '@/common/api/flow';
// import { FormUserListProps } from '@/common/components/FormBusiness/FormUserList';
import Fuzzy from './Fuzzy';

const RelateThirdparty: FC<any> = ({
  extraParams = {},
  setListData,
  ...props
}) => {
  const fuzzyRef = useRef();

  // 获取用户列表
  const loadData = async (keyword: string) => {
    const params = {
      keyword,
      ...extraParams,
    };
    const data = await thirdpartyList(params);
    return Promise.resolve(data);
  };

  useEffect(() => {
    if (!(Array.isArray(setListData) && setListData.length)) return;
    (fuzzyRef as any).current.setOptions(setListData); // 添加option项
  }, [setListData]);

  return (
    <Fuzzy
      ref={fuzzyRef}
      loadData={loadData}
      fieldNames={{
        label: 'name',
        value: 'storeId'
      }}
      {...props}/>
  );
};

export default RelateThirdparty;

