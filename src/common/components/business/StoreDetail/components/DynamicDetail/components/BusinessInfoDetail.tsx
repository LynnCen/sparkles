/**
 * @Description 机会点详情-商圈信息详情
 */
import { FC, useState } from 'react';
import { Row, Col } from 'antd';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import IconFont from '@/common/components/IconFont';
import AreaDetailDrawer from '@/views/iterate/pages/siteselectionmap/components/AreaDetailDrawer';

const BusinessInfoDetail: FC<any> = ({
  info = {},
  detailInfoConfig = { span: 12 },
}) => {

  const [drawerData, setDrawerData] = useState<any>({ // 详情抽屉
    open: false,
    id: ''
  });

  /* method */

  if (!info) {
    // 未选择地址
    return (<Row gutter={24}>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='所属商圈' value='选择详细地址后获取'/>
      </Col>
    </Row>);
  } else if (!info.isInCluster) {
    // 无商圈
    return (<Row gutter={24}>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='所属商圈' value='该机会点不在商圈内'/>
      </Col>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='商圈类型' value='-'/>
      </Col>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='商圈评分' value='-'/>
      </Col>
    </Row>);
  } else {
    // 有所属商圈
    return (<Row gutter={24}>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='所属商圈' value={info.clusterName} rightSlot={{
          icon: <IconFont iconHref='iconic_next_black_seven'/>,
          onIconClick() { // 展示商圈详情
            setDrawerData({
              open: true,
              id: info.clusterId
            });
          }
        }}/>
      </Col>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='商圈类型' value={info.clusterTypeName}/>
      </Col>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='商圈评分' value={info.clusterScore}/>
      </Col>
      <AreaDetailDrawer
        drawerData={drawerData}
        setDrawerData={setDrawerData}
        viewChanceDetail={false}
      />
    </Row>);
  }
};

export default BusinessInfoDetail;
