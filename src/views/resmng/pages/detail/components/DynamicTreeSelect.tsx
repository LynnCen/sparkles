import { post } from '@/common/request';
import { debounce } from '@lhb/func';
import { Spin, TreeSelect } from 'antd';
import { FC, ReactNode, useEffect, useState } from 'react';

import styles from './detail.module.less';



interface DynamicTreeSelectProps {
  restriction?: {
    dataOrigin: string,
    multiple?: boolean;
  };
  value?: any;
  onChange?: (value: any) => void;
}

const fieldNames = {
  label: 'name',
  value: 'value',
  children: 'children'
};

enum DataOriginEnum {
  /** 地铁站点 */
  METRO = 'METRO',
};


const DynamicTreeSelect: FC<DynamicTreeSelectProps> = ({ restriction, value, onChange }) => {
  const { dataOrigin, multiple } = restriction || {};
  const [loading, setLoading] = useState<boolean>(false);
  const [innerValue, setInnerValue] = useState<any>();
  const { optionList = [] } = innerValue || {};
  const [treeData, setTreeData] = useState<any>([]);
  const [search, setSearch] = useState<string>('');

  const onInnerChange = (value) => {
    setInnerValue(value);
    if (multiple) {
      onChange?.({ optionList: value ? value.map(item => ({ selectedId: item.value })) : [], dataOrigin });
      return;
    }

    onChange?.({ optionList: value ? [{ selectedId: value.value }] : [], dataOrigin });
  };


  const getOptions = async (dataOrigin: string, { name }: any = {}) => {
    setLoading(true);
    let valueList:any[] = [];
    if (optionList.length && optionList[0].hasOwnProperty('selectedId')) {
      valueList = optionList.map(item => item.selectedId).filter(Boolean);
    } else {
      valueList = optionList.map(item => item.value).filter(Boolean);
    }
    let treeData = await post('/dropDownList/search', {
      dataOrigin,
      name: name.trim() || null,
      valueList: valueList
    }, { needCancel: false });
    // 如果是地铁站点，需要特定样式
    if (dataOrigin === DataOriginEnum.METRO) {
      treeData = treeData.map(item => {
        return {
          name: renderOption(item),
          value: item.value,
        };
      });
    }

    setTreeData(treeData);
    setLoading(false);
  };

  const onSearch = debounce((name: string) => {
    setSearch(name);
    if (!loading) {
      getOptions(dataOrigin!, { name });
    }
  }, 400);

  const renderOption = (data:any):ReactNode => {

    return <>
      <p>{data?.name || ''}</p>
      {data?.description && <p style={{ color: '#999' }}>{data.description}</p>}
    </>;
  };


  useEffect(() => {
    if (dataOrigin) {
      getOptions(dataOrigin, { name: search });
    }
  }, [dataOrigin, search]);

  useEffect(() => {
    const { optionList = [] } = value || {};
    let newValue: any = [];

    if (optionList.length) {
      post('/dropDownList/search', {
        dataOrigin,
        name,
        valueList: optionList.map(item => item.selectedId).filter(Boolean)
      }, { needCancel: false }).then((treeData:any[]) => {
        if (!multiple) { // 单选选中值
          newValue.push({
            label: treeData.find(item => item.value === optionList[0].selectedId)?.name, // name 需要从treeData中获取
            value: optionList[0].selectedId
          });
        } else { // 多选选中值
          newValue = optionList.map(opt => ({
            label: treeData.find(item => item.value === opt.selectedId)?.name, // name 需要从treeData中获取
            value: opt.selectedId }));
        }
        setInnerValue({
          optionList: newValue,
          dataOrigin
        });
      });

    }
  }, [value, multiple]);



  return (
    <>
      <TreeSelect
        value={multiple ? optionList : optionList?.[0]}
        popupClassName={(styles[`dynamic-tree-select-${dataOrigin}`])}
        fieldNames={fieldNames}
        onChange={onInnerChange}
        onSearch={onSearch}
        showSearch
        allowClear
        labelInValue
        placeholder='请选择'
        notFoundContent={ loading ? <Spin size='small' /> : undefined}
        treeData={treeData}
        filterTreeNode={false}
        multiple={multiple}/>
    </>
  );
};


export default DynamicTreeSelect;
