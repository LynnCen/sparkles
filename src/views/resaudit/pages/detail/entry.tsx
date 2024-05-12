import { Button } from 'antd';
import { FC, useEffect, useState } from 'react';
import styles from './entry.module.less';
import SimilarTable from './components/SimilarTable';
import { useMethods } from '@lhb/hook';
import { getSimilarPlace, getSimilarSpot } from '@/common/api/audit';
import { LoadDataProps } from './ts-config';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { urlParams } from '@lhb/func';
import Info from './components/Info';

const Detail: FC<any> = () => {
  const { examineOrderId, resourceType, categoryId, placeName, backUrl = '' } = urlParams(location.search);
  const [categoryTemplateId, setCategoryTemplateId] = useState(0);

  const [loadData, setLoadData] = useState<null | LoadDataProps>(null);
  const [selectSilimarInfo, setSelectSilimarInfo] = useState<any>({});
  const text = resourceType === '0' ? '场地' : '点位';

  /* hooks */
  useEffect(() => {
    getSimilarData();
  }, []);

  /* methods */
  const {
    getSimilarData,
    onClickCompare,
    onClickAdd
  } = useMethods({
    getSimilarData: () => {
      const func = resourceType === '0' ? getSimilarPlace : getSimilarSpot; // 区分场地/展位
      const params = { examineOrderId };
      func(params).then((response: any) => {
        if (response.totalNum > 0) {
          setLoadData({
            dataSource: response.objectList,
            count: response.totalNum,
          });
        }
      });
    },

    onClickCompare: () => {
      const { name, id } = selectSilimarInfo;
      dispatchNavigate(`/resaudit/compare?examineOrderId=${examineOrderId}&categoryId=${categoryId}&categoryTemplateId=${categoryTemplateId}&resourceType=${resourceType}&resourceId=${id}&name=${name}&placeName=${placeName}${backUrl ? `&backUrl=${backUrl}` : ''}`);
    },
    onClickAdd: () => {
      dispatchNavigate(`/resaudit/add?examineOrderId=${examineOrderId}&categoryId=${categoryId}&categoryTemplateId=${categoryTemplateId}${backUrl ? `&backUrl=${backUrl}` : ''}`);
    }
  });
  return (
    <div className={styles.container}>
      <div className={styles.mainWrap}>
        <div>
          <div className={styles.titleWrap}>
            <h2 className={styles.title}>{text}信息</h2>
            <div className={styles.tip}>{!loadData ? `系统判断无相似${text}，请点击下方“新增${text}”` : `系统判断存在${loadData.count}个相似${text}`}</div>
          </div>
          <Info onCategoryTemplateId={(val) => setCategoryTemplateId(val)}/>
        </div>
        {!!loadData && (
          <div className={styles.similarWrap}>
            <div className={styles.titleWrap}>
              <h2 className={styles.title}>系统内相似{text}</h2>
            </div>
            <div className={styles.similarContent}>
              <p className={styles.tip}>若是重复{text}，请勾选系统{text}并点击下方“对比重复{text}”。若非重复{text}，请直接点击“新增{text}”</p>
              <SimilarTable
                onSelectChange={(val: number) => setSelectSilimarInfo(val)}
              />
            </div>
          </div>
        )}
      </div>
      <div className={styles.footerCon}>
        {!!loadData && (
          <Button type='primary' disabled={!selectSilimarInfo.id} onClick={onClickCompare}>对比重复{text}</Button>
        )}
        <Button type='primary' className='ml-32' onClick={onClickAdd}>新增{text}</Button>
      </div>
    </div>
  );
};

export default Detail;
