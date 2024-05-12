/**
 * @Description 合同审批提交抽屉
 */
import { FC, useState, useRef, useEffect } from 'react';
import { Space, Button, Form } from 'antd';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Title from '@/common/components/Feedback/V2Title';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import V2Container from '@/common/components/Data/V2Container';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import SelectSpot, { SelectSpotType } from '../SelectSpot';
import ContractForm from './ContractForm';
import { useMethods } from '@lhb/hook';
import styles from './index.module.less';
import { saveShopContract, createApprovalShop } from '@/common/api/approveworkbench';
import dayjs from 'dayjs';

interface ContractApprovalProps {
  open: boolean; // 是否打开抽屉
  setOpen: Function; // 设置是否打开抽屉
  onRefresh?: Function; // 刷新回调
}

const ContractApproval: FC<ContractApprovalProps> = ({
  open,
  setOpen,
  onRefresh
}) => {
  const lockRef = useRef(false);
  const [form] = Form.useForm();
  const [spot, setSpot] = useState<any>({});

  useEffect(() => {
    open && setSpot({});
  }, [open]);

  const {
    confirmHandle,
    closeDrawer,
    confirmClose
  } = useMethods({

    dealSaveParams(formData) {
      let attachmentUrls;
      if (Array.isArray(formData.attachmentUrls)) {
        attachmentUrls = formData.attachmentUrls.map((itm: any) => itm.url);
      }
      const startDate = dayjs(formData.dateRange[0]).format('YYYY-MM-DD');
      const endDate = dayjs(formData.dateRange[1]).format('YYYY-MM-DD');
      delete formData.dateRange;

      const params = {
        ...formData,
        startDate,
        endDate,
        attachmentUrls,
        shopEvaluationId: spot.id,
        id: spot.contractId,
      };
      // console.log('保存用dealParams', params);
      return params;
    },
    async confirmHandle() {
      const values = await form.validateFields();

      if (lockRef.current) return;
      lockRef.current = true;
      const params = this.dealSaveParams(values);

      saveShopContract(params).then(() => {
        createApprovalShop({
          evaluationId: spot.id,
          typeValue: 10, // 申请类型（8点位申请、9设计申请、10合同申请）
        }).then(() => {
          V2Message.success('提交成功');
          onRefresh && onRefresh(); // 刷新列表
          confirmClose(); // 关闭抽屉
        }).finally(() => {
          lockRef.current = false;
        });
      }).finally(() => {
        lockRef.current = false;
      });
    },
    closeDrawer() { // 关闭弹窗时
      V2Confirm({
        onSure: () => {
          confirmClose();
        },
        zIndex: 1010,
        title: '操作提示',
        content: '退出后将不保存当前操作，请确认是否退出。'
      });
    },
    confirmClose() {
      form.resetFields(); // 表单清空
      setOpen(false);
    },
  });

  return (
    <V2Drawer
      open={open}
      onClose={closeDrawer}
      className={styles.formDrawer}
      destroyOnClose>
      <V2Container
        // 24px上padding
        style={{ height: 'calc(100vh - 24px)' }}
        extraContent={{
          top: <V2Title text='合同审批'/>,
          bottom: !!spot.id && <div className={styles.footerCon}>
            <Space size={12}>
              <Button onClick={closeDrawer}>取消</Button>
              <Button type='primary' onClick={confirmHandle}>确定</Button>
            </Space>
          </div>
        }}
      >
        <SelectSpot open={open} selectType={SelectSpotType.CONTRACT} setSpotDetail={setSpot}/>
        {spot.id ? <ContractForm form={form} spot={spot} evaluationId={spot.id}/> : <></>}
      </V2Container>
    </V2Drawer>
  );
};

export default ContractApproval;

