/**
 * @Description 加盟商详情抽屉
 */

import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Spin, Button } from 'antd';
import V2Container from '@/common/components/Data/V2Container';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Operate from '@/common/components/Others/V2Operate';
import { getFranchiseeDetail } from '@/common/api/expandStore/franchisee';
import FranchiseeDetail from '@/common/components/business/ExpandStore/FranchiseeDetail';
import styles from './index.module.less';
// import cs from 'classnames';
import { refactorPermissions } from '@lhb/func';
import { useMethods } from '@lhb/hook';

const DetailDrawer: FC<any> = ({
  detailData,
  setDetailData,
  onSearch,
}) => {
  const detailRef: any = useRef(null);
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [detail, setDetail] = useState<any>({}); // 详情信息
  const [loading, setLoading] = useState<boolean>(false); // 加载中
  const [submitting, setSubmitting] = useState<boolean>(false); // 提交中
  const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false); // 是否开启编辑模式

  useEffect(() => {
    if (detailData.open && detailData.id) {
      getDetail();
    }
  }, [detailData]);

  const getDetail = async () => {
    setLoading(true);

    const { id } = detailData;
    getFranchiseeDetail({ id }).then((res) => {
      res && setDetail(res);
    }).finally(() => {
      setLoading(false);
    });
  };

  const methods = useMethods({
    /**
     * @description 点击编辑按钮，开启编辑模式
     */
    handleUpdate() {
      setIsUpdateMode(true);
    },
    /**
     * @description 提交编辑信息
     */
    confirmHandle() {
      (detailRef.current as any).confirmHandle();
    },
    /**
     * @description 取消编辑
     */
    cancelHandle() {
      setIsUpdateMode(false);
    },

    // 内部回调出来的刷新事件
    refresh() {
      getDetail(); // 详情接口刷新
      onSearch && onSearch(); // 外部刷新回调
    },

    onCloseDrawer() {
      setDetailData({
        visible: false
      });
      isUpdateMode && setIsUpdateMode(false);
    }
  });

  const operateList = useMemo(() => {
    if (isUpdateMode) return [];
    return refactorPermissions([{
      event: 'update',
      name: '编辑'
    }]).map(itm => ({ ...itm, type: 'primary' }));
  }, [isUpdateMode]);

  return (
    <V2Drawer
      bodyStyle={{
        padding: 0,
      }}
      open={detailData.open}
      destroyOnClose
      onClose={methods.onCloseDrawer}
    >
      <V2Container
        // 容器上下padding 0， 所以减去就是0
        style={{ height: '100vh' }}
        emitMainHeight={h => setMainHeight(h)}
        className={styles.container}
        extraContent={{
          top: (
            <V2Title
              text='加盟商详情'
              className={styles.containerTop}
              extra={
                <V2Operate operateList={operateList}
                  onClick={(btn) => methods[btn.func]()} />
              }
            />
          ),
          bottom: isUpdateMode ? <div className={styles.containerBottom}>
            <Button type='primary' loading={submitting} onClick={methods.confirmHandle} className='ml-12'>
              确定
            </Button>
            <Button onClick={methods.cancelHandle}>取消</Button>
          </div> : <></>
        }}
      >
        <div>
          <Spin spinning={loading}>
            <FranchiseeDetail
              ref={detailRef}
              mainHeight={mainHeight}
              detail={detail}
              isUpdateMode={isUpdateMode}
              setIsUpdateMode={setIsUpdateMode}
              style={{
                padding: '0 40px 24px',
              }}
              setSubmitting={setSubmitting}
              refresh={methods.refresh}
            />
          </Spin>
        </div>
      </V2Container>
    </V2Drawer>
  );
};

export default DetailDrawer;
