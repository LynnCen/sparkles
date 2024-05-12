import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { Button, Form, message, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import DataLinkage from '@/views/restpl/pages/config/components/DataLinkage/index';
import { PlusOutlined } from '@ant-design/icons';
import { isArray, isNotEmptyAny, isUndef } from '@lhb/func';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const LinkDisplayConfig: React.FC<any> = ({
  linkDisplayConfig,
  setLinkDisplayConfig,
  onSearch,
  templateId
}) => {
  const formListRef = useRef<any>(null);
  const { templateRestriction } = linkDisplayConfig;
  const [form] = Form.useForm();
  const [properties, setProperties] = useState<any>([]); // 当前模板下所有属性
  const [propertyOptionList, setPropertyOptionList] = useState<any>([]); // 当前属性的optionList，只对单选、多选有效，组件联动编辑用
  const [fields, setFields] = useState<any>([]);

  const { onCancel, onOk } = useMethods({
    onCancel() {
      setLinkDisplayConfig({ ...linkDisplayConfig, visible: false });
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

        const updateTemplateRestriction = JSON.parse(templateRestriction) || {};
        if (isNotEmptyAny(postRelations)) {
          updateTemplateRestriction.activeLinkageRelations = postRelations;
        } else {
          delete updateTemplateRestriction.activeLinkageRelations;
        }
        const params = {
          templateId,
          propertyConfigRequestList: [{
            ...linkDisplayConfig,
            ...values,
            // templateRestriction: isNotEmptyAny(postRelations) ? JSON.stringify({ ...JSON.parse(templateRestriction || '{}'), activeLinkageRelations: postRelations }) : templateRestriction
            templateRestriction: JSON.stringify(updateTemplateRestriction)
          }]

        };
        delete params.propertyConfigRequestList[0].visible;
        delete params.propertyConfigRequestList[0].activeLinkageRelations;

        const url = '/dynamic/property/update';
        post(url, params, { proxyApi: '/blaster', needHint: true }).then((success) => {
          message.success('编辑配置成功');
          if (success) {
            onCancel();
            onSearch();
          }
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
    if (!linkDisplayConfig.visible) {
      form.resetFields();
      return;
    }

    form.setFieldsValue(linkDisplayConfig);

    // 组件关联设置
    const relateDataObj = {}; // 关联不为空时才设置
    if (templateRestriction) {
      const tmpRestrictionObj = JSON.parse(templateRestriction);

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
    // eslint-disable-next-line
  }, [linkDisplayConfig.visible]);

  useEffect(() => {
    const getProperties = async () => {
      // https://yapi.lanhanba.com/project/289/interface/api/47333
      const { propertyGroupVOList } = await post('/dynamic/template/detail', { id: linkDisplayConfig.categoryTemplateId }, {
        isMock: false,
        mockId: 289,
        mockSuffix: '/api',
        needHint: true,
        proxyApi: '/blaster',
      });
      const propertyConfigList = propertyGroupVOList.reduce((firstPrev: any, firstNext: any) => {
        const childrenProperty = firstNext.childList ? firstNext.childList.reduce((prev: any, next: any) => {
          // @ts-ignore
          return [...prev, ...next.propertyConfigVOList];
        }, []) : [];
        // @ts-ignore
        return [...firstPrev, ...childrenProperty.concat(firstNext.propertyConfigVOList)];
      }, []);
      setProperties(propertyConfigList.filter(itm => itm.propertyId !== linkDisplayConfig.propertyId && itm.isFixed === 1)); // 从关联属性项列表中，去掉当前弹框正在编辑的属性

      if (linkDisplayConfig.propertyId) {
        const arr = propertyConfigList.filter((itm: any) => itm.propertyId === linkDisplayConfig.propertyId);
        if (arr.length) {
          const opts = arr[0].propertyConfigOptionVOList;
          setPropertyOptionList(opts || []);
        }
      }

    };
    if (linkDisplayConfig.visible) {
      getProperties();
    }
  }, [linkDisplayConfig.visible, linkDisplayConfig.categoryTemplateId]);

  return (
    <Modal title='关联显示配置' open={linkDisplayConfig.visible} onOk={onOk} onCancel={onCancel}>
      <Form {...layout} form={form}>
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
      </Form>
    </Modal>
  );
};
export default LinkDisplayConfig;
