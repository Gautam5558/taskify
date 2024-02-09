import React from "react";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full bg-slate-100">
      <Navbar />
      <div className="pt-40 pb-20 bg-slate-100">{children}</div>
      <Footer />
    </main>
  );
};

export default Layout;
