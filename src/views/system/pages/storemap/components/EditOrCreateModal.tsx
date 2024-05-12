/**
 * @Description
 */
import V2Title from '@/common/components/Feedback/V2Title';
import V2Form from '@/common/components/Form/V2Form';
import V2FormCheckbox from '@/common/components/Form/V2FormCheckbox/V2FormCheckbox';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import { useMethods } from '@lhb/hook';
import { Col, Form, Modal, Row } from 'antd';
import styles from './index.module.less';
import { FC, useEffect, useState } from 'react';
import {
  getStoreMapConfigDetail,
  getStoreMapConfigSelection,
  saveStoreMapConfig,
} from '@/common/api/system';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import V2Empty from '@/common/components/Data/V2Empty';
import { refactorSelection } from '@lhb/func';

interface Props {
  id?: number; // 条目id
  open: boolean; // 弹窗是否可见
  setOpen: Function;
  isEdit: boolean; // 是否为编辑
  refresh: Function; // 刷新列表
}

// 新增/编辑弹窗
const EditOrCreateModal: FC<Props> = ({ id, open, isEdit, setOpen, refresh }) => {
  const [form] = Form.useForm();
  const [shopStatusSelection, setShopStatusSelection] = useState<any>([]); // 门店状态筛选项
  const [chancePointStatusSelection, setChancePointStatusSelection] = useState<any>([]); // 机会点状态筛选项

  useEffect(() => {
    form.resetFields();
    open && methods.getSelection();
    isEdit && methods.getCurConfigInfo();
  }, [open, isEdit]);

  const methods = useMethods({
    // 当弹窗为编辑的时候，获取当前的配置信息
    async getCurConfigInfo() {
      const res = await getStoreMapConfigDetail({ id });
      const { name, comment, pointStatuses, shopStatuses } = res;
      // 加载当前配置信息
      form.setFieldsValue({ name, comment, pointStatuses, shopStatuses });
    },

    // 获取配置的筛选项目
    async getSelection() {
      const res = await getStoreMapConfigSelection({ id: isEdit ? id : undefined });
      const { shopStatusList, chancePointStatusList } = res;
      shopStatusList && setShopStatusSelection(shopStatusList);
      chancePointStatusList && setChancePointStatusSelection(chancePointStatusList);
    },

    // 确认
    async onOk() {
      const { ...values } = await form.validateFields();
      try {
        const { name, comment, pointStatuses, shopStatuses } = values;
        // 保存配置信息
        saveStoreMapConfig({
          id: isEdit ? id : null,
          name,
          comment,
          pointStatuses,
          shopStatuses,
        }).then(() => {
          V2Message.success(isEdit ? '保存成功' : '新增成功');
          setOpen(false);
          refresh();
        });
      } catch (error) {
        V2Message.error(isEdit ? '保存失败' : '新增失败，请稍后再试');
      }
    },

    // 取消
    onCancel() {
      setOpen(false);
    },
  });

  // 在这里编写组件的逻辑和渲染
  return (
    <Modal
      title={
        <>
          <div>
            {isEdit ? '编辑' : '新增类别'}
            <span className={styles.tips}>
              （一个机会点/门店状态只能被一个类别引用,不可被多个类别引用）
            </span>
          </div>
        </>
      }
      open={open}
      onOk={methods.onOk}
      width={680}
      onCancel={methods.onCancel}
      destroyOnClose
      className={styles.editOrCreateModal}
    >
      <V2Form form={form}>
        <Row gutter={24}>
          <Col span={12}>
            <V2FormInput
              required
              label='类别名称'
              name='name'
              maxLength={10}
              config={{ showCount: true }}
            />
          </Col>
          <Col span={12}>
            <V2FormTextArea
              maxLength={30}
              label='类别名称注释'
              name='comment'
              config={{ showCount: true }}
            />
          </Col>
        </Row>

        <V2Title type='H2' divider text='包含机会点状态' style={{ marginBottom: '12px' }} />
        {chancePointStatusSelection.length ? (
          <V2FormCheckbox
            name='pointStatuses'
            options={refactorSelection(chancePointStatusSelection)}
          />
        ) : (
          <V2Empty />
        )}

        <V2Title type='H2' divider text='包含门店状态' style={{ marginBottom: '12px' }} />
        {shopStatusSelection.length ? (
          <V2FormCheckbox
            name='shopStatuses'
            options={refactorSelection(shopStatusSelection)}
          />
        ) : (
          <V2Empty />
        )}
      </V2Form>
    </Modal>
  );
};

export default EditOrCreateModal;
