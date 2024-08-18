import React from 'react';

const ResidentsSummary = ({ residents = [] }) => {
  const totals = residents.reduce(
    (acc, resident) => {
      acc.totalContribution += resident.contribution;
      acc.totalKids += resident.kids;
      acc.totalAdults += resident.adults;
      return acc;
    },
    { totalContribution: 0, totalKids: 0, totalAdults: 0 }
  );

  return (
    <div>
      <h2>Residents Summary</h2>
      <p>Total Contribution: {totals.totalContribution}</p>
      <p>Total Kids: {totals.totalKids}</p>
      <p>Total Adults: {totals.totalAdults}</p>
    </div>
  );
};

export default ResidentsSummary;
