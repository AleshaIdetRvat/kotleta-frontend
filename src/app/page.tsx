"use client";
import { useState } from "react";

import AttachFile from "@/components/AttachFile";
import { ImageContainer } from "@/components/ImageContainer";
import { fileToDataUrl } from "@/utils/fileToDataUrl";

export default function Home() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const handleFileChange = async (file: File | null) => {
        if (!file) return;

        const fileUlr = await fileToDataUrl(file);
        setImageFile(file);
        setImageSrc(fileUlr);
    };

    return (
        <main className="flex min-h-screen flex-col items-center gap-6 py-8 px-2">
            <h1 className="font-semibold text-xl">Обнаружение карьеров на фото</h1>

            <AttachFile
                multiple={false}
                accept=".png,.jpg,.jpeg"
                onChange={(file) => handleFileChange(file as any)}
            />

            <ImageContainer imageName={imageFile?.name} imageSrc={imageSrc} />

            {/*<button className="text-white transition-all px-4 py-2 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 rounded-full">
                Save changes
            </button>*/}
        </main>
    );
}
