/**
 * @Description 从商圈详情迁移过来的
 */

import { FC, useEffect, useMemo, useState } from 'react';
import { isArray } from '@lhb/func';
import { getLabelRelations } from '@/common/api/networkplan';
import { typeLabelImgMap } from '@/views/iterate/pages/siteselectionmap/ts-config';
// import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import cs from 'classnames';
// import IconFont from '@/common/components/IconFont';

const Top: FC<any> = ({
  id,
  token,
}) => {
  // const [isFold, setIsFold] = useState<boolean>(true); // 标签行是否折叠，折叠情况下只展示一行
  const [typeLabel, setTypeLabel] = useState<string>(''); // 类型标签（A/B/C/D），可能为空
  const [labels, setLabels] = useState<string[]>([]); // 类型标签（A/B/C/D）以外的其他标签，可能为空

  useEffect(() => {
    if (!id) return;
    getLabels();
  }, [id]);

  /**
   * @description 请求商圈标签
   *
   *  商圈id变动、以及标签编辑后
   */
  const getLabels = () => {
    setTypeLabel('');
    setLabels([]);

    // 当前商圈设定的网规标签、自定义标签
    getLabelRelations({
      modelClusterId: id,
      pdfPageUserToken: token,
    }).then((data) => {
      // 2 网规标签
      const curTypeLabels = data['2'];
      if (isArray(curTypeLabels) && curTypeLabels.length) {
        setTypeLabel(curTypeLabels[0].name);
      }
      // 1 系统标签、3 自定义标签，合并展示
      const curSystemLabels = data['1'];
      const curCustomLabels = data['3'];
      setLabels([
        ...(isArray(curSystemLabels) ? curSystemLabels.map(obj => obj.name) : []),
        ...(isArray(curCustomLabels) ? curCustomLabels.map(obj => obj.name) : [])
      ]);
    });
  };

  /**
   * @description 类型标签img
   */
  const typeLabelImg = useMemo(() => {
    return typeLabel ? (typeLabelImgMap.get(typeLabel) || '') : '';
  }, [typeLabel]);

  return (
    <>
      {/* <div className={cs(styles.labelRow, 'mt-8')}> */}
      {/* <div className={styles.labelRowWrap}> */}
      {isArray(labels) && !!labels.length ? <div className={cs(styles.labelRow, 'mt-8')}>
        {typeLabelImg ? <div className={cs(styles.typeIcon, 'mr-8')}>
          <img src={typeLabelImg} width='100%' height='100%' />
        </div> : <></>}
        {labels.map((lbl:string, index: number) => <div key={index} className={styles.label}>{lbl}</div>)}
      </div> : <></>}
      {/* </div> */}
      {/* </div> */}
    </>
  );
};

export default Top;
