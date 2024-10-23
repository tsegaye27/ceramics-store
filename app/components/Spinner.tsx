"use client";
import React from "react";

const Spinner = () => {
  return (
    <div className=" inset-0 flex items-center  h-[100vh] justify-center bg-gray-100 bg-opacity-75 z-50">
      <div className="h-16 w-16 border-8 border-t-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
