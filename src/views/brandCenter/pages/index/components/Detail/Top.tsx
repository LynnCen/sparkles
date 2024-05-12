/*
  品牌详情顶部信息
*/
import { FC, useEffect, useState } from 'react';
import { Image, message, Tooltip } from 'antd';
import styles from './index.module.less';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import cs from 'classnames';
import BrandTag from '../BrandTag';
import IconFont from '@/common/components/IconFont';
import copy from 'copy-to-clipboard';
import V2Operate from '@/common/components/Others/V2Operate';
import { useMethods } from '@lhb/hook';
import EditModal from '@/views/brandCenter/components/EditModal';
import { refactorPermissions } from '@lhb/func';
import BrandHonorTag from '../BrandHonorTag';
import { DownOutlined } from '@ant-design/icons';
import DeleteModal from './DeleteModal';

const detailItemCommon = {
  className: styles.customItem,
  valueStyle: {
    fontSize: '18px',
    fontWeight: 'bold'
  }
};
const Top: FC<any> = ({
  detail,
  getDetail,
  gainHonor,
  honorRankInfo,
  permissions,
  onReset,
  setOpen,
  onRefresh
}) => {
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [isToolTipShow, setIsToolTipShow] = useState<boolean>(false);
  const [detailTest, setDetailTest] = useState('');
  const levelNames = detail && detail.level && detail.level.includes('[') ? JSON.parse(detail.level) : [];
  const labelNames = detail && detail.label && detail.label.includes('[') ? JSON.parse(detail.label) : [];
  // const logoUrl = (detail && detail.logo) ? JSON.parse(detail.logo).url : '';
  const logoUrl = detail?.logo || '';
  useEffect(() => {
    // TODO：测试表现形式
    const industryInit = () => {
      let industryNames = '';
      // 生成包含所有的产业的字符串
      if (detail?.industryList) {
        detail.industryList.forEach((item, index) => {
          if (item.oneIndustryName) {
            industryNames += item.oneIndustryName;
            industryNames += ' > ';
          }
          if (item.twoIndustryName) {
            industryNames += item.twoIndustryName;
            item.threeIndustryName ? industryNames += ' > ' : '';
          }
          if (item.threeIndustryName) {
            industryNames += item.threeIndustryName;
          }
          if (index + 1 !== detail.industryList.length) {
            industryNames += '、';
          }
        });
        // 控制所属产业悬浮提示是否开启
        if (detail.industryList.length >= 3) {
          setIsToolTipShow(true);
        } else {
          setIsToolTipShow(false);
        }
      }
      setDetailTest(industryNames);
    };
    industryInit();
  }, [detail]);
  const defaultImg = 'https://staticres.linhuiba.com/project-custom/saas-manage/img/no-image.png';
  const methods = useMethods({
    handleUpdate() {
      setEditModalVisible(true);
    },
    handleDelete() {
      setDeleteModalVisible(true);
    },
    // 因为附件和门店照片会返回id，所以直接刷新即可
    onOK() {
      getDetail();
      onReset();
    },
    onDelete() {
      setOpen(false);
      onRefresh();
    }
  });
  return (
    <>
      {
        !detail ? <></>
          : <div className={styles.detailTop}>
            <div className={styles.detailTopLeft}>
              <Image width={162} height={130} src={logoUrl || defaultImg} preview={!!logoUrl}/>
              <meta name='referrer' content='no-referrer'></meta>
            </div>
            <div className={styles.detailTopRight}>
              <div className={styles.nameRow}>
                <span className={cs(styles.name, 'mr-8')}>{detail?.name}</span>
                {levelNames.map((lv, idx) => (<BrandTag key={idx} levelName={lv} className='mr-5' isLevel/>))}
                {detail?.typeName && <BrandTag levelName={detail?.typeName} className='mr-5'/>}
                {labelNames.map((lbl, idx) => (<BrandTag key={idx} levelName={lbl} className='mr-5'/>))}
                {!!detail.businessIndustry && <BrandTag levelName={`${detail.businessIndustry.parentName || ''}-${detail.businessIndustry.name || ''}`} className='mr-5'/>}
                {!!honorRankInfo?.length && <BrandHonorTag className='mr-5' gainHonor={gainHonor} honorRankInfo={honorRankInfo}>{honorRankInfo[0].name}<DownOutlined className={styles.honorIcon} /></BrandHonorTag>}
                <div style={{ marginLeft: 'auto' }}>
                  <V2Operate
                    operateList={refactorPermissions(permissions?.map(item => {
                      if (item.event === 'brandLibrary:update') {
                        item.type = 'primary'; // 编辑时蓝色按钮
                      }
                      if (item.event === 'brandLibrary:delete') {
                        item.type = 'default'; // 删除时白色按钮
                      }
                      return item;
                    }) || [])}
                    onClick={(btns: { func: string | number }) => methods[btns.func]()}/>
                </div>
              </div>
              {!!detail?.industryList && <div className={cs('mt-6 fs-14', styles.industryName)}>
                <V2DetailGroup direction='horizontal' labelLength={-1}>
                  <Tooltip
                    trigger={isToolTipShow ? 'hover' : 'contextMenu'}
                    placement='top'
                    title={detailTest.replace(/、/g, '\n')}
                    overlayInnerStyle={{ whiteSpace: 'pre-line' }}
                    arrowPointAtCenter={true} >
                    <V2DetailItem
                      rows={1}
                      value={detailTest}
                      valueStyle={{ color: '#666' }}
                      tooltipConfig={{
                        overlayInnerStyle: { display: 'none' },
                        overlayStyle: { display: 'none' },
                      }}
                      className={styles.industryNameTest} />
                  </Tooltip>
                </V2DetailGroup>
              </div>}
              <V2DetailGroup direction='vertical' moduleType='easy' block style={{ paddingBottom: 2, borderBottom: 0, borderTop: 'solid 1px #eee', marginTop: 12, marginBottom: 16 }}>
                <V2DetailItem label='品牌ID' value={detail?.id} {...detailItemCommon} rightSlot={{
                  icon: <IconFont iconHref='pc-common-icon-ic_copy'/>,
                  onIconClick: () => {
                    message.success('已复制');
                    copy(detail?.id);
                  }
                }}/>
                <V2DetailItem label='成立时间' value={detail?.brandEstablishTime ? (
                  detail.brandEstablishTime.indexOf('年') > -1 ? detail.brandEstablishTime : detail.brandEstablishTime + '年'
                ) : undefined} {...detailItemCommon}/>
                <V2DetailItem label='发源地' value={detail?.cityName} {...detailItemCommon}/>
                <V2DetailItem label='所属公司' value={detail?.companyName} {...detailItemCommon}/>
                <V2DetailItem label='门店数量' value={detail?.shopCount} {...detailItemCommon}/>
              </V2DetailGroup>
            </div>
          </div>
      }
      <EditModal
        visible={editModalVisible}
        setVisible={setEditModalVisible}
        isEdit
        localShouldPost
        brandId={detail?.id}
        onOK={methods.onOK}
      />
      <DeleteModal
        id={detail?.id}
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onOK={methods.onDelete}
      />
    </>
  );
};

export default Top;
