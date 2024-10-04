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
  DatePicker
} from 'antd';
import { format } from 'date-fns';

const addExpense = async (maintenanceId, expenseData) => {
  try {
    expenseData.expenseDate = format(expenseData.expenseDate, 'MMMM yyyy');
    debugger;
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
    <div>
      <h3 style={{ textAlign: 'right' }}>
        Total Expenses: {calculateTotalExpenses(expenses)}
      </h3>
      <Card style={{ marginBottom: '1rem' }}>
        <Form
          form={form}
          layout='inline'
          onFinish={handleAddExpense}
          style={{ marginBottom: 12 }}
        >
          <Form.Item
            name='name'
            rules={[
              { required: true, message: 'Please enter the expense name' }
            ]}
          >
            <Input
              placeholder='Expense Name'
              style={{ width: 150, marginRight: 5 }}
            />
          </Form.Item>

          <Form.Item
            name='amount'
            rules={[{ required: true, message: 'Please enter the amount' }]}
          >
            <InputNumber
              placeholder='Amount'
              style={{ width: 100, marginRight: 5 }}
              min={0}
            />
          </Form.Item>

          <Form.Item
            name='expenseDate'
            rules={[{ required: true, message: 'Please select the date' }]}
          >
            <DatePicker picker='date' format='DD MMMM' />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Add Expense
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <List
        bordered
        dataSource={expenses}
        renderItem={(expense) => (
          <List.Item
            actions={[
              <Button danger onClick={() => handleDeleteExpense(expense._id)}>
                Delete
              </Button>
            ]}
          >
            {/* ₹ */}
            {expense.name}: {expense.amount}
          </List.Item>
        )}
      />
    </div>
  );
};

export default ExpenseManager;
