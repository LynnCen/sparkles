/**
 * @Description 品牌选择
 */

import { FC, useState } from 'react';
import styles from '../entry.module.less';
import { Checkbox, Col, Empty, Row }
  from 'antd';
import cs from 'classnames';

import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { isArray, refactorSelection } from '@lhb/func';
import { Comprehensiveness } from '../ts-config';

import IconFont from '@/common/components/IconFont';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';

const Top:FC<any> = ({
  selectedBrand,
  setSelectedBrand,
  loaded,
  brandList,
  setSelected,
}) => {

  const [arrowUp, setArrowUp] = useState<boolean>(false); // 箭头动画

  const onChange = (value) => {
    if (value.length > 5) {
      V2Message.error('最多选择5个品牌');
      return;
    }
    setSelectedBrand(value);
    // 当选择品牌的时候默认选中综合对比，
    setSelected(Comprehensiveness);
  };

  const onClickFont = () => {
    if (selectedBrand.length < 5) {
      return;
    }
    setSelectedBrand([]);
  };

  return (
    <div className={cs(styles.topContainer)}>
      <div className={styles.banner}>
        <div className={styles.title}>
          <span className={styles.textLeft}>选择品牌</span>
          <span className={styles.textRight}>最多选择5个品牌</span>
        </div>
        <div className={styles.selectContent}>
          <div className={styles.showIcon}>
            <IconFont
              iconHref= 'pc-common-icon-ic_search'
              style={{ width: '14px', height: '14px', color: '#fff' }}
              onClick={onClickFont}
            />
          </div>
          <V2FormSelect
            options={refactorSelection(brandList)}
            placeholder='请输入品牌名称'
            className={cs(styles.select)}
            onChange={onChange}
            config={{
              value: selectedBrand,
              maxTagCount: 'responsive',
              mode: 'multiple',
              showSearch: false,
              allowClear: false,
              autoClearSearchValue: true,
            }}
          />
        </div>
      </div>

      <div className={ styles.checkBoxGroupContain}>
        { !loaded || (isArray(brandList) && brandList.length)
          ? <div className={cs(styles.checkBox, arrowUp && styles.pickUp)}>
            <Checkbox.Group onChange={onChange} value={selectedBrand}>
              <Row>
                {
                  brandList?.map((item) =>
                    <Col span={4} key={item.id} >
                      <Checkbox value={item.id} >
                        <div className={styles.content}>
                          <img src={item.logo} className={styles.icon}/>
                          <span className={styles.brandName}>{item.shortName || item.name}</span>
                        </div>
                      </Checkbox>
                    </Col>
                  )
                }
              </Row>
            </Checkbox.Group>
          </div>
          : <Empty style={{ paddingTop: 30, paddingBottom: 10, margin: 0 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}

        {
          isArray(brandList) && brandList.length > 12 ? <div className={cs(styles.packup,)} onClick={() => setArrowUp(!arrowUp)}>
            {arrowUp ? '展开' : '收起'}
            <IconFont
              iconHref='iconic_shouqi_seven'
              className={cs(styles.arrowIcon, arrowUp ? styles.arrowIconReset : styles.arrowIconRotate)}
            />
          </div> : <></>
        }


      </div>


    </div>
  );
};
export default Top;
