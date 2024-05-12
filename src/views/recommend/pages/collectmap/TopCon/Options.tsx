/**
 * @Description 筛选条件
 */
import { FC } from 'react';
import styles from './index.module.less';
import { Checkbox } from 'antd';
import { StatusColor } from '../ts-config';
const Options:FC<any> = ({
  setOptions
}) => {
  const optionsList = [
    {
      title: '是否开店',
      key: 'isOpenStore',
      option: [
        { label: '已开门店', value: true },
        { label: '未开门店', value: false }
      ]
    },
    {
      title: '提交数量',
      key: 'relationSpotsList',
      option: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
      ]
    },
    {
      title: '录入状态',
      key: 'spotStatusList',
      option: Object.keys(StatusColor).map((key) => {
        return { label: StatusColor[key].text, value: +key };
      })
    },
  ];
  const onChange = (value: any, key: string) => {
    // 特殊处理是否开店，如果选了“是”和”否“，那么默认为没选。服务端所需要的isOpenStore为boolean,也就是只有一项值
    if (key === 'isOpenStore') {
      value = value.length === 2 ? undefined : value[0];
    }
    setOptions((state) => ({
      ...state,
      [key]: value
    }));
  };
  return <div className={styles.optionsCon}>
    {
      optionsList.map((item) => <div key={item.key} >
        <div className={styles.title}>{item.title}</div>
        <div className={styles.box}>
          <Checkbox.Group onChange={(value) => onChange(value, item.key)}>
            {
              item.option.map((item) => <div >
                <Checkbox
                  value={item.value}
                >
                  <span
                    className={styles.name}
                  >{item.label}</span>
                </Checkbox>
              </div>)
            }
          </Checkbox.Group>
        </div>
      </div>)
    }


  </div>;
};
export default Options;
