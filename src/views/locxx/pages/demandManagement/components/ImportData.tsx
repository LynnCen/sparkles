import { FC, useState, forwardRef, useImperativeHandle } from 'react';
import { Modal, Form } from 'antd';
import { useMethods } from '@lhb/hook';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { postRequirementImportExcel } from '@/common/api/demand-management';
import V2ImportModal from 'src/common/components/SpecialBusiness/V2ImportModal/index';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2Title from '@/common/components/Feedback/V2Title';
import { getRequirementSelection } from '@/common/api/demand-management';
import { contrast } from '@lhb/func';
import { refactorSelectionNew } from '@/common/utils/ways';

// 需求管理导入需求
const ImportData: FC<{onRefresh: Function; ref?: any}> = forwardRef(({
  onRefresh, // 刷新 table 列表
}, ref) => {
  const [modalVisible, setModalVisible] = useState(false);
  // 导入需求接口返回的数据，message：导入需求结果；url：失败文件路径；urlSuffix：失败文件名。
  const [responseMessage, setResponseMessage] = useState({ message: '', url: '', urlSuffix: '' });
  const [visible, setVisible] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [form] = Form.useForm();

  const files = [
    { name: '“有需求”阶段-需求导入模板.xlsx', url: 'https://staticres.linhuiba.com/project-custom/saas-manage/file/“有需求”阶段-需求导入模板.xlsx' },
    { name: '“待外呼:待跟进:无需求”阶段-需求导入模板.xlsx', url: 'https://staticres.linhuiba.com/project-custom/saas-manage/file/“待外呼:待跟进:无需求”阶段-需求导入模板.xlsx' },
  ];

  const [selection, setSelection] = useState({
    locxxRequirementSourceChannels: [], // 渠道
    locxxRequirementStages: [], // 跟进阶段
  });

  useImperativeHandle(ref, () => ({
    init: methods.init
  }));

  const methods = useMethods({
    init() {
      form.resetFields();
      methods.getSelection();
      setVisible(true);
    },
    submit(data) {
      return new Promise<void>((resolve, reject) => {
        const parmas = Object.assign({}, data, { excelUrl: data?.file[0]?.url || '' });

        setRequesting(true);
        postRequirementImportExcel(parmas).then((res) => {
          setVisible(false);
          setModalVisible(true);
          setResponseMessage({ ...responseMessage, message: res?.message || '', url: res?.url || '', urlSuffix: res?.urlSuffix || '' });
          resolve();
        }).catch(() => {
          reject(false);
        }).finally(() => {
          setRequesting(false);
          onRefresh();
        });
      });
    },
    getSelection() {
      getRequirementSelection({ modules: 'locxxRequirementSourceChannel,locxxRequirementStage' }).then((response) => {
        setSelection(val => ({ ...val,
          locxxRequirementSourceChannels: refactorSelectionNew({ selection: contrast(response, 'locxxRequirementSourceChannels', []) }),
          locxxRequirementStages: refactorSelectionNew({ selection: contrast(response, 'locxxRequirementStages', []) }),
        }));
      });
    },
  });

  return (
    <>
      <V2ImportModal
        form={form}
        title='导入数据'
        visible={visible}
        setVisible={setVisible}
        firstStageTitle='第二步：选择所导入需求的跟进阶段和来源渠道。'
        secondStageTitle='第三步：下载对应跟进阶段的需求导入模版。'
        assets={files}
        onSubmitExcel={methods.submit}
        modalConfig={{ confirmLoading: requesting }}
        stageTopRender={<div style={{ marginBlock: 16 }}>
          <V2Title type='H3' style={{ marginBottom: '12px' }}>第一步：选择所导入需求的跟进阶段和来源渠道</V2Title>
          <V2FormSelect required name='stageId' label='跟进阶段' options={selection.locxxRequirementStages} />
          <V2FormSelect required name='sourceChannelId' label='来源渠道' options={selection.locxxRequirementSourceChannels} />
        </div>}
        formConfig={{ layout: 'horizontal' }}
      />

      <Modal
        title='导入数据'
        width='428px'
        open={modalVisible}
        maskClosable={false}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <p>{responseMessage?.message}</p>
        {responseMessage?.url && responseMessage?.urlSuffix && <V2DetailItem
          type='files'
          exonOneFile={true}
          assets={[{ name: responseMessage?.urlSuffix, url: responseMessage?.url }]}/>}
      </Modal>
    </>);
});

export default ImportData;
