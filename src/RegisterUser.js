
import React, { useState } from 'react';
import { sendEmailOtp } from './helpers/sendEmailOtp';

function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

const RegisterUser = () => {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOtp = async () => {
    const otp = generateOtp();
    setGeneratedOtp(otp);
    const result = await sendEmailOtp(email, otp);
    setMessage(result.message);
    if (result.success) setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (enteredOtp === generatedOtp) {
      setMessage("✅ OTP verified successfully!");
    } else {
      setMessage("❌ Incorrect OTP.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Register with Email</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ padding: 10, width: '100%', marginBottom: 10 }}
      />
      <button onClick={handleSendOtp} style={{ padding: '10px 20px' }}>
        Send OTP
      </button>

      {otpSent && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={enteredOtp}
            onChange={e => setEnteredOtp(e.target.value)}
            style={{ padding: 10, width: '100%', marginTop: 10 }}
          />
          <button onClick={handleVerifyOtp} style={{ padding: '10px 20px', marginTop: 10 }}>
            Verify OTP
          </button>
        </>
      )}

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
};

export default RegisterUser;
