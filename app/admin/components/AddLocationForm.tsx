"use client";
import React, { useRef, useState } from "react";
import { addLocationToFirebase } from "../../firebase/firestoreService"; // adjust import!
import Swal from "sweetalert2";

type FormState = {
  locationName: string;
  tags: string;
  description: string;
  credit: string;
};

export default function AddLocationForm({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: () => void;
}) {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [generatedName, setGeneratedName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [form, setForm] = useState<FormState>({
    locationName: "",
    tags: "",
    description: "",
    credit: "",
  });
  const imageInputRef = useRef<HTMLInputElement>(null);

  function generateImageName(file: File) {
    const ext = file.name.split(".").pop() || "png";
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hour = pad(now.getHours());
    const min = pad(now.getMinutes());
    const sec = pad(now.getSeconds());
    const rand = Math.floor(Math.random() * 10000);
    return `image_${year}${month}${day}_${hour}${min}${sec}_${rand}.${ext}`;
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleFileChange = (file: File | null) => {
    setImage(file);
    if (file) {
      const newName = generateImageName(file);
      setGeneratedName(newName);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setGeneratedName("");
      setImagePreview("");
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !generatedName) {
      Swal.fire({
        title: "Missing Image",
        text: "Please select or upload an image.",
        icon: "warning",
        confirmButtonColor: "#059669",
        background: "#fff",
        color: "#374151",
        customClass: { popup: "rounded-xl shadow-2xl" },
      });
      return;
    }
    setLoading(true);
    try {
      // 1. Upload the image file
      const formData = new FormData();
      formData.append("file", image);
      formData.append("customFilename", generatedName);
      const imgRes = await fetch("/api/adminupload", {
        method: "POST",
        body: formData,
      });
      const imgResult = await imgRes.json();
      if (!imgRes.ok || !imgResult.success)
        throw new Error(
          "Image upload failed: " + (imgResult.error || imgRes.statusText)
        );
      // 2. Save metadata to Firestore
      const locationDoc = {
        locationName: form.locationName,
        description: form.description,
        customFilename: generatedName,
        credit: form.credit,
        tags: form.tags,
      };
      await addLocationToFirebase(locationDoc);
      await Swal.fire({
        title: "Location Added!",
        text: "Location and image uploaded successfully!",
        icon: "success",
        confirmButtonColor: "#059669",
        background: "#fff",
        color: "#374151",
        customClass: { popup: "rounded-xl shadow-2xl" },
      });
      setImage(null);
      setImagePreview("");
      setGeneratedName("");
      setForm({ locationName: "", tags: "", description: "", credit: "" });
      if (imageInputRef.current) imageInputRef.current.value = "";
      onAdd();
      onClose();
    } catch (error: any) {
      await Swal.fire({
        title: "Error",
        text: error?.message || "Error uploading file.",
        icon: "error",
        confirmButtonColor: "#DC2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-green-200/30 to-emerald-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      {/* Main Form */}
      <div className="relative w-full h-full z-10">
        <form
          className="w-full h-full max-w-4xl mx-auto p-4 sm:p-8 lg:p-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7 overflow-y-auto font-sans"
          onSubmit={onSubmit}
        >
          {/* Left */}
          <div className="flex flex-col gap-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-green-700 mb-2 text-center md:text-left">
              Add Location
            </h3>
            <div>
              <label className="text-green-900 font-semibold block mb-2 text-base sm:text-lg">
                Location Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="locationName"
                value={form.locationName}
                onChange={handleInput}
                className="w-full border-2 border-green-200 rounded-lg px-4 py-3 text-base sm:text-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 transition"
                placeholder="Location Name"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-green-900 font-semibold block mb-2 text-base sm:text-lg">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleInput}
                className="w-full border-2 border-green-200 rounded-lg px-4 py-3 text-base sm:text-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 transition"
                placeholder="Tags, e.g. restaurant, park"
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-green-900 font-semibold block mb-2 text-base sm:text-lg">
                Photo Credit (Optional)
              </label>
              <input
                type="text"
                name="credit"
                value={form.credit}
                onChange={handleInput}
                className="w-full border-2 border-green-200 rounded-lg px-4 py-3 text-base sm:text-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 transition"
                placeholder="Photo by John Doe"
                disabled={loading}
              />
            </div>
          </div>
          {/* Right */}
          <div className="flex flex-col gap-7">
            <div>
              <label className="text-green-900 font-semibold block mb-2 text-base sm:text-lg">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInput}
                className="w-full min-h-[100px] border-2 border-green-200 rounded-lg px-4 py-3 text-base sm:text-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 transition resize-none"
                placeholder="Description"
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-green-900 font-semibold block mb-2 text-base sm:text-lg">
                Image Upload <span className="text-red-500">*</span>
              </label>
              <div
                className={`
                  relative border-2 border-dashed rounded-2xl transition
                  ${
                    dragActive
                      ? "border-emerald-400 bg-emerald-50/80 shadow-2xl scale-[1.02]"
                      : image
                      ? "border-emerald-300 bg-emerald-50/50 shadow-lg"
                      : "border-slate-300 bg-slate-50/85 hover:border-emerald-400 hover:bg-emerald-50/40 hover:shadow-lg"
                  }
                  flex flex-col items-center cursor-pointer group
                `}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => imageInputRef.current?.click()}
                style={{ minHeight: 160 }}
              >
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                  disabled={loading}
                />

                <div className="py-8 px-4 w-full flex flex-col items-center text-center">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto w-40 h-32 rounded-xl border border-green-200 object-cover shadow-lg"
                      />
                      <div className="font-bold text-slate-800 text-base">
                        {image?.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        Saved as:{" "}
                        <span className="font-mono">{generatedName}</span>
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        Click or drop to change photo
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-14 h-14 mx-auto bg-gradient-to-tr from-green-100 to-emerald-200 rounded-xl flex items-center justify-center mb-3">
                        <svg
                          className="w-8 h-8 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="font-bold text-slate-800">
                        Drag and drop a photo here
                      </div>
                      <div className="text-sm text-green-700 font-medium">
                        or <span className="underline">click to browse</span>
                      </div>
                      <div className="text-xs text-slate-400">
                        JPG, PNG, WebP. Max 10MB.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Button Row */}
            <div className="flex flex-col sm:flex-row gap-3 mt-1">
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl px-6 sm:px-8 py-3 sm:py-4 font-bold text-base sm:text-lg shadow-lg transition hover:scale-105 focus:ring-2 focus:ring-green-100 focus:outline-none disabled:opacity-60"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-6 w-6 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Add Location"
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto flex items-center justify-center bg-white border-2 border-green-300 text-green-700 rounded-xl px-6 sm:px-8 py-3 sm:py-4 font-bold text-base sm:text-lg shadow hover:bg-green-50 focus:ring-2 focus:ring-green-100 focus:outline-none transition"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
