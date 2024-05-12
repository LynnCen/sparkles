import { FC, useEffect, useState } from 'react';
import { Switch, Input, Radio, RadioChangeEvent, Button } from 'antd';
import {
  saveIndustryConfig,
  getIndustryConfig,
  getHeapMapConfig,
  setHeapMapConfig,
  getBrandPermissionConfig,
  setBrandPermissionConfig
} from '@/common/api/location';
import cs from 'classnames';
import styles from '../../entry.module.less';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

const { TextArea } = Input;

const MapConfig: FC<any> = ({ tenantId }) => {
  const [checked, setChecked] = useState<boolean>(false); // 是否显示
  const [loading, setLoading] = useState<boolean>(false); // 切换显示时的锁
  const [textVal, setTextVal] = useState<string>(''); // 输入框内容
  const [radioVal, setRadioVal] = useState<number>(0); // 单选框内容
  const [heatMapSwitch, setHeatMapSwitch] = useState<boolean>(false); // 人口热力按钮
  const [brandPermSwitch, setBrandPermSwitch] = useState<boolean>(false); // 是否根据数据权限展示品牌

  useEffect(() => {
    // 获取配置信息
    getConfigInfo();
  }, []);

  const getConfigInfo = () => {
    // 获取配置信息
    getIndustryConfig({
      tenantId,
    }).then((res) => {
      // industryTipStatus 1-显示 2-不显示 默认不显示
      const { industryTipStatus, industryTip, shopFunctionStatus } = res || {};
      setChecked(industryTipStatus === 1);
      setRadioVal(shopFunctionStatus);
      industryTip && setTextVal(industryTip);
    });

    // 获取热力配置信息
    getHeapMapConfig({
      tenantId,
    }).then((res) => {
      setHeatMapSwitch(res);
    });

    // 获取是否根据数据权限展示品牌
    getBrandPermissionConfig({
      tenantId,
    }).then((res) => {
      setBrandPermSwitch(res);
    });
  };

  const textareaChange = (e: any) => {
    const str = e.target.value;
    setTextVal(str.replace(/(^\s*)|(\s*$)/g, ''));
  };

  const onRadioChange = (e: RadioChangeEvent) => {
    setRadioVal(e.target.value);
  };

  // 配置人口热力
  const changeHeatMapSwitch = async (val) => {
    setHeatMapSwitch(val);
    try {
      await setHeapMapConfig({ tenantId, flag: val });
      V2Message.success('设置成功');
    } catch (error) {
      V2Message.error('人口热力配置失败,请稍后再试');
      setHeatMapSwitch(false);
    }
  };

  // 配置数据权限展示品牌
  const changeBrandPermSwitch = async (val) => {
    setBrandPermSwitch(val);
    try {
      await setBrandPermissionConfig({ tenantId, flag: val });
      V2Message.success('设置成功');
    } catch (error) {
      V2Message.error('是否根据数据权限展示品牌配置失败,请稍后再试');
      setBrandPermSwitch(false);
    }
  };

  const onSubmit = () => {
    if (checked && !textVal) {
      // 设置显示但是未输入
      V2Message.warning(`请填写文案后再设置显示`);
      return;
    }
    setLoading(true);
    const params = {
      tenantId,
      // 行业地图提示文案显示状态 1-显示 2-不显示
      industryTipStatus: checked ? 1 : 2,
      industryTip: textVal,
      shopFunctionStatus: radioVal,
    };
    saveIndustryConfig(params)
      .then(() => {
        V2Message.success('设置成功');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.industryConfigCon}>
      <div className={styles.itemRow}>
        <div className={styles.labelCon}>是否展示功能区分：</div>
        <div>
          <Radio.Group onChange={onRadioChange} value={radioVal}>
            <Radio value={1}>销售、售后、交付</Radio>
            <Radio value={2}>堂食、外卖</Radio>
            <Radio value={0}>不展示</Radio>
          </Radio.Group>
        </div>
      </div>
      <div className={cs(styles.itemRow, 'mt-12')}>
        <div className={styles.labelCon}>前台信息是否展示：</div>
        <div>
          <Switch
            checkedChildren='显示'
            unCheckedChildren='隐藏'
            loading={loading}
            checked={checked}
            onChange={(val) => setChecked(val)}
          />
        </div>
      </div>
      <div className={cs(styles.itemRow, 'mt-12')}>
        <div className={styles.labelCon}>文案提醒：</div>
        <div>
          <TextArea
            value={textVal}
            showCount
            rows={4}
            placeholder='请输入文案提醒'
            maxLength={100}
            style={{
              minWidth: '500px',
            }}
            onChange={textareaChange}
          />
        </div>
      </div>
      <div className={cs(styles.itemRow, 'mt-12')}>
        <div className={styles.labelCon} />
        <Button type='primary' onClick={onSubmit}>
          提交保存
        </Button>
      </div>
      {/* 人口热力配置 */}
      <div className={cs(styles.itemRow, 'mt-12')}>
        <div className={styles.labelCon}>人口热力按钮: </div>
        <div>
          <Switch
            checkedChildren='显示'
            unCheckedChildren='隐藏'
            loading={loading}
            checked={heatMapSwitch}
            onChange={changeHeatMapSwitch}
          />
        </div>
      </div>
      {/* 品牌按数据权限展示配置 */}
      <div className={cs(styles.itemRow, 'mt-12')}>
        <div className={styles.labelCon}>是否根据数据权限展示品牌: </div>
        <div>
          <Switch
            checkedChildren='是'
            unCheckedChildren='否'
            loading={loading}
            checked={brandPermSwitch}
            onChange={changeBrandPermSwitch}
          />
        </div>
      </div>
    </div>
  );
};

export default MapConfig;
