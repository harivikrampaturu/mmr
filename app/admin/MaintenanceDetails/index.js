'use client';

import React, { useState } from 'react';
import {
  Card,
  Typography,
  Radio,
  Input,
  Button,
  Row,
  Col,
  message
} from 'antd';
import { MONTH_MAINTENANCE_DATA } from '@/app/constants';
import axiosApi from '@/utils/axios';
import './styles.css';

const MaintenanceDetails = ({ maintenanceData, id }) => {
  const [formData, setFormData] = useState(maintenanceData);
  const [isFormModified, setIsFormModified] = useState(false);

  // Handle changes in payment or comments
  const handlePaymentChange = (value, index) => {
    const updatedData = formData.map((item, i) =>
      i === index ? { ...item, payment: value } : item
    );
    setFormData(updatedData);
    setIsFormModified(true);
  };

  const handleCommentChange = (e, index) => {
    const updatedData = formData.map((item, i) =>
      i === index ? { ...item, comments: e.target.value } : item
    );
    setFormData(updatedData);
    setIsFormModified(true);
  };

  // Function to handle submission
  const handleAddMaintenance = async () => {
    if (isFormModified) {
      try {
        const response = await axiosApi.put('/api/maintenances', {
          id,
          type: MONTH_MAINTENANCE_DATA,
          updateData: formData
        });
        if (response.status === 200) {
          // Handle success, reset form modification flag
          setIsFormModified(false);
          message.success('Saved successfully');
          console.log('Maintenance record added successfully.');
        } else {
          // Handle error
          console.error('Failed to add maintenance record.');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  return (
    <div className='p-4'>
      {/* Save Button */}
      <div className='sticky-div'>
        <Button
          type='dashed'
          className='mt-2 w-full sm:w-auto'
          disabled={!isFormModified}
          onClick={handleAddMaintenance}
        >
          Save Maintenance Record
        </Button>
      </div>

      {/* Maintenance Details Cards */}
      {formData.map(({ payment, flatNo, comments, _id, status }, index) => (
        <Card key={index} className='m-2' size='small'>
          <Row gutter={[16, 16]} className='flex items-center justify-between'>
            {/* Flat Number */}
            <Col xs={24} sm={4} className='flex justify-center'>
              <div
                className='flex items-center justify-center rounded-full p-2'
                style={{
                  background:
                    payment === 'pending'
                      ? '#eee'
                      : payment === 'paid'
                      ? 'green'
                      : 'orange'
                }}
              >
                <Typography className='font-bold'>{flatNo}</Typography>
              </div>
            </Col>

            {/* Payment Status */}
            <Col xs={24} sm={10} className='flex justify-center'>
              <Radio.Group
                options={['pending', 'partial', 'paid']}
                defaultValue={payment}
                optionType='button'
                buttonStyle='solid'
                onChange={(e) => handlePaymentChange(e.target.value, index)}
                className='w-full sm:w-auto text-center'
              />
            </Col>

            {/* Comments */}
            <Col xs={24} sm={10} className='flex justify-center'>
              <Input
                className='w-full sm:w-40'
                defaultValue={comments}
                placeholder='Comments'
                onChange={(e) => handleCommentChange(e, index)}
              />
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
};

export default MaintenanceDetails;
