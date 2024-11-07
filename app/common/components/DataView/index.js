import React from 'react';
import { Card, Tag, Typography, Space } from 'antd';
import { ClockCircleOutlined, PayCircleOutlined } from '@ant-design/icons';
import { PAYMENT_PARTIAL, STATUS_INPROGRESS } from '@/app/constants';

const { Title, Text, Paragraph } = Typography;

const DataViewing = ({ data, hideTitle }) => {
  const { flatNo, payment, comments, date, status, _id } = data;
  const formattedDate = new Date(date).toLocaleString();

  return (
    <Card
      title={!hideTitle && <Title level={4}>Flat No. {flatNo}</Title>}
      bordered={false}
      style={{
        width: 350,
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        backgroundColor: '#f9f9f9'
      }}
    >
      <Space direction='vertical' size='middle' style={{ width: '100%' }}>
        <Paragraph>
          <Text strong>Approval Status: </Text>
          <Tag
            style={{ textTransform: 'uppercase' }}
            color={status === STATUS_INPROGRESS ? 'orange' : 'green'}
          >
            {status}
          </Tag>
        </Paragraph>

        <Paragraph>
          <Text strong>Payment: </Text>
          <Tag
            style={{ textTransform: 'uppercase' }}
            color={payment === PAYMENT_PARTIAL ? 'purple' : 'green'}
          >
            {payment}
          </Tag>
        </Paragraph>

        <Paragraph>
          <Text strong>Comments: </Text>
          <Text>{comments}</Text>
        </Paragraph>

        <Paragraph>
          <Text strong>Date: </Text>
          <Text>
            <ClockCircleOutlined /> {formattedDate}
          </Text>
        </Paragraph>

        <Paragraph>
          <Text strong>Record ID: </Text>
          <Text>{_id}</Text>
        </Paragraph>
      </Space>
    </Card>
  );
};

export default DataViewing;
