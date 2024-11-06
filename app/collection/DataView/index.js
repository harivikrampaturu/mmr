import React from 'react';
import { Card, Tag, Typography } from 'antd';
import { ClockCircleOutlined, PayCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const DataViewing = ({ data }) => {
  const { flatNo, payment, comments, date, status, _id } = data;

  const formattedDate = new Date(date).toLocaleString();

  return (
    <Card title={`Flat No. ${flatNo}`} bordered={false} style={{ width: 300 }}>
      <Title level={4}>Payment Information</Title>
      <Text strong>Status: </Text>
      <Tag color={status === 'inprogress' ? 'blue' : 'green'}>{status}</Tag>
      <br />
      <Text strong>Payment: </Text>
      <Tag color={payment === 'partial' ? 'orange' : 'green'}>{payment}</Tag>
      <br />
      <Text strong>Comments: </Text>
      <Text>{comments}</Text>
      <br />
      <Text strong>Date: </Text>
      <Text>
        <ClockCircleOutlined /> {formattedDate}
      </Text>
      <br />
      <Text strong>Record ID: </Text>
      <Text>{_id}</Text>
    </Card>
  );
};

export default DataViewing;
