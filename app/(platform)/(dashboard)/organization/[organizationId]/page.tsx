import React from "react";
import Info from "./_components/Info";
import { Separator } from "@/components/ui/separator";
import BoardList from "./_components/BoardList";
import { checkSubscription } from "@/lib/actions/subscription.action";

const OrganizationPage = async ({
  params,
}: {
  params: { organizationId: string };
}) => {
  const isPro = await checkSubscription();

  return (
    <div className="w-full mb-20">
      <Info isPro={isPro} />
      <Separator className="px-2 md:px-4" />
      <BoardList organizationId={params.organizationId} />
    </div>
  );
};

export default OrganizationPage;
