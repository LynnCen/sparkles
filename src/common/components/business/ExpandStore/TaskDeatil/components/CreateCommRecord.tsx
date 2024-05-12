/**
 * @Description 新建沟通记录
 */


import { FC, useEffect } from 'react';
import { Form, Modal } from 'antd';
import { useMethods } from '@lhb/hook';

import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormDatePicker from '@/common/components/Form/V2FormDatePicker/V2FormDatePicker';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import V2FormUpload from '@/common/components/Form/V2FormUpload/V2FormUpload';
import V2Form from '@/common/components/Form/V2Form';
import { addCommunicateRecord } from '@/common/api/expandStore/expansiontask';
import dayjs from 'dayjs';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

interface Props {
  id:number// 任务id
  open:boolean, // 打开弹窗
  setOpen: Function // 控制是否打开弹窗
  num: number // 已有沟通次数
  refresh: Function // 刷新详情
}


const CreateCommunicationRecord : FC<Props> = ({
  id,
  open,
  setOpen,
  num,
  refresh
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldValue('name', `第${num + 1}次沟通`);
    }
  }, [open]);

  const methods = useMethods({

    /**
     * @description 添加沟通纪要
     */
    onOk() {
      form.validateFields().then((values: any) => {
        const { name, content, fileList } = values;
        const communicateAt = values.communicateAt && dayjs(values.communicateAt).format('YYYY-MM-DD'); // form表单返回的Moment格式，用dayjs处理时间
        const fileListArr:string[] = []; // 只需要传递url字符串对象就可以了
        fileList && fileList.map((item) => {
          fileListArr.push(item.url);
        });
        try {
          addCommunicateRecord({ taskId: id, name, communicateAt, content, fileList: fileListArr })
            .then(() => {
              setOpen(false);
              refresh(true);
              form.resetFields(); // 清空表单
              V2Message.success('添加沟通记录成功');
            });
        } catch (error) {
          V2Message.error('添加沟通记录失败');
        }
      });
    },

    /**
     * @description 取消
     */
    onCancel() {
      setOpen(false);
      form.resetFields();
    }
  });

  return (
    <>
      <Modal
        title='新增沟通纪要'
        open={open}
        onOk={methods.onOk}
        width={520}
        onCancel={methods.onCancel}
        forceRender
      >
        <V2Form form={form}>
          <V2FormInput required label='沟通标题' name='name' maxLength={20}/>
          <V2FormDatePicker required label='沟通时间' name='communicateAt' config={{ format: 'YYYY-MM-DD' }}/>
          <V2FormTextArea
            required
            label='沟通内容'
            name='content'
            maxLength={200}
            config={{ showCount: true }}
          />
          <V2FormUpload
            required={num < 1}
            label='沟通上传凭证'
            name='fileList'
            uploadType='image'
            config={{
              maxCount: 3,
              size: 100,
              fileType: ['png', 'jpg', 'jpeg', 'bmp', 'webp']
            }}
            formItemConfig={{
              help: '支持 png / jpg / jpeg / bmp / webp 格式的文件，最多3个，不超过100MB',
            }}
            tipConfig={{ tooltipIconShow: false }}
          />
        </V2Form>
      </Modal>
    </>
  );
};
export default CreateCommunicationRecord;
