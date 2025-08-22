import React from "react";

interface FileOptionsProps {
    showFileOptions: boolean;
    setShowFileOptions: (val: boolean) => void;
    imageInputRef: React.RefObject<HTMLInputElement | null>;
    pdfInputRef: React.RefObject<HTMLInputElement | null>;
    videoInputRef: React.RefObject<HTMLInputElement | null>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "pdf" | "video") => void;
}

const FileOptions: React.FC<FileOptionsProps> = ({
    showFileOptions,
    setShowFileOptions,
    imageInputRef,
    pdfInputRef,
    videoInputRef,
    handleFileChange,
}) => (
    <div className="relative">
        <button
            type="button"
            className="p-2 text-xl"
            onClick={() => setShowFileOptions(!showFileOptions)}
            title="Adjuntar archivo"
        >
            <span role="img" aria-label="plus">＋</span>
        </button>
        {showFileOptions && (
            <div className="absolute right-0 bottom-full mb-2 bg-white dark:bg-gray-800 shadow-lg rounded p-2 flex flex-col gap-2 z-10">
                <button
                    type="button"
                    className="px-2 py-1 text-sm hover:bg-accent rounded"
                    onClick={() => imageInputRef.current?.click()}
                >Subir imagen</button>
                <button
                    type="button"
                    className="px-2 py-1 text-sm hover:bg-accent rounded"
                    onClick={() => pdfInputRef.current?.click()}
                >Subir PDF</button>
                <button
                    type="button"
                    className="px-2 py-1 text-sm hover:bg-accent rounded"
                    onClick={() => videoInputRef.current?.click()}
                >Subir video</button>
            </div>
        )}
        <input
            type="file"
            ref={imageInputRef}
            style={{ display: "none" }}
            accept="image/jpeg,image/png"
            onChange={e => handleFileChange(e, "image")}
        />
        <input
            type="file"
            ref={pdfInputRef}
            style={{ display: "none" }}
            accept="application/pdf"
            onChange={e => handleFileChange(e, "pdf")}
        />
        <input
            type="file"
            ref={videoInputRef}
            style={{ display: "none" }}
            accept="video/mp4"
            onChange={e => handleFileChange(e, "video")}
        />
    </div>
);

export default FileOptions;
