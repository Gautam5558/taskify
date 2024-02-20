import React from "react";
import Navbar from "./_components/Navbar";
import { Toaster } from "sonner";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Toaster />
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
