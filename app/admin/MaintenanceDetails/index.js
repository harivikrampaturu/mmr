// components/MaintenanceData.js
import React, { useEffect, useState } from 'react';
import {
  List,
  Drawer,
  Form,
  Input,
  Button,
  Select,
  Typography,
  message,
  Tag,
  DatePicker,
  Card
} from 'antd';
import { RightOutlined } from '@ant-design/icons';

const { Text } = Typography;

import axiosApi from '@/utils/axios';
import {
  PAYMENT_MODE_CASH,
  PAYMENT_MODE_ONLINE,
  PAYMENT_PAID,
  PAYMENT_PARTIAL,
  PAYMENT_PENDING,
  STATUS_APPROVED,
  STATUS_INITIAL,
  STATUS_INPROGRESS
} from '@/app/constants';
import DataViewing from '@/app/common/components/DataView';
import { format, parse } from 'date-fns';

const { Option } = Select;
const { Title } = Typography;

const MaintenanceData = ({ id: docId }) => {
  const [maintenance, setMaintenance] = useState({});
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showWaiting, setShowWaiting] = useState(false);
  const [appovalComments, setApprovalComments] = useState('');

  const waitingRecords = maintenanceData.filter(
    (record) => record.status === STATUS_INPROGRESS
  );

  const handleToggleShowWaiting = () => {
    setShowWaiting(!showWaiting);
  };

  const fetchMaintenanceData = async () => {
    setLoading(true);
    try {
      const response = await axiosApi.get(`/api/maintenances/${docId}`);
      const { maintenanceData } = response.data || {};
      setMaintenance(response.data);
      setMaintenanceData(maintenanceData);
    } catch (error) {
      message.error('Error fetching maintenance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceData(docId);
  }, [docId]);

  const showDrawer = (record) => {
    debugger;
    setSelectedRecord(record);
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
    setSelectedRecord(null);
    fetchMaintenanceData(docId);
  };

  const handleFormSubmit = async (values) => {
    // Handle form submit, you can add API call here to save updated record.
    console.log('Updated Values:', values);
    setLoading(true);
    try {
      if (values.payment === PAYMENT_PENDING)
        throw new Error('Payment is pending');
      values.status = STATUS_APPROVED;
      values.date = Boolean(values.date)
        ? new Date(values.date).toISOString()
        : new Date().toISOString();
      await axiosApi.put(
        `/api/maintenances/${docId}/maintenanceData/${selectedRecord._id}`,
        values
      );
      message.success('Maintenance data updated successfully');
      // Re-fetch maintenance data to update the grid
      const response = await axiosApi.get(
        `/api/maintenances/${docId}?inCollection=true`
      );
      setMaintenanceData(response.data.maintenanceData);
    } catch (error) {
      message.error('Error updating maintenance data');
      console.error(error);
    } finally {
      setLoading(false);
    }
    closeDrawer();
  };

  const handleApprove = () => {
    selectedRecord.status = STATUS_APPROVED;
    selectedRecord.comments = Boolean(selectedRecord.comments)
      ? `${selectedRecord.comments} --> ${appovalComments}`
      : appovalComments;
    handleFormSubmit(selectedRecord);
    // Handle form submit, you can add API call here to save updated record.
    console.log('selectedRecord Updated Values:', selectedRecord);
  };

  return (
    <div>
      {waitingRecords.length > 0 && (
        <>
          {' '}
          <Title level={5} className='flex justify-end items-center'>
            {showWaiting ? 'Show All Records' : 'Show Waiting Approval List'}{' '}
            <Button onClick={handleToggleShowWaiting} className='ml-4'>
              {showWaiting
                ? 'Show All'
                : `Show Waiting Approvals(${waitingRecords.length})`}
            </Button>
          </Title>{' '}
        </>
      )}
      <List
        itemLayout='horizontal'
        dataSource={showWaiting ? waitingRecords : maintenanceData}
        renderItem={(item) => (
          <List.Item
            onClick={() => showDrawer(item)}
            style={{
              cursor: 'pointer',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '10px',
              transition: 'all 0.3s',
              border: '1px solid #e0e0e0',
              backgroundColor: '#f9f9f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e6f7ff';
              e.currentTarget.style.boxShadow =
                '0px 4px 10px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f9f9f9';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <List.Item.Meta
              title={
                <Text strong style={{ fontSize: '16px', color: '#202020' }}>
                  Flat No: {item?.flatNo}
                </Text>
              }
              description={
                <div>
                  {item?.status !== STATUS_INITIAL &&
                    item?.status !== STATUS_APPROVED && (
                      <Tag
                        color={
                          item?.status === STATUS_APPROVED
                            ? 'green'
                            : item?.status === STATUS_INPROGRESS
                            ? 'orange'
                            : 'lightgrey'
                        }
                      >
                        Approval: {item?.status}
                      </Tag>
                    )}
                  <Tag
                    color={
                      item?.payment === PAYMENT_PAID
                        ? 'green'
                        : item?.payment === PAYMENT_PARTIAL
                        ? 'purple'
                        : 'red'
                    }
                    style={{ textTransform: 'UPPERCASE' }}
                  >
                    {item?.payment}
                  </Tag>
                </div>
              }
            />
            <RightOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
          </List.Item>
        )}
      />

      <Drawer
        title={`Flat No: ${selectedRecord?.flatNo}`}
        width={400}
        onClose={closeDrawer}
        visible={isDrawerVisible}
        footer={
          selectedRecord?.status === STATUS_INITIAL && (
            <div style={{ textAlign: 'right' }}>
              <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button form='recordForm' type='primary' htmlType='submit'>
                Save
              </Button>
            </div>
          )
        }
      >
        {selectedRecord &&
          (selectedRecord.status === STATUS_INITIAL ? (
            <Form
              id='recordForm'
              layout='vertical'
              initialValues={{ ...selectedRecord, status: STATUS_APPROVED }}
              onFinish={handleFormSubmit}
            >
              <Form.Item label='Flat No' name='flatNo'>
                <Input disabled />
              </Form.Item>
              <Form.Item
                label='Payment'
                name='payment'
                rules={[
                  {
                    validator: (_, value) => {
                      if (value === PAYMENT_PENDING) {
                        return Promise.reject(
                          new Error('Payment cannot be set to PAYMENT_PENDING')
                        );
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Select>
                  <Option value={PAYMENT_PENDING}>{PAYMENT_PENDING}</Option>
                  <Option value={PAYMENT_PARTIAL}>
                    {PAYMENT_PARTIAL}-{maintenance?.partialAmount}
                  </Option>
                  <Option value={PAYMENT_PAID}>
                    {PAYMENT_PAID}-{maintenance?.amount}
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item label='Payment Mode' name='paymentMode'>
                <Select>
                  <Option value={PAYMENT_MODE_CASH}>{PAYMENT_MODE_CASH}</Option>

                  <Option value={PAYMENT_MODE_ONLINE}>
                    {PAYMENT_MODE_ONLINE}
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item label='Status' name='status'>
                <Select disabled>
                  <Option value={STATUS_INITIAL}>{STATUS_INITIAL}</Option>
                  <Option value={STATUS_INPROGRESS}>{STATUS_INPROGRESS}</Option>
                  <Option value={STATUS_APPROVED}>{STATUS_APPROVED}</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label='Date'
                name='date'
                rules={[{ required: true, message: 'Please select a date' }]}
              >
                <DatePicker
                  value={
                    Boolean(selectedRecord?.date)
                      ? parse(selectedRecord?.date, 'yyyy-MM-dd', new Date())
                      : new Date()
                  }
                  onChange={(date) => format(date, 'yyyy-MM-dd')}
                />
              </Form.Item>
              <Form.Item label='Comments' name='comments'>
                <Input.TextArea />
              </Form.Item>
            </Form>
          ) : (
            <>
              <DataViewing data={selectedRecord} hideTitle />

              {selectedRecord?.status === STATUS_INPROGRESS && (
                <Card className='mt-4'>
                  <Form
                    id='recordForm'
                    layout='vertical'
                    initialValues={{
                      ...selectedRecord,
                      status: STATUS_APPROVED
                    }}
                  >
                    <Form.Item label='Approval Comments' name='comments'>
                      <Input.TextArea
                        onChange={(e) => setApprovalComments(e.target.value)}
                      />
                    </Form.Item>
                    <Button type='primary' onClick={() => handleApprove()}>
                      Approve
                    </Button>
                  </Form>
                  <div
                    className='mt-2 mb-2'
                    style={{ color: '#808080', fontSize: '0.8rem' }}
                  >
                    Maintenance Collected. Approval is pending{' '}
                  </div>
                </Card>
              )}
            </>
          ))}
      </Drawer>
    </div>
  );
};

export default MaintenanceData;
