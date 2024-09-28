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

  const calculateTotalExpenses = (expenses) => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
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

  const columns = [
    { title: 'Month Name', dataIndex: 'monthName', key: 'monthName' },
    {
      title: 'Total Maintenance',
      render: (text, record) => (
        <span>{calculateTotalMaintenance(record.maintenanceData)}</span>
      )
    },
    {
      title: 'Total Expenses',
      render: (text, record) => (
        <span>{calculateTotalExpenses(record.expenses)}</span>
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
              <ExpenseDetails expenses={selectedMonth.expenses} />
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

const ExpenseDetails = ({ expenses }) => (
  <div>
    {expenses.map((expense, index) => (
      <div key={index} className='mb-2'>
        <Input
          defaultValue={expense.name}
          placeholder='Name'
          className='mb-1'
        />
        <Input
          defaultValue={expense.amount}
          placeholder='Amount'
          type='number'
        />
      </div>
    ))}
    <Button type='dashed' className='mt-2'>
      Add Expense
    </Button>
  </div>
);

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
