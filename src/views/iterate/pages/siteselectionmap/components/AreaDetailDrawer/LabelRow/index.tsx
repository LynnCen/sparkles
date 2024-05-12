/**
 * @Description 标签(从原本的Top组件迁移过来的)
 */

import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { isArray } from '@lhb/func';
import { getLabelRelations } from '@/common/api/networkplan';
import { typeLabelImgMap } from '../../../ts-config';
// import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import cs from 'classnames';
import IconFont from '@/common/components/IconFont';
// import LabelEdit from '../LabelEdit';
import LabelEdit from '@/views/iterate/pages/siteselectionmap/components/LabelEdit';
// const dataLimit = '2023年3月'; // 目前固定数据更新日期

const Top: FC<any> = ({
  id,
  onLabelChanged, // 标签编辑后回调
  labelOptionsChanged,
  isMall,
}) => {
  const labelRef = useRef<any>(null);// 标签ref

  const [isFold, setIsFold] = useState<boolean>(true); // 标签行是否折叠，折叠情况下只展示一行
  const [typeLabel, setTypeLabel] = useState<string>(''); // 类型标签（A/B/C/D），可能为空
  const [labels, setLabels] = useState<string[]>([]); // 类型标签（A/B/C/D）以外的其他标签，可能为空

  const [labelModal, setLabelModal] = useState<any>({
    visible: false,
    id,
  }); // 标签编辑弹窗

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
    getLabelRelations({ modelClusterId: id }).then((data) => {
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

  const handleEditLabel = () => {
    setLabelModal({
      visible: true,
      id,
    });
  };

  const onChanged = () => {
    getLabels();
    onLabelChanged && onLabelChanged();
  };

  /**
   * @description 类型标签img
   */
  const typeLabelImg = useMemo(() => {
    return typeLabel ? (typeLabelImgMap.get(typeLabel) || '') : '';
  }, [typeLabel]);

  return (
    <>
      <div className={cs(styles.labelRow, 'mt-8')}>
        <div className={styles.labelRowWrap} >
          {isArray(labels) && !!labels.length ? <div className={cs(styles.labelsWrapper, isFold && styles.isFold,
            isMall ? styles.isMall : ''
          )}
          ref={labelRef}
          >
            {typeLabelImg ? <div className={cs(styles.typeIcon, 'mr-8')}>
              <img src={typeLabelImg} width='100%' height='100%' />
            </div> : <></>}
            {labels.map((lbl:string, index: number) => <div key={index} className={styles.label}>{lbl}</div>)}
          </div> : <></>}
          <div className={styles.operations}>
            {isArray(labels) && !!labels.length &&
            // 判断在非展开情况下，高度是否会超过可视高度
            (labelRef?.current?.offsetHeight < labelRef?.current?.scrollHeight || !isFold)
              ? <div className={cs(styles.btn, 'mr-8')} onClick={() => setIsFold((!isFold))}>
                <IconFont
                  iconHref='pc-common-icon-a-iconarrow_down'
                  className={isFold ? styles.arrowIcon : styles.arrowIconUp} style={{ color: '#979797' }}
                />
              </div> : <></>}
            <div className={styles.btn} onClick={handleEditLabel}>
              <IconFont
                iconHref='pc-common-icon-ic_edit'
                style={{ color: '#979797' }}
              />
            </div>
          </div>
        </div>
        {/* <div className={styles.rightExpand}>
          数据说明<QuestionCircleOutlined className={styles.questionIcon} onClick={() => setOpenDataInfo(true)} />
        </div> */}
      </div>

      <LabelEdit
        visible={labelModal.visible}
        id={labelModal.id}
        setVisible={visible => setLabelModal((state: any) => ({ ...state, visible }))}
        optionsChanged={labelOptionsChanged}
        onChanged={onChanged}
      />
    </>
  );
};

export default Top;
