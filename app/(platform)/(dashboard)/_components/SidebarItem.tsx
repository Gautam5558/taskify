"use client";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Activity, CreditCard, Layout, Settings } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export type Organization = {
  id: string;
  slug: string;
  imageUrl: string;
  name: string;
};

interface Props {
  isActive: boolean;
  isExpanded: boolean;
  organization: Organization;
  handleExpand: (id: string) => void;
  storageKey: string;
}

const SidebarItem = ({
  isActive,
  isExpanded,
  organization,
  handleExpand,
  storageKey,
}: Props) => {
  const path = usePathname();
  const navigate = useRouter();

  const routes = [
    {
      label: "Boards",
      icon: <Layout className="h-4 w-4 mr-2" />,
      path: "/organization/" + organization.id,
    },
    {
      label: "Activity",
      icon: <Activity className="h-4 w-4 mr-2" />,
      path: "/organization/" + organization.id + "/activity",
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4 mr-2" />,
      path: "/organization/" + organization.id + "/settings",
    },
    {
      label: "Billing",
      icon: <CreditCard className="h-4 w-4 mr-2" />,
      path: "/organization/" + organization.id + "/billings",
    },
  ];

  const handleClick = (path: string) => {
    navigate.push(path);
  };

  return (
    <AccordionItem value={organization.id} className="border-none">
      <AccordionTrigger
        onClick={() => {
          handleExpand(organization.id);
        }}
        className={cn(
          "flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline",
          isActive && !isExpanded && "bg-sky-500/10 text-sky-700"
        )}
      >
        <div className="flex items-center gap-x-2">
          <div className="w-7 h-7 relative">
            <Image
              fill
              alt="organization"
              className="rounded-sm object-cover"
              src={organization.imageUrl}
            />
          </div>
          <span className="font-medium text-sm">{organization.name}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-1 text-neutral-700">
        {routes.map((route) => {
          return storageKey !== "t-sidebar-state" ? (
            <SheetClose key={route.label} className="w-full">
              <Button
                key={route.label}
                size="sm"
                onClick={() => {
                  handleClick(route.path);
                }}
                className={cn(
                  "w-full font-normal justify-start pl-10 mb-1",
                  path === route.path && "bg-sky-500/10 text-sky-700"
                )}
                variant="ghost"
              >
                {route.icon}
                {route.label}
              </Button>
            </SheetClose>
          ) : (
            <Button
              key={route.label}
              size="sm"
              onClick={() => {
                handleClick(route.path);
              }}
              className={cn(
                "w-full font-normal justify-start pl-10 mb-1",
                path === route.path && "bg-sky-500/10 text-sky-700"
              )}
              variant="ghost"
            >
              {route.icon}
              {route.label}
            </Button>
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
};

export default SidebarItem;
