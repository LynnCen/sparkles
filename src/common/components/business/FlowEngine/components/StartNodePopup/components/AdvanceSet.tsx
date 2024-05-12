import ContainerHeader from '../../ContainerHeader';
import { NodeTemplates, OptionTypes } from '../../../utils/flow';
import { useMethods } from '@lhb/hook';
import { Checkbox, Input, Space } from 'antd';
import { FC } from 'react';
import styles from './index.module.less';

const AdvanceSet: FC<any> = ({ objRef, setCopyObjRef }) => {
  const methods = useMethods({
    onCheckChange(e: { target: { checked: any } }, index: string | number) {
      objRef.buttons[index].enable = e.target.checked ? 1 : 0;
      setCopyObjRef({ ...objRef });
    },
    onInputChange(e: { target: { value: any } }, index: string | number) {
      const value = e.target.value;
      objRef.buttons[index].alias = value.trim();
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
  });
  return (
    <>
      <ContainerHeader title={'操作'} />
      <div className={styles.container}>
        {objRef &&
          objRef.buttons.map((item: any, index: any) => {
            return (
              <Space key={index} direction='vertical'>
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
                      methods.onInputChange(e, index);
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
    </>
  );
};

export default AdvanceSet;
