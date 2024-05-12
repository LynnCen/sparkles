/**
 * @Description 提前设计表单
 */
import { FC, useEffect } from 'react';
import { Col, Row } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormUpload from '@/common/components/Form/V2FormUpload/V2FormUpload';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import { shopDesignAdvance } from '@/common/api/approveworkbench';
import { isDef } from '@lhb/func';
import { Bucket, bucketMappingDomain } from '@/common/enums/qiniu';
import styles from './index.module.less';

interface DesignFormProps {
  spot?: any; // 点位详情，内含评估id字段evaluationId
  form?: any;
}

// 设计审批状态
export enum ApprovalStatus {
  WaitSubmit = 1,
  Processing,
  Passed,
  Rejected,
}

const DesignForm: FC<DesignFormProps> = ({
  spot,
  form,
}) => {
  useEffect(() => {
    form && form.resetFields();
    if (spot.designAdvanceId) {
      getDesignDetail(spot.designAdvanceId);
    } else { // 从未保存
      form.setFieldsValue({
        approvalStatus: ApprovalStatus.WaitSubmit,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spot]);

  const getDesignDetail = async (id: number) => {
    const data = await shopDesignAdvance({ id });
    if (!data) return;

    // 接口返回状态:null未提交 0待处理,1审批通过,2审批拒绝
    let tmpApprovalStatus = ApprovalStatus.WaitSubmit;
    if (isDef(data.approvalStatus)) {
      const status = +data.approvalStatus;
      switch (status) {
        case 0:
          tmpApprovalStatus = ApprovalStatus.Processing;
          break;
        case 1:
          tmpApprovalStatus = ApprovalStatus.Passed;
          break;
        case 2:
          tmpApprovalStatus = ApprovalStatus.Rejected;
          break;
      }
    }
    data.approvalStatus = tmpApprovalStatus;

    const formData: any = {
      ...data,
    };
    formData.materialUrls = Array.isArray(data.materialUrls) ? data.materialUrls.map((itm: any) => ({ url: itm })) : [];
    form.setFieldsValue(formData);
  };

  return (
    <>
      <V2Form form={form} className={styles.designForm}>
        <Row gutter={24}>
          <Col span={12}>
            <V2FormUpload
              name='materialUrls'
              label='上传资料'
              uploadType='image'
              config={{
                qiniuParams: {
                  domain: bucketMappingDomain['linhuiba-certs'],
                  bucket: Bucket.Certs,
                },
                size: 40,
                maxCount: 20,
              }}
            />
          </Col>
          <Col span={18}>
            <V2FormTextArea
              name='designNotes'
              label='设计信息说明'
              placeholder='请输入设计信息说明，最多输入200字'
              maxLength={200}
              required
              rules={[
                { required: true, message: '请输入设计信息说明' }
              ]}
            />
          </Col>
        </Row>
      </V2Form>
    </>
  );
};

export default DesignForm;
