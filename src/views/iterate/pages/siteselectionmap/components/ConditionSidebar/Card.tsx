/**
 * @Description 筛选项卡片
 */
import { FC, useState } from 'react';
import styles from './index.module.less';
import ExpandBox from './ExpandBox';
import cs from 'classnames';
import { Checkbox, Typography } from 'antd';
import { isFunction, refactorSelection } from '@lhb/func';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
// import { labelSystemBrand, preferenceBrand } from '../../ts-config';
const { Text } = Typography;
const Card:FC<any> = ({
  titleText,
  label,
  options,
  setOptions,
  checked,
  setChecked,
  slot,
  showSelect = false, // 是否展示下拉选择框
  disabledKey,
  targetNames,
  changeTypeRef,
  showLine = true, // 是否展示底部线条
}) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // 将勾选的数据放入
  const onChange = (e) => {
    changeTypeRef.current = label;
    // 特殊处理
    // // 如果是偏好品牌，此时需要选中对应的标杆品牌商圈
    // if (label === preferenceBrand) {
    //   const checkArr = handlePreferenceBrand(e);
    //   setChecked((state) => {
    //     return {
    //       ...state,
    //       preferenceBrand: e,
    //       labelSystemBrand: checkArr
    //     };
    //   });
    //   return;
    // }
    // // 如果是标杆品牌商圈，此时需要选中对应的偏好品牌
    // if (label === labelSystemBrand) {
    //   const preferenceBrandArr = handleLabelSystemBrand(e);
    //   setChecked((state) => {
    //     return {
    //       ...state,
    //       labelSystemBrand: e,
    //       preferenceBrand: preferenceBrandArr,
    //     };
    //   });
    //   return;
    // }
    setChecked((state) => {
      return {
        ...state,
        [label]: e
      };
    });

  };

  // 清除所有筛选项，将data值为空数组
  const clear = () => {
    changeTypeRef.current = label;
    // 特殊处理
    // // 清空偏好品牌时
    // if (label === preferenceBrand) {
    //   const needHandleArr = handlePreferenceBrand(checked?.preferenceBrand || []);
    //   console.log('needHandleArr', needHandleArr, checked?.labelSystemBrand);
    //   const newLabelSystemBrandChecked:any = [];
    //   // 标杆品牌已选中遍历
    //   checked?.labelSystemBrand.map((item) => {
    //     if (!needHandleArr.includes(item)) {
    //       newLabelSystemBrandChecked.push(item);
    //     }
    //   });
    //   console.log('newLabelSystemBrandChecked', newLabelSystemBrandChecked);
    //   setChecked((state) => {
    //     return {
    //       ...state,
    //       labelSystemBrand: newLabelSystemBrandChecked,
    //       [label]: []
    //     };
    //   });
    //   return;
    // }
    // // 清空标杆品牌时
    // if (label === labelSystemBrand) {
    //   const needHandleArr = handleLabelSystemBrand(checked.labelSystemBrand || []);
    //   const preferenceBrandArr:any = [];
    //   checked?.preferenceBrand?.map((item) => {
    //     if (!needHandleArr.includes(item.id)) {
    //       needHandleArr.push(item.id);
    //     }
    //   });
    //   setChecked((state) => {
    //     return {
    //       ...state,
    //       preferenceBrand: preferenceBrandArr,
    //       [label]: []
    //     };
    //   });
    //   return;
    // }
    setChecked((state) => {
      return {
        ...state,
        [label]: []
      };
    });

  };

  // 处理展开收起逻辑，互斥，只能展开一个
  const handleShowAll = (state) => {
    let obj = options;
    // 当触发时，全部设为收起
    Object.keys(obj || {})?.map((item) => {
      obj = {
        ...obj || {},
        [item]: {
          ... obj[item],
          showAll: false
        }
      };
    });
    // 当动作是展开某一个时，单独设置某一个为展开状态
    if (state) {
      // 设置展开的
      obj = {
        ...obj || {},
        [label]: {
          ... obj?.[label] || {},
          showAll: true
        }
      };
    }

    setOptions(obj);
  };

  // 构造下拉框筛选项数据
  const selectOptions:any = () => {
    // 如果有传入disabledKey，将options中去除disabledKey对应的已筛选数据，
    if (disabledKey) {
      const _option:any = [];
      refactorSelection(options?.[label]?.data, targetNames || { name: 'name', id: 'id' }).map((item) => {
        if (!checked?.[disabledKey]?.includes(item.value)) {
          _option.push(item);
        }
      });
      return _option;
    } else {
      return refactorSelection(options?.[label]?.data);
    }
  };
  // // 处理筛选偏好品牌，返回对应标杆品牌商圈数组
  // const handlePreferenceBrand = (value) => {
  //   const checkArr:any = checked?.labelSystemBrand;
  //   options?.labelSystemBrand?.data?.map((item) => {
  //     // 已选中的偏好品牌id=>e 包含标杆品牌商圈的关联id=>relationId 则把标杆品牌商圈的id放到checkArr
  //     if (value.includes(item.relationId)) {
  //       checkArr.push(item.id);
  //     }
  //   });
  //   return checkArr;
  // };

  // // 处理筛选标杆品牌商圈，返回对应品牌的id数组
  // const handleLabelSystemBrand = (value) => {
  //   // 获取已选标杆品牌对应的关联id
  //   const originBrandIds:any = [];
  //   options?.labelSystemBrand?.data?.map((item) => {
  //     if (value.includes(item.id)) {
  //       originBrandIds.push(item.relationId);
  //     }
  //   });
  //   // 根据已选标杆品牌对应的关联id，找到对应的品牌id
  //   const preferenceBrandArr:any = [];
  //   options?.preferenceBrand?.data?.map((item) => {
  //     if (originBrandIds.includes(item.originBrandId)) {
  //       preferenceBrandArr.push(item.originBrandId);
  //     }
  //   });
  //   return preferenceBrandArr;
  // };

  return options?.[label]?.data?.length ? <div
    className={styles.cardCon}
    onMouseEnter={() => setIsHovering(true)}
    onMouseLeave={() => setIsHovering(false)}
  >
    {/* 卡片顶部信息 */}
    <div>
      <span className='bold'>{titleText}</span>
      <span className='c-999 fs-12'>
        {checked?.[label]?.length ? `（已选${checked?.[label]?.length}）` : ''}
      </span>
      {isHovering ? <span className={styles.clear} onClick={clear}>清除</span> : <></>}
    </div>
    {showSelect ? <V2FormSelect
      options={selectOptions()}
      placeholder='请输入品牌名称'
      className={styles.select}
      onChange={onChange}
      config={{
        // onBlur: onblur,
        value: checked?.[label] || [],
        maxTagCount: 'responsive',
        mode: 'multiple',
        showSearch: true,
      }}
    /> : <></>}
    {/* 卡片选项内容 */}
    <Checkbox.Group
      onChange={onChange}
      style={{ width: '100%' }}
      value={checked?.[label] || []}
    >
      <ExpandBox maxNumber={6} showAll={options?.[label]?.showAll} setShowAll={handleShowAll}>
        {
          refactorSelection(options?.[label]?.data, targetNames || { name: 'name', id: 'id' })?.map((item, index) =>
            <Checkbox
              key={index}
              value={item.value}
              className={cs(styles.check)}
              // 如果有传入disabledKey，将options中禁用disabledKey对应的已筛选数据，
              disabled={checked?.[disabledKey]?.includes(item.value)}
            >
              {isFunction(slot) ? slot(item, index)
                : <Text
                  className={styles.label}
                  ellipsis={{ tooltip: item.label }}
                >
                  <span className='fs-12'>{item.label}</span>
                </Text>
              }
            </Checkbox>
          )
        }
      </ExpandBox>
    </Checkbox.Group>
    {showLine ? <div className={styles.line}></div> : <></>}
  </div> : <></>;
};
export default Card;
