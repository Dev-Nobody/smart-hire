"use client";
import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

export default function UserDashboard() {
  const router = useRouter();
  const [appliedList, setAppliedList] = useState([]);
  const [appliedStatus, setAppliedStatus] = useState([]);

  useEffect(() => {
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
  }, []);
  const columns = [
    {
      title: "Job Title",
      dataIndex: ["job", "title"],
      key: "title",
    },
    {
      title: "Category",
      dataIndex: ["job", "category"],
      key: "category",
    },
    {
      title: "Status",
      dataIndex: "applicationStatus",
      key: "status",
      render: (text) => (
        <span
          className={`px-3 py-1 rounded-md text-white ${
            text === "Shortlisted"
              ? "bg-green-500"
              : text === "Rejected"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        >
          {text}
        </span>
      ),
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

  const BackToHome = () => {
    router.push("/user");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">
          Applied Applications
        </h1>
        <div>
          <Button onClick={BackToHome}>Return To Home </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={appliedList}
        pagination={{ pageSize: 5 }}
        className="bg-white rounded-lg shadow"
      />
    </div>
  );
}
