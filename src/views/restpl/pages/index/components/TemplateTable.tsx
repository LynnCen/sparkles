import Table from '@/common/components/FilterTable';
import Operate from '@/common/components/Operate';
import { FormattingPermission, Permission } from '@/common/components/Operate/ts-config';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { FC, useState } from 'react';
import { ChooseCategoryModalInfo, CopyCategoryModalInfo } from '../ts-config';
import ChooseCategoryModal from './Modal/ChooseCategoryModal';
import CopyCategoryModal from './Modal/CopyCategoryModal';
import PriceConfigModal from './Modal/PriceConfigDrawer';
import ImportTemplateModal from './Modal/ImportTemplateModal';
import ChooseCategoryExportModal from './Modal/ChooseCategoryExportModal';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { refactorPermissions } from '@lhb/func';

const TemplateTable: FC<any> = ({ loadData, onSearch, params, setTemplateModalInfo }) => {
  const columns = [
    { key: 'id', title: '序号' },
    { key: 'name', title: '类目模板名称' },
    {
      key: 'resourcesType',
      title: '资源类型',
      render: (value, record) => {
        if (record.resourcesType === 0) {
          return '场地';
        }
        if (record.resourcesType === 1) {
          return '点位';
        }
        return '供给';
      },
    },
    {
      key: 'useType',
      title: '渠道',
      render: (value, record) => {
        if (record.useType === 0) {
          return '资源中心';
        }
        if (record.useType === 1) {
          return 'PMS';
        }
        if (record.useType === 2) {
          return 'LOCATION';
        }
        if (record.useType === 3) {
          return '客流宝';
        }
        if (record.useType === 4) {
          return 'KA';
        }
        return '未知';
      },
    },
    {
      key: 'permissions',
      title: '操作',
      width: 200,
      render: (value: Permission[], record) => {
        return (
          <Operate
            showBtnCount={5}
            operateList={refactorPermissions(value)}
            onClick={(btn: FormattingPermission) => methods[btn.func](record)}
          />
        );
      },
    },
  ];
  const [chooseCategoryModalInfo, setChooseCategoryModalInfo] = useState<ChooseCategoryModalInfo>({ visible: false });
  const [chooseCategoryExportModal, setChooseCategoryExportModal] = useState<ChooseCategoryModalInfo>({ visible: false }); // 选择模版导出弹窗数据
  const [copyCategoryModalInfo, setCopyCategoryModalInfo] = useState<CopyCategoryModalInfo>({ visible: false });
  const [priceConfigOpen, setPriceConfigOpen] = useState(false);
  const [templateId, setTemplateId] = useState<any>('');
  const [importTemplateModalData, setImportTemplateModalData] = useState<any>({
    visible: false,
  });// 导入模板弹窗数据
  const { parseResourceTypeName, ...methods } = useMethods({
    // 编辑
    handleUpdate(record: any) {
      setTemplateModalInfo({ ...record, visible: true });
    },
    // 删除
    handleDelete(record: any) {
      V2Confirm({
        onSure: (modal) => {
          post('/categoryTemplate/delete', { id: record.id }, { isMock: false, needHint: true }).then(() => {
            modal.destroy();
            onSearch();
          });
        },
        content: '此操作将永久删除该数据, 是否继续？'
      });
    },
    // 配置
    handleConfig(record: any) {
      setChooseCategoryModalInfo({
        resourceType: record.resourcesType,
        categoryTemplateId: record.id,
        visible: true,
        name: record.name,
        categoryId: record.categoryId,
        resourceTypeName: parseResourceTypeName(record),
        useType: record.useType,
      } as any);
    },
    // 复制
    handleCopy(record: any) {
      setCopyCategoryModalInfo({
        resourceType: record.resourcesType,
        categoryTemplateId: record.id,
        visible: true,
        name: record.name,
      });
    },
    // 价格配置
    handlePrice(record: any) {
      setTemplateId(record.id);
      setPriceConfigOpen(true);
    },
    // 导入
    handleImport(record: any) {
      setImportTemplateModalData({
        ...importTemplateModalData,
        visible: true,
        data: {
          ...record,
          templateId: record.id
        }
      });
    },
    // 导出
    handleExport(record: any) {
      setChooseCategoryExportModal({
        resourceType: record.resourcesType,
        categoryTemplateId: record.id,
        visible: true,
        name: record.name,
        categoryId: record.categoryId,
        resourceTypeName: parseResourceTypeName(record),
      } as any);
    },

    parseResourceTypeName(record: any) {
      if (record.resourcesType === 0) {
        return '场地';
      }
      if (record.resourcesType === 1) {
        return '点位';
      }
      return '供给';
    },
  });

  return (
    <>
      <Table rowKey='id' onFetch={loadData} pagination={true} columns={columns} filters={params} />
      <ChooseCategoryModal
        chooseCategoryModalInfo={chooseCategoryModalInfo}
        setChooseCategoryModalInfo={setChooseCategoryModalInfo}
      />
      <CopyCategoryModal
        copyCategoryModalInfo={copyCategoryModalInfo}
        setCopyCategoryModalInfo={setCopyCategoryModalInfo}
        onSearch={onSearch}
      />
      <PriceConfigModal
        templateId={templateId}
        open={priceConfigOpen}
        setOpen={setPriceConfigOpen}
      />
      <ImportTemplateModal
        modalData={importTemplateModalData}
        setImportTemplateModalData={setImportTemplateModalData}
        successCb={onSearch}
      />
      <ChooseCategoryExportModal
        modalData={chooseCategoryExportModal}
        setChooseCategoryExportModal={setChooseCategoryExportModal}
      />
    </>
  );
};

export default TemplateTable;
