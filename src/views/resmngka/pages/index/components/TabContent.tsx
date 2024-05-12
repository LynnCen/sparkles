/* eslint-disable react-hooks/exhaustive-deps */
import { kaPlaceList } from '@/common/api/place';
import { kaSpotList } from '@/common/api/spot';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { downloadFileStream } from '@/common/utils/ways';
import { PlusOutlined } from '@ant-design/icons';
import { FC, useEffect, useMemo, useState } from 'react';

import ResourceTable from './ResourceTable';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { get } from '@/common/request';
import { Spin } from 'antd';
// import { gatherMethods } from '@lhb/func';
import { ResourceType } from '../ts-config';
import SearchForm from '@/common/components/Business/Resmng/SearchForm';
import { each, gatherMethods, refactorPermissions } from '@lhb/func';
import { useActivate } from 'react-activation';

const TabContent: FC<any> = ({ activeKey, setActiveKey, resourceType, setResourceType }) => {
  // 操作按钮
  const [operateExtra, setOperateExtra] = useState<any>([]);
  const [filterProps, setFilterProps] = useState([]);
  const [filterFormValues, setFilterFormValues] = useState({});
  const [spotParam, setSpotParam] = useState<any>({});
  const [spinning, setSpinning] = useState<boolean>(false);
  const [hasExportPermission, setHasExportPermission] = useState<boolean>(false);
  const operateList: any = useMemo(() => {
    const list = refactorPermissions(operateExtra);
    return list.map((item) => {
      const res: any = {
        name: item.text,
        event: item.event,
        func: item.func,
        type: item.isBatch ? 'default' : 'primary',
      };
      if (item.event === 'create') {
        res.icon = <PlusOutlined />;
      }
      if (item.event === 'export') {
        setHasExportPermission(true);
      }
      return res;
    });
  }, [operateExtra]);
  const [params, setParams] = useState<any>({ size: 10 });

  const { loadData, onSearch, getTplId, getCategoryId, ...methods } = useMethods({
    loadData: async (backParams) => {
      // const result = resourceType === 0 ? await kaPlaceList({ ...backParams, ...params }) : await kaSpotList({ ...backParams, ...params });
      const result =
        resourceType === 0
          ? await kaPlaceList({
            ...params,
            page: backParams.page,
            size: backParams.size
          })
          : await kaSpotList({
            ...params,
            page: backParams.page,
            size: backParams.size
          });
      if (result && result.meta && result.meta.permissions) {
        setOperateExtra(result?.meta?.permissions || []);
      }
      return {
        dataSource: result.objectList,
        count: result.totalNum,
      };
    },
    // 查询/重置
    onSearch(filter: { [key: string]: any }) {
      let tagsList:any = [];
      const formParams: any = {
        placeId: null,
        tagCodeV2List: [],
        name: null,
        placeCategoryIdList: null,
        spotCategoryIdList: null,
      };
      for (const item in filter) {
        if (filter.hasOwnProperty(item)) {
          if (item.indexOf('tag') !== -1) {
            if (filter[item]) formParams.tagCodeV2List.push(filter[item]);
            // if (filter[item]) formParams.tagCodeList = gatherMethods(formParams.tagCodeList, filter[item]);
          } else if (item.indexOf('city') !== -1) {
            if (filter[item]) formParams.tagCodeV2List.push(filter[item]);
            // if (filter[item]) formParams.tagCodeList = gatherMethods(formParams.tagCodeList, filter[item]);
          } else if (item.indexOf('hightSearch') !== -1 && filter['hightSearch'].length !== 0) {
            if (filter[item]) {
              tagsList = gatherMethods(tagsList, filter[item]);
              const sameKeyArr:any = [];
              tagsList.map(item => {
                const v = item.slice(0, item.length - 2);
                sameKeyArr.push(v);
              });
              const _sameKeyArr: Array<string> = Array.from(new Set(sameKeyArr));

              const keyObj:any = {};
              _sameKeyArr.map(item => {
                keyObj[item] = [];
              });
              tagsList.map(item => {
                const v = item.slice(0, item.length - 2);
                each(keyObj, (value, key) => {
                  if (v === key) {
                    value.push(item);
                  }
                });
              });

              const queryArr:string[] = [];
              each(keyObj, (value) => {
                queryArr.push(value);
              });

              formParams.tagCodeV2List = queryArr;
            }
          } else {
            formParams[item] = filter[item];
          }
        }
      }
      formParams.tagCodeV2List?.map((item, index) => {
        if (item.length === 0) {
          formParams.tagCodeV2List.splice(index, 1); // 删除空数组
        }
      });
      setParams(formParams);
    },
    handleCreate() {
      const tplId = getTplId();
      const categoryId = getCategoryId();
      dispatchNavigate(`/resmng/detail?resourceType=0&categoryId=${categoryId}&categoryTemplateId=${tplId}&isKA=true`);
    },
    getTplId() {
      if (Number(resourceType) === 0) {
        return process.env.KA_TPL_ID_PLACE;
      } else {
        return process.env.KA_TPL_ID_SPOT;
      }
    },
    getCategoryId() {
      if (Number(resourceType) === 0) {
        return process.env.KA_CATEGORY_ID_PLACE;
      } else {
        return process.env.KA_CATEGORY_ID_SPOT;
      }
    },
    handleExport() {
      setSpinning(true);
      get('/export/resource/ka', { ...params }, { responses: { responseType: 'arraybuffer' } }).then((data) => {
        downloadFileStream(data, '点位列表.xlsx');
        setSpinning(false);
      });
    },
  });

  useActivate(() => {
    if (spotParam && spotParam.placeId) {
      onSearch({ resourceType, ...spotParam });
    } else {
      onSearch(params);
    }
  });

  /**
   * 如果tabber场地点位切换则重置spotparam
   */
  useEffect(() => {
    if (+activeKey === ResourceType.PLACE) {
      setSpotParam({});
    }
  }, [activeKey]);

  useEffect(() => {
    if (spotParam && spotParam.placeId) {
      onSearch({ resourceType, placeId: spotParam.placeId });
    } else {
      onSearch({ resourceType });
    }
  }, [activeKey, onSearch, resourceType, spotParam]);

  return (
    <>
      <SearchForm
        resourceType={resourceType}
        onSearch={onSearch}
        props={filterProps}
        filterFormValues={filterFormValues}
        spotParam={spotParam}
        channelCode='KA'
      />
      <Spin spinning={spinning}>
        {resourceType === ResourceType.PLACE ? (
          <div style={{ marginBottom: '16px' }}>
            <Operate operateList={operateList} onClick={(btn) => methods[btn.func](params)} />
          </div>
        ) : null}
        <ResourceTable
          loadData={loadData}
          onSearch={onSearch}
          params={params}
          resourceType={resourceType}
          setFilterProps={setFilterProps}
          setFilterFormValues={setFilterFormValues}
          setActiveKey={setActiveKey}
          setResourceType={setResourceType}
          setSpotParam={setSpotParam}
          hasExportPermission={hasExportPermission}
        />
      </Spin>
    </>
  );
};

export default TabContent;
