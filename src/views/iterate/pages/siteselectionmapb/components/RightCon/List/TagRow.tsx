/**
 * @Description 标签行
 */

import { FC, useEffect, useRef, useState } from 'react';
import { LabelType, typeSmallLabelImgMap } from '@/views/iterate/pages/siteselectionmap/ts-config';
import { getLabelRelations } from '@/common/api/networkplan';
import { isArray } from '@lhb/func';
// import cs from 'classnames';
import styles from './index.module.less';
import V2Tag from '@/common/components/Data/V2Tag';

const TagRow: FC<any> = ({
  id,
  setHasLabel
}) => {
  // const [typeLabelImg, setTypeLabelImg] = useState<string>(''); // 类型标签（A/B/C/D），可能为空
  const [labelsData, setLabelsData] = useState<any[]>([]);
  const statusRef: any = useRef(true);

  useEffect(() => {
    id && loadLabels();
    return () => {
      statusRef.current = false;
    };
  }, [id]);

  const loadLabels = async () => {
    const data = await getLabelRelations({ modelClusterId: id });
    const typeLabels = data[LabelType.NetPlan];
    const typLbl = isArray(typeLabels) && typeLabels.length ? typeLabels[0].name : null;
    let target: any;
    if (typLbl) {
      target = typeSmallLabelImgMap.get(typLbl);
      // statusRef.current && target && setTypeLabelImg(target);
    }
    // 1 系统标签、3 自定义标签，合并展示
    const systemLabels = data[LabelType.System];
    const customLabels = data[LabelType.Custom];
    const labels = [
      ...(isArray(systemLabels) ? systemLabels.map(obj => obj.name) : []),
      ...(isArray(customLabels) ? customLabels.map(obj => obj.name) : [])
    ];

    statusRef.current && setLabelsData(labels);
    setHasLabel(labels?.length > 0 || !!target);
  };

  return <>
    {
      labelsData?.length > 0
        ? <div className={styles.labelsCon}>
          {/* {
            typeLabelImg ? <div className={styles.imgCon}>
              <img
                src={typeLabelImg}
                width='100%'
                height='100%'
              />
            </div> : <></>
          } */}
          {
            labelsData?.map((labelItem, index) => <div className='mb-8' key={index}>
              <V2Tag color='blue'>{labelItem}</V2Tag>
            </div>)
          }
        </div> : <></>
    }
  </>;
};

export default TagRow;
