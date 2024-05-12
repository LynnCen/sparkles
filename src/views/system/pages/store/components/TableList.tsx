import { FC, useRef } from 'react';
import { message, Space } from 'antd';
import cs from 'classnames';
import styles from '../entry.module.less';
import Table from '@/common/components/FilterTable';
import { useMethods } from '@lhb/hook';
import ShowMore from '@/common/components/FilterTable/ShowMore';
import { get, post } from '@/common/request';
const TableList: FC<any> = ({
  params = {},
  setOperateId,
  showEdit,
  add,
  onSuccess
}) => {
  const tableRef = useRef();
  /* data */
  /* methods */
  const methods = useMethods({
    async fetchData(params) {
      // https://yapi.lanhanba.com/project/331/interface/api/34329
      const { objectList, totalNum } = await get('/shop/model/list', params, {
        isMock: false,
        mockId: 331,
        mockSuffix: '/api',
        needHint: true
      });
      return {
        dataSource: objectList || [],
        count: totalNum,
      };
    },
    handleDelete(id) { // 删除
      post('/shop/model/delete', { id }, {
        isMock: false,
        mockId: 331,
        mockSuffix: '/api',
        needHint: true
      }).then(() => {
        message.success('操作成功', 0.2, () => {
          onSuccess && onSuccess();
        });
      });
    },
    handleEdit(record) { // 编辑
      setOperateId(record.id);
      showEdit(true, record);
    }
  });
  const columns = [
    { title: '模型名称', key: 'name' },
    { title: '模型编号', key: 'code' },
    { title: '店铺类型', key: 'categoryName' },
    {
      title: '所属行业',
      key: 'industryList',
      render: (value) => value?.map(_ => _.name).join('/')
    },
    { title: '模型描述', key: 'description', render: (text) => <ShowMore maxWidth='200px' text={text} /> },
    {
      title: '操作',
      key: 'permissions',
      fixed: 'right',
      render: (value, record) => <>
        <Space>
          <a onClick={() => methods['handleEdit'](record)}>编辑</a>
          <a onClick={() => methods['handleDelete'](record.id)}>删除</a>
        </Space>
      </>
    },
  ];
  /* components */
  const customEmpty = (
    <>
      暂无内容，去<span className={styles.emptyAdd} onClick={add}>新增模型</span>
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
        ref={tableRef} />
    </>
  );
};
export default TableList;
