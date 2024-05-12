import { FC, useRef } from 'react';
import cs from 'classnames';
import styles from '../entry.module.less';
import Table from '@/common/components/FilterTable';
import { useMethods } from '@lhb/hook';
import { get } from '@/common/request';
const TableList: FC<any> = ({ params = {}, setOperateId, add, showEdit }) => {
  const tableRef = useRef();
  /* data */
  /* methods */
  const methods = useMethods({
    async fetchData(params) {
      var { objectList, totalNum } = await get('/shop/type/list', params, {
        isMock: false,
        mockId: 331,
        mockSuffix: '/api',
        needHint: true,
        needCancel: false,
      });

      return {
        dataSource: objectList || [],
        count: totalNum,
      };
    },
    add() {},
    handleEdit(record) {
      // 编辑
      setOperateId(record.id);
      showEdit(true, record);
    },
  });
  const columns = [
    { title: '序号', key: 'id', render: (_, __, index) => index + 1 },
    { title: '门店类型', key: 'name' },
    {
      title: '所属行业',
      key: 'industryList',
      render: (value) => (value ? value.map((_) => _.name).join('/') : null),
    },
    {
      title: '状态',
      key: 'statusName',
      render: (value, record) => {
        return record.status ? (
          value
        ) : (
          <span
            style={{
              color: '#ccc',
            }}
          >
            {value}
          </span>
        );
      },
    },
    {
      title: '操作',
      key: 'permissions',
      fixed: 'right',
      render: (value, record) => <a onClick={() => methods['handleEdit'](record)}>编辑</a>,
    },
  ];
  /* components */
  const customEmpty = (
    <>
      暂无内容，去
      <span className={styles.emptyAdd} onClick={add}>
        新增门店类型
      </span>
    </>
  );
  return (
    <>
      <Table
        columns={columns}
        onFetch={methods.fetchData}
        className={cs(styles.tableList, 'mt-20')}
        filters={params}
        rowKey='id'
        emptyContent={customEmpty}
        ref={tableRef}
      />
    </>
  );
};
export default TableList;
