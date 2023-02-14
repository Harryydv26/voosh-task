import React, { useState } from 'react';
import axios from 'axios';

const SignupForm = ({ handleSignUp }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignUp(name, phoneNumber, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <label>Name: </label>
      <input type="text" onChange={(e) => setName(e.target.value)} value={name} required />
      <br />
      <label>Phone Number: </label>
      <input type="tel" onChange={(e) => setPhoneNumber(e.target.value)} value={phoneNumber} required />
      <br />
      <label>Password: </label>
      <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
      <br />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupForm;
