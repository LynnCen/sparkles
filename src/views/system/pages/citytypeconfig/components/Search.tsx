/**
 * @Description 列表搜索
 */
import { FC, useMemo } from 'react';
import V2Title from '@/common/components/Feedback/V2Title';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2Operate, { OperateButtonProps } from '@/common/components/Others/V2Operate';
import { getJurisList, refactorPermissions, refactorSelection } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { Cascader, FormProps } from 'antd';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import styles from '../entry.module.less';
import { CityTypes } from '../ts-config';

// 带搜索和重置按钮的form
export interface SearchFormProps extends FormProps {
  onSearch: Function; // 确定
  permissions?: OperateButtonProps[]; // 按钮列表
  options:CityTypes[] // 实际类型下拉项
  setImportModalShow:(vis:boolean)=>void; // 导入弹窗
  setConfigModalShow:(vis:boolean)=>void; // 配置弹窗
}

const operationBtns = {
  import: { type: 'primary' }, // 导入 // TODO:
  config: { type: 'goast' } // 配置
};

const Search: FC<SearchFormProps> = ({
  permissions, // 导入按钮
  onSearch, // 搜索
  options, // 实际类型筛选项
  setImportModalShow, // 打开导入弹窗
  setConfigModalShow // 打开配置弹窗
}) => {


  const methods = useMethods({
    /**
     * @description 导入
     */
    handleImport() {
      setImportModalShow(true);
    },
    /**
     *  @description 配置
     */
    handleConfig() {
      setConfigModalShow(true);
    }
  });

  // 配置按钮参数
  const operateList = useMemo(() => {
    return getJurisList(operationBtns, refactorPermissions(permissions || []), methods);
  }, [permissions]);

  return (
    <>
      <V2Title
        text='城市类型配置'
        extra={
          <V2Operate operateList={operateList} />
        }
        className={styles.topTitle}
      />
      <SearchForm
        onOkText='搜索'
        onSearch={onSearch}
        showResetBtn={false}
      >

        <V2FormProvinceList
          label='区域'
          name='pcdIds'// TODO: 城市选择器
          placeholder='请选择区域'
          config={{
            multiple: true,
            showCheckedStrategy: Cascader.SHOW_PARENT,
            maxTagCount: 'responsive'
          }}
        />
        <V2FormSelect
          label='实际类型'
          name='actualTypes'
          placeholder='请选择实际类型'
          options={refactorSelection(options, { name: 'areaTypeName', id: 'areaTypeName' })}
          config={{
            mode: 'multiple',
            maxTagCount: 'responsive'
          }}
        />
      </SearchForm>
    </>
  );
};

export default Search;
