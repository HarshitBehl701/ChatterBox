import React from "react";
import Navbar from "../components/Navbar";

function BaseLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="p-4 sm:ml-64  bg-gray-950  h-screen  overflow-hidden">
        <div className="p-4 text-white rounded-lg mt-14">{children}</div>
      </div>
    </>
  );
}

export default BaseLayout;
