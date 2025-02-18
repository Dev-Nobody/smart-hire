"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Dashboard() {
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchJobs();
    fetchApplicants();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/job-management/get-list"
      );
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      message.error("Failed to load job data.");
    }
  };

  const handleAddJob = async (values) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("No token found, please log in.");
        return;
      }

      await axios.post(
        "http://localhost:3001/job-management/create",
        {
          ...values,
          salaryMin: Number(values.salaryMin),
          salaryMax: Number(values.salaryMax),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      message.success("Job added successfully!");
      fetchJobs(); // Refresh job list
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error adding job:", error);
      message.error("Failed to add job.");
    }
  };

  const fetchApplicants = async () => {
    try {
      // Fetch job applications list
      const response = await axios.get(
        "http://localhost:3001/job-applications/getApplicants"
      );

      setApplicants(response.data.length);
    } catch (error) {
      console.error("Error fetching job applications:", error);
      return { error: "Failed to retrieve applicant count" };
    }
  };

  const columns = [
    { title: "Job Title", dataIndex: "title", key: "title" },
    { title: "Department", dataIndex: "category", key: "category" },
    { title: "Applicants", dataIndex: "applicants", key: "applicants" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => router.push(`/admin/jobs/${record.id}`)}
        >
          View Applicants
        </Button>
      ),
    },
  ];

  const logoutSession = () => {
    localStorage.removeItem("token");
    router.push("/loginUser");
  };

  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold text-blue-600">Admin Dashboard</h1>
          <div className="space-x-2">
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
              Add Job
            </Button>
            <Button onClick={logoutSession}>Logout</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 mb-5">
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-sm font-semibold text-gray-700">Total Jobs</h2>
            <p className="text-2xl font-bold text-blue-500">{jobs.length}</p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-sm font-semibold text-gray-700">
              Total Applicants
            </h2>
            <p className="text-2xl font-bold text-green-500">{applicants}</p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-sm font-semibold text-gray-700">
              Pending Reviews
            </h2>
            <p className="text-2xl font-bold text-yellow-500">8</p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-sm font-semibold text-gray-700">
              Interviews Scheduled
            </h2>
            <p className="text-2xl font-bold text-purple-500">4</p>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={jobs}
          pagination={{ pageSize: 5 }}
          className="bg-white rounded-lg shadow"
        />
      </div>

      {/* Add Job Modal */}
      <Modal
        title="Add New Job"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddJob}>
          <Form.Item
            label="Job Title"
            name="title"
            rules={[{ required: true, message: "Please enter job title" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please enter category" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: "Please enter location" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Requirements"
            name="requirements"
            rules={[{ required: true, message: "Please enter requirements" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Min Salary"
            name="salaryMin"
            rules={[{ required: true, message: "Please enter min salary" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Max Salary"
            name="salaryMax"
            rules={[{ required: true, message: "Please enter max salary" }]}
          >
            <Input type="number" />
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Add Job
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
