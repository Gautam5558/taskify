"use client";
import { fallbackImages } from "@/constants";
import { unsplash } from "@/lib/unsplash";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const FormPicker = ({ setImgData }: any) => {
  const [images, setImages] = useState<Record<string, any>[]>(fallbackImages);
  const [loading, setLoading] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState("");

  useEffect(() => {
    const fetching = async () => {
      try {
        setLoading(true);
        const data = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9,
        });
        setLoading(false);
        if (data && data.response) {
          const fetchedArrayOfImages = data.response as Record<string, any>[];
          setImages(fetchedArrayOfImages);
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetching();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image: Record<string, any>) => {
          return (
            <div
              key={image.id}
              className="cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted"
              onClick={(e) => {
                setSelectedImageId(image.id);
                setImgData(
                  `${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`
                );
              }}
            >
              <Image
                src={image?.urls?.thumb}
                alt="boardImg"
                className="object-cover rounded-sm"
                fill
              />
              {image.id === selectedImageId && (
                <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
              <Link
                href={image.links.html}
                target="_blank"
                className=" opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
              >
                {image.user.name}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormPicker;
