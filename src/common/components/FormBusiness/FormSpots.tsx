/**
 * （待废弃，请使用 FormSpot 组件）
 */
import { spotSearch } from '@/common/api/flow';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { CurrentUserInfo } from '@/layout';
import { recursionEach } from '@lhb/func';
import { Button, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import FormSelect from '../Form/FormSelect';

export interface FormSpotsProps {
  selectedPlaceId: string;
}

const FormSpots: React.FC<any> = ({ selectedPlaceId, name, placeholder }) => {
  const [options, setOptions] = useState<any>([]);
  const result: any = useContext(CurrentUserInfo);

  const loadData = async () => {
    const params = {
      placeId: selectedPlaceId,
      page: 1,
      size: 50,
    };
    const data = await spotSearch(params);
    data && data.objectList ? setOptions(data.objectList) : setOptions([]);
  };

  const jump = async () => {
    // const result: CurrentUserResult = useContext(CurrentUserInfo);
    const moduleList: Array<any> = result.moduleList || [];
    let hasPermission = false;
    recursionEach(moduleList, 'children', (item: any) => {
      if (item.uri === '/resmng') {
        hasPermission = true;
      }
    });
    if (hasPermission) {
      dispatchNavigate('/resmng');
    } else {
      message.warn('暂无资源管理查看权限，请联系相关人员开通');
    }
  };

  const notFoundNode = (
    <Button type='link' onClick={jump}>
      点击去资源中心新增
    </Button>
  );

  // 编辑时
  useEffect(() => {
    // 场地变化时，清空点位选项
    // form.setFieldsValue({ [name]: undefined });

    selectedPlaceId && loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlaceId]);

  return (
    <FormSelect
      label='点位名称'
      name={name}
      options={options}
      placeholder={placeholder}
      rules={[{ required: true, message: '请输入点位名称' }]}
      config={{
        allowClear: true,
        fieldNames: { label: 'name', value: 'id' },
        dropdownRender: (menu) => {
          return (
            <>
              {menu}
              {notFoundNode}
            </>
          );
        },
      }}
    />
  );
};

export default FormSpots;
