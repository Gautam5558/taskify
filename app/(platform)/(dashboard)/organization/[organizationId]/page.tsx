import React from "react";
import Info from "./_components/Info";
import { Separator } from "@/components/ui/separator";
import BoardList from "./_components/BoardList";

const OrganizationPage = ({
  params,
}: {
  params: { organizationId: string };
}) => {
  return (
    <div className="w-full mb-20">
      <Info />
      <Separator className="px-2 md:px-4" />
      <BoardList organizationId={params.organizationId} />
    </div>
  );
};

export default OrganizationPage;
