/*
* 添加跟进记录
*/
import { FC, useState, useRef } from 'react';
import styles from './index.module.less';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import { Col, Row, Button, Form } from 'antd';
import { useMethods } from '@lhb/hook';
import { saveRecord } from '@/common/api/locxx';
import FollowRecordList from '../../placeMng/components/FollowRecordList';


interface FollowRecordProps{
  tenantPlaceId: any
  tenantId:any
  onRefresh: () => void
}

const FollowRecord:FC<FollowRecordProps> = ({
  tenantPlaceId,
  tenantId,
  onRefresh
}) => {
  const [isShow, setIsShow] = useState(true);
  const [form] = Form.useForm();
  const followRecordListRef = useRef<any>();
  const methods = useMethods({
    submit() {
      form.validateFields().then((values) => {
        saveRecord({ tenantPlaceId, content: values.content }).then(() => {
          setIsShow(true);
          onRefresh();
          form.resetFields();
          followRecordListRef.current.init();
        });
      });
    },
    hidden() {
      form.resetFields();
      setIsShow(true);
    }
  });
  return (
    <div className={styles.container}>
      {
        isShow ? <div className={styles.box} onClick={() => { setIsShow(false); }}>填写跟进记录</div>
          : <div>
            <V2Form form={form}>
              <Row>
                <Col span={24}>
                  <V2FormTextArea
                    name='content'
                    maxLength={500}
                    placeholder='待跟进'
                    config={{ showCount: true, autoFocus: true }}
                    className='record'
                    rules={[{ required: true, whitespace: true, message: '请填写跟进记录' }]}
                  />
                </Col>
                <Col span={24}>
                  <Button type='primary' className='mr-8' onClick={() => methods.submit(tenantPlaceId)}>提交</Button>
                  <Button onClick={() => methods.hidden()}>取消</Button>
                </Col>
              </Row>
            </V2Form>
          </div>
      }
      <div className={styles.recordList}>
        <FollowRecordList id={tenantPlaceId} tenantId={tenantId} ref={followRecordListRef}/>
      </div>
    </div>
  );
};

export default FollowRecord;
