/**
 * @Description 设置字段必填
 */

import { FC } from 'react';
import { Switch } from 'antd';
import { dynamicTemplateUpdateProperty } from '@/common/api/location';
import { getRestriction } from '../ways';
// import cs from 'classnames';
import styles from './index.module.less';

const FieldSwitch: FC<any> = ({
  templateId, // 模板id
  type, // 字段类型
  row, // 行数据
  isChecked,
  loadData, // 更新表格
}) => {
  const tplRestriction = getRestriction(row);
  const onChange = (checked) => {
    const restriction = tplRestriction;
    const params: any = {
      templateId
    };
    if (type === 'required') {
      params.propertyConfigRequestList = [
        {
          ...row,
          required: checked ? 1 : 0,
        },
      ];
    } else if (type === 'nextLine' || type === 'disable') {
      // type === 'nextLine' && (restriction.nextLine = checked);
      // type === 'disable' && (restriction.disable = checked);
      restriction[type] = checked;
      params.propertyConfigRequestList = [
        {
          id: row.id,
          propertyId: row.propertyId,
          categoryTemplateId: row.categoryTemplateId,
          categoryPropertyGroupId: row.categoryPropertyGroupId,
          templateRestriction: JSON.stringify(restriction),
        },
      ];
    }

    dynamicTemplateUpdateProperty(params).then((success) => {
      success && loadData();
    });
  };

  return (
    <div className={styles.showSwitch}>
      <Switch
        checked={isChecked}
        size='small'
        onClick={onChange}
      />
    </div>
  );
};

export default FieldSwitch;
