import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate, generateMessage } from "@/lib/utils";

const ActivityItem = ({ activity }: { activity: any }) => {
  return (
    <li className="flex items-center gap-x-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={activity.userImage} />
      </Avatar>
      <div className="flex flex-col space-y-0.5">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-neutral-700 lowercase">
            {activity.username}
          </span>
          {generateMessage(activity)}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(activity.createdAt)}
        </p>
      </div>
    </li>
  );
};

export default ActivityItem;
