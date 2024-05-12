import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button, message, } from 'antd';
import { isArray } from '@lhb/func';
import styles from '../entry.module.less';
import FormProvinceList from '@/common/components/FormBusiness/FormProvinceList';
import { fetchCityIdByName } from '@/common/api/selection';
import FormSelect from '@/common/components/Form/FormSelect';
import TopCon from '@/common/components/AMap/components/TopCon';
import { useMapLevelAndCity } from '@/common/hook/useMapLevelAndCity';
import IconFont from '@/common/components/IconFont';
import cs from 'classnames';
import { generateReport } from '@/common/api/recommend';
// import { tenantCheck } from '@/common/api/common';
import { recommendModelList } from '@/common/api/recommend';
import ModalHint from '@/common/components/business/ModalHint';

const Top: FC<any> = ({
  change,
  region,
  setId,
  id,
  _mapIns,
  rightDrawerVisible,
  onChangeShow,
  topRef
}) => {
  const { city } = useMapLevelAndCity(_mapIns);
  const [form] = Form.useForm();
  const pcdData = useSelector((state: any) => state.common.provinceCityDistrict);
  const [modelList, setModelList] = useState<any>([]);
  const [scrollPage, setScrollPage] = useState(1);
  const [totalNum, setTotalNum] = useState(0);
  // const [isJianLu, setIsJianLu] = useState<boolean>(false);
  const [PCDType, setPCDType] = useState<number>(1); // 默认为1： 省市区 2： 省市
  const [visible, setVisible] = useState<boolean>(false);
  // 查找指定的城市
  const findTargetCity = (provinceId: number, cityId: number) => {
    // console.log(`provinceId`, provinceId);
    // console.log(`cityId`, cityId);
    const targetProvince = pcdData.find((provinceItem) => provinceItem.id === provinceId);
    if (targetProvince) {
      const { children } = targetProvince;
      if (!(isArray(children) && children.length)) return null;
      return children.find((cityItem) => cityItem.id === cityId);
    }
    return null;
  };
  //  blurHandle失去焦点处理选择省、省市情况
  const blurHandle = () => {
    const val = form.getFieldsValue(['pcdIds']);
    const { pcdIds } = val;
    if (isArray(pcdIds) && pcdIds.length === 1) {
      // 设置为空
      form.resetFields();
      message.error('请选择到市或者区');
      return;
    }
    const provinceId = pcdIds[0];
    const targetProvince = pcdData.find((provinceItem) => provinceItem.id === provinceId);
    if (!targetProvince) return;
    const { children: cityData } = targetProvince;
    const cityId = pcdIds[1]; // 城市id
    const targetCity = cityData.find((cityItem) => cityItem.id === cityId);
    if (pcdIds.length === 2) {
      change({ name: targetCity?.name, level: 'city' });
      return;
    }
  };

  // changeHandle处理选择省市区的情况
  const changeHandle = (value) => {
    if (value.length === 3) {
      const val = form.getFieldsValue(['pcdIds']);
      const { pcdIds } = val;
      const provinceId = pcdIds[0];
      const targetProvince = pcdData.find((provinceItem) => provinceItem.id === provinceId);
      if (!targetProvince) return;
      const { children: cityData } = targetProvince;
      const cityId = pcdIds[1]; // 城市id
      const targetCity = cityData.find((cityItem) => cityItem.id === cityId);
      if (pcdIds.length === 2) {
        change({ name: targetCity?.name, level: 'city' });
        return;
      }
      const { children: districtData } = targetCity;
      const districtId = pcdIds[2]; // 区域id
      const targetDistrict = districtData.find((districtItem) => districtItem.id === districtId);
      change({ name: targetDistrict?.name, level: 'district' });
    }
  };

  // 获取当前地址
  const getCurrentAddress = () => {
    if (region?.level === 'city') {
      fetchCityIdByName({ name: region.name }).then((val) => {
        form.setFieldsValue({ pcdIds: [val.provinceId, val.id] });
      });
    }
  };
  const modelScroll = (e) => {
    e.persist();
    const { target } = e;
    if ((totalNum / 20) < scrollPage) return;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      const page = scrollPage + 1;
      setScrollPage(page);
      fetchModel({ page: page, size: 20 });
    }
  };

  // const getTargetTenant = () => {
  //   tenantCheck().then((data: any) => {
  //     setIsJianLu(data.isJianlu);
  //   });
  // };
  const handleReport = () => {
    const { pcdIds, model } = form.getFieldsValue();
    // if (isJianLu && !pcdIds[2]) {
    //   message.warning('请选择省市区');
    //   return;
    // }
    if (!model) {
      message.error('暂无推荐，请重新选择模型');
    }
    model && generateReport({
      provinceId: pcdIds[0],
      cityId: pcdIds[1],
      districtId: pcdIds[2],
      modelId: model
    }).then((val) => {
      if (val.status === 1) {
        setId(val.id);
        return;
      }
      // {
      //   "errCode": "frequencyControl",
      //   "errMsg": "试用租户已超过每次请求5次上限"
      // }
      if (val.errCode === 'frequencyControl') {
        setVisible(true);
        return;
      }

      message.error('暂无推荐，请重新选择模型');

    }).catch((err: any) => {
      console.log(`err`, err);
    });
  };

  const fetchModel = async (params: any) => {
    const { objectList, totalNum } = await recommendModelList(params);
    setModelList((prev: any) => [...prev, ...objectList]);
    setTotalNum(totalNum);
  };

  useEffect(() => {
    getCurrentAddress();
    // getTargetTenant();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

  useEffect(() => {
    fetchModel({ page: scrollPage, size: 20 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 选择模型变化时
  const modelChange = (id: number, target: any) => {
    // 此时省市区的值
    let { pcdIds: pcdVals } = form.getFieldsValue(['pcdIds']);
    // 1：省市区 2：省市
    const { scope } = target;
    let targetCity: any = null;
    // 省市区已经选择过且当前模型的范围是省市
    if (isArray(pcdVals) && pcdVals.length && scope === 2) {
      pcdVals = [pcdVals[0], pcdVals[1]];
      targetCity = findTargetCity(pcdVals[0], pcdVals[1]); // 记录城市
    }
    form.setFieldsValue({ pcdIds: pcdVals }); // 重新设置省市区组件的值
    setPCDType(scope); // 重新设置省市区组件可选择的范围： 省市 || 省市区
    targetCity && change({ name: targetCity?.name, level: 'city' }); // 已选择过了省市区时但有选择了只支持省市的模型时，重置行政区域范围
  };

  return (
    <div className={styles.top}>
      <Form
        form={form}
        className={styles.positionedCon}>
        <div className={styles.formProvince}>
          <FormProvinceList
            name='pcdIds'
            type={PCDType}
            placeholder='请选择省市/省市区'
            config={{
              allowClear: false,
              changeOnSelect: true,
              onChange: changeHandle
            }}
            onBlur={ () => blurHandle()}
          />
        </div>
        <div className={styles.formSelect}>
          <FormSelect
            name='model'
            placeholder='选择推荐模型'
            config={{
              fieldNames: {
                label: 'name',
                value: 'id'
              },
              onPopupScroll: modelScroll,
              onChange: modelChange
            }}
            options={modelList}
          />
        </div>
        <Button
          type='primary'
          onClick={() => handleReport()}
          className={styles.btn}
        >
          {id ? '重置推荐区域' : '生成推荐区域'}
        </Button>

      </Form>
      {id &&
      <div
        className={styles.topCon}
      >
        <TopCon
          city={city?.name}
          _mapIns={_mapIns}
          boxRef={topRef}
          boxStyle={{
            width: '240px'
          }}
          boxConStyle={{
            marginLeft: '8px'
          }}
        >
          <div
            className={
              cs(styles.fullScreen,
                'bg-fff pointer selectNone',
                !rightDrawerVisible ? 'c-006' : 'c-132')
            }
            onClick={onChangeShow}
          >
            <IconFont
              iconHref='iconic_map_quanping'
              style={{ width: '16px', height: '16px' }} />
            <span className='inline-block ml-5'>{rightDrawerVisible ? '全屏' : '退出全屏'}</span>
          </div>
        </TopCon>
      </div>}
      <ModalHint
        visible={visible}
        setVisible={setVisible}
        content='今天查询次数已达上限，如需更多查询，请联系客服'
      />
    </div>
  );
};

export default Top;
