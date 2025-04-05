import React from "react";
import { AiOutlineLock } from "react-icons/ai";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-4/5 sm:w-96">
        <AiOutlineLock className="text-6xl text-red-500 mb-4 mx-auto" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Unauthorized Access
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Sorry, this page is only accessible to Admin users.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-200"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
