
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`,
    });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required.",
    });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"OurWill" <${process.env.ZOHO_EMAIL}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your One-Time Password is: ${otp}\n\nThis OTP will expire shortly.`,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to email!",
    });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP email.",
      error: error.message,
    });
  }
}
