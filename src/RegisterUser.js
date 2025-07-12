// src/RegisterUser.js

import React, { useState } from "react";
import { sendEmailOtp } from "./helpers/sendEmailOtp";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    county: "",
    subcounty: "",
    ward: "",
    pollingStation: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setStatus("Email is required to send OTP.");
      return;
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("ourwill_otp", generatedOtp);

    const response = await sendEmailOtp(formData.email, generatedOtp);
    if (response.success) {
      setOtpSent(true);
      setStatus("OTP sent to email.");
    } else {
      setStatus(response.message);
    }
  };

  const handleVerifyOtp = () => {
    const storedOtp = localStorage.getItem("ourwill_otp");
    if (otp === storedOtp) {
      setOtpVerified(true);
      setStatus("OTP verified successfully!");
    } else {
      setStatus("Invalid OTP. Try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      setStatus("Please verify OTP before submitting.");
      return;
    }

    try {
      const res = await fetch("/api/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("Registration successful!");
        setFormData({
          email: "",
          mobile: "",
          county: "",
          subcounty: "",
          ward: "",
          pollingStation: "",
        });
        setOtp("");
        setOtpSent(false);
        setOtpVerified(false);
      } else {
        setStatus(data.message || "Failed to register.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setStatus("Server error. Try again later.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2>Voter Registration</h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <br />

      <button type="button" onClick={handleSendOtp} disabled={otpSent}>
        {otpSent ? "OTP Sent" : "Send OTP"}
      </button>
      <br />

      {otpSent && !otpVerified && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button type="button" onClick={handleVerifyOtp}>
            Verify OTP
          </button>
          <br />
        </>
      )}

      <input
        type="text"
        name="mobile"
        placeholder="Mobile Number"
        value={formData.mobile}
        onChange={handleChange}
        required
      />
      <br />

      <input
        type="text"
        name="county"
        placeholder="County"
        value={formData.county}
        onChange={handleChange}
        required
      />
      <br />

      <input
        type="text"
        name="subcounty"
        placeholder="Subcounty"
        value={formData.subcounty}
        onChange={handleChange}
        required
      />
      <br />

      <input
        type="text"
        name="ward"
        placeholder="Ward"
        value={formData.ward}
        onChange={handleChange}
        required
      />
      <br />

      <input
        type="text"
        name="pollingStation"
        placeholder="Polling Station"
        value={formData.pollingStation}
        onChange={handleChange}
        required
      />
      <br />

      <button type="submit" onClick={handleSubmit} disabled={!otpVerified}>
        Submit Registration
      </button>

      <p>{status}</p>
    </div>
  );
};

export default RegisterUser;
