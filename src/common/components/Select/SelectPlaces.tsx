/**
 * @Description
 */
import { FC, useContext } from 'react';
import Fuzzy from './Fuzzy';
import { Button, message } from 'antd';
import { recursionEach } from '@lhb/func';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { CurrentUserInfo } from '@/layout';
import { get, post } from '@/common/request';

const Places: FC<any> = ({ finallyData, enableNotFoundNode, notFoundNode, extraParams, channel, fuzzyRef, ...props }) => {
  const result: any = useContext(CurrentUserInfo);

  const loadData = async (keyword?: string) => {
    const params = { name: keyword, ...extraParams };
    let data = [];
    if (channel === 'CDB') {
      data = await get('/place/around/list', params, true);
    } else {
      const result = await post('/location/place/pages', { ...params }, {
        needHint: true,
        proxyApi: '/blaster'
      });
      data = result.objectList;
    }
    finallyData && finallyData(data);
    return Promise.resolve(data);
  };

  const jump = async () => {
    const moduleList: Array<any> = result.moduleList || [];
    let hasPermission = false;
    recursionEach(moduleList, 'children', (item: any) => {
      if (item.uri === '/resmng') {
        hasPermission = true;
      }
    });
    if (hasPermission) {
      dispatchNavigate('/resmng');
    } else {
      message.warn('暂无资源管理查看权限，请联系相关人员开通');
    }
  };

  const _notFoundNode = (
    <>
      暂未录入该场地,
      <Button type='link' onClick={jump}>
        去新增
      </Button>
    </>
  );

  return (
    <Fuzzy
      ref={fuzzyRef}
      loadData={loadData}
      fieldNames={{
        label: channel === 'CDB' ? 'placeName' : 'name',
        value: channel === 'CDB' ? 'placeId' : 'id',
      }}
      notFoundNode={enableNotFoundNode ? (notFoundNode || _notFoundNode) : null}
      {...props}
    />
  );
};

export default Places;
