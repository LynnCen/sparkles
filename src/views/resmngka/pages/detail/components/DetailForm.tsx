import { resTemplateDetail } from '@/common/api/template';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { useMethods } from '@lhb/hook';
import { get, post } from '@/common/request';
import { Button, Collapse, Form, message, Space, Spin, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { FC, useEffect, useState, createContext, useMemo } from 'react';
import { ResourceType } from '../../index/ts-config';
import styles from './detail.module.less';
import DynamicComponent from './DynamicComponent';
import DynamicLabel from './DynamicLabel';
import ComovementRelation from '@/views/resmng/pages/detail/components/ComovementRelation';

// const { Link } = Anchor;
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

export const KAComovementRelationsProvider = createContext({});

const { Provider } = KAComovementRelationsProvider;

const DetailForm: FC<any> = ({
  resourceType,
  categoryId,
  id,
  placeId,
  categoryTemplateId,
  isKA = true,
  disabled,
  location,
  categoryName,
}) => {
  const [form] = useForm();
  const [propertyGroup, setPropertyGroup] = useState<any>([]);
  const [labelGroup, setLabelGroup] = useState<any>([]);
  const [defaultActiveKey, setDefaultActiveKey] = useState<any>([]);
  const [spinning, setSpinning] = useState(false);
  const [newPlaceId, setNewPlaceId] = useState(-1);
  const [cName, setCName] = useState('');
  // 用来做数据联动
  const [values, setValues] = useState<any>({});

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

  const { initProps, initLabels, loadData, onFinish, onNewSpot } = useMethods({
    loadData: async () => {
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

      if (id === -1) {
        form.resetFields();
        return;
      }
      const url = Number(resourceType) === ResourceType.PLACE ? '/place/detail' : '/spot/detail';
      const resourceDetail = await get(url, { id: id }, true);
      setCName(resourceDetail.categoryName);

      const values = { propertyList: {}, labelList: {} };
      resourceDetail.propertyValueList.forEach((prop) => {
        if (prop.textValue === '' || prop.textValue === null) {
          return;
        }
        const propValue =
          prop.textValue.includes('}') || prop.textValue.includes(']') ? JSON.parse(prop.textValue) : prop.textValue;
        values.propertyList[prop.propertyId] = propValue;
      });
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
              type='resmngka'>
              <DynamicComponent
                key={Math.random()}
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
      const tplId = process.env.KA_TPL_ID_SPOT;
      const cId = process.env.KA_CATEGORY_ID_SPOT;
      if (id !== -1) {
        dispatchNavigate(
          `/resmngka/detail?resourceType=1&categoryId=${cId}&placeId=${id}&categoryTemplateId=${tplId}`
        );
        return;
      }
      if (newPlaceId !== -1) {
        dispatchNavigate(
          `/resmngka/detail?resourceType=1&categoryId=${cId}&placeId=${newPlaceId}&categoryTemplateId=${tplId}`
        );
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
                  propertyValueList.push({ propertyId: key, textValue: textValue });
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
            categoryId: categoryId,
            propertyValueList: propertyValueList,
            labelValueList: labelValueList,
            ...(id !== -1 && { id: id }),
          };
          if (Number(resourceType) === ResourceType.SPOT) {
            params['resourcePlaceId'] = Number(placeId);
          }
          const url = Number(resourceType) === ResourceType.PLACE ? '/place/create' : '/spot/create';
          post(url, params, true).then((values) => {
            setNewPlaceId(values.id);
            if (isNewSpot) {
              const tplId = process.env.KA_TPL_ID_SPOT;
              const cId = process.env.KA_CATEGORY_ID_SPOT;
              dispatchNavigate(
                `/resmngka/detail?resourceType=1&categoryId=${cId}&placeId=${values.id}&categoryTemplateId=${tplId}`
              );
              return;
            }
            setSpinning(true);
            setTimeout(() => {
              if (isKA) {
                dispatchNavigate('/resmngka');
              } else {
                dispatchNavigate('/resmng');
              }
              message.success(id === -1 ? '新建成功' : '保存成功');
              setSpinning(false);
            }, 2500);
          });
        })
        .catch((errorInfo) => {
          message.error(errorInfo.errorFields[0].errors[0]);
        });
    },
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [location]);

  const onChange = (value: string | string[]) => {
    setDefaultActiveKey(value);
  };

  return (
    <div className={styles.detail}>
      <Spin spinning={spinning}>
        <Form {...layout} form={form} className={styles.component} onFinish={onFinish} onValuesChange={onValuesChange}>
          <Provider value={values}>
            <Collapse ghost activeKey={defaultActiveKey} onChange={onChange}>
              {propertyGroup.map((item, i) => initProps(item, i))}
              {labelGroup.map((item, i) => initLabels(item, i))}
            </Collapse>
            <Form.Item wrapperCol={{ offset: 6 }}>
              <Space>
                <Button onClick={() => onFinish(false)} type='primary' disabled={Boolean(disabled)}>
                保存
                </Button>
                {Number(resourceType) === ResourceType.PLACE ? (
                  <Button onClick={() => onNewSpot()} style={{ marginLeft: 10 }} disabled={Boolean(disabled)}>
                  新增点位
                  </Button>
                ) : null}
              </Space>
            </Form.Item>
          </Provider>
        </Form>
      </Spin>
      {/* <Anchor className={styles.anchor}>
        {propertyGroup.map((item) => (
          <Link href={`#prop-${item.id}`} title={item.anotherName ? item.anotherName : item.name} key={item.name} />
        ))}
        {labelGroup.map((item) => (
          <Link href={`#label-${item.id}`} title={item.name} key={item.name} />
        ))}
      </Anchor> */}
    </div>
  );
};

export default DetailForm;
