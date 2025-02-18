"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "antd";
import axios from "axios";

export default function JobDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [jobDetails, setJobDetails] = useState(null);

  const ApplyForJob = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        console.error("No token found, please log in.");
        return;
      }

      console.log(typeof id);
      const response = await axios.post(
        "http://localhost:3001/job-applications/apply",
        { jobId: +id }, // Correct payload format
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
            "Content-Type": "application/json",
          },
        }
      );

      router.push("/user"); // Redirect on success
    } catch (error) {
      console.error("Error While Applying:", error);
    }
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/job-management/search/${id}`
        );
        console.log("Job Details:", response.data);
        setJobDetails(response.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

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
        <p className="mt-4 text-gray-700">{job.description}</p>
        <h2 className="text-xl font-bold mt-6">Requirements</h2>
        <ul className="list-disc list-inside mt-2">
          <li>{job.requirements}</li>
        </ul>
        <div className="mt-6 flex justify-end">
          <Button
            type="primary"
            onClick={() => ApplyForJob()}
            className="bg-blue-500 mr-3 hover:bg-blue-600 text-white font-semibold rounded-md"
          >
            Apply
          </Button>
          <Button
            type="primary"
            onClick={() => router.back()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
