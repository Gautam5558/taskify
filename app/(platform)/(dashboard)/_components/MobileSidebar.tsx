"use client";
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

const MobileSidebar = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="block md:hidden">
      <Sheet>
        <SheetTrigger>
          <Menu className="h-4 w-4 mr-3" />
        </SheetTrigger>
        <SheetContent side="left">
          <Sidebar storageKey="mobile-storage-key" />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileSidebar;
