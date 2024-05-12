import { FC, useState } from 'react';
import styles from './entry.module.less';
import cs from 'classnames';
import V2Table from '@/common/components/Data/V2Table';
import { useMethods } from '@lhb/hook';
import { Space, Modal, Typography } from 'antd';
import Operate from '@/common/components/Operate';
import { post } from '@/common/request';
import { downloadFile, matchQuery, refactorPermissions } from '@lhb/func';
import ImportTemplateModal from '@/views/restpl/pages/index/components/Modal/ImportTemplateModal';
import dayjs from 'dayjs';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { setStorage } from '@lhb/cache';


const StoreTemplateList: FC<any> = ({ params, onSearch, setEditDraw, setOperateStoreTemplate, mainHeight, setOperateUploadExcel }) => {
  const tenantId = matchQuery(location.search, 'id'); // 租户id
  const isDemo = location.pathname.includes('flowEngine'); // 是否是demo页面
  const { Link } = Typography;
  const [importTemplateModalData, setImportTemplateModalData] = useState<any>({
    visible: false
  });


  /* methods */
  const methods = useMethods({
    async fetchData(params) {
      const objectList = await post('/dynamic/template/lists', params, { proxyApi: '/blaster' });
      return {
        dataSource: objectList,
      };
    },

    handleEdit(record) {
      setOperateStoreTemplate({ visible: true, ...record });
    },

    handleConfig(record) {
      setEditDraw({ visible: true, name: record.templateName, templateId: record.templateId, id: record.id });
    },
    handleOpenStop(record) {
      Modal.confirm({
        title: '操作',
        content: `是否${record.enable ? '停用' : '启用'}该模版？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          post(
            '/dynamic/template/enable',
            { templateId: record.templateId, id: record.id, enable: record.enable ? 0 : 1 },
            { proxyApi: '/blaster' }
          ).then(() => {
            onSearch();
          });
        },
      });
    },
    handleUploadExcel(record) {
      setOperateUploadExcel({ visible: true, id: record.id });
    },

    handleLink(url) {
      downloadFile({
        url
      });
    },
    handleExport(record:any) {
      const params:any = {
        categoryId: record?.categoryId || null,
        templateId: record.templateId
      };
      // https://yapi.lanhanba.com/project/321/interface/api/54515
      post('/categoryTemplate/export', params).then(({ url }) => {
        const downLoadName = `${record.templateName}-${dayjs().format('YYYYMMDDhhmm')}.json`;

        downloadFile({
          url: `${url}?attname=${downLoadName}`,
        });
      });

    },
    handleImport(record:any) {
      setImportTemplateModalData({
        ...importTemplateModalData,
        visible: true,
        data: record
      });
    },
    async handleCreateFlow(record:any) {
      const params: any = {
        id: record.id,
        extraData: record?.extraData || { type: 1 },
        appId: 1
      };

      const getFields = async () => {
        // https://yapi.lanhanba.com/project/355/interface/api/55271
        const values = await post('/form/fields', params, { proxyApi: '/workflow-api', });
        return values;
      };

      const getConditionFields = async () => {
        // https:// yapi.lanhanba.com/project/355/interface/api/61627
        const values = await post('/form/conditionFields', params, { proxyApi: '/workflow-api', });
        return values;
      };
      const [fields, conditionFields] = await Promise.all([getFields(), getConditionFields()]);
      setStorage('formFields', fields);
      setStorage('formConditionFields', conditionFields);
      const urlParams = {
        appId: 1,
        tenantId,
        isDemo,
        dynamicRelationId: record.id,
      };
      dispatchNavigate(`/flowEngine/edit?params=${decodeURI(JSON.stringify(urlParams))}`);
    },
    handleEditFlow(record:any) {
      const params = {
        appId: 1,
        tenantId,
        id: record.approvalFlowId,
        isDemo,
        dynamicRelationId: record.id,
      };
      dispatchNavigate(`/flowEngine/edit?params=${decodeURI(JSON.stringify(params))}`);
    },
  });

  // 接口获取columns
  const defaultColumns: any[] = [
    { key: 'id', title: '模板ID', width: 80, dragChecked: true },
    {
      key: 'templateName',
      title: '模版名',
      width: 180,
      dragChecked: true,
      ellipsis: true,
      render: (_, record) => record.templateName,
    },
    { key: 'brandName', title: '品牌', width: 180, dragChecked: true },
    { key: 'shopCategoryName', title: '类型', width: 180, dragChecked: true },
    { key: 'approvalFlowName', title: '审批名称', width: 180, dragChecked: true },
    { key: 'approvalFlowId', title: '流程ID', width: 180, dragChecked: true },
    { key: 'url', title: '模版Excel', width: 180, dragChecked: true, render: (text) => (text ? <Link onClick={() => methods.handleLink(text)}>{text}</Link> : '-'), },
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
          { event: 'uploadExcel', name: '模版Excel' },
          { event: 'export', name: '导出' },
        ];
        if (!record.enable) { // 未启用的模板，显示导入按钮
          operateList.push({ event: 'import', name: '导入' });
        }

        // 如果有审批模板id，显示编辑审批按钮
        if (record.approvalFlowId) {
          operateList.push({ event: 'editFlow', name: '编辑审批' });
        } else {
          // 未绑定审批流程的模板，显示创建审批按钮
          operateList.push({ event: 'createFlow', name: '创建审批' });
        }

        return record.code === 'dynamic' ? (
          <Operate
            showBtnCount={4}
            operateList={refactorPermissions(operateList)}
            onClick={(btn: any) => methods[btn.func](record)}
          />
        ) : null;
      }

    },
  ];

  return (
    <>
      <V2Table
      // ref={tableRef}
        pagination={false}
        defaultColumns={defaultColumns}
        tableSortModule='locSAASLocationTenantDetailStoreTemplateConfig'
        onFetch={methods.fetchData}
        filters={params}
        className={cs(styles.tableList)}
        rowKey='id'
        // 勿删! 64：分页模块总大小、48分页模块减去paddingBottom的值、42是table头部
        scroll={{ x: 'max-content', y: mainHeight - 42 }}
      />
      <ImportTemplateModal
        modalData={importTemplateModalData}
        setImportTemplateModalData={setImportTemplateModalData}
        successCb={onSearch}
      />
    </>
  );
};

export default StoreTemplateList;
