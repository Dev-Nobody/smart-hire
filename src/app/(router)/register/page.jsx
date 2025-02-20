"use client";
import React from "react";

import { Form, Input, Button, Checkbox, message } from "antd";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const router = useRouter();
  const onFinish = async (values) => {
    try {
      const response = await axios.post("http://localhost:3001/auth/signup", {
        ...values,
        role: "user",
      });
      if (response.status === 201) {
        console.log("Register Successful:", response.data);
        message.success("Profile updated successfully!");
        router.push("/loginUser");
      }
    } catch (error) {
      message.error(error.response.message);
      console.error("Login Failed:", error.response?.data || error.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);

    message.error("Please fill in all required fields correctly!");
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register </h2>
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
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
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
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

          <Form.Item>
            <p onClick={() => router.push("/loginUser")}>
              Already Have an Account? Login In
            </p>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
