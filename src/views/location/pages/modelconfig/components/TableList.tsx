import { FC, useRef } from 'react';
import cs from 'classnames';
import styles from '../entry.module.less';
import { useMethods } from '@lhb/hook';
import { get, post } from '@/common/request';
import ShowMore from '@/common/components/Data/ShowMore';
import Operate from '@/common/components/Operate';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import V2Table from '@/common/components/Data/V2Table';
import { refactorPermissions } from '@lhb/func';
const TableList: FC<any> = ({ params = {}, setOperateList, setOperateModel, onSearch, mainHeight }) => {
  const tableRef = useRef();
  /* data */
  /* methods */
  const methods = useMethods({
    async fetchData(params) {
      // https://yapi.lanhanba.com/project/331/interface/api/34329
      const { meta, objectList, totalNum } = await get('/shop/model/list', params, {
        isMock: false,
        mockId: 331,
        mockSuffix: '/api',
        needHint: true,
        proxyApi: '/blaster',
      });

      if (meta && meta.permissions && meta.permissions.length) {
        const list = refactorPermissions(meta.permissions);
        const operateList = list.map((item) => {
          const res: any = {
            name: item.text,
            event: item.event,
            func: item.func,
            type: item.isBatch ? 'default' : 'primary',
          };
          return res;
        });
        setOperateList(operateList);
      }

      return {
        dataSource: objectList || [],
        count: totalNum,
      };
    },
    handleDelete(record) {
      ConfirmModal({
        onSure: (modal) => {
          post('/shop/model/delete', { id: record.id }, { proxyApi: '/blaster' }).then(() => {
            modal.destroy();
            onSearch();
          });
        },
      });
    },
    handleUpdate(record) {
      setOperateModel({ visible: true, ...record, industryId: record.industryList.map((item) => item.id) });
    },
    handleSetting(record) {
      dispatchNavigate('/location/modelconfigdetail?id=' + record.id);
    },
  });
  const columns = [
    { title: '模型名称', key: 'name' },
    { title: '模型编号', key: 'code' },
    { title: '店铺类型', key: 'categoryName' },
    {
      title: '所属行业',
      key: 'industryList',
      render: (value) => (value ? value.map((_) => _.name).join('/') : ''),
    },
    { title: '模型描述', key: 'description', render: (text) => <ShowMore maxWidth='200px' text={text} /> },
    { title: '创建时间', key: 'createdAt', render: (text) => <ShowMore maxWidth='200px' text={text} /> },
    { title: '在用租户', key: 'tenants', render: (text) => <ShowMore maxWidth='200px' text={text} /> },
    {
      title: '操作',
      key: 'permissions',
      fixed: 'right',
      width: 200,
      render: (value: any, record) => (
        <Operate
          showBtnCount={4}
          operateList={refactorPermissions(value)}
          onClick={(btn: any) => {
            methods[btn.func](record);
          }}
        />
      ),
    },
  ];
  return (
    <>
      <V2Table
        defaultColumns={columns}
        onFetch={methods.fetchData}
        className={cs(styles.tableList, 'mt-20')}
        scroll={{ y: mainHeight - 64 - 42 - 84 }}
        filters={params}
        rowKey='id'
        ref={tableRef}
      />
    </>
  );
};
export default TableList;
