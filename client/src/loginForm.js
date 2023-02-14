import React, { useState } from 'react';

const LoginForm = ({ handleLogin }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(phoneNumber, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label>Phone Number: </label>
      <input type="tel" onChange={(e) => setPhoneNumber(e.target.value)} value={phoneNumber} required />
      <br />
      <label>Password: </label>
      <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
      <br />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
