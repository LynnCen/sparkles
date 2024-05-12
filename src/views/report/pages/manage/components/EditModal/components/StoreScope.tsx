/* 门店范围行 */
import React from 'react';
import { Col } from 'antd';
import FormStores from '@/common/components/FormBusiness/FormStores';
import { ScopeProps } from '../../../ts-config';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';

const scopeOptions = [
  { label: '全部门店', value: 1 },
  { label: '指定门店', value: 2 },
];

const StoreScope: React.FC<ScopeProps> = ({ showExtend, onChange }) => {

  const handleChange = (e: any) => {
    if (!e) return;
    const scope = e.target.value;
    onChange(scope);
  };

  return (
    <>
      <Col span={12}>
        <V2FormRadio
          label='门店范围'
          name='storeScope'
          options={scopeOptions}
          required
          onChange={handleChange}
        />
        {
          showExtend && <FormStores
            name='storeIds'
            placeholder='请选择门店'
            noStyle={true}
            allowClear={true}
            config={{
              mode: 'multiple',
              maxTagCount: 1
            }}
            rules={[
              { required: true, message: '请选择指定门店' }
            ]}
          />
        }
      </Col>
    </>
  );
};

export default StoreScope;
