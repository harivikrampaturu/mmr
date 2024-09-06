import React from 'react';

const ResidentsSummary = ({ residents = [] }) => {
  const totals = residents.reduce(
    (acc, resident) => {
      acc.totalContribution += resident.contribution;
      acc.totalKids += resident.kids;
      acc.totalAdults += resident.adults;
      acc.sundayPooja = Boolean(resident.pooja === 'Sunday')
        ? acc.sundayPooja + 1
        : acc.sundayPooja;
      acc.saturdayPooja = Boolean(resident.pooja === 'Saturday')
        ? acc.saturdayPooja + 1
        : acc.saturdayPooja;
      acc.mondayPooja = Boolean(resident.pooja === 'Monday')
        ? acc.mondayPooja + 1
        : acc.mondayPooja;
      return acc;
    },
    {
      totalContribution: 0,
      totalKids: 0,
      totalAdults: 0,
      sundayPooja: 0,
      saturdayPooja: 0,
      mondayPooja: 0
    }
  );

  return (
    <div className='ml-16 -mt-10'>
      <h2 className='text-orange-400'>Residents Summary</h2>
      <p>
        Total Contribution: Rs. <b>{totals.totalContribution}</b>
      </p>
      <p>Total Kids: {totals.totalKids}</p>
      <p>Total Adults: {totals.totalAdults}</p>
      <p>Pooja (Saturday): {totals.saturdayPooja}</p>
      <p>Pooja (Sunday): {totals.sundayPooja}</p>
      <p>Pooja (Monday): {totals.mondayPooja}</p>
    </div>
  );
};

export default ResidentsSummary;
