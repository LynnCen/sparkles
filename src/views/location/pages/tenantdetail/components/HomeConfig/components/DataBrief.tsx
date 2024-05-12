import React from 'react';
import {
  UsergroupDeleteOutlined
} from '@ant-design/icons';
import styles from './index.module.less';
interface DataBriefProps {
  data: any
}
const randomLightness = Math.random() * 20 + 70; // 70 到 90 之间的随机亮度

const randomColor = `hsl(${Math.random() * 360}, 100%, ${randomLightness}%)`;

const backgroundStyle = {
  background: randomColor,
  /* 其他样式属性 */
};
const DataBrief: React.FC<DataBriefProps> = (props) => {
  const { data } = props;
  const length = data.length;
  const wrap = length > 6;
  return <section className={wrap ? styles.wrapList : styles.list}>
    {props.data.map((item, index) => (
      <div key={index} className={styles.card}>
        <div className={styles.cardImg} style={backgroundStyle}>
          <UsergroupDeleteOutlined twoToneColor='#eb2f96' />
        </div>
        <article className={styles.cardContent}>
          <div className={styles.cardTitle}>{item.title}</div>
          <div className={styles.description}>
            <span className={styles.total}>236</span>
            <span className={styles.accumulation}>累计2432</span>
          </div>
        </article>
      </div>
    ))}
  </section>;
};

export default DataBrief;
