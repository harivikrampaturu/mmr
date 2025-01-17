'use client';

import { useState, useEffect, useCallback, useMemo } from 'react'; // Ensure firebase config is correct
import axiosApi from '@/utils/axios';

import {
  Table,
  Button,
  Drawer,
  Tabs,
  Form,
  Input,
  Modal,
  DatePicker,
  message,
  Skeleton
} from 'antd';
import {
  FileExcelOutlined,
  FilePdfOutlined,
  PlusOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import MaintenanceMonthExpenses from './MonthExpenses';
import MaintenanceDetails from './MaintenanceDetails';

import Logout from '../common/components/Logout';
import UpdateMonth from './UpdateMonth';
import { startOfMonth, isBefore } from 'date-fns';
import {
  getFormatedMonthName,
  calculateTotalMaintenance,
  calculateTotalExpenses,
  handlePendingApprovals,
  createBlobUrl
} from '@/utils/helpers';

const DATE_INPUT = 'date';
const TEXT_INPUT = 'text';

const AdminPage = () => {
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [downloadingMonth, setDownloadingMonth] = useState(null);
  const [inputType, setInputType] = useState(DATE_INPUT);

  const disabledDate = (current) => {
    return current && isBefore(current.toDate(), startOfMonth(new Date()));
  };

  const handleCopy = useCallback(() => {
    if (selectedMonth) {
      const docId = selectedMonth._id;
      const url = `${window.location.origin}/collection?docId=${docId}`;

      navigator.clipboard
        .writeText(url)
        .then(() => message.success('Link copied to clipboard!'))
        .catch(() => message.error('Failed to copy link.'));
    }
  }, [selectedMonth]);

  /*   const downloadStatement = async (monthName) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/maintenances/download?monthName=${monthName}`
      );
      if (!response.ok) {
        console.error('Failed to download statement');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${monthName}-Maintenance-Statement.pdf`;
      link.click();
      setLoading(false);
    } catch (error) {
      console.error('Error downloading statement:', error);
      setLoading(false);
    }
  }; */

  const downloadExcel = useCallback(async (monthName) => {
    try {
      setDownloadingMonth(monthName);
      const response = await axiosApi.get(
        `/api/maintenances/summary?monthName=${monthName}`,
        { responseType: 'blob' }
      );
      const { url, link } = createBlobUrl(new Blob([response.data]));
      link.setAttribute('download', `${monthName}-Maintenance-Statement.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading Excel file:', error);
      message.error('Error downloading the file. Please try again.');
    } finally {
      setDownloadingMonth(null);
    }
  }, []);

  // Fetch maintenance months data
  const fetchMaintenanceMonths = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosApi.get('/api/maintenances');
      setMonths(response?.data?.data.reverse());
    } catch (error) {
      console.error('Failed to fetch maintenance months:', error);
      message.error('Error fetching maintenance months. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaintenanceMonths();
  }, [fetchMaintenanceMonths]);

  // Create New Month
  const handleCreateMonth = useCallback(async () => {
    try {
      const values = await form.validateFields();

      // Handle date conversion based on input type
      if (inputType === DATE_INPUT && values.monthName?.$d) {
        // For DatePicker input, convert moment/dayjs object to ISO string
        values.monthName = new Date(values.monthName.$d).toISOString();
      } else if (inputType === TEXT_INPUT) {
        // For text input, keep the original string value
        values.monthName = values.monthName.trim();
      }

      // Convert numeric fields
      values.amount = Number(values.amount);
      values.partialAmount = Number(values.partialAmount || 0);
      values.openingBalance = Number(values.openingBalance || 0);

      // Make API call
      await axiosApi.post('/api/maintenances', values);

      // Success handling
      message.success('Maintenance month created successfully!');
      setModalVisible(false);
      form.resetFields();
      fetchMaintenanceMonths();
    } catch (error) {
      console.error('Failed to create maintenance month:', error);
      message.error('Failed to create maintenance month. Please try again.');
    }
  }, [fetchMaintenanceMonths, form, inputType]);

  const handleViewMonth = useCallback((record) => {
    setSelectedMonth(record);
    setDrawerVisible(true);
  }, []);

  const columns = useMemo(
    () => [
      {
        title: 'Month Name',
        dataIndex: 'monthName',
        key: 'monthName',
        ellipsis: true,
        render: (text, record) => getFormatedMonthName(record.monthName)
      },
      {
        title: 'Total Maintenance',
        className: 'hidden md:table-cell',
        render: (text, record) => (
          <span>
            {calculateTotalMaintenance(record?.maintenanceData, {
              amount: record?.amount,
              partial: record?.partialAmount
            })}
          </span>
        )
      },
      {
        title: 'Total Expenses',
        className: 'hidden md:table-cell',
        render: (text, record) => (
          <span>{calculateTotalExpenses(record?.expenses)}</span>
        )
      },
      {
        title: 'Pending Approvals',
        className: 'hidden md:table-cell',
        render: (text, record) => (
          <span>{handlePendingApprovals(record?.maintenanceData) || 0}</span>
        )
      },
      {
        title: 'Water Bill',
        className: 'hidden md:table-cell',
        render: (text, record) => (
          <span>{calculateWaterBill(record?.waterData)}</span>
        )
      },
      {
        title: 'Actions',
        render: (text, record) => (
          <div className='flex items-center'>
            <Button
              type='default'
              onClick={() => downloadExcel(record.monthName)}
              title='Download Excel'
              icon={<FileExcelOutlined />}
              size='middle'
              loading={downloadingMonth === record.monthName}
            />
            {/* <Button
              type='default'
              title='Download PDF'
              onClick={() => downloadStatement(record.monthName)}
              className='ml-2 mr-2 hidden'
            >
              <FilePdfOutlined />
            </Button> */}
            <Button
              type='primary'
              className='ml-2'
              onClick={() => handleViewMonth(record)}
            >
              View
            </Button>
          </div>
        )
      }
    ],
    [downloadExcel, handleViewMonth, downloadingMonth]
  );

  if (loading) return <Skeleton />;

  const toggleInputType = () => {
    setInputType((prev) => (prev === DATE_INPUT ? TEXT_INPUT : DATE_INPUT));
  };

  return (
    <div className='mx-auto p-2 pr-4 pl-4'>
      <div className='flex flex-row items-center justify-between'>
        <div>
          <h1 className='text-xl font-bold mb-4 hidden md:block'>
            Apartment Maintenance
          </h1>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            className='mb-4'
            onClick={() => setModalVisible(true)}
          >
            Create New Month
          </Button>
        </div>
        <div>
          <Logout />
        </div>
      </div>
      <div className='overflow-x-auto '>
        <Table
          dataSource={months}
          columns={columns}
          loading={loading}
          rowKey='_id'
          pagination={{ pageSize: 5 }}
        />
      </div>

      {selectedMonth && (
        <Drawer
          title={`${getFormatedMonthName(selectedMonth.monthName)}  Details`}
          width={720}
          onClose={() => {
            setDrawerVisible(false);
            setSelectedMonth(null);
            fetchMaintenanceMonths();
          }}
          open={drawerVisible}
          extra={
            <Button icon={<ShareAltOutlined />} onClick={handleCopy}>
              Share to Watchman
            </Button>
          }
        >
          <Tabs defaultActiveKey='1'>
            <Tabs.TabPane tab='Expenses' key='1'>
              <MaintenanceMonthExpenses
                selectedMonth={selectedMonth}
                maintenanceId={selectedMonth._id}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab='Maintenance Data' key='2'>
              <MaintenanceDetails
                selectedMonth={selectedMonth}
                id={selectedMonth._id}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab='Settings' key='3'>
              <UpdateMonth
                selectedMonth={selectedMonth}
                id={selectedMonth._id}
              />
            </Tabs.TabPane>
          </Tabs>
        </Drawer>
      )}

      <Modal
        title='Create New Maintenance Month'
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleCreateMonth}
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            name='monthName'
            label={
              <div className='flex items-center justify-between'>
                <span>Month Name</span>
                <Button type='link' onClick={toggleInputType}>
                  Switch to {inputType === DATE_INPUT ? 'Text' : 'Date'} Input
                </Button>
              </div>
            }
            rules={[{ required: true, message: 'Please enter the month' }]}
          >
            {inputType === DATE_INPUT ? (
              <DatePicker
                picker='month'
                format='MMMM YYYY'
                style={{ width: '100%' }}
                disabledDate={disabledDate}
              />
            ) : (
              <Input placeholder='Enter month name (e.g., January 2024)' />
            )}
          </Form.Item>

          <Form.Item
            name='amount'
            label='Maintenance Amount per Flat (Occupied)'
            rules={[{ required: true, message: 'Please enter a valid amount' }]}
          >
            <Input placeholder='Amount' />
          </Form.Item>
          <Form.Item
            name='partialAmount'
            label='Partial Amount per Flat (Unoccupied)'
          >
            <Input placeholder='Partial Amount' />
          </Form.Item>
          <Form.Item name='openingBalance' label='Opening Balance'>
            <Input placeholder='Opening Balance' />
          </Form.Item>
          <Form.Item
            name='totalWaterAmount'
            label='Total Water Amount'
            rules={[{ required: true, message: 'Please enter the total water amount' }]}
          >
            <Input placeholder='Total Water Amount' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;