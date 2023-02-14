import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'
import LoginForm from './loginForm';
import SignupForm from './singup';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:8000/login-user', { headers: { Authorization: `Bearer ${token}` }})
        .then(res => {
          setIsLoggedIn(true);
          setUserData(res.data);
        })
        .catch(err => console.log(err));
    }
  }, []);

  const handleLogin = (phoneNumber, password) => {
    axios.post('http://localhost:8000/login-user', { "phone_number":phoneNumber, password })
      .then(res => {
        localStorage.setItem('token', res.data.token);
        setIsLoggedIn(true);
        setUserData(res.data.user);
        console.log(res)
      })
      .catch(err => console.log(err));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData(null);
  };

  const handleSignUp = (name, phoneNumber, password) => {
    axios.post('http://localhost:8000/add-user', { name, "phone_number":phoneNumber, password })
      .then(res => {
        setIsLoggedIn(true);
        setUserData(res.data);
        console.log(res.data)
      })
      .catch(err => console.log(err));
  };

  const handleAddOrder = (subTotal) => {
    axios.post('http://localhost:8000/add-order', { user_id: userData.user_id, sub_total: subTotal, phone_number: userData.phoneNumber },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }})
      .then(res => {
        console.log(res.data)
        setOrders([...orders, res.data]);
      })
      .catch(err => console.log(err));
  };

  const handleGetOrders = () => {
    console.log(userData)
    axios.get(`http://localhost:8000/get-order?user_id=${userData.user_id}`)
      .then(res => {
        console.log(res.data)
        setOrders(res.data);
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      {isLoggedIn ? (
       <div>
       <p>Welcome, {userData.name}!</p>
       <button onClick={handleLogout}>Logout</button>
       <button onClick={handleGetOrders}>View Orders</button>
       <ul>
         {orders.map((order) => (
           <li key={order.order_id}>
             Order id : {order.order_id}, Order Subtotal: {order.sub_total}
           </li>
         ))}
       </ul>
       <form onSubmit={(e) => { e.preventDefault(); handleAddOrder(subTotal); }}>
         <label>Subtotal: </label>
         <input type="number" onChange={(e) => setSubTotal(e.target.value)} value={subTotal} />
         <button type="submit">Add Order</button>
       </form>
     </div>
     
      ) : (
        <div>
          <LoginForm handleLogin={handleLogin} />
          <SignupForm handleSignUp={handleSignUp} />
        </div>
      )}
    </div>
  );
};

export default App