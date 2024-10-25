'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase'; // Ensure firebase config is correct
import axios from 'axios';
import {
  Table,
  Button,
  Drawer,
  Tabs,
  Form,
  Input,
  Modal,
  DatePicker,
  message
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import MaintenanceMonthExpenses from './MonthExpenses';
import MaintenanceDetails from './MaintenanceDetails';
import { PAYMENT_PAID, PAYMENT_PARTIAL, PAYMENT_PENDING } from '../constants';
import Logout from '../common/components/Logout';

const AdminPage = () => {
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/login'); // Ensure proper user session handling
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch maintenance months data
  const fetchMaintenanceMonths = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/maintenances');
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
      values.monthName = format(values.monthName, 'MMMM yyyy');
      values.amount = Number(values.amount);
      values.partialAmount = Number(values.partialAmount);
      await axios.post('/api/maintenances', values);
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

  const calculateTotalExpenses = (expenses) => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const columns = [
    { title: 'Month Name', dataIndex: 'monthName', key: 'monthName' },
    {
      title: 'Total Maintenance',
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
      render: (text, record) => (
        <span>{calculateTotalExpenses(record?.expenses)}</span>
      )
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <Button type='primary' onClick={() => handleViewMonth(record)}>
          View
        </Button>
      )
    }
  ];

  return (
    <div className='container mx-auto p-4'>
      <div className='flex flex-row items-center justify-between'>
        <div>
          <h1 className='text-xl font-bold mb-4'>Apartment Maintenance</h1>
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

      <Table
        dataSource={months}
        columns={columns}
        loading={loading}
        rowKey='_id'
        pagination={{ pageSize: 5 }}
      />

      {selectedMonth && (
        <Drawer
          title={`${selectedMonth.monthName} Details`}
          width={720}
          onClose={() => {
            setDrawerVisible(false);
            setSelectedMonth(null);
            fetchMaintenanceMonths();
          }}
          visible={drawerVisible}
          bodyStyle={{ paddingBottom: 80 }}
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
            <DatePicker picker='month' format='MMMM yyyy' />
          </Form.Item>
          <Form.Item
            name='amount'
            label='Maintenance Amount'
            rules={[{ required: true, message: 'Please enter a valid amount' }]}
          >
            <Input placeholder='Amount' />
          </Form.Item>
          <Form.Item name='partialAmount' label='Partial Amount'>
            <Input placeholder='Partial Amount' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;
