import DetailInfo from '@/common/components/business/DetailInfo';
import { Row, Select } from 'antd';
import { useState } from 'react';
import TableListForBizShop from './components/TableListForBizShop';
import styles from './entry.module.less';
import TableListForStreetShop from './components/TableListForStreetShop';

const gradeRule = {
  no: 'DPMX001',
  industry: '零售、餐饮',
  // detailIndustry: '零售、餐饮',
  ruleDesc: '适用于零售、餐饮及其细分行业',
  tips: '如需修改评分指标，请联系开发工作人员',
};

const { Option } = Select;

export default function Storegraderule() {
  const [selectedModel, setSelectedModel] = useState(1);
  const onSelect = (e) => {
    setSelectedModel(e);
  };
  return (
    <div className={styles.container}>
      <Row>
        <DetailInfo span={6} title='模型编号' value={gradeRule.no}>
          <Select defaultValue={1} onSelect={onSelect} size='small' style={{ width: 140 }} >
            <Option value={1}>DPMX001-街铺</Option>
            <Option value={2}>DPMX002-商铺</Option>
          </Select>
        </DetailInfo>
        <DetailInfo span={4} title='所属行业' value={gradeRule.industry} />
        {/* <DetailInfo span={3} title='行业细分' value={gradeRule.detailIndustry} /> */}
        <DetailInfo span={7} title='模型描述' value={gradeRule.ruleDesc} />
        <DetailInfo span={7} title='提示' value={gradeRule.tips} />
      </Row>
      {selectedModel === 1 ? <TableListForStreetShop /> : null}
      {selectedModel === 2 ? <TableListForBizShop /> : null}
    </div>
  );
}
