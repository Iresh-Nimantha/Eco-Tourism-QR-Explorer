import React, { useRef, useState } from "react";
import Swal from "sweetalert2";

type Location = {
  id: string;
  locationName: string;
  description: string;
  tags: string;
  credit: string;
  customFilename: string;
};

type UpdateLocationFormProps = {
  item: Location;
  onClose: () => void;
  onUpdate: (newItem: Location) => void;
};

export default function UpdateLocationForm({
  item,
  onClose,
  onUpdate,
}: UpdateLocationFormProps) {
  const [form, setForm] = useState<Location>({ ...item });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

  function handleInput(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setNewImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setForm({ ...form, customFilename: generateImageName(file) });
    } else {
      setPreviewUrl(null);
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fullUpdateObj: Location = { ...item, ...form };
    try {
      if (newImage) {
        await fetch("/api/delete-location", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: undefined,
            customFilename: item.customFilename,
          }),
        });
        const formData = new FormData();
        formData.append("file", newImage);
        formData.append("customFilename", fullUpdateObj.customFilename);
        const imgRes = await fetch("/api/adminupload", {
          method: "POST",
          body: formData,
        });
        const imgResult = await imgRes.json();
        if (!imgRes.ok || !imgResult.success)
          throw new Error("Image upload failed.");
      }
      const res = await fetch("/api/update-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullUpdateObj),
      });
      const result = await res.json();
      if (!result.success) throw new Error("Update failed.");
      await Swal.fire({
        title: "Location Updated!",
        text: "The location has been updated successfully.",
        icon: "success",
        confirmButtonColor: "#059669",
        background: "#fff",
        color: "#374151",
        customClass: { popup: "rounded-xl shadow-2xl" },
      });
      onUpdate(fullUpdateObj);
      onClose();
    } catch (e: any) {
      await Swal.fire({
        title: "Update failed",
        text: e?.message || "Could not update location.",
        icon: "error",
        confirmButtonColor: "#DC2626",
        background: "#fff",
        color: "#374151",
        customClass: { popup: "rounded-xl shadow-2xl" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md lg:max-w-5xl xl:max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden mx-auto border border-gray-100 flex flex-col">
      {/* Header */}
      <div className=" px-6 py-4 sm:px-8 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-green-500">
              Edit Location
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            disabled={loading}
          >
            <svg
              className="w-5 h-5 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              Edit Location
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-gray-100 hover:scrollbar-thumb-green-400">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Column - Form Fields */}
            <div className="lg:col-span-7 space-y-6">
              {/* Location Name */}
              <div>
                <label className="flex items-center text-gray-700 font-semibold mb-3 text-base">
                  <svg
                    className="w-4 h-4 mr-2 text-green-600"
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
                  Location Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="locationName"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  value={form.locationName}
                  onChange={handleInput}
                  placeholder="Enter location name"
                  required
                  disabled={loading}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="flex items-center text-gray-700 font-semibold mb-3 text-base">
                  <svg
                    className="w-4 h-4 mr-2 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  value={form.tags}
                  onChange={handleInput}
                  placeholder="restaurant, park, museum"
                  disabled={loading}
                />
              </div>

              {/* Photo Credit */}
              <div>
                <label className="flex items-center text-gray-700 font-semibold mb-3 text-base">
                  <svg
                    className="w-4 h-4 mr-2 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Photo Credit
                  <span className="text-gray-400 text-sm ml-2">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="credit"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  value={form.credit}
                  onChange={handleInput}
                  placeholder="Photo by John Doe"
                  disabled={loading}
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center text-gray-700 font-semibold mb-3 text-base">
                  <svg
                    className="w-4 h-4 mr-2 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all duration-200 resize-none bg-gray-50 focus:bg-white"
                  value={form.description}
                  onChange={handleInput}
                  placeholder="Describe this location..."
                  disabled={loading}
                />
              </div>
            </div>

            {/* Right Column - Image Section */}
            <div className="lg:col-span-5">
              <div className="bg-gray-50 rounded-2xl p-6 h-full min-h-[400px] flex flex-col">
                <label className="flex items-center text-gray-700 font-semibold mb-4 text-base">
                  <svg
                    className="w-4 h-4 mr-2 text-green-600"
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
                  Image Preview
                </label>

                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-full max-w-xs lg:max-w-none">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="preview"
                        className="w-full h-48 lg:h-64 rounded-xl object-cover border-2 border-white shadow-lg"
                      />
                    ) : form.customFilename ? (
                      <img
                        src={`/uploads/${form.customFilename}`}
                        alt="current"
                        className="w-full h-48 lg:h-64 rounded-xl object-cover border-2 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-48 lg:h-64 flex flex-col items-center justify-center rounded-xl bg-white border-2 border-dashed border-gray-300 text-gray-400">
                        <svg
                          className="w-12 h-12 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-sm font-medium">No image selected</p>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="mt-4 inline-flex items-center px-4 py-2 border-2 border-green-300 rounded-lg text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200 font-medium"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={loading}
                  >
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
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    {previewUrl || form.customFilename
                      ? "Change Image"
                      : "Upload Image"}
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={imageInputRef}
                    className="hidden"
                    onChange={handleImageSelect}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:px-8 sm:py-6">
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-3 space-y-reverse sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200 font-semibold"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-200 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
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
                  Updating...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Update Location
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
