/**
 * @Description 商圈的编辑标签弹窗
 *
 * 使用例子
 *
 *    <LabelEdit
        visible={visible}
        id={id}
        setVisible={setVisible}
        optionsChanged={optionsChanged}
        onChanged={onChanged}
      />
 *
 */

import { FC, useEffect, useRef, useState } from 'react';
import { Form, Modal } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import FormInput from '@/common/components/Form/FormInput';
import V2FormSelector from '@/common/components/Form/V2FormSelector/V2FormSelector';
import IconFont from '@/common/components/IconFont';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { typeLabelImgMap } from '../../ts-config';
import styles from './index.module.less';
import cs from 'classnames';
import { useMethods } from '@lhb/hook';
import {
  getLabels,
  getLabelRelations,
  createCustomLabels,
  saveLabelRelations,
} from '@/common/api/networkplan';
import { isArray } from '@lhb/func';

const LabelEdit: FC<any> = ({
  visible,
  setVisible,
  id, // 商圈id
  optionsChanged, // 选项变动
  onChanged, // 编辑后的刷新回调
}) => {
  const [form] = Form.useForm();
  const radioRef = useRef<any>(null);
  const [isLock, setIsLock] = useState<boolean>(false);
  const [radioOptions, setRadioOptions] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [customLabels, setCustomLabels] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      getDetail();
    } else {
      setIsAdding(false);
    }
  }, [visible]);

  /**
   * @description 取消/完成新增自定义标签的编辑后，清空输入框
   */
  useEffect(() => {
    if (!isAdding) {
      form.setFieldValue('addLabel', '');
    }
  }, [isAdding]);

  /**
   * @description 获取标签
   * @param addedLabel 刚刚新增的自定义标签，需要自动选中
   */
  const getDetail = (addedLabel = null) => {
    // 所有网规标签
    getLabels({ labelType: 2 }).then((data) => {
      isArray(data) && setRadioOptions(data.map(obj => ({
        label: <img src={typeLabelImgMap.get(obj.name) || ''} className={styles.typeLabel}/>,
        value: obj.name
      })));
    });

    // 所有自定义标签
    getLabels({ labelType: 3 }).then((data) => {
      isArray(data) && setCustomLabels(data.map(obj => obj.name));
    });

    if (addedLabel) {
      // 刚刚新增的自定义标签，需要自动选中
      const lbls = form.getFieldValue('labels');
      const tmpLbls = isArray(lbls) ? lbls : [];
      tmpLbls.push(addedLabel);
      form.setFieldValue('labels', tmpLbls);
      return;
    }

    // 当前商圈设定的网规标签、自定义标签
    getLabelRelations({ modelClusterId: id }).then((data) => {
      // 网规标签
      const curTypeLabels = data['2'];
      if (isArray(curTypeLabels) && curTypeLabels.length) {
        form.setFieldValue('typeLabel', curTypeLabels[0].name);
        radioRef.current?.initClearCom();
      }
      // 自定义标签
      const curCustomLabels = data['3'];
      if (isArray(curCustomLabels)) {
        form.setFieldValue('labels', curCustomLabels.map(obj => obj.name));
      }
    });
  };

  const methods = useMethods({
    // 取消添加
    handleCancelAdd() {
      setIsAdding(false);
    },
    // 确认添加
    handleConfirmAdd() {
      const text = form.getFieldValue('addLabel');
      if (!text) {
        V2Message.error(`请输入自定义标签`);
        return;
      }
      if (customLabels.includes(text) || radioOptions.map(itm => itm.value).includes(text)) {
        V2Message.error(`已存在${text}这个标签`);
        return;
      }

      createCustomLabels({ labelNames: [text] }).then(boolVal => {
        if (boolVal) {
          getDetail(text);
          setIsAdding(false);
          optionsChanged && optionsChanged();
        }
      });
    },
    // 提交
    async handleOk() {
      if (isLock) return;

      const params = form.getFieldsValue();
      const { typeLabel, labels } = params;
      setIsLock(true);
      const resTypeLabel = await saveLabelRelations({
        modelClusterId: id,
        labelType: 2, // 网规标签
        labelNames: typeLabel ? [typeLabel] : [],
      }).finally(() => {
        setIsLock(false);
      });

      setIsLock(true);
      const resCustomLabel = await saveLabelRelations({
        modelClusterId: id,
        labelType: 3, // 自定义标签
        labelNames: isArray(labels) ? labels : [],
      }).finally(() => {
        setIsLock(false);
      });

      setIsLock(false);

      if (resTypeLabel && resCustomLabel) {
        V2Message.success('编辑成功');
        onChanged && onChanged();
        setVisible(false);
      }
    }
  });

  const checkInput = (_, val: string) => {
    if (!val) return Promise.reject(new Error(`请输入自定义标签`));

    if (customLabels.includes(val) || radioOptions.map(itm => itm.value).includes(val)) {
      return Promise.reject(new Error(`已存在${val}这个标签`));
    } else {
      return Promise.resolve();
    }
  };

  return (
    <Modal
      title='编辑标签'
      width={378}
      open={visible}
      destroyOnClose
      onCancel={() => setVisible(false)}
      onOk={methods.handleOk}
      className={styles.labelEdit}
    >
      <V2Form form={form}>
        <V2FormRadio
          ref={radioRef}
          form={form}
          name='typeLabel'
          label='网规标签'
          options={radioOptions}
          canClearEmpty
        />
        <div>
          <div className='c-222 fs-14 bold mb-12'>自定义标签</div>
        </div>
        {
          isAdding ? <FormInput
            name='addLabel'
            placeholder='请输入标签名'
            maxLength={10}
            removeSpace
            config={{
              showCount: true,
              allowClear: true,
              suffix: <div className={cs(styles.suffixWrapper, 'fs-12 pl-8')}>
                <span className={styles.suffixBtn} onClick={methods.handleCancelAdd}>取消</span>
                <span className={cs(styles.suffixBtn, 'ml-8')} onClick={methods.handleConfirmAdd}>确定</span>
              </div>
            }}
            formItemConfig={{
              rules: [{ validator: checkInput }]
            }}
          /> : <div className={cs(styles.addBtn, 'c-006')} onClick={() => setIsAdding(true)}>
            <IconFont iconHref='iconxq_ic_jiaqingdan_normal' className='fs-16' />
            <div className='ml-4 fs-12'>新增自定义标签</div>
          </div>
        }
        <div className={cs(styles.labelsWrapper, 'mt-12')}>
          <V2FormSelector
            label=''
            name='labels'
            mode='multiple'
            options={customLabels.map(itm => ({ label: itm, value: itm }))}
          />
        </div>
      </V2Form>
    </Modal>
  );
};

export default LabelEdit;
