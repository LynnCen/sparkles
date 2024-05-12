/*
* 品牌名称输入，带相似品牌提示
*/
import { brandSearch } from '@/common/api/brand-center';
import { debounce } from '@lhb/func';
import { AutoComplete } from 'antd';
import { FC, useState } from 'react';
import styles from './index.module.less';

interface NameInputProps {
  allowClear?: boolean;
  maxLength?: number;
  value?: any;
  onChange?: (value: any) => void;
  onSelect?: (value: any, option: any) => void;
}

// const defaultOptions = [
//   {
//     id: 1111,
//     name: '香蕉手机',
//     oneIndustryName: '电子',
//     twoIndustryName: '手机',
//     threeIndustryName: '5G手机',
//   },
//   {
//     id: 1112,
//     name: '橘子手机',
//     oneIndustryName: '电子',
//     twoIndustryName: '手机',
//     threeIndustryName: '4G手机',
//   },
// ];

const NameInput: FC<NameInputProps> = ({ ...props }) => {
  const [value, setValue] = useState();
  const [options, setOptions] = useState<any[]>([]);

  const onSearch = (keyword) => {
    console.log('onSearch', keyword);
    const newFn = debounce(getList, 500);
    newFn(keyword);
  };

  const getList = async (keyword) => {
    if (keyword && keyword.length) {
      brandSearch({ brandName: keyword }).then((list) => {
        Array.isArray(list) && setOptions(list.map(opt => ({
          // options参数value不能是number型，否则报错
          value: `${opt.id}`,
          label: (<div className={styles.similarBrand} onClick={(e) => e.stopPropagation()
          }>
            <div className={styles.name}>{opt.name}{`（ID:${opt.id}）`}</div>
            {!!opt.industryList && opt.industryList.map((item) => {
              return <div className={styles.industry}>{[item.oneIndustryName, item.twoIndustryName, item.threeIndustryName].filter(itm => !!itm).join(' > ')}</div>;
            })}
          </div>),
        })));
      });
    } else {
      setOptions([]);
    }
  };

  const onChange = (val) => {
    console.log('onChange', val);
    setValue(val);
  };

  // const onSelect = (val, option) => {
  //   console.log('onSelect', val, option, '此时value', value);
  // };

  return (
    <AutoComplete
      onSearch={onSearch}
      onChange={onChange}
      // onSelect={onSelect}
      style={{ width: '100%' }}
      value={value}
      filterOption={false}
      options={options}
      placeholder='输入品牌名称'
      popupClassName={styles.brandNameList}
      {...props}/>
  );
};

export default NameInput;
