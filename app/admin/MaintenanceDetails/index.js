'use client';

import React, { useState, useEffect } from 'react';
import { Card, Typography, Radio, Input, Button } from 'antd';
import { MONTH_MAINTENANCE_DATA } from '@/app/constants';
import axios from 'axios';

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
        const response = await axios.put('/api/maintenances', {
          id,
          type: MONTH_MAINTENANCE_DATA,
          updateData: formData
        });

        if (response.ok) {
          // Handle success, reset form modification flag
          setIsFormModified(false);
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
    <div>
      <Button
        type='dashed'
        className='mt-2'
        disabled={!isFormModified}
        onClick={handleAddMaintenance}
      >
        Save Maintenance Record
      </Button>
      {formData.map(({ payment, flatNo, comments }, index) => (
        <Card key={index} className='m-1' size='small'>
          <div className='flex items-center justify-between'>
            <div
              style={{
                borderRadius: '50%',
                padding: '0.5rem',
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

            <div className='flex flex-col gap-middle'>
              <Radio.Group
                options={['pending', 'partial', 'paid']}
                defaultValue={payment}
                optionType='button'
                buttonStyle='solid'
                onChange={(e) => handlePaymentChange(e.target.value, index)}
              />
            </div>

            <Input
              className='w-40'
              defaultValue={comments}
              placeholder='Comments'
              onChange={(e) => handleCommentChange(e, index)}
            />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MaintenanceDetails;
