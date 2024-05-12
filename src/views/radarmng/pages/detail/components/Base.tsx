import styles from './index.module.less';
import { urlParams } from '@lhb/func';

const Base = ({ detail }) => {
  const {
    id,
    name,
    status,
    queryChannel,
    creator,
    gmtCreate,
    runTime,
    taskTypeName
  } = urlParams(decodeURI(location.search));
  const items = [
    { name: '任务ID', value: id },
    { name: '状态', value: status },
    { name: '渠道', value: queryChannel },
    { name: '创建人', value: creator },
    { name: '创建时间', value: gmtCreate },
    { name: '总执行时间', value: runTime },
    { name: '进度', value: detail?.progress || '-' },
    { name: '任务类型', value: taskTypeName },
  ];

  return (
    <div className={styles.sectionBase}>
      <div className={styles.sectionTitle}>{name}</div>
      <div className={styles.itemsWrapper}>
        { Array.isArray(items) &&
        items.map((itm: any) => (
          <div key={itm.name} className={styles.item}>
            <span className={styles.itemName}>{itm.name}：</span>
            <span className={styles.itemValue}>{itm.value}</span>
          </div>
        ))
        }
      </div>
    </div>
  );
};

export default Base;
