import React from 'react';
import { Card, Tag, Typography, Space } from 'antd';
import { ClockCircleOutlined, PayCircleOutlined } from '@ant-design/icons';
import { PAYMENT_PARTIAL, STATUS_INPROGRESS } from '@/app/constants';

const { Title, Text, Paragraph } = Typography;

const DataViewing = ({ data, hideTitle }) => {
  const { flatNo, payment, comments, date, status, _id, signature } = data;
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
        backgroundColor: '#f9f9f9',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer'
      }}
      hoverable
    >
      <Space direction='vertical' size='middle' style={{ width: '100%' }}>
        <Paragraph>
          <Text strong>Approval Status: </Text>
          <Tag
            style={{ textTransform: 'uppercase' }}
            color={status === STATUS_INPROGRESS ? 'orange' : 'green'}
          >
            {status === STATUS_INPROGRESS ? (
              <ClockCircleOutlined style={{ marginRight: 5 }} />
            ) : (
              <PayCircleOutlined style={{ marginRight: 5 }} />
            )}
            {status}
          </Tag>
        </Paragraph>

        <Paragraph>
          <Text strong>Payment: </Text>
          <Tag
            style={{ textTransform: 'uppercase' }}
            color={payment === PAYMENT_PARTIAL ? 'purple' : 'green'}
          >
            <PayCircleOutlined style={{ marginRight: 5 }} />
            {payment}
          </Tag>
        </Paragraph>

        <Paragraph ellipsis={{ rows: 2, expandable: true }}>
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

        {/* Signature View */}
        <Paragraph>
          <Text strong>Signature: </Text>
          {signature ? (
            <img
              src={signature}
              alt='Signature'
              width={400}
              height={100}
              className='bg-white'
              style={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                marginTop: '10px'
              }}
            />
          ) : (
            <Text>No Signature</Text>
          )}
        </Paragraph>
      </Space>
    </Card>
  );
};

export default DataViewing;
