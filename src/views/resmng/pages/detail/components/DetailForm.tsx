import { resTemplateDetail } from '@/common/api/template';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { useMethods } from '@lhb/hook';
import { get, post } from '@/common/request';
import { Anchor, Button, Collapse, message, Space, Spin, Typography } from 'antd';
import { createContext, FC, useEffect, useState, useMemo } from 'react';
import CategoryChooseModal from '../../index/components/Modal/CategoryChooseModal';
import { CategoryChooseModalInfo, ResourceType } from '../../index/ts-config';
import styles from './detail.module.less';
import DynamicComponent from './DynamicComponent';
import DynamicLabel from './DynamicLabel';
import { TreeSelect, Form } from 'antd';
import { Layout } from '../../real-detail/components';
import { getKeysFromObjectArray, isDef } from '@lhb/func';
import ComovementRelation from './ComovementRelation';
import { ControlType } from '@/common/enums/control';

const { Link } = Anchor;
const { Panel } = Collapse;
const { Text } = Typography;

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const { useForm } = Form;

export const ComovementRelationsProvider = createContext({});

const { Provider } = ComovementRelationsProvider;

const DetailForm: FC<any> = ({
  resourceType,
  categoryId,
  id,
  placeId,
  categoryTemplateId,
  isKA,
  disabled,
  categoryName,
}) => {
  const [form] = useForm();
  const [propertyGroup, setPropertyGroup] = useState<any>([]);
  const [labelGroup, setLabelGroup] = useState<any>([]);
  const [defaultActiveKey, setDefaultActiveKey] = useState<any>([]);
  const [spinning, setSpinning] = useState(false);
  const [categoryChooseModalInfo, setCategoryChooseModalInfo] = useState<CategoryChooseModalInfo>({ visible: false });
  const [newPlaceId, setNewPlaceId] = useState(-1);
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
    console.log('values', values);
    return values;
  };

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
    // return propInfo.controlType === ControlType.SINGLE_RADIO.value || propInfo.controlType === ControlType.CHECK_BOX.value;
  };

  const { initProps, initLabels, loadData, onFinish, onNewSpot } = useMethods({
    loadData: async (categoryId) => {
      const result = await resTemplateDetail({
        categoryId,
        categoryTemplateId,
      });
      if (
        (result.propertyGroupVOList && result.propertyGroupVOList.length === 0) &&
        (result.labelGroupVOList && result.labelGroupVOList.length === 0)
      ) {
        setLabelGroup([]);
        setPropertyGroup([]);
      }
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

      if (id === -1) {
        form.resetFields();
        return;
      }
      const url = Number(resourceType) === ResourceType.PLACE ? '/place/detail' : '/spot/detail';
      const resourceDetail = await get(url, { id: id }, true);
      setCName(resourceDetail.categoryName);

      const values: any = { propertyList: {}, labelList: {} };
      values.propertyList = getValues(resourceDetail.propertyValueList)?.propertyList;
      resourceDetail.labelValueList.forEach((label) => {
        values.labelList[label.labelGroupId] = label.labelIdList;
      });
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
              type='resmng'>
              <DynamicComponent
                prop={prop}
                disabled={disabled}
                form={form}
                categoryName={id === -1 ? categoryName : cName}
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
    onNewSpot() {
      if (id !== -1) {
        setCategoryChooseModalInfo({ visible: true, resourceId: id, resourceType: ResourceType.SPOT, placeId: id, isKA } as any);
        return;
      }
      if (newPlaceId !== -1) {
        setCategoryChooseModalInfo({ visible: true, resourceId: id, resourceType: ResourceType.SPOT, placeId: newPlaceId, isKA } as any);
        return;
      }
      onFinish(true);
    },
    onFinish(isNewSpot) {
      form
        .validateFields()
        .then((values: any) => {
          // 属性处理
          const propertyValueList: any = [];
          const keys = values.propertyList ? Object.keys(values.propertyList) : [];

          keys.map((key) => {
            if (values.propertyList[key]) {
              const textValue = JSON.stringify(values.propertyList[key]);
              if (textValue !== '{}') {
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

                    console.log('flattenedArray', flattenedArray);
                    // [
                    //   {
                    //     propertyId: 44,
                    //     textValue: '2024-02-06',
                    //     row:0
                    //   },
                    //   {
                    //     propertyId: 44,
                    //     textValue:  '2024-02-06',
                    //     row:1
                    //   },
                    // ];
                    propertyValueList.push({ propertyId: key, textValue: JSON.stringify(flattenedArray.filter(item => item)) });
                  } else {
                    propertyValueList.push({ propertyId: key, textValue: textValue });

                  }
                } else {
                  propertyValueList.push({ propertyId: key, textValue: values.propertyList[key] });
                }
              }
            }
          });

          // 标签处理
          const labelValueList: any = [];
          const labelKeys = values.labelList ? Object.keys(values.labelList) : [];
          labelKeys.map((key) =>
            labelValueList.push({ labelGroupId: key, labelIdList: values.labelList[key] ? values.labelList[key] : [] })
          );
          const params = {
            categoryId: value,
            propertyValueList: propertyValueList,
            labelValueList: labelValueList,
            isKA: isKA,
            ...(id !== -1 && { id: id }),
          };
          if (Number(resourceType) === ResourceType.SPOT) {
            params['resourcePlaceId'] = Number(placeId);
          }
          const url = Number(resourceType) === ResourceType.PLACE ? '/place/create' : '/spot/create';
          post(url, params, true).then((values) => {
            setNewPlaceId(values.id);
            if (isNewSpot) {
              setCategoryChooseModalInfo({ visible: true, resourceType: ResourceType.SPOT, placeId: values.id });
              return;
            }
            setSpinning(true);

            if (isKA === 'true') {
              dispatchNavigate(`/resmngka?activeKey=${resourceType}`);
            } else {
              dispatchNavigate(`/resmng?activeKey=${resourceType}`);
            }
            message.success(id === -1 ? '新建成功' : '保存成功');
            setSpinning(false);
          });
        })
        .catch((errorInfo) => {
          console.log('errorInfo', errorInfo);
          message.error(errorInfo.errorFields[0].errors[0]);
        });
    },
  });

  useEffect(() => {
    // eslint-disable-next-line
  }, []);

  const onChange = (value: string | string[]) => {
    setDefaultActiveKey(value);
  };

  const getResoruceType = async (type: string, cb: Function) => {
    const result = await get('/category/list', { resourcesType: type }, { needCancel: false });
    cb(result);
  };

  const [treeData, setTreeData] = useState<Array<any>>([]);
  const [value, setValue] = useState<number>(-1);

  const onTreeSelectChange = (value: any) => {
    setValue(value);
    loadData(value);
  };

  useEffect(() => {
    if (id === -1) {
      setValue(categoryId);
      loadData(categoryId);
      return;
    }
    get('/resource/getCategory', { resourceId: id, resourceType }, true).then((categoryId) => {
      setValue(categoryId);
      loadData(categoryId);
    });
  }, [categoryId]);


  useEffect(() => {
    getResoruceType(resourceType as any, setTreeData);
  }, [resourceType]);

  return (
    <Spin spinning={spinning}>
      <Layout
        anchors={
          <Anchor>
            {propertyGroup.map((item) => (
              <Link href={`#prop-${item.id}`} title={item.anotherName ? item.anotherName : item.name} key={item.name} />
            ))}
            {labelGroup.map((item) => (
              <Link href={`#label-${item.id}`} title={item.name} key={item.name} />
            ))}
          </Anchor>
        }
        actions={
          (propertyGroup.length !== 0 || labelGroup.length !== 0) && (
            <Space>
              <Button onClick={() => onFinish(false)} type='primary' disabled={Boolean(disabled)}>
                保存
              </Button>
              {Number(resourceType) === ResourceType.PLACE ? (
                <Button onClick={() => onNewSpot()} disabled={Boolean(disabled)}>
                  新增点位
                </Button>
              ) : null}
            </Space>
          )
        }
      >
        <Form {...layout} form={form} onValuesChange={onValuesChange} className={styles.component} onFinish={onFinish}>
          <Provider value={values}>
            <Form.Item wrapperCol={{ span: 13 }} label={resourceType === '0' ? '类目' : '点位'}>
              <TreeSelect
                value={value}
                fieldNames={{ label: 'name', value: 'id', children: 'childList' }}
                treeData={treeData}
                placeholder={`{请选择其他${resourceType === '0' ? '类目' : '点位'}}`}
                onChange={onTreeSelectChange}
              />
            </Form.Item>
            {
              (propertyGroup.length === 0 && labelGroup.length === 0)
                ? <Text type='warning'>请先配置对应模板！</Text>
                : (<Collapse ghost activeKey={defaultActiveKey} onChange={onChange}>
                  {propertyGroup.map((item, i) => initProps(item, i))}
                  {labelGroup.map((item, i) => initLabels(item, i))}
                </Collapse>)
            }
          </Provider>
        </Form>
        <CategoryChooseModal
          categoryChooseModalInfo={categoryChooseModalInfo}
          setCategoryChooseModalInfo={setCategoryChooseModalInfo}
        />
      </Layout>
    </Spin>
  );
};

export default DetailForm;
