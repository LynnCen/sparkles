import { FC, useEffect, useState } from 'react';
import { contendInfoFields } from './../config';
import { useMethods } from '@lhb/hook';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import { Col, Form, Row } from 'antd';
import { CloseCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import styles from './../index.module.less';
import FormSetName from '@/common/components/Form/FormSetName';

// 周边竞品组件
const ContendInfo:FC<any> = ({
  propertyItem,
  form,
  disabled,
  required,
  contendInfoChange
}) => {

  const [groupCount, setGroupCount] = useState(1);// 组个数
  const identification = propertyItem.identification; // 字段
  const value = Form.useWatch(identification);

  useEffect(() => {
    if (value?.length) {
      setGroupCount(value?.length);
    }
    contendInfoChange(identification, value);
  }, [value]);

  const methods = useMethods({
    add() {
      if (disabled) {
        return;
      }
      setGroupCount(groupCount + 1);
    },
    del(curIndex) {
      if (disabled) {
        return;
      }
      form.setFieldValue(identification, value.filter((item, index) => index !== curIndex));
      setTimeout(() => { setGroupCount(groupCount - 1); });
    }
  });

  return <div className={styles.contendInfo}>
    <FormSetName name={identification} initialValue={[]}></FormSetName>
    {Array.from({ length: groupCount })?.map((item, index) => <div key={index}>
      <Row gutter={24}>
        {contendInfoFields?.map((field, idx) => {
          return <Col span={12} key={idx}>
            {
              field.type === 'text' && <V2FormInput
                label={field.label}
                name={[propertyItem.identification, index, field.name]}
                required={required}
                disabled={disabled}
                maxLength={field.maxlength}
                config={{ addonAfter: field.suffix }}
              ></V2FormInput>
            }
            {
              field.type === 'number' && <V2FormInputNumber
                label={field.label}
                name={[propertyItem.identification, index, field.name]}
                required={required}
                disabled={disabled}
                config={{ addonAfter: field.suffix }}
                max={field.maxValue}
                precision={field.floatLength}
              ></V2FormInputNumber>
            }
          </Col>;
        })}
      </Row>
      <div className={`operate-wrapper ${disabled ? 'disabled' : ''}`}>
        { value?.length > 1 && <div className='operate left' onClick={() => methods.del(index)}><CloseCircleOutlined className='mr-5 fs-16' />删除此条</div> }
        { (value?.length - 1) === index && <div className='operate right' onClick={methods.add}><PlusCircleOutlined className='mr-5 fs-16'/>新增一条</div> }
      </div>
    </div>)}
  </div>;
};

export default ContendInfo;
