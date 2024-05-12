import { FC, useEffect, useRef, useState } from 'react';
// import cs from 'classnames';
import styles from './index.module.less';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Container from '@/common/components/Data/V2Container';
import { Button, Col, Form, Popover, Row } from 'antd';
import { useMethods } from '@lhb/hook';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import V2Form from '@/common/components/Form/V2Form';
import { isArray, refactorSelection } from '@lhb/func';
// import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import DistrictMap from './DistrictMap';
import { post } from '@/common/request';
// import { searchPOI } from '@/common/utils/map';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import { getTreeSelection } from '@/common/api/networkplan';
import { getStorage, setStorage } from '@lhb/cache';

const DistrictModal: FC<any> = ({
  planId,
  // searchCity = '全国',
  visible,
  close,
  branchCompanyId,
  onAdd,
  isBranch
}) => {
  // const tipStepRef = useRef<number>(1);

  // const centerMarkerRef: any = useRef(); // 中心点marker
  const [form] = Form.useForm();
  // const [mainHeight, setMainHeight] = useState<number>(0);
  // const [options, setOptions] = useState<any[]>([]);
  const [selection, setSelection] = useState<any>({}); // 下拉框选项
  // const [fetching, setFetching] = useState(false); // 是否在搜索中
  const [amapIns, setAmapIns] = useState<any>(null);
  const [tipStep, setTipStep] = useState<number>(getStorage('hasTipAddBusiness') ? -1 : 0);
  const centerRef = useRef<any>();
  const districtMapRef = useRef<any>(null);

  const methods = useMethods({
    // handleSearch: debounce((keyword: string) => {
    //   // 地图没加载完成时，不搜索
    //   setOptions([]);
    //   setFetching(true);

    //   searchPOI(keyword, searchCity, { extensions: 'all' }).then((pois) => {
    //     setFetching(false);
    //     if (isArray(pois)) {
    //       // 过滤出有经纬度的数据
    //       const targetPois = pois.filter((poi: any) => {
    //         const { location } = poi;
    //         const { lng, lat } = location || {};
    //         return lng && lat;
    //       });
    //       setOptions(targetPois);
    //       return;
    //     }
    //   }).finally(() => {
    //     setFetching(false);
    //   });
    // }, 300),
    // 选择搜索的地址
    // async changeHandle(id: string, option: any) {
    //   // clear时option是null
    //   if (!option) return;
    //   if (!amapIns) return;
    //   const { location } = option;
    //   const { lng, lat } = location || {};
    //   if (lng && lat) methods.addCenterMarker(lng, lat);
    // },
    // 添加详细地址的marker
    // addCenterMarker(lng, lat) {
    //   if (!amapIns) return;
    //   // 更新位置
    //   centerRef.current = { lng, lat };
    //   if (centerMarkerRef.current) {
    //     amapIns.add(centerMarkerRef.current);
    //     centerMarkerRef.current.setPosition([lng, lat]);
    //     amapIns.setFitView(centerMarkerRef.current);
    //     return;
    //   }
    //   const customIcon = new window.AMap.Icon({
    //     // 图标尺寸
    //     size: new window.AMap.Size(41, 48.5),
    //     // 图标的取图地址
    //     image: `https://staticres.linhuiba.com/project-custom/store-assistant-h5/shop_location@2x.png`,
    //     // 图标所用图片大小
    //     imageSize: new window.AMap.Size(41, 48.5),
    //     // 图标取图偏移量
    //     // imageOffset: new AMap.Pixel(0, 10)
    //   });

    //   const marker = new window.AMap.Marker({
    //     position: new window.AMap.LngLat(lng, lat),
    //     // 将一张图片的地址设置为 icon
    //     icon: customIcon,
    //     // 设置了 icon 以后，设置 icon 的偏移量，以 icon 的 [center bottom] 为原点
    //     offset: new window.AMap.Pixel(-41 / 2, -48.5),
    //   });
    //   amapIns.add(marker);
    //   amapIns.setFitView(marker);
    //   centerMarkerRef.current = marker;
    // },
    async  submit() {
      form.validateFields().then((values) => {
        const graphInfo = districtMapRef.current?.getGraphInfo();
        if (!graphInfo) {
          V2Message.warning('请绘制商圈形状');
          return;
        }
        if (!methods.checkCity(graphInfo.adcode)) {
          V2Message.warning('您当前暂无该城市权限');
          return;
        }
        const params = {
          planId: planId,
          branchCompanyId: branchCompanyId,
          firstLevelCategory: values.businessDistrict?.[0],
          secondLevelCategory: values.businessDistrict?.[1],
          ...values,
          ...graphInfo,
        };
        post('/planCluster/create', params, true).then(() => {
          V2Message.success('新增商圈成功');
          close && close();
          onAdd && onAdd();
        });
      }).catch((error) => {
        console.log(error);
        V2Message.warning('请输入所有必填项');
      });
    },
    getSelection() {
      Promise.all([
        // module 1 网规相关，2行业商圈 （通用版）
        getTreeSelection({ planId, type: 2, module: 1 }),
        getTreeSelection({ planId, type: 1, childCompanyId: branchCompanyId }),
      ]).then(res => {
        setSelection({ businesses: res[0], cities: res[1] });
      });
    },
    // 检查绘制的城市是否有权限
    checkCity(adcode) {
      // let result = false;
      // console.log('selection.cities', selection.cities);
      // selection.cities?.forEach(item => {
      //   if (item.child?.some(city => city.name === cityName)) {
      //     result = true;
      //   }
      // });
      // return result;

      const allDistrictCode:any = [];
      const traverseArr = (arr) => {
        arr?.map((item) => {
          if (item.code && !allDistrictCode.includes(item.code)) {
            allDistrictCode.push(item.code);
          }
          isArray(item.child) && item.child && traverseArr(item.child);
        });
      };
      traverseArr(selection.cities);
      // console.log('allDistrictCode', addressInfoRef.current, allDistrictCode, adcode);
      return allDistrictCode.includes(adcode);
    },
    onDraw(address) {
      form.setFieldValue('address', address);
    }
  });

  useEffect(() => {
    if (visible) {
      methods.getSelection();
      form.resetFields();
    }
  }, [visible]);

  return (
    <V2Drawer
      open={visible}
      onClose={close}
      destroyOnClose
    >
      <V2Title type='H1' text='新建商圈规划' className='mb-8'/>
      <V2Container
        className={styles.districtModal}
        style={{ height: 'calc(100vh - 100px)' }}
        // emitMainHeight={(h) => setMainHeight(h)}
        extraContent={{
          top: <>
            { visible ? <DistrictMap
              isBranch={isBranch}
              amapIns={amapIns}
              setAmapIns={setAmapIns}
              ref={districtMapRef}
              onDraw={methods.onDraw}
              centerRef={centerRef}
              planId={planId}
              branchCompanyId={branchCompanyId}
              checkCity={methods.checkCity}
              tipStep={tipStep}
              setTipStep={setTipStep}
            /> : <></> }
          </>,
          bottom: <div className={styles.districtModalBottom}>
            <Button type='primary' onClick={methods.submit}>提交</Button>
          </div>
        }}>
        <V2Form form={form} className={styles.districtModalMain} >
          <Row className={styles.districtLeft} gutter={[22, 16]}>
            {/* <Col span={8}>
              <V2FormSelect
                label={'搜索位置'}
                name={'place'}
                options={options}
                config={{
                  showSearch: true,
                  filterOption: false,
                  fieldNames: {
                    label: 'name',
                    value: 'id'
                  },
                  notFoundContent: fetching ? <Spin size='small' /> : null,
                  onSearch: methods.handleSearch,
                  onChange: methods.changeHandle
                }}
              />
            </Col> */}
            <Popover
              overlayClassName={styles.popoverBox}
              placement='top'
              getPopupContainer={ (node) => node.childNodes[0] as HTMLDivElement}
              content={
                // 完成后设置为-1
                <div onClick={() => { setTipStep(-1); setStorage('hasTipAddBusiness', true); }} className={styles.tipBox}>
                  <span>3.填写新增商圈信息，完成新增商圈</span>
                  <div className={styles.bottom}>确定</div>
                </div>
              }
              trigger='click'
              open={tipStep === 2}// 第三步
            >
              <Col span={8}>
                <V2FormInput label='商圈名称' name='centerName' maxLength={32} required />
              </Col>
            </Popover>

            <Col span={8}>
              <V2FormInput
                label='规划城市'
                name='address'
                disabled={true}
              >
              </V2FormInput>

            </Col>
            <Col span={8}>
              <V2FormInputNumber label='推荐开店数' name='recommendStores' min={1} max={99} precision={0} required />
            </Col>
            <Col span={8}>
              <V2FormCascader
                label='商圈业态'
                name='businessDistrict'
                required
                options={refactorSelection(selection.businesses, { children: 'child' })}
              />
            </Col>
            <Col span={16}>
              <V2FormTextArea label='新增原因' name='reason' required maxLength={200} config={{
                showCount: true,
              }} />
            </Col>
          </Row>
        </V2Form>

      </V2Container >
    </V2Drawer >
  );
};

export default DistrictModal;
