"use client";

import React, { useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createBoardSchema } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createBoard } from "@/lib/actions/board.action";
import { useOrganization } from "@clerk/nextjs";
import FormPicker from "./FormPicker";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
  side: "top" | "right" | "left" | "bottom";
  sideOffset: number;
}

const BoardPopover = ({ children, side, sideOffset }: Props) => {
  const form = useForm<z.infer<typeof createBoardSchema>>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      name: "",
    },
  });

  const navigate = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [imgData, setImgData] = useState("");
  const { organization } = useOrganization();

  async function onSubmit(values: z.infer<typeof createBoardSchema>) {
    const { newBoard }: any = await createBoard({
      title: values.name,
      organizationId: organization?.id,
      imgData: imgData,
    });

    toast.success("Board created");
    buttonRef.current?.click();
    form.setValue("name", "");
    navigate.push("/boards/" + newBoard._id);

    console.log(values);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent side={side} sideOffset={sideOffset}>
        <div className="text-sm font-medium text-center tex-neutral-600 pb-4">
          Create board
        </div>
        <FormPicker setImgData={setImgData} />
        <PopoverClose asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
            ref={buttonRef}
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-neutral-700">
                    Board Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="my-board"
                      value={form.getValues("name")}
                      onChange={(e) => {
                        form.setValue("name", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Create
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

export default BoardPopover;
