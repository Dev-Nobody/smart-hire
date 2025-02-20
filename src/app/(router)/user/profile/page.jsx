"use client";
import React, { useEffect, useState } from "react";
import { Input, Button, Form, Upload, message } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function UserProfile() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Store selected file

  const defaultProfileImage = "https://via.placeholder.com/150?text=Profile";

  const fetchUserProfile = async () => {
    try {
      const token = Cookies.get("access_token");
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
      console.log("User Data:", user);

      if (user) {
        form.setFieldsValue({
          name: user.username || "User",
          email: user.email || "",
          phone: user.phoneNumber || "0000",
        });

        setProfileImage(user.profileImage || defaultProfileImage);
      } else {
        message.error("No user data found.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      message.error("Failed to fetch user data.");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Handle Image Change (Only Updates Preview)
  const handleUpload = async ({ file }) => {
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result); // Show preview
      setSelectedImage(file); // Save selected file for later upload
    };
    reader.readAsDataURL(file);
  };

  // Handle Profile Update
  const onFinish = async (values) => {
    try {
      setLoading(true);
      // const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("username", values.name);
      formData.append("email", values.email);
      formData.append("phoneNumber", values.phone);
      if (selectedImage) {
        formData.append("img", selectedImage); // Upload image if changed
      }

      await axios.put("http://localhost:3001/user/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Profile updated successfully!");
      setSelectedImage(null); // Clear selected image after upload
      router.push("/user");
    } catch (error) {
      console.error("Update error:", error);
      message.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Please fill all required fields.");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">User Profile</h1>

      {/* Profile Image Section */}
      <div className="relative mb-6">
        <img
          src={profileImage || defaultProfileImage}
          alt="Profile"
          className="w-44 h-44 rounded-full border-4 border-gray-300 shadow-lg object-cover"
        />
        <Upload customRequest={handleUpload} showUploadList={false}>
          <Button
            icon={<UploadOutlined />}
            loading={loading}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-full px-3 py-1 shadow-md"
          >
            Change
          </Button>
        </Upload>
      </div>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2"
              loading={loading}
            >
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
