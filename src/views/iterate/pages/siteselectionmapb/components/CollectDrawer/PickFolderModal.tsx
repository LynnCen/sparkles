/**
 * @Description 选择文件夹弹窗
 */

import { Button, Checkbox, Input, Modal, Space } from 'antd';
import styles from './index.module.less';
import { FC, useEffect, useState } from 'react';
import IconFont from '@/common/components/IconFont';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { post } from '@/common/request';
import { getFavoriteList } from '@/common/api/siteselectionmap';
import { handleCollectOfFetch } from '@/common/api/siteselectionmap';
import { bigdataBtn } from '@/common/utils/bigdata';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { isArray } from '@lhb/func';
import { useContext } from 'react';
import { isResetContext } from '../../ts-config';

const PickFolderModal: FC<any> = ({
  open,
  clusterId, // 商圈ID
  spotId, // 点位ID
  // build, // true为加入收藏，false为取消收藏
  setOpen,
  setCollectStatus, // 收藏/取消收藏时更新状态
}) => {
  const [isAddFolder, setIsAddFolder] = useState<any>(false);
  const [selected, setSelected] = useState<CheckboxValueType[]>([]);
  const [addFolderName, setAddFolderName] = useState('');
  const [folderList, setFolderList] = useState<any>([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [repeatTip, setRepeatTip] = useState('');
  const [showSpotFlag, setShowSpotFlag] = useState(false);

  const { setCollectList }: any = useContext(isResetContext) || {};

  useEffect(() => {
    if (!open) return;
    getFolderList();
  }, [open]);

  /**
   * @description 获取文件夹列表
   */
  const getFolderList = async () => {
    const params: any = {};
    if (clusterId) params.clusterId = clusterId; // 商圈ID
    if (spotId) params.locationId = spotId; // 点位ID
    const { favoriteFolderListVOS: data, siteLocationFlag } = await getFavoriteList(params);
    setFolderList(isArray(data) ? data : []);
    setShowSpotFlag(siteLocationFlag);
    const targetSelected: Array<number> = [];
    data?.forEach((item: any) => {
      item.containFlag && (targetSelected.push(item.id));
    });
    setSelected(targetSelected);
  };

  /**
   * @description 选择文件夹复选框事件
   */
  const checkboxChange = (checkedValues: CheckboxValueType[]) => {
    setSelected(checkedValues);
  };

  /**
   * @description 添加收藏夹
   */
  const addFolder = async () => {
    if (!addFolderName || addFolderName.trim() === '') {
      V2Message.warning('请输入收藏夹名称');
      return;
    }
    try {
      // https://yapi.lanhanba.com/project/546/interface/api/70195
      await post('/clusterLocationFavor/saveFolder', { name: addFolderName }, { needHint: false });
      V2Message.success('添加成功');
      bigdataBtn('11fabca5-5061-4082-860c-ea9c480e3b76', '选址地图', '添加收藏夹', '添加收藏夹');
      closeAddFolder();
      getFolderList();
    } catch (err: any) {
      setRepeatTip(err.response?.data?.errMsg);
    }
  };
  // 取消添加收藏夹
  const closeAddFolder = () => {
    setIsAddFolder(false);
    setAddFolderName('');
    setRepeatTip('');
  };

  const onSubmit = () => {
    // if (!selected.length) {
    //   V2Message.warning('请选择收藏夹');
    //   return;
    // }
    const params: any = {
      // build: false,
      favourFolders: selected,
    };
    // 点位ID 与 商圈ID 有且只能有一个有效
    if (clusterId) {
      params.clusterId = clusterId;
    } else if (spotId) {
      params.locationId = spotId;
    }
    setConfirmLoading(true);
    // https://yapi.lanhanba.com/project/546/interface/api/70188
    // post('/clusterLocationFavor/build', { clusterId: null, locationId: null, build: true, favourFolders: selected }).then(() => {
    handleCollectOfFetch(params).then(() => {
      // V2Message.success(build ? '收藏成功' : '已取消收藏');
      V2Message.success(`操作成功`);
      setCollectStatus && setCollectStatus(!!selected.length);
      if (clusterId) {
        setCollectList?.((state) => {
          if (selected?.length) {
            return Array.from(new Set([...state, clusterId]));
          } else {
            return state?.filter((item) => item !== clusterId);
          }
        });
      }
      onCancel();
    }).finally(() => setConfirmLoading(false));
  };

  const onCancel = () => {
    setIsAddFolder(false);
    setSelected([]);
    setAddFolderName('');
    setOpen(false);
  };

  // TODO crq: 整体待联调，目前只是为了测试
  return (
    <Modal
      bodyStyle={{ paddingBottom: 0 }}
      title='选择收藏夹'
      open={open}
      onCancel={onCancel}
      onOk={onSubmit}
      confirmLoading={confirmLoading}
    >
      <div className={styles.pickerFolderWrap}>
        <div className={styles.folderListContent}>
          <Checkbox.Group style={{ width: '100%' }} value={selected} onChange={checkboxChange}>
            <Space direction='vertical'>
              { folderList.map((item, index) => {
                return <Checkbox key={index} value={item.id} >{item.name}（商圈{item.clusterNum}{ showSpotFlag && ` 点位${item.siteLocationNum}` }）</Checkbox>;
              }) }
            </Space>
          </Checkbox.Group>
        </div>
        <div className={styles.folderFooter}>
          { !isAddFolder ? (
            <div className={styles.addBtn} onClick={() => setIsAddFolder(true)}>
              <IconFont iconHref='iconic_add_xiangqing' className='mr-4 fs-14' />
              添加收藏夹
            </div>) : (
            <div className={styles.addEnterContent}>
              { repeatTip && <div className={styles.errorTip}><ExclamationCircleOutlined /> {repeatTip}</div> }
              <Input.Group compact className={styles.inputGroupContent}>
                <Input
                  className={styles.folderInput}
                  value={addFolderName}
                  onChange={e => {
                    setAddFolderName(e.target.value);
                    setRepeatTip('');
                  }}
                  showCount
                  maxLength={10}
                />
                <div className={styles.divider} />
                <Button type='link' size='small' className={styles.cancelBtn} onClick={closeAddFolder}>取消</Button>
                <Button type='link' size='small' className={styles.submitBtn} onClick={addFolder}>确定</Button>
              </Input.Group>
            </div>
          )
          }
        </div>
      </div>
    </Modal>
  );
};

export default PickFolderModal;
