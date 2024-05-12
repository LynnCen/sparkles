/**
 * @Description 周边查询-搜索过滤
 * TODO 待重构
 */
import { FC, useEffect, useState, useRef } from 'react';
import { Form, Button } from 'antd';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import IconFont from '@/common/components/IconFont';
import Share from '@/common/components/business/SurroundDrawer/components/Share';
import POISearch from './POISearch';
import { useNavigate } from 'react-router-dom';
import styles from '../entry.module.less';
import { isArray, isNotEmptyAny } from '@lhb/func';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import { getLngLatAddress } from '@/common/utils/map';
import { diyShape, radiusOptions } from '../ts-config';
// import DIYShape from './DIYShape';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import DIYShape from './DIYShape';
// import DrawShape from './DIYShape1';

interface FilterProps {
  mapIns: any;
  // city?: any;
  // level?: number;
  cityInfoRef: any;
  detail?: any, // 周边搜索结果详情
  cityInfoValue?: any, // 当前城市
  targetName: string; // 搜索限定的范围
  setTargetName: (name: string) => void;
  setCityInfoValue: (ids: number[]) => void;
  onSearch: (values?: any) => void;
  onReset: () => void;
  isDiyShapeRef:any;// 查询范围是否为自定义形状
}

const Filter: FC<FilterProps> = ({
  mapIns,
  // city,
  // level,
  cityInfoRef,
  detail,
  cityInfoValue,
  targetName,
  setTargetName,
  setCityInfoValue,
  onSearch,
  onReset,
  isDiyShapeRef, // 查询范围是否为自定义形状
}) => {
  const [form] = Form.useForm();
  const radius = Form.useWatch('radius', form);

  const navigate = useNavigate();

  const [poiValues, setPoiValues] = useState<any>({});
  const [searchValue, setSearchValue] = useState<string>('');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);// 是否在绘制中，打了一个点后才算绘制中
  const [changePoint, setChangePoint] = useState<any>({
    lnglat: {
      lng: null,
      lat: null
    },
    update: 0
  });// 默认0，++则触发

  const centerMarkerRef: any = useRef(null); // 中心点marker
  const circleMarkerRef: any = useRef(null); // 圆形矢量图marker
  const shapeInfoRef: any = useRef(null); // 自定义形状信息


  useEffect(() => {
    if (cityInfoValue?.length) {
      form.setFieldsValue({ pcdIds: [...cityInfoValue] });
    }
  }, [cityInfoValue]);

  const onFinish = (values: any) => {
    /*
      重置输入时
      与一般页面上的重置筛选条件后，会发送请求不同。
      周边查询的参数是必须项，在重置输入时不应该请求
    */

    if (!values.keyword || !values.radius) {
      onReset && onReset();
      return;
    }
    let params:any;
    if (values.radius === diyShape) {
      const area = shapeInfoRef.current?.area / 1000 / 1000;
      if (area > 80) {
        V2Message.error(`当前面积为${area}km²，超过最大面积80km`);
        return;
      }
      params = {
        ...poiValues,
        // 让borders闭合
        borders: [...shapeInfoRef.current.borders, shapeInfoRef.current.borders[0]], // 半径米
        area, // 面积平方千米
        poiSearchType: 2, // 1圆形2多边形
      };
    } else {
      params = {
        ...poiValues,
        radius: values.radius, // 半径米
        area: Math.PI * (values.radius / 1000.0) * (values.radius / 1000.0), // 面积平方千米
        poiSearchType: 1, // 1圆形2多边形
      };
    }
    onSearch && onSearch(params);
  };

  // 重置，目前不能使用组件自带的form.resetFields,会导致POISearch的重新渲染（当前结构是不能重新渲染的）
  const customReset = () => {
    console.log('isDrawing', isDrawing);
    if (isDrawing) {
      handleDelete();
      return;
    }
    form.setFieldsValue({
      'keyword': '',
      'radius': '',
    });
    setSearchValue('');
  };

  const jumpHistory = () => {
    navigate('/surround/history');
  };

  const cityChange = async(val: any, target: any[]) => {
    if (isArray(target) && target.length) {
      const targetProvince = target[0];
      const targetCity = target[1];
      const targetData = targetCity || targetProvince; // 可能只选择了省，
      const { lng, lat, name: cityName, id: cityId } = targetData || {};
      cityName && setTargetName(cityName);
      let formattedAddress = cityName;
      if (+lng && +lat) {
        const lnglat = [+lng, +lat];
        mapIns.setCenter(lnglat);
        centerMarkerRef.current.setPosition(lnglat);
        if (circleMarkerRef.current && radius) {
          circleMarkerRef.current.setCenter(lnglat);
        }

        const addressInfo: any = await getLngLatAddress(lnglat, '', false).catch((err) => console.log(`根据经纬度查询具体地址失败：${err}`));
        formattedAddress = addressInfo.formattedAddress || cityName;

        setPoiValues({
          lng: +lng,
          lat: +lat,
          address: formattedAddress,
          cityId
        });
      }
      form.setFieldValue('keyword', formattedAddress);
      setSearchValue(formattedAddress);
    }
  };

  // 二次确认，是否清除自定义形状绘制
  const handleDelete = () => {
    V2Confirm({
      content: `确认删除绘制的自定义形状吗？`,
      onSure() {
        onDelete();
      },
      okText: '确认',
      centered: true
    });
  };

  // 确认删除自定义形状后的操作
  const onDelete = () => {
    form.setFieldsValue({
      'keyword': '',
      'radius': '',
    });
    setSearchValue('');
  };

  useEffect(() => {
    if (radius !== diyShape) {
      setIsDrawing(false);
      if (isDiyShapeRef.current === true && isDrawing) {
        V2Message.info(`已取消绘制自定义形状`);
      }
    }
    isDiyShapeRef.current = radius === diyShape;
  }, [radius]);
  return (
    <>
      <SearchForm
        form={form}
        onSearch={onFinish}
        labelLength={4}
        colon={false}
        showResetBtn={false}
        extra={
          <Button

            type='link'
            icon={<IconFont iconHref='icon-xzzw_ic_reset_normal' />}
            onClick={() => customReset()}
          >
            <span className='pl-6'>重置</span>
          </Button>
        }
        requiredMark={false}
        rightOperate={
          <div className={styles.extraButtons}>
            <Button onClick={jumpHistory} icon={<IconFont iconHref='icona-ic_queryhistory' />}>
              <span className='ml-4'>查询历史</span>
            </Button>
            {isNotEmptyAny(detail) && <Share detail={detail} className='ml-5' />}
          </div>}>
        <V2FormProvinceList
          label='查询城市'
          name='pcdIds'
          type={2}
          allowClear={false}
          placeholder='请选择省或者省市'
          disabled={isDrawing}
          config={{
            expandTrigger: 'hover',
            changeOnSelect: true,
            onChange: cityChange,

          // onChange: (val, record) => {
          //   mapIns.setCenter([record[record.length - 1].lng, record[record.length - 1].lat]);
          // }
          }}
        />
        <Form.Item
          label='查询地点'
          name='keyword'
          required={true}
          className={styles.keywordInput}
          rules={[{ required: true, message: '请选择地点' }]}>
          <POISearch
            form={form}
            cityInfoRef={cityInfoRef}
            // city={city || {}}
            // level={level}
            centerMarkerRef={centerMarkerRef}
            circleMarkerRef={circleMarkerRef}
            setTargetName={setTargetName}
            setCityInfoValue={setCityInfoValue}
            cityLimitName={targetName}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            radius={radius}
            mapIns={mapIns}
            onChange={(vals) => setPoiValues(vals)}
            isDiyShapeRef={isDiyShapeRef}
            isDrawing={isDrawing}
            changePoint={changePoint}
          />
        </Form.Item>
        <V2FormSelect
          label='查询范围'
          name='radius'
          options={radiusOptions}
          required={true}
        />
      </SearchForm>

      <DIYShape
        mapIns={mapIns}
        isDiyShapeRef={isDiyShapeRef}
        setIsDrawing={setIsDrawing}
        radius={radius}
        handleDelete={handleDelete}
        shapeInfoRef={shapeInfoRef}
        setChangePoint={setChangePoint}
        // 定位
        // form={form}
        // cityInfoRef={cityInfoRef}
        // setCityInfoValue={setCityInfoValue}
        // setTargetName={setTargetName}
        // onChange={(vals) => setPoiValues(vals)}
        // setSearchValue={setSearchValue}
      />
    </>
  );
};

export default Filter;
