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
  Col
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
      {/* Total Expenses Display */}
      <h3 className='text-right mb-4'>
        Total Expenses: {calculateTotalExpenses(expenses)}
      </h3>

      {/* Expense Form */}
      <Card className='mb-4'>
        <Form
          form={form}
          layout='inline'
          onFinish={handleAddExpense}
          className='flex flex-wrap gap-4'
        >
          <Row gutter={[16, 16]} className='w-full'>
            {/* Expense Name */}
            <Col xs={24} sm={8}>
              <Form.Item
                name='name'
                rules={[
                  { required: true, message: 'Please enter the expense name' }
                ]}
              >
                <Input placeholder='Expense Name' className='w-full' />
              </Form.Item>
            </Col>

            {/* Expense Amount */}
            <Col xs={24} sm={6}>
              <Form.Item
                name='amount'
                rules={[{ required: true, message: 'Please enter the amount' }]}
              >
                <InputNumber placeholder='Amount' className='w-full' min={0} />
              </Form.Item>
            </Col>

            {/* Expense Date */}
            <Col xs={24} sm={8}>
              <Form.Item
                name='expenseDate'
                rules={[{ required: true, message: 'Please select the date' }]}
              >
                <DatePicker picker='date' format='DD MMMM' className='w-full' />
              </Form.Item>
            </Col>

            {/* Add Expense Button */}
            <Col xs={24} sm={2}>
              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  className='w-full sm:w-auto'
                >
                  Add Expense
                </Button>
              </Form.Item>
            </Col>
          </Row>
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
    </div>
  );
};

export default ExpenseManager;
