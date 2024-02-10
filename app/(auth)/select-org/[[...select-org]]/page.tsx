import { OrganizationList } from "@clerk/nextjs";
import React from "react";

const Page = () => {
  return (
    <OrganizationList
      hidePersonal
      afterSelectOrganizationUrl="/organization/:organizationId"
      afterCreateOrganizationUrl="/organization/:organizationId"
    />
  );
};

export default Page;
