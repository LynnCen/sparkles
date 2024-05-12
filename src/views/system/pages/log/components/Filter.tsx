/**
 * @Description 系统日志-筛选项
 */

import { FC, useEffect, useState } from 'react';
import { Cascader, Form } from 'antd';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import FormPostList from '@/common/components/FormBusiness/FormPostList';
import styles from './index.module.less';
import { moduleFindByAppId } from '@/common/api/permission';
import { AppMenuResult } from '../ts-config';
import { isArray } from '@lhb/func';
import dayjs from 'dayjs';

interface Props {
  onSearch: Function, // 搜索函数
}

/**
 * @description 平台筛选项
 */
const sourceOptions: any = [
  { label: 'PC端', value: 'PC端' },
  { label: 'APP端', value: 'APP端' },
];

const Filter: FC<Props> = ({
  onSearch
}) => {
  const [form] = Form.useForm();
  const [menus, setMenus] = useState<any[]>([]);

  useEffect(() => {
    loadMenuTree();
  }, []);

  // 请求菜单权限树
  const loadMenuTree = () => {
    moduleFindByAppId({ appId: 3 }).then(({ moduleList = [] }: AppMenuResult) => {
      setMenus(moduleList);
    });
  };

  /**
   * @description 查询时部分参数特殊处理
   * @param value 参数
   * @return
   */
  const handleSearch = (value: any) => {
    // console.log('handleSearch, value', value);
    const { time, menuModules } = value;
    // 时间参数处理
    if (isArray(time) && time.length === 2) {
      value.startTime = dayjs(time[0]).format('YYYY-MM-DD HH:mm:ss');
      value.endTime = dayjs(time[1]).format('YYYY-MM-DD HH:mm:ss');
    } else {
      value.startTime = undefined;
      value.endTime = undefined;
    }
    delete value.time;

    // 菜单id参数处理，将二维数组转为平铺数组
    if (isArray(menuModules) && menuModules.length) {
      const menuIds: any[] = [];
      menuModules.forEach((itm: any) => {
        if (isArray(itm) && itm.length) {
          const menuId = itm[itm.length - 1];
          menuIds.push(menuId);
        }
      });
      value.menuModules = menuIds;
    } else {
      value.menuModules = undefined;
    }

    // console.log('加工后value', value);
    const _params = form.getFieldsValue();
    onSearch && onSearch({
      ..._params,
      ...value,
      time: undefined,
    });
  };

  return (
    <div>
      <SearchForm
        form={form}
        labelLength={4}
        onSearch={handleSearch}
        className={styles.searchFromCon}
      >
        <V2FormInput
          label='操作人'
          name='keyword'
          maxLength={16}/>
        <V2FormRangePicker
          label='操作时间'
          name='time'
          config={{
            format: 'YYYY-MM-DD HH:mm:ss',
            showTime: true,
          }}
          formItemConfig={{
            className: styles.timeFormItem
          }}
        />
        <FormPostList
          label='岗位'
          name='positionIds'
          allowClear={true}
          placeholder='请选择所属岗位'
          config={{ mode: 'multiple' }}
        />
        <V2FormSelect
          label='操作平台'
          name='sources'
          options={sourceOptions}
          config={{
            mode: 'multiple',
            maxTagCount: 'responsive',
          }}/>
        <V2FormCascader
          label='操作菜单'
          name='menuModules'
          options={menus}
          config={{
            multiple: true,
            fieldNames: {
              label: 'name',
              value: 'id',
              children: 'children'
            },
            showCheckedStrategy: Cascader.SHOW_CHILD,
            maxTagCount: 'responsive',
            showSearch: true,
            getPopupContainer: (node) => node.parentNode,
          }}
        />
      </SearchForm>
    </div>
  );
};

export default Filter;
