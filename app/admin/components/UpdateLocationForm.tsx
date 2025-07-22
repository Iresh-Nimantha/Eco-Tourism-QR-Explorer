import React, { useRef, useState } from "react";
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
  const [message, setMessage] = useState("");
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
    setMessage("");
    const fullUpdateObj: Location = { ...item, ...form };

    try {
      // 1. If new image, only delete the old file, NOT the Firestore doc!
      if (newImage) {
        // delete old file:
        await fetch("/api/delete-location", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: undefined, // don't delete doc!
            customFilename: item.customFilename,
          }),
        });
        // upload new image file
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

      // 2. Update Firestore doc in place! (id in body)
      const res = await fetch("/api/update-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullUpdateObj),
      });
      const result = await res.json();
      if (!result.success) throw new Error("Update failed.");

      setMessage("Updated!");
      onUpdate(fullUpdateObj);
      onClose();
    } catch (e: any) {
      setMessage("Update error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg">
        <form onSubmit={handleUpdate} className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">Edit Location</h3>
          <input
            type="text"
            name="locationName"
            className="border px-2 py-1"
            value={form.locationName}
            onChange={handleInput}
            required
          />
          <input
            type="text"
            name="tags"
            className="border px-2 py-1"
            value={form.tags}
            onChange={handleInput}
          />
          <textarea
            name="description"
            className="border px-2 py-1"
            value={form.description}
            onChange={handleInput}
          />
          <input
            type="text"
            name="credit"
            className="border px-2 py-1"
            value={form.credit}
            onChange={handleInput}
          />
          {previewUrl ? (
            <img src={previewUrl} alt="preview" className="w-48 h-32 rounded" />
          ) : form.customFilename ? (
            <img
              src={`/uploads/${form.customFilename}`}
              alt="current"
              className="w-48 h-32 rounded"
            />
          ) : null}
          <button
            type="button"
            className="border px-2 py-1 text-gray-500"
            onClick={() => imageInputRef.current?.click()}
            disabled={loading}
          >
            Change Image
          </button>
          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            className="hidden"
            onChange={handleImageSelect}
          />
          <div className="flex space-x-2 mt-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-1 rounded"
              disabled={loading}
            >
              {loading ? "Saving..." : "Update"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-1 rounded"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
          {message && <div className="text-red-500">{message}</div>}
        </form>
      </div>
    </div>
  );
}
