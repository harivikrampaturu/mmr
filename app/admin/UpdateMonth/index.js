// components/MaintenanceForm.js
import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, message } from 'antd';
import axios from 'axios';

const UpdateMonth = ({ id }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Fetch existing data if updating
  useEffect(() => {
    if (id) {
      axios
        .get(`/api/maintenances/${id}`)
        .then(({ data }) => form.setFieldsValue(data))
        .catch(() => message.error('Failed to load data'));
    }
  }, [id, form]);

  // Handle form submission
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const type = id ? 'MONTH_UPDATE' : 'MONTH_MAINTENANCE_DATA';
      const updateData = { ...values };

      await axios.put('/api/maintenances', {
        id,
        type,
        updateData
      });

      message.success(id ? 'Updated successfully!' : 'Created successfully!');
    } catch (error) {
      message.error('Failed to submit data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={onFinish}
      initialValues={{
        amount: 0,
        partialAmount: 0,
        openingBalance: 0,
        additionalIncome: 0
      }}
    >
      <Form.Item
        label='Maintenance Amount (Occupied flats)'
        name='amount'
        rules={[{ required: true, message: 'Please enter the amount' }]}
      >
        <InputNumber min={0} className='w-full' />
      </Form.Item>
      <Form.Item
        label='Partial Amount (Unoccupied flats)'
        name='partialAmount'
        rules={[{ required: true, message: 'Please enter the partial amount' }]}
      >
        <InputNumber min={0} className='w-full' />
      </Form.Item>
      <Form.Item
        label='Opening Balance'
        name='openingBalance'
        rules={[
          { required: true, message: 'Please enter the opening balance' }
        ]}
      >
        <InputNumber min={0} className='w-full' />
      </Form.Item>
      <Form.Item
        label='Additional Income'
        name='additionalIncome'
        rules={[
          { required: true, message: 'Please enter the additional income' }
        ]}
      >
        <InputNumber min={0} className='w-full' />
      </Form.Item>
      <Form.Item>
        <Button type='primary' htmlType='submit' loading={loading}>
          {id ? 'Update' : 'Create'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateMonth;
