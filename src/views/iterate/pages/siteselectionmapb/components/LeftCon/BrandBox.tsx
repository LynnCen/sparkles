/**
 * @Description 品牌
 */

import { FC, useState } from 'react';
import styles from './index.module.less';
import { carBrandRadio, leftSection, sectionKey, tabsKey } from '../../ts-config';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import IconFont from '@/common/components/IconFont';
import V2Tabs from '@/common/components/Data/V2Tabs';
import cs from 'classnames';
import { Checkbox, Typography } from 'antd';
const fuelCar = 'fuelCar';// 燃油车
const newEnergy = 'newEnergy';// 新能源车
const BrandBox: FC<any> = ({
  active,
  checked,
  handleClear,
  handleChecked,
  options,
  handleeBigDataSend,

}) => {
  const [inputValue, setInputValue] = useState<string>('');// 偏好品牌和避开品牌的搜索框
  const [tabActive, setTabActive] = useState<string>(tabsKey.all);
  const children = leftSection.find(section => section.code === active)?.children || [];
  const curCode:any = children[0].code;

  const curOptions = options?.[children[0].code];

  const checkElement = (item) => <div key={item.id} className={styles.checkbox}
    style={{
      display: !inputValue ||
        item?.shortName?.toLowerCase()?.includes(inputValue) ||
        item?.name?.toLowerCase()?.includes(inputValue) ? 'inline-block' : 'none'
    }}
  >
    <Checkbox
      onChange={(e) => handleeBigDataSend(e, item, active)}
      value={[sectionKey.preferBrand, sectionKey.avoidBrand, sectionKey.tourBrand].includes(curCode) ? item.originBrandId : item.id}
      disabled={
        active === sectionKey.preferBrandMenu// 偏好品牌下，禁用已选的“避开品牌”
          ? checked?.[sectionKey.avoidBrand]?.includes(item.originBrandId)
          : (active === sectionKey.avoidBrandMenu// 避开品牌下，禁用已选的“偏好品牌”
            ? checked?.[sectionKey.preferBrand]?.includes(item.originBrandId)
            : false)
      }
    >
      <img src={item.logo} className={styles.logo} />
      <Typography.Text className={styles.brandName} ellipsis={{
        tooltip: {
          title: item.shortName || item.name,
          getPopupContainer: (triggerNode: any) => triggerNode.parentNode
        }
      }}>
        {item.shortName || item.name}
      </Typography.Text>
    </Checkbox>
  </div>;

  return <>
    <div className={styles.sessionTop}>
      <div className={styles.sideBoxTop}>
        <div>
          {leftSection.find(section => section.code === active)?.label}
          {
            checked?.[curCode]?.length ? <span
              onClick={() => handleClear(curCode)}
              className={styles.clear}>清除</span> : <></>
          }
        </div>
        <div className='mb-12 mt-4 c-999 fwNormal'>{leftSection.find(section => section.code === active)?.remark}</div>
      </div>
      <V2FormInput
        placeholder='搜索品牌'
        config={{
          suffix: <IconFont iconHref='iconsearch' />,
          style: {
            width: 336,
            height: 28
          },
          value: inputValue
        }}
        onChange={(e) => setInputValue(e.target.value.toLowerCase())}
        className={styles.searchInput}
      />
    </div>
    {/* 产品青山要求，当燃油车和新能源车类型有三个以上的时候 才显示分类 */}
    {curOptions.filter((item) => item.brandTypes.includes(newEnergy) || item.brandTypes.includes(fuelCar))?.length >= 3
      ? <V2Tabs
        items={carBrandRadio}
        type='fullCard'
        animated={false}
        className={styles.tabs}
        onChange={setTabActive}
      /> : <></>}

    {tabActive === tabsKey.all ? <div className={styles.box}>
      <Checkbox.Group
        onChange={(value) => handleChecked(value, curCode)}
        value={checked?.[curCode]}
      >
        {curOptions.map((item) => {
          // 前端进行本地搜索，考虑了字母大小写情况
          return checkElement(item);
        })}
      </Checkbox.Group>
    </div> : <>
      <div className={styles.box}>
        <Checkbox.Group
          onChange={(value) => handleChecked(value, children[0].code)}
          value={checked?.[children[0].code]}
        >
          <div className={styles.title} >
            新能源
          </div>

          <div className='pl-12'>
            {/* // 这里控制只显示新能源 */}
            {curOptions.filter((brand) => brand.brandTypes.includes(newEnergy))?.map((item) => {
            // 前端进行本地搜索，考虑了字母大小写情况
              return checkElement(item); ;
            })}
          </div>
          <div className={cs(styles.title, 'mt-16')} >
            燃油
          </div>
          <div className='pl-12'>
            {/* 这里控制只显示燃油 */}
            {curOptions.filter((brand) => brand.brandTypes.includes(fuelCar))?.map((item) => {
            // 前端进行本地搜索，考虑了字母大小写情况
              return checkElement(item); ;
            })}
          </div>
        </Checkbox.Group>
      </div>
    </>}
  </>;
};
export default BrandBox;
