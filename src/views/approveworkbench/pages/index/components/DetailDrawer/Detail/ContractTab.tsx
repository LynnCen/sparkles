/**
 * @Description 鱼你-审批详情-合同信息TAB
 */
import { FC, useEffect, useState } from 'react';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { Row, Col } from 'antd';
import { shopContract } from '@/common/api/approveworkbench';
import { isDef } from '@lhb/func';

export interface ContractTabProps {
  contractId?: number;
}

// 是否加入条款
enum CompetitionClause {
  Have = 1, // 有
  None = 2, // 无
}

// 租金模式
enum RentalModel {
  Fixed = 1, // 固定
  Reduce = 2, // 扣点
  High = 3, // 取高
  Other = 4, // 其他
}

// 支付方式
enum PayWay {
  Month = 1, // 月付
  Season = 2, // 季付
  HalfYear = 3, // 半年付
  Year = 4, // 年付
}

// 选项值与名称映射
const Selections: any = {
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

const ContractTab: FC<ContractTabProps> = ({
  contractId
}) => {
  const [detail, setDetail] = useState<any>({});

  useEffect(() => {
    contractId && getDetail(contractId);
  }, [contractId]);

  const getDetail = async(id: number) => {
    const data = await shopContract({ id });
    data && setDetail(data);
  };

  // 是否展示连续几年的租金
  const isShowYearsRent = () => {
    return detail.rentModel === RentalModel.Fixed || detail.rentModel === RentalModel.High || detail.rentModel === RentalModel.Other;
  };

  // 是否展示扣点值
  const isShowDeductionPoint = () => {
    return detail.rentModel === RentalModel.Reduce || detail.rentModel === RentalModel.High;
  };

  // 展示的是否加入条款
  const withCompetitionClauseName = () => {
    let name = '';
    const options = Selections.withCompetitionClause.filter((itm: any) => isDef(detail.withCompetitionClause) && itm.id === +detail.withCompetitionClause);
    !!options.length && (name = options[0].name);
    return name;
  };

  // 展示的租金模式
  const rentModelName = () => {
    let name = '';
    const options = Selections.rentModel.filter((itm: any) => isDef(detail.rentModel) && itm.id === +detail.rentModel);
    !!options.length && (name = options[0].name);
    return name;
  };

  // 展示的支付方式
  const payWayName = () => {
    let name = '';
    const options = Selections.payWay.filter((itm: any) => isDef(detail.payWay) && itm.id === +detail.payWay);
    !!options.length && (name = options[0].name);
    return name;
  };

  return (
    <div className='pb-16 pr-16'>
      <TitleTips name='合同审批' showTips={false} />
      <V2DetailGroup>
        <Row gutter={24}>
          <Col span={12}>
            <V2DetailItem label='合同是否加入无竞争条款' value={withCompetitionClauseName()} />
          </Col>
          <Col span={12}>
            <V2DetailItem label='合同开始时间' value={detail.startDate} />
          </Col>
          <Col span={12}>
            <V2DetailItem label='合同结束时间' value={detail.endDate} />
          </Col>
          <Col span={12}>
            <V2DetailItem label='免租期' value={detail.rentFreePeriod ? `${detail.rentFreePeriod}天` : detail.rentFreePeriod} />
          </Col>
          <Col span={12}>
            <V2DetailItem label='租金模式' value={rentModelName()} />
          </Col>
          {
            isShowYearsRent() && <>
              <Col span={12}>
                <V2DetailItem label='首年月租金' value={isDef(detail.firstYearRent) ? `${detail.firstYearRent}	元` : detail.firstYearRent} />
              </Col>
              <Col span={12}>
                <V2DetailItem label='次年月租金' value={isDef(detail.secYearRent) ? `${detail.secYearRent}	元` : detail.secYearRent} />
              </Col>
              <Col span={12}>
                <V2DetailItem label='第三年月租金' value={isDef(detail.thirdYearRent) ? `${detail.thirdYearRent}	元` : detail.thirdYearRent} />
              </Col>
              <Col span={12}>
                <V2DetailItem label='年递增幅度' value={isDef(detail.annualIncrease) ? `${detail.annualIncrease}%` : detail.annualIncrease} />
              </Col>
            </>
          }
          {
            isShowDeductionPoint() && <Col span={12}>
              <V2DetailItem label='扣点值' value={isDef(detail.deductionPoint) ? `${detail.deductionPoint}%` : detail.deductionPoint} />
            </Col>
          }
          <Col span={12}>
            <V2DetailItem label='付款方式' value={payWayName()} />
          </Col>
          <Col span={12}>
            <V2DetailItem label='上传资料' type='images' assets={Array.isArray(detail.attachmentUrls) ? detail.attachmentUrls.map(itm => ({ url: itm })) : []}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='备注' value={detail.remark} type='textarea'/>
          </Col>
        </Row>
      </V2DetailGroup>
    </div>
  );
};

export default ContractTab;
