import { FC, useEffect, useState, useContext } from 'react';
import styles from './entry.module.less';
import { Button, Col, Form, message, Row } from 'antd';
import FormUpload from '@/common/components/Form/FormUpload';
import TableList from './components/TableList';
import EditModal from './components/EditModal';
import { useMethods } from '@lhb/hook';
import { getTenantInfo, getTenantType, setLogo } from '@/common/api/system';
import UserInfoContext from '@/layout/context';
const Enterprise: FC<any> = () => {
  const [operateId, setOperateId] = useState<number | string | null>(); // 操作用id
  const [params, setParams] = useState({}); // table列表的筛选条件，此文件仅作为触发列表刷新用。
  // 1、用来禁用uplader组件,并且用来对上传logo失败进行图片回溯
  // 2、如果详情接口失败，同样会禁用上传组件
  const [detailData, setDetailData] = useState<any>();
  const [permissions, setPermissions] = useState<any>([]);
  const [form] = Form.useForm();
  const [editData, setEditData] = useState<any>({
    visible: false,
    data: {}
  });
  const userInfo: Record<string, any> = useContext(UserInfoContext);
  const methods = useMethods({
    getDetail: async () => { // 获取当前租户详情
      try {
        const res = await getTenantType();
        setPermissions(res.meta.permissions);
        const data = await getTenantInfo();
        setDetailData(data);
        const params: any = {};
        data.logo && (params.logo = [{ url: data.logo }]);
        data.webHeaderUri && (params.webHeaderUri = [{ url: data.webHeaderUri }]);
        data.pcHeaderUri && (params.pcHeaderUri = [{ url: data.pcHeaderUri }]);
        data.pcTinyHeaderUri && (params.pcTinyHeaderUri = [{ url: data.pcTinyHeaderUri }]);
        // data.appBackgroundUri && (params.appBackgroundUri = [{ url: data.appBackgroundUri }]);
        data.standardChancePointReportLogo && (params.standardChancePointReportLogo = [{ url: data.standardChancePointReportLogo }]);
        form.setFieldsValue(params);
      } catch (error) {

      }
    },
    onSearch() { // 刷新列表
      setParams({});
    },
    onChange: async (file, type) => { // logo图片修改
      if (file[0].status === 'done' && file[0].url) {
        try {
          const res = await setLogo({
            url: file[0].url,
            type
          });
          if (!res) throw new Error(res);
          if (type === 'webHeaderUri' || type === 'pcHeaderUri' || type === 'pcTinyHeaderUri') {
            userInfo.getTenantDetail();
          }
          message.success('logo上传成功');
        } catch (error) {
          form.setFieldsValue({
            logo: [{ url: detailData.logo }]
          });
        }
      }
    },
    showEdit(visible = false, data: any = {}) { // 操作门店类型弹窗
      setEditData({
        ...editData,
        visible,
        data
      });
    },
    addHandle() { // 新增门店类型
      setOperateId(null);
      methods.showEdit(true);
    },
    isMeetCondition(file, type) {
      console.log(type, file);
    },
  });
  useEffect(() => {
    methods.getDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.title}>基本信息</div>
      <Form form={form}>
        <Row gutter={32}>
          <Col>
            <FormUpload
              label='品牌LOGO：'
              name='logo'
              valuePropName='fileList'
              formItemConfig={{ colon: false }}
              config={{
                maxCount: 1,
                isPreviewImage: true,
                onlyEdit: true,
                showSuccessMessage: false,
                onChange: (file) => methods.onChange(file, 'logo'),
                disabled: !detailData,
                accept: '.png, .jpg, .jpeg',
                fileType: ['png', 'jpp', 'jpeg']
              }}
            />
          </Col>
          {permissions.find(val => val.event.includes('webHeaderUri')) && <Col className='padding-flag'>
            {/* 浏览器Tab显示用的logo */}
            <FormUpload
              label={<div>
                <div>网页地址头像：</div>
                <p className='logo'>
                  icon、png、jpg格式<br/>
                  尺寸≤64*64
                </p>
              </div>}
              name='webHeaderUri'
              valuePropName='fileList'
              formItemConfig={{ colon: false }}
              config={{
                maxCount: 1,
                isPreviewImage: true,
                onlyEdit: true,
                showSuccessMessage: false,
                onChange: (file) => methods.onChange(file, 'webHeaderUri'),
                disabled: !detailData,
                accept: '.png, .jpg, .jpeg, .ico',
                fileType: ['png', 'jpp', 'jpeg', 'ico'],
                width: 64,
                height: 64
              }}
            />
          </Col>}
          {permissions.find(val => val.event.includes('pcHeaderUri')) && <Col>
            <FormUpload
              label={<div>
                <div>PC端头像大图：</div>
                <p className='logo'>
                  png、jpg格式<br/>
                  尺寸≤160*48
                </p>
              </div>}
              name='pcHeaderUri'
              valuePropName='fileList'
              formItemConfig={{ colon: false }}
              config={{
                maxCount: 1,
                isPreviewImage: true,
                onlyEdit: true,
                showSuccessMessage: false,
                onChange: (file) => methods.onChange(file, 'pcHeaderUri'),
                disabled: !detailData,
                accept: '.png, .jpg, .jpeg',
                fileType: ['png', 'jpp', 'jpeg'],
                width: 160,
                height: 48
              }}
            />
          </Col>}
          {permissions.find(val => val.event.includes('pcTinyHeaderUri')) && <Col>
            {/* 侧边栏收起后的小logo */}
            <FormUpload
              label={<div>
                <div>PC端头像小图：</div>
                <p className='logo'>
                  png、jpg格式<br/>
                  尺寸≤30*30
                </p>
              </div>}
              name='pcTinyHeaderUri'
              valuePropName='fileList'
              formItemConfig={{ colon: false }}
              config={{
                maxCount: 1,
                isPreviewImage: true,
                onlyEdit: true,
                showSuccessMessage: false,
                onChange: (file) => methods.onChange(file, 'pcTinyHeaderUri'),
                disabled: !detailData,
                accept: '.png, .jpg, .jpeg',
                fileType: ['png', 'jpp', 'jpeg'],
                width: 30,
                height: 30
              }}
            />
          </Col>}
          {/* {permissions.find(val => val.event.includes('appBackgroundUri')) && <Col>
            <FormUpload
              label='APP端背景图'
              name='appBackgroundUri'
              valuePropName='fileList'
              config={{
                maxCount: 1,
                isPreviewImage: true,
                onlyEdit: true,
                accept: '.png, .jpg, .jpeg',
                showSuccessMessage: false,
                onChange: (file) => methods.onChange(file, 'appBackgroundUri'),
                disabled: !detailData,
                fileType: ['png', 'jpp', 'jpeg'],
                width: 750,
                height: 386
              }}
            />
            <p className='logo'>
              png、jpg格式<br/>
              尺寸≤750*386
            </p>
          </Col>} */}

          {permissions.find(val => val.event.includes('standardChancePointReportLogo')) && <Col>
            {/* 报告用的logo图片 */}
            <FormUpload
              label={<div>
                <div>报告Logo：</div>
                <p className='logo'>
                  png、jpg格式<br/>
                  尺寸≤88*28
                </p>
              </div>}
              name='standardChancePointReportLogo'
              valuePropName='fileList'
              formItemConfig={{ colon: false }}
              config={{
                maxCount: 1,
                isPreviewImage: true,
                onlyEdit: true,
                showSuccessMessage: false,
                onChange: (file) => methods.onChange(file, 'standardChancePointReportLogo'),
                disabled: !detailData,
                accept: '.png, .jpg, .jpeg',
                fileType: ['png', 'jpp', 'jpeg'],
                width: 88,
                height: 28
              }}
            />
          </Col>}


        </Row>
      </Form>
      <Button type='primary' size='large' onClick={methods.addHandle}>新增门店类型</Button>
      <EditModal
        id={operateId}
        editData={editData}
        showEdit={methods.showEdit}
        onSuccess={() => {
          methods.onSearch();
        }} />
      <TableList params={params} setOperateId={setOperateId} add={methods.addHandle} showEdit={methods.showEdit}></TableList>
    </div>
  );
};
export default Enterprise;
