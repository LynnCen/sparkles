/**
 * @Description 资源库项目列表搜索
 */
import { FC, useImperativeHandle, useRef } from 'react';
import Fuzzy from '@/common/components/Select/Fuzzy';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';

const PlaceSelect:FC<any> = ({
  extraParams,
  onRef,
  ...props
}) => {
  const fuzzyRef: any = useRef();

  const methods = useMethods({
    async loadData(keyword: string) {
      const params = {
        keyword,
        ...extraParams,
      };
      const { objectList } = await post('/admin/place/page/public', params, { proxyApi: '/zhizu-api', isMock: false, mockId: 307 }) || [];
      // setData(objectList);
      return Promise.resolve(objectList);
    }
  });

  useImperativeHandle(onRef, () => ({
    addOption: fuzzyRef.current.addOption,
    setOptions: fuzzyRef.current.setOptions,
    getItem: (data) => fuzzyRef.current.getItem(data)
  }));

  return (
    <Fuzzy
      ref={fuzzyRef}
      placeholder='请选择项目'
      needCacheSelect
      loadData={methods.loadData}
      allowClear
      mode='multiple'
      fieldNames={{
        label: 'name',
        value: 'id',
      }}
      customOptionItem={(option) => {
        return <>{option.name}</>;
      }}
      maxTagCount='responsive'
      showArrow
      {...props}
    />
  );
};

export default PlaceSelect;
