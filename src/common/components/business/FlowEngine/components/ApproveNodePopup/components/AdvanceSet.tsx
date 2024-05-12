import { useMethods } from '@lhb/hook';
import { Checkbox, Form, Input, Select, Space } from 'antd';
import cs from 'classnames';
import React, { FC, useEffect } from 'react';

import ContainerHeader from '../../ContainerHeader';
import { NodeTemplates, OptionTypes } from '../../../utils/flow';
import styles from './index.module.less';

const AdvanceSet: FC<any> = ({
  objRef,
  setCopyObjRef,
  rejectNodeOptions,
  form,
}) => {
  const [showRebutSelect, setShowRebutSelect] = React.useState(false);
  const methods = useMethods({
    onCheckChange(e: { target: { checked: any } }, index: string | number) {
      objRef.buttons[index].enable = e.target.checked ? 1 : 0;
      setCopyObjRef({ ...objRef });
      if (objRef.buttons[index].code === 'rebut') {
        setShowRebutSelect(e.target.checked);
        // 如果取消勾选驳回，清空驳回设置
        if (!e.target.checked) {
          setCopyObjRef({ ...objRef, rejectNode: null, alternateRejectNode: false });
        }
      }
    },
    onInputChange(
      e: { target: { value: any } },
      index: string | number,
      type: string,
    ) {
      const value = e.target.value;
      objRef.buttons[index][type] = value.trim();
      setCopyObjRef({ ...objRef });
    },
    onBlurChange(e: { target: { value: any } }, index: string | number) {
      const value = e.target.value;
      if (!value.trim()) {
        objRef.buttons[index].alias = objRef.buttons[index].name;
        setCopyObjRef({ ...objRef });
      }
    },
    onCallbackParamsInputChange(
      e: { target: { value: any } },
      index: string | number,
      type: string,
    ) {
      const value = e.target.value;
      if (objRef.hasOwnProperty('callbackParams') && !!objRef.callbackParams) {
        // 老数据兼容，可能没有callbackParams,或者值为 null
        objRef.callbackParams[type] = value.trim();
      } else {
        objRef.callbackParams = {
          ...NodeTemplates[OptionTypes.APPROVER].callbackParams,
          [type]: value.trim(),
        };
      }
      setCopyObjRef({ ...objRef });
    },
    onCallbackParamsBlurChange(
      e: { target: { value: any } },
      index: string | number,
      type: string,
    ) {
      const value = e.target.value;
      if (!value.trim()) {
        objRef.callbackParams[type] = null;
        setCopyObjRef({ ...objRef });
      }
    },
    handleRejectNodeChange(value: string) {
      setCopyObjRef({ ...objRef, rejectNode: value });
    },
    handleAlternateRejectNodeChange(value: any) {
      setCopyObjRef({ ...objRef, alternateRejectNode: value.target?.checked });
    }
  });

  useEffect(() => {
    // 初始化是否显示驳回设置
    if (objRef.buttons) {
      let flag = false;
      objRef.buttons.forEach((item: any) => {
        if (item.code === 'rebut') {
          flag = true;
          setShowRebutSelect(!!item.enable);
        }
      });
      if (!flag) {
        setShowRebutSelect(false);
      }
    }
  }, [objRef.buttons]);

  return (
    <>
      <ContainerHeader title={'操作'} />
      <div className={styles.container}>
        {objRef &&
          objRef.buttons.map((item: any, index: number) => {
            return (
              <Space className={styles.mt8} key={index} direction='vertical'>
                <Space>
                  <Checkbox
                    checked={!!item.enable}
                    onChange={(e) => {
                      methods.onCheckChange(e, index);
                    }}
                  >
                    {`${item.name}，显示为：`}
                  </Checkbox>
                  <Input
                    value={item.alias}
                    maxLength={10}
                    onChange={(e) => {
                      methods.onInputChange(e, index, 'alias');
                    }}
                    onBlur={(e) => {
                      methods.onBlurChange(e, index);
                    }}
                  />
                </Space>
                <Space className={styles.message} size={'middle'}>
                  <Input
                    value={objRef?.callbackParams?.[item.code] || null}
                    maxLength={500}
                    placeholder='请输入json字符串'
                    onChange={(e) => {
                      methods.onCallbackParamsInputChange(e, index, item.code);
                    }}
                    onBlur={(e) => {
                      methods.onCallbackParamsBlurChange(e, index, item.code);
                    }}
                  />
                  <span>调用通知：</span>
                </Space>
              </Space>
            );
          })}
      </div>
      {showRebutSelect && (
        <>
          <ContainerHeader title={'驳回设置'} className={styles.mt16} />
          <Space className={cs(styles.mt16, styles.ml20)}>
            <Form form={form}>
              <Form.Item
                style={{ marginBottom: 12 }}
                rules={[{ required: true, message: '请选择驳回节点' }]}
                name={'rejectNode'}
                initialValue={objRef.rejectNode}
              >
                <Select
                  // value={objRef.rejectNode}
                  style={{ width: 160 }}
                  onChange={methods.handleRejectNodeChange}
                  options={rejectNodeOptions}
                />
              </Form.Item>
              <Form.Item
                valuePropName='checked'
                name={'alternateRejectNode'}
                initialValue={objRef.alternateRejectNode}
              >
                <Checkbox onChange={methods.handleAlternateRejectNodeChange}> 允许用户自由选择驳回节点</Checkbox>
              </Form.Item>
            </Form>
          </Space>
        </>
      )}
    </>
  );
};

export default AdvanceSet;
