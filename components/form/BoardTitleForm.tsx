"use client";
import { createBoardSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
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

const BoardTitleForm = ({ board }: { board: any }) => {
  const form = useForm<z.infer<typeof createBoardSchema>>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      name: board.title,
    },
  });
  const [updating, setUpdating] = useState(false);

  async function onSubmit(values: z.infer<typeof createBoardSchema>) {
    setUpdating(true);
    await updateBoardTitle({ boardId: board._id, title: values.name });
    setUpdating(false);
    toast.success("Board Title Updated");
    console.log(values);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 text-center">
                <FormControl>
                  <Input
                    value={form.getValues("name")}
                    className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 "
                    onChange={(e) => {
                      form.setValue("name", e.target.value);
                    }}
                    disabled={updating}
                  />
                </FormControl>
                <FormMessage className="text-[10px] text-red-500" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default BoardTitleForm;
