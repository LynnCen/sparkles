/**
 * @Description 会话详情
 */
import { Avatar, List, Image, Tag, Spin, Space } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { dateFns, noop, replaceEmpty, isMobile, matchQuery, refactorPermissions, deepCopy, floorKeep, downloadFile } from '@lhb/func';
import { get, post } from '@/common/request';
import { Sources } from '@/views/locxx/pages/simulatedResponse/index';
import styles from './index.module.less';
import cs from 'classnames';
import V2Title from '@/common/components/Feedback/V2Title';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import FormSearch from '@/common/components/Form/SearchForm';
import V2Pagination from '@/common/components/Data/V2Pagination';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2Tag from '@/common/components/Data/V2Tag';
import SimulateModal from './SimulateModal';
import SimulateBtns from './SimulateBtns';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { getNoNavUrl } from '@/common/utils/ways';
import V2Operate from '@/common/components/Others/V2Operate';
import AddFollowRecord from '../../../demandManagement/components/AddFollowRecord';
import FollowRecordDetail from '../../../demandManagement/components/FollowRecordDetail';
import IconFont from '@/common/components/Base/IconFont';
import BenzAMRRecorder from 'benz-amr-recorder';


enum BusinessID {
  /** 定制消息-资源信息卡片 */
  typeCustomResourceCard = 'custom_resource_card',
  /** 定制消息-需求信息卡片 */
  typeCustomRequirementCard = 'custom_requirement_card',
  /** 定制消息-留下联系方式 */
  typeCustomLeaveContactInfo = 'custom_leave_contact_info',
  /** 定制消息-定位信息卡片 */
  typeCustomLocationCard = 'custom_location_card',
  /** 定制消息-交换手机号 */
  typeCustomExchangeMobileCard = 'custom_exchange_mobile_card',
  /** 定制消息-展示手机号 */
  typeCustomMobileCard = 'custom_mobile_card',
  /** 定制消息-消息提示 */
  typeCustomMsaageTip = 'custom_message_tip',
  /** 定制消息-语音消息提示 */
  typeCustomRecordCard = 'custom_sound_record_card',
  /** 定制消息-落位图卡片 */
  typeCustomDropMapCard = 'custom_drop_map_card',

}

const userSourceMap = {
  [Sources.LOCXX]: { label: '品牌', color: 'lightBlue' },
  [Sources.PMS]: { label: '物业', color: 'orange' },
  [Sources.LOCATION_SPACE]: { label: '商业直租', color: 'cyan' },
};

/**
 * @description: 会话详情
 * @param {*} id 会话记录id
 * @return {*}
 */
const SessionDetailDrawer:FC<{ id: number | null, onRefresh?: () => void, open?: boolean }> = ({ id, onRefresh, open }) => {

  const detailRef: any = useRef();
  const timerRef:any = useRef(null);
  const audioRef:any = useRef<HTMLAudioElement>(null);
  const addFollowRecordRef = useRef<any>(null);
  const followRecordDetailRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalSetData, setModalSetData] = useState<any>({
    visible: false,
    /** 来源：pms、locxx，以哪个身份发起会话  */
    source: null,
    mobile: null,
    tenantId: null,
    contactId: null,
  });
  const [data, setData] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useState<any>({
    page: 1,
    size: 20,
    keyword: '',
    toAccount: '',
    fromAccount: '',
  });
  const [record, setRecord] = useState<any>({});
  const [total, setTotal] = useState(0);

  const [currentAmrRecorder, setCurrentAmrRecorder] = useState<any>();

  useEffect(() => {
    methods.getRecordDetail();
  }, [id]);
  useEffect(() => {
    methods.getSessionDetail();
  }, [searchParams, record]);

  useEffect(() => {
    if (!open) { // 如果弹出框关闭，则执行语音关闭
      methods.handleAudioClose();
    }
  }, [open]);

  const methods = useMethods({
    // 获取会话详情数据
    getRecordDetail() {
      if (!id) {
        return;
      }
      // https://yapi.lanhanba.com/project/319/interface/api/59632
      get('/im/chatDetail', { id }, { needHit: true, proxyApi: '/pms-api', mockId: 319, isMock: false }).then((response) => {
        // 获取详情时，重置筛选
        setSearchParams(state => ({ ...state, page: 1, keyword: '', toAccount: response.secondAccount, fromAccount: response.firstAccount }));
        setRecord(response);
        // setTimeout(() => methods.getSessionDetail());
      }).finally(() => {
      });
    },
    onSearch(val) {
      setSearchParams({ ...searchParams, keyword: val.keyword, page: 1 });
      // setTimeout(() => methods.getSessionDetail());
    },
    getSessionDetail() {
      if (!searchParams.toAccount || !searchParams.fromAccount) {
        return;
      }
      setLoading(true);
      // https://yapi.lanhanba.com/project/319/interface/api/54613
      get('/im/chatLogs/detailList', searchParams, { needHit: true, proxyApi: '/pms-api' }).then((response) => {
        setData((response.objectList || []).map((item) => {
          if (record.firstAccount === item.fromAccount) { // 代表他是模拟用户1发出的消息，否则就是2
            item.align = 'left';
          } else {
            item.align = 'right';
          }
          item.showRecordingContent = false; // 是否展示转录内容
          item.play = false; // 播放动图使用
          return item;
        }));
        setTotal(response.totalNum);
        setTimeout(() => {
          const targetDom = detailRef.current.querySelector('.im-list-content');
          targetDom.scrollTop = targetDom.scrollHeight;
        });
      }).finally(() => {
        setLoading(false);
      });
    },
    showSimulateModal(userRole: number) {
      const tenantId = userRole === 1 ? record.firstTenantId : record.secondTenantId;
      const virtualAccount = userRole === 1 ? record.firstAccount : record.secondAccount;
      if (!tenantId) {
        V2Message.warning('租户id不存在，请确认用户是否正确或联系管理员');
      } else {
        setModalSetData(state => ({
          ...state,
          /** 来源：pms、locxx、location商业直租，以哪个身份发起会话  */
          source: userRole === 1 ? record.firstUserSource : record.secondUserSource,
          mobile: userRole === 1 ? record.firstMobile : record.secondMobile,
          tenantId: tenantId,
          contactId: userRole === 1 ? record.secondAccount : record.firstAccount, // 需要对方的
          visible: true,
          virtualAccount,
        }));
      }
    },
    closeModal() {
      setModalSetData(state => ({ ...state, visible: false }));
      methods.getSessionDetail();
    },
    // 点击自定义卡片
    clickCustomCard({ type, data }: { type: BusinessID, data: any }) {
      switch (type) {
        case BusinessID.typeCustomRequirementCard:
          data.requirementId && methods.viewRequirement(data.requirementId);
          break;
        default:
          break;
      }
    },
    // 查看需求
    viewRequirement(id) {
      id && window.open(`/locxx/demandManagement?requirementId=${id}`);
    },
    // 打开添加跟进记录的弹窗
    addFollowRecord(data) {
      data.id && addFollowRecordRef.current?.init(data);
    },
    // 打开跟进记录详情的弹窗
    openFollowRecordDetail() {
      id && followRecordDetailRef.current?.init(id);
    },
    handleAudioClose () { // 关闭语音播报
      audioRef.current?.pause(); // audio 暂停
      currentAmrRecorder?.stop(); // amr 暂停
    },
    handleAudioPlay(record:any) {
      this.handleAudioClose();

      if (record.customContent.customMessageRecording.fileType === 'wav') {
        if (audioRef.current) {
        // 先把之前的定时器清除
          clearTimeout(timerRef.current);
          console.log(`audioRef.current = `, audioRef.current);
          const isPlaying = !audioRef.current.paused;

          const onPlay = () => {
            audioRef.current.src = record.customContent.customMessageRecording.url;
            const playPromise = audioRef.current?.play();

            const _data = deepCopy(data);
            _data.map((it:any) => {
              if (it.id === record.id) {
                it.play = true;
              } else {
                it.play = false;
              }
            });
            setData(_data);

            if (playPromise) {
              const pauseTime:number = Number(floorKeep(record.customContent.customMessageRecording.time, 1000, 3, 0)) || 1000;
              playPromise.then(() => {
              // 设定播放时长
                timerRef.current = setTimeout(() => {
                  audioRef.current?.pause();
                  const _data = deepCopy(data);
                  _data.map((it:any) => {
                    it.play = false;
                  });
                  setData(_data);
                }, pauseTime);
              }).catch((error) => {
                console.log('播放失败', error);
              });
            }
          };

          if (isPlaying) { // 如果在播放就暂停
            audioRef.current?.pause();
            const _data = deepCopy(data);
            _data.map((it:any) => {
              it.play = false;
            });
            setData(_data);
            // 如果播放地址不一致，代表点击的语音和播放的不是同一条，播放新的语音
            if (audioRef.current.src !== record.customContent.customMessageRecording.url) {
              onPlay();
            }
          } else { // 否则走原逻辑，直接播放
            onPlay();
          }
        }
      } else if (record.customContent.customMessageRecording.fileType === 'amr') {
        const amrRecorder = new BenzAMRRecorder();

        amrRecorder.initWithUrl(record.customContent.customMessageRecording.url).then(function() {
          setCurrentAmrRecorder(amrRecorder); // 保存当前amr变量
          const _data = deepCopy(data);
          _data.map((it:any) => {
            if (it.id === record.id) {
              it.play = true;
            } else {
              it.play = false;
            }
          });
          setData(_data);

          amrRecorder.play();
        });
        amrRecorder.onEnded(function() {
          const _data = deepCopy(data);
          _data.map((it:any) => {
            it.play = false;
          });
          setData(_data);
        });
      }
    },
    handleTranslate(record:any) {
      if (record.recordingContent) {
        const _data = deepCopy(data);
        _data.map((it:any) => {
          if (it.id === record.id) {
            it.showRecordingContent = true;
          }
        });
        setData(_data);
      } else {
        const params = {
          fileType: record.customContent.customMessageRecording.fileType,
          audioDuration: record.customContent.customMessageRecording.time,
          url: record.customContent.customMessageRecording.url,
          msgKey: record.id,
        };
        // https://yapi.lanhanba.com/project/319/interface/api/67570
        post('/im/tool/asr60sByUrl', params, { needHit: true, proxyApi: '/pms-api', needCancel: false }).then(({ result }) => {
          const _data = deepCopy(data);
          _data.map((it:any) => {
            if (it.id === record.id) {
              it.showRecordingContent = true;
              it.recordingContent = replaceEmpty(result);
            }
          });
          setData(_data);
        });
      }
    },
  });

  const renderTitle = (item) => {
    const comps = [
      <span key='comps-1' className={styles.spanText}>{ item.fromAccountName }</span>,
      <span key='comps-2' className={styles.spanText}>{ item.createdAt }</span>
    ];
    if (item.simulateReply) {
      if (item.align === 'right') {
        comps.unshift(<V2Tag key='comps-3' color='cyan'>模拟</V2Tag>);
      } else {
        comps.push(<V2Tag key='comps-4' color='cyan'>模拟</V2Tag>);
      }
    }
    return comps;
  };

  // 渲染文本内容
  const renderTextContent = (item) => {
    return <div className={styles.customInfoWrap}>
      <div className={styles.customInfo}>
        {Array.isArray(item.msgContent) && item.msgContent.length ? item.msgContent.map(it => <p>{it}</p>) : replaceEmpty(item.msgContent)}
      </div>
    </div>;
  };

  // 渲染自定义消息内容
  const renderCustomContent = (item) => {
    // 语音类型不按文字展示
    const textContentOtherType = [BusinessID.typeCustomRecordCard];
    if (item.msgType === 'TIMCustomElem' && Array.isArray(item.msgContent) && item.msgContent.length && !textContentOtherType.includes(item.customContent?.businessID)) {
      return renderTextContent(item);
    }

    if (item.customContent.businessID === BusinessID.typeCustomRequirementCard) { // 需求类型数据
      return <div className={cs(styles.customInfoWrap, styles.customRequirementCard)}>
        <div className={styles.customInfo} onClick={() => methods.clickCustomCard({ type: item.customContent?.businessID, data: item.customContent.requirementCard })}>
          <p>需求名称：{ item.customContent.requirementCard?.name }</p>
          <p>类型：{ item.customContent.requirementCard?.tags?.map((item, index) => (<Tag color='#006AFF' key={index}>{item.name}</Tag>)) }</p>
          { item.customContent.requirementCard?.descriptions?.map((item, index) => (
            <p key={index}>{ item.label }：{item.values?.join()}</p>
          )) }
          { item.customContent.requirementCard?.deadline && <p>倒计时：{dateFns.diffDayBetween(dateFns.currentTime(), item.customContent.requirementCard?.deadline)}天</p> }
        </div>
      </div>;
    } else if (item.customContent?.businessID === BusinessID.typeCustomResourceCard) { // 资源类型数据
      return <div className={styles.customInfoWrap}>
        <div className={styles.customInfo}>
          <p>点位名称：{ item.customContent.resourceCard?.name }</p>
          { !!item.customContent.resourceCard?.tags.length && <p>标签：{ item.customContent.resourceCard?.tags?.map((item, index) => (<Tag color='#006AFF' key={index}>{item.name}</Tag>)) }</p> }
          <p>价格：{ item.customContent.resourceCard?.price }</p>
          <p>描述：{ item.customContent.resourceCard?.descriptions?.join('') }</p>
        </div>
      </div>;
    } else if (item.customContent?.businessID === BusinessID.typeCustomLeaveContactInfo) { // 留下联系方式消息
      return <div className={styles.customInfoWrap}>
        <div className={styles.customInfo}>
          <p>{ item.customContent.leaveContactInfo?.title }</p>
        </div>
      </div>;
    } else if (item.customContent?.businessID === BusinessID.typeCustomLocationCard) { // 点位消息
      return <div className={styles.customInfoWrap}>
        <div className={styles.customInfo}>
          <p>{ item?.customContent?.locationCard?.name}</p>
          <p>{ item?.customContent?.locationCard?.address}</p>
          <Image width={100} src={ item?.customContent?.locationCard?.img} preview={false}/>
        </div>
      </div>;
    } else if (item.customContent?.businessID === BusinessID.typeCustomRecordCard) { // 语音消息

      const checkNumberRange = (number:number|string):string => {
        const _number = Number(number);
        if (_number >= 0 && _number < 20) {
          return 'small';
        } else if (_number >= 20 && _number < 40) {
          return 'middle';
        } else if (_number >= 40 && _number < 60) {
          return 'large';
        } else {
          return 'large';
        }
      };

      const recordSize:string = checkNumberRange(item.customContent.customMessageRecording.time || 0);

      return <div className={cs(styles.customInfoWrap, styles.customRecordCard, styles[item.align])}>
        <div className={cs(styles.customInfo, styles[recordSize])} onClick={() => methods.handleAudioPlay(item)}>
          <Space>
            {item.align === 'right' && <span>{item.customContent.customMessageRecording.time}‘’</span>}
            {item.play ? <div className={styles[item.align === 'left' ? 'playLeft' : 'playRight']}/> : <IconFont
              iconHref={'icon-ic_yuyin'}
              className={cs([item.align === 'right' && styles.iconRight])}
            /> }
            {item.align === 'left' && <span>{item.customContent.customMessageRecording.time}‘’</span>}
          </Space>
        </div>
        <div>
          { item.showRecordingContent ? <div className={styles.translateText}>{replaceEmpty(item.recordingContent)}</div> : <div className={styles.translateBtn} onClick={() => methods.handleTranslate(item)}>转文字</div>}
        </div>
      </div>;
    } else if (item.customContent?.businessID === BusinessID.typeCustomDropMapCard) { // 落位图
      return <div className={styles.customInfoWrap}>
        <div className={styles.dropMapInfo}>
          {Array.isArray(item?.customContent?.customDropMapCard?.files) && item?.customContent?.customDropMapCard?.files.length && (item?.customContent?.customDropMapCard?.files[0]?.name?.split('.').pop().toLowerCase() === 'pdf' ? <V2DetailItem
            className={styles.fileItems}
            type='files'
            fileDownloadHide
            filesBtnExtra={[{ content: '下载', onClick: onDownload }]}
            assets={[{ name: item?.customContent?.customDropMapCard?.files[0]?.name, url: item?.customContent?.customDropMapCard?.files[0]?.url }]} /> : <Image width={200} src={ `${item?.customContent?.customDropMapCard?.files[0]?.url}`} />)}
          <div className={styles.dropMapContent}>
            <span className={styles.name}>{item?.customContent?.customDropMapCard?.name || ''}</span>
            <span className={styles.floor}>{item?.customContent?.customDropMapCard?.floor || ''}</span>
          </div>
        </div>
      </div>;
    }
    return '-';
  };

  // 显示是否切换手机模式
  const renderCheckMobile = () => {
    // 非手机模式不展示；已经是全屏也不展示
    if (!isMobile() || matchQuery(location.search, 'source')) {
      return null;
    }
    // 切换为手机模式
    const handleClick = () => {
      location.replace(getNoNavUrl(window.location.href));
    };
    return <div className='color-primary'onClick={handleClick}>检测到当前为手机端，点我切换手机样式</div>;
  };

  /** 右上角按钮 */
  const FollowAboutRender = () => {
    if (isMobile()) return <></>;
    const operateList = [
      {
        name: '跟进记录', // 必填
        event: 'openFollowRecordDetail', // 必填
        type: 'primary', //  非必填，默认为link
      },
      {
        name: '写跟进',
        event: 'addFollowRecord',
        type: 'primary',
      },

    ];
    // 移动端不显示按钮

    return <>
      <V2Operate operateList={refactorPermissions(operateList)} onClick={(btn: any) => methods[btn.event](record)} />
    </>;
  };

  const onDownload = (item) => {
    downloadFile({
      name: item.name,
      downloadUrl: item.url,
      useBlob: true
    }); // 腾讯云 使用 blob 方式下载
  };
  return (
    <>
      <audio
        controls
        preload='auto'
        ref={audioRef}
        style={{ display: 'none' }}
      />
      <div ref={detailRef} className={styles.detailContent}>
        <V2Title className='mb-16'>
          会话详情
          {matchQuery(location.search, 'source') && <div className='color-primary fn-12 ml-10'onClick={() => history.back()}>返回</div>}
        </V2Title>
        {renderCheckMobile()}
        <FormSearch onSearch={methods.onSearch} labelLength={3} rightOperate={FollowAboutRender()}>
          <V2FormInput label='搜索' name='keyword' placeholder='搜索会话内容'/>
        </FormSearch>
        <Spin spinning={loading} wrapperClassName={styles.spinWrapper}>
          <List
            className={cs(styles.listContent, 'im-list-content')}
            dataSource={data}
            renderItem={(item) => (
              <List.Item key={item.id} className={cs([item.align === 'right' && styles.listRight])}>
                <List.Item.Meta
                  avatar={<div className={cs(styles.avatarWrapper, 'ct')}>
                    <Avatar
                      size='large'
                      src={item.fromAccountAvatar || 'https://middle-file.linhuiba.com/FhPm8_cOdT5IoFepNwz2Ugngs6id'}
                      className={cs(styles.avatar, item.requirementId ? styles.linkable : '')}
                      onClick={() => item.requirementId ? methods.viewRequirement(item.requirementId) : noop()}
                    />
                    {!!item.userSource && <V2Tag
                      key='comps-3'
                      color={userSourceMap[item.userSource]?.color}
                      className='db mt-4'
                      style={{ marginRight: 0 }}>
                      { userSourceMap[item.userSource]?.label || '-' }
                    </V2Tag>}
                  </div>}
                  title={<div className={styles.listTitle}>{renderTitle(item)}</div>}
                  description={(
                    <div className={styles.listDescription}>
                      {/* 文本消息或者 自定义消息且接口返回了转换后的文本 */}
                      {item.msgType === 'TIMTextElem' && renderTextContent(item)}
                      {/* 图片类型数据 */}
                      {
                        item.msgType === 'TIMImageElem' && (
                          <div className={styles.customInfoWrap}>
                            <div>
                              <Image.PreviewGroup>
                                { item.msgContent?.map((item, index) => (<Image width={100} key={index} src={item} />)) }
                              </Image.PreviewGroup>
                            </div>
                          </div>
                        )
                      }
                      {/* 文件类型数据 */}
                      {
                        item.msgType === 'TIMFileElem' && (
                          <div className={styles.customInfoWrap}>
                            <div>
                              <V2DetailItem
                                className={styles.fileItems}
                                type='files'
                                fileDownloadHide
                                filesBtnExtra={[{ content: '下载', onClick: onDownload }]}
                                assets={[{ name: item?.msgObject.fileName, url: item?.msgObject?.url }]} />
                            </div>
                          </div>
                        )
                      }
                      {/* 自定义模块 */}
                      {item.msgType === 'TIMCustomElem' && renderCustomContent(item)}
                    </div>
                  )}
                />
              </List.Item>
            )}
          />
          <V2Pagination
            total={total}
            current={searchParams.page}
            pageSize={searchParams.size}
            onShowSizeChange={(current, size) => setSearchParams({ ...searchParams, page: current, size })}
            onChange={(page, size) => setSearchParams({ ...searchParams, page, size })}
          />
          <SimulateBtns showSimulateModal={methods.showSimulateModal}/>
        </Spin>
      </div>
      <SimulateModal data={modalSetData} onClose={methods.closeModal}/>
      {/* 添加跟进记录 */}
      <AddFollowRecord ref={addFollowRecordRef} provideFor='sessionRecord' onRefresh={onRefresh}/>
      {/* 跟进记录详情 */}
      <FollowRecordDetail ref={followRecordDetailRef} provideFor='sessionRecord'/>
    </>
  );
};

export default SessionDetailDrawer;
