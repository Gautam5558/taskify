"use client";
import { createBoardSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { updateBoardTitle } from "@/lib/actions/board.action";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useUser } from "@clerk/nextjs";

const BoardTitleForm = ({
  board,
  orgId,
}: {
  board: any;
  orgId: string | null | undefined;
}) => {
  const form = useForm<z.infer<typeof createBoardSchema>>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      name: board.title,
    },
  });
  const [isForm, setIsform] = useState(false);
  const [updating, setUpdating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { user } = useUser();

  useOnClickOutside(formRef, () => {
    setIsform(false);
  });

  useEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setIsform(false);
    }
  });

  async function onSubmit(values: z.infer<typeof createBoardSchema>) {
    setUpdating(true);
    await updateBoardTitle({
      boardId: board._id,
      title: values.name,
      orgId,
      userId: user?.id,
      username: user?.fullName,
      userImage: user?.imageUrl,
    });
    setUpdating(false);
    setIsform(false);
    toast.success("Board Title Updated");
    console.log(values);
  }

  return (
    <div>
      {isForm === true ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            ref={formRef}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      ref={inputRef}
                      value={form.getValues("name")}
                      className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 "
                      onChange={(e) => {
                        form.setValue("name", e.target.value);
                      }}
                      disabled={updating}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-red-500" />
                </FormItem>
              )}
            />
          </form>
        </Form>
      ) : (
        <Button
          className="font-bold text-lg h-auto w-auto p-1 px-2"
          variant="transparent"
          onClick={(e) => {
            setIsform(true);
            setTimeout(() => {
              inputRef.current?.focus();
            });
          }}
        >
          {form.getValues("name")}
        </Button>
      )}
    </div>
  );
};

export default BoardTitleForm;
