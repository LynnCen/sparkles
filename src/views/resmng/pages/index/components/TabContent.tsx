import { postPlaceList } from '@/common/api/place';
import { postSpotList } from '@/common/api/spot';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { PlusOutlined } from '@ant-design/icons';
import { FC, useEffect, useMemo, useState } from 'react';
import { ResourceType } from '../ts-config';
import { useActivate } from 'react-activation';

import ResourceTable from './ResourceTable';
// import { gatherMethods } from '@lhb/func';
import SearchForm from '@/common/components/Business/Resmng/SearchForm';
import { each, gatherMethods, refactorPermissions } from '@lhb/func';

const TabContent: FC<any> = ({
  categoryChooseModalInfo,
  setCategoryChooseModalInfo,
  activeKey,
  setActiveKey,
  resourceType,
  setResourceType,
}) => {
  // 操作按钮
  const [operateExtra, setOperateExtra] = useState<any>([]);
  const [filterProps, setFilterProps] = useState([]);
  const [filterFormValues, setFilterFormValues] = useState({});
  const [spotParam, setSpotParam] = useState<any>({});
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
      return res;
    });
  }, [operateExtra]);
  const [params, setParams] = useState<any>({ size: 10 });

  const { loadData, onSearch, ...methods } = useMethods({
    loadData: async (backParams) => {
      const result =
        resourceType === 0
          ? await postPlaceList({
            ...backParams,
            ...params
          })
          : await postSpotList({
            ...backParams,
            ...params
          });
      if (resourceType === 0) { // 只有场地查询上报大数据
        // 主动send事件
        window.LHBbigdata.send({
          event_id: 'cd43a91b-25a0-43b0-8f31-55e3661b712b', // 事件id
          msg: {
            ...backParams,
            ...params
          }, // 额外需要插入的业务信息
        });

      }
      if (!operateList.length) {
        setOperateExtra(result?.meta?.permissions || []);
      }
      return {
        dataSource: result.objectList,
        count: result.totalNum,
      };
    },
    // 查询/重置
    onSearch(filter: {[key: string]: any}) {
      // each(filter, (value, key) => {
      //   if (key === 'city') {
      //     filter['tag-city'] = value;
      //   }
      // });
      let tagsList:any = [];
      const formParams: any = {
        placeId: null,
        tagCodeV2List: [],
        searchPlaceName: null,
        placeCategoryIdList: null,
        spotCategoryIdList: null,
        spotId: null, // 找了一万年终于找到了 这个重置的地方
        spotName: null,
        independentSpot: 0, // 默认不现实虚拟项目
      };
      for (const item in filter) {
        if (filter.hasOwnProperty(item)) {
          if (item.indexOf('tag') !== -1) {
            if (filter[item]) formParams.tagCodeV2List.push(filter[item]);
          } else if (item.indexOf('city') !== -1) {
            if (filter[item]) formParams.tagCodeV2List.push(filter[item]);
            // if (filter[item]) formParams.tagCodeV2List = gatherMethods(formParams.tagCodeV2List, filter[item]);

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
      setCategoryChooseModalInfo({ ...categoryChooseModalInfo, resourceType: resourceType, visible: true, isKA: 'false' });
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
    // console.log(`spotParam = `, spotParam);
    if (spotParam && spotParam.placeId) {
      onSearch({ resourceType, placeId: spotParam.placeId });
    } else {
      onSearch({ resourceType });
    }
  }, [onSearch, resourceType, spotParam]);

  useEffect(() => {
    onSearch({});
  }, []);

  return (
    <>
      <SearchForm
        resourceType={resourceType}
        onSearch={onSearch}
        props={filterProps}
        filterFormValues={filterFormValues}
        spotParam={spotParam}
        channelCode='RESOURCES'
      />
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
        activeKey={activeKey}
        categoryChooseModalInfo={categoryChooseModalInfo}
        setCategoryChooseModalInfo={setCategoryChooseModalInfo}
        setFilterProps={setFilterProps}
        setFilterFormValues={setFilterFormValues}
        setActiveKey={setActiveKey}
        setResourceType={setResourceType}
        setSpotParam={setSpotParam}
      />
    </>
  );
};

export default TabContent;
