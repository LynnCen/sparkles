/**
 * @Description 适合度选择器
 */
import { FC, useEffect, useState } from 'react';
import { Cascader, Col, Row, Slider } from 'antd';
import { debounce, isArray, isNotEmpty, isNotEmptyAny, refactorSelection } from '@lhb/func';

// import V2Form from '@/common/components/Form/V2Form';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import styles from './index.module.less';
import { getPlanClusterSearchInfo } from '@/common/api/networkplan';

interface Props {
  // 在这里定义组件的属性（props）
  // 例如：title: string;
  form;
  selections;
  // detail,
  value: any[]
}

const SliderBarSelect: FC<Props> = ({
  selections,
  form,
  // detail,
  value
}) => {
  // 在这里编写组件的逻辑和渲染

  // const value:any = Form.useWatch('proba', form);
  const [sliderVal, setSliderVal] = useState<any>([0, 0]); // 滑块的值
  const [data, setData] = useState<any>({}); // 卡片内的数据

  useEffect(() => {
    if (!(isArray(value) && value.length)) return;
    // 确保value两个值都存在 才进行 setMarksValue_value，否则设为[0,0]
    const min = value[0];
    const max = value[1];
    if ((isNotEmpty(min) && isNotEmpty(max)) && min < max) {
      setSliderVal(value);
      getData(value);
    }
  }, [value]);

  useEffect(() => {
    if (sliderVal.length !== 2) return;
    // getData(sliderVal);
  }, [sliderVal]);

  // 改变滑块的值
  const onChangeSlider = async (value) => {
    setSliderVal(value);
  };
  // 滑块拖动后再set值
  const onAfterChange = (value) => {
    form.setFieldsValue({ 'proba': value });
    getData();
  };

  // 改变规划区域
  // const onChangeDistrict = (value) => {
  //   //
  // };
  // 获取弹窗内的数据
  const getData = debounce(async () => {

    const { districtIdList, proba } = form.getFieldValue();
    const districtIds: number[] = isArray(districtIdList) ? districtIdList.map(subArray => subArray[2]) : [];
    const res = await getPlanClusterSearchInfo({
      districtIds,
      // planId: detail.planId,
      // branchCompanyId: detail.branchCompanyId,
      minProba: proba[0] || 0,
      maxProba: proba[1] || 0,
    });
    setData(res);
  }, 600);

  return (
    <div className={styles.sliderBarSelect}>
      {/* <V2Form form={form} layout='horizontal'> */}
      <V2FormCascader
        label='规划区域'
        name='districtIdList'
        options={refactorSelection(selections?.cities, { children: 'children' })}
        config={{
          multiple: true,
          showCheckedStrategy: Cascader.SHOW_CHILD,
          maxTagCount: 'responsive',
        }}
        onChange={getData}
      />
      {/* </V2Form> */}

      <div className={styles.shortContain}>
        <Row gutter={24}>
          <Col span={8}>
            <div className={styles.item}>
              <span className={styles.value}>{data.areaClusterCount || '-'}</span>
              <span className={styles.label}>区域内推荐商圈数</span>
            </div>
          </Col>
          <Col span={8}>
            <div className={styles.item}>
              <span className={styles.value}>
                {isNotEmptyAny(sliderVal[0]) && isNotEmptyAny(sliderVal[1])
                  ? (sliderVal[0] + '%' + '≤ ~ ≤ ' + sliderVal[1] + '%')
                  : '-'}
              </span>
              <span className={styles.label}>品牌适配度</span>
            </div>
          </Col>
          <Col span={8}>
            <div className={styles.item}>
              <span className={styles.value}>
                {isNotEmptyAny(data.minScore) && isNotEmptyAny(data.maxScore)
                  ? data.minScore + '分' + '≤ ~ ≤ ' + data.maxScore + '分'
                  : '-'}
              </span>
              <span className={styles.label}>益禾堂评分</span>
            </div>
          </Col>
          <Col span={8}>
            <div className={styles.item}>
              <span className={styles.value}>{data.clusterCount || '-'}</span>
              <span className={styles.label}>区间内商圈数</span>
            </div>
          </Col>
          <Col span={8}>
            <div className={styles.item}>
              <span className={styles.value}>{data.avgProba ? (data.avgProba + '%') : '-'}</span>
              <span className={styles.label}>平均品牌适配度</span>
            </div>
          </Col>
          <Col span={8}>
            <div className={styles.item}>
              <span className={styles.value}>{data.predictTargetValue || '-'}</span>
              <span className={styles.label}>测算目标值</span>
            </div>
          </Col>
        </Row>
      </div>
      <Slider
        min={0}
        max={100}
        onChange={onChangeSlider}
        onAfterChange={onAfterChange}
        value={sliderVal}
        range={{ draggableTrack: true }}
      />
    </div>
  );
};

export default SliderBarSelect;
