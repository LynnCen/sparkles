/* 部门管理表格内容 */
import { FC, useState } from 'react';
import { Modal } from 'antd';
import { valueFormat } from '@/common/utils/ways';
import { OperateButtonProps, Permission } from '@/common/components/Operate/ts-config';
import { immediatelyAnalysis } from '@/common/api/footprinting';
import styles from '../index.module.less';
import Table from '@/common/components/FilterTable';
import Operate from '@/common/components/Operate';
import ModalDraw from './ModalDraw';
import { useClientSize, useMethods } from '@lhb/hook';
import { refactorPermissions } from '@lhb/func';

const defaultRender = { width: 130, render: (value: number | string) => valueFormat(value) };

const TableList: FC<any> = ({ searchParams, loadData, updateData }) => {
  const scrollHeight = useClientSize().height - 280;
  const [modalData, setModalData] = useState({
    visible: false,
    id: '' // 踩点任务id
  });
  const columns = [
    { key: 'projectCode', title: '任务码', fixed: 'left', width: 140 },
    { title: '需求品牌', key: 'demandBrandName', ...defaultRender },
    { title: '所属行业', key: 'industryName', ...defaultRender },
    {
      key: 'area',
      title: '需求城市',
      width: 120,
      render: (value: any, record) => (
        <span>{ record.province }{ record.city }{ record.district }</span>
      )
    },
    { title: '店铺类型', key: 'shopCategoryName', ...defaultRender },
    { title: '店铺位置', key: 'address', ...defaultRender },
    { title: '所属场地', key: 'placeName', ...defaultRender },
    { title: '场地类型', key: 'placeCategoryName', ...defaultRender },
    { title: '详细地址', key: 'placeAddress', ...defaultRender },
    { title: '踩点状态', key: 'processName', ...defaultRender },
    { key: 'checkPointStatusName', title: '分析规则是否已设置', width: 200 },
    {
      key: 'permissions',
      fixed: 'right',
      title: '操作',
      width: 200,
      render: (value: Permission, record) => (
        <Operate
          operateList={refactorPermissions(value)}
          onClick={(btn: OperateButtonProps) => methods[btn.func || ''](record)}
        />
      ),
    },
  ];

  const { ...methods } = useMethods({
    handleCheckPointsSet(record: any) { // 设置规则
      const { id } = record;
      setModalData({
        visible: true,
        id
      });
    },
    handleProjectAnalysis(record: any) { // 立即分析
      const { id } = record;
      Modal.confirm({
        title: `立即分析`,
        content: `确认立即分析吗`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          immediatelyAnalysis({ id }).then(() => {
            updateData(); // 更新列表
          });
        },
      });
    }
  });

  return (
    <>
      <Table
        rowKey='projectCode'
        scroll={{ x: 'max-content', y: scrollHeight }}
        filters={searchParams}
        className={styles.tableCon}
        onFetch={loadData}
        columns={columns}
      />
      <ModalDraw
        modalData={modalData}
        updateData={updateData}
        modalHandle={() => setModalData({ visible: false, id: '' })}/>
    </>
  );
};

export default TableList;
