import { downloadFile } from '@lhb/func';
import { Button, Col, Row } from 'antd';
import { FC } from 'react';
import styles from '../entry.module.less';
import cs from 'classnames';
// import DetailInfo from '@/common/components/business/DetailInfo';
import { valueFormat } from '@/common/utils/ways';

const BaseInfo: FC<any> = ({ result }) => {
  const { businessInformation, flowInformation } = result || {};
  const firstLineInfo = [
    { data: result?.aveFlow, unit: '人', label: '日均过店客流' },
    { data: flowInformation?.flowWeekday, unit: '人', label: '工作日日均过店客流' },
    { data: flowInformation?.flowWeekend, unit: '人', label: '节假日日均过店客流' },
    { data: result?.aveDayRent, unit: '元', label: '租金报价' },
    { data: businessInformation?.contractDateStart && businessInformation?.contractDateEnd
      ? `${valueFormat(businessInformation?.contractDateStart)} ～ ${valueFormat(businessInformation?.contractDateEnd)}` : '-', unit: '', label: '计划开店日期' },
  ];
  const secondLineInfo = [
    { data: result?.passCost, unit: '元', label: '预计单位过店成本' },
    { data: result?.indoorCost, unit: '元', label: '预计单位进店成本' },
    { data: result?.stayInfoCost, unit: '元', label: '预计单位留资成本' },
    { data: result?.testDriveCost, unit: '元', label: '预计单位试驾成本' },

    { data: result?.orderCost, unit: '元', label: '预计单位大定成本' },


  ];

  const content = (item) => (<div className={styles.labelCon}>
    <div>
      <span className={styles.number}>{valueFormat(item.data)}</span>
      <span className={styles.unit}>{item.unit}</span>
    </div>
    <div className={styles.label}>{item.label}</div>
  </div>);

  return (
    <div className={styles.baseInfoCon}>

      <div>
        <span className={styles.topTitle}>{result?.chancePointName}</span>

        <Button
          onClick={() =>
            downloadFile({
              name: '奥体印象城项目报告.pdf',
              url: 'https://staticres.linhuiba.com/project-custom/locationpc/file/奥体印象城项目报告.pdf',
            })
          }
          className={styles.exportBtn}
          type='primary'
        >
          导出报告
        </Button>
      </div>

      <div className={cs(styles.title, 'mt-16')}>基本信息</div>

      <Row className='mt-10'>
        {/* <Col className={styles.leftCon} span={7}>
          <DetailInfo
            title='当前阶段'
            value={result?.shopStatusName}
            span={24}
          />
          <DetailInfo title='调研时间' value={result?.submitTime} span={24} />
          <DetailInfo title='责任人' value={result?.responsibleName} span={24} />
          <DetailInfo
            title='审批状态'
            value={result?.approvalStatusName}
            span={24}
            valueClass={
              result?.approvalStatus !== 3 ? styles.approvalStatus : ''
            }
          />
          <DetailInfo title='审批人' value={result?.approverName} span={24} />
          <DetailInfo title='审批时间' value={result?.approvalTime} span={24} />
          <DetailInfo
            title='审批意见'
            value={result?.approvalRemark}
            span={24}
            valueClass={styles.approvalTime}
          />
        </Col> */}

        <Col className={styles.rightCon}span={24}>
          <div className={styles.firstLine}>
            {firstLineInfo.map((item, index) =>
              <div key={index}>
                {content(item)}
              </div>
            )}
          </div>

          <div className={styles.secondLine}>
            {secondLineInfo.map((item, index) =>
              <div key={index}>
                {content(item)}
              </div>
            )}
          </div>

        </Col>
      </Row>
    </div>
  );
};
export default BaseInfo;
