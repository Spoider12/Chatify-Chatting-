import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// ✅ Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use any other like Outlook, Yahoo, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // App password (NOT your normal Gmail password)
  },
});

// ✅ Function to send welcome email
export const sendWelcomeEmail = async (email, name, clientURL) => {
  try {
    const mailOptions = {
      from: `"Chatify Team 🚀" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Welcome to Chatify, ${name}! 🎉`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #007bff;">👋 Hello, ${name}!</h1>
          <p>Welcome to <strong>Chatify</strong> – your ultimate chatting companion.</p>
          
          <p style="font-size: 16px;">
            We’re thrilled to have you on board. Here’s what you can do next:
          </p>

          <ul style="font-size: 15px; line-height: 1.6;">
            <li>Start chatting with your friends instantly 💬</li>
            <li>Create and customize your profile 🖼️</li>
            <li>Explore new features and updates 🚀</li>
          </ul>

          <p style="text-align:center; margin: 30px 0;">
            <a href="${clientURL}" target="_blank"
               style="padding: 12px 25px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">
               Explore Chatify
            </a>
          </p>

          <p style="font-size: 13px; color: #888;">
            Need help? Reply to this email or visit our support center.
          </p>

          <p style="margin-top: 20px; color: #555;">
            Cheers,<br/>
            <strong>The Chatify Team 🚀</strong>
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Creative welcome email sent successfully:", info.response);
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
  }
};

