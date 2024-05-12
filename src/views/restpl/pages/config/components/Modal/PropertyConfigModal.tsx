import FormInput from '@/common/components/Form/FormInput';
import FormRadio from '@/common/components/Form/FormRadio';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { Button, Form, message, Modal, Spin } from 'antd';
import { v4 } from 'uuid'
import React, { useEffect, useState } from 'react';
import { PropertyConfigModalProps } from '../../ts-config';
import FormInputNumber from '@/common/components/Form/FormInputNumber';
import FormSelect from '@/common/components/Form/FormSelect';
import { PageContainer } from '@/common/components';
import DataLinkage from '../DataLinkage';
import { PlusOutlined } from '@ant-design/icons';
import { resTemplateDetail } from '@/common/api/template';
import { isNotEmptyAny, isObject, isUndef } from '@lhb/func';
import { ControlType } from '@/common/enums/control';
import DynamicControl from './DynamicControl';
import DynamicSubFormTable, { SubFormDataType } from './DynamicSubFormTable/DynamicSubFormTable';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const DefaultTopSortNum = 1;

const PropertyConfigModal: React.FC<PropertyConfigModalProps> = ({
  propertyConfigModalInfo,
  setPropertyConfigModalInfo,
  onSearch,
}) => {
  const { templateRestriction, controlType, topSortNum } = propertyConfigModalInfo;
  const [form] = Form.useForm();
  const onTop = Form.useWatch('onTop', form);
  const [propertyClassifications, setPropertyClassifications] = useState<any[]>([]); // 属性分组
  const [loading, setLoading] = useState<boolean>(false);
  const [properties, setProperties] = useState<any>([]); // 当前模板下所有属性
  const [propertyOptionList, setPropertyOptionList] = useState<any>([]); // 当前属性的optionList，只对单选、多选有效，组件联动编辑用
  const [subFormData, setSubFormData] = useState<SubFormDataType[]>([]); // 子表单设置

  const showRelations = controlType === ControlType.SINGLE_RADIO.value || controlType === ControlType.CHECK_BOX.value; // 展示关联组件设定

  const { onCancel, onOk } = useMethods({
    onCancel() {
      setPropertyConfigModalInfo({ ...propertyConfigModalInfo, visible: false });
    },
    onOk() {
      form.validateFields().then((values: any) => {
        if (!subFormData.length && controlType === ControlType.SUB_FORM.value) {
          message.error('请添加字段！')
        } else {

          let inputRelations = values.activeLinkageRelations;
          const templateRestrictionProps: any = {}; // 模板限制属性
          let formConfigList: any = [];
          let postRelations: any = [];
          if (Array.isArray(inputRelations)) {
            inputRelations = inputRelations.filter(itm => isNotEmptyAny(itm) && !isUndef(itm.value) && isNotEmptyAny(itm.relationsComponent));

            inputRelations.forEach(({ value, relationsComponent }) => {
              Array.isArray(relationsComponent) && relationsComponent.forEach(rlt => {
                postRelations.push({ value, relationsComponent: rlt });
              });
            })
          }

          if (isNotEmptyAny(postRelations)) {
            templateRestrictionProps.activeLinkageRelations = postRelations;
          }

          if (values.templateRestriction && isObject(values.templateRestriction)) {
            Object.assign(templateRestrictionProps, values.templateRestriction);
          }

          // 子表单
          if (subFormData.length && controlType === ControlType.SUB_FORM.value) {
            // 不管历史排序，都将最后要生成的排序添加索引传给后端做回显的排序控制
            formConfigList = subFormData.map((subForm: any, index) => {
              subForm.sortNum = index;
              return subForm;
            })
          }

          const params = {
            ...propertyConfigModalInfo,
            ...values,
            templateRestriction: JSON.stringify(templateRestrictionProps),
            formConfigList
          };
          delete params.visible;
          delete params.activeLinkageRelations;

          const url = '/propertyGroup/saveProperty';
          post(url, params, true).then((success) => {
            message.success('编辑配置成功');
            if (success) {
              onCancel();
              onSearch?.();
            }
          });
        }
      });
    },
  });

  // 获取属性分组列表
  const getPropertyClassificationGrops = async (categoryTemplateId?: number, categoryId?: number) => {
    setLoading(true);
    // /api/propertyGroup/group/list
    /** https://yapi.lanhanba.com/mock/321/api/propertyGroup/group/list */
    const options = await post('/propertyGroup/group/list', { categoryTemplateId, categoryId });
    setPropertyClassifications(options);
    setLoading(false);
  };

  const getProperties = async () => {
    const { propertyGroupVOList } = await resTemplateDetail({
      categoryId: propertyConfigModalInfo.categoryId,
      categoryTemplateId: propertyConfigModalInfo.categoryTemplateId
    })

    const propertyConfigList = propertyGroupVOList.reduce((prev: any, next: any) => {
      // @ts-ignore
      return [...prev, ...next.propertyConfigList]
    }, []);

    setProperties(propertyConfigList.filter(itm => itm.propertyId !== propertyConfigModalInfo.propertyId)); // 从关联属性项列表中，去掉当前弹框正在编辑的属性

    if (propertyConfigModalInfo.propertyId) {
      const arr = propertyConfigList.filter((itm: any) => itm.propertyId === propertyConfigModalInfo.propertyId);
      if (arr.length) {
        const opts = arr[0].propertyOptionList;
        setPropertyOptionList(opts || []);
      }
    }
  }

  const listStyle = {
    maxHeight: 250,
    overflow: 'auto'
  }


  useEffect(() => {
    if (!propertyConfigModalInfo.visible) {
      form.resetFields();
      setSubFormData([])
      return;
    }
    // 获取属性分组
    getProperties();
    getPropertyClassificationGrops(propertyConfigModalInfo.categoryTemplateId, propertyConfigModalInfo.categoryId);
    form.setFieldsValue({
      ...propertyConfigModalInfo,
      topSortNum: topSortNum || DefaultTopSortNum,
    });

    // 组件关联设置
    let relateDataObj = {}; // 关联不为空时才设置
    if (templateRestriction) {
      const tmpRestrictionObj = JSON.parse(templateRestriction);
      form.setFieldsValue({ templateRestriction: tmpRestrictionObj }); // 限制属性字段编辑回显

      if (Array.isArray(tmpRestrictionObj.activeLinkageRelations) && tmpRestrictionObj.activeLinkageRelations.length) {
        tmpRestrictionObj.activeLinkageRelations.forEach(({ value, relationsComponent }) => {
          if (!relateDataObj[value]) {
            relateDataObj[value] = [relationsComponent];
          } else {
            if (Array.isArray(relateDataObj[value]) && !relateDataObj[value].includes(relationsComponent)) {
              relateDataObj[value].push(relationsComponent);
            }
          }
        });
      }
    }

    const relateData = Object.keys(relateDataObj).length ? Object.keys(relateDataObj).map(key => ({
      value: Number(key),
      relationsComponent: relateDataObj[key],
    })) : [{ value: undefined, relationsComponent: undefined }];

    form.setFieldValue('activeLinkageRelations', relateData);

    // 子表单项
    // TODO: 有时间可以优化下，不应该在 form 里维护一组state
    if (propertyConfigModalInfo.formConfigList && propertyConfigModalInfo.formConfigList.length) {
      const _formConfigList = propertyConfigModalInfo.formConfigList.map(item => { return { rowKey: v4(), ...item } })
      setSubFormData(_formConfigList)
    }

    // eslint-disable-next-line
  }, [propertyConfigModalInfo.visible]);

  return (
    <Modal title='修改属性配置' open={propertyConfigModalInfo.visible} onOk={onOk} onCancel={onCancel} destroyOnClose>
      <Form {...layout} form={form}>
        <FormSelect
          label='所属分组'
          name='categoryPropertyGroupId'
          placeholder='请选择所属分组'
          options={propertyClassifications}
          rules={[{ required: true, message: '请选择所属分组' }]}
          config={{
            fieldNames: {
              label: 'name',
              value: 'id'
            },
            showSearch: true,
            notFoundContent: loading ? <Spin size='small' /> : undefined,
            filterOption: (input, option) =>
              (option?.name ?? '' as any).toLowerCase().includes(input.toLowerCase())
          }}
        />
        <FormInput
          label='属性名称'
          name='name'
          config={{
            disabled: true
          }}
          rules={[{ required: true, message: '请输入属性名称' }]}
          maxLength={20}
        />
        <FormRadio
          label='详情页置顶'
          name='onTop'
          formItemConfig={{
            style: { width: '100%' },
          }}
          rules={[{ required: true, message: '请选择详情页置顶' }]}
          config={{
            options: [
              { value: 1, label: '置顶' },
              { value: 0, label: '不置顶' },
            ],
          }}
        />
        {
          !!onTop && <FormInputNumber
            initialValue={DefaultTopSortNum}
            label='置顶排序' name='topSortNum' placeholder='请输入排序值'
            config={{
              min: DefaultTopSortNum,
              precision: 0
            }}
          />
        }
        <DynamicControl controlType={controlType} />
        {!!showRelations && <PageContainer title='关联显示配置' noMargin={true}>
          <Form.List
            name='activeLinkageRelations'>
            {(fields, { add, remove }) => (
              <>
                <div style={listStyle}>
                  {fields.map((field, index) => (

                    <Form.Item key={index} name={field.name} wrapperCol={{ span: 24 }}>
                      <DataLinkage
                        options={propertyOptionList}
                        properties={properties}
                        disabled={false}
                        onRemove={() => remove(field.name)} />
                    </Form.Item>

                  ))}
                </div>
                <Form.Item wrapperCol={{ span: 24 }}>
                  <Button
                    block
                    style={{ color: '#006AFF', width: 'calc(100% - 22px)' }}
                    type='dashed'
                    onClick={() => add()}
                    icon={<PlusOutlined />}>
                    添加规则
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </PageContainer>
        }

        {controlType && controlType === ControlType.SUB_FORM.value &&
          <DynamicSubFormTable
            csName='templateRestriction'
            subFormData={subFormData}
            setSubFormData={setSubFormData}
            propertyConfigId={propertyConfigModalInfo.id} // 父级子表单的 id
          />}
      </Form>
    </Modal>
  );
};
export default PropertyConfigModal;
