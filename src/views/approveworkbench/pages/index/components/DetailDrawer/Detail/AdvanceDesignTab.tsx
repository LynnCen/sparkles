/**
 * @Description 鱼你-审批详情-提前设计TAB
 */
import { FC, useEffect, useState } from 'react';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { Row, Col } from 'antd';
import { shopDesignAdvance } from '@/common/api/approveworkbench';

export interface AdvanceDesignTabProps {
  designAdvanceId?: number;
}

const AdvanceDesignTab: FC<AdvanceDesignTabProps> = ({
  designAdvanceId
}) => {
  const [detail, setDetail] = useState<any>({});

  useEffect(() => {
    designAdvanceId && getDetail(designAdvanceId);
  }, [designAdvanceId]);

  const getDetail = async(id: number) => {
    const data = await shopDesignAdvance({ id });
    data && setDetail(data);
  };

  return (
    <div className='pb-16 pr-16'>
      <TitleTips name='提前设计' showTips={false} />
      <V2DetailGroup>
        <Row gutter={24}>
          <Col span={12}>
            <V2DetailItem label='设计信息说明' value={detail.designNotes} type='textarea' />
          </Col>
          <Col span={12}>
            <V2DetailItem label='上传资料' type='images' assets={Array.isArray(detail.materialUrls) ? detail.materialUrls.map(itm => ({ url: itm })) : []}/>
          </Col>
        </Row>
      </V2DetailGroup>
    </div>
  );
};

export default AdvanceDesignTab;
