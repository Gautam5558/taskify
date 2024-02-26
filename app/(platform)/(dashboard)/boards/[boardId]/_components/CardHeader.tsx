"use client";
import { updateCardtitle } from "@/lib/actions/card.action";
import { useUser } from "@clerk/nextjs";
import { Layout } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

const CardHeader = ({ card, listName }: { card: any; listName: string }) => {
  const [title, setTitle] = useState(card.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.length < 3) {
      return setError("Card title should have minimum of 3 characters");
    }

    setLoading(true);
    await updateCardtitle({
      cardId: card._id,
      title,
      pathname,
      userId: user?.id,
      userImage: user?.imageUrl,
      username: user?.fullName,
    });
    setLoading(false);
    toast.success("Card title updated to " + title);
    setError(null);
  };

  return (
    <div className="flex items-start  gap-x-3 mb-6 w-full">
      <Layout className="h-5 w-5 text-neutral-700 mt-3" />
      <div className="w-full mt-2">
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            onClick={(e) => {
              inputRef.current?.focus();
            }}
            disabled={loading}
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="font-semibold rounded-[4px] w-full text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 focus-visible:bg-white focus-visible:border-input mb-0.5 truncate disabled:opacity-60 disabled:cursor-not-allowed"
          />
          <p className="text-sm text-muted-foreground">
            in list <span className="underline">{listName}</span>
          </p>
          {error && (
            <div className="text-red-500 text-xs font-medium mt-1">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CardHeader;
