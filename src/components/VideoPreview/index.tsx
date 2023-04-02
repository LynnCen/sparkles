import React from 'react'
import { Modal, Button } from 'antd'
import {  EyeOutlined } from '@ant-design/icons'
import { useEffect, useState, useRef, LegacyRef } from 'react'
import VideoModal from './VideoModal'

import styles from './index.less'
import { useMemo } from 'react'


interface videoInfo {
  key: string,
  src: string,
}

interface previewInfo extends videoInfo {
}

interface VideoPreviewProps {
    videoList: videoInfo[],
    previews: previewInfo[],
}


const VideoPreview: React.FC<VideoPreviewProps> = (props) => {

  const [videoList, setVideoList] = useState<videoInfo[]>([])
  const [previewList, setPrivewList] = useState<previewInfo[]>([])

  const [currentKey, setCurrentKey] = useState<string>('')
  const currentVideo = useMemo<previewInfo>(() => {
    
    return previewList.filter(item => item.key === currentKey)[0]
  }, [currentKey]) 

  const mask = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)

  const [previewVisiable, setPrivewVisiable] = useState<boolean>(false)

  useEffect(() => {
    setVideoList(props.videoList)
    setPrivewList(props.previews)
  }, [])

  const handlePreviewShow = (key: string) => {
    const elc = card.current
    const elm = mask.current

    if (!elc || !elm) {
      return
    }

    elm.style.display = 'block'
    elc.style.cursor = 'pointer'
  }

  const handlePreviewHide = (key: string) => {
    const elm = mask.current
    
    if (elm) {
      elm.style.display = 'none'
    }
  }

  const handlePreviewClick = (e, key: string) => {  
    setCurrentKey(e.currentTarget.getAttribute('data-key'))
    setPrivewVisiable(true)
  }

  const handleLeft = (ref: React.RefObject<HTMLButtonElement>) => {
    
    
  }

  const handleRight = (ref: React.RefObject<HTMLButtonElement>) => {
  }

  return (
    <div className='vd-pre'>
        <div className="vd">
          {
            videoList.map(vd => {
              
              return (
                <div
                  key={vd.key}
                  data-key={vd.key}
                  ref={card}
                  onClick={(e) => handlePreviewClick(e, vd.key)}
                  onMouseEnter={() => handlePreviewShow(vd.key)}
                  onMouseMove={() => handlePreviewShow(vd.key)}
                  onMouseLeave={() => handlePreviewHide(vd.key)}
                  className={styles['vd-card']}
                >
                  <div 
                    ref={mask}
                    style={{display: 'none'}}
                    className={styles['mask']}
                  >             
                    <div>
                      <span><EyeOutlined /> 预览</span>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
        
        <VideoModal
          visible={previewVisiable}
          onCancel={() => setPrivewVisiable(false)}
          onLeft={handleLeft}
          onRight={handleRight}
        >
          {
            currentVideo && (
            <video 
              className={styles['video']}
              autoPlay
              controls
              src={currentVideo.src}
              width={800}
              height={600}
            ></video>
            )
          }
        </VideoModal>
    </div>
  )
}

export default VideoPreview