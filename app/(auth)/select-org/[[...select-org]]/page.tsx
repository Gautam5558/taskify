import { OrganizationList, auth } from "@clerk/nextjs";
import React from "react";

const Page = () => {
  const { orgId } = auth();
  return (
    <OrganizationList
      hidePersonal
      afterSelectOrganizationUrl="/organization/:id"
      afterCreateOrganizationUrl="/organization/:id"
    />
  );
};

export default Page;
