"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, message } from "antd";
import axios from "axios";
import Cookies from "js-cookie";

export default function JobDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [jobDetails, setJobDetails] = useState(null);
  const [applyDetails, setApplyDetails] = useState(null);

  const ApplyForJob = async () => {
    try {
      const token = Cookies.get("access_token");
      if (!token) {
        message.error("No token found, please log in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/job-applications/apply",
        { jobId: +id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      router.push("/user");
    } catch (error) {
      console.error("Error While Applying:", error);
      alert(error);
    }
  };

  useEffect(() => {
    const appliedCheck = async () => {
      try {
        const token = Cookies.get("access_token"); // Fix: Add token retrieval
        if (!token) {
          message.error("No token found, please log in.");
          return;
        }

        const response = await axios.get(
          `http://localhost:3001/job-applications/appliedCheck/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Job Applied:", response.data);
        setApplyDetails(response.data);
      } catch (error) {
        console.error("Error fetching Applied details:", error);
      }
    };

    const fetchJobDetails = async () => {
      try {
        const token = Cookies.get("access_token");
        if (!token) {
          message.error("No token found, please log in.");
          return;
        }

        const response = await axios.get(
          `http://localhost:3001/job-management/search/${id}`
        );
        console.log("Job Details:", response.data);
        setJobDetails(response.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    appliedCheck();
    fetchJobDetails();
  }, []);

  const job = jobDetails;

  if (!job) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold text-red-600">Job not found</h1>
        <Button type="link" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600">{job.title}</h1>
        <p className="text-gray-500 mt-2">{job.department}</p>
        <p className="mt-4 text-gray-500">{job.description}</p>
        <h2 className="text-blue-600 text-xl font-bold mt-6 ">Requirements</h2>
        <ul className=" text-gray-500 list-disc list-inside mt-2">
          <li>{job.requirements}</li>
        </ul>
        <div className="mt-6 flex justify-end">
          <Button
            type="primary"
            onClick={() => ApplyForJob()}
            disabled={applyDetails !== null} // Prevents multiple applications
            className="bg-blue-500 mr-3 hover:bg-blue-600 text-white font-semibold rounded-md"
          >
            {applyDetails ? "Already Applied" : "Apply"}
          </Button>

          <Button
            type="primary"
            onClick={() => router.push("/user")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
