import { FC, useState } from 'react';
import V2Table from '@/common/components/Data/V2Table';
import V2Operate from '@/common/components/Others/V2Operate';
import { Space, Modal } from 'antd';
import { useMethods } from '@lhb/hook';
import { isArray, refactorPermissions } from '@lhb/func';
import styles from '../entry.module.less';
import cs from 'classnames';
import { enableFranchiseeTemplate, franchiseeTemplateList } from '@/common/api/location';

import FranchiseeDynamicTemplate from '../../FranchiseeDynamicTemplate';

const TemplateList: FC<any> = ({
  params,
  onSearch,
  setOperateStoreTemplate,
  mainHeight
}) => {
  // 动态模板
  const [templateDraw, setTemplateDraw] = useState<any>({
    open: false,
    data: null
  });
  /* methods */
  const methods = useMethods({
    async fetchData(params) {
      const objectList = await franchiseeTemplateList(params);
      return {
        dataSource: isArray(objectList) ? objectList : [],
        count: isArray(objectList) ? objectList.length : 0,
      };
    },

    handleEdit(record) {
      setOperateStoreTemplate({ visible: true, ...record });
    },

    handleConfig(record) {
      setTemplateDraw({
        open: true,
        data: {
          // ...record,
          name: record.templateName,
          templateId: record.templateId, // 模板id
        }
      });
    },
    handleOpenStop(record) {
      Modal.confirm({
        title: '操作',
        content: `是否${record.enable ? '停用' : '启用'}该模版？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          enableFranchiseeTemplate({
            id: record.id,
            enable: record.enable ? 0 : 1
          }).then(() => {
            onSearch();
          });
        },
      });
    },
  });

  const defaultColumns: any[] = [
    { key: 'id', title: '模板ID', width: 100, dragChecked: true },
    {
      key: 'templateName',
      title: '模版名',
      width: 220,
      dragChecked: true,
      render: (_, record) => record.templateName,
    },
    {
      key: 'enable',
      title: '状态',
      width: 180,
      dragChecked: true,
      render: (value) => {
        return (
          <Space>
            <div className={cs(styles.point, value ? styles.open : styles.unopen)}></div>
            <div>{value ? '已启用' : '已停用'}</div>
          </Space>
        );
      },
    },

    {
      key: 'updatedAt',
      title: '最近修改时间',
      width: 220,
      dragChecked: true,
      render: (value, row) => {
        return value ? (
          <Space>
            <div>{row.accountName}</div>
            <div style={{ marginLeft: '8px' }}>{value}</div>
          </Space>
        ) : (
          '-'
        );
      },
    },
    {
      title: '操作',
      key: 'permissions',
      width: 220,
      dragChecked: true,
      fixed: 'right',
      render: (_, record) => {
        const operateList:any[] = [
          { event: 'edit', name: '编辑' },
          { event: 'config', name: '配置' },
          { event: 'openStop', name: record.enable ? '停用' : '启用' },
        ];
        return (
          <V2Operate
            showBtnCount={4}
            operateList={refactorPermissions(operateList)}
            onClick={(btn: any) => methods[btn.func](record)}
          />
        );
      }

    },
  ];

  return (
    <>
      <V2Table
        pagination={false}
        defaultColumns={defaultColumns}
        hideColumnPlaceholder
        onFetch={methods.fetchData}
        filters={params}
        rowKey='id'
        // 勿删! 64：分页模块总大小、48分页模块减去paddingBottom的值、42是table头部
        scroll={{ x: 'max-content', y: mainHeight - 42 }}
      />

      {/* 动态模板抽屉 */}
      <FranchiseeDynamicTemplate
        drawData={templateDraw}
        close={() => setTemplateDraw({
          open: false,
          data: null
        })}
      />
    </>
  );
};

export default TemplateList;
