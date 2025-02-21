"use client";
import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

export default function UserDashboard() {
  const router = useRouter();
  const [pending, setPendings] = useState([]);
  const [scheduled, setSceduled] = useState([]);
  const [appliedList, setAppliedList] = useState([]);
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
    const fetchPendings = async () => {
      try {
        const token = Cookies.get("access_token");
        if (!token) {
          message.error("No token found, please log in.");
          return;
        }
        const response = await axios.get(
          "http://localhost:3001/job-applications/applicationPending",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPendings(response.data); // Assuming response.data contains the job list
      } catch (error) {
        console.error("Error fetching Pendings Applications:", error);
      }
    };

    const fetchSceduled = async () => {
      try {
        const token = Cookies.get("access_token");
        if (!token) {
          message.error("No token found, please log in.");
          return;
        }
        const response = await axios.get(
          "http://localhost:3001/job-applications/applicationScheduled",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSceduled(response.data);
      } catch (error) {
        console.error("Error fetching Scedueld Applications:", error);
      }
    };

    const fetchAppliedList = async () => {
      try {
        const token = Cookies.get("access_token");
        if (!token) {
          message.error("No token found, please log in.");
          return;
        }
        const response = await axios.get(
          "http://localhost:3001/job-applications/appliedJobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ); // Your API endpoint here
        setAppliedList(response.data); // Assuming response.data contains the job list
      } catch (error) {
        console.error("Error fetching Applied List:", error);
      }
    };

    fetchAppliedList();
    fetchSceduled();
    fetchPendings();
    fetchJobs();
  }, []);

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
    Cookies.remove("access_token");
    router.push("/loginUser");
  };

  const myProfile = () => {
    router.push("/user/profile");
  };
  const appliedJobs = () => {
    router.push("/user/applied");
  };

  const pendingApplications = () => {
    router.push("/user/pending");
  };

  const interviewScheduled = () => {
    router.push("/user/scheduled");
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
        {/* <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-sm font-semibold text-gray-700">
            Total Applications
          </h2>
          <p className="text-2xl font-bold text-blue-500">{jobs.length}</p>
        </div> */}
        <div
          className="bg-white p-4 shadow rounded-lg cursor-pointer hover:bg-gray-200 transition duration-300"
          onClick={() => {
            pendingApplications();
          }}
        >
          <h2 className="text-sm font-semibold text-gray-700">
            Applications Pending
          </h2>
          <p className="text-2xl font-bold text-yellow-500">{pending.length}</p>
        </div>
        <div
          className="bg-white p-4 shadow rounded-lg cursor-pointer hover:bg-gray-200 transition duration-300"
          onClick={() => {
            interviewScheduled();
          }}
        >
          <h2 className="text-sm font-semibold text-gray-700">
            Interviews Scheduled
          </h2>
          <p className="text-2xl font-bold text-green-500">
            {scheduled.length}
          </p>
        </div>
        <div
          className="bg-white p-4 shadow rounded-lg cursor-pointer hover:bg-gray-200 transition duration-300"
          onClick={() => {
            appliedJobs();
          }}
        >
          <h2 className="text-sm font-semibold text-gray-700">
            Applied Applications
          </h2>
          <p className="text-2xl font-bold text-blue-500">
            {appliedList.length}
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
