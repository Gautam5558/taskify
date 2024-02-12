import React from "react";
import OrgControl from "./_components/OrgControl";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <OrgControl />
      {children}
    </>
  );
};

export default Layout;
