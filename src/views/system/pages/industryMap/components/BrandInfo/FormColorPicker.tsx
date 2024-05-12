import React, { useState } from 'react';
import { Form, Popover } from 'antd';
import ColorPicker from '@/common/components/Base/ColorPicker';
import styles from '../../entry.module.less';
const FormSelect: React.FC<any> = ({
  label,
  name,
  rules,
  color,
  setColor,
  formItemConfig = {},
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <Form.Item name={name} label={label} rules={rules} {...formItemConfig}>
      <Popover
        content={<ColorPicker color={color} setColor={setColor} canSetOpacity={false}/>}
        trigger='click'
        // placement='rightTop'
        open={visible}
        onOpenChange={setVisible}
        overlayClassName={styles.colorPopover}
      >
        <div className={styles.colorCol}>
          <div>{color}</div>
          <div
            style={{ backgroundColor: color }}
            className={styles.block}
            onClick={() => setVisible(true)}
          ></div>
        </div>
      </Popover>
    </Form.Item>
  );
};

export default FormSelect;
