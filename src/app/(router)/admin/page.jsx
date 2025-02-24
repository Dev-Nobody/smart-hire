"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

export default function Dashboard() {
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [pendings, setPendings] = useState([]);
  const [shortlisted, setShortlisted] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // State to control modal visibility
  const [jobToDelete, setJobToDelete] = useState(null); // State to store the job to be deleted
  const [form] = Form.useForm();

  useEffect(() => {
    fetchJobs();
    fetchApplicants();
    fetchPendings();
    fetchShortListed();
  }, []);

  // Fetch Pendings
  const fetchPendings = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_UR}/job-applications/pending`
      );
      console.log("Fetched Pendings:", response.data); // Log the response data

      setPendings(response.data); // Set applicants data in state
    } catch (error) {
      console.error("Error fetching Pendings:", error);
    }
  };

  const fetchShortListed = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_UR}/job-applications/shortlisted`
      );
      console.log("Fetched ShortListed:", response.data);

      setShortlisted(response.data);
    } catch (error) {
      console.error("Error fetching ShortListed:", error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_UR}/job-management/get-list`
      );
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      message.error("Failed to load job data.");
    }
  };

  const handleAddJob = async (values) => {
    try {
      const token = Cookies.get("access-token");
      if (!token) {
        message.error("No token found, please log in.");
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_UR}/job-management/create`,
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
        `${process.env.NEXT_PUBLIC_BASE_UR}/job-applications/getApplicants`
      );

      setApplicants(response.data.length);
    } catch (error) {
      console.error("Error fetching job applications:", error);
      return { error: "Failed to retrieve applicant count" };
    }
  };

  const setJobToDeleteHandler = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_UR}/job-management/delete-job/${jobToDelete.id}`
      );
      console.log("Job deleted successfully:", response);

      setIsDeleteModalVisible(false);
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const handleDelete = () => {
    setJobToDeleteHandler();
  };

  const columns = [
    { title: "Job Title", dataIndex: "title", key: "title" },
    { title: "Department", dataIndex: "category", key: "category" },
    { title: "Applicants", dataIndex: "applicants", key: "applicants" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>
          <Button
            className="mr-4"
            type="primary"
            onClick={() => router.push(`/admin/jobs/${record.id}`)}
          >
            View Applicants
          </Button>
          <Button
            type="danger"
            style={{
              backgroundColor: "#f44336", // Red color
              borderColor: "#f44336",
              color: "white",
            }}
            onClick={() => {
              setJobToDelete(record); // Set the job to delete
              setIsDeleteModalVisible(true); // Show delete confirmation modal
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const logoutSession = () => {
    // localStorage.removeItem("token");
    Cookies.remove("access_token");
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
            <p className="text-2xl font-bold text-yellow-500">
              {pendings.length}
            </p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-sm font-semibold text-gray-700">
              Interviews Scheduled
            </h2>
            <p className="text-2xl font-bold text-purple-500">
              {shortlisted.length}
            </p>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={jobs}
          pagination={{ pageSize: 5 }}
          className="bg-white rounded-lg shadow"
        />
      </div>

      {/* Delete Modal */}
      <Modal
        title="Confirm Deletion"
        visible={isDeleteModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="delete" type="primary" danger onClick={handleDelete}>
            Delete
          </Button>,
        ]}
      >
        <p>
          Are you sure you want to delete this job? This action cannot be
          undone.
        </p>
      </Modal>

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
