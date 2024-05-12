/**
 * @Description 加盟商动态模板配置抽屉
 */
import { FC, useEffect, useState } from 'react';
import { Divider, Spin, Button } from 'antd';
import { useMethods } from '@lhb/hook';
import { isArray } from '@lhb/func';
import {
  dynamicTemplateAddGroup,
  dynamicTemplateDetail
} from '@/common/api/location';
import { templateDataFormatting } from './ways';
// import cs from 'classnames';
// import styles from './entry.module.less';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import TemplateTable from './components/TemplateTable';
import SelectPropertyModal from '@/common/business/Location/SelectPropertyModal';

const FranchiseeDynamicTemplate: FC<any> = ({
  drawData,
  close
}) => {
  const { open, data } = drawData;
  const [loading, setLoading] = useState<boolean>(true);
  const { templateId } = data || {};
  // 数据源
  const [dataSource, setDataSource] = useState<any>([]);
  // 选择字段弹窗
  const [propertyTreeDrawInfo, setPropertyTreeDrawInfo] = useState<any>({
    categoryTemplateId: null, // 模板id
    categoryPropertyGroupId: null, // 属性所在的二级分组id
    visible: false,
    rowKey: null, // 二级分组的key（前端生成的）
    rowData: [], // 二级分组下的所有属性（对应二级分组下的children）
  });
  // 所有行的key
  const [rowKeys, setRowKeys] = useState<any>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]); // 展开行

  useEffect(() => {
    if (!open) return;
    if (!templateId) return;
    methods.loadData();
  }, [open]);

  const methods = useMethods({
    loadData: async () => {
      setLoading(true); // 子组件及操作按钮操作都需要加载loading状态
      const params = { id: templateId }; // 传模板id
      const { propertyGroupVOList: objectList } = await dynamicTemplateDetail(params).finally(() => {
        setLoading(false);
      });
      /**
      * 逻辑说明：遍历接口给的数据源，添加一些前端需要用的字段，遍历过后数据结构没有变化，只是增加了一个前端用来显示和判断的字段
      */
      const data = templateDataFormatting(objectList);
      // console.log(`格式化后的数据`, data);
      // 所有字段的属性id
      const propertyIds: any = [];
      // 所有前端自定义的key
      const keys: any = [];

      data.forEach((item: any) => { // 遍历一级
        keys.push(item.key);
        const { children: secondLevel } = item;
        if (!(isArray(secondLevel) && secondLevel.length)) return;
        secondLevel.forEach((secondItem: any) => { // 遍历二级
          const { key: secondKey, isGroup: secondIsGroup, children: threeLevel } = secondItem;
          keys.push(secondKey);
          // 目前字段不会配在一级分组下
          !secondIsGroup && propertyIds.push(secondItem.propertyId);
          if (!(isArray(threeLevel) && threeLevel.length)) return;
          threeLevel.forEach((threeItem: any) => {
            threeItem?.key && keys.push(threeItem?.key);
            !threeItem?.isGroup && threeItem?.propertyId && propertyIds.push(threeItem?.propertyId);
          });
        });
      });

      // setSelectedPropertyIds(propertyIds);
      setRowKeys(keys);
      // 默认展开一级分组
      if (data?.[0]?.key) {
        const initExpandedRowKeys = [data[0].key];
        if (data[0].children && data[0].children.length) {
          initExpandedRowKeys.push(data[0].children[0].key);
          if (data[0].children[0].children && data[0].children[0].children.length) {
            initExpandedRowKeys.push(data[0].children[0].children[0].key);
          }
        }
        if (expandedRowKeys.length === 0) {
          setExpandedRowKeys(initExpandedRowKeys);
        }
      }
      setDataSource(data);
    },
    addFirstGroup: () => { // 添加一级分组
      const params = {
        templateId,
        categoryTemplateId: templateId,
        name: '一级分组'
      };
      dynamicTemplateAddGroup(params).then(() => {
        methods.loadData();
      });
    }
  });

  return (
    <>
      <V2Drawer
        open={open}
        onClose={close}
        title={<>
          <div className='bold ml-40 mt-24 fs-20'>{data?.name}</div>
          <Divider style={{ marginBottom: 0 }}/>
        </>
        }
      >
        <Spin spinning={loading}>
          <Button
            type='primary'
            onClick={methods.addFirstGroup}>
            添加分组
          </Button>
          {/* 模板Table */}
          <TemplateTable
            templateId={templateId}
            dataSource={dataSource}
            keys={rowKeys}
            propertyTreeDrawInfo={propertyTreeDrawInfo}
            setPropertyTreeDrawInfo={setPropertyTreeDrawInfo}
            expandedRowKeys={expandedRowKeys}
            setExpandedRowKeys={setExpandedRowKeys}
            loadData={methods.loadData}
          />
        </Spin>
      </V2Drawer>

      {/* 选择属性字段弹窗 */}
      <SelectPropertyModal
        templateId={templateId}
        onSearch={methods.loadData}
        propertyTreeDrawInfo={propertyTreeDrawInfo}
        setPropertyTreeDrawInfo={setPropertyTreeDrawInfo}
        setExpandedRowKeys={setExpandedRowKeys}
      />
    </>
  );
};

export default FranchiseeDynamicTemplate;
