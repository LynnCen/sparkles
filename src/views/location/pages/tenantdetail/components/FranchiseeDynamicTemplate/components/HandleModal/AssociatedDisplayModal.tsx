/**
 * @Description 关联显示
 * 从src/views/location/pages/tenantdetail/components/StoreTemplateConfig/Modal/LinkDisplayConfig.tsx拷贝过来的
 * TODO 代码优化
 */
import { FC, useEffect, useRef, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { Button, Form, Modal } from 'antd';
import { getRestriction } from '../../ways';
import { PlusOutlined } from '@ant-design/icons';
import { isArray, isNotEmptyAny, isUndef } from '@lhb/func';
import { dynamicTemplateUpdateProperty, dynamicTemplateDetail } from '@/common/api/location';
import V2Form from '@/common/components/Form/V2Form';
import DataLinkage from '@/views/restpl/pages/config/components/DataLinkage/index';

const AssociatedDisplayModal: FC<any> = ({
  // linkDisplayConfig,
  // setLinkDisplayConfig,
  // loadData,
  templateId,
  modalData,
  loadData,
  close,
}) => {
  const { open, data } = modalData;
  const templateRestriction = getRestriction(data);
  const formListRef = useRef<any>(null);
  const [form] = Form.useForm();
  const [properties, setProperties] = useState<any>([]); // 当前模板下所有属性
  const [propertyOptionList, setPropertyOptionList] = useState<any>([]); // 当前属性的optionList，只对单选、多选有效，组件联动编辑用
  const [fields, setFields] = useState<any>([]);

  const { onCancel, onOk } = useMethods({
    onCancel() {
      close && close();
      form.resetFields();
    },
    onOk() {
      form.validateFields().then((values: any) => {
        let inputRelations = values.activeLinkageRelations;

        const postRelations: any = [];
        if (Array.isArray(inputRelations)) {
          inputRelations = inputRelations.filter(itm => isNotEmptyAny(itm) && !isUndef(itm.value) && isNotEmptyAny(itm.relationsComponent));

          inputRelations.forEach(({ value, relationsComponent }) => {
            Array.isArray(relationsComponent) && relationsComponent.forEach(rlt => {
              postRelations.push({ value, relationsComponent: rlt });
            });
          });
        }

        const updateTemplateRestriction = templateRestriction;
        if (isNotEmptyAny(postRelations)) {
          updateTemplateRestriction.activeLinkageRelations = postRelations;
        } else {
          delete updateTemplateRestriction.activeLinkageRelations;
        }
        const params = {
          templateId,
          propertyConfigRequestList: [{
            // ...linkDisplayConfig,
            ...data,
            ...values,
            // templateRestriction: isNotEmptyAny(postRelations) ? JSON.stringify({ ...JSON.parse(templateRestriction || '{}'), activeLinkageRelations: postRelations }) : templateRestriction
            templateRestriction: JSON.stringify(updateTemplateRestriction)
          }]

        };
        delete params.propertyConfigRequestList[0].visible;
        delete params.propertyConfigRequestList[0].activeLinkageRelations;

        dynamicTemplateUpdateProperty(params).then((success) => {
          if (!success) return;
          onCancel();
          loadData();
        });
      });
    },
  });

  const handleHeight = () => {
    setFields(form.getFieldValue('activeLinkageRelations'));
  };

  // 添加规则后默认跳到最底部
  useEffect(() => {
    if (isArray(fields) && fields.length > 0) {
      const dom = formListRef?.current;
      dom.scrollTop = dom.scrollHeight;
    }
  }, [fields]);

  const listStyle = {
    maxHeight: 250,
    overflow: 'auto',
    paddingRight: '15px',
  };

  useEffect(() => {
    if (!open) return;
    if (!data) return;
    form.setFieldsValue(data);

    // 组件关联设置
    const relateDataObj = {}; // 关联不为空时才设置
    if (templateRestriction) {
      // const tmpRestrictionObj = JSON.parse(templateRestriction);
      const { activeLinkageRelations } = templateRestriction;

      if (isArray(activeLinkageRelations) && activeLinkageRelations.length) {
        activeLinkageRelations.forEach(({ value, relationsComponent }) => {
          if (!relateDataObj[value]) {
            relateDataObj[value] = [relationsComponent];
            return;
          }
          if (isArray(relateDataObj[value]) && !relateDataObj[value].includes(relationsComponent)) {
            relateDataObj[value].push(relationsComponent);
          }
        });
      }
    }

    const relateData = Object.keys(relateDataObj).length ? Object.keys(relateDataObj).map(key => ({
      value: Number(key),
      relationsComponent: relateDataObj[key],
    })) : [{ value: undefined, relationsComponent: undefined }];

    form.setFieldValue('activeLinkageRelations', relateData);
    // eslint-disable-next-line
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (!data?.categoryTemplateId) return;
    getProperties();
  }, [open, data?.categoryTemplateId]);

  const getProperties = async () => {
    // https://yapi.lanhanba.com/project/289/interface/api/47333
    const { propertyGroupVOList } = await dynamicTemplateDetail({ id: data?.categoryTemplateId });
    const propertyConfigList = propertyGroupVOList.reduce((firstPrev: any, firstNext: any) => {
      const childrenProperty = firstNext.childList ? firstNext.childList.reduce((prev: any, next: any) => {
        // @ts-ignore
        return [...prev, ...next.propertyConfigVOList];
      }, []) : [];
      // @ts-ignore
      return [...firstPrev, ...childrenProperty.concat(firstNext.propertyConfigVOList)];
    }, []);
    setProperties(propertyConfigList.filter(itm => itm.propertyId !== data?.propertyId && itm.isFixed === 1)); // 从关联属性项列表中，去掉当前弹框正在编辑的属性

    if (data?.propertyId) {
      const arr = propertyConfigList.filter((itm: any) => itm.propertyId === data?.propertyId);
      if (arr.length) {
        const opts = arr[0].propertyConfigOptionVOList;
        setPropertyOptionList(opts || []);
      }
    }

  };


  // useEffect(() => {
  //   const getProperties = async () => {
  //     // https://yapi.lanhanba.com/project/289/interface/api/47333
  //     const { propertyGroupVOList } = await post('/dynamic/template/detail', { id: linkDisplayConfig.categoryTemplateId }, {
  //       isMock: false,
  //       mockId: 289,
  //       mockSuffix: '/api',
  //       needHint: true,
  //       proxyApi: '/blaster',
  //     });
  //     const propertyConfigList = propertyGroupVOList.reduce((firstPrev: any, firstNext: any) => {
  //       const childrenProperty = firstNext.childList ? firstNext.childList.reduce((prev: any, next: any) => {
  //         // @ts-ignore
  //         return [...prev, ...next.propertyConfigVOList];
  //       }, []) : [];
  //       // @ts-ignore
  //       return [...firstPrev, ...childrenProperty.concat(firstNext.propertyConfigVOList)];
  //     }, []);
  //     setProperties(propertyConfigList.filter(itm => itm.propertyId !== linkDisplayConfig.propertyId && itm.isFixed === 1)); // 从关联属性项列表中，去掉当前弹框正在编辑的属性

  //     if (linkDisplayConfig.propertyId) {
  //       const arr = propertyConfigList.filter((itm: any) => itm.propertyId === linkDisplayConfig.propertyId);
  //       if (arr.length) {
  //         const opts = arr[0].propertyConfigOptionVOList;
  //         setPropertyOptionList(opts || []);
  //       }
  //     }

  //   };
  //   if (linkDisplayConfig.visible) {
  //     getProperties();
  //   }
  // }, [linkDisplayConfig.visible, linkDisplayConfig.categoryTemplateId]);

  return (
    <Modal
      title='关联显示配置'
      open={open}
      onOk={onOk}
      onCancel={onCancel}
    >
      <V2Form form={form}>
        <Form.List
          name='activeLinkageRelations'>
          {(fields, { add, remove }) => (
            <>
              <div style={listStyle} ref={formListRef}>
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
                  onClick={() => {
                    add();
                    handleHeight();
                  }}
                  icon={<PlusOutlined />}>
                    添加规则
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </V2Form>
    </Modal>
  );
};
export default AssociatedDisplayModal;

