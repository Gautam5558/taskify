"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Accordion } from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useLocalStorage } from "usehooks-ts";
import SidebarItem, { Organization } from "./SidebarItem";
import { SheetClose } from "@/components/ui/sheet";

interface Props {
  storageKey?: string;
}

const Sidebar = ({ storageKey = "t-sidebar-state" }: Props) => {
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {}
  );
  const { organization: activeOrganization, isLoaded: isLoadedOrg } =
    useOrganization();
  const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  const defaultAccordianValue: string[] = Object.keys(expanded).reduce(
    (acc: string[], key: string) => {
      if (expanded[key]) {
        acc.push(key);
      }
      return acc;
    },
    []
  );

  const handleExpand = (id: string) => {
    setExpanded((prev) => {
      return {
        ...prev,
        [id]: !prev[id],
      };
    });
  };

  if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
    return (
      <>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-10 w-[50%]" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <SidebarItem.Skeleton />
          <SidebarItem.Skeleton />
          <SidebarItem.Skeleton />
        </div>
      </>
    );
  }

  return (
    <>
      {storageKey === "t-sidebar-state" ? (
        <div className="font-medium text-xs flex items-center mb-1">
          <span className="pl-4">Workspaces</span>
          <Button type="button" size="icon" variant="ghost" className="ml-auto">
            <Link href="/select-org">
              <Plus className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="font-medium text-xs flex items-center mb-1 mt-3 justify-between">
          <span className="pl-4">Workspaces</span>
          <Button type="button" size="icon" variant="ghost">
            <Link href="/select-org">
              <SheetClose>
                <Plus className="h-4 w-4" />
              </SheetClose>
            </Link>
          </Button>
        </div>
      )}
      <Accordion
        type="multiple"
        defaultValue={defaultAccordianValue}
        className="space-y-2"
      >
        {userMemberships.data.map(({ organization }) => {
          return (
            <SidebarItem
              key={organization.id}
              isActive={activeOrganization?.id === organization.id}
              isExpanded={expanded[organization.id]}
              organization={organization as Organization}
              handleExpand={handleExpand}
              // Here handleExpand function is used to persist accordian state
              // The accordian expansion logic is handled by the accordian component itself
              storageKey={storageKey}
            />
          );
        })}
      </Accordion>
    </>
  );
};

export default Sidebar;
