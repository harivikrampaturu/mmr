'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import {
  Row,
  Col,
  Card,
  Drawer,
  Form,
  Input,
  Button,
  message,
  Spin,
  Tag,
  Select,
  DatePicker
} from 'antd';
import { format, parse } from 'date-fns';
import {
  PAYMENT_PENDING,
  STATUS_INITIAL,
  STATUS_INPROGRESS,
  STATUS_APPROVED
} from '../constants';
import DataViewing from './DataView';

const { Meta } = Card;

const CollectionPage = () => {
  const [maintenance, setMaintenance] = useState({});
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    flatNo: '',
    payment: 'paid' || '',
    comments: '',
    date: '',
    status: ''
  });

  const [form] = Form.useForm();

  const searchParams = useSearchParams(); // Use useSearchParams for query parameters
  const docId = searchParams.get('docId');

  // Fetch maintenance data on load
  useEffect(() => {
    if (!docId) return;

    const fetchMaintenanceData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/maintenances/${docId}?inCollection=true`
        );
        const { maintenanceData } = response.data || {};
        setMaintenance(response.data);
        setMaintenanceData(maintenanceData);
      } catch (error) {
        message.error('Error fetching maintenance data');
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceData();
  }, [docId]);

  // Open drawer with form populated with selected record data
  const openDrawer = (record) => {
    setSelectedRecord(record);
    form.setFieldsValue({
      ...record,
      date: record.date ? parse(record.date, 'yyyy-MM-dd', new Date()) : ''
    });
    setDrawerVisible(true);
  };

  // Handle form submission for updating maintenance data
  const onFinish = async (values) => {
    setSaving(true);
    try {
      if (values.payment === PAYMENT_PENDING)
        throw new Error('Payment is pending');
      values.status = STATUS_INPROGRESS;
      await axios.put(
        `/api/maintenances/${docId}/maintenanceData/${selectedRecord._id}`,
        values
      );
      message.success('Maintenance data updated successfully');
      setDrawerVisible(false);
      // Re-fetch maintenance data to update the grid
      const response = await axios.get(
        `/api/maintenances/${docId}?inCollection=true`
      );
      setMaintenanceData(response.data.maintenanceData);
    } catch (error) {
      message.error('Error updating maintenance data');
    } finally {
      setSaving(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // You can process the form data as needed here
    console.log(formData);
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2>Maintenance Records of {maintenance?.monthName}</h2>

      {loading ? (
        <Spin tip='Loading...' />
      ) : (
        <Row gutter={[16, 16]}>
          {maintenanceData?.map((record) => (
            <Col xs={12} sm={12} md={8} lg={6} xl={4} key={record._id}>
              <Card
                style={{
                  cursor: 'pointer'
                }}
                /* style={{
                  cursor:
                    record?.status === 'inprogress' ||
                    record?.status === STATUS_APPROVED
                      ? 'not-allowed'
                      : 'pointer'
                }} */
                onClick={() => {
                  /* if (
                    record?.status !== 'inprogress' &&
                    record?.status !== STATUS_APPROVED
                  ) {
                    openDrawer(record);
                  } */
                  openDrawer(record);
                }}
              >
                <Meta
                  title={record?.flatNo || 'No Title'}
                  description={
                    record?.comments || record?.date || 'No Description'
                  }
                />
                <div style={{ marginTop: 16 }}>
                  <Tag
                    color={
                      record?.status === STATUS_INPROGRESS
                        ? 'orange'
                        : record?.status === STATUS_APPROVED
                        ? 'green'
                        : 'blue'
                    }
                    style={{ textTransform: 'capitalize' }}
                  >
                    {record?.payment === 'partial'
                      ? `Paid-${maintenance?.partialAmount}`
                      : record?.payment}{' '}
                    | {record?.status}
                  </Tag>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Drawer for editing maintenance record */}
      <Drawer
        title='Maintenance Record'
        width={400}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        {(selectedRecord?.status === STATUS_INPROGRESS ||
          selectedRecord?.status === STATUS_APPROVED) && (
          <pre>
            {' '}
            <DataViewing data={selectedRecord} />
          </pre>
        )}
        {selectedRecord?.status === STATUS_INITIAL && (
          <Form form={form} layout='vertical' onFinish={onFinish}>
            <Form.Item
              label='Flat No'
              name='flatNo'
              rules={[
                { required: true, message: 'Please enter the flat number' }
              ]}
            >
              <Input
                type='number'
                placeholder='Enter flat number'
                value={formData.flatNo}
                onChange={handleInputChange}
                name='flatNo'
                disabled
              />
            </Form.Item>

            <Form.Item
              label='Maintenance Amount'
              name='payment'
              rules={[
                { required: true, message: 'Please select Maintenance Amount' }
              ]}
            >
              <Select
                value={formData.payment}
                onChange={(value) =>
                  setFormData({ ...formData, payment: value })
                }
                name='payment'
              >
                <Select.Option value='paid'>
                  {maintenance?.amount}
                </Select.Option>
                <Select.Option value='partial'>
                  {maintenance?.partialAmount}
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label='Comments' name='comments'>
              <Input
                type='text'
                placeholder='Enter comments'
                value={formData.comments}
                onChange={handleInputChange}
                name='comments'
              />
            </Form.Item>

            <Form.Item
              label='Date'
              name='date'
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <DatePicker
                value={
                  formData.date
                    ? parse(formData.date, 'yyyy-MM-dd', new Date())
                    : new Date()
                }
                onChange={(date) =>
                  setFormData({ ...formData, date: format(date, 'yyyy-MM-dd') })
                }
              />
            </Form.Item>

            {(formData.status !== STATUS_INPROGRESS ||
              formData.status !== STATUS_APPROVED) && (
              <Form.Item>
                <Button type='primary' htmlType='submit' loading={saving}>
                  Update Maintenance
                </Button>
              </Form.Item>
            )}
          </Form>
        )}
      </Drawer>
    </div>
  );
};

export default CollectionPage;
