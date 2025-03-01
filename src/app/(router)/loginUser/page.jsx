"use client";
import React, { useEffect } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  // useEffect( Cookies.remove("access_token"),[]);
  const router = useRouter();

  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/signin`,
        values
      );

      if (response.status === 201) {
        console.log("Login Successful:", response.data);

        const token = response.data.access_token;

        if (response.data.access_token) {
          Cookies.set("access_token", response.data.access_token, {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
          });

          const decodeToken = jwtDecode(token);
          const userRole = decodeToken.role;

          console.log("Redirecting to user page...");
          if (userRole === "admin") {
            await router.push("/admin"); // Redirect to admin dashboard
          } else {
            await router.push("/user"); // Redirect to user page
          }

          router.refresh();
        }
      }
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl text-gray-700 font-bold text-center mb-6">
          Login
        </h2>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
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
          <div className="flex justify-between items-center mb-4">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => router.push("/forgotPassword")}
            >
              Forgot Password?
            </span>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Login
            </Button>
          </Form.Item>{" "}
          <div className="text-center mt-4">
            <span className="text-black w-1">
              Don't have an account?
              <span
                className="text-blue-600 cursor-pointer hover:underline ml-1"
                onClick={() => router.push("/register")}
              >
                Sign up here
              </span>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
}
