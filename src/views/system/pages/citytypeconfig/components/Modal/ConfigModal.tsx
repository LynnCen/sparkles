/**
 * @Description
 */
import V2Form from '@/common/components/Form/V2Form';
import { useMethods } from '@lhb/hook';
import { Col, Form, Modal, Row } from 'antd';
import { FC, useMemo, useState } from 'react';
import { CityTypes } from '../../ts-config';
import { MinusCircleOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2Operate from '@/common/components/Others/V2Operate';
import IconFont from '@/common/components/Base/IconFont';
import { v4 } from 'uuid';
import { postChangeCityConfigTypes } from '@/common/api/system';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

interface Props {
  visible:boolean; // 弹窗显示
  setVisible:(vis:boolean)=>void; // 控制弹窗可见
  refresh:()=>void; // 刷新前置列表
  data:CityTypes[]; // 城市类型配置项列表
}

const ConfigModal: FC<Props> = ({
  visible,
  setVisible,
  refresh,
  data,
}) => {
  // 在这里编写组件的逻辑和渲染

  const [form] = Form.useForm();
  const [fields, setFields] = useState<CityTypes[]>(data);
  const [confirmLoading, setConfirmLoading] = useState<boolean>();

  // 初始化form表单值
  const initValues = useMemo(() => {
    let inits = {};
    data.forEach((item) => (inits = { ...inits, [item.id]: item.areaTypeName }));
    return inits;
  }, [data]);

  /**
   * @description 检查重名
   */
  const checkNameIsExit = async (value) => {
    const fieldValues = form.getFieldsValue();
    const values = Object.values(fieldValues).filter(field => field !== undefined && field !== ''); // 过滤掉空值情况
    const hasRepeat = countOccurrences(values, value); // 判断是否重复
    if (hasRepeat >= 2) {
      return Promise.reject();
    }
    return Promise.resolve();
  };

  /**
   * @description 判断是否有重复值
   * @param arr 数组
   * @param element 元素
   * @return
   */
  const countOccurrences = (arr, element) => {
    return arr.reduce((count, item) => (item === element ? count + 1 : count), 0);
  };

  const methods = useMethods({
    /**
     * @description 点击提交
     */
    onOk() {
      form.validateFields().then(async (values: any) => {
        const areaNames = Object.values(values);
        setConfirmLoading(true);
        try {
          const res = await postChangeCityConfigTypes({ areaNames });
          res && V2Message.success('修改成功');
          setVisible(false);
          setConfirmLoading(false);
          refresh(); // 重新请求城市类型
        } catch (error) {
          setVisible(false);
          setConfirmLoading(false);
        }
      });
    },

    /**
     * @description 添加字段
     */
    handleAddField: () => {
      const newFields = fields.slice();
      newFields.push({
        id: v4(),
        areaTypeName: '',
        forbid: false,
        edit: true });
      setFields(newFields);
    },

    /**
     * @description 删除某个字段
     */
    handleDeleteField: (id) => {
      setFields(fields.filter(field => field.id !== id));
    },
  });

  return (
    <Modal
      title='配置区域类型'
      open={visible}
      onOk={methods.onOk}
      width={712}
      onCancel={() => setVisible(false)}
      forceRender
      confirmLoading={confirmLoading}
    >
      <V2Form form={form} initialValues={initValues}>
        <Row>
          {fields.map((item, index) => <Col span={12} key={index}>
            <div className={styles.field}>
              <V2FormInput
                name={item.id}
                maxLength={8}
                config={{
                  style: { width: '288px' },
                }}
                disabled={!item.edit}
                rules={[
                  { required: true, message: '类型名称必填' },
                  { validator: (_, val) => checkNameIsExit(val), message: '类型名称不可以重复', validateTrigger: 'onBlur' }
                ]}
                formItemConfig={{
                  validateFirst: true,
                  validateTrigger: ['onChange', 'onBlur']
                }}
              />
              {!item.forbid && <MinusCircleOutlined
                style={{ fontSize: '16px' }}
                className={styles.minusIcon}
                onClick={() => methods.handleDeleteField(item.id)}
              />}
            </div>
          </Col>)}
        </Row>
      </V2Form>

      {fields.length < 18 && <V2Operate
        showBtnCount={5}
        operateList={[
          {
            name: '添加',
            event: 'addField',
            func: 'handleAddField',
            icon: <IconFont className={styles.icon} iconHref='icon-ic_add'/>,
          }
        ]}
        onClick={(btns: { func: string | number }) => methods[btns.func]()}
      />}
    </Modal>
  );
};

export default ConfigModal;
