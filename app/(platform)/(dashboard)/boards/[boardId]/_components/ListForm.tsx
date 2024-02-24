"use client";
import React, { useRef, useState } from "react";
import ListWrapper from "./ListWrapper";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { toast } from "sonner";
import { createList } from "@/lib/actions/list.action";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";

const ListForm = ({ boardId }: { boardId: string }) => {
  const [isForm, setIsForm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [newListName, setNewListName] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [isCreating, setIsCreating] = useState(false);

  const pathname = usePathname();

  useOnClickOutside(formRef, () => {
    setIsForm(false);
    setError(null);
  });

  useEventListener("keydown", (e) => {
    const key = e?.key as any;
    if (key === "Escape") {
      setIsForm(false);
      setError(null);
    }
  });

  const createNewList = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (newListName.length < 3) {
      toast.error("List title should be more than 3 characters");
      return setError("List title should have a minimum of 3 characters");
    }
    try {
      setIsCreating(true);
      await createList({ title: newListName, boardId, pathname: pathname });
      setIsCreating(false);
      setError(null);
      setIsForm(false);
      toast.success(`List ${newListName} created`);
      setNewListName("");
    } catch (err) {
      setIsCreating(false);
      console.log(err);
    }
  };

  if (isForm) {
    return (
      <ListWrapper>
        <form
          className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
          ref={formRef}
        >
          <Input
            ref={inputRef}
            type="text"
            value={newListName}
            className="text-sm px-2 w-full py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
            onChange={(e) => {
              setNewListName(e.target.value);
            }}
            placeholder="Enter list title..."
          />
          {error && <div className="text-[10px] text-red-500">{error}</div>}
          <div className="flex items-center gap-x-1">
            <Button
              type="submit"
              onClick={(e) => createNewList(e)}
              disabled={isCreating}
              className="disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add List
            </Button>
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => {
                setIsForm(false);
                setError(null);
              }}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <button
        onClick={(e) => {
          setIsForm(true);
          setTimeout(() => {
            inputRef.current?.focus();
          });
        }}
        className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a list
      </button>
    </ListWrapper>
  );
};

export default ListForm;
