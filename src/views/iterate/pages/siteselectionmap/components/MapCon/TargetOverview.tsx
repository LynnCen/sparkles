/**
 * @Description 商圈概览内容
 */

import { FC, useEffect, useMemo, useState } from 'react';
import { Typography, Button, Divider } from 'antd';
import { isArray } from '@lhb/func';
import { EditOutlined } from '@ant-design/icons';
import { LabelType, typeLabelImgMap } from '@/views/iterate/pages/siteselectionmap/ts-config';
import { getLabelRelations } from '@/common/api/networkplan';
import LabelEdit from '../LabelEdit';
import AreaDetailDrawer from '../AreaDetailDrawer';
import cs from 'classnames';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Tag from '@/common/components/Data/V2Tag';
import V2Empty from '@/common/components/Data/V2Empty';
import TabsChart from './TabsChart';

const { Text } = Typography;

const TargetOverview: FC<any> = ({
  detail,
  close,
  labelOptionsChanged,
  setAreaChangedLabels,
}) => {
  const [typeLabel, setTypeLabel] = useState<string>(''); // 类型标签（A/B/C/D），可能为空
  const [labels, setLabels] = useState<string[]>([]); // 类型标签（A/B/C/D）以外的其他标签，可能为空
  const [labelModal, setLabelModal] = useState<any>({
    visible: false,
    id: detail?.id,
  }); // 标签编辑弹窗
  const [drawerData, setDrawerData] = useState<any>({
    open: false,
    id: detail?.id,
  }); // 详情抽屉
  // 组织概览的滚动导致地图的移动
  const stopPropagation = (e: any) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (!detail?.id) return;
    getLabels(false);
  }, [detail?.id]);

  /**
   * @description 请求商圈标签
   *
   *  商圈id变动、以及标签编辑后
   */
  /**
   * @description 请求商圈标签（商圈id变动、以及标签编辑后执行）
   * @param isUpdate 是否编辑标签后的再次请求
   */
  const getLabels = (isUpdate = false) => {
    setTypeLabel('');
    setLabels([]);

    // 当前商圈设定的网规标签、自定义标签
    getLabelRelations({ modelClusterId: detail?.id }).then((data) => {
      // 2 网规标签
      const typeLabels = data[LabelType.NetPlan];
      const typLbl = isArray(typeLabels) && typeLabels.length ? typeLabels[0].name : null;
      typLbl && setTypeLabel(typLbl);

      // 1 系统标签、3 自定义标签，合并展示
      const systemLabels = data[LabelType.System];
      const customLabels = data[LabelType.Custom];
      const lbls = [
        ...(isArray(systemLabels) ? systemLabels.map(obj => obj.name) : []),
        ...(isArray(customLabels) ? customLabels.map(obj => obj.name) : [])
      ];
      setLabels(lbls);

      // 回调变动信息
      if (isUpdate && setAreaChangedLabels) {
        // console.log('回调变动信息', data);
        setAreaChangedLabels((state: any) => ([
          ...(isArray(state) ? state.filter(stt => stt.id !== detail?.id) : []),
          ...[{ id: detail?.id, labelTypeMap: data }]
        ]));
      }
    });
  };

  /**
   * @description 展示详情
   */
  const handleDetailDrawer = () => {
    setDrawerData({
      open: true,
      id: detail?.id,
    });
  };

  /**
   * @description 展示标签编辑
   */
  const handleEditLabel = () => {
    setLabelModal({
      visible: true,
      id: detail?.id,
    });
  };

  /**
   * @description 标签编辑后刷新
   */
  const onLabelChanged = () => {
    getLabels(true);
  };

  /**
   * @description 编辑选项变动
   */
  const onLabelOptionsChanged = () => {
    labelOptionsChanged && labelOptionsChanged();
  };

  /**
   * @description 类型标签img
   */
  const typeLabelImg = useMemo(() => {
    return typeLabel ? (typeLabelImgMap.get(typeLabel) || '') : '';
  }, [typeLabel]);

  return (
    <div
      className={styles.overviewCon}
      onMouseMove={stopPropagation}
      onMouseDown={stopPropagation}
      onMouseUp={stopPropagation}
      onWheel={stopPropagation}
    >
      <div className={styles.titCon}>
        <Text
          style={{ width: 270 }}
          ellipsis={{ tooltip: detail?.areaName }}
          className='c-222 bold fs-16 pr-12'
        >
          {detail?.areaName}
        </Text>
        <div className={styles.closeIcon}>
          <IconFont
            iconHref='iconic-closexhdpi'
            className='c-959'
            onClick={close}
          />
        </div>
      </div>
      <div className={styles.mainCon}>
        <div className={styles.rankCon}>
          {
            typeLabelImg ? <div className={styles.labelType}>
              <img
                src={typeLabelImg}
                alt='标签'
                width='100%'
                height='100%'
              />
            </div> : <></>
          }
          <div className={cs('fs-12 c-999', typeLabelImg ? 'ml-4' : '')}>
            {detail?.districtName}{detail?.secondLevelCategory}商圈排名第&nbsp;<span className='fs-12 bold c-006'>{detail?.mainBrandsRank}</span>&nbsp;名
          </div>
        </div>
        <div className={styles.infoCon}>
          <div className={styles.infoItem}>
            <div className='c-ff8 fs-12'>
              <span className='fs-16 bold pr-2'>{detail?.mainBrandsScore || '-'}</span>分
            </div>
            <div className='c-666 fs-12 mt-2'>
              商圈行业评分
            </div>
          </div>
          <div className={styles.infoItem}>
            <div className='c-222'>
              <span className='fs-16 bold'>{detail?.highestTypeGt3years}</span>
            </div>
            <div className='c-666 fs-12 mt-2'>
              3年以上主业态
            </div>
          </div>
        </div>
        <Divider style={{ margin: '10px 0 0' }}/>
        <TabsChart detail={detail}/>
        <Divider style={{ margin: '10px 0 8px' }}/>
        <div className={styles.labelCon}>
          <V2Title
            extra={<div className='c-999 fs-12 pointer' onClick={handleEditLabel}>
              <EditOutlined />
              <span className='pl-4'></span>
              编辑标签
            </div>}>
            <span className='fs-12 c-222 bold'>商圈标签</span>
          </V2Title>
          <div>
            {
              isArray(labels) && !!labels.length ? labels.map((lbl:string, index: number) => <V2Tag
                key={index}
                color='blue'
                style={{ display: 'inline-block', marginBottom: '4px' }}
              >
                {lbl}
              </V2Tag>) : <V2Empty customTip='暂无标签'/>

            }
          </div>
        </div>
      </div>
      <div className={styles.footerCon}>
        <Button
          type='primary'
          block
          shape='round'
          onClick={handleDetailDrawer}
        >
          查看商圈详情
        </Button>
      </div>
      {/* 编辑标签 */}
      <LabelEdit
        visible={labelModal.visible}
        id={labelModal.id}
        setVisible={visible => setLabelModal((state: any) => ({ ...state, visible }))}
        optionsChanged={onLabelOptionsChanged}
        onChanged={onLabelChanged}
      />
      {/* 详情抽屉 */}
      <AreaDetailDrawer
        drawerData={drawerData}
        setDrawerData={setDrawerData}
        labelOptionsChanged={onLabelOptionsChanged}
        onLabelChanged={onLabelChanged}
      />
    </div>
  );
};

export default TargetOverview;
