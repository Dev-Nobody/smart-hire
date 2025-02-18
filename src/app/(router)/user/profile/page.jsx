"use client";
import React, { useEffect, useState } from "react";
import { Input, Button, Form, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    console.log("Profile updated:", values);
    message.success("Profile updated successfully!");
    router.push("/user");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Please fill all required fields.");
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files.");
      }
      return isImage || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      if (info.file.status === "uploading") {
        setLoading(true);
      } else if (info.file.status === "done" || info.file.status === "error") {
        setLoading(false);
        message.success(`${info.file.name} uploaded successfully.`);
      }
    },
  };

  const fetchUserProfile = async (form) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("No token found, please log in.");
        return;
      }

      const response = await axios.get("http://localhost:3001/user/get-me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const user = response.data;
      console.log("Current User Data:", user);

      if (user) {
        // Set form fields with fetched user data
        form.setFieldsValue({
          name: user.name || "User",
          email: user.email || "",
          phone: user.phone || "0000",
        });
      } else {
        message.error("No user data found.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      message.error("Failed to fetch user data.");
    }
  };

  useEffect(() => {
    fetchUserProfile(form);
  }, [form]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">User Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
        <Form
          form={form}
          name="profile"
          initialValues={{
            name: "John Doe",
            email: "johndoe@example.com",
            phone: "123-456-7890",
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              { required: true, message: "Please enter your full name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter your email address!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Profile Picture">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />} loading={loading}>
                Upload Profile Picture
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2"
            >
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
