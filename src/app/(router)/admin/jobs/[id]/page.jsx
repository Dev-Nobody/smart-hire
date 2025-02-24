"use client";

import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

const Applicants = () => {
  const router = useRouter();
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]); // State to store the applicants data

  // Fetch applicants
  const fetchApplicants = async () => {
    console.log("Entered");
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/job-applications/search/${+id}`
      );
      console.log("Fetched Applicants:", response.data); // Log the response data

      setApplicants(response.data); // Set applicants data in state
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };

  // Update application status function
  const updateApplicantsStatus = async (applicationId, newStatus) => {
    try {
      const token = Cookies.get("access_token");
      if (!token) {
        console.error("No token found, please log in.");
        return;
      }
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/job-applications/check`,
        {
          ApplicationId: applicationId,
          applicationStatus: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // If the status update is successful, update the local state
      setApplicants((prevApplicants) =>
        prevApplicants.map((applicant) =>
          applicant.id === applicationId
            ? { ...applicant, applicationStatus: newStatus }
            : applicant
        )
      );
      console.log(`Applicant ID ${applicationId} updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  // Table columns
  const columns = [
    {
      title: "Job Title",
      dataIndex: ["job", "title"],
      key: "name",
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
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
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="default"
            onClick={() => updateApplicantsStatus(record.id, "Shortlisted")}
          >
            Shortlist
          </Button>
          <Button
            danger
            onClick={() => updateApplicantsStatus(record.id, "Rejected")}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">
        Applicant for Job
      </h1>
      <Table
        columns={columns}
        dataSource={applicants}
        pagination={{ pageSize: 5 }}
        className="bg-white rounded-lg shadow"
      />
      <Button
        className="mt-4"
        type="default"
        onClick={() => router.push("/admin")}
      >
        Back to Dashboard
      </Button>
    </div>
  );
};

export default Applicants;
