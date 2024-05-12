/**
 * @Description 集客点tab相关表单
 */

import V2Title from '@/common/components/Feedback/V2Title';
import styles from './index.module.less';
import { Col, Row } from 'antd';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import V2FormUpload from '@/common/components/Form/V2FormUpload/V2FormUpload';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import CompareTableForm from './CompareTableForm';
import ShopInfoTableForm from './ShopInfoTableForm';

const TabForm = ({ keyName, tableFormLength, setTableFormLength }) => {
  return (
    <div className={styles.tabFormWrap}>
      <V2Title type='H2' divider text='集客点' />
      <div style={{
        paddingTop: 320
      }}>

      </div>
      <Row gutter={24} className='mt-16'>
        <Col span={8}>
          <V2FormInput required label='集客点名称' maxLength={32} name={[keyName, 'name']} />
        </Col>
        <Col span={8}>
          <V2FormInput required label='集客A类点' maxLength={32} name={[keyName, 'pointName']} />
        </Col>
        <Col span={8}>
          <V2FormInputNumber required label='租金单价行情' name={[keyName, 'rent']} config={{ addonAfter: '元/㎡/月' }} />
        </Col>
        <Col span={8}>
          <V2FormInputNumber required label='转让费行情' name={[keyName, 'assignmentFee']} config={{ addonAfter: '元' }} />
        </Col>
        <Col span={8}>
          <V2FormInputNumber required label='预估日均金额' name={[keyName, 'estimatedDailyAmount']} config={{ addonAfter: '元' }} />
        </Col>
        <Col span={16}>
          <V2FormUpload required label='上传A类点视频讲解' name={[keyName, 'videoUrls']} uploadType='video' config={{ maxCount: 5, size: 200 }} />
        </Col>
        <Col span={8}>
          <V2FormTextArea label='视频备注' placeholder='请输入请输入视频备注，最多200字' maxLength={200} name={[keyName, 'videoRemark']} />
        </Col>
      </Row>
      <CompareTableForm keyName={keyName} tableFormLength={tableFormLength} setTableFormLength={setTableFormLength}/>
      <ShopInfoTableForm keyName={keyName} tableFormLength={tableFormLength} setTableFormLength={setTableFormLength}/>
    </div>
  );
};

export default TabForm;
