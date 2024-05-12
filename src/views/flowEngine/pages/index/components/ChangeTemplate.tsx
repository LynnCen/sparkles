/**
 * @Description
 */
import React, { useState, useEffect, useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Modal, List, Skeleton, Divider, Form, Button } from 'antd';
import { debounce, matchQuery } from '@lhb/func';
import cs from 'classnames';

import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';
import V2Form from '@/common/components/Form/V2Form';
import FormInput from '@/common/components/Form/FormInput';
import { get, post } from '@/common/request';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { setStorage } from '@lhb/cache';

interface ChangeTemplateProps {
  templateModalData: boolean;
  setTemplateModalData: (value: boolean) => void;
  /**
   * @description 是否是demo页面，从 location 管理进来的不是 demo 页面
   * @default location.pathname.includes('flowEngine') 默认根据路由页判断，也可外部传入
   */
  isDemo?:boolean;
  /**
   * @description 父组件传入的租户id，用于 location 页面
   * @default null 如果无传入，则从 url 中获取
   */
  propsTenantId?: string | number | null;
  /**
   * @description 额外需要通过 url 带入的参数
   */
  otherUrlParams?: {}
}


let page: number = 0;


const ChangeTemplate: React.FC<ChangeTemplateProps> = ({
  isDemo = location.pathname.includes('flowEngine'), // 是否是demo页面
  templateModalData,
  setTemplateModalData,
  propsTenantId = null,
  otherUrlParams = {}
}) => {
  const appId = matchQuery(location.search, 'appId') || 1; // 应用id，location应用id为1
  const tenantId = propsTenantId || matchQuery(location.search, 'tenantId'); // 租户id

  const [form] = Form.useForm();
  const keyword = Form.useWatch('keyword', form);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [enterprisesList, setEnterprisesList] = useState<any[]>([]);
  const debounceOnChange = useRef(debounce((keyword) => loadMoreData(keyword), 500));// 防抖



  const onClose = () => {
    unstable_batchedUpdates(() => {
      setEnterprisesList([]);
      setTemplateModalData(false);
      form.resetFields();
    });
  };

  // 选择模版
  const intoHandle = async (enterprise: any) => {
    const { id, extraData } = enterprise;

    const params: any = {
      id,
      extraData,
      appId
    };

    const getFields = async () => {
      // https://yapi.lanhanba.com/project/355/interface/api/55271
      const values = await post('/form/fields', params, { proxyApi: '/workflow-api', });
      return values;
    };

    const getConditionFields = async () => {
      // https:// yapi.lanhanba.com/project/355/interface/api/61627
      const values = await post('/form/conditionFields', params, { proxyApi: '/workflow-api', });
      return values;
    };
    const [fields, conditionFields] = await Promise.all([getFields(), getConditionFields()]);
    setStorage('formFields', fields);
    setStorage('formConditionFields', conditionFields);
    const urlParams = {
      appId,
      tenantId,
      isDemo,
      ...otherUrlParams
    };
    dispatchNavigate(`/flowEngine/edit?params=${decodeURI(JSON.stringify(urlParams))}`);
  };

  const skipBtn = () => {
    setStorage('formFields', []);
    const urlParams = {
      appId,
      tenantId,
      isDemo,
      ...otherUrlParams
    };
    dispatchNavigate(`/flowEngine/edit?params=${decodeURI(JSON.stringify(urlParams))}`);
  };


  const loadMoreData = (keyword?: string) => {
    if (loading) {
      return;
    }
    page = page + 1;
    setLoading(true);
    setHasMore(true);

    const params = {
      keyword: keyword,
      page,
      size: 25,
      tenantId,
      appId
    };

    // https://yapi.lanhanba.com/project/355/interface/api/55264
    get('/form/templates', params, { proxyApi: '/workflow-api', }).then(res => {
      let newList: any[] = [];

      if ((page === 1 || page === 0) && keyword) {
        newList = [].concat(res.objectList);
      } else {
        newList = enterprisesList.concat(res.objectList);
      }
      setEnterprisesList(newList);

      if (!res.objectList.length || newList.length >= res.totalNum) {
        setHasMore(false);
      }

      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  };

  const onSearch = (value: string) => {
    if (!value) { // 清空输入框的时候,清空enterprisesList重新获取
      setEnterprisesList([]);
    }
  };


  useEffect(() => {
    if (templateModalData) {
      page = 0;
      debounceOnChange.current(keyword);
    }
  }, [templateModalData, keyword]);


  return (
    <Modal
      open={templateModalData}
      title='请选择表单模板'
      footer={[<Button type='primary' className='mt-12' onClick={skipBtn} key='skipBtn'>跳过，不选择模板</Button>]}
      onCancel={onClose}
      width={480}
      destroyOnClose
      className={styles.accountModal}
    >
      <V2Form form={form}>
        <FormInput
          name={'keyword'}
          placeholder='请输入表单模板名称'
          allowClear
          config={{
            suffix: <IconFont iconHref='icon-shousuo' />,
            onChange: (e) => onSearch(e.target.value)
          }}
        />
      </V2Form>
      <div
        id='scrollableDiv'
        className={styles.infiniteScrollContainer}
      >
        <InfiniteScroll
          dataLength={enterprisesList.length}
          next={() => loadMoreData(keyword)}
          hasMore={hasMore}
          loader={<Skeleton avatar active title={false} />}
          endMessage={!!enterprisesList.length && <Divider plain className={styles.footLoadMoreTip}>已经到底啦~</Divider>}
          scrollableTarget='scrollableDiv'
        >
          <List
            dataSource={enterprisesList}
            className={cs(styles.listWrap, styles[enterprisesList.length > 6 ? 'scrollbar' : ''])}
            renderItem={(item) => (
              <List.Item key={item.id} onClick={() => intoHandle(item)} className={styles.item}>
                <div className={cs(styles.titleBox)}>
                  <div className={styles.title}>{item.name}</div>
                </div>
                <IconFont iconHref='icon-ic_right_arrow' />
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>

    </Modal>
  );
};

export default ChangeTemplate;
