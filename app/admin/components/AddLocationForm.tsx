"use client";
import { useRef, useState } from "react";
import { addLocationToFirebase } from "../../firebase/firestoreService"; // adjust import path as needed
import HeaderNav from "./HeaderNav";

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
  onAdd?: () => void;
}) {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [generatedName, setGeneratedName] = useState<string>("");
  const [message, setMessage] = useState("");
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

  const handleImageSelect = (file: File) => {
    setImage(file);
    if (file) {
      const newName = generateImageName(file);
      setGeneratedName(newName);
      setMessage(`Selected: ${file.name} ➔ Will be saved as: ${newName}`);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setGeneratedName("");
      setMessage("");
      setImagePreview("");
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        handleImageSelect(file);
      }
    }
  };

  // SweetAlert2 integration for success/error messages
  const showAlert = (
    type: "success" | "error",
    title: string,
    text: string
  ) => {
    if (typeof window !== "undefined" && (window as any).Swal) {
      (window as any).Swal.fire({
        icon: type,
        title: title,
        text: text,
        confirmButtonColor: type === "success" ? "#059669" : "#DC2626",
        background: "#ffffff",
        color: "#374151",
        showConfirmButton: false,
        timer: type === "success" ? 3000 : undefined,
        timerProgressBar: true,
      });
    }
  };

  const onSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setMessage("");

    if (!image || !generatedName) {
      setMessage("Please select an image.");
      showAlert("error", "Missing Image", "Please select an image to upload.");
      return;
    }

    if (!form.locationName.trim()) {
      showAlert("error", "Missing Information", "Location name is required.");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload the image file to /api/adminupload (saves to /public/uploads)
      const formData = new FormData();
      formData.append("file", image);
      formData.append("customFilename", generatedName);

      const imgRes = await fetch("/api/adminupload", {
        method: "POST",
        body: formData,
      });
      const imgResult = await imgRes.json();

      if (!imgRes.ok || !imgResult.success) {
        const errorMsg =
          "Image upload failed: " + (imgResult.error || imgRes.statusText);
        setMessage(errorMsg);
        showAlert("error", "Upload Failed", errorMsg);
        setLoading(false);
        return;
      }

      // 2. After successful image upload, save metadata to Firestore
      const locationDoc = {
        locationName: form.locationName,
        description: form.description,
        customFilename: generatedName,
        credit: form.credit,
        tags: form.tags,
      };
      await addLocationToFirebase(locationDoc);

      setMessage("Location and image uploaded successfully!");
      showAlert(
        "success",
        "Success!",
        "Location and image uploaded successfully!"
      );

      // Reset form
      setImage(null);
      setImagePreview("");
      setGeneratedName("");
      setForm({ locationName: "", tags: "", description: "", credit: "" });
      if (imageInputRef.current) imageInputRef.current.value = "";

      // Call onAdd callback if provided
      setTimeout(() => {
        if (onAdd) onAdd();
        onClose();
      }, 1500);
    } catch (error) {
      const errorMsg = "Error uploading file.";
      setMessage(errorMsg);
      showAlert("error", "Error", errorMsg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");
    setGeneratedName("");
    setMessage("");
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
      {/* SweetAlert2 CDN */}
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

      {/* Header with Close Button */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Add New Location
            </h2>
            <p className="text-sm text-gray-600">
              Share a beautiful place with the world
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={onSubmit} className="p-6 space-y-6 max-w-2xl mx-auto">
          {/* Image Upload Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-green-200 shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-green-600"
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
              Upload Image
            </h3>

            {!imagePreview ? (
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-green-400 hover:bg-green-50/50"
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop your image here, or{" "}
                  <span
                    className="text-green-600 hover:text-green-700 cursor-pointer underline"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    browse
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Supports JPG, PNG, and other image formats
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                {generatedName && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">Generated filename:</span>{" "}
                      {generatedName}
                    </p>
                  </div>
                )}
              </div>
            )}

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* Form Fields */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-green-200 shadow-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Location Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Name *
              </label>
              <input
                type="text"
                name="locationName"
                value={form.locationName}
                onChange={handleInput}
                required
                placeholder="Enter the location name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white/80"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleInput}
                placeholder="beach, sunset, nature (comma-separated)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white/80"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInput}
                rows={4}
                placeholder="Describe this beautiful location..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none bg-white/80"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo Credit
              </label>
              <input
                type="text"
                name="credit"
                value={form.credit}
                onChange={handleInput}
                placeholder="Photographer name or source..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white/80"
              />
            </div>
          </div>

          {/* Status Message */}
          {message && (
            <div
              className={`p-4 rounded-xl border ${
                message.includes("successfully")
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !image || !form.locationName.trim()}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Location
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
