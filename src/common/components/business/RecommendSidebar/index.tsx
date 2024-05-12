/**
 * @Description 重点品牌门店分布
 * 组件样式展示参看./Diagrammatize/README.md
 */

import { FC, useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import { Tree, Switch, Select, Checkbox, Tooltip } from 'antd';
import { circleColor } from './ts-config';
import { useMethods } from '@lhb/hook';
import { getBrand } from '@/common/api/recommend';
import { fetchMapDistrict } from '@/common/api/selection';
// import { isEqual } from '@lhb/func';

const { Option } = Select;
const optionData = [
  { label: '200M', value: 200 },
  { label: '500M', value: 500 },
  { label: '800M', value: 800 },
  { label: '1000M', value: 1000 },
  { label: '1500M', value: 1500 },
];
const selectLabel = [
  { label: '竞争', value: 1 },
  { label: '协同', value: 2 },
  { label: '一般', value: 3 }
];
const RecommendSidebar: FC<{
  amapIns: any
  model: any // modle对象，被用到的字段是provinceCode、cityId
  scopeCheck?:boolean,
  style?:any
  isStadiometry?: boolean
  isStadiometryRef?:any
}> = ({
  amapIns,
  model,
  scopeCheck = true,
  style,
  isStadiometry,
  isStadiometryRef,
}) => {
  const checkedRef = useRef<boolean>(false);
  // const paramsRef: any = useRef();
  const [treeData, setTreeData] = useState<any>([]); // 右侧列表数据，品牌店铺列表
  const [category, setCategory] = useState<any>([]); // 被勾选的品牌
  const [poiList, setPoiList] = useState<any>([]); // 勾选品牌返回的数据
  const [scope, setScope] = useState<number>(200); // 辐射范围区域
  const [switchCheck, setSwitchCheck] = useState(scopeCheck);// 辐射范围的开关
  const [poiCircleGroup, setPoiCircleGroup] = useState<any>(null);// circle群组
  const [massCon, setMassCon] = useState<any>(null); // 海量点
  const [isChange, setIsChange] = useState<boolean>(false);// 是否选择竞合关系
  useEffect(() => {
    if (!amapIns) return;
    methods.getTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amapIns]);

  // 辐射范围变化时，修改circle的半径
  useEffect(() => {
    poiList.forEach((poi) => {
      poi.circle && poi.circle.setRadius(scope);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);
  // 根据勾选项变化绘制商店点位
  useEffect(() => {
    if (!amapIns || !model.provinceCode || !category.length) return;
    methods.getStorePoiList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, model, amapIns]);

  useEffect(() => {
    if (!amapIns) return;
    // 有勾选，并且高德mass数据已经生成
    if (category.length && massCon) {
      massCon.setMap(amapIns);
      if (isStadiometryRef?.current) {
        massCon.hide();
      }
    }
    // 有勾选，并且高德circle点位数据已经生成
    if (category.length && poiCircleGroup) {
      amapIns.add(poiCircleGroup);
    }
    if (!category.length) {
      poiCircleGroup && poiCircleGroup.clearOverlays();// 当没有勾选的时候，圆圈情况
      setPoiCircleGroup(null);
      massCon?.clear && massCon?.clear();// 当没有勾选的时候，海量点清空
      setMassCon(null);
    }
  }, [amapIns, category.length, massCon, poiCircleGroup]);

  useEffect(() => {
    // 选择竞合关系才触发，处理选择竞合关系后的圆圈的label内容
    if (!isChange) return;
    treeData?.map((item) => {
      poiList?.map((poi) => {
        if (item.id === poi.brandId) {
          const competition = item.competition || 3;
          poi.circle && poi.circle.setOptions({
            strokeColor: circleColor[competition].fillColor,
            fillColor: circleColor[competition].fillColor,
          });
        }
      });
    });
    massCon && methods.createLabel(massCon);
    setIsChange(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeData]);

  useEffect(() => {
    // 使用测距时
    if (isStadiometry) {
      massCon && massCon.hide();
      return;
    }
    massCon && massCon.show();
  }, [isStadiometry]);

  const methods = useMethods({
    getTree: async () => {
      const res = await getBrand({ type: 2 });
      const data = res?.map((item) => {
        // 设为本品牌，默认选中
        if (item.isSelf === 1) {
          setCategory([...category, item.id]);
        }
        return {
          ...item,
          key: item.id,
          value: item.shortName || item.name, // 树结构数据要求
          title: item.shortName || item.name, // 树结构数据要求
        };
      });
      setTreeData(data);
    },
    getStorePoiList: async () => {
      const params = {
        brandIds: category,
        cityId: model.cityId,
      };
      // if (isEqual(params, paramsRef.current)) return;
      // paramsRef.current = params;
      const data = await fetchMapDistrict(params);
      setPoiList(data);
      methods.drawCircle(data);
      methods.drawStorePoi(data);
    },
    /**
     * @description 绘制品牌点位--海量点
     * @param data 接口返回的已勾选品牌数据
     */
    drawStorePoi(data: any) {
      massCon?.clear && massCon?.clear();// 将上一次的海量点清空
      const type:any = [];// 存放类型
      const style:any = [];// 存放海量点的style
      const massData = data?.map((item) => { // 返回海量点数据
        const index = type.indexOf(item.brandId);
        if (index === -1) { // 拿到所有类型
          type.push(item.brandId);
          style.push({
            url: item.logo,
            size: [30, 30],
            anchor: [15, 15],
            zIndex: type.length - 1,
          });
        }
        return { // 返回海量点数据
          ...item,
          lnglat: [+item.lng, +item.lat],
          // type.indexOf(item.brandId) === -1说明没有过该类型，索引为type.length-1，！==-1说明type中该类型，type.indexOf(item.brandId)索引
          style: index === -1 ? type.length - 1 : index
        };
      });
      const mass = new window.AMap.MassMarks(massData, {
        style
      });

      methods.createLabel(mass);
      setMassCon(mass);
    },
    /**
     * @description 绘制辐射范围圆圈
     * @param data 接口返回的已勾选品牌数据
     */
    drawCircle(data) {
      const scopeGroup: any = [];
      poiCircleGroup && poiCircleGroup.clearOverlays();
      data.forEach((poi) => {
        let competition:any;
        treeData?.map((item) => {
          if (item.id === poi.brandId) {
            competition = item.competition;
          }
        });
        const circle = methods.createCircle(
          poi,
          competition || 3 // 没有竞合关系，则默认为一般
        );
        // 范围圆圈的hover
        circle.on('mouseover', function () {
          circle.setOptions({
            fillOpacity: 0.2,
          });
        });
        // 范围圆圈的移除hover
        circle.on('mouseout', function () {
          circle.setOptions({
            fillOpacity: 0.1,
          });
        });
        poi.circle = circle;
        scopeGroup.push(circle);
      });
      const overlayGroups = new window.AMap.OverlayGroup(scopeGroup);
      if (switchCheck) {
        overlayGroups.show();
      } else {
        overlayGroups.hide();
      }

      setPoiCircleGroup(overlayGroups);
    },
    // 设置选中的
    onTreeCheck: (checkedKeys) => {
      if (checkedKeys.length === 0) {
        checkedRef.current = false;
      }
      if (checkedKeys.length === treeData.length) {
        checkedRef.current = true;
      }
      setCategory(checkedKeys);
    },
    // 辐射范围
    changeScope(val) {
      setScope(val);
    },
    // 设置竞合关系
    changeRelationship(e, val) {
      const arr = treeData?.map((item) => {
        if (item.id === val.id) {
          return {
            ...item,
            competition: e
          };
        } else {
          return item;
        }
      });
      setTreeData(arr);
      setIsChange(true);
    },
    // 创建圆圈
    createCircle(val, type) {
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
        bubble: true,
      });
      return circle;
    },
    // 地图+辐射范围
    onChangeSwitch(type) {
      setSwitchCheck(type);
      if (type) {
        poiCircleGroup && poiCircleGroup.show();
      } else {
        poiCircleGroup && poiCircleGroup.hide();
      }
    },
    createLabel(massCon) {
      const textIns = new window.AMap.Marker({
        content: ' ',
        map: amapIns,
        anchor: 'top-left',
        offset: [3, 25],
        zIndex: 99,
      });
      massCon.on('mouseover', (e) => {
        // 中心点位hover时，圆圈透明度同圆圈hover状态
        e.data.circle.setOptions({
          fillOpacity: 0.2,
        });
        let competition:any;
        treeData?.map((item) => {
          if (item.id === e.data.brandId) {
            competition = item.competition || 3;
          }
        });
        textIns.setPosition(e.data.lnglat);
        const typeSpan = `<span style="color: ${
          circleColor[competition].fillColor
        }">${circleColor[competition].label}</span>`;
        textIns.setContent(
          `<div class='icon-label'><div class='trangle'></div><span class='text-name'>${e.data.name}-${typeSpan}</span></br><span class='text-address'>${e.data.address}</span></div>`
        );
        textIns.setPosition([e.data.lng, e.data.lat]);
      }
      );
      massCon.on('mouseout', () => {
        textIns.setContent(' ');
      });
    }
  });
  // 品牌全选
  const selectAll = (e) => {
    const arr:any = [];
    treeData.forEach((item) => {
      arr.push(item.id);
    });
    checkedRef.current = e.target.checked;
    e.target.checked ? setCategory(arr) : setCategory([]);
  };
  return (
    <div className={styles.container} style={style}>
      <div className={styles.storeTop}>
        <div className={styles.storeTitle}>重点品牌门店分布</div>
        <div
          className={styles.storeSelect}>
          <span >
            辐射范围：
            <Select
              value={scope}
              style={{ width: 90 }}
              disabled={!switchCheck}
              onChange={methods.changeScope}
              options={optionData}
            />
          </span>
          <span className={styles.storeSwitch}>
            <Switch
              checkedChildren='显示'
              unCheckedChildren='关闭'
              checked={switchCheck}
              onChange={(type) => methods.onChangeSwitch(type)}
            />
          </span>
        </div>

        <div
          className={styles.storeColumn}>
          <span>品牌店铺</span>

          <span className={styles.columnRight}>
            <Checkbox
              checked={checkedRef.current}
              onChange={selectAll}
            ></Checkbox>
            <span className={styles.tree_title}>竞合关系</span>
          </span>
        </div>
      </div>


      <div className={styles.line}></div>
      <div className={styles.tree}>
        {treeData && (
          <Tree
            checkedKeys={category}
            checkable
            onCheck={methods.onTreeCheck}
            defaultExpandAll={true}
            showIcon={true}
            icon={(node: any) =>
              <img src={node.logo} style={{
                width: '15px',
                height: '15px',
                borderRadius: '50%'
              }}/>
            }
            titleRender={(node:any) =>
              <div className='title-wrapper'>
                <span className={node?.children?.length ? 'dark' : 'light'}>
                  <Tooltip
                    placement='bottom'
                    title={node.title}
                    color='#000000'
                  >
                    <span className='text'>{node.title}</span>
                  </Tooltip>
                </span>
                {!node?.children?.length ? (
                  <span className='select-wrapper'>
                    <Select
                      bordered={false}
                      size={'small'}
                      defaultValue={node.competition || 3}
                      onChange={(e) => methods.changeRelationship(e, node)}
                      optionLabelProp='label'
                      className={styles.selectCon}
                    >
                      {
                        selectLabel.map((item) =>
                          <Option
                            key={item.value}
                            value={item.value}
                            label={
                              <span style={{ color: circleColor[item.value].selectColor }}>
                                {item.label}
                              </span>
                            }
                          >
                            <span style={{ color: circleColor[item.value].selectColor }}>
                              {item.label}
                            </span>
                          </Option>
                        )
                      }
                    </Select>
                  </span>
                ) : null}
              </div>
            }
            treeData={treeData}
          />
        )}
      </div>
    </div>
  );
};

export default RecommendSidebar;
