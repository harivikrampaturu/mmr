'use client';

import { useState, useEffect } from 'react';
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
// import 'antd/dist/antd.css';

const AdminPage = () => {
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const calculateTotalExpenses = (expenses) => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  useEffect(() => {
    fetchMaintenanceMonths();
  }, []);

  const fetchMaintenanceMonths = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/maintenance');
      setMonths(response.data.data);
    } catch (error) {
      console.error('Failed to fetch maintenance months:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMonth = (record) => {
    setSelectedMonth(record);
    setDrawerVisible(true);
  };

  const calculateTotalMaintenance = (maintenanceData) => {
    return maintenanceData.reduce((total, record) => total + record.amount, 0);
  };

  const handleCreateMonth = async () => {
    try {
      const values = await form.validateFields();
      values.monthName = format(values.monthName, 'MMMM yyyy');
      await axios.post('/api/maintenance', values);
      message.success('Maintenance month created successfully!');
      setModalVisible(false);
      form.resetFields();
      fetchMaintenanceMonths();
    } catch (error) {
      console.error('Failed to create maintenance month:', error);
      message.error('Failed to create maintenance month.');
    }
  };

  const handleAddExpense = async (expense) => {
    if (selectedMonth) {
      const updatedExpenses = [...selectedMonth.expenses, expense];
      await axios.post(
        `/api/maintenance/${selectedMonth._id}/expenses`,
        expense
      );
      setSelectedMonth({ ...selectedMonth, expenses: updatedExpenses });
      message.success('Expense added successfully!');
    }
  };

  const columns = [
    { title: 'Month Name', dataIndex: 'monthName', key: 'monthName' },
    {
      title: 'Total Maintenance',
      render: (text, record) => (
        <span>{calculateTotalMaintenance(record?.maintenanceData)}</span>
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
      <h1 className='text-xl font-bold mb-4'>Apartment Maintenance</h1>
      <Button
        type='primary'
        icon={<PlusOutlined />}
        className='mb-4'
        onClick={() => setModalVisible(true)}
      >
        Create New Month
      </Button>
      <Table
        dataSource={months}
        columns={columns}
        loading={loading}
        rowKey='_id'
        pagination={{ pageSize: 5 }}
      />
      {/* Drawer for detailed view */}
      <Drawer
        title={
          selectedMonth ? `${selectedMonth.monthName} Details` : 'Month Details'
        }
        width={720}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        {selectedMonth && (
          <Tabs defaultActiveKey='1'>
            <Tabs.TabPane tab='Expenses' key='1'>
              <ExpenseDetails
                expenses={selectedMonth?.expenses}
                onAddExpense={handleAddExpense}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab='Maintenance Data' key='2'>
              <MaintenanceDetails
                maintenanceData={selectedMonth.maintenanceData}
              />
            </Tabs.TabPane>
          </Tabs>
        )}
      </Drawer>
      {/* Modal for creating new month */}
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
        </Form>
      </Modal>
    </div>
  );
};

const ExpenseDetails = ({ expenses, onAddExpense }) => {
  const [expenseForm] = Form.useForm();

  const calculateTotalExpenses = (expenses) => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const handleAddExpense = async () => {
    try {
      const values = await expenseForm.validateFields();
      onAddExpense(values);
      expenseForm.resetFields();
    } catch (error) {
      console.error('Failed to add expense:', error);
      message.error('Failed to add expense.');
    }
  };

  return (
    <div>
      <Form form={expenseForm} layout='vertical' onFinish={handleAddExpense}>
        <Form.Item
          name='name'
          label='Expense Name'
          rules={[{ required: true, message: 'Please enter expense name!' }]}
        >
          <Input placeholder='Expense Name' />
        </Form.Item>
        <Form.Item
          name='amount'
          label='Amount'
          rules={[{ required: true, message: 'Please enter an amount!' }]}
        >
          <Input type='number' placeholder='Amount' />
        </Form.Item>
        <Button type='primary' htmlType='submit'>
          Add Expense
        </Button>
      </Form>
      <h3 className='mt-4'>Expenses List</h3>
      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            {expense.name}: ${expense.amount}
          </li>
        ))}
      </ul>
      <h4>Total Expenses: {calculateTotalExpenses(expenses)}</h4>
    </div>
  );
};

const MaintenanceDetails = ({ maintenanceData }) => (
  <div>
    {maintenanceData.map((record, index) => (
      <div key={index} className='mb-2'>
        <Input
          defaultValue={record.flatNo}
          placeholder='Flat No'
          className='mb-1'
        />
        <Input
          defaultValue={record.amount}
          placeholder='Amount'
          type='number'
          className='mb-1'
        />
        <Input
          defaultValue={record.paymentMode}
          placeholder='Payment Mode'
          className='mb-1'
        />
        <Input.TextArea defaultValue={record.comments} placeholder='Comments' />
      </div>
    ))}
    <Button type='dashed' className='mt-2'>
      Add Maintenance Record
    </Button>
  </div>
);

export default AdminPage;
