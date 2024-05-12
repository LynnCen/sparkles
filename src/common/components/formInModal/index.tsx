import React, { FC, useEffect, useState } from 'react';
import { Form, FormInstance } from 'antd';
import { unstable_batchedUpdates } from 'react-dom';
import { post } from '@/common/request';
import Modal from '@/common/components/Modal/Modal';
import { isDef } from '@lhb/func';

const { useForm } = Form;

const submitFormByPost = (url: string, data: any, proxyApi?: string): Promise<any> => {
  return post(url, data, {
    proxyApi,
    needHint: true
  });
};

interface FormInModalProps {
  formValue?: any;
  form?: FormInstance
  url?: string;
  proxyApi?: string;
  title?: string;
  visible?: boolean;
  children?: React.ReactNode,
  onSubmit?: (success: boolean, values?: any | Error) => void;
  onCancelSubmit?: (visible: boolean) => void;
  extraData?: any;
  width?: number;
  bodyStyle?: any;
  validateError?: () => boolean;
  transForm?: (values: any) => any;
  [key: string]: any;
};

type ButtonText = '提交' | '正在提交中...'


const FormInModal: FC<FormInModalProps> = (props) => {
  const {
    children,
    visible,
    url = '',
    proxyApi,
    onSubmit,
    onCancelSubmit,
    width = 520,
    title,
    form,
    extraData,
    validateError,
    transForm,
    ...restProps
  } = props;
  let [formInstance] = useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<ButtonText>('提交');

  formInstance = form || formInstance;

  // 克隆表单，将表单的内容可控
  const CloneForm = React.cloneElement(children as any, {
    form: formInstance,
  });


  const setLoadingAndButtonText = (loading: boolean, buttonText: ButtonText) => {
    unstable_batchedUpdates(() => {
      setLoading(loading);
      setButtonText(buttonText);
    });
  };
  /**
 *  支持直接调接口或者由业务使用者自己去处理逻辑调接口
 * url存在直接调用接口进行处理
 * @returns
 */
  // 提交表单
  const onSubmitForm = async () => {
    try {
      const filterExtraData: any = {};
      for (const key in extraData) {
        if (isDef(extraData[key])) {
          filterExtraData[key] = extraData[key];
        }
      }


      let values = await formInstance.validateFields();
      if (transForm) {
        values = transForm(values);
      }

      setLoadingAndButtonText(true, '正在提交中...');
      if (url === '') {
        onSubmit?.(true, { ...values, ...extraData });
        return;
      };

      if (typeof validateError === 'function') {
        const hasValidate = validateError();
        // 过滤掉undefined和null;
        if (hasValidate) {
          submitFormByPost(url, { ...values, ...filterExtraData }, proxyApi).then((result) => {
            onSubmit?.(true, result);
          });
        }
      } else {
        submitFormByPost(url, { ...values, ...filterExtraData }, proxyApi).then((result) => {
          onSubmit?.(true, result);
        });
      }
    } catch (e) {
      onSubmit?.(false, e as Error);
    } finally {
      setLoadingAndButtonText(false, '提交');
    }
  };

  // 重置表单
  const onResetForm = () => {
    formInstance.resetFields();
  };

  // 提交按钮的相关属性
  const okButtonProps = {
    loading,
  };

  // 取消弹框
  const cancelSubmitForm = () => {
    onCancelSubmit?.(!visible);
  };

  useEffect(() => {
    if (visible) {
      !form && onResetForm();
    };
  }, [visible]);

  return (
    <Modal
      destroyOnClose
      title={title}
      width={width}
      open={visible}
      onOk={onSubmitForm}
      onCancel={cancelSubmitForm}
      okText={buttonText}
      forceRender
      okButtonProps={okButtonProps}
      {...restProps}
    >
      {CloneForm}
    </Modal>
  );
};

export default FormInModal;
