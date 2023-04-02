import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Typography } from 'antd';

export default (): React.ReactNode => (
  <PageHeaderWrapper>
    <Card>
      <Typography.Text strong>
        <a target="_blank" rel="noopener noreferrer" href="https://www.tmmtmm.com.tr/en">
          TMM TMM 首页
        </a>
      </Typography.Text>
    </Card>
  </PageHeaderWrapper>
);
