/**
 * @Description 导入分析数据
 */
import React, { FC, useEffect, useState } from 'react';
import { Modal, Form, message } from 'antd';
import TemplateUpload from '@/common/components/Business/Templete/Upload';
import FormUpload from '@/common/components/Form/FormUpload';
import { Bucket, bucketMappingDomain } from '@/common/enums/qiniu';
import { post } from '@/common/request';
import { deepCopy, recursionEach } from '@lhb/func';
import Tree from 'antd/lib/tree/Tree';
import { DataNode } from 'antd/lib/tree';

export interface treeDataProps extends DataNode {
  /**
   * @description 表格中是否显示
   */
  showColumn?: boolean;
  width?: string | number;
  children?: treeDataProps[];
}

/**
 * @description 导入分析数据树形结构
 */
export const treeData: treeDataProps[] = [
  {
    title: '过店客流',
    key: 'flow',
    showColumn: false,
    children: [
      {
        title: '过店总数',
        key: 'passbyCount',
        showColumn: false,
        width: 70,
      },
      {
        title: '女性',
        key: 'flowFemale',
        showColumn: false,
        children: [
          {
            title: '儿童',
            key: 'passbyFemaleChild',
            showColumn: false,
            width: 50,
          },
          {
            title: '青年',
            key: 'passbyFemaleTeen',
            showColumn: false,
            width: 50,
          },
          {
            title: '老人',
            key: 'passbyFemaleOlder',
            showColumn: false,
            width: 50,
          },
          {
            title: '女性总数',
            key: 'passbyFemaleCount',
            showColumn: false,
            width: 70,
          },
        ],
      },
      {
        title: '男性',
        key: 'flowMale',
        showColumn: false,
        children: [
          {
            title: '儿童',
            key: 'passbyMaleChild',
            showColumn: false,
            width: 50,
          },
          {
            title: '青年',
            key: 'passbyMaleTeen',
            showColumn: false,
            width: 50,
          },
          {
            title: '老人',
            key: 'passbyMaleOlder',
            showColumn: false,
            width: 50,
          },
          {
            title: '男性总数',
            key: 'passbyMaleCount',
            showColumn: false,
            width: 70,
          },
        ],
      },
    ],
  },
  {
    title: '进店客流',
    key: 'passenger',
    showColumn: false,
    children: [
      {
        title: '进店总数',
        key: 'indoorCount',
        showColumn: false,
        width: 70,
      },
      {
        title: '女性',
        key: 'passengerFemale',
        showColumn: false,
        children: [
          {
            title: '儿童',
            key: 'indoorFemaleChild',
            showColumn: false,
            width: 50,
          },
          {
            title: '青年',
            key: 'indoorFemaleTeen',
            showColumn: false,
            width: 50,
          },
          {
            title: '老人',
            key: 'indoorFemaleOlder',
            showColumn: false,
            width: 50,
          },
          {
            title: '女性总数',
            key: 'indoorFemaleCount',
            showColumn: false,
            width: 70,
          },
        ],
      },
      {
        title: '男性',
        key: 'passengerMale',
        showColumn: false,
        children: [
          {
            title: '儿童',
            key: 'indoorMaleChild',
            showColumn: false,
            width: 50,
          },
          {
            title: '青年',
            key: 'indoorMaleTeen',
            showColumn: false,
            width: 50,
          },
          {
            title: '老人',
            key: 'indoorMaleOlder',
            showColumn: false,
            width: 50,
          },
          {
            title: '男性总数',
            key: 'indoorMaleCount',
            showColumn: false,
            width: 70,
          },
        ],
      },
    ],
  },
  {
    title: '进店率',
    key: 'indoorRate',
    showColumn: false,
    children: [],
    width: 80,
  },
  {
    title: '提袋客流',
    key: 'shoppingCount',
    showColumn: false,
    children: [],
    width: 80,
  },
  {
    title: '提袋率',
    key: 'shoppingRate',
    showColumn: false,
    children: [],
    width: 80,
  },
];



interface IProps {
  visible: boolean;
  onCloseModal: () => void;
  targetInfo: any;
  refreshList: () => void;
}

const ImportVideoList: FC<IProps> = ({
  visible,
  onCloseModal,
  targetInfo,
  refreshList
}) => {
  const [form] = Form.useForm();
  const [checkedKeys, setCheckedKeys] = useState<{checked:React.Key[], halfChecked:React.Key[]}>({
    checked: [], // 选中的节点
    halfChecked: [], // 半选中的节点
  });

  const onOk = () => {
    form.validateFields().then(async (values) => {
      if (!checkedKeys.checked.length) return message.error('请选择导入字段');
      const _treeData = deepCopy(treeData);
      const selectTreeData = recursionEach(_treeData, 'children', (item:treeDataProps) => {
        if (checkedKeys.checked.includes(item.key) || checkedKeys.halfChecked.includes(item.key)) {
          item.showColumn = true;
        }
      });

      const { url: urlArr } = values;
      const targetFile = urlArr[0] || {};
      const params = {
        projectId: targetInfo.id,
        url: targetFile.url,
        fields: selectTreeData
      };
      // https://yapi.lanhanba.com/project/289/interface/api/40207
      await post('/checkSpot/report/import', params, {
        proxyApi: '/terra-api'
      });
      message.success('导入成功');
      refreshList?.();
      onCancel();
    });
  };

  const onCancel = () => {
    onCloseModal();
    form.resetFields();
  };


  const onCheck = (checked, e) => {
    // console.log('onCheck', checked, e.halfCheckedKeys);
    setCheckedKeys({
      checked,
      halfChecked: e.halfCheckedKeys
    });
  };

  useEffect(() => {
    if (!visible) {
      setCheckedKeys({
        checked: ['passbyCount'],
        halfChecked: ['flow'],
      });
    }

  }, [visible]);


  return (
    <>
      <Modal
        title='导入分析数据'
        open={visible}
        onOk={onOk}
        onCancel={onCancel}>
        <p className='fn-16 mb-16'>请选择交付字段：</p>
        <Tree
          defaultExpandAll
          checkable
          autoExpandParent={true}
          onCheck={onCheck}
          checkedKeys={checkedKeys.checked}
          treeData={treeData}
          height={260}
        />
        <Form form={form} className='mt-16' layout={'vertical'}>
          <p className='fn-16 mb-16'>请选择要导入的文件：</p>
          <FormUpload
            name='url'
            valuePropName='fileList'
            rules={[{ required: true, message: '请导入交付文件' }]}
            config={{
              listType: 'text',
              maxCount: 1,
              size: 3,
              accept: '.xlsx, .xls',
              qiniuParams: {
                domain: bucketMappingDomain['linhuiba-temp'],
                bucket: Bucket.Temp,
              },
              showSuccessMessage: false,
              fileType: ['xls', 'xlsx'],
            }}
          >
            <TemplateUpload text='选择文件' />
            <div className='color-bbc mt-5 fs-12'>只能上传xlsx、xls文件，不超过3MB，最多上传 1 个文件</div>
          </FormUpload>
        </Form>
      </Modal>
    </>
  );
};

export default ImportVideoList;
