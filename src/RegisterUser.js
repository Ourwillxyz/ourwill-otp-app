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

  const han
