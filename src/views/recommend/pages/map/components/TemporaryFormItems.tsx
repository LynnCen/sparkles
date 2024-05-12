import { FC } from 'react';
import FormCheckbox from '@/common/components/Form/FormCheckbox';

const TemporaryFormItems: FC = () => {
  // const [state, setState] = useState<>();
  const categoryOptions = [
    { label: '家庭亲子', value: 1 },
    { label: '高消费人群', value: 2 },
    { label: '商务白领', value: 3 },
    { label: '学生', value: 4 },
    { label: '年轻时尚/潮流', value: 5 },
  ];
  const ageOptions = [
    { label: '20岁以下', value: 1 },
    { label: '20-30岁', value: 2 },
    { label: '30-40岁', value: 3 },
    { label: '40-50岁', value: 4 },
    { label: '50岁以上', value: 5 },
  ];
  const marriageOptions = [
    { label: '未婚', value: 1 },
    { label: '已婚未育', value: 2 },
    { label: '已婚已育', value: 3 },
  ];
  const educationOptions = [
    { label: '初中及以下', value: 1 },
    { label: '高中', value: 2 },
    { label: '大专', value: 3 },
    { label: '本科', value: 4 },
    { label: '硕士及以上', value: 5 },
  ];
  return (
    <>
      <FormCheckbox
        label='周边客群分类'
        name='category'
        options={categoryOptions}
      />
      <FormCheckbox
        label='年龄状况'
        name='age'
        options={ageOptions}
      />
      <FormCheckbox
        label='婚育状况'
        name='marriage'
        options={marriageOptions}
      />
      <FormCheckbox
        label='学历状况'
        name='education'
        options={educationOptions}
      />
    </>
  );
};

export default TemporaryFormItems;
