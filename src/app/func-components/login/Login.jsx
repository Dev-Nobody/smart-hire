"use client";
import { React, useState } from "react";
import axios from "axios";
import { Form, Input, Button, Checkbox } from "antd";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/auth/signin",
        values
      );
      if (response.status === 201) {
        console.log("Login Successful:", response.data);
        if (response.data.access_token) {
          localStorage.setItem("token", response.data.access_token); // Save token

          console.log("Redirecting to admin page...");
          router.push("/admin");
        }

        // Redirect to admin page
      }
    } catch (error) {
      setLoading(false);
      console.error("Login Failed:", error.response?.data || error.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
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
            label="email"
            name="email"
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

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "LOGIN"
              )}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
