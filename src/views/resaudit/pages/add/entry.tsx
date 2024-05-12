import { resTemplateDetail } from '@/common/api/template';
import { auditDetail, postExaminePass, postExamineSave } from '@/common/api/audit';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { useMethods } from '@lhb/hook';
import DynamicComponent from '@/views/resmng/pages/detail/components/DynamicComponent';
import DynamicLabel from '@/views/resmng/pages/detail/components/DynamicLabel';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import { Anchor, Button, Collapse, Form, message, Space, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { FC, useEffect, useState, createContext, useMemo } from 'react';
import styles from './entry.module.less';
import { getKeysFromObjectArray, isDef, urlParams } from '@lhb/func';
import { ControlType } from '@/common/enums/control';
import { Layout } from '@/views/resmng/pages/real-detail/components';
import RejectButton from './RejectButton';
import ComovementRelation from '@/views/resmng/pages/detail/components/ComovementRelation';

const { Link } = Anchor;
const { Panel } = Collapse;
const { Text } = Typography;

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 14,
  },
};

export const ResAuditRelationsProvider = createContext({});

const { Provider } = ResAuditRelationsProvider;

const AddForm: FC<any> = ({ location }) => {
  const [form] = useForm();
  const [propertyGroup, setPropertyGroup] = useState<any>([]);
  const [labelGroup, setLabelGroup] = useState<any>([]);
  const [defaultActiveKey, setDefaultActiveKey] = useState<any>([]);
  const [oldLabelValueList, setOldLabelValueList] = useState<any>({});
  const [oldPropertyValueList, setOldPropertyValueList] = useState<any>({});
  const [uploadPropertyIds, setUploadPropertyIds] = useState<any>([]);

  const {
    examineOrderId,
    categoryId,
    categoryTemplateId,
    isEdit, // 编辑时使用
    resourceId, // 编辑时使用
    resourceType, // 编辑时使用
    disabled,
    name,
    placeName,
    backUrl
  } = urlParams(location.search);

  const [cName, setCName] = useState('');
  // 用来做数据联动
  const [values, setValues] = useState<any>({});

  const getValues = (data: any[]) => {
    const values = { propertyList: {} };
    const empyts = ['', null];
    if (!Array.isArray(data)) {
      return;
    }
    data.forEach((prop = {}) => {
      if (prop) {
        const { controlType, textValue, propertyValue, propertyId } = prop;
        // 如果为空统一当作字符串来处理
        const value = textValue || propertyValue;
        if (controlType === null || controlType === void 0) {
          values.propertyList[propertyId] = value;
        } else if (isDef(value) && !empyts.includes(value as any)) {
          // 单行输入框，多行输入框，时间选择器(内部做处理),
          const isNotToJson = [3, 4, 9].includes(prop.controlType);
          let propValue: string | { subForm: any[] } = '';
          if (isNotToJson) {
            propValue = value;
          } else if (prop.controlType === ControlType.SUB_FORM.value) { // 子表单特殊处理
            const subFormList = JSON.parse(value as any).flatMap(item => {
              return {
                textValue: item.textValue,
                propertyConfigId: item.propertyConfigId,
                row: item.row,
                propertyId: item.propertyId,
              };
            });
            // console.log('subFormList', JSON.stringify(subFormList));
            const result = subFormList.reduce((acc, item) => {
              const { propertyConfigId, propertyId, textValue, row } = item;

              if (!acc[row]) {
                acc[row] = {};
              }

              if (!acc[row][propertyConfigId]) {
                acc[row][propertyConfigId] = {};
              }

              let _textValue = textValue;
              // 选项类型数据是对象类型，需要转成 object 格式
              try {
                _textValue = JSON.parse(textValue);
              } catch (error) {
                _textValue = textValue;
              }

              acc[row][propertyConfigId][propertyId] = _textValue;
              // console.log('textValue', textValue);

              return acc;
            }, []);
            // console.log('result', result);
            propValue = { subForm: result };
          } else {
            try {
              propValue = JSON.parse(value as any);

            } catch (error) {
              console.log('value', value, error);
              propValue = value;
            }
          }
          values.propertyList[prop.propertyId] = propValue;
        }
      }

    });
    return values;
  };

  const { getTemplateDetail, getDetail, initProps, initLabels, loadData, onFinish, submit, isUploadInfoEqual } = useMethods({
    loadData: async () => {
      await getTemplateDetail();
      await getDetail();
    },

    async getTemplateDetail() {
      const result = await resTemplateDetail({
        categoryId,
        categoryTemplateId,
      });
      if (result.propertyGroupVOList) {
        const activeKey: string[] = [];
        setPropertyGroup(result.propertyGroupVOList);
        setLabelGroup(result.labelGroupVOList);
        result.propertyGroupVOList.forEach((propGroup) => {
          activeKey.push('prop-' + propGroup.id);
        });
        result.labelGroupVOList.forEach((labelGroup) => {
          activeKey.push('label-' + labelGroup.id);
        });
        setDefaultActiveKey(activeKey);
      }
    },

    async getDetail() {
      if (!examineOrderId) {
        form.resetFields();
        return;
      }
      const resourceDetail = await auditDetail({ examineOrderId });
      setCName(resourceDetail.categoryName);

      const values: any = { propertyList: {}, labelList: {} };
      setOldLabelValueList([]);
      setOldPropertyValueList([]);
      setUploadPropertyIds([]);

      const tmpUploadPropertyIds: any = [];
      values.propertyList = getValues(resourceDetail.propertyValueList)?.propertyList;
      resourceDetail.labelValueList?.forEach((label) => {
        values.labelList[label.labelGroupId] = label.labelIdList;
      });
      setOldPropertyValueList(values.propertyList);
      setOldLabelValueList(values.labelList);
      tmpUploadPropertyIds.length && setUploadPropertyIds(tmpUploadPropertyIds);
      form.setFieldsValue(values);
      const { propertyList } = values;
      setValues(propertyList);
    },

    initProps(item) {
      const { name, propertyConfigList } = item;
      const header = <Text strong>{name}</Text>;
      return (
        <Panel header={header} key={'prop-' + item.id} id={'prop-' + item.id}>
          {propertyConfigList.map((prop) => (
            <ComovementRelation
              key={prop.propertyId}
              propertyId={prop.propertyId}
              name={prop.name}
              comovementRelations={prop.templateRestrictionPassiveList || []}
              type='resaudit'>
              <DynamicComponent
                key={Math.random()}
                prop={prop}
                disabled={disabled}
                form={form}
                categoryName={cName || ''}
              />
            </ComovementRelation>
          ))}
        </Panel>
      );
    },
    initLabels(labelGroup) {
      const header = <Text strong>{labelGroup.name}</Text>;
      return (
        <Panel header={header} key={'label-' + labelGroup.id} id={'label-' + labelGroup.id}>
          <DynamicLabel key={Math.random()} labelGroup={labelGroup} disabled={disabled} />
        </Panel>
      );
    },

    onFinish() {
      const values = form.getFieldsValue(true);
      /** 保存不需要  */
      if (isEdit) {
        submit(values);
      } else {
        // 通过需要(产品需求变动不需要校验必填项)
        const content = '是否确认审核通过?';
        ConfirmModal({ content, onSure: () => {
          submit(values);
        } });
      }
    },


    // 新增审核/编辑数据，有变动的字段提交
    submit(values: any) {
      // 属性处理
      const propertyValueList: any = [];
      const keys = values.propertyList ? Object.keys(values.propertyList) : [];

      keys.map((key) => {
        const isRemovedValue = !values.propertyList[key] && oldPropertyValueList[key]; // 从有值变没值

        if (values.propertyList[key] || isRemovedValue) {
          const textValue = JSON.stringify(values.propertyList[key]);
          if (textValue !== '{}' || isRemovedValue) {
            if (typeof values.propertyList[key] === 'object') {
              // 如果有子表单
              if (Object.keys(values.propertyList[key]).find(item => item === 'subForm')) {
                // 子表单列的id
                let columnsPropertyId: any[] = [];
                getKeysFromObjectArray(propertyGroup, 'propertyConfigList').find(itm => itm.find(propertyItm => {
                  if (propertyItm.propertyId === Number(key)) {
                    columnsPropertyId = getKeysFromObjectArray(propertyItm.formConfigList, 'id');
                    return true;
                  }
                  return false;
                }));
                const subFormList: any[] = values.propertyList[key].subForm;
                // 将列表扁平处理
                const flattenedArray = subFormList.flatMap((item, index) => {
                  const propertyIds = Object.keys(item);

                  return propertyIds.flatMap(propertyId => {
                    const nestedObject = item[propertyId];

                    if (typeof nestedObject === 'object' && nestedObject !== null) {
                      const nestedPropertyIds = Object.keys(nestedObject);

                      return nestedPropertyIds.map(nestedPropertyId => {
                        // console.log('subFormList', subFormList, propertyId, form.getFieldInstance(['propertyList', key, 'subForm', index, propertyId, nestedPropertyId]));
                        const textValue = nestedObject[nestedPropertyId];

                        // 根据列 id（也就是propertyConfigId）取出列表的值，防止子表单配置变跟后，getFieldsValue取到了一些已经删除字段的值
                        if (!columnsPropertyId.includes(Number(propertyId))) {
                          return null;
                        }

                        return {
                          propertyConfigId: propertyId,
                          textValue,
                          row: index,
                          propertyId: nestedPropertyId
                        };
                      });
                    } else {
                      return {
                        propertyConfigId: propertyId,
                        textValue: nestedObject,
                        row: index,
                        propertyId
                      };
                    }
                  });
                });
                propertyValueList.push({ propertyId: key, textValue: JSON.stringify(flattenedArray.filter(item => item)) });
              } else if (uploadPropertyIds.includes(Number(key))) { // uplaod类型只比较url
                if (!isUploadInfoEqual(oldPropertyValueList[key], values.propertyList[key])) {
                  propertyValueList.push({ propertyId: key, textValue: textValue });
                }
              } else {
                // 对象类型，比较修改前后的json，有变动时才提交
                const oldJson = JSON.stringify(oldPropertyValueList[key]);
                if (textValue !== oldJson) {
                  propertyValueList.push({ propertyId: key, textValue: textValue });
                }
              }
            } else {
              // 非对象类型，比较修改前后的文本，有变动时才提交
              if (values.propertyList[key] !== oldPropertyValueList[key]) {
                propertyValueList.push({ propertyId: key, textValue: values.propertyList[key] });
              }
            }
          }
        }
      });

      // 标签处理
      const labelValueList: any = [];
      const labelKeys = values.labelList ? Object.keys(values.labelList) : [];
      labelKeys.forEach((key) => {
        const isRemovedValue = !values.labelList[key] && oldLabelValueList[key]; // 从有值变没值
        const isChanged = values.labelList[key] !== oldLabelValueList[key]; // 变动
        // console.log('label key:', key, oldLabelValueList[key], values.labelList[key]);
        if (isChanged || isRemovedValue) {
          labelValueList.push({ labelGroupId: key, labelIdList: values.labelList[key] ? values.labelList[key] : [] });
        }
      });

      if (isEdit) {
        // 保存审核信息
        const params = {
          examineOrderId,
          propertyValueList,
          labelValueList,
          resourceId,
          resourceType,
        };
        // console.log('save params:', params);
        postExamineSave(params).then(() => {
          message.success('保存成功');
          setTimeout(() => {
            dispatchNavigate(`/resaudit/compare?examineOrderId=${examineOrderId}&categoryId=${categoryId}&categoryTemplateId=${categoryTemplateId}&resourceType=${resourceType}&resourceId=${resourceId}&name=${name}&placeName=${placeName}`);
          }, 1500);
        });
      } else { // end of edit submit
        // 通过新增审核信息
        const params = {
          examineOrderId,
          propertyValueList,
          labelValueList
        };
        // console.log('insert params:', params);
        postExaminePass(params).then(() => {
          message.success('通过成功');
          if (backUrl) {
            setTimeout(() => {
              dispatchNavigate(backUrl);
            }, 3000);
          } else {
            setTimeout(() => {
              dispatchNavigate('/resaudit');
            }, 1500);
          }
        });
      } // end of insert submit
    },

    isUploadInfoEqual(infoA, infoB) {
      return Array.isArray(infoA) && Array.isArray(infoB) && JSON.stringify(infoA.map(itm => itm.url)) === JSON.stringify(infoB.map(itm => itm.url));
    }
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  // 资源所属类目的属性配置,属性id和属性配置的keyValues
  const propertyConfigList = useMemo(() => {
    const configList = {};
    if (propertyGroup) {
      propertyGroup.forEach((grp: any) => {
        grp.propertyConfigList?.forEach(prp => {
          configList[prp.propertyId] = prp;
        });
      });
    }
    return configList;
  }, [propertyGroup]);

  const onValuesChange = (changedValues: any, allValues: any) => {
    const { propertyList: changedPropertyList } = changedValues;
    const changedKeys = Object.keys(changedPropertyList);

    if (changedKeys.length > 1) { // 同时多个组件值变动
      setValues(allValues.propertyList);
      return;
    }

    let hasRelations = false; // 是否是否单选或者多选组件变动
    if (changedKeys.length === 1) {
      const propInfo = propertyConfigList ? propertyConfigList[Number(changedKeys[0])] : undefined;
      hasRelations = isPropertyHasRelations(propInfo);
    }
    if (hasRelations) {
      setValues(allValues.propertyList);
    }
  };

  const isPropertyHasRelations = (propInfo: any) => {
    if (!propInfo || !propInfo.templateRestriction) {
      return false;
    }
    const { activeLinkageRelations } = JSON.parse(propInfo.templateRestriction);
    return Array.isArray(activeLinkageRelations) && !!activeLinkageRelations.length;
  };

  const onChange = (value: string | string[]) => {
    setDefaultActiveKey(value);
  };

  const onCancel = () => {
    window.history.back();
  };

  return (
    <Layout bodyWrapperStyle={{ height: 'calc(100vh - 120px)' }} anchors={
      <Anchor className={styles.anchor}>
        {propertyGroup.map((item) => (
          <Link href={`#prop-${item.id}`} title={item.anotherName ? item.anotherName : item.name} key={item.name} />
        ))}
        {labelGroup.map((item) => (
          <Link href={`#label-${item.id}`} title={item.name} key={item.name} />
        ))}
      </Anchor>}
    actions={(
      <Space>
        <Button type='primary' disabled={disabled} onClick={onFinish} >
          { isEdit ? '保存' : '通过' }
        </Button>
        {!isEdit && <RejectButton backUrl={backUrl} id={examineOrderId}/>}
        <Button onClick={onCancel}>
            取消
        </Button>
      </Space>
    )}
    >
      <div className={styles.container}>
        <div className={styles.detail}>
          <div className={styles.component}>
            <Form {...layout} form={form} onValuesChange={onValuesChange}>
              <Provider value={values}>
                <Collapse ghost activeKey={defaultActiveKey} onChange={onChange}>
                  {propertyGroup.map((item, i) => initProps(item, i))}
                  {labelGroup.map((item, i) => initLabels(item, i))}
                </Collapse>
              </Provider>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddForm;
