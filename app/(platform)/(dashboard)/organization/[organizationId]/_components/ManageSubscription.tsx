"use client";
import { Button } from "@/components/ui/button";
import { redirectStripe } from "@/lib/actions/subscription.action";
import React, { useState } from "react";

const ManageSubscription = ({ isPro }: { isPro: boolean }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const { data }: any = await redirectStripe();
    window.location.href = data;
    setLoading(false);
  };

  return (
    <div>
      <Button
        variant="primary"
        onClick={() => {
          handleClick();
        }}
        disabled={loading}
        className="disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPro ? "Manage Subscription" : "Upgrade to Pro Subscription"}
      </Button>
    </div>
  );
};

export default ManageSubscription;
