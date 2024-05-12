import { useMethods } from '@lhb/hook';
import { Button, Drawer, Form, message } from 'antd';
import { FC, useEffect, useMemo } from 'react';
import { debounce } from '@lhb/func';
import styles from './index.module.less';
import cs from 'classnames';
import FormCheckbox from '@/common/components/Form/FormCheckbox';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Target, TargetChild } from '../../ts-config'; import { dispatchNavigate } from '@/common/document-event/dispatch';
import { useSelector } from 'react-redux';
 interface SelectionProps {
  showSelection: boolean,
  setShowSelection: Function,
  selected: Array<TargetChild>,
  setSelected: Function,
  targets: Array<TargetChild>
}

const Selection: FC<SelectionProps> = ({
  showSelection,
  setShowSelection,
  selected,
  setSelected,
  targets = []
}) => {
  const [form] = Form.useForm();

  // 是否打开转化率洞察
  const { conversionFlag } = useSelector((state: any) => state.common.tenantCheck);

  const options: Array<Target> = useMemo(() => {
    const result: any = new Map();
    if (targets && targets.length > 0) {
      targets.forEach((e, index) => {
        let item = result.get(e.metaTypeCode);
        if (!item) {
          result.set(e.metaTypeCode, item = {
            metaTypeCode: e.metaTypeCode,
            metaType: e.metaType,
            children: []
          });
        }
        item.children.push({
          ...item,
          value: index,
          label: e.nameCh
        });
      });
    }
    const resArr = [...result].map((e) => e[1]);
    return resArr;
  }, [targets]);
  const methods = useMethods({
    onClose() {
      setShowSelection(false);
    },
    onModel() {
      dispatchNavigate('/brain/conversioninsight');
    },
  });
  const submitHandle = () => {
    debounceSubmit();
  };
  // 重置
  const onReset = () => {
    form.resetFields();
    debounceSubmit();
  };
  // 查询添加防抖
  const debounceSubmit = debounce(() => {
    const values = form.getFieldsValue();
    const targetArr: Array<TargetChild> = [];
    for (const item of Object.values(values)) {
      if (Array.isArray(item) && item.length > 0) {
        item.forEach(e => targetArr.push({
          ...targets[e],
          value: e
        }));
      }
    }
    if (targetArr.length > 20) {
      message.warn('最多选择20个指标~');
    } else {
      setSelected(targetArr);
      setShowSelection(false);
    }
  }, 500);

  useEffect(() => {
    if (showSelection) {
      form.resetFields();
      let curTypeCode = '';
      let values: Array<number> = [];
      selected.length > 0 && selected.forEach((e, i: number) => {
        if (!curTypeCode) {
          curTypeCode = e.metaTypeCode;
        } else if (e.metaTypeCode !== curTypeCode) {
          form.setFieldValue(curTypeCode, values);
          curTypeCode = e.metaTypeCode;
          values = [];
        }
        values.push(e.value as number);
        if (i === selected.length - 1) {
          form.setFieldValue(curTypeCode, values);
        }
      });
    }
  }, [showSelection, selected, form]);

  return (
    <Drawer
      title='请勾选门店转化率强相关的指标'
      placement='right'
      closable={true}
      keyboard={false}
      maskClosable={false}
      onClose={() => methods.onClose()}
      open={showSelection}
      width={'800px'}
      forceRender
      className={styles.drawer}
    >
      <Form
        form={form}
        onFinish={submitHandle}
        className={cs(styles.formCon)}>

        {/* 入口配置化 */}
        {conversionFlag && <div className={cs(styles.promptWrap, 'mt-16')}>
          <div className={styles.promptLeft}>
            <ExclamationCircleFilled className='mr-5' />
            重点指标不清晰？请选择转化率洞察！
          </div>
          <Button type='primary' className={styles.promptRight} onClick={() => methods.onModel()}>转化率洞察</Button>
        </div>}

        <div className={styles.formWrap}>
          {
            options.length > 0 && options.map((option: Target) => (
              <div className={cs(styles.groupItem, 'mb-18')} key={option.metaTypeCode}>
                <div className={cs(styles.checkboxLabel, 'mb-6')}>{option.metaType}</div>
                <FormCheckbox
                  label=''
                  name={option.metaTypeCode}
                  options={option.children}
                />
              </div>
            ))
          }
        </div>
        <div className={styles.bottom}>
          <Button
            className={cs(styles.resetBtn, 'mr-12')}
            onClick={() => onReset()}>
            清空选择
          </Button>
          <Button
            className={cs(styles.cancelBtn, 'mr-12')}
            type='primary'
            onClick={() => methods.onClose()}>
            取消
          </Button>
          <Button type='primary' htmlType='submit'>
            确定
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default Selection;
