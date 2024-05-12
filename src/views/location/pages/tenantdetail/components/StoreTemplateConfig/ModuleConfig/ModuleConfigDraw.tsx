import { useMethods } from '@lhb/hook';
import { FC, useEffect, useState } from 'react';

import V2Drawer from '@/common/components/Feedback/V2Drawer';
import { Divider, Space, Image, Row, Col, Form, Button, Cascader, message } from 'antd';
import styles from './index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Operate from '@/common/components/Others/V2Operate';
import IconFont from '@/common/components/IconFont';
import V2Form from '@/common/components/Form/V2Form';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import { MinusCircleOutlined } from '@ant-design/icons';
import { expandModuleUpdate, templateDetail } from '@/common/api/storeTemplateConfig';
import { isArray, recursionEach, treeFind } from '@lhb/func';
import { v4 } from 'uuid';
import { ControlType } from '@/common/enums/control';

const ModuleConfigDraw: FC<any> = ({ configDraw, setConfigDraw, onSearch }) => {
  const { visible, module } = configDraw;
  const [fields, setFields] = useState<any>([]);
  const [form] = Form.useForm();
  const [options, setOptions] = useState<any>([]);
  const [lock, setLock] = useState<boolean>(false);

  const isNotEmpty = (arr) => {
    return isArray(arr) && arr.length;
  };

  const encodeValue = (property) => {
    return property.id + '|' + property.identification + '|' + property.name;
  };

  const decodeValue = (value, isTitle, isAddress) => {
    const fieldArr = (value as any)[(value as any).length - 1].split('|');
    const result: any = {
      id: fieldArr[0],
      code: fieldArr[1],
      name: fieldArr[2],
    };
    if (isTitle) {
      result.isTitle = true;
    }
    if (isAddress) {
      result.isAddress = true;
    }
    return result;
  };

  const loadOptions = async () => {
    const ops:any = [];
    const result = await templateDetail({ id: configDraw.templateId });
    if (isNotEmpty(result.propertyGroupVOList)) {
      // 1、收益预估模块只能选择数字输入框类型
      if (module?.moduleType === 3) {
        recursionEach(result.propertyGroupVOList, 'childList', (item) => {
          if (isNotEmpty(item.propertyConfigVOList)) {
            item.propertyConfigVOList = item.propertyConfigVOList.filter(property => property.controlType === ControlType.INPUT_NUMBER.value);
          }
        });
      }
      // 2、过滤掉没有属性的二级分组
      result.propertyGroupVOList.forEach(firstGroup => {
        if (isNotEmpty(firstGroup.childList)) {
          firstGroup.childList = firstGroup.childList.filter(item => isNotEmpty(item.propertyConfigVOList));
        }
      });

      // 3、过滤掉没有内容的一级分组
      const validGroups = result.propertyGroupVOList.filter(group => isNotEmpty(group.childList) || isNotEmpty(group.propertyConfigVOList));
      if (validGroups.length === 0) {
        return;
      }

      // 4、组装结构
      validGroups.forEach(firstGroup => {
        const firstLevel = { label: firstGroup.name, value: firstGroup.id, children: [] };
        if (isNotEmpty(firstGroup.childList)) {
          firstLevel.children = firstLevel.children.concat(firstGroup.childList.map(child => ({
            value: child.id,
            label: child.name,
            children: child.propertyConfigVOList.map(property => ({
              label: property.name,
              value: encodeValue(property),
              treePath: [firstGroup.id, child.id, encodeValue(property)]
            }))
          })));
        }

        if (isNotEmpty(firstGroup.propertyConfigVOList)) {
          firstLevel.children = firstLevel.children.concat(firstGroup.propertyConfigVOList.map(property =>
            ({ label: property.name, value: encodeValue(property), treePath: [firstGroup.id, encodeValue(property)] })));
        }
        ops.push(firstLevel);
      });
      ops.push({ label: '开发经理', value: '-100|basicChancePointCreator|开发经理', treePath: ['-100|basicChancePointCreator|开发经理'] });
      ops.push({ label: '创建时间', value: '-200|basicChancePointCreatedAt|创建时间', treePath: ['-200|basicChancePointCreatedAt|创建时间'] });
      ops.push({ label: '拓店任务详情页', value: '-300|basicChancePointRelationTask|拓店任务详情页', treePath: ['-300|basicChancePointRelationTask|拓店任务详情页'] });
      ops.push({ label: '所属商圈', value: '-400|basicChancePointMatchBusinessArea|所属商圈', treePath: ['-400|basicChancePointMatchBusinessArea|所属商圈'] });
      ops.push({ label: '商圈评分', value: '-500|basicChancePointBusinessDistrictRating|商圈评分', treePath: ['-500|basicChancePointBusinessDistrictRating|商圈评分'] });
      ops.push({ label: '点位评分', value: '-600|basicChancePointPointRating|点位评分', treePath: ['-600|basicChancePointPointRating|点位评分'] });
      setOptions(ops);
      return ops;
    }
  };



  const methods = useMethods({
    handleCancel: () => {
      setConfigDraw({ visible: false });
      setFields([]);
      setOptions([]);
    },
    handleAddField: () => {
      const newFields = fields.slice();
      newFields.push({ name: v4() });
      setFields(newFields);
    },
    handleDeleteField: (name) => {
      setFields(fields.filter(field => field.name !== name));
    },

    handleSubmit: () => {
      if (lock) {
        return;
      }
      setLock(true);
      form.validateFields().then((values) => {
        const { title, address, ...others } = values;
        const fields:any = [];

        if (isNotEmpty(title)) {
          fields.push(decodeValue(title, true, false));
        };
        if (isNotEmpty(address)) {
          fields.push(decodeValue(address, false, true));
        };
        const otherFields = Object.values(others)
          .filter(item => Array.isArray(item) && item.length)
          .map(field => decodeValue(field, false, false));
        const allFields = fields.concat(otherFields);
        expandModuleUpdate({ groupId: module.id, relationId: configDraw.id, moduleName: module.moduleName, moduleType: module.moduleType, tenantId: configDraw.tenantId, templateId: configDraw.templateId, property: JSON.stringify(allFields) }).then(() => {
          message.success('上传成功！');
          onSearch();
        });
      }).finally(() => {
        setLock(false);
      }); ;

    }
  });

  const parseOptionValue = (ops, property) => {
    const propertyValue = property.id + '|' + property.code + '|' + property.name;
    return treeFind(ops, item => item.value === propertyValue)?.treePath;

  };

  useEffect(() => {
    if (configDraw.visible) {
      loadOptions().then(ops => {
        if (configDraw.module && configDraw.module.property) {
          const fields = JSON.parse(configDraw.module.property);

          // 1、解析标题
          const titleField = fields.filter(item => Boolean(item.isTitle));
          if (isNotEmpty(titleField)) {
            const opsValue = parseOptionValue(ops, titleField[0]);
            Array.isArray(opsValue) && form.setFieldValue('title', opsValue);
          }

          // 2、解析地址
          const addressField = fields.filter(item => Boolean(item.isAddress));
          if (isNotEmpty(addressField)) {
            const opsValue = parseOptionValue(ops, addressField[0]);
            Array.isArray(opsValue) && form.setFieldValue('address', opsValue);
          }

          // 3、其他属性
          const others = fields.filter(item => (!item.isTitle) && (!item.isAddress));
          if (isNotEmpty(others)) {
            const initFields = others.map(other => ({
              name: v4(),
              value: parseOptionValue(ops, other)
            }));
            setFields(initFields);
            form.setFields(initFields);
          }

        }
      });
    }
  }, [configDraw.visible]);

  return (
    <V2Drawer
      open={visible}
      destroyOnClose
      onClose={methods.handleCancel}
      contentWrapperStyle={{
        width: '1028px',
      }}
      title={
        <>
          <Space className='mt-16 ml-40'>
            <span style={{ fontSize: '20px' }}>
              {module?.moduleType === 1 && '核心信息模块'}
              {module?.moduleType === 3 && '收益预估模块'}
            </span>
          </Space>
          <Divider className='mt-16 mb-0'/>
        </>
      }
    >
      <div className={styles.body}>
        <div className={styles.left}>
          <V2Title divider type='H2' text='配置信息' className='mb-8'/>
          <V2Form form={form}>
            {module?.moduleType === 1 && <Row>
              <Col span={12} key={'title'}>
                <div className={styles.field}>
                  <V2FormCascader
                    label='标题属性'
                    name='title'
                    options={options}
                    rules={[{ required: true, message: '请选择标题属性' }]}
                    config={{ showSearch: true, showCheckedStrategy: Cascader.SHOW_CHILD, style: { width: '288px' } }} />
                </div>
              </Col>
              <Col span={12} key={'address'}>
                <div className={styles.field}>
                  <V2FormCascader
                    label='地址属性'
                    name='address'
                    options={options}
                    rules={[{ required: true, message: '请选择地址属性' }]}
                    config={{ showSearch: true, showCheckedStrategy: Cascader.SHOW_CHILD, style: { width: '288px' } }} />
                </div>
              </Col>
            </Row>}
            <Row>
              {fields.map((item, index) => <Col span={12} key={index}>
                <div className={styles.field}>
                  <V2FormCascader
                    label={`内容${index + 1}`}
                    name={item.name}
                    options={options}
                    config={{ showSearch: true, showCheckedStrategy: Cascader.SHOW_CHILD, style: { width: '288px' } }} />
                  <MinusCircleOutlined style={{ fontSize: '16px' }} className={styles.minusIcon} onClick={() => methods.handleDeleteField(item.name)}/>
                </div>
              </Col>)}
            </Row>
          </V2Form>
          <div>
            <V2Operate
              showBtnCount={5}
              operateList={[
                {
                  name: '添加内容',
                  event: 'addField',
                  func: 'handleAddField',
                  icon: <IconFont className={styles.icon} iconHref='icon-ic_add'/>,
                }
              ]}
              onClick={(btns: { func: string | number }) => methods[btns.func]()}
            />
          </div>
        </div>
        {module?.moduleType === 1 && <div className={styles.right}>
          <V2Title divider type='H2' text='移动端效果示例' className='mb-8'/>
          <Image.PreviewGroup>
            <div className={styles.image}><Image src='https://staticres.linhuiba.com/project-custom/saas-manage/expand/2.png' /></div>
          </Image.PreviewGroup>
          <V2Title divider type='H2' text='PC端效果示例' className='mb-8 mt-8'/>
          <Image.PreviewGroup>
            <div className={styles.image}><Image src='https://staticres.linhuiba.com/project-custom/saas-manage/expand/1.png' /></div>
          </Image.PreviewGroup>
        </div>}
        {module?.moduleType === 3 && <div className={styles.right}>
          <V2Title divider type='H2' text='移动端效果示例' className='mb-8'/>
          <Image.PreviewGroup>
            <div className={styles.image}><Image src='https://staticres.linhuiba.com/project-custom/saas-manage/expand/3.png' /></div>
          </Image.PreviewGroup>
          <V2Title divider type='H2' text='PC端效果示例' className='mb-8 mt-24'/>
          <Image.PreviewGroup>
            <div className={styles.image}><Image src='https://staticres.linhuiba.com/project-custom/saas-manage/expand/4.png' /></div>
          </Image.PreviewGroup>
        </div>}
      </div>
      <div className={styles.submit}>
        <Button onClick={methods.handleCancel} className='mr-12'>
          取消
        </Button>
        <Button type='primary' onClick={methods.handleSubmit}>
          确定
        </Button>
      </div>
    </V2Drawer>
  );
};
export default ModuleConfigDraw;
