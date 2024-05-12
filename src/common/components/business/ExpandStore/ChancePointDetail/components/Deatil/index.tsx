/**
 * @Description 机会点详情页面
 * 1109 标准版数据迁移引用该组件，添加参数 hideOperate 隐藏顶部导入编辑等相关按钮
 */

import { FC, useRef, useEffect, useMemo, useState } from 'react';

import Title from './components/Title';
import V2Container from '@/common/components/Data/V2Container';
import V2Drawer from '@/common/components/Feedback/V2Drawer';

import styles from './index.module.less';
import DetailInfo from './components/DeatilInfo';
import { Spin, message } from 'antd';
import { getChancePointDetail } from '@/common/api/expandStore/chancepoint';
import { isNotEmptyAny, isArray, refactorPermissions } from '@lhb/func';
import { ChanceDetailPermission, IS_DETAIL_EDIT_CHANCE } from '@/common/components/business/ExpandStore/ts-config';

/** 机会点详情信息抽屉 */
const ChancePointDteailDrawer: FC<any> = ({
  id,
  open,
  setOpen,
  setFormDrawerData, // 编辑
  refreshDetail, // 刷新机会点详情
  onSearch, // 表单支持直接编辑的时候时候返回刷新列表
  updateHandle, // 上传文件更新
  refreshOuter, // 外部触发刷新
  hideOperate = false, // 隐藏操作按钮
}) => {
  const chanceFormRef = useRef(null);
  const titleHeightRef = useRef(0);
  const [hintStr, setHintStr] = useState<string>('');

  useEffect(() => {
    open && getDetail();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, refreshDetail]);

  const [detail, setDetail] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true); // 加载中


  const getDetail = async() => {
    setLoading(true);
    try {
      const data = await getChancePointDetail({ id: id });
      setDetail(data);
      setLoading(false);
    } catch (error) {
      message.error('请稍后再试！');
      setLoading(false);
    }
  };

  /**
   * @description 提交审批时保存机会点
   */
  const saveHandle = (needCheck: boolean, cb: Function) => {
    // 调用保存机会点
    (chanceFormRef?.current as any).saveChance(needCheck, cb);
  };

  /**
   * @description 是否可编辑机会点详情表单
   */
  const canEditForm = useMemo(() => {
    // 详情为空 hideOperate手动控制不可以编辑
    if (!isNotEmptyAny(detail) || hideOperate) return false;

    const { permissions, supportDirectApproval } = detail;
    // 功能未启用、或者不支持审批流
    if (!IS_DETAIL_EDIT_CHANCE || supportDirectApproval !== 1 || !isArray(permissions)) return false;

    const refactorPerms = refactorPermissions(permissions);

    // 机会点详情同时有edit和submitApproval权限时
    const editTarget = refactorPerms.find((itm: any) => (itm.event === ChanceDetailPermission.Edit));
    const approvalTarget = refactorPerms.find((itm: any) => (itm.event === ChanceDetailPermission.SubmitApprove));
    return !!editTarget && !!approvalTarget;
  }, [detail]);

  return (
    <V2Drawer
      open={open}
      onClose={() => setOpen(false)}
      destroyOnClose
      className={styles.chancePointDrawer}
    >
      <Spin spinning={loading}>
        <V2Container
          extraContent={{
            top: <Title
              titleHeightRef={titleHeightRef}
              detail={detail}
              hintStr={hintStr}
              setFormDrawerData={setFormDrawerData}
              canEditForm={canEditForm}
              onClose={() => setOpen(false)}
              updateHandle={updateHandle}
              refreshOuter={refreshOuter}
              saveHandle={saveHandle}
              hideOperate={hideOperate}
            />
          }}
          style={{ height: '100vh' }}
        >
          <DetailInfo
            ref={chanceFormRef}
            titleHeightRef={titleHeightRef}
            detail={detail}
            canEditForm={canEditForm}
            onSearch={onSearch}
            setHintStr={setHintStr}
            updateHandle={updateHandle}
          />
          {/* <div className={styles.detailContainer}>
            <Spin spinning={loading}>
              <Title
                topRef={topRef}
                detail={detail}
                hintStr={hintStr}
                setFormDrawerData={setFormDrawerData}
                canEditForm={canEditForm}
                onClose={() => setOpen(false)}
                updateHandle={updateHandle}
                refreshOuter={refreshOuter}
                saveHandle={saveHandle}
                hideOperate={hideOperate}
              />

            </Spin>
          </div> */}
        </V2Container>
      </Spin>
    </V2Drawer>
  );
};

export default ChancePointDteailDrawer;
