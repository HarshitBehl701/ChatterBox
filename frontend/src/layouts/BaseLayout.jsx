import React from "react";
import Navbar from "../components/Navbar";
import { markUserOffline,markUserOnline } from "../api/user";

function BaseLayout({ children }) {

  //when   user disconnects from the   network
  window.addEventListener('offline',async  () => {
    await markUserOffline();
  });

  //when   user connectes to  the  network
  window.addEventListener('online', async () => {
    await  markUserOnline();
  });
  
  //when  the  user close the browser
  window.addEventListener('beforeunload',async  () => {
    await markUserOffline();
  });

  return (
    <>
      <Navbar />
      <div className="p-4 sm:ml-64  bg-gray-950  h-screen  overflow-hidden">
        <div className="p-4 text-white rounded-lg mt-14">
          {children}
        </div>
      </div>
    </>
  );
}

export default BaseLayout;
