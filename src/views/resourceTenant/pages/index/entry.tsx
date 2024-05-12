import { FC, useEffect, useState } from 'react';
import styles from './index.module.less';
import { message, Select, Space, Switch, Table, Tooltip, TreeSelect } from 'antd';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import Item from 'antd/lib/list/Item';
import { get, post } from '@/common/request';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useMethods, useTable } from '@lhb/hook';
import { getCategoryRes } from '@/common/api/category';
import { isUndef } from '@lhb/func';

interface ResourceTenantProps {

}

const ResourceTenant: FC<ResourceTenantProps> = () => {
  const columns: any[] = [
    { dataIndex: 'tntId', title: '租户ID', fixed: 'left', width: 100 },
    { dataIndex: 'tntName', title: '租户名称/团队名称', fixed: 'left', with: 400 },
    { dataIndex: 'channelName', title: '创建渠道', fixed: 'left', width: 200, },
    {
      dataIndex: 'spotCategoryTemplateId',
      title: '场地模版',
      render(_: string, record: any) {
        const { placeCategoryTemplateId } = record;
        const onChange = (value) => {
          onEdit({ ...record, placeCategoryTemplateId: value });
        };
        return (
          <Select style={{ width: 150 }} options={options.filter(item => !item.resourcesType)} value={placeCategoryTemplateId} onChange={onChange}/>
        );
      }
    },
    {
      dataIndex: 'placeCategoryTemplateId',
      title: '点位模版',
      render(_: string, record: any) {
        const { spotCategoryTemplateId } = record;
        const onChange = (value) => {
          onEdit({ ...record, spotCategoryTemplateId: value });
        };
        return (
          <Select style={{ width: 150 }} options={options.filter(item => item.resourcesType)} value={spotCategoryTemplateId} onChange={onChange}/>
        );
      }
    },
    {
      dataIndex: 'placeTabs',
      title: '场地详情配置',
      width: 150,
      render(_:any, record: any) {
        const placeTabs = isUndef(record.placeTabs) ? [] : record.placeTabs;
        // console.log(placeTabs);
        const onChange = (value) => {
          onEdit({ ...record, placeTabs: value });
        };
        return (
          <Select
            style={{ width: 150 }}
            mode='multiple'
            maxTagCount={1}
            showArrow={true}
            options={[
              { label: '管理方', value: 'CONTACT' },
              { label: '跟进记录', value: 'FOLLOW_UP_RECORD' },
              { label: '历史交易', value: 'TRANSACTION' },
            ]}
            onChange={onChange}
            defaultValue={placeTabs}
          />
        );
      }
    },
    {
      dataIndex: 'spotTabs',
      title: '点位详情配置',
      width: 150,
      render(_:any, record: any) {
        const spotTabs = isUndef(record.spotTabs) ? [] : record.spotTabs;
        const onChange = (value) => {
          onEdit({ ...record, spotTabs: value });
        };
        return (
          <Select
            style={{ width: 150 }}
            mode='multiple'
            maxTagCount={1}
            showArrow={true}
            allowClear
            options={[
              { label: '历史交易', value: 'TRANSACTION' },
            ]}
            onChange={onChange}
            defaultValue={spotTabs}
          />
        );
      }
    },
    {
      dataIndex: 'dataPermissionMode',
      title: '项目/点位列表数据权限',
      width: 150,
      render(_:any, record: any) {
        const dataPermissionMode = isUndef(record.dataPermissionMode) ? 1 : record.dataPermissionMode;
        const onChange = (value) => {
          onEdit({ ...record, dataPermissionMode: value });
        };
        return (
          <Select
            style={{ width: 150 }}
            showArrow={true}
            allowClear
            options={[
              { label: '按组织架构', value: 1 },
              { label: '全量数据', value: 2 },
            ]}
            onChange={onChange}
            defaultValue={dataPermissionMode}
          />
        );
      }
    },
    {
      dataIndex: 'categoryList',
      title: '类目配置',
      width: 150,
      render(_:any, record: any) {
        const categoryList = isUndef(record.categoryList) ? [] : record.categoryList;
        const onChange = (value: any) => {
          onEdit({ ...record, categoryList: value.map((item) => item.toString()) });
          // console.log(categoryList, value);
        };
        return (
          <TreeSelect
            treeData={category}
            fieldNames={{ label: 'name', value: 'id', children: 'childList' }}
            style={{ width: 150 }}
            maxTagCount={1}
            showArrow={true}
            allowClear={true}
            multiple={true}
            defaultValue={categoryList}
            onChange={onChange}
          />
        );
      }
    },
    {
      title: '场地编辑审核',
      dataIndex: 'spotOnlineNeedReview',
      render(_: any, recoder: any) {
        const { placeEditNeedReview } = recoder;
        const onChange = (checked: boolean) => {
          onEdit({ ...recoder, placeEditNeedReview: Number(checked) });
        };
        return (
          <Switch
            checkedChildren='开启'
            unCheckedChildren='关闭'
            onChange={onChange}
            checked={!!placeEditNeedReview}/>
        );
      }
    },
    {
      title: '点位编辑审核',
      dataIndex: 'spotEditNeedReview',
      render(_: any, recoder: any) {
        const { spotEditNeedReview } = recoder;
        const onChange = (checked: boolean) => {
          onEdit({ ...recoder, spotEditNeedReview: Number(checked) });
        };
        return (
          <Switch
            checkedChildren='开启'
            unCheckedChildren='关闭'
            onChange={onChange}
            checked={!!spotEditNeedReview}/>
        );
      }
    },
    {
      title: '点位下架审核',
      dataIndex: 'spotEditNeedReview',
      render(_: any, recoder: any) {
        const { spotOfflineNeedReview } = recoder;
        const onChange = (checked: boolean) => {
          onEdit({ ...recoder, spotOfflineNeedReview: Number(checked) });
        };
        return (
          <Switch
            checkedChildren='开启'
            unCheckedChildren='关闭'
            onChange={onChange}
            checked={!!spotOfflineNeedReview}/>
        );
      }
    },
    {
      title: '点位上架审核',
      dataIndex: 'spotOnlineNeedReview',
      render(_: any, recoder: any) {
        const { spotOnlineNeedReview } = recoder;
        const onChange = (checked: boolean) => {
          onEdit({ ...recoder, spotOnlineNeedReview: Number(checked) });
        };
        return (
          <Switch
            checkedChildren='开启'
            unCheckedChildren='关闭'
            onChange={onChange}
            checked={!!spotOnlineNeedReview}/>
        );
      }
    },
    {
      title: '同步资源库',
      dataIndex: 'spotOnlineNeedReview',
      render(_: any, recoder: any) {
        const { syncToResCenter } = recoder;
        const onChange = (checked: boolean) => {
          onEdit({ ...recoder, syncToResCenter: Number(checked) });
        };
        return (
          <Switch
            checkedChildren='开启'
            unCheckedChildren='关闭'
            onChange={onChange}
            checked={!!syncToResCenter}/>
        );
      }
    },
    {
      title: (
        <Space>
          <Tooltip title='同步资源开启后才可操作'>
            <InfoCircleOutlined />
          </Tooltip>
          同步资源库审核
        </Space>
      ),
      dataIndex: 'spotOnlineNeedReview',
      render(_: any, recoder: any) {
        const { syncToResCenterNeedReview, syncToResCenter } = recoder;

        const onChange = (checked: boolean) => {
          onEdit({ ...recoder, syncToResCenterNeedReview: Number(checked) });
        };
        return (
          <>
            <Switch
              checkedChildren='开启'
              unCheckedChildren='关闭'
              onChange={onChange}
              disabled={!syncToResCenter}
              checked={!!syncToResCenterNeedReview}/>
          </>
        );
      }
    },
    {
      title: '商铺项目选填',
      dataIndex: 'placeOfMerchantIsOptional',
      render(_: any, recoder: any) {
        const { placeOfMerchantIsOptional } = recoder;
        const onChange = (checked: boolean) => {
          onEdit({ ...recoder, placeOfMerchantIsOptional: Number(checked) });
        };
        return (
          <Switch
            checkedChildren='开启'
            unCheckedChildren='关闭'
            onChange={onChange}
            checked={!!placeOfMerchantIsOptional}/>
        );
      }
    },
  ];

  const loadData = async (page: number, size: number, searchParams: any) => {
    // https://yapi.lanhanba.com/project/321/interface/api/51092
    const result = await post('/config/page', { page, size, grantAppCode: '10000', ...searchParams }, true);
    return result;
  };

  const [options, setOptions] = useState<any[]>([]);
  const [category, setCategory] = useState<any[]>([]);

  const getOptions = async (page: number, size: number) => {
    // https://yapi.lanhanba.com/project/289/interface/api/33081
    const { objectList = [] } = await get('/categoryTemplate/page', { page, size, }, true);
    setOptions(objectList.map(item => {
      return {
        label: item.name,
        value: item.id,
        resourcesType: item.resourcesType

      };
    }));
  };

  const methods = useMethods({
    getCategory() {
      getCategoryRes({ resourcesType: 0 }).then((response) => {
        setCategory(response || []);
      });
    }
  });

  useEffect(() => {
    getOptions(1, 1000);
    methods.getCategory();
  }, []);


  const [searchParams, setSearchParams] = useState<any>({ });

  const [{ pagination, loading }, restResult] = useTable(loadData, searchParams);
  const { objectList = [] } = restResult || {};

  const onSearch = (values: any) => {
    pagination.onChange(1);
    setSearchParams(values);
  };

  const onReset = () => {
    pagination.onChange(1);
    searchParams({});
  };

  const onEdit = (value: any) => {
    post('/config/update', value, true).then(() => {
      message.success('操作成功');
      setSearchParams({ ...searchParams });
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content }>
        <SearchForm onSearch={onSearch} onReset={onReset}>
          <V2FormInput name='name' placeholder='请输入租户名称' label='租户'/>
          <V2FormSelect name='grantAppCode' placeholder='请选择租户' label='渠道' options={[
            { label: 'ERP', value: '10009' },
            { label: 'PMS', value: '10000' }
          ]}
          config={{
            defaultValue: '10000'
          }}
          />
          <Item>
          </Item>
        </SearchForm>
        <Table
          pagination={pagination}
          dataSource={objectList}
          columns={columns}
          scroll={{ y: 1200, x: 'max-content' }}
          rowKey='id'
          loading={loading}/>
      </div>
    </div>
  );
};


export default ResourceTenant;
