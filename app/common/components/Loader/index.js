import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';

const Loader = () => (
  <div className='p-4'>
    <div className='flex justify-center'>
      <Flex align='center' gap='middle'>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </Flex>
    </div>
  </div>
);

export default Loader;
