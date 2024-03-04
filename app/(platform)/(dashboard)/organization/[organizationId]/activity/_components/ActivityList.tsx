import ActivityItem from "@/app/(platform)/(dashboard)/boards/[boardId]/_components/ActivityItem";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ActivityList = ({ activities }: { activities: any }) => {
  return (
    <ol className="space-y-4 mt-4 custom-scrollbar overflow-hidden max-h-[72vh] overflow-y-scroll">
      {activities.length === 0 ? (
        <p className="text-xs text-center text-muted-foreground">
          No activity found inside this organization
        </p>
      ) : (
        activities.map((activity: any) => {
          return <ActivityItem key={activity._id} activity={activity} />;
        })
      )}
    </ol>
  );
};

export default ActivityList;

ActivityList.Skeleton = function ActivityListSkeleton() {
  return (
    <ol className="space-y-4 mt-4">
      <Skeleton className="w-[80%] h-14" />
      <Skeleton className="w-[50%] h-14" />
      <Skeleton className="w-[70%] h-14" />
      <Skeleton className="w-[80%] h-14" />
      <Skeleton className="w-[75%] h-14" />
    </ol>
  );
};
