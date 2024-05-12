/**
 * @Description
 */

import React from 'react';
import V2Title from '../Feedback/V2Title';
import { Col, Row } from 'antd';
import SlideMedia from '@/common/components/SlideMedia';

const SlideMediaDemo: React.FC<any> = (props) => {
  console.log(`props = `, props);
  const images = [
    {
      'name': '测试专用图.jpg',
      'type': 'image/jpeg',
      'url': 'https://videos.linhuiba.com/FvFKFAA0Elwetnbfbms9cEMuYS_X',
      'coordinateUrl': 'https://middle-file.linhuiba.com/FqPpCGK_WjWs030bd5J_0fJ7ZOyC',
      'coordinate': [
        {
          'x': 53,
          'y': 142.5
        },
        {
          'x': 249,
          'y': 148.5
        },
        {
          'x': 126,
          'y': 429.5
        }
      ],
      'urlByPriority': 'https://middle-file.linhuiba.com/FqPpCGK_WjWs030bd5J_0fJ7ZOyC'
    },
    {
      'name': '测试图3.jpeg',
      'type': 'image/jpeg',
      'url': 'https://videos.linhuiba.com/FtBeFyuMAi4Ua5dPAW2VcCm-Cg12',
      'coordinateUrl': null,
      'coordinate': null,
      'urlByPriority': 'https://videos.linhuiba.com/FtBeFyuMAi4Ua5dPAW2VcCm-Cg12'
    },
    {
      'name': '111222.jpg',
      'type': 'image/jpeg',
      'url': 'https://videos.linhuiba.com/FnGSa8tT7EZK2E71yLyg0btWCcDq',
      'coordinateUrl': null,
      'coordinate': null,
      'urlByPriority': 'https://videos.linhuiba.com/FnGSa8tT7EZK2E71yLyg0btWCcDq'
    },
    {
      'name': '210416122252-1-1200.jpeg',
      'type': 'image/jpeg',
      'url': 'https://videos.linhuiba.com/Fj4jSPkCc-KfKT56d53AMf7dxFHS',
      'coordinateUrl': null,
      'coordinate': null,
      'urlByPriority': 'https://videos.linhuiba.com/Fj4jSPkCc-KfKT56d53AMf7dxFHS'
    }
  ];

  const videos = [
    {
      'name': '1.mp4',
      'type': 'video/mp4',
      'url': 'https://videos.linhuiba.com/FsLZ4AvkE2mPgAzlnLoiI9LXZoCw',
      'coordinateUrl': null,
      'coordinate': null,
      'urlByPriority': 'https://videos.linhuiba.com/FsLZ4AvkE2mPgAzlnLoiI9LXZoCw'
    }
  ];

  const panoramas = [
    {
      'name': 'LINK',
      'type': 'LINK',
      'url': 'https://www.720yun.com/t/df6juswnvy0?scene_id=23541176',
      'coordinateUrl': null,
      'coordinate': null,
      'urlByPriority': 'https://www.720yun.com/t/df6juswnvy0?scene_id=23541176'
    }
  ];

  const floorPlans = [
    {
      'name': '4c2fa83db40c27d90f949f63222bad4a.jpg',
      'type': 'image/jpeg',
      'url': 'https://cert.linhuiba.com/FtbltHQDwJaR2coFYyjc6X7JeYpN',
      'coordinateUrl': null,
      'coordinate': null,
      'urlByPriority': 'https://cert.linhuiba.com/FtbltHQDwJaR2coFYyjc6X7JeYpN'
    },
    {
      'name': '606ee5805fc00d9365501dddbf2d546 (1).jpg',
      'type': 'image/jpeg',
      'url': 'https://cert.linhuiba.com/FkxmZGW2SVey3ujltMdbBBjHYSJN',
      'coordinateUrl': null,
      'coordinate': null,
      'urlByPriority': 'https://cert.linhuiba.com/FkxmZGW2SVey3ujltMdbBBjHYSJN'
    }
  ];

  return (
    <>
      <V2Title type='H1' text='媒体资源幻灯片' divider/>
      <Row gutter={16} style={{ marginTop: '12px' }}>
        <Col span={12}>
          <V2Title type='H2' text='四个要素都存在' divider/>
          <SlideMedia images={images} videos={videos} panoramas={panoramas} floorPlans={floorPlans}/>
        </Col>
        <Col span={12}>
          <V2Title type='H2' text='视频 CR 平面图' divider/>
          <SlideMedia videos={videos} panoramas={panoramas} floorPlans={floorPlans}/>
        </Col>
        <Col span={12}>
          <V2Title type='H2' text='图片 视频' divider/>
          <SlideMedia videos={videos} images={images}/>
        </Col>
        <Col span={12}>
          <V2Title type='H2' text='啥都没有' divider/>
          <SlideMedia />
        </Col>
      </Row>

    </>
  );
};

export default SlideMediaDemo;
