"use client";
import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message, Modal } from "antd";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Register() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState(""); // Store email for verification
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const onFinish = async (values) => {
    try {
      setIsModalOpen(true);
      const response = await axios.post("http://localhost:3001/auth/signup", {
        ...values,
        role: "user",
      });
      if (response.status === 201) {
        console.log("Register Successful:", response.data);
        message.success("Profile created successfully!");
        setEmail(values.email); // Store email for verification
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Registration failed!");
      console.error("Register Failed:", error.response?.data || error.message);
    }
  };

  const verifyOtp = async () => {
    if (!token) {
      message.error("Please enter the verification code!");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3001/auth/verify-email",
        {
          email,
          otp: token,
        }
      );

      message.success("Email verified successfully!");
      setIsModalOpen(false);
      router.push("/loginUser");
    } catch (error) {
      message.error(error.response?.data?.message || "Verification failed!");
    }
  };

  const resendOtp = async () => {
    try {
      await axios.post("http://localhost:3001/auth/resend-otp", { email });
      message.success("Verification code resent successfully!");
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to resend code!");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Please fill in all required fields correctly!");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please input your phone number!" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Phone number must be 10 digits long",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Register
            </Button>
          </Form.Item>
        </Form>

        {/* Already Have an Account */}
        <div className="text-center mt-4">
          <span className="text-black">
            Already Have an Account?
            <span
              className="text-blue-600 cursor-pointer hover:underline ml-1"
              onClick={() => router.push("/loginUser")}
            >
              Login In
            </span>
          </span>
        </div>
      </div>

      {/* Email Verification Modal */}
      <Modal
        title="Verify Your Email"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <p>Enter the verification code sent to {email}.</p>
        <Input
          placeholder="Enter verification code"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="mb-3"
        />
        <div className="flex justify-end space-x-2">
          <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          <Button type="default" onClick={resendOtp}>
            Resend Code
          </Button>
          <Button type="primary" onClick={verifyOtp}>
            Verify
          </Button>
        </div>
      </Modal>
    </div>
  );
}
