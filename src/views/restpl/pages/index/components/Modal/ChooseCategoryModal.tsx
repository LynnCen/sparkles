import React, { useEffect, useState } from 'react';
import { Form, Modal, Tag } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTreeSelect from '@/common/components/Form/V2FormTreeSelect/V2FormTreeSelect';
import { getCategoryRes } from '@/common/api/category';
import { useMethods } from '@lhb/hook';
import { recursionEach } from '@lhb/func';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { ChooseCategoryModalProps } from '../../ts-config';

const ChooseCategoryModal: React.FC<ChooseCategoryModalProps> = ({
  chooseCategoryModalInfo,
  setChooseCategoryModalInfo,
}) => {
  const [form] = Form.useForm();
  const [treeData, setTreeData] = useState([]);
  const [selected, setSelected] = useState<any>({});
  const { visible } = chooseCategoryModalInfo;

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
      setChooseCategoryModalInfo({ visible: false });
    },
    onOk() {
      this.onCancel();
      dispatchNavigate(
        `/restpl/config?categoryId=${selected.id}&parentCategoryId=${selected.parentCategoryId}&categoryTemplateId=${chooseCategoryModalInfo.categoryTemplateId}&categoryName=${selected.name}&resourceTypeName=${chooseCategoryModalInfo.resourceTypeName}&tplName=${chooseCategoryModalInfo.name}&useType=${chooseCategoryModalInfo.useType}`
      );
    },
    onSelect(_, node) {
      setSelected({ ...node, parentCategoryId: node.parentId ? node.parentId : -1 });
    },
  });
  useEffect(() => {
    if (chooseCategoryModalInfo.visible) {
      loadData({
        resourcesType: chooseCategoryModalInfo.resourceType === 0 ? 0 : 1,
        categoryTemplateId: chooseCategoryModalInfo.categoryTemplateId,
      });
    }
    // eslint-disable-next-line
  }, [chooseCategoryModalInfo.visible]);

  useEffect(() => {
    if (!visible) {
      return;
    }
    form.resetFields();
  }, [visible]);

  return (
    <Modal
      title={'选择要配置的类目'}
      destroyOnClose
      open={chooseCategoryModalInfo.visible}
      onCancel={onCancel}
      onOk={onOk}
      width={336}
    >
      <V2Form form={form}>
        <V2FormTreeSelect
          label='类目'
          name='categoryId'
          treeData={treeData}
          placeholder='选择要配置的类目'
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
export default ChooseCategoryModal;
