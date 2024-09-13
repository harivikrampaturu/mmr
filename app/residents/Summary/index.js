import React from 'react';

const ResidentsSummary = ({ residents = [], expenses, isAdmin = false }) => {
  const totalExpenses =
    expenses && expenses.length
      ? expenses.reduce((acc, item) => acc + item.amount, 0)
      : 0;
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

  const assetsAmount = 2700 + 12021;
  const auctionFund = 17000;

  return (
    <div
      className='ml-16 mt-10'
      style={{
        background: '#fff',
        boxShadow: '1px 0px 2px 2px #ddd',
        padding: '2rem',
        borderRadius: '10px'
      }}
    >
      <h2 className='text-orange-400'>
        <b> Summary </b>
      </h2>
      <p>
        Liquid Contribution: Rs. <b>{totals.totalContribution}</b>
      </p>
      <p>
        {' '}
        Liquid Expenses: {totalExpenses}{' '}
        <a
          href='/expenses'
          title='expenses link'
          target='_blank'
          style={{ color: 'blueviolet' }}
        >
          (click here)
        </a>
      </p>
      <p>
        Total (laddu(2.7k) + idol(12.021K) + auction(17k)): Rs.{' '}
        <b>{totals.totalContribution + assetsAmount + auctionFund}</b>
      </p>

      <p>
        Total Expenses (Liquid Expenses + idol + laddu):{' '}
        {totalExpenses + assetsAmount}
      </p>
      <br />
      <p>
        Total Balance:{' '}
        <b>{totals.totalContribution + auctionFund - totalExpenses}</b>
        <i> ( (Liquid Contribution + Auction Fund) - Liquid Expenses)</i>
      </p>
      {isAdmin && (
        <>
          {' '}
          <p>Total Kids: {totals.totalKids}</p>
          <p>Total Adults: {totals.totalAdults}</p>
          <p>Pooja (Saturday): {totals.saturdayPooja}</p>
          <p>Pooja (Sunday): {totals.sundayPooja}</p>
          <p>Pooja (Monday): {totals.mondayPooja}</p>
        </>
      )}
    </div>
  );
};

export default ResidentsSummary;
