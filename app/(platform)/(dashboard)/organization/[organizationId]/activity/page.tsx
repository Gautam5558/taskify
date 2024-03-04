import { getActivitiesByOrgId } from "@/lib/actions/activity.action";
import React, { Suspense, useState } from "react";
import Info from "../_components/Info";
import { Separator } from "@/components/ui/separator";
import ActivityList from "./_components/ActivityList";
import { checkSubscription } from "@/lib/actions/subscription.action";

const page = async ({ params }: { params: { organizationId: string } }) => {
  const { data }: any = await getActivitiesByOrgId({
    orgId: params.organizationId,
  });
  const isPro = await checkSubscription();

  return (
    <div className="w-full mb-2">
      <Info isPro={isPro} />
      <Separator className="my-2" />
      <Suspense fallback={<ActivityList.Skeleton />}>
        <ActivityList activities={data} />
      </Suspense>
    </div>
  );
};

export default page;
