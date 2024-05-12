import { FC, useEffect, useState } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import { Form, message, Modal, Tag } from 'antd';
import FormInput from '@/common/components/Form/FormInput';
import { useMethods } from '@lhb/hook';
import SearchForm from '@/common/components/Form/SearchForm';
import FilterTable from '@/common/components/FilterTable';
import { postAttachTenants, postDetachTenants, postTenantQuery } from '@/common/api/passenger-flow';
const TeamModal: FC<any> = ({
  data,
  setData,
  onSuccess
}) => {
  const [searchForm] = Form.useForm();
  const [params, setParams] = useState({ name: '' });
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const methods = useMethods({
    getTitle() {
      // 1: 添加可见团队，2：移除可见团队
      if (data.type === 1) {
        return '添加可见团队/租户';
      } else {
        return '移除可见团队/租户';
      }
    },
    onSearch(data = {}) {
      // 为了让查询动态化
      const _params = searchForm.getFieldsValue();
      setParams({
        ..._params,
        ...data,
      });
    },
    setShow(visible = true) {
      setData({
        ...data,
        visible
      });
    },
    async fetchData(_params) {
      const { objectList = [], totalNum = 0 } = await postTenantQuery(_params);
      return {
        dataSource: objectList,
        count: totalNum
      };
    },
    submit() {
      setLoading(true);
      if (data.type === 1) { // 批量添加团队/租户
        postAttachTenants({
          tenantIds: selectedRowKeys,
          storeIds: data.ids
        }).then(() => {
          setLoading(false);
          message.success('添加成功');
          onSuccess();
          methods.setShow(false);
        });
      } else { // 批量删除团队/租户
        postDetachTenants({
          tenantIds: selectedRowKeys,
          storeIds: data.ids
        }).then(() => {
          setLoading(false);
          onSuccess();
          message.success('移除成功');
          methods.setShow(false);
        });
      }
    },
    tagClose(id) {
      setSelectedRowKeys(selectedRowKeys.filter(item => item !== id));
      setSelectedRows(selectedRows.filter(item => item.id !== id));
    }
  });
  useEffect(() => {
    if (data.visible) {
      setSelectedRows([]);
      setSelectedRowKeys([]);
      setParams({
        name: ''
      });
    }
  }, [data.visible]);
  // 列表项
  const columns = [
    { title: '租户编号', key: 'number' },
    { title: '团队名称/租户名称', key: 'name' },
  ];
  return (
    <Modal
      title={methods.getTitle()}
      width='700px'
      style={{
        top: '50px'
      }}
      open={data.visible}
      onOk={methods.submit}
      maskClosable={false}
      confirmLoading={loading}
      className={styles.teamModal}
      onCancel={() => methods.setShow(false)}>
      <SearchForm labelLength={0} onSearch={methods.onSearch} needResetButton={false} className={styles.teamSearch}>
        <FormInput name='name' placeholder='请输入租户/团队名' />
      </SearchForm>
      {
        selectedRows.length ? <div className={styles.teamSelect}>
          <div className={styles.teamSelectText}>已选择团队/租户 {selectedRows.length}个</div>
          <div>
            {
              selectedRows.map(item => {
                return <Tag key={item.id} closable onClose={() => methods.tagClose(item.id)}>{item.name}</Tag>;
              })
            }
          </div>
        </div> : <></>
      }
      <FilterTable
        columns={columns}
        onFetch={methods.fetchData}
        filters={params}
        className={cs(styles.tableList, 'mt-20')}
        paginationConfig={{
          showSizeChanger: false
        }}
        rowSelection={{
          type: 'checkbox',
          preserveSelectedRowKeys: true,
          selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows: any[]) => {
            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows);
          },
        }}
        rowKey='id'
        pageSize={10}/>
    </Modal>
  );
};

export default TeamModal;
