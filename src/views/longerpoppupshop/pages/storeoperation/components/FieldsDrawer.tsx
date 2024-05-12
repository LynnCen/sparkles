import {
  FC,
  useEffect,
  // useState,
} from 'react';
import {
  Drawer,
  Form,
  Button
} from 'antd';

const FieldsDrawer: FC<any> = ({
  visible,
  setVisible
}) => {
  const [form] = Form.useForm();

  // const [state, setState] = useState<>();

  useEffect(() => {

  }, []);
  const onClose = () => {

  };
  // const open = () => {

  // };
  return (
    <Drawer
      title={<div className='ct fn-16 bold'>数据筛选</div>}
      placement='right'
      width='50%'
      open={visible}
      closable={false}
      onClose={onClose}
      footer={<div className='rt'>
        <Button
          size='large'
          onClick={() => setVisible(false)}>
          取消
        </Button>
        <Button
          size='large'
          type='primary'
          onClick={() => setVisible(false)}
          className='ml-12'>
          确定
        </Button>
      </div>}>
      <Form form={form}>

      </Form>
    </Drawer>
  );
};

export default FieldsDrawer;
