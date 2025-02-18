import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">
        Welcome to Smart Hire
      </h1>
      <p className="text-lg mt-4 text-gray-600">
        Simplifying the hiring process for companies and job seekers.
      </p>
      <Link href="/login" legacyBehavior>
        <a className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          Get Started
        </a>
      </Link>
    </div>
  );
}
