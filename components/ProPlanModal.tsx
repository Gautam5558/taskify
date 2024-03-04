"use client";
import React, { useRef, useState } from "react";
import { Dialog } from "./ui/dialog";
import { DialogContent } from "./ui/dialog";
import Image from "next/image";
import { Button } from "./ui/button";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { DialogClose } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { redirectStripe } from "@/lib/actions/subscription.action";

const ProPlanModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {
  const dialogRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useOnClickOutside(dialogRef, (e) => {
    setIsOpen(false);
  });

  useEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  });

  const handleClick = async () => {
    try {
      setLoading(true);
      const { data }: any = await redirectStripe();
      window.location.href = data;
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-md p-0 overflow-hidden" ref={dialogRef}>
        <DialogClose
          onClick={() => {
            setIsOpen(false);
          }}
          className="absolute z-[51] right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </DialogClose>
        <div className="aspect-video relative flex items-center justify-center">
          <Image
            src="/hero.svg"
            alt="modalImage"
            fill
            className="object-cover"
          />
        </div>
        <div className="text-neutral-700 mx-auto space-y-6 p-6">
          <h2 className="font-semibold text-xl">
            Upgrade to Taskify Pro Today!
          </h2>
          <p className="text-xs font-semibold text-neutral-600">
            Explore the bestb of Taskify
          </p>
          <div className="pl-3">
            <ul className="text-sm list-disc">
              <li>Unlimited boards</li>
              <li>Advanced checklists</li>
              <li> and security features</li>
              <li>And more!</li>
            </ul>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              handleClick();
            }}
            disabled={loading}
            className=" w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProPlanModal;
