import React, { useEffect, useState, useRef, ReactNode, useMemo } from 'react';
import {  EyeOutlined } from '@ant-design/icons'
import MediaModal from './MediaModal';
import styles from './index.less'
import FFmpeg from '@ffmpeg/ffmpeg/dist/ffmpeg.min.js'
import { Spin } from 'antd';

export interface SourceInfo {
  id: string,
  url: string,
  key: string,
  originWidth: number,
  originHeight: number,
  width?: number,
  height?: number,
  posterUrl?: string,
  arrayBuffer?: ArrayBuffer,
  stream?: ReadableStream,
  type?: string,
  format?: string
}

interface MediaPreviewProps {
  sourceList: SourceInfo[],
  type: string,
  onPreviewClick?: (ref: React.RefObject<HTMLVideoElement>) => void
}

type Media = HTMLImageElement | HTMLVideoElement

const MediaPreview: React.FC<MediaPreviewProps> = (props) => {
  const [previewVisiable, setPrivewVisiable] = useState<boolean>(false)

  const [sourceList, setSourceList] = useState<SourceInfo[]>([])
  
  const [currentKey, setCurrentKey] = useState<string>('1')

  const [zoomUnit, setZoomUniy] = useState<number>(1)
  const [step, setStep] = useState<number>(0.1) 
  const [currentIndex, setCurrentIndex] = useState<number>(1)
  const [count, setCount] = useState<number>(0)

  const [videoSrc, setVideoSrc] = useState<any>()
  const [movSrc, setMovSrc] = useState<any>()

  const [videoUrls, setVideoUrls] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const createMediaSource = async ({ arrayBuffer, type, format}) => {
    if (/mov/i.test(format)) {
      const name = 'mov_file'
      const { createFFmpeg, fetchFile  } = FFmpeg
      const ffmpeg = createFFmpeg({ 
        log: true,
        mainName: 'main',
        corePath: 'https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js'
      });
      try {
        await ffmpeg.load()
        ffmpeg.FS('writeFile', name, await fetchFile(new Blob([arrayBuffer])));
        await ffmpeg.run('-i', name,  'output.mp4')
        const data = ffmpeg.FS('readFile', 'output.mp4');
        const url = window.URL.createObjectURL(
          new Blob([data.buffer], { type: 'video/mp4' })
        )
        return url
      } catch (error) {
        console.log(error, 'flush here');
        return ''
      }
    } 
    
    const file = new Blob([arrayBuffer], {type})
    const url = window.URL.createObjectURL(file)
    return url
  }

  const currentSource = useMemo<SourceInfo>(() => {
    const current = sourceList.filter(
      source => 
        source.key.slice(1, source.key.length) === currentKey
    )

    return current[0]
  }, [currentKey, sourceList])

  // video only
  useEffect(() => {
    
    if (props.type === 'video') { 
      setVideoSrc(videoUrls[currentIndex - 1])
    }
  }, [videoUrls, currentIndex, sourceList])
  
  const mask = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)
  
  const mediaRef = useRef<Media>(null)

  useEffect(() => {
    setCount(props.sourceList.length)
    setSourceList(props.sourceList)

    if (props.type === 'video') {
      convertVideoUrls(props.sourceList)
    }
  }, [props.type, props.sourceList])

  const convertVideoUrls = async (sourceList: SourceInfo[]) => {
    
    if (sourceList.length === 0) {
      return;
    }
    setLoading(true)
    
    for (const source of sourceList) {
      if (!source.stream) {
        continue
      }

      // @ts-ignore
      const url = await createMediaSource(source)
      setVideoUrls(state => [...state, url])
    }
    setLoading(false)
  }


  const handlePreviewShow = (id: string) => {
    const elc = document.getElementById(id)
    const elm = document.getElementById(id + 'mask')

    if (!elc || !elm) {
      return
    }

    elm.style.display = 'block'
    elc.style.cursor = 'pointer'
  }

  const handlePreviewHide = (id: string) => {
    const elm = document.getElementById(id + 'mask')
    
    if (elm) {
      elm.style.display = 'none'
    }
  }

  const handlePreviewClick = (e) => {   
    const key = e.currentTarget.getAttribute('data-key')
    
    setCurrentKey(key.slice(1, key.length))
    setCurrentIndex(Number(key.slice(1, key.length)))
    setPrivewVisiable(true)
  }

  const handleZoom = (
    type: number,
    canZoomOut: boolean,
    setZoomOut: (canZoomOut: boolean) => void,
  ) => {
    if (
      zoomUnit <= 1 &&
      type === -1
    ) {
      setZoomOut(false)
      return;
    }

    let unit
    if (type === 1) {
      unit = zoomUnit + step
      setZoomUniy(unit)
      if (!canZoomOut) {
        setZoomOut(true)
      }
    } else {
      unit = zoomUnit - step
      setZoomUniy(unit)
    }


    if (!mediaRef.current) return;
    if (!currentSource) return;

    const source = mediaRef.current

    source.style.transform = `scaleX(${unit}) scaleY(${unit})`
  }

  const handlePrev = (ref: React.RefObject<HTMLButtonElement>) => {
    if (currentIndex === 1) {

      return;
    }

    setCurrentIndex(currentIndex - 1)
    setCurrentKey(String(currentIndex - 1))
    setZoomUniy(1)
  }

  const handleNext = (ref: React.RefObject<HTMLButtonElement>) => {
    if (currentIndex === sourceList.length) {

      return
    }

    setCurrentIndex(currentIndex + 1)
    setCurrentKey(String(currentIndex + 1))
    setZoomUniy(1)
  }

  return (
    <>
      <Spin spinning={loading} tip='视频解析中。。。'>
        <div className={styles.cardbox}>
        {
          sourceList.map(info => {
            
            let content: ReactNode;
            // put prop.type check here just because its eazy to do
            switch (props.type) {
              case 'image':
                content = (
                  <img
                    style={{ width: '60px', height: '60px', objectFit: 'cover', cursor: 'pointer' }}
                    src={info.url}
                  />
                )
                break

              case 'video': 
                content = (
                  <img
                    style={{ width: '60px', height: '60px', objectFit: 'cover', cursor: 'pointer' }}
                    src={info.posterUrl}
                  />
                )  
              break

              default: 
                break
            }

            return (
              <div
                style={{
                  width: info.width ? info.width : 60 + 'px',
                  height: info.height ? info.height : 60 + 'px'
                }}
                className={styles['card']}
                id={info.id}
                key={info.key}
                data-key={info.key}
                ref={card}
                onClick={handlePreviewClick}
                onMouseEnter={() => handlePreviewShow(info.id)}
                onMouseMove={() => handlePreviewShow(info.id)}
                onMouseLeave={() => handlePreviewHide(info.id)}
              >
                <div 
                  className={styles.content}
                >
                  {content}
                </div>
                <div
                  id={info.id + 'mask'}
                  ref={mask}
                  style={{
                    display: 'none',
                  }}
                  className={styles.cardmask + ' mask'}>
                    <div>
                      <span><EyeOutlined /> 预览</span>
                    </div>
                </div>
              </div>
            )
          })
        }

        </div>
      </Spin>
      
      <MediaModal 
        showOption={props.type !== 'video'}
        modalVisible={previewVisiable}
        onClose={() => setPrivewVisiable(false)}
        onLeftClick={handlePrev}
        onRightClick={handleNext}
        onZoom={handleZoom}
        current={currentIndex}
        total={count}
        type='video'
        id={currentSource?.id + 'video'}
      >
        {
          props.type === 'image' && (
            <img 
              ref={mediaRef as React.RefObject<HTMLImageElement>}
              src={currentSource?.url} 
            />
          )
        }
        {
          props.type === 'video' && (
            <video 
              width={800}
              height={600}
              controls
              autoPlay
              // src={videoSrc}
              id={currentSource?.id + 'video'}
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
            >
              <source src={videoSrc}  type='video/mp4' />
            </video>
          )
        }
      </MediaModal>
    </>
  );
};

export default MediaPreview;
