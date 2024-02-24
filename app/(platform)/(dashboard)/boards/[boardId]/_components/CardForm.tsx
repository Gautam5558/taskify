"use client";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import React, { forwardRef, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { usePathname } from "next/navigation";
import { createCard } from "@/lib/actions/card.action";
import { toast } from "sonner";

interface Props {
  isCardForm: boolean;
  clickingAddCardButton: () => void;
  clickingCloseCardFormButton: () => void;
  listId: string;
}

const CardForm = forwardRef<HTMLTextAreaElement, Props>(
  (
    { isCardForm, clickingAddCardButton, clickingCloseCardFormButton, listId },
    ref
  ) => {
    const formRef = useRef<HTMLFormElement>(null);
    useOnClickOutside(formRef, () => {
      clickingCloseCardFormButton();
      setError(null);
    });

    useEventListener("keydown", (e) => {
      if (e.key == "Escape") {
        clickingCloseCardFormButton();
        setError(null);
      }
    });

    const [cardTitle, setCardTitle] = useState("");
    const [error, setError] = useState<string | null>(null);
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);

    const handleCreateCard = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (cardTitle.length < 3) {
        setError("Card Title shold have minimum 3 characters");
      }
      setLoading(true);
      await createCard({ listId, title: cardTitle, pathname });
      setLoading(false);
      toast.success(`Card ${cardTitle} created`);
      setCardTitle("");
    };

    if (isCardForm) {
      return (
        <form
          className="m-1 py-0.5 px-1 space-y-4"
          ref={formRef}
          onSubmit={(e) => {
            handleCreateCard(e);
          }}
        >
          <div className="apsce-y-2 w-full">
            <div className="space-y-1 w-full">
              <Textarea
                ref={ref}
                value={cardTitle}
                className="resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm"
                placeholder="Enter a title for this card..."
                onChange={(e) => {
                  setCardTitle(e.target.value);
                }}
              />
            </div>
          </div>
          {error && (
            <div className="text-[10px] text-red-500 text-center">{error}</div>
          )}
          <div className="flex items-center gap-x-1">
            <Button
              disabled={loading}
              type="submit"
              className="disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add Card
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                clickingCloseCardFormButton();
                setError(null);
              }}
            >
              <X className="h-4 w-4 " />
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div className="pt-2 px-2">
        <Button
          className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
          size="sm"
          variant="ghost"
          onClick={() => {
            clickingAddCardButton();
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a card
        </Button>
      </div>
    );
  }
);

CardForm.displayName = "CardForm";

export default CardForm;
