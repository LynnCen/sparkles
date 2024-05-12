/**
 * @Description 门店地图配置项
 */
import { FC, useState } from 'react';
import { Button, Form } from 'antd';
import { isNotEmptyAny, refactorPermissions } from '@lhb/func';

import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';

import styles from './entry.module.less';
import EditOrCreateModal from './components/EditOrCreateModal';
import V2Operate from '@/common/components/Others/V2Operate';
import { useMethods } from '@lhb/hook';
import V2Form from '@/common/components/Form/V2Form';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import IconFont from '@/common/components/IconFont';
import {
  deleteStoreMapConfig,
  getStoreMapConfigList,
  setStoreMapConfigPermission,
} from '@/common/api/system';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

const StoreMapConfig: FC<any> = () => {
  const [form] = Form.useForm();
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [id, setId] = useState<number>(); // 选择id
  const [isEdit, setIsEdit] = useState<boolean>(false); // 是否为编辑弹窗
  const [filters, setFilters] = useState<any>(); // 参数变化的时候会触发请求更新table表格
  const [showModal, setShowModal] = useState<boolean>(false); // 新增/编辑 弹窗是否可见

  const methods = useMethods({
    // 点击编辑
    handleEdit(id: number) {
      setId(id);
      setIsEdit(true);
      setShowModal(true);
    },
    // 点击删除
    async handleDelete(id: number) {
      try {
        deleteStoreMapConfig({ id }).then(() => {
          V2Message.success('删除成功');
          setFilters({});
        });
      } catch {
        V2Message.error('删除失败，请稍后再试');
      }
    },

    // 设置员工权限
    async onChangeFlag() {
      // 当前值
      const companyPermissionFlag = form.getFieldValue('companyPermissionFlag');
      setStoreMapConfigPermission({ companyPermissionFlag })
        .then(() => {
          V2Message.success('设置成功');
        })
        .catch(() => {
          V2Message.error('设置失败，请稍后再试');
        });
    },
  });

  /** 获取加载table表格数据。该函数依赖filters变化自动触发 */
  const loadData = async () => {
    const res = await getStoreMapConfigList();
    const { companyPermissionFlag } = res.meta;

    form.setFieldsValue({ companyPermissionFlag });

    return {
      dataSource: res.objectList,
      count: 0,
    };
  };

  // 表头
  const defaultColumns = [
    {
      key: 'name',
      title: '类别名称',
      dragChecked: true,
      importWidth: true,
      width: '300px',
      render: value => {
        return isNotEmptyAny(value) ? value : '-';
      },
    },
    {
      key: 'pointStatusName',
      title: '包含机会点状态',
      dragChecked: true,
      width: 'auto',
      render: value => {
        return isNotEmptyAny(value) ? value : '-';
      },
    },
    {
      key: 'shopStatusName',
      title: '包含门店状态',
      dragChecked: true,
      width: 'auto',
      render: value => (isNotEmptyAny(value) ? value : '-'),
    },
    {
      title: '操作',
      key: 'permissions',
      width: '220px',
      dragChecked: true,
      fixed: 'right',
      render: (val: any[], record: any) => {
        const operate = [
          { event: 'department:edit', name: '编辑' },
          {
            event: 'department:delete',
            name: '删除',
            usePopConfirm: true,
            popConfirmContent: '你确定删除此类别吗？',
          },
        ];
        return (
          <V2Operate
            operateList={refactorPermissions(operate)}
            onClick={(btn: any) => methods[btn.func](record.id)}
          />
        );
      },
    },
  ];

  const options = [
    { label: '是', value: true },
    { label: '否', value: false },
  ];

  return (
    <div>
      <V2Container
        className={styles.storeMapContainer}
        // 上下padding 20px  标题height 48px
        style={{ height: 'calc(100vh - 48px - 40px)' }}
        emitMainHeight={h => setMainHeight(h)}
        extraContent={{
          top: (
            <>
              <div className={styles.titleOperate}>
                门店地图配置
                <Button
                  type='primary'
                  onClick={() => {
                    setIsEdit(false);
                    setShowModal(true);
                  }}
                >
                  新增类别
                </Button>
              </div>

              <V2Form form={form} layout='inline'>
                <V2FormRadio
                  // canClearEmpty
                  form={form} // 设置canClearEmpty为true的时候必须传递form
                  label='门店地图是否需要判断员工权限'
                  name='companyPermissionFlag'
                  options={options}
                  formItemConfig={{
                    tooltip: {
                      title:
                        '员工在门店地图功能中，能看见哪些门店，是否根据员工所在组织架构所決定，例如：只有杭州市的员工才能看见杭州市的门店分布情况，其他城市的员工看不见。',
                      icon: (
                        <span>
                          <IconFont
                            className='anticon anticon-info-circle'
                            style={{ color: '#CCCCCD' }}
                            iconHref='pc-common-icon-ic_info'
                          />
                        </span>
                      ),
                    },
                  }}
                  onChange={methods.onChangeFlag}
                />
              </V2Form>
            </>
          ),
        }}
      >
        <V2Table
          defaultColumns={defaultColumns}
          onFetch={loadData}
          hideColumnPlaceholder={true}
          filters={filters}
          rowKey='id'
          pagination={false}
          scroll={{ y: mainHeight - 64 - 42 - 56 }}
        />
      </V2Container>

      <EditOrCreateModal
        id={id}
        isEdit={isEdit}
        open={showModal}
        setOpen={setShowModal}
        refresh={() => setFilters({})}
      />
    </div>
  );
};

export default StoreMapConfig;
