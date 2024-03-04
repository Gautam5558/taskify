"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateCardDesciption } from "@/lib/actions/card.action";
import { useUser } from "@clerk/nextjs";
import { AlignLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

const CardDescription = ({
  card,
  refetch,
}: {
  card: any;
  refetch: () => void;
}) => {
  const [isForm, setIsForm] = useState(false);
  const [description, setDescription] = useState(card.description);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  useOnClickOutside(formRef, () => {
    setIsForm(false);
    setError(null);
  });

  useEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setIsForm(false);
      setError(null);
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (description.length < 3) {
      console.log(description.length);
      setError("Card description should have minimum of 3 characters");
      return;
    }
    setLoading(true);
    await updateCardDesciption({
      cardId: card._id,
      description,
      pathname,
      userId: user?.id,
      userImage: user?.imageUrl,
      username: user?.fullName,
    });
    setLoading(false);
    setError(null);
    refetch();
    toast.success(`Card "${card.title}" description updated`);
    setIsForm(false);
  };

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Description</p>

        {isForm === true ? (
          <form
            className="space-y-2 w-full"
            ref={formRef}
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <div className="space-y-2 w-full">
              <div className="space-y-1 w-full">
                <Textarea
                  disabled={loading}
                  ref={textAreaRef}
                  value={description}
                  className=" w-full my-2 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Add a more detailed description..."
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
                <div className="flex items-center gap-x-2 mt-2">
                  <Button type="submit">Save</Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    type="button"
                    onClick={() => {
                      setIsForm(false);
                      setError(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-xs font-medium mt-1">
                {error}
              </div>
            )}
          </form>
        ) : (
          <div
            onClick={(e) => {
              setIsForm(true);
              setTimeout(() => {
                textAreaRef.current?.focus();
              });
            }}
            className="min-h-[78px] bg-neutral-200 text-sm font-medium px-3 py-3.5  w-full rounded-md"
          >
            {card.description || "Add a more detailed description..."}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDescription;
