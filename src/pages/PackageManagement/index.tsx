import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { ApkElement, ItemType, QueryType, UpdateParams } from './data.d';
import { connect, useIntl } from 'umi';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import UploadForm, {FormValueType as UploadValueType} from './components/UploadForm';
import { Button, Progress, Divider, message, Spin } from 'antd';
import { queryList, updateById, addNew } from './service';
import { PlusOutlined } from '@ant-design/icons';
import ProTableIntl from '@/components/ProTableIntl';
import { UserModelState } from '@/models/user';
import getPermissionsAsObj from '@/utils/permissions';
import { ConnectState } from '@/models/connect';
import { uploadAWS } from '@/utils/aws';
import { getSTS } from '@/services/common';
import { ProgressEvent, S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import { STSItems } from '@/services/common';
import type { S3Client } from '@aws-sdk/client-s3';


const getFileType = (filepath: string) => {
  if (!filepath) return '';
  return filepath.slice(filepath.lastIndexOf('.') + 1);
};

/**
 * 更新节点
 * @param fields
 * @param id
 * @param formatMessage
 */
const handleUpdate = async (
  fields: UpdateParams,
  id: string,
  formatMessage: (obj: { id: string }) => string,
) => {
  const hide = message.loading(formatMessage({ id: 'table-setting-loading' }));
  try {
    const res = await updateById({...fields, id});
    if (res) {
      const [data, err] = res
      if (!err && !data.err_msg) {
        hide();
        message.success(formatMessage({ id: 'table-setting-finished' }));
        return true;
      } 
      message.error(data.err_msg)
    }

    hide();
    return false;
  } catch (error) {
    hide();
    // message.error(formatMessage({ id: 'table-setting-failure' }));
    return false;
  }
};

/**
 * 新增节点
 * @param fields
 * @param formatMessage
 */
const handleAdd = async (fields: UpdateParams, formatMessage: (obj: { id: string }) => string) => {
  const hide = message.loading(formatMessage({ id: 'table-setting-loading' }));
  try {
    const res = await addNew({...fields});
    if (res) {
      const [data, err] = res
      if (!err && !data.err_msg) {
        hide();

        message.success(formatMessage({ id: 'table-setting-finished' }));
        return true;
      }
      message.error(data.err_msg)

    }
    
    hide()
    return false
  } catch (error) {
    hide();
    // message.success(formatMessage({ id: 'table-setting-failure' }));
    return false;
  }
};


interface PropsType {
  user?: UserModelState;
}


const TableList: React.FC<PropsType> = (props) => {
  const { formatMessage } = useIntl();
  const [selectedItem, setSelectedItem] = useState<ItemType | Record<string, never>>({});
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [uploadModalVisible, handleUploadModalVisible] = useState<boolean>(false);
  const [authObj, setAuthObj] = useState<{ [x: string]: boolean }>({});

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [up_percent, setPercent] = useState<number>(0)
  const [showProgress, isShowProgress] = useState<boolean>(false)
  const [up_status, setStatus] = useState<"success" | "normal" | "exception" | "active" | undefined>('normal')

  const [upload, setUpload] = useState<Upload>()
  const [client, setClient] = useState<S3Client>()
  const [bucketInfo, setBucketInfo] = useState<STSItems>()

  const [maskStyle, setMaskStyle] = useState<React.CSSProperties>({
    display: 'none',
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,.4)',
    zIndex: 9999,
    position: 'fixed',
    top: 0,
    left: 0
  })

  useEffect(() => {
    getSTS().then(res => {
      if (res) {
        const [data, err] = res
        if (!err) {
          const { sts, region, bucket_name, base_host, bucket_id } = data
          const s3 = new S3({
            region,
            endpoint: {
              hostname: `s3-accelerate.amazonaws.com`,
              protocol: 'https', 
              path: ''
            },
            credentials: {
              accessKeyId: sts.access_key_id,
              secretAccessKey: sts.access_key_secret,
              sessionToken: sts.session_token,
            },
          });
          setClient(s3)
          setBucketInfo(data)
        }
      }

    })

  }, []) 
  

  useEffect(() => {
    // @ts-ignore
    setAuthObj(getPermissionsAsObj(props.user.currentUser.access, ['setting', 'apk']));
  }, [props.user]);

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<ItemType>[] = [
    {
      title: formatMessage({ id: 'table-id' }),
      dataIndex: 'id',
      hideInSearch: true,
      width: 50,
    },
    {
      title: formatMessage({ id: 'table-type' }),
      dataIndex: 'type',
      hideInSearch: true,
      render(text, record) {
        if (record.type === 1) return 'Ios';
        if (record.type === 2) return 'Android';
        if (record.type === 3) return 'Window'
        return 'Mac';
      },
    },
    {
      title: formatMessage({ id: 'table-version' }),
      dataIndex: 'version',
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'table-apk-link' }),
      dataIndex: 'apk',
      hideInSearch: true,
      width: 200,
      ellipsis: true,
      render(val, record) {
        return record.apk.name
      }
    },
    // {
    //   title: formatMessage({ id: 'table-yml-link' }),
    //   dataIndex: 'yml',
    //   hideInSearch: true,
    //   width: 200,
    //   ellipsis: true,
    // },
    {
      title: formatMessage({ id: 'table-description' }),
      dataIndex: 'desc',
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'table-itime' }),
      dataIndex: 'create_time',
      valueType: 'date',
      hideInSearch: true,
      renderText: (text) => {
        return text;
      },
    },
    {
      title: formatMessage({ id: 'table-action' }),
      dataIndex: 'option',
      valueType: 'option',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_, record) => (
        <>
          {authObj.edit && (
            <>
              <a
                onClick={() => {
                  handleUpdateModalVisible(true);
                  setSelectedItem(record);
                }}
              >
                {formatMessage({ id: 'table-edit' })}
              </a>
              <Divider type="vertical" />
            </>
          )}
        </>
      ),
    },
  ];

  const handleAWSUpload = async (fields: UploadValueType, formatMessage: (obj: { id: string }) => string, setPercent, isShowProgress, isYml?: boolean): Promise<[boolean, string]> => {
    const hide = message.loading(
      <span style={{zIndex: 10000}}>
        {formatMessage({ id: 'table-upload-loading' })}
      </span>
      ,
      0
    );
    isShowProgress(true)
    setMaskStyle(state => ({...state, display: 'block'}))
    try {
      const { bucket_name, base_host, bucket_id } = bucketInfo as STSItems
      let prefix = '', filetype = ''
      switch (fields.type) {
        case 4:
          prefix += 'pc-upgrade/mac/'
          filetype += 'Mac'
          break;
        case 3:
          prefix += 'pc-upgrade/win/64/'
          filetype += 'Win'
          break;
        case 2:
          prefix += 'apk/'
          filetype += 'Android'
          break;
        case 1:
          prefix += 'ios/'
          filetype += 'Ios'
          break;
      }

      const key = prefix +  `${
        fields.file.name.slice(
          0,
          fields.file.name.lastIndexOf('.') === -1 
            ? fields.file.name.length
            : fields.file.name.lastIndexOf('.')
        )
      }`; 
      const file_type = getFileType(fields.file.name);

      var params = {
        AccelerateConfiguration: { /* required */
          Status: 'Enabled'
        },
        Bucket: bucket_name, 
      };

      await (client as S3).putBucketAccelerateConfiguration(params)

      const uploadParams = {
        Bucket: bucket_name,
        Key: `${key}.${file_type}`,
        Body: fields.file,
      };

      const upload = new Upload({
        params: uploadParams,
        client: client as S3,
      })

      setUpload(upload)

      upload.on('httpUploadProgress', (progress) => {
        // @ts-ignore
        const percent = Math.floor((progress.loaded / progress.total) * 100) 
        if (percent === 100) {
          setPercent(0)
          isShowProgress(false)
          return
        }
        setPercent(percent)
      },)

      await upload.done()

      message.success('上传成功');
      hide()
      isShowProgress(false)
      setMaskStyle(state => ({...state, display: 'none'}))
      return [true, bucket_id]

    } catch (error) {
        message.error(formatMessage({ id: 'table-upload-fail' }))
        hide()
        isShowProgress(false)
        setPercent(0)
        return [false, '']
    }
  }

  return (
    <PageHeaderWrapper>
      <ProTableIntl<ItemType, QueryType>
        actionRef={actionRef}
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<ItemType>;
          if (sorterResult.field) {
            // setSorter(sorterResult.order === 'ascend' ? '1' : '-1');
          }
        }}
        search={false}
        toolBarRender={() => {
          if (!authObj.insert) return [];
          return [
            <Button key={'ins'} type="primary" onClick={() => handleModalVisible(true)}>
              <PlusOutlined /> {formatMessage({ id: 'table-add' })}
            </Button>
          ];
        }}
        request={async (params) => {

          // 这里更新请求参数
          const res = await queryList({
            page: params?.current,
            row: params?.pageSize,
          });


          if (res) {
            const [data, err] = res

            const items = data.items.map(item => {
              return {...item, key: item.id}
            })
            
            if (!err ) {
              return {
                data: items,
                success: !data.err_code,
                total: data.count,
                current: data.page,
              };
            }
          }
          
          return {
            data: [],
            success: false,
            total: 0,
            current:0
          }
        }}
        columns={columns}
        pagination={{
          current: currentPage,
          onChange(page) {
            setCurrentPage(page)
          },
        }}
        
      />
      {createModalVisible && (
        <UpdateForm
          isAddNew
          onCancel={async () => {
            if (showProgress) {
              await upload?.abort()
              setPercent(0)
              isShowProgress(false)
            }
            handleModalVisible(false)
          }}
          updateModalVisible={createModalVisible}
          onSubmit={async (value) => {
            

             // upload aws file
             const apk = value.apk
             const [up_success, bucketId] = await handleAWSUpload({file: apk?.file.originFileObj as File, type: value.type as number, version: value.version as string}, formatMessage, setPercent, isShowProgress)
             // stop procees if upload is fail
             if (!up_success) {
               return;
             }
              
            if (
              value.yml
            ) {
   
            const yml = value.yml
            const [yml_success] = await handleAWSUpload({file: yml?.file.originFileObj as File, type: value.type as number, version: value.version as string}, formatMessage, setPercent, isShowProgress, true)
  
            if (!yml_success) {
              return;
            }
            }

            let params: any = {
              id: value.id,
              type: value.type,
              desc: value.version,
              version: value.version,
            }
              
              let prefix = '', filetype = ''
              switch (value.type) {
                case 4:
                  prefix += 'pc-upgrade/mac/'
                  filetype += 'Mac'
                  break;
                case 3:
                  prefix += 'pc-upgrade/win/64/'
                  filetype += 'Win'
                  break;
                case 2:
                  prefix += 'apk/'
                  filetype += 'Android'
                  break;
                case 1:
                  prefix += 'ios/'
                  filetype += 'Ios'
                  break;
              }

              const key = prefix +  `${
                value.apk?.file.name.slice(
                  0,
                  value.apk?.file.name.lastIndexOf('.') === -1 
                    ? value.apk?.file.name.length
                    : value.apk?.file.name.lastIndexOf('.')
                )
              }`;  
              const file_type = getFileType(value.apk?.file.name as string);

              params.apk = {
                objectId: `${key}.${file_type}`,
                name:value.apk?.file.name,
                fileType: value.apk?.file.type,
                size:value.apk?.file.size,
                bucketId: bucketId
              }
                  
            // handle add
            const success = await handleAdd(params, formatMessage);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          values={{}}
        />
      )}
      {selectedItem && Object.keys(selectedItem).length ? (
        <UpdateForm
          onSubmit={async (value) => {

            //
            if (value.yml && value.apk) {
              const [up_success, bucketId] = await handleAWSUpload({file: value.apk.file.originFileObj as File, type: value.type as number, version: value.version as string}, formatMessage, setPercent, isShowProgress)
              if (!up_success) {
                return
              }

              let prefix = '', filetype = ''
              switch (value.type) {
                case 4:
                  prefix += 'pc-upgrade/mac/'
                  filetype += 'Mac'
                  break;
                case 3:
                  prefix += 'pc-upgrade/win/64/'
                  filetype += 'Win'
                  break;
                case 2:
                  prefix += 'apk/'
                  filetype += 'Android'
                  break;
                case 1:
                  prefix += 'ios/'
                  filetype += 'Ios'
                  break;
              }

              const key = prefix +  `${
                value.apk?.file.name.slice(
                  0,
                  value.apk?.file.name.lastIndexOf('.') === -1 
                    ? value.apk?.file.name.length
                    : value.apk?.file.name.lastIndexOf('.')
                )
              }`;  
              const file_type = getFileType(value.apk?.file.name as string);

              const params = {
                id: value.id,
                type: value.type,
                desc: value.version,
                version: value.version,
                apk: {
                  objectId: `${key}.${file_type}`,
                  name: value.apk?.file.name,
                  fileType: value.apk?.file.type,
                  size: value.apk?.file.size,
                  bucketId: bucketId
                }
              }

              const [yml_success] = await handleAWSUpload({file: value.yml.file.originFileObj as File, type: value.type as number, version: value.version as string}, formatMessage, setPercent, isShowProgress, true)
              if (!yml_success) {
                return
              }
            }

            const params: UpdateParams = {
              type: value.type as number,
              version: value.version as string,
            } 

            if (value.desc) {
              params.desc = value.desc
            }

            const success = await handleUpdate(params, selectedItem.id, formatMessage);
            if (success) {
              handleUpdateModalVisible(false);
              setSelectedItem({});
              if (actionRef.current) {
                actionRef.current.reload(); 
              }
            }
          }}
          onCancel={async () => {
            if (showProgress) {
              await upload?.abort()
              setPercent(0)
              isShowProgress(false)
            }
            handleUpdateModalVisible(false);
            setSelectedItem({});
          }}
          updateModalVisible={updateModalVisible}
          values={selectedItem as FormValueType}
        />
      ) : null}
      {
       uploadModalVisible && 
       <UploadForm
         onSubmit={async (fields) => {
          const success = await handleAWSUpload(fields, formatMessage, setPercent, isShowProgress)
          if (success) {
            handleUploadModalVisible(false)
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
         }}
         onCancel={() => {
          handleUploadModalVisible(false)
         }}
         uploadModalVisible={uploadModalVisible}
       />
      }

      {
        showProgress && (
        <Progress 
          style={{ 
            'zIndex': 10000, 
            position: 'fixed',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%) translateY(-50%)'
          }} 
          type="circle"  
          percent={up_percent}
        />
        )
      }

      <div style={maskStyle}>
        上传中。。。
        <Button 
          onClick={async () => {
            setMaskStyle(state => ({...state, display: 'none'}))
            if (showProgress) {
              await upload?.abort()
              setPercent(0)
              isShowProgress(false)
            }
          }}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translateX(-50%) translateY(-50%)'
          }}
        >
          取消上传
        </Button>
      </div>
    </PageHeaderWrapper>
  );
};

export default connect(({ user }: ConnectState) => ({ user }))(TableList);
