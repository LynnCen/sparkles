/**
 * @Description 选择导出模版的弹窗
 */
import React, { useEffect, useState } from 'react';
import { Form, Modal, Tag } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTreeSelect from '@/common/components/Form/V2FormTreeSelect/V2FormTreeSelect';
import { getCategoryRes } from '@/common/api/category';
import { useMethods } from '@lhb/hook';
import { downloadFile, recursionEach } from '@lhb/func';
import { post } from '@/common/request';
import dayjs from 'dayjs';
import { ChooseCategoryExportModalProps } from '../../ts-config';

const ChooseCategoryExportModal: React.FC<ChooseCategoryExportModalProps> = ({
  modalData,
  setChooseCategoryExportModal,
}) => {
  const [form] = Form.useForm();
  const [treeData, setTreeData] = useState([]);
  const [selected, setSelected] = useState<any>({});
  const { visible } = modalData;

  const { onOk, onCancel, loadData, onSelect, refactorName } = useMethods({
    loadData: async (params: any) => {
      const result = await getCategoryRes(params);
      recursionEach(result, 'childList', (item: any) => {
        item.refactorName = refactorName(item);
      });
      setTreeData(result || []);
    },
    refactorName(item) {
      if (item.configurated) {
        return (
          <>
            {item.name}
            <Tag key={item.id} color='green' style={{ marginLeft: '10px' }}>
              已配置
            </Tag>
          </>
        );
      }
      return (
        <>
          {item.name}
          <Tag key={item.id} color='red' style={{ marginLeft: '10px' }}>
            未配置
          </Tag>
        </>
      );
    },
    onCancel() {
      setChooseCategoryExportModal({ visible: false });
    },
    onOk() {
      this.onCancel();
      const params:any = {
        categoryId: selected.id,
        templateId: modalData.categoryTemplateId
      };
      // https:// yapi.lanhanba.com/project/321/interface/api/54515
      post('/categoryTemplate/export', params).then(({ url }) => {
        const downLoadName = `${modalData.name}-${dayjs().format('YYYYMMDDhhmm')}.json`;

        downloadFile({
          url: `${url}?attname=${downLoadName}`,
        });
      });
    },
    onSelect(_, node) {
      setSelected({ ...node, parentCategoryId: node.parentId ? node.parentId : -1 });
    },
  });
  useEffect(() => {
    if (modalData.visible) {
      loadData({
        resourcesType: modalData.resourceType === 0 ? 0 : 1,
        categoryTemplateId: modalData.categoryTemplateId,
      });
    }
    // eslint-disable-next-line
  }, [modalData.visible]);

  useEffect(() => {
    if (!visible) {
      return;
    }
    form.resetFields();
  }, [visible]);

  return (
    <Modal
      title={'选择要导出的类目'}
      destroyOnClose
      open={modalData.visible}
      onCancel={onCancel}
      onOk={onOk}
      width={336}
    >
      <V2Form form={form}>
        <V2FormTreeSelect
          label='类目'
          name='categoryId'
          treeData={treeData}
          placeholder='选择要导出的类目'
          formItemConfig={{
            rules: [{ required: true, message: '必须选择一项' }],
          }}
          config={{
            fieldNames: {
              label: 'refactorName',
              value: 'id',
              children: 'childList',
            },
            onSelect: onSelect,
            treeDefaultExpandAll: true,
          }}
        />
      </V2Form>
    </Modal>
  );
};
export default ChooseCategoryExportModal;
