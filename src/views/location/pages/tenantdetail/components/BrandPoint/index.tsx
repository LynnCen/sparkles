/**
 * @Description 品牌网点数据配置
 */
import V2Container from '@/common/components/Data/V2Container';
import styles from './index.module.less';
import { useState } from 'react';
import { Button, message } from 'antd';
import V2Table from '@/common/components/Data/V2Table';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import NewBrandDrawer from './NewBrandDrawer';

import { useMethods } from '@lhb/hook';
import { deleteBrand, getBrandList, setBrandSelf } from '@/common/api/location';
import IconFont from '@/common/components/IconFont';
import V2Operate from '@/common/components/Others/V2Operate';
import { refactorPermissions } from '@lhb/func';
const BrandPoint:any = ({
  tenantId,
  mainHeight
}) => {
  const [innerMainHeight, setInnerMainHeight] = useState<number>(0);
  const [params, setParams] = useState<any>({});// 刷新列表
  const [newBrandVisible, setNewBrandVisible] = useState<boolean>(false);
  const methods = useMethods({
    async fetchData(params) {
      const data = await getBrandList({ tenantId, ...params });
      return {
        dataSource: data,
      };
    },
    // 删除
    handleDelete(record) {
      ConfirmModal({
        content: `确定删除该品牌信息`,
        async onSure() {
          const success = await deleteBrand({ id: record.id });
          if (success) {
            message.success('删除成功');
            setParams({});
          }
        }
      });
    },
    // 取消本品牌
    async handleCancel(record) {
      await setBrandSelf({ id: record.id, isSelf: 0 });
      setParams({});
    },
    // 设为本品牌
    async handleSet(record) {
      await setBrandSelf({ id: record.id, isSelf: 1 });
      setParams({});
    }
  });
  const getOperateList = (isSelf:Number) => {
    if (isSelf === 0) {
      return [
        { event: 'delete', name: '删除' },
        { event: 'set', name: '设为本品牌' },
      ];
    }
    if (isSelf === 1) {
      return [
        { event: 'delete', name: '删除' },
        { event: 'cancel', name: '取消本品牌' },
      ];
    }
    return [];
  };
  const defaultColumns: any[] = [
    { key: 'name', title: '品牌名称', width: 120, dragChecked: true,
      render: (value, record) =>
        <div>
          <span className='mr-8'>{value}</span>
          {record.isSelf === 1 && <IconFont iconHref='icon-ic_benpinpai'/> }
        </div>
    },
    { key: 'brandId', title: '品牌ID', width: 86, dragChecked: true, },
    {
      key: 'logo',
      title: '品牌logo',
      width: 89,
      dragChecked: true,
      render: (value) =>
        value ? (
          <div className={styles.logoBorder}>
            <img src={value} />
          </div>
        ) : (
          <span className={styles.noLogo}>-</span>
        ),
    },
    {
      key: 'industryShowName',
      title: '所属行业',
      width: 116,
      dragChecked: true,
      render: (value) => {
        return value === null ? '-' : value;
      },
    },
    {
      key: 'shopCount',
      title: '网点数量',
      width: 100,
      dragChecked: true,
      render: (value) => {
        return value === null ? '-' : value;
      },
    },
    {
      key: 'updateTime',
      title: '更新日期',
      width: 114,
      dragChecked: true,
      sorter: true,
      defaultSortOrder: 'descend',
      render: (value) => {
        return value === null ? '-' : value;
      },
    },
    {
      title: '操作',
      key: 'permissions',
      width: 142,
      dragChecked: true,
      render: (_, record) => (
        <V2Operate
          operateList={refactorPermissions(getOperateList(record.isSelf))}
          onClick={(btn: any) => methods[btn.func](record)}
        />
      ),
    },
  ];
  return (
    <div className={styles.container}>
      <V2Container
        style={{ height: mainHeight }}
        emitMainHeight={(h) => setInnerMainHeight(h)}
        extraContent={{
          top: <Button type='primary' className='mb-16' onClick={() => setNewBrandVisible(true)}>
          添加品牌
          </Button>
        }}
      >
        <V2Table
          pagination={false}
          defaultColumns={defaultColumns}
          tableSortModule='locSAASLocationTenantDetailBrandPoint'
          onFetch={methods.fetchData}
          filters={params}
          className={styles.tableList}
          rowKey='id'
          // 勿删! 64：分页模块总大小、48分页模块减去paddingBottom的值、42是table头部
          scroll={{ y: innerMainHeight - 48 - 42 }}
          hideColumnPlaceholder
          defaultSorter= {{
            order: 'desc',
            orderBy: 'updateTime'
          }}
        />
      </V2Container>
      <NewBrandDrawer
        visible={newBrandVisible}
        setVisible={setNewBrandVisible}
        tenantId={tenantId}
        setParams={setParams}
      />
    </div>
  );
};
export default BrandPoint;
