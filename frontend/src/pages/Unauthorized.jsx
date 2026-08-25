import React from "react";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-bg min-h-screen flex items-center justify-center">

      <div className="w-full max-w-md card-padded text-center">

        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-2xl font-bold">
            403
          </div>
        </div>

        <h1 className="page-heading">
          Unauthorized Access
        </h1>

        <p className="page-subheading">
          You don't have permission to access this page.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 btn-back"
        >
          ← Go Back
        </button>

      </div>
    </div>
  );
};

export default UnauthorizedPage;
