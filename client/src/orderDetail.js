import React from 'react';

const OrderDetails = ({ orders }) => {
  return (
    <div>
      <h2>Orders</h2>
      <ul>
        {orders.map(order => <li key={order._id}>{order.sub_total}</li>)}
      </ul>
    </div>
  );
};

export default OrderDetails;
