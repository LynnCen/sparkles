/**
 * @Description 筛选条件
 */
import { FC, Fragment, useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import { useSelector } from 'react-redux';
import { useMethods } from '@lhb/hook';
import { isNotEmpty, isArray, each } from '@lhb/func';
import { searchModalAnchorItems, targetCityIdShowHousing } from '@/views/recommend/pages/industrycircle/ts-config';
import { fetchCityIdByName } from '@/common/api/selection';
import cs from 'classnames';
import styles from './index.module.less';
import V2Form from '@/common/components/Form/V2Form';
import V2Title from '@/common/components/Feedback/V2Title';
import AnchorCom from './AnchorCom';
import Basic from './Basic';
import Brand from './Brand';
import Assort from './Assort';
import Trend from './Trend';
import Footer from './Footer';

const commonSelectConfig = {
  fieldNames: {
    label: 'name',
    value: 'id'
  },
  getPopupContainer: (node) => node.parentNode
};
const SearchModal: FC<any> = ({
  open, // 显示弹窗
  mapIns, // 地图实例
  mapHelpfulInfo,
  selection, // 筛选项
  searchParams, // 接口入参
  setSearchParams, // 设置接口入参
  close, // 关闭弹窗
}) => {
  const [form] = Form.useForm();
  const provinceData = useSelector((state: any) => state.common.provincesCities); // 获取省市数据
  const [districtData, setDistrictData] = useState<any>({ // 区域的数据和选中项
    data: [],
    ids: [], // 选中的区
  });
  const [searchNum, setSearchNum] = useState<number>(0);
  const [showHousingFilter, setShowHousingFilter] = useState<boolean>(true); // 是否展示小区建筑年代 | 小区户数

  // 筛选项的省市、城区和地图的联动
  useEffect(() => {
    if (!open) return;
    const {
      provinceIds,
      cityIds,
      districtIds,
      mainBrandsScoreMin,
      mainBrandsScoreMax
    } = searchParams;
    const params: any = {
      ...searchParams
    };
    if (isArray(provinceIds) && isArray(cityIds) && provinceIds.length && cityIds.length) {
      params.provinceCity = [provinceIds[0], cityIds[0]];
    }
    isNotEmpty(mainBrandsScoreMin) && (params.mainBrandsScore[0] = mainBrandsScoreMin); // 行业评分的回显处理
    isNotEmpty(mainBrandsScoreMax) && (params.mainBrandsScore[1] = mainBrandsScoreMax);
    // 产品青山要求，地图移动时，城区筛选项不需要跟着联动
    delete params['districtIds'];
    form.setFieldsValue(params);
    // 省市区的数据显示
    provinceIds?.[0] && cityIds?.[0] && methods.pcdDataHandle({
      provinceId: provinceIds?.[0],
      cityId: cityIds?.[0],
      districtIds,
    });
  }, [mapHelpfulInfo, open, searchParams, provinceData]);

  const methods = useMethods({
    getRangeRules: (name) => {
      return ({ getFieldValue }) => ({
        validator() {
          const min = getFieldValue(name[0]);
          const max = getFieldValue(name[1]);
          if ((isNotEmpty(min) && isNotEmpty(max)) && min > max) {
            return Promise.reject(new Error('请确保后值大于等于前值'));
          }
          return Promise.resolve();
        },
      });
    },
    formValuesChange: (changedValues: any, allValues: any) => {
      let num = 0;
      each(allValues, (item, key) => {
        if (
          (isArray(item) && (item[0] || item[1])) || // 如果是数组，那至少要有其中一个值
          (!isArray(item) && isNotEmpty(item)) // 如果不是数组，就不能为空
        ) { // 有值的才做插入
          if (key !== 'no-mean') { // 规避掉 no-mean
            num++;
          }
        }
      });
      setSearchNum(num);
    },
    pcdDataHandle: async (target: any) => {
      const { provinceId, cityId, districtIds } = target;
      // 是否显示指定的筛选项
      methods.housingFilterHandle(cityId);

      const { district } = mapHelpfulInfo;
      const { id: districtId } = district;
      const targetProvince = provinceData.find((item: any) => item.id === provinceId);
      if (!targetProvince) return;
      const { children } = targetProvince;
      const targetCity = children?.find((item: any) => item.id === cityId);
      if (!targetCity) return;
      const { name: cityName } = targetCity;
      const { districtList } = await fetchCityIdByName({ name: cityName });
      if (isArray(districtList)) {
        setDistrictData({
          data: districtList,
          ids: isArray(districtIds) ? districtIds : [districtId], // 选中的区
        });
      };
      // 切换城市清空城区选中项
      districtIds?.length === 0 && form.setFieldValue('districtIds', []);
    },
    housingFilterHandle: (cityId: number) => {
      const showTarget = targetCityIdShowHousing.includes(cityId); // 是否显示指定的筛选项
      setShowHousingFilter(showTarget);
      if (!showTarget) { // 不显示时
        form.setFieldValue('houseYearTypes', []);
        form.setFieldValue('householdsTypes', []);
      }
    }
  });

  return (
    <Modal
      title='全部筛选'
      open={open}
      onCancel={close}
      width={786}
      footer={<Footer
        form={form}
        close={close}
        mapIns={mapIns}
        mapHelpfulInfo={mapHelpfulInfo}
        provinceData={provinceData}
        districtData={districtData}
        searchNum={searchNum}
        searchParams={searchParams}
        setSearchNum={setSearchNum}
        setSearchParams={setSearchParams}
      />
      }
      // 控制是否在组件首次渲染时就将 Modal 的内容渲染到 DOM 树中,让modal中的form可以在首次渲染中加载出来
      forceRender
      className={cs('recommendIndustryCircle', styles.recommendIndustryCircleModal)}
    >
      <div className={styles.flexCon}>
        <V2Form
          form={form}
          style={{ width: '630px' }}
          onValuesChange={methods.formValuesChange}
        >
          {
            searchModalAnchorItems.map((item: any, index: number) => (<Fragment key={index}>
              <V2Title
                id={item.id}
                type='H2'
                divider
                style={{ margin: '0 0 16px' }}
              >
                {item.title}
                {
                  item.subhead ? <span className='c-999 fs-12'>{item.subhead}</span> : <></>
                }
              </V2Title>
              {
                item.id === 'recommendIndustryBusinessSearchBasic'
                  ? <Basic
                    districtData={districtData}
                    getRangeRules={methods.getRangeRules}
                    commonSelectConfig={commonSelectConfig}
                    setDistrictData={setDistrictData}
                    pcdDataHandle={methods.pcdDataHandle}
                  /> : <></>
              }
              {
                item.id === 'recommendIndustryBusinessSearchBrand'
                  ? <Brand/> : <></>
              }
              {
                item.id === 'recommendIndustryBusinessSearchAssort'
                  ? <Assort
                    selection={selection}
                    showHousingFilter={showHousingFilter}
                    commonSelectConfig={commonSelectConfig}
                  /> : <></>
              }
              {
                item.id === 'recommendIndustryBusinessSearchTrend'
                  ? <Trend
                    selection={selection}
                    commonSelectConfig={commonSelectConfig}
                  /> : <></>
              }
            </Fragment>
            ))
          }
        </V2Form>
        <AnchorCom
          anchorItems={searchModalAnchorItems}
        />
      </div>
    </Modal>
  );
};

export default SearchModal;
