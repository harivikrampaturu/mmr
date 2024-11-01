/* 'use client';*/
import { useState, useEffect } from 'react';
import {
  Input,
  InputNumber,
  Button,
  List,
  Form,
  message,
  Card,
  DatePicker,
  Row,
  Col,
  Radio,
  Switch
} from 'antd';
import { format } from 'date-fns';

const addExpense = async (maintenanceId, expenseData) => {
  try {
    expenseData.expenseDate = format(expenseData.expenseDate, 'MMMM yyyy');
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

const calculateTotalExpenses = (expenses) => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

const ExpenseManager = ({ maintenanceId }) => {
  const [expenses, setExpenses] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchExpenses = async () => {
      const response = await fetch(`/api/maintenances/${maintenanceId}`);
      const data = await response.json();
      setExpenses(data.expenses);
    };

    fetchExpenses();
  }, [maintenanceId]);

  const handleAddExpense = async (values) => {
    // Convert the selected date to ISO string format
    values.expenseDate = values.expenseDate.toISOString();
    const updatedMaintenance = await addExpense(maintenanceId, values);
    if (updatedMaintenance) {
      setExpenses(updatedMaintenance.expenses);
      form.resetFields();
      message.success('Expense added successfully');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    await deleteExpense(maintenanceId, expenseId);
    const updatedExpenses = await fetch(`/api/maintenances/${maintenanceId}`);
    const data = await updatedExpenses.json();
    setExpenses(data.expenses);
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
            <Button type='primary' htmlType='submit' className='w-full'>
              Add Expense
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Expense List */}
      <List
        bordered
        dataSource={expenses}
        renderItem={(expense) => (
          <List.Item
            className='flex flex-wrap justify-between'
            actions={[
              <Button
                danger
                onClick={() => handleDeleteExpense(expense._id)}
                className='mt-2 sm:mt-0'
              >
                Delete
              </Button>
            ]}
          >
            {expense.name}: {expense.amount}
          </List.Item>
        )}
      />
      {/* Total Expenses Display */}
      <h3 className='text-right mb-4'>
        Total Expenses: {calculateTotalExpenses(expenses)}
      </h3>
    </div>
  );
};

export default ExpenseManager;
