"use client";

import { useState } from "react";

export default function ProfileImageUploader({ initialImage }: { initialImage: string | null }) {
  const [image, setImage] = useState(initialImage);
  const [loading, setLoading] = useState(false);

  async function uploadImage(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData
      }
    );

    const cloudData = await uploadRes.json();

    const saveRes = await fetch("/api/profile/upload", {
      method: "POST",
      body: JSON.stringify({ imageUrl: cloudData.secure_url })
    });

    if (saveRes.ok) setImage(cloudData.secure_url);
    setLoading(false);
  }

  async function deleteImage() {
    setLoading(true);

    const res = await fetch("/api/profile/delete-image", { method: "POST" });
    if (res.ok) setImage(null);

    setLoading(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col items-center gap-3">
        {image ? (
          <img
            src={image}
            className="h-20 w-20 rounded-2xl object-cover ring-4 ring-slate-200 shadow-sm"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-200 text-slate-600">
            No photo
          </div>
        )}
      </div>

      <label className="inline-flex cursor-pointer items-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-sky-500">
        <input type="file" className="hidden" accept="image/*" onChange={uploadImage} />
        {loading ? "Uploading…" : "Upload image"}
      </label>

      {image && (
        <button
          onClick={deleteImage}
          disabled={loading}
          className="ml-2 inline-flex items-center rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-rose-500 disabled:opacity-50"
        >
          Delete
        </button>
      )}
    </div>
  );
}
