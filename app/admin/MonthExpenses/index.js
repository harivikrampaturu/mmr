/* 'use client';*/
import { useState } from 'react';
import {
  Input,
  InputNumber,
  Button,
  Form,
  message,
  Card,
  DatePicker,
  Switch,
  Table
} from 'antd';
import { format } from 'date-fns';

const addExpense = async (maintenanceId, expenseData) => {
  try {
    const response = await fetch(`/api/maintenances/${maintenanceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        maintenanceId,
        expense: expenseData
      })
    });

    if (!response.ok) {
      throw new Error('Failed to add expense');
    }

    const updatedMaintenance = await response.json();
    console.log('Expense added successfully:', updatedMaintenance);
    return updatedMaintenance;
  } catch (error) {
    console.error('Error adding expense:', error);
    message.error('Failed to add expense');
  }
};

const deleteExpense = async (maintenanceId, expenseId) => {
  try {
    const response = await fetch(
      `/api/maintenances/${maintenanceId}/expenses`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ eid: expenseId })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete expense');
    }

    console.log('Expense deleted successfully');
    message.success('Expense deleted successfully');
  } catch (error) {
    console.error('Error deleting expense:', error);
    message.error('Failed to delete expense');
  }
};

const calculateTotalExpenses = (expenses = []) => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

const ExpenseManager = ({ maintenanceId, selectedMonth }) => {
  const [expenses, setExpenses] = useState([
    ...(selectedMonth?.expenses || [])
  ]);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const ExpenseTable = ({ expenses, handleDeleteExpense }) => {
    const columns = [
      {
        title: 'Expense Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Amount (Rs.)',
        dataIndex: 'amount',
        key: 'amount'
      },
      {
        title: 'Date',
        dataIndex: 'expenseDate',
        key: 'expenseDate',
        render: (date) => format(new Date(date), 'dd MMM')
      },
      {
        title: 'Bill',
        dataIndex: 'bill',
        key: 'bill',
        render: (bill) => (Boolean(bill) ? 'A' : 'NA')
      },
      {
        title: 'Action',
        key: 'action',
        align: 'center',
        render: (_, record) => (
          <Button
            loading={Boolean(isLoading) && isLoading === record._id}
            danger
            onClick={() => handleDeleteExpense(record._id)}
          >
            Delete
          </Button>
        )
      }
    ];

    return (
      <Table
        bordered
        dataSource={expenses}
        columns={columns}
        rowKey='_id'
        pagination={false}
      />
    );
  };

  const handleAddExpense = async (values) => {
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 3000); // Convert the selected date to ISO string format
    values.expenseDate = values.expenseDate.toISOString();
    const updatedMaintenance = await addExpense(maintenanceId, values);
    if (updatedMaintenance) {
      setExpenses(updatedMaintenance.expenses);
      form.resetFields();
      message.success('Expense added successfully');
    }
    //  setIsAdding(false);
  };

  const handleDeleteExpense = async (expenseId) => {
    setIsLoading(expenseId);
    await deleteExpense(maintenanceId, expenseId);
    const updatedExpenses = await fetch(`/api/maintenances/${maintenanceId}`);
    const data = await updatedExpenses.json();
    setExpenses(data.expenses);
    setIsLoading(null);
  };

  return (
    <div className='p-4'>
      {/* Expense Form */}
      <Card className='mb-4'>
        <Form
          form={form}
          layout='vertical' // Changed layout to vertical
          onFinish={handleAddExpense}
          initialValues={{ bill: false }}
          className='flex flex-wrap  flex-col'
        >
          <div className='flex flex-wrap justify-between '>
            {/* Expense Name */}
            <Form.Item
              name='name'
              label='Expense Name'
              rules={[
                { required: true, message: 'Please enter the expense name' }
              ]}
              className='flex-1'
            >
              <Input placeholder='Expense Name' className='w-full' />
            </Form.Item>
            {/* Expense Amount */}
            <Form.Item
              name='amount'
              label='Amount'
              rules={[{ required: true, message: 'Please enter the amount' }]}
            >
              <InputNumber placeholder='Amount' className='w-full' min={0} />
            </Form.Item>
          </div>

          <div className='flex flex-wrap justify-between '>
            {/* Expense Date */}
            <Form.Item
              name='expenseDate'
              label='Expense Date'
              rules={[{ required: true, message: 'Please select the date' }]}
              className='flex-1'
            >
              <DatePicker picker='date' format='DD MMMM' className='w-full' />
            </Form.Item>
            <Form.Item
              name='bill'
              label='Bill'
              rules={[{ required: true, message: 'Please select an option' }]}
              value='NA'
            >
              <Switch checkedChildren='A' unCheckedChildren='NA' />
            </Form.Item>
          </div>
          {/* Add Expense Button */}
          <Form.Item>
            <Button
              loading={isAdding}
              type='primary'
              htmlType='submit'
              className='w-full'
            >
              Add Expense
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Expense List */}
      <ExpenseTable
        expenses={expenses}
        handleDeleteExpense={handleDeleteExpense}
      />
      {/* Total Expenses Display */}
      <h3 className='text-right mb-4'>
        Total Expenses: {calculateTotalExpenses(expenses)}
      </h3>
    </div>
  );
};

export default ExpenseManager;
