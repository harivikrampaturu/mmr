'use client';

import { useState, useEffect } from 'react'; // Ensure firebase config is correct
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
import { format } from 'date-fns';
import MaintenanceMonthExpenses from './MonthExpenses';
import MaintenanceDetails from './MaintenanceDetails';
import {
  PAYMENT_PAID,
  PAYMENT_PARTIAL,
  PAYMENT_PENDING,
  STATUS_INPROGRESS
} from '../constants';
import Logout from '../common/components/Logout';
import UpdateMonth from './UpdateMonth';
import { startOfMonth, isBefore } from 'date-fns';
import { getFormatedMonthName } from '@/utils/helpers';

const AdminPage = () => {
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const downloadStatement = async (monthName) => {
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
  };

  const downloadExcel = async (monthName) => {
    try {
      setLoading(true);
      const response = await axiosApi.get(
        `/api/maintenances/summary?monthName=${monthName}`,
        {
          responseType: 'blob' // Important to handle binary data
        }
      );

      // Create a URL for the blob and initiate a download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${monthName}-Maintenance-Statement.xlsx`);
      document.body.appendChild(link);
      link.click();

      // Clean up the URL and link
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setLoading(false);
    } catch (error) {
      console.error('Error downloading Excel file:', error);
      alert('There was an issue downloading the file. Please try again.');
      setLoading(false);
    }
  };

  // Fetch maintenance months data
  const fetchMaintenanceMonths = async () => {
    setLoading(true);
    try {
      const response = await axiosApi.get('/api/maintenances');
      setMonths(response?.data?.data.reverse());
    } catch (error) {
      console.error('Failed to fetch maintenance months:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceMonths();
  }, []);

  // Create New Month
  const handleCreateMonth = async () => {
    try {
      const values = await form.validateFields();
      values.monthName = new Date(values.monthName).toISOString(); //format(values.monthName, 'MMMM yyyy');
      values.amount = Number(values.amount);
      values.partialAmount = Number(values.partialAmount);
      values.openingBalance = Number(values.openingBalance);
      await axiosApi.post('/api/maintenances', values);
      message.success('Maintenance month created successfully!');
      setModalVisible(false);
      form.resetFields();
      fetchMaintenanceMonths(); // Refresh list
    } catch (error) {
      console.error('Failed to create maintenance month:', error);
      message.error('Failed to create maintenance month.');
    }
  };

  const handleViewMonth = (record) => {
    setSelectedMonth(record);
    setDrawerVisible(true);
  };

  const calculateTotalMaintenance = (maintenanceData, amounts) => {
    return maintenanceData.reduce((total, record) => {
      if (record.payment === PAYMENT_PAID) return total + amounts.amount;
      else if (record.payment === PAYMENT_PENDING) return total;
      else if (record.payment === PAYMENT_PARTIAL)
        return total + amounts.partial;
      return total;
    }, 0);
  };

  const calculateTotalExpenses = (expenses = []) => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const handlePendingApprovals = (maintenanceData) => {
    return maintenanceData.reduce((total, maintenanceData) => {
      return Boolean(maintenanceData.status === STATUS_INPROGRESS)
        ? total + 1
        : total;
    }, 0);
  };

  const columns = [
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
      title: 'Actions',
      render: (text, record) => (
        <div className='flex items-center'>
          <Button
            type='default'
            onClick={() => {
              downloadExcel(record.monthName);
            }}
            title='Download Excel'
            icon={<FileExcelOutlined />}
            size={'middle'}
          />
          <Button
            type='default'
            title='Download PDF'
            onClick={() => {
              downloadStatement(record.monthName);
            }}
            className='ml-2 mr-2 hidden'
          >
            <FilePdfOutlined />
          </Button>
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
  ];

  if (loading) return <Skeleton />;

  const disabledDate = (current) => {
    // Disable dates before the start of the current month
    return current && isBefore(current.toDate(), startOfMonth(new Date()));
  };

  const handleCopy = () => {
    const docId = selectedMonth._id; // Replace this with your dynamic docId if needed
    const url = `${window.location.origin}/collection?docId=${docId}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        message.success('Link copied to clipboard!');
      })
      .catch(() => {
        message.error('Failed to copy link.');
      });
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
              <MaintenanceMonthExpenses maintenanceId={selectedMonth._id} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='Maintenance Data' key='2'>
              <MaintenanceDetails
                maintenanceData={selectedMonth.maintenanceData}
                id={selectedMonth._id}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab='Settings' key='3'>
              <UpdateMonth id={selectedMonth._id} />
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
            label='Month Name'
            rules={[{ required: true, message: 'Please select the month' }]}
          >
            <DatePicker
              picker='month'
              format='MMMM YYYY'
              style={{ width: '100%' }}
              disabledDate={disabledDate}
            />
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
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;
