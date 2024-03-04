"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { getActivitiesByCardId } from "@/lib/actions/activity.action";
import { ActivityIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import ActivityItem from "./ActivityItem";

const CardActivity = ({ activities }: { activities: any }) => {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <ActivityIcon className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Activity</p>
        {activities.length > 0 && (
          <ol className="mt-2 space-y-4">
            {activities.map((activity: any) => {
              return <ActivityItem activity={activity} key={activity._id} />;
            })}
          </ol>
        )}
      </div>
    </div>
  );
};

export default CardActivity;
