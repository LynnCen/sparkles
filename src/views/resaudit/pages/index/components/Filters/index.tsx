import SearchForm from '@/common/components/Form/SearchForm';
import { ResourceType, ResourceApprovalType } from '../../ts-config';
import { FC, useEffect, useMemo, useState } from 'react';
import { Radio, Form } from 'antd';
import styles from './index.module.less';
import dayjs from 'dayjs';
import { getCategoryRes } from '@/common/api/category';
import { useMethods } from '@lhb/hook';
import FormUserList from '@/common/components/FormBusiness/FormUserList';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormTreeSelect from '@/common/components/Form/V2FormTreeSelect/V2FormTreeSelect';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';

interface FiltersProps {
  onSearch: Function,
  resourceType: number,
  status: number,
  waitCount: number,
  onChangeStatus: Function,
}

const Filters: FC<FiltersProps> = ({ onSearch, resourceType, status, waitCount, onChangeStatus }) => {
  /* states */
  const [form] = Form.useForm();
  const [selector, setSelector] = useState({
    categories: [],
    types: [{ label: '新增', value: 0 }, { label: '修改', value: 1 }],
    sources: [
      { label: '资源中心', value: 'RESOURCES' },
      { label: '邻汇吧', value: '邻汇吧' },
      { label: 'PMS', value: 'PMS' },
      { label: 'LOCATION', value: 'LOCATION' },
      { label: 'LCN', value: 'LCN' },
      { label: '资源服务', value: 'RESOURCE_SERVICE' },
      { label: '客流服务', value: 'PASSENGER_FLOW' },
      { label: '订单服务', value: 'ORDER' },
      { label: '踩点宝', value: 'CDB' },
      { label: '交易平台', value: 'LOCXX' },
      { label: 'LOCATION商业直租', value: 'LOCXX_MINIAPP' }
    ],
  });
  const MAX_LIMIT = 10000;

  /* hooks */
  useEffect(() => {
    getCategoryList();
  }, []);

  const onFinish = (value) => {
    if (Array.isArray(value.cityId)) {
      const cities = [];
      value.cityId.forEach((itm: []) => {
        if (Array.isArray(itm) && itm.length) {
          cities.push(itm[itm.length - 1]);
        }
      });
      value.cityId = cities;
    }

    if (value.gmtCreate && Array.isArray(value.gmtCreate) && value.gmtCreate.length === 2) {
      const dates = value.gmtCreate.map(itm => dayjs(itm).format('YYYY-MM-DD'));
      value.gmtModifiedStart = dates[0] + ' 00:00:00';
      value.gmtModifiedEnd = dates[1] + ' 23:59:59';
    } else {
      value.gmtModifiedStart = undefined;
      value.gmtModifiedEnd = undefined;
    }

    if (value.examineTime && Array.isArray(value.examineTime) && value.examineTime.length === 2) {
      const dates = value.examineTime.map(itm => dayjs(itm).format('YYYY-MM-DD'));
      value.examineTimeStart = dates[0] + ' 00:00:00';
      value.examineTimeEnd = dates[1] + ' 23:59:59';
    } else {
      value.examineTimeStart = undefined;
      value.examineTimeEnd = undefined;
    }

    delete value.gmtCreate;
    delete value.examineTime;

    onSearch(value);
  };

  /* methods */
  const {
    getCategoryList,
  } = useMethods({
    getCategoryList() {
      getCategoryRes({ resourcesType: 0 }).then((response) => {
        setSelector({ ...selector, categories: response || [] });
      });
    }
  });

  const countStr: string = useMemo(() => {
    if (waitCount >= MAX_LIMIT) {
      return `(${MAX_LIMIT}+)`;
    } else {
      return waitCount ? `(${waitCount})` : '';
    }
  }, [waitCount]);

  return (
    <>
      <Radio.Group onChange={(e) => onChangeStatus(e.target.value)} value={status} style={{ marginBottom: 16 }}>
        <Radio.Button className={styles.radioButtonCon} value={ResourceApprovalType.WAIT}>待审核{countStr}</Radio.Button>
        <Radio.Button className={styles.radioButtonCon} value={ResourceApprovalType.PASS}>已通过</Radio.Button>
        <Radio.Button className={styles.radioButtonCon} value={ResourceApprovalType.NOTPASS
        }>未通过</Radio.Button>
      </Radio.Group>
      <SearchForm labelLength={6} form={form} onSearch={onFinish}>
        <V2FormInput
          name='name'
          label={resourceType === ResourceType.PLACE ? '场地名称' : '点位名称'}
          placeholder={resourceType === ResourceType.PLACE ? '请输入场地名称' : '请输入点位名称'}
          maxLength={20}
        />
        <V2FormInput
          name='placeName'
          label='所属场地'
          placeholder='请输入场地名称'
          maxLength={20}
        />
        <V2FormTreeSelect
          name='categoryId'
          label='场地类目'
          placeholder='请选择类目'
          treeData={selector.categories}
          config={{
            fieldNames: { label: 'name', value: 'id', children: 'childList' },
            multiple: true,
            maxTagCount: 1
          }}
        />
        <V2FormSelect name='type' label='审核类型' options={selector.types} />
        <V2FormSelect name='channel' label='来源渠道' options={selector.sources} />
        <FormUserList
          name='followUpBy'
          label='跟进人'
          placeholder='请输入场地跟进人'
          allowClear={true}
          form={form}
        />
        <V2FormProvinceList
          label='所属城市'
          name='cityId'
          placeholder='选择城市'
          config={{
            multiple: true,
            maxTagCount: 1
          }}
          type={2}
        />
        <V2FormRangePicker
          label='提交审核时间'
          name='gmtCreate'
          config={{
            ranges: {
              '最近一周': [dayjs().subtract(7, 'day'), dayjs()],
              '最近一个月': [dayjs().subtract(30, 'day'), dayjs()],
              '最近三个月': [dayjs().subtract(30 * 3, 'day'), dayjs()]
            },
            allowEmpty: [true, true],
          }}
        />
        {status === ResourceApprovalType.PASS && (
          <V2FormRangePicker
            label='审核通过时间'
            name='examineTime'
            config={{
              ranges: {
                '最近一周': [dayjs().subtract(7, 'day'), dayjs()],
                '最近一个月': [dayjs().subtract(30, 'day'), dayjs()],
                '最近三个月': [dayjs().subtract(30 * 3, 'day'), dayjs()]
              },
              allowEmpty: [true, true],
            }}
          />
        )}

      </SearchForm>
    </>
  );
};

export default Filters;
