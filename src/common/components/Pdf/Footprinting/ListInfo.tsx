import { Descriptions } from 'antd';
import { FC, } from 'react';
import styles from './entry.module.less';
const ListInfo: FC<any> = ({ list, pics, label }) => {
  return (
    <div className={styles.listInfoCon}>
      <>
        {/* 列表 */}
        <Descriptions column={1}>
          {list.map((item, index) => (
            <Descriptions.Item label={item.label} key={index}>
              <span className={styles.text}>{item.content}</span>
            </Descriptions.Item>
          ))}
        </Descriptions>

        {/* 图片（默认展示前两张） */}
        {label && <Descriptions layout='vertical'>
          <Descriptions.Item
            label={label}
            className={styles.imgList} >
            {
              (pics?.filter((item, index) =>
                index < 2
              ).map((item, index) => (
                <img src={item} key={index}/>
              ))) || '-'
            }
          </Descriptions.Item>
        </Descriptions>}
      </>
    </div>
  );
};

export default ListInfo;
