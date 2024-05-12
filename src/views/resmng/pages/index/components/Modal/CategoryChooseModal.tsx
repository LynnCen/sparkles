import { getCategoryRes } from '@/common/api/category';
import { resTemplateList } from '@/common/api/template';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { useMethods } from '@lhb/hook';
import { urlParams } from '@lhb/func';
// import { recursionEach } from '@lhb/func';
import { Form, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { CategoryChooseModalProps, ResourceType } from '../../ts-config';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTreeSelect from '@/common/components/Form/V2FormTreeSelect/V2FormTreeSelect';
const CategoryChooseModal: React.FC<CategoryChooseModalProps> = ({
  categoryChooseModalInfo,
  setCategoryChooseModalInfo,
}) => {
  const [form] = Form.useForm();
  const [category, setCategory] = useState<any>([]);
  const [categoryName, setCategoryName] = useState();
  const { search } = useLocation();
  const { isKA } = urlParams(search) as any as { isKA?: string };

  const { loadData, parseTitle, onCancel, onSubmit } = useMethods({
    loadData: async () => {
      const result = await getCategoryRes({ resourcesType: categoryChooseModalInfo.resourceType });
      // recursionEach(result, 'childList', (item: any) => {
      //   if (item.childList && item.childList.length) {
      //     item.selectable = false;
      //   }
      // });
      setCategory(result);
    },

    parseTitle() {
      return ResourceType.PLACE === categoryChooseModalInfo.resourceType ? '请选择场地类目' : '请选择点位类目';
    },
    onCancel() {
      setCategoryChooseModalInfo({ ...categoryChooseModalInfo, visible: false, isKA });
      form.resetFields();
    },
    // 确定
    async onSubmit() {
      const { resourceType } = categoryChooseModalInfo;
      const values = await form.validateFields();
      const { categoryId } = values;
      const { objectList = [] } = await resTemplateList({
        resourcesType: resourceType,
        useType: isKA === 'true' || (categoryChooseModalInfo as any).isKA === 'true' ? 4 : 0
      });
      onCancel();
      if (Number(categoryChooseModalInfo.resourceType) === ResourceType.PLACE) {
        dispatchNavigate(`/resmng/detail?&resourceType=${resourceType}&categoryId=${categoryId}&categoryTemplateId=${objectList[0].id}&isKA=${isKA || (categoryChooseModalInfo as any).isKA}&categoryName=${categoryName}`);
      } else {
        dispatchNavigate(
          `/resmng/detail?&resourceType=${resourceType}&categoryId=${categoryId}&categoryTemplateId=${objectList[0].id}&isKA=${isKA || (categoryChooseModalInfo as any).isKA}&categoryName=${categoryName}&placeId=${categoryChooseModalInfo.placeId}`
        );
      }


      // form.validateFields().then(() => {
      //   resTemplateList({ resourcesType: categoryChooseModalInfo.resourceType, useType: 0 }).then((tplResult) => {
      //     if (Number(categoryChooseModalInfo.resourceType) === ResourceType.PLACE) {
      //       dispatchNavigate(
      //         `/resmng/detail?resourceType=${categoryChooseModalInfo.resourceType}&categoryId=${form.getFieldValue(
      //           'categoryId'
      //         )}&categoryTemplateId=${tplResult.objectList[0].id}&categoryName=${categoryName}`
      //       );
      //     } else {
      //       dispatchNavigate(
      //         `/resmng/detail?resourceType=${categoryChooseModalInfo.resourceType}&categoryId=${form.getFieldValue(
      //           'categoryId'
      //         )}&placeId=${categoryChooseModalInfo.placeId}&categoryTemplateId=${tplResult.objectList[0].id}&categoryName=${categoryName}`
      //       );
      //     }
      //     onCancel();
      //   });
      // });
    },
  });

  useEffect(() => {
    if (categoryChooseModalInfo.visible) {
      loadData();
    }
    // eslint-disable-next-line
  }, [categoryChooseModalInfo.visible]);

  return (
    <Modal width={388} title={parseTitle()} open={categoryChooseModalInfo.visible} onOk={onSubmit} onCancel={onCancel}>
      <V2Form form={form}>
        <V2FormTreeSelect
          label='请选择类目'
          name='categoryId'
          placeholder='请选择类目'
          treeData={category}
          rules={[{ required: true, message: '请选择类目' }]}
          onChange={(_, option) => {
            setCategoryName(option[0]);
          }}
          config={{
            fieldNames: { label: 'name', value: 'id', children: 'childList' },
          }}
        />
      </V2Form>
    </Modal>
  );
};
export default CategoryChooseModal;
