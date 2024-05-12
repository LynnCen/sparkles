import React, { FC, useEffect, useRef, useState, } from 'react';
import styles from '../entry.module.less';
import { Tree, Switch, Select, Row, Col } from 'antd';
import { circleColor, iconStyle, selectIcon } from '../ts-config';
import { useMethods } from '@lhb/hook';
import { getStorePoiByCodeAndName } from '@/common/api/recommend';
import IconFont from '@/common/components/IconFont';

const { Option } = Select;
const optionData = [
  { label: '200M', value: 200 },
  { label: '500M', value: 500 },
  { label: '800M', value: 800 },
  { label: '1000M', value: 1000 },
  { label: '1500M', value: 1500 },
];
const Store: FC<{
  amapIns: any;
  id: string | number;
  model: any;
}> = ({
  amapIns,
  model,
}) => {
  const labelRef = useRef<any>(null);
  const [treeData, setTreeData] = useState<any>(null);
  const [storeList, setStoreList] = useState({});
  const [category, setCategory] = useState<any>([]);
  const [massIns, setMassIns] = useState<null | any>(null);
  const [poiList, setPoiList] = useState<[] | any[]>([]);
  const [scope, setScope] = useState(200);
  const [poiCircleGroup, setPoiCircleGroup] = useState<any>(null);
  const [switchCheck, setSwitchCheck] = useState(true);

  // 生成一个作为label的marker
  useEffect(() => {
    if (!amapIns) return;
    methods.getTree();
    const option = {
      zooms: [1, 20],
      map: amapIns,
      content: ' ',
      zIndex: 14,
    };
    const textIns = new window.AMap.Marker(option);
    labelRef.current = textIns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amapIns]);
  // 根据范围变化做对应处理
  useEffect(() => {
    poiList.forEach(poi => {
      poi.circle && poi.circle.setRadius(scope);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);
  useEffect(() => {
    poiList.forEach(poi => {
      poi.circle && poi.circle.setOptions({
        strokeColor: circleColor[storeList[poi.brandName].status].fillColor,
        fillColor: circleColor[storeList[poi.brandName].status].fillColor,
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeList]);
  // 根绝勾选项变化绘制商店点位
  useEffect(() => {
    if (!amapIns) return;
    if (!model.provinceCode) return;
    if (!category.length) {
      massIns && (massIns as any).clear();
      setMassIns(null);
      poiCircleGroup && poiCircleGroup.clearOverlays();
      setPoiCircleGroup(null);
      return;
    }
    methods.getStorePoilist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, model, amapIns]);
  const methods = useMethods({
    getTree: async () => {
      const res = await require('../tree.json');
      setTreeData(res);
      const storeData:any = {};
      res.forEach(d => {
        d.children.forEach(f => {
          f.children.forEach(t => {
            t.children.forEach(store => {
              storeData[store.key] = { status: 0 };
            });
          });
        });
      });
      setStoreList(storeData);
    },
    getStorePoilist: async() => {
      const data = await getStorePoiByCodeAndName({ brandName: category, provinceCode: model.provinceCode, cityCode: model.cityCode, districtCode: model.districtCode });
      data.forEach(val => {
        val.lnglat = [val.lng, val.lat];
        val.style = 3;
      });
      setPoiList(data);
      methods.drawStorePoi(data);
      methods.drawCircle(data);
    },
    drawStorePoi(data: any) {
      massIns && (massIns as any).clear();
      // if (!wholeStorePoiList.length) return;
      var mass = new window.AMap.MassMarks(data, {
        opacity: 1,
        cursor: 'pointer',
        style: iconStyle
      });
      mass.on('mouseover', function (e: { data: {brandName: any; lnglat: any; name: any; address: any;}; }) {
        labelRef.current.setPosition(e.data.lnglat);
        const typeSpan = `<span style="color: ${circleColor[storeList[e.data.brandName].status].fillColor}">${circleColor[storeList[e.data.brandName].status].label}</span>`;
        labelRef.current.setContent(`<div class='icon-label'><div class='trangle'></div><span class='text-name'>${e.data.name}-${typeSpan}</span></br><span class='text-address'>${e.data.address}</span></div>`);
      });
      mass.on('mouseout', function () {
        labelRef.current.setContent(' ');
      });
      mass.setMap(amapIns);
      setMassIns(mass);
    },
    drawCircle(data) {
      const scopeGroup:any = [];
      poiCircleGroup && poiCircleGroup.clearOverlays();
      data.forEach(poi => {
        const circle = methods.createCircle(poi, storeList[poi.brandName].status);
        poi.circle = circle;
        scopeGroup.push(circle);
      });
      const overlayGroups = new window.AMap.OverlayGroup(scopeGroup);
      if (switchCheck) {
        overlayGroups.show();
      } else {
        overlayGroups.hide();
      };
      setPoiCircleGroup(overlayGroups);
      amapIns.add(overlayGroups);
    },
    onTreeCheck: (checkedKeys,) => {
      setCategory(checkedKeys.filter(key => key.indexOf('del') < 0));
    },
    changeScope(val) {
      setScope(val);
    },
    changeRelationship(e, val) {
      storeList[val.key].status = e;
      setStoreList({ ...storeList });
    },
    createCircle(val, type = 0) {
      const circle = new window.AMap.Circle({
        center: [val.lng, val.lat],
        radius: scope, // 半径
        strokeColor: circleColor[type].fillColor,
        strokeWeight: 1,
        strokeOpacity: 1,
        fillOpacity: 0.1,
        strokeStyle: 'solid',
        strokeDasharray: [10, 10],
        fillColor: circleColor[type].fillColor,
        zIndex: 50,
      });
      // circle.on('mouseover', function () {
      //   circle.setOptions({
      //     fillOpacity: 0.5
      //   });
      // });
      // circle.on('mouseout', function () {
      //   circle.setOptions({
      //     fillOpacity: 0.1
      //   });
      // });
      return circle;
    },
    onChangeSwitch (type) {
      setSwitchCheck(type);
      if (type) {
        poiCircleGroup && poiCircleGroup.show();
      } else {
        poiCircleGroup && poiCircleGroup.hide();
      };
    },
  });
  return (
    <>
      <div className={styles.storeTop}>
        <div className={styles.storeTitle}>行业重点门店分布</div>
        <Row style={{ height: '64px' }} justify='space-between' align='middle'>
          <Col>
          辐射范围：<Select
              value={scope}
              style={{ width: 160 }}
              disabled={!switchCheck}
              onChange={methods.changeScope}
              options={optionData} />
          </Col>
          <Col pull={1}>
            <Switch checkedChildren='开启' unCheckedChildren='关闭' checked={switchCheck} onChange={type => methods.onChangeSwitch(type)} />
          </Col>
        </Row>
        <Row style={{ height: '30px' }} justify='space-between' align='middle'>
          <Col>
            <span className={styles.tree_title}>品牌店铺</span>
          </Col>
          <Col pull={1}>
            <span className={styles.tree_title}>竞合关系</span>
          </Col>
        </Row>
      </div>
      <div className={styles.line}></div>
      <div className={styles.tree}>
        {treeData && <Tree
          checkable
          onCheck={methods.onTreeCheck}
          defaultExpandAll={true}
          showIcon={true}
          icon={(node: any) => selectIcon[node.title] && <IconFont {...selectIcon[node.title]} />}
          titleRender={(node) => <div className='title-wrapper'>
            <span className={node?.children?.length ? 'dark' : 'light'}>{node.title}</span>
            {!node?.children?.length ? <span className='select-wrapper'>
              <Select bordered={false} size={'small'} defaultValue={0} onChange={(e) => methods.changeRelationship(e, node)} optionLabelProp='label'>
                <Option value={1} label={<span style={{ color: circleColor[1].selectColor }}>竞争</span>}><span style={{ color: circleColor[1].selectColor }}>竞争</span></Option>
                <Option value={0} label={<span style={{ color: circleColor[0].selectColor }}>一般</span>}><span style={{ color: circleColor[0].selectColor }}>一般</span></Option>
                <Option value={2} label={<span style={{ color: circleColor[2].selectColor }}>协同</span>}><span style={{ color: circleColor[2].selectColor }}>协同</span></Option>
              </Select>
            </span> : null}
          </div>}
          treeData={treeData}
        />}
      </div>
    </>
  );
};

export default React.memo(Store);
