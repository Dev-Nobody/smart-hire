"use client";
import React, { useState } from "react";
import { Form, Input, Button, Modal } from "antd";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState(""); // New password field
  const router = useRouter();

  const handleResetPassword = async () => {
    try {
      // API call to request OTP
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_UR}/auth/reset-ps`, {
        email,
      });
      setIsModalVisible(true);
    } catch (error) {
      console.error(
        "Error requesting OTP:",
        error.response?.data || error.message
      );
    }
  };

  const handleResendOtp = async () => {
    try {
      // API call to resend OTP
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_UR}/auth/resend-otp`, {
        email,
      });
    } catch (error) {
      console.error(
        "Error resending OTP:",
        error.response?.data || error.message
      );
    }
  };

  const handleReset = async () => {
    try {
      // API call to verify OTP and reset password
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_UR}/auth/reset-ps-otp`, {
        email,
        otp,
        newPass: newPassword, // Send new password
      });
      setIsModalVisible(false);
      router.push("/loginUser"); // Redirect to login after reset
    } catch (error) {
      console.error(
        "OTP Verification Failed:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl text-gray-700 font-bold text-center mb-6">
          Forgot Password
        </h2>
        <Form layout="vertical">
          <Form.Item label="Email" required>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              className="w-full"
              onClick={handleResetPassword}
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Modal
        title="Enter OTP & New Password"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical">
          <Form.Item label="OTP" required>
            <Input value={otp} onChange={(e) => setOtp(e.target.value)} />
          </Form.Item>
          <Form.Item label="New Password" required>
            <Input.Password
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Item>
          <div className="flex justify-between">
            <Button onClick={handleResendOtp}>Resend OTP</Button>
            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
            <Button type="primary" onClick={handleReset}>
              Reset Password
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
