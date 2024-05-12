/**
 * @Description 合同审批表单
 */
import { FC, useEffect, useState } from 'react';
import { Row, Col, Form } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import V2FormUpload from '@/common/components/Form/V2FormUpload/V2FormUpload';
import { shopContract, checkShopContractRent } from '@/common/api/approveworkbench';
import { isDef } from '@lhb/func';
import { Bucket, bucketMappingDomain } from '@/common/enums/qiniu';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import dayjs from 'dayjs';
import styles from './index.module.less';

interface ContractFormProps {
  spot?: any; // 点位详情，内含评估id字段evaluationId
  form?: any;
  evaluationId?: number; // 点位评估id，提交用
}

// 是否加入条款
export enum CompetitionClause {
  Have = 1, // 有
  None = 2, // 无
}

// 租金模式
export enum RentalModel {
  Fixed = 1, // 固定
  Reduce = 2, // 扣点
  High = 3, // 取高
  Other = 4, // 其他
}

// 支付方式
export enum PayWay {
  Month = 1, // 月付
  Season = 2, // 季付
  HalfYear = 3, // 半年付
  Year = 4, // 年付
}

// 合同审批状态
export enum ApprovalStatus {
  WaitSubmit = 1,
  Processing,
  Passed,
  Rejected,
}

const selections: any = {
  withCompetitionClause: [
    { id: CompetitionClause.Have, name: '是' },
    { id: CompetitionClause.None, name: '否' },
  ],
  rentModel: [
    { id: RentalModel.Fixed, name: '固定租金' },
    { id: RentalModel.Reduce, name: '扣点租金' },
    { id: RentalModel.High, name: '取高' },
    { id: RentalModel.Other, name: '其他' },
  ],
  payWay: [
    { id: PayWay.Month, name: '月付' },
    { id: PayWay.Season, name: '季付' },
    { id: PayWay.HalfYear, name: '半年付' },
    { id: PayWay.Year, name: '年付' },
  ]
};

const ContractForm: FC<ContractFormProps> = ({
  spot,
  form,
  evaluationId,
}) => {
  const rentModel = Form.useWatch('rentModel', form);

  const [firstYearRentBoolean, setFirstYearRentBoolean] = useState(false); // 首年租金是否超出0.3倍
  const [secYearRentBoolean, setSecYearRentBoolean] = useState(false); // 次年租金是否超出0.3倍
  const [thirdYearRentBoolean, setThirdYearRentBoolean] = useState(false); // 第三年租金是否超出0.3倍

  // 是否展示连续几年的租金
  const showYearRent = rentModel === RentalModel.Fixed || rentModel === RentalModel.High || rentModel === RentalModel.Other;
  // 是否展示扣点值
  const showDeductionPoint = rentModel === RentalModel.Reduce || rentModel === RentalModel.High;

  useEffect(() => {
    form && form.resetFields();
    if (spot.contractId) { // 保存过合同信息
      getContractDetail(spot.contractId);
    } else { // 从未保存
      form.setFieldsValue({
        approvalStatus: ApprovalStatus.WaitSubmit,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spot]);

  const getContractDetail = async (id: number) => {
    const data = await shopContract({ id });
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
    formData.attachmentUrls = Array.isArray(data.attachmentUrls) ? data.attachmentUrls.map((itm: any) => ({ url: itm })) : [];
    formData.dateRange = [dayjs(data.startDate), dayjs(data.endDate)];
    delete formData.startDate;
    delete formData.endDate;

    form.setFieldsValue(formData);
  };

  // 首年租金输入变动
  const onChangeFirstYearRent = (val: any) => {
    val && checkRentResult(val, 1);
  };
  // 次年租金输入变动
  const onChangeSecYearRent = (val: any) => {
    val && checkRentResult(val, 2);
  };
  // 第三年租金输入变动
  const onChangeThirdYearRent = (val: any) => {
    val && checkRentResult(val, 3);
  };

  const checkRentResult = (inputStr: string, yearType: number) => {
    let params = {};
    switch (yearType) {
      case 1:
        params = {
          shopEvaluationId: evaluationId,
          firstYearRent: +inputStr
        };
        break;
      case 2:
        params = {
          shopEvaluationId: evaluationId,
          secYearRent: +inputStr
        };
        break;
      case 3:
        params = {
          shopEvaluationId: evaluationId,
          thirdYearRent: +inputStr
        };
        break;
      default:
        // 预期以外的调用
        return;
    }
    checkShopContractRent(params).then((data: any) => {
      if (data) {
        if (yearType === 1 && isDef(data.firstYearRentBoolean)) {
          setFirstYearRentBoolean(data.firstYearRentBoolean);
          form.validateFields(['firstYearRent']);
        }
        if (yearType === 2 && isDef(data.secYearRentBoolean)) {
          setSecYearRentBoolean(data.secYearRentBoolean);
          form.validateFields(['secYearRent']);
        }
        if (yearType === 3 && isDef(data.thirdYearRentBoolean)) {
          setThirdYearRentBoolean(data.thirdYearRentBoolean);
          form.validateFields(['thirdYearRent']);
        }
      }
    });
  };

  return (
    <>
      <V2Form form={form} className={styles.contractForm}>
        <Row gutter={24}>
          <Col span={12}>
            <V2FormSelect
              label='合同是否加入无竞争条款'
              name='withCompetitionClause'
              options={selections.withCompetitionClause}
              config={{
                fieldNames: { label: 'name', value: 'id' }
              }}
              required
            />
          </Col>
          <Col span={12}>
            <V2FormRangePicker
              label='合同时间区间'
              name='dateRange'
              required
            />
          </Col>
          <Col span={12}>
            <V2FormInputNumber
              name='rentFreePeriod'
              label='免租期'
              placeholder='请输入免租天数'
              required
              rules={[{ required: true, message: '请输入免租天数' }]}
              config={{
                max: 999999,
                min: 0,
                addonAfter: '天',
                precision: 0,
              }}
            />
          </Col>
          <Col span={24}>
            <V2FormRadio
              name='rentModel'
              label='租金模式'
              options={selections.rentModel.map(itm => ({
                label: itm.name, value: itm.id,
              }))}
              required
            />
          </Col>
          {
            showYearRent && <>
              <Col span={12}>
                <V2FormInputNumber
                  name='firstYearRent'
                  label='首年月租金'
                  required
                  rules={[
                    { required: true, message: '请填写首年月租金' },
                    () => ({
                      validator() {
                        if (firstYearRentBoolean) {
                          return Promise.reject(`租金金额超出点址评估阶段记录金额的30%`);
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                  config={{
                    max: 999999999,
                    min: 0,
                    addonAfter: '元',
                  }}
                  onChange={onChangeFirstYearRent}
                />
              </Col>
              <Col span={12}>
                <V2FormInputNumber
                  name='secYearRent'
                  label='次年月租金'
                  required
                  rules={[
                    { required: true, message: '请填写次年月租金' },
                    () => ({
                      validator() {
                        if (secYearRentBoolean) {
                          return Promise.reject(`租金金额超出点址评估阶段记录金额的30%`);
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                  config={{
                    max: 999999999,
                    min: 0,
                    addonAfter: '元',
                  }}
                  onChange={onChangeSecYearRent}
                />
              </Col>
              <Col span={12}>
                <V2FormInputNumber
                  name='thirdYearRent'
                  label='第三年月租金'
                  required
                  rules={[
                    { required: true, message: '请填写第三年月租金' },
                    () => ({
                      validator() {
                        if (thirdYearRentBoolean) {
                          return Promise.reject(`租金金额超出点址评估阶段记录金额的30%`);
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                  config={{
                    max: 999999999,
                    min: 0,
                    addonAfter: '元',
                  }}
                  onChange={onChangeThirdYearRent}
                />
              </Col>
              <Col span={12}>
                <V2FormInputNumber
                  name='annualIncrease'
                  label='年递增幅度'
                  placeholder='请输入递增情况'
                  required
                  rules={[
                    { required: true, message: '请输入递增情况' }
                  ]}
                  config={{
                    max: 100,
                    min: 0,
                    addonAfter: '%',
                  }}
                />
              </Col>
            </>
          }
          {
            showDeductionPoint && <>
              <Col span={12}>
                <V2FormInputNumber
                  name='deductionPoint'
                  label='扣点值'
                  placeholder='请输入物业扣点数'
                  required
                  rules={[
                    { required: true, message: '请填写扣点' }
                  ]}
                  config={{
                    max: 100,
                    min: 0,
                    addonAfter: '%',
                  }}
                />
              </Col>
            </>
          }
          <Col span={12}>
            <V2FormSelect
              name='payWay'
              label='付款方式'
              options={selections.payWay}
              required
              config={{
                fieldNames: { label: 'name', value: 'id' },
              }}
            />
          </Col>
          <Col span={12}>
            <V2FormUpload
              name='attachmentUrls'
              label='上传合同附件'
              uploadType='image'
              config={{
                qiniuParams: {
                  domain: bucketMappingDomain['linhuiba-certs'],
                  bucket: Bucket.Certs,
                },
                size: 40,
                maxCount: 20,
              }}
              rules={[
                { required: true, message: '请上传合同附件' }
              ]}
            />
          </Col>
          <Col span={18}>
            <V2FormTextArea
              name='remark'
              label='备注'
              placeholder='请输入备注，最多输入200字'
              maxLength={200}
            />
          </Col>
        </Row>
      </V2Form>
    </>
  );
};

export default ContractForm;
