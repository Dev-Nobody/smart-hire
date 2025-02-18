"use client";
import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function UserDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/job-management/get-list"
        ); // Your API endpoint here
        setJobs(response.data); // Assuming response.data contains the job list
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);
  console.log(jobs, "-------------JOBS");

  // Dummy data for applied jobs
  // const appliedJobs = [
  //   {
  //     key: "1",
  //     title: "Software Engineer",
  //     status: "Pending Review",
  //     date: "2023-12-20",
  //   },
  //   {
  //     key: "2",
  //     title: "Marketing Specialist",
  //     status: "Interview Scheduled",
  //     date: "2023-12-22",
  //   },
  //   {
  //     key: "3",
  //     title: "Product Manager",
  //     status: "Rejected",
  //     date: "2023-12-18",
  //   },
  // ];

  const columns = [
    {
      title: "Job Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    // {
    //   title: "Applied Date",
    //   dataIndex: "date",
    //   key: "date",
    // },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() => router.push(`/user/jobs/${record.id}`)}
          >
            View Details
          </Button>
        );
      },
    },
  ];

  const LogoutSession = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const myProfile = () => {
    router.push("/user/profile");
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">
          User Dashboard
        </h1>
        <div>
          <Button onClick={LogoutSession}>Logout</Button>
          <Button onClick={myProfile}>My Profile</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-sm font-semibold text-gray-700">
            Total Applications
          </h2>
          <p className="text-2xl font-bold text-blue-500">{jobs.length}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-sm font-semibold text-gray-700">
            Applications Pending
          </h2>
          <p className="text-2xl font-bold text-yellow-500">
            {jobs.filter((job) => job.status === "Pending Review").length}
          </p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-sm font-semibold text-gray-700">
            Interviews Scheduled
          </h2>
          <p className="text-2xl font-bold text-green-500">
            {jobs.filter((job) => job.status === "Interview Scheduled").length}
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
  );
}
