"use client";
import { Input } from "@/components/ui/input";
import { listTitleUpdate } from "@/lib/actions/list.action";
import { usePathname } from "next/navigation";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import ListOptions from "./ListOptions";

const ListHeader = ({ list }: { list: any }) => {
  const [isInput, setIsInput] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState<string>(list.title);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  const handleListTitleChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.length < 3) {
      toast.error("List title should be grater than 3 characters");
      return setError("List Title should be greater than 3 characters");
    }

    try {
      setLoading(true);
      await listTitleUpdate({ listId: list._id, title, pathname });
      setLoading(false);
      setIsInput(false);
      setError(null);
      toast.success("List title updated successfully");
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useOnClickOutside(formRef, () => {
    setIsInput(false);
    setError(null);
  });

  useEventListener("keydown", (e) => {
    const key = e.key;
    if (key === "Escape") {
      setIsInput(false);
      setError(null);
    }
  });

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2 w-full">
      {isInput === true ? (
        <form
          ref={formRef}
          className="flex-1 px-[2px] "
          onSubmit={(e) => handleListTitleChange(e)}
        >
          <Input
            type="text"
            placeholder="Enter list title..."
            ref={inputRef}
            className="flex-1 px-[7px] py-1 h-7 text-sm w-full font-medium border-transparent hover:border-input focus:border-input transition truncate"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            disabled={loading}
          />
          {error && (
            <div className="text-[10px] mt-2 text-center text-red-500">
              {error}
            </div>
          )}
        </form>
      ) : (
        <div
          className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent cursor-pointer"
          onClick={(e) => {
            setIsInput(true);
            setTimeout(() => {
              inputRef.current?.focus();
            });
          }}
        >
          {list.title}
        </div>
      )}
      <ListOptions list={list} />
    </div>
  );
};

export default ListHeader;
