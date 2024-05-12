import { FC, useContext } from 'react';
import Fuzzy from './Fuzzy';
import { Button, message } from 'antd';
import { placeSearch } from '@/common/api/flow';
import { recursionEach } from '@lhb/func';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { CurrentUserInfo } from '@/layout';

const Places: FC<any> = ({ finallyData, enableNotFoundNode, notFoundNode, fuzzyRef, ...props }) => {
  const result: any = useContext(CurrentUserInfo);

  const loadData = async (keyword?: string) => {
    const data = await placeSearch({ page: 1, size: 50, ...(keyword && { name: keyword }) });
    finallyData && finallyData(data);
    return Promise.resolve(data.objectList);
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
        点击去资源中心新增
      </Button>
    </>
  );

  return (
    <Fuzzy
      ref={fuzzyRef}
      loadData={loadData}
      fieldNames={{
        label: 'name',
        value: 'id',
      }}
      notFoundNode={enableNotFoundNode ? (notFoundNode || _notFoundNode) : null}
      {...props}
    />
  );
};

export default Places;
