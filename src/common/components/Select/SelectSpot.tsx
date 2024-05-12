/**
 * @Description 点位选择组件，没搜素到时提供资源服务的快捷创建入口
 */
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from './index.module.less';
import { Empty, Tag } from 'antd';
import Fuzzy from '@/common/components/Select/Fuzzy';
import { isArray } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { get, post } from '@/common/request';
import SelectAddPoint from '../Business/SelectAddPoint';
const SelectSpot: React.FC<any> = ({
  extraParams = {},
  form,
  onRef,
  defaultOptions,
  needAddableNotFoundNode = false,
  channel,
  onChange,
  onAdd,
  ...props
}) => {
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const fuzzyRef: any = useRef();
  const [data, setData] = useState<any>([]);

  const methods = useMethods({
    addClose() {},
    addOk(result: Record<string, any> | number) {
      if (typeof result === 'number') {
        form.setFieldValue('spotId', result);
      } else {
        form.setFieldValue('spotId', result.spotId);
        onAdd?.(result.spotId, result);
      }
      form.validateFields(['spotId']);
      setTimeout(() => {
        fuzzyRef.current.reload();
      }, 300);
    },
    toAdd() {
      fuzzyRef.current.selectRef.blur();
      setTimeout(() => {
        setAddVisible(true);
      }, 200);
    },
    async loadData(name: string) {
      const params = {
        name,
        ...extraParams,
      };
      let objectList: any = [];
      let data = [];
      if (channel === 'CDB') {
        if (extraParams.longitude && extraParams.latitude) {
          data = await get('/spot/around/list', params, true);
        }
      } else {
        const result = await post('/admin/spot/query', params, { proxyApi: '/passenger-flow', needHint: true });
        data = result.objectList;
      }
      objectList = data || [];
      setData(objectList);
      return Promise.resolve(objectList);
    }
  });
  const addableNotFoundNode = (
    <div className={styles.spotNoData}>
      { (!!extraParams.longitude && !!extraParams.latitude || channel !== 'CDB') ? (
        <>未找到匹配点位，<span className={styles.spotToAdd} onClick={methods.toAdd}>去新增</span></>
      ) : <>{ channel === 'CDB' ? '请先填写店铺位置' : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'请输入关键词进行搜索'} /> }</> }
    </div>
  );

  useImperativeHandle(onRef, () => ({
    reload() {
      fuzzyRef.current.reload();
    },
    getData() {
      return data;
    },
    addOption: fuzzyRef.current.addOption,
    setOptions: fuzzyRef.current.setOptions,
  }));
  useEffect(() => {
    if (!(isArray(defaultOptions) && defaultOptions.length)) return;
    fuzzyRef.current.setOptions(defaultOptions); // 添加option项
    // finallyData && finallyData(setListData);
  }, [defaultOptions]);
  return (
    <>
      <Fuzzy
        ref={fuzzyRef}
        loadData={methods.loadData}
        fieldNames={{
          label: channel === 'CDB' ? 'spotName' : 'longName',
          value: channel === 'CDB' ? 'spotId' : 'id',
        }}
        customOptionItem={(option) => {
          return channel === 'CDB' ? (
            <div key={option.spotId}>
              <Tag color='blue'>{option.categoryName}</Tag>
              {option.placeName}-{option.spotName}
            </div>
          ) : (
            <div key={option.id}>
              <Tag color='blue'>{option.categoryName}</Tag>
              {option.longName}
            </div>
          );
        }}
        onClear={() => fuzzyRef.current.reload()}
        notFoundNode={needAddableNotFoundNode ? addableNotFoundNode : undefined}
        onChange={(value) => onChange(value, data?.filter((item) => item.spotId === value)?.[0])}
        {...props} />
      {
        needAddableNotFoundNode && <SelectAddPoint channel={channel} zIndex={1001} visible={addVisible} extraParams={extraParams} onClose={() => setAddVisible(false)} onOK={methods.addOk}/>
      }
    </>
  );
};

export default SelectSpot;

