/**
 * @Description 发起审批-点位单选
 */
import { FC, useEffect, useState } from 'react';
import { Form, Row, Col } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { shopEveluationList } from '@/common/api/approveworkbench';
import styles from './index.module.less';
import cs from 'classnames';

// 点位选择的审批类型场景
export enum SelectSpotType {
  SPOT = 8,
  DESINGN = 9,
  CONTRACT = 10,
}

interface SelectSpotProps {
  open: boolean;
  selectType: SelectSpotType; // 操作类型
  setSpotDetail: Function; // 选择了点位信息
}

const SelectSpot: FC<SelectSpotProps> = ({
  open,
  selectType,
  setSpotDetail,
}) => {
  const [form] = Form.useForm();
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    open && getShopList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const getShopList = async () => {
    // approvalTypeValue 8点位评估审批/9设计审批/10合同审批
    const params = { approvalTypeValue: selectType };
    const { data } = await shopEveluationList(params);
    Array.isArray(data) && setOptions(data);
  };

  const onChange = (val) => {
    const opt = options.find(itm => itm.id === val);
    setSpotDetail && setSpotDetail(opt || {});
  };

  return (
    <>
      <V2Form form={form} className={cs(styles.selectSpot, 'mt-32')}>
        <Row gutter={24}>
          <Col span={12}>
            <V2FormSelect
              label='点位名称'
              options={options}
              config={{
                showSearch: true,
                fieldNames: { label: 'reportName', value: 'id' },
                filterOption: (input, option) => (
                  ((option?.['reportName'] ?? '') as any).toLowerCase().includes(input.toLowerCase()))
              }}
              formItemConfig={{ extra: <div className='c-ff8 pt-12'>切换点位，当前操作将不做保存</div> }}
              onChange={onChange}/>
          </Col>
        </Row>
      </V2Form>
    </>
  );
};

export default SelectSpot;
