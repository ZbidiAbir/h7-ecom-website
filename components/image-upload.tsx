"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "./ui/button";
interface ImageUploadProps {
  disabled?: boolean;

  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSuccess = (result: any) => {
    const url = result.info.secure_url;
    // Ajouter seulement si l'image n'existe pas déjà
    if (!value.includes(url)) {
      onChange(url);
    }
  };

  console.log("URLs", value);

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] border rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant={"destructive"}
                size={"icon"}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover fill" alt="Image" src={url} />
          </div>
        ))}
      </div>
      {/* Exemple bouton upload pour tester */}
      <CldUploadWidget
        onSuccess={onSuccess}
        uploadPreset="h7preset"
        options={{
          maxFileSize: 5 * 1024 * 1024,
          clientAllowedFormats: ["jpg", "png", "webp"],
        }}
      >
        {({ open }) => (
          <Button
            className="cursor-pointer"
            type="button"
            disabled={disabled}
            variant={"secondary"}
            onClick={() => open()}
          >
            <ImagePlus className="h-4 w-4 mr-2" /> Upload Image
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
