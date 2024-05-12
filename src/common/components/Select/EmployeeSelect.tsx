/**
 * @Description 员工搜索
 */

import { FC, useImperativeHandle, useRef, useState } from 'react';
import Fuzzy from '../Form/V2Fuzzy/Fuzzy';
import { useMethods } from '@lhb/hook';
import { postEmployeeSearch } from '@/common/api/common';

const EmployeeSelect:FC<any> = ({
  onRef,
  extraParams = {},
  onChange,
  ...props
}) => {
  const fuzzyRef: any = useRef();
  const [data, setData] = useState<any>([]);

  const methods = useMethods({
    async loadData(keyword) {
      const params = {
        keyword,
        ...extraParams
      };
      const res = await postEmployeeSearch(params) || [];
      const finalData = res?.map((item) => {
        const { tenantName, name, mobile, id, tenantId } = item;
        return { label: `${tenantName}-${name}-${mobile}`, value: `${tenantId}-${id}`, ...item };
      }) || [];

      setData(finalData);
      return Promise.resolve(finalData);
    }
  });

  useImperativeHandle(onRef, () => ({
    getData() {
      return data;
    },
    addOption: fuzzyRef.current.addOption,
    setOptions: fuzzyRef.current.setOptions,
    getItem: fuzzyRef.current.getItem,
  }));


  return (
    <Fuzzy
      ref={fuzzyRef}
      loadData={methods.loadData}
      onChange={onChange}
      fieldNames={{ label: 'label', value: 'value' }}
      {...props}/>
  );
};

export default EmployeeSelect;
