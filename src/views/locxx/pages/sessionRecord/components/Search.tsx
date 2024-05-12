/**
 * @Description 会话记录搜索
 */
import FormSearch from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import FormUserList from '@/common/components/FormBusiness/FormUserList';
import { Form } from 'antd';

const Search = ({ onSearch }) => {

  const [searchForm] = Form.useForm();
  const selection = {
    // 未回复时间
    unReplayTimes: [
      { value: 0, label: '>=0h' },
      { value: 8, label: '>=8h' },
      { value: 24, label: '>=24h' },
      { value: 48, label: '>=48h' },
      { value: 72, label: '>=72h' },
    ],
    // 发起方
    fromTypes: [{ value: 1, label: '品牌' }, { value: 2, label: '物业' }],
    unReplayStatus: [
      { value: 'YES', label: '是' },
      { value: 'NO', label: '否' },
      { value: 'HAS_READ_BUT_NOT_REPLY', label: '已读未回' },
    ]
  };

  return (
    <FormSearch form={searchForm} onSearch={onSearch} labelLength={4}>
      <V2FormInput label='发起方' maxLength={50} placeholder='搜索项目/品牌名称、联系人姓名手机' name='fromAccount' />
      <V2FormInput label='接收方' maxLength={50} placeholder='搜索项目/品牌名称、联系人姓名手机' name='toAccount' />
      <V2FormInput label='内容' maxLength={50} placeholder='搜索会话内容' name='content' />

      <V2FormRangePicker label='会话创建时间' name='date' config={{ format: 'YYYY-MM-DD' }} />
      <V2FormRangePicker label='会话时间' name='latelyTime' config={{ format: 'YYYY-MM-DD' }} />
      <V2FormSelect label='回复状态' name='isReply' options={selection.unReplayStatus} />
      <V2FormSelect label='未回复时间' name='unReplayTime' options={selection.unReplayTimes} />
      <V2FormSelect label='发起方' name='fromType' options={selection.fromTypes} />
      <FormUserList label='跟进人' name='followerIds' placeholder='请选择跟进人' allowClear={true} config={{ mode: 'multiple' }} form={searchForm} />
    </FormSearch>
  );
};

export default Search;
