'use client';
import { useState, useEffect, Suspense, useRef } from 'react';
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
  DatePicker,
  Skeleton,
  Typography
} from 'antd';
import { format, parse } from 'date-fns';
import {
  PAYMENT_PENDING,
  STATUS_INITIAL,
  STATUS_INPROGRESS,
  STATUS_APPROVED,
  PAYMENT_PARTIAL,
  PAYMENT_PAID,
  PAYMENT_MODE_CASH,
  PAYMENT_MODE_ONLINE
} from '../constants';
import DataViewing from '@/app/common/components/DataView';
import { getFormatedMonthName } from '@/utils/helpers';
import { ClockCircleOutlined, PayCircleOutlined } from '@ant-design/icons';

const { Meta } = Card;
const { Title } = Typography;
import SignatureCanvas from 'react-signature-canvas';

const CollectionPage = () => {
  const [maintenance, setMaintenance] = useState({});
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    flatNo: '',
    payment: PAYMENT_PAID || '',
    comments: '',
    date: '',
    status: ''
  });
  const [isDrawing, setIsDrawing] = useState(false); // Track whether the user is drawing
  let signatureRef = useRef(null);

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

  const clearSignature = () => {
    signatureRef.current.clear();
  };

  // Handle form submission for updating maintenance data
  const onFinish = async (values) => {
    setSaving(true);
    try {
      const DataUrl = signatureRef.current.getCanvas().toDataURL();
      console.log('Signature Data URL:', DataUrl);
      if (values.payment === PAYMENT_PENDING)
        throw new Error('Payment is pending');
      values.status = STATUS_INPROGRESS;
      values.signature = Boolean(DataUrl) ? DataUrl : '';
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
      clearSignature();
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

  const handleBeginDrawing = () => {
    setIsDrawing(true); // Set drawing state to true when the user starts drawing
  };

  const handleEndDrawing = () => {
    setIsDrawing(false); // Set drawing state to false when the user finishes drawing
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2 className='flex justify-center items-center m-2'>
        Maintenance Collection of{' '}
        <Typography.Text
          style={{ color: 'green', fontSize: '18px', marginLeft: '5px' }}
          strong
        >
          {Boolean(maintenance?.monthName) &&
            getFormatedMonthName(maintenance?.monthName)}{' '}
        </Typography.Text>
      </h2>

      {loading ? (
        <Spin tip='Loading...' />
      ) : (
        <Row gutter={[16, 16]}>
          {maintenanceData?.map((record) => (
            <Col xs={12} sm={12} md={8} lg={6} xl={4} key={record._id}>
              <Card
                style={{
                  cursor: 'pointer',
                  boxShadow: '1px 3px 1px 0px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center'
                }}
                onClick={() => {
                  openDrawer(record);
                }}
              >
                <Meta
                  title={
                    <Title
                      level={2} // Adjust the level as needed
                      style={{
                        margin: 0,
                        fontFamily: "'Bangers', cursive",
                        color:
                          record?.status === STATUS_INPROGRESS
                            ? 'orange'
                            : record?.status === STATUS_APPROVED
                            ? 'green'
                            : 'grey',
                        textAlign: 'center',
                        fontStyle: 'italic'
                      }}
                    >
                      {record?.flatNo || ''}
                    </Title>
                  }
                  description={
                    record?.comments ||
                    (Boolean(record?.date) &&
                      format(record?.date, 'yyyy-MM-dd')) ||
                    'No Description'
                  }
                />
                <div style={{ marginTop: 16 }}>
                  {record?.status === STATUS_INPROGRESS && (
                    <Tag
                      color={
                        record?.status === STATUS_INPROGRESS
                          ? 'orange'
                          : record?.status === STATUS_APPROVED
                          ? 'green'
                          : 'blue'
                      }
                      style={{ textTransform: 'uppercase' }}
                    >
                      <ClockCircleOutlined style={{ marginRight: 2 }} /> IN
                      Approval
                    </Tag>
                  )}

                  <Tag
                    color={
                      record?.payment === PAYMENT_PAID
                        ? 'green'
                        : record?.payment === PAYMENT_PARTIAL
                        ? 'purple'
                        : 'red'
                    }
                    style={{ textTransform: 'uppercase' }}
                  >
                    <PayCircleOutlined style={{ marginRight: 3 }} />{' '}
                    {record?.payment === PAYMENT_PARTIAL
                      ? `Paid-${maintenance?.partialAmount}`
                      : record?.payment}{' '}
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
        open={drawerVisible}
        footer={
          selectedRecord?.status === STATUS_INITIAL && (
            <div className='flex justify-between'>
              <Button
                onClick={() => setDrawerVisible(false)}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button
                form='recordCollectionForm'
                type='primary'
                htmlType='submit'
              >
                Submit
              </Button>
            </div>
          )
        }
      >
        {(selectedRecord?.status === STATUS_INPROGRESS ||
          selectedRecord?.status === STATUS_APPROVED) && (
          <pre>
            {' '}
            <DataViewing data={selectedRecord} />
          </pre>
        )}
        {selectedRecord?.status === STATUS_INITIAL && (
          <Form
            form={form}
            layout='vertical'
            id='recordCollectionForm'
            onFinish={onFinish}
          >
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
            <Form.Item label='Resident Name' name='residentName'>
              <Input
                type='text'
                placeholder='Enter Name(optional)'
                value={formData.residentName}
                onChange={handleInputChange}
                name='residentName'
              />
            </Form.Item>

            <Form.Item
              label='Maintenance Amount'
              name='payment'
              rules={[
                {
                  required: true,
                  message: 'Please Select the Maintenance Amount',
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
              <Select
                value={formData.payment}
                onChange={(value) =>
                  setFormData({ ...formData, payment: value })
                }
                name='payment'
              >
                <Select.Option value={PAYMENT_PAID}>
                  {maintenance?.amount}
                </Select.Option>
                <Select.Option value={PAYMENT_PARTIAL}>
                  {maintenance?.partialAmount}
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label='Payment Mode'
              name='paymentMode'
              rules={[
                { required: true, message: 'Please select Payment mode' }
              ]}
            >
              <Select
                value={formData.paymentMode}
                onChange={(value) =>
                  setFormData({ ...formData, paymentMode: value })
                }
                name='paymentMode'
              >
                <Select.Option value={PAYMENT_MODE_CASH}>Cash</Select.Option>
                <Select.Option value={PAYMENT_MODE_ONLINE}>
                  Online
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label='Date'
              name='date'
              rules={[{ required: true, message: 'Please select Date' }]}
            >
              <DatePicker
                format='YYYY-MM-DD'
                value={formData.date}
                onChange={(date) => setFormData({ ...formData, date })}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item label='Comments' name='comments'>
              <Input.TextArea
                rows={4}
                placeholder='Enter comments (optional)'
                value={formData.comments}
                onChange={handleInputChange}
                name='comments'
              />
            </Form.Item>

            <Form.Item label='Signature'>
              <div
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  width: '100%',
                  height: '150px',
                  overflow: 'hidden'
                }}
              >
                <SignatureCanvas
                  ref={signatureRef}
                  penColor='black'
                  canvasProps={{
                    width: '352px',
                    height: '150px',
                    className: 'signatureCanvas'
                  }}
                  onBegin={handleBeginDrawing}
                  onEnd={handleEndDrawing}
                />
              </div>
              <Button
                onClick={clearSignature}
                type='link'
                style={{ marginTop: 10 }}
              >
                Clear Signature
              </Button>
            </Form.Item>
          </Form>
        )}
      </Drawer>
    </div>
  );
};

const CollectionPageWithSuspense = () => (
  <Suspense fallback={<Spin tip='Loading page...' />}>
    <CollectionPage />
  </Suspense>
);

export default CollectionPageWithSuspense;
