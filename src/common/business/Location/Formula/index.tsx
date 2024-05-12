/**
 * @Description 计算公式弹窗
 * 从src/views/location/pages/tenantdetail/components/StoreTemplateConfig/Modal/EditComputeOperate.tsx拷贝过来
 * TODO 时间有限，待拆分重构
 */

import { FC, useEffect, useState } from 'react';
import { Col, Modal, Row, Space, message } from 'antd';
import { ComputeObject, ComputeObjectType, numberList, operationList } from './ts-config';
import { DeleteOutlined, LeftSquareOutlined } from '@ant-design/icons';
import { post } from '@/common/request';
import { recursionEach } from '@lhb/func';
import { ControlType } from '@/common/enums/control';
import { dynamicTemplateUpdateProperty } from '@/common/api/location';
import styles from './index.module.less';

const Formula: FC<any> = ({
  // editCompute,
  // setEditCompute,
  loadData,
  templateId,
  modalData,
  close
}) => {
  const { open, data } = modalData;
  const [propertyObjects, setPropertyObjects] = useState<ComputeObject[]>([]);
  const [expr, setExpr] = useState<any>([]);

  useEffect(() => {
    if (open) {
      loadProperties();
      loadExpr();
    }
  }, [open]);

  const getRestriction = (row: any) => {
    const { templateRestriction } = row || {};
    return templateRestriction ? JSON.parse(templateRestriction) : {};
  };
  const onSubmit = () => {
    if (validExpr()) {
      const restriction = getRestriction(data);
      restriction.expr = expr;
      const params = {
        templateId,
        propertyConfigRequestList: [
          {
            id: data?.id,
            propertyId: data?.propertyId,
            categoryTemplateId: data?.categoryTemplateId,
            categoryPropertyGroupId: data?.categoryPropertyGroupId,
            templateRestriction: JSON.stringify(restriction),
          },
        ],
      };

      dynamicTemplateUpdateProperty(params).then((success) => {
        if (!success) return;
        onCancel();
        loadData();
      });
      return;
    }
    message.error('计算公式格式有误，请检查');
  };

  const onCancel = () => {
    // setEditCompute({ visible: false });
    close && close();
  };

  const onClick = (item) => {
    setExpr([...expr].concat([item]));
  };

  const onDelete = () => {
    setExpr(expr.slice(0, expr.length - 1));
  };

  const onClear = () => {
    setExpr([]);
  };

  const validExpr = () => {
    if (expr.length === 0) {
      return true;
    }
    if (!validBrackets()) {
      console.log('brackets error');
      return false;
    }

    if (!validProperty()) {
      console.log('property error');
      return false;
    }

    if (!validPoint()) {
      console.log('point error');
      return false;
    }

    if (!validOperation()) {
      console.log('operation error');
      return false;
    }
    return true;
  };

  // 校验括号是否匹配
  const validBrackets = () => {
    const brackets = expr.filter((item) => item.label === ')' || item.label === '(');
    if (brackets.length === 0) {
      return true;
    }
    const stack: ComputeObject[] = [brackets[0]];
    for (let i = 1; i < brackets.length; i++) {
      if (stack.length === 0) {
        stack.push(brackets[i]);
        continue;
      }
      const top = stack[stack.length - 1];
      if (top.label === '(' && brackets[i].label === ')') {
        stack.pop();
      } else {
        stack.push(brackets[i]);
      }
    }
    return stack.length === 0;
  };

  // 校验属性左右两边都是计算符号
  const validProperty = () => {
    for (let i = 0; i < expr.length; i++) {
      if (expr[i].type !== ComputeObjectType.PROPERTY) {
        continue;
      }

      // 判断左边是否是计算符号
      if (i > 0 && expr[i - 1].type !== ComputeObjectType.OPERATION) {
        return false;
      }

      // 判断右边是否是计算符号
      if (i < expr.length - 1 && expr[i + 1].type !== ComputeObjectType.OPERATION) {
        return false;
      }
    }
    return true;
  };

  // 校验小数点左右两边都是数字
  const validPoint = () => {
    if (expr[0].label === '.' || expr[expr.length - 1] === '.') {
      return false;
    }
    for (let i = 0; i < expr.length; i++) {
      if (expr[i].label !== '.') {
        continue;
      }

      // 判断左右是否是数字
      if (
        expr[i - 1].label !== '.' &&
        expr[i - 1].type === ComputeObjectType.NUMBER &&
        expr[i + 1].label !== '.' &&
        expr[i + 1].type === ComputeObjectType.NUMBER
      ) {
        continue;
      } else {
        return false;
      }
    }
    return true;
  };

  // 计算符号左右是否是逻辑运算符
  const validOperation = () => {
    if (isLogicOperation(expr[0]) || isLogicOperation(expr[expr.length - 1])) {
      return false;
    }
    for (let i = 0; i < expr.length; i++) {
      // 开始或者结束是否是逻辑运算符
      if (!isLogicOperation(expr[i])) {
        continue;
      }

      // 判断左边是否是逻辑运算符
      if (isLogicOperation(expr[i - 1].type)) {
        return false;
      }

      // 判断右边是否是逻辑运算符
      if (isLogicOperation(expr[i + 1].type)) {
        return false;
      }
    }
    return true;
  };

  // 是否是逻辑运算符 +、-、×、÷
  const isLogicOperation = (computeObject: ComputeObject) => {
    return (
      computeObject.label === '+' ||
      computeObject.label === '-' ||
      computeObject.label === '×' ||
      computeObject.label === '÷'
    );
  };

  const renderTags = (tags: ComputeObject[]) => {
    return (
      <Space size={[0, 8]} wrap>
        {tags.map((item) => (
          <span className={styles.tag} onClick={() => onClick(item)} key={Math.random()}>
            {item.label}
          </span>
        ))}
      </Space>
    );
  };

  const loadProperties = async () => {
    // https://yapi.lanhanba.com/project/289/interface/api/47333
    const { propertyGroupVOList: objectList } = await post(
      '/dynamic/template/detail',
      { id: templateId },
      {
        isMock: false,
        mockId: 289,
        mockSuffix: '/api',
        needHint: true,
        proxyApi: '/blaster',
      }
    );
    const numberProperties: any = []; // 数字类型属性
    if (objectList && objectList.length) {
      recursionEach(objectList, 'childList', (item: any) => {
        if (item.propertyConfigVOList && item.propertyConfigVOList.length) {
          numberProperties.push(
            ...item.propertyConfigVOList.filter(
              (item) =>
                item.controlType === ControlType.INPUT_NUMBER.value && item.propertyId !== data?.propertyId
            )
          );
        }
      });
    }

    setPropertyObjects(
      numberProperties.map((item) => ({
        type: ComputeObjectType.PROPERTY,
        label: item.name,
        propertyId: item.propertyId,
      }))
    );
  };

  const loadExpr = () => {
    const templateRestriction = getRestriction(data);
    if (templateRestriction) {
      setExpr(templateRestriction?.expr || []);
      return;
    }
    setExpr([]);
  };

  return (
    <>
      <Modal
        title={'编辑计算公式'}
        open={open}
        onOk={onSubmit}
        width={600}
        onCancel={onCancel}
        getContainer={false}
        destroyOnClose
      >
        <div className={styles.compute}>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <div className={styles.textArea}>
                <span className='mr-8 fn-12'>计算公式 =</span>
                {expr.map((item) => (
                  <span className={styles.exprItem} key={Math.random()}>
                    {item.label}
                  </span>
                ))}

                <div style={{ position: 'absolute', bottom: '4px', right: '10px' }}>
                  <LeftSquareOutlined className='fn-16 mr-5' onClick={onDelete} />
                  <DeleteOutlined className='fn-16' onClick={onClear} />
                </div>
              </div>
            </Col>
            <Col span={3} className='fn-12 ct'>
              计算对象：
            </Col>
            <Col span={20}>{renderTags(propertyObjects)}</Col>
            <Col span={3} className='fn-12'>
              计算符号：
            </Col>
            <Col span={20}>{renderTags(operationList)}</Col>
            <Col span={3} className='fn-12'>
              数字键盘：
            </Col>
            <Col span={20}>
              <div style={{ width: 100 }}>{renderTags(numberList)}</div>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default Formula;
