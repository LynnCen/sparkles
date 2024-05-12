/**
 * @Description 新增品牌弹窗
 */
import React, { FC, useState } from 'react';
import { Button, message, Form } from 'antd';
import { isArray } from '@lhb/func';
import { industryBrandSelectList, industryBrandAdd } from '@/common/api/location';
import styles from './index.module.less';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Table from '@/common/components/Data/V2Table';
import V2Container from '@/common/components/Data/V2Container';
import Search from './components/Search';
interface SearchParamsType {
  name?: string;
  oneIndustryId?: number,
  twoIndustryId?: number,
  threeIndustryId?: number,
}

const NewBrandDrawer: FC<any> = ({
  visible, // 组件是否可见
  setVisible,
  tenantId, // 租户id
  setParams, // 刷新列表
}) => {

  const [form] = Form.useForm();
  const [filters, setFilters] = useState< SearchParamsType >(); // 参数变化的时候会触发请求
  // const [current, setCurrent] = useState<number>(1); // 分页器参数
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);// 选择品牌id数组

  /** 表格列表项 */
  const defaultColumns = [
    { key: 'name', title: '品牌名称', width: 120, dragChecked: true },
    { key: 'brandId', title: '品牌ID', width: 86, dragChecked: true },
    { key: 'logo',
      title: '品牌logo',
      dragChecked: true,
      width: 89,
      render: (value) =>
        value ? (
          <div className={styles.logoBorder}>
            <img src={value} style={{
              width: '24px'
            }}/>
          </div>
        ) : (
          <span className={styles.noLogo}>-</span>
        ),
    },
    { key: 'industryShowName', title: '所属行业', dragChecked: true },
    { key: 'shopCount', title: '网点数量', width: 88, dragChecked: true },
    { key: 'updateTime', title: '更新日期', width: 128, dragChecked: true },
    { key: 'common', title: ' ', width: 100, dragChecked: true,
      render: (value, record) => record?.common ? <div className={styles.common}>常用</div> : <></>
    }
  ];

  // 点击查询
  const onSearch = (fields: any) => {
    const { name, industryIds } = fields;
    const params: any = {
      name,
      oneIndustryId: null,
      twoIndustryId: null,
      threeIndustryId: null,
    };
    if (isArray(industryIds) && industryIds.length) {
      industryIds[0] && (params.oneIndustryId = industryIds[0]);
      industryIds[1] && (params.twoIndustryId = industryIds[1]);
      industryIds[2] && (params.threeIndustryId = industryIds[2]);
    }
    // 搜索的时候
    setFilters(params);
  };

  /** 点击选中品牌  */
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  /** V2Table中多选配置项*/
  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys,
    preserveSelectedRowKeys: true, // 保留上一次选择参数，不设置会丢失之前的多选参数
    onChange: onSelectChange,
  };


  /** 提交关联品牌后关闭弹窗*/
  const onSubmit = async () => {
    const num = selectedRowKeys.length;
    if (!num) {
      message.error(`请选择品牌之后再提交`);
      return;
    }
    await industryBrandAdd({
      tenantId,
      brandIds: selectedRowKeys
    });
    message.success(`成功添加${num}个品牌`);

    setSelectedRowKeys([]); // 清除已选择的品牌
    setVisible(false); // 关闭弹窗
    setParams({}); // 刷新页面列表
  };

  /** 点击取消关闭弹窗 */
  const onClose = () => {
    form.resetFields();
    setSelectedRowKeys([]); // 清除已选择的品牌
    setVisible(false); // 关闭弹窗
    onSearch({}); // 重置筛选条件
  };

  /** 表格数据项 */
  const loadData = async (params) => {
    const obj: any = {
      ...params,
      tenantId
    };
    const data = await industryBrandSelectList(obj);

    return {
      dataSource: data.objectList,
      count: data.totalNum,
    };
  };

  return (
    <V2Drawer
      title='选择品牌'
      className={styles.newBrandDrawer}
      width={1008}
      placement='right'
      open={visible}
      onClose={() => onClose()}
      destroyOnClose
      bodyStyle={{
        paddingLeft: 0,
        paddingRight: 0,
      }}
    >
      <V2Container
        // 容器上下padding 24 16， title的高度22 及间距48
        style={{ height: 'calc(100vh - 40px - 22px - 48px)' }}
        extraContent={{
          top: <Search
            form={form}
            onSearch={onSearch}/>,
          bottom: <div className='rt'>
            <Button onClick={onClose} className='mr-12'>取消</Button>
            <Button type='primary' onClick={onSubmit}>
              确认
            </Button>
          </div>
        }}>

        <V2Table
          defaultColumns={defaultColumns}
          onFetch={loadData}
          filters={filters}
          rowSelection={rowSelection}
          rowKey='id'
          pageSize={10}
          hideColumnPlaceholder
          paginationConfig={{
            pageSizeOptions: [10, 20, 50, 100],
          }}
        />

      </V2Container>
    </V2Drawer>
  );
};

export default NewBrandDrawer;

