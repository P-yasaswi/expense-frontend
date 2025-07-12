import React, { useState } from 'react';
import axios from '../api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/forgot-password', { email });
      setMsg('Password reset to 123456. Please login again.');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="form-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Enter your email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <button type="submit">Reset</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
};

export default ForgotPassword;
