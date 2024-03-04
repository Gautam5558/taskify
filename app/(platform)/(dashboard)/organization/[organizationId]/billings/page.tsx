import { checkSubscription } from "@/lib/actions/subscription.action";
import React from "react";
import Info from "../_components/Info";
import { Separator } from "@/components/ui/separator";
import ManageSubscription from "../_components/ManageSubscription";

const Billing = async () => {
  const isPro = await checkSubscription();

  return (
    <div>
      <Info isPro={isPro} />
      <Separator />
      <ManageSubscription isPro={isPro} />
    </div>
  );
};

export default Billing;
