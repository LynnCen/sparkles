import { FC, useState, useEffect } from 'react';
import { Form } from 'antd';
// import { shopRecommendSelection } from '@/common/api/recommend';
// import { orderExport } from '@/common/api/order';
import dayjs from 'dayjs';
import SearchForm from '@/common/components/Form/SearchForm';
import FormProvinceList from '@/common/components/FormBusiness/FormProvinceList';
import FormDatePicker from '@/common/components/Form/FormDatePicker';
import FormSelect from '@/common/components/Form/FormSelect';
import { useMethods } from '@lhb/hook';
import { get } from '@/common/request';

const Search: FC<any> = ({ change }) => {
  const [form] = Form.useForm();
  const [selectionModel, setSelectionModel] = useState<any>([{ id: 0, name: '自定义指标推荐' }]);
  const [selectionUser, setSelectionUser] = useState<any>([]);
  const [scrollPage, setScrollPage] = useState(1);
  const [totalNum, setTotalNum] = useState(0);
  function disabledDate(current) {
    return current && current > dayjs();
  }

  useEffect(() => {
    methods.getSelectionModel({ page: scrollPage, size: 20 });
    methods.getSelectionUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const methods = useMethods({
    async getSelectionModel(params: any) {
      const { objectList, totalNum } = await get('/shop/model/list', params, {
        isMock: false,
        mockId: 335,
        mockSuffix: '/api',
        needHint: true,
      });
      setSelectionModel((prev: any) => [...prev, ...objectList]);
      setTotalNum(totalNum);
    },
    async getSelectionUser() {
      const res = await get(
        '/user/search',
        { size: 500 },
        {
          isMock: false,
          mockId: 297,
          mockSuffix: '/terra/api',
          needHint: true,
        }
      );
      setSelectionUser(res);
    },
    modelScroll(e) {
      e.persist();
      const { target } = e;
      if (totalNum / 20 < scrollPage) return;
      if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
        const page = scrollPage + 1;
        setScrollPage(page);
        methods.getSelectionModel({ page: page, size: 20 });
      }
    },
  });

  const blurHandle = () => {
    const val = form.getFieldsValue(['pcdIds']);
    const { pcdIds } = val;
    if (Array.isArray(pcdIds) && pcdIds.length === 1) {
      // 设置为空
      form.resetFields(['pcdIds']);
    }
  };

  return (
    <SearchForm onSearch={change} form={form}>
      <FormProvinceList
        label='目标区域'
        name='pcdIds'
        placeholder='请选择省市/省市区'
        config={{
          allowClear: true,
          changeOnSelect: true,
        }}
        onBlur={() => blurHandle()}
      />
      <FormSelect
        label='推荐模型'
        name='modelId'
        config={{
          fieldNames: {
            label: 'name',
            value: 'id',
          },
          onPopupScroll: methods.modelScroll,
        }}
        options={selectionModel}
      />
      <FormDatePicker
        label='申请日期'
        name='createDate'
        config={{
          format: 'YYYY-MM-DD',
          disabledDate,
        }}
      />
      <FormSelect
        label='当前进度'
        name='status'
        options={[
          {
            label: '已完成',
            value: 1,
          },
          {
            label: '分析中',
            value: 0,
          },
        ]}
      />
      <FormSelect
        label='申请人'
        name='creatorId'
        options={selectionUser}
        config={{
          showSearch: true,
          fieldNames: {
            label: 'name',
            value: 'id',
          },
          filterOption: (input, option) =>
            ((option?.name ?? '') as any).toLowerCase().includes(input.toLowerCase()),
        }}
      />
    </SearchForm>
  );
};

export default Search;
