// components/ExpenseManager.js
'use client';
import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Popconfirm,
  message
} from 'antd';

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [form] = Form.useForm();

  // Fetch all expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Fetch expenses from API
  const fetchExpenses = async () => {
    try {
      const res = await fetch('/api/expenses');
      const { data } = await res.json();
      setExpenses(data);
    } catch (error) {
      message.error('Failed to fetch expenses.');
    }
  };

  // Handle form submission for both create and update
  const handleFormSubmit = async (values) => {
    if (isEditMode) {
      // Update existing expense
      await updateExpense(values);
    } else {
      // Create new expense
      await createExpense(values);
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  // Create new expense
  const createExpense = async (values) => {
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      if (res.ok) {
        fetchExpenses();
        message.success('Expense added successfully.');
      } else {
        message.error('Failed to add expense.');
      }
    } catch (error) {
      message.error('Failed to add expense.');
    }
  };

  // Update existing expense
  const updateExpense = async (values) => {
    try {
      const res = await fetch(`/api/expenses/${currentExpense._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      if (res.ok) {
        fetchExpenses();
        message.success('Expense updated successfully.');
      } else {
        message.error('Failed to update expense.');
      }
    } catch (error) {
      message.error('Failed to update expense.');
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchExpenses();
        message.success('Expense deleted successfully.');
      } else {
        message.error('Failed to delete expense.');
      }
    } catch (error) {
      message.error('Failed to delete expense.');
    }
  };

  // Handle edit button click
  const handleEdit = (expense) => {
    setIsEditMode(true);
    setCurrentExpense(expense);
    form.setFieldsValue(expense);
    setIsModalOpen(true);
  };

  // Handle modal open for new expense
  const handleAdd = () => {
    setIsEditMode(false);
    setCurrentExpense(null);
    setIsModalOpen(true);
    form.resetFields();
  };

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => <span>₹ {text}</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)} type='link'>
            Edit
          </Button>
          <Popconfirm
            title='Are you sure you want to delete this expense?'
            onConfirm={() => deleteExpense(record._id)}
            okText='Yes'
            cancelText='No'
          >
            <Button type='link' danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // Calculate total amount
  const totalAmount =
    expenses && expenses.length
      ? expenses.reduce((acc, item) => acc + item.amount, 0)
      : 0;

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold'>Expense Manager</h2>
        <Button type='primary' onClick={handleAdd}>
          Add Expense
        </Button>
      </div>
      <Table
        dataSource={expenses}
        columns={columns}
        rowKey='_id'
        pagination={false}
        footer={() => (
          <div className='text-right font-bold'>
            Total Amount: Rs.{totalAmount}
          </div>
        )}
      />

      {/* Add/Edit Expense Modal */}
      <Modal
        title={isEditMode ? 'Edit Expense' : 'Add Expense'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout='vertical'
          onFinish={handleFormSubmit}
          initialValues={{ name: '', amount: 0 }}
        >
          <Form.Item
            name='name'
            label='Name'
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='amount'
            label='Amount'
            rules={[
              { required: true, message: 'Please enter an amount' },
              {
                type: 'number',
                min: 0,
                message: 'Amount must be a positive number'
              }
            ]}
          >
            <InputNumber className='w-full' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExpenseManager;
